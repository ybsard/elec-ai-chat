import { createServer } from "node:http";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createHmac, randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(__dirname, "public");
const dataDir = join(__dirname, "data");
const usersFile = join(dataDir, "users.json");
const port = Number(process.env.PORT || 3000);
const freeDailyLimit = Number(process.env.FREE_DAILY_LIMIT || 10);
const anonDailyLimit = Number(process.env.ANON_DAILY_LIMIT || 5);
const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const supabaseServiceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
const supabaseStateTable = String(process.env.SUPABASE_STATE_TABLE || "app_state");
const supabaseStorageMode = String(process.env.SUPABASE_STORAGE_MODE || "state").trim().toLowerCase();
const userStoreKey = "voltia_user_store";
const sessionDays = 30;
const anonymousUsage = new Map();
const rateLimitBuckets = new Map();
const openaiDefaultModel = "gpt-5.5";
const openaiReasoningEfforts = new Set(["none", "low", "medium", "high", "xhigh"]);
const openaiVerbosities = new Set(["low", "medium", "high"]);
const maxJsonBodyBytes = positiveNumber(process.env.MAX_JSON_BODY_BYTES, 1_200_000);
const maxImageJsonBodyBytes = positiveNumber(process.env.MAX_IMAGE_JSON_BODY_BYTES, 9_000_000);
const maxStripeBodyBytes = positiveNumber(process.env.MAX_STRIPE_BODY_BYTES, 1_000_000);
const maxDataImageBytes = positiveNumber(process.env.MAX_DATA_IMAGE_BYTES, 6_500_000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function normalizeSupabaseUrl(rawUrl) {
  return String(rawUrl || "")
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

function normalizeOpenAIOption(value, allowed, fallback) {
  const normalized = String(value || "").trim().toLowerCase();
  return allowed.has(normalized) ? normalized : fallback;
}

function positiveNumber(value, fallback) {
  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
}

function getOpenAIModel() {
  const configuredModel = String(process.env.OPENAI_MODEL || "").trim();
  return configuredModel && configuredModel !== "gpt-4.1-mini" ? configuredModel : openaiDefaultModel;
}

function getOpenAISearchModel() {
  const configuredModel = String(process.env.OPENAI_SEARCH_MODEL || "").trim();
  return configuredModel && configuredModel !== "gpt-4.1-mini" ? configuredModel : getOpenAIModel();
}

function supportsGpt5Controls(model) {
  return String(model || "").trim().toLowerCase().startsWith("gpt-5");
}

function openAIQualityOptions(model, { expert = false, verbosity = "medium" } = {}) {
  if (!supportsGpt5Controls(model)) return {};

  const effort = normalizeOpenAIOption(
    process.env[expert ? "OPENAI_EXPERT_REASONING_EFFORT" : "OPENAI_REASONING_EFFORT"],
    openaiReasoningEfforts,
    expert ? "high" : "medium"
  );
  const textVerbosity = normalizeOpenAIOption(
    process.env.OPENAI_TEXT_VERBOSITY || verbosity,
    openaiVerbosities,
    verbosity
  );

  return {
    reasoning: { effort },
    text: { verbosity: textVerbosity }
  };
}

function clearAnswerInstructions(task = "la question posée") {
  return [
    `Contrat de qualité: commence toujours par une section "Réponse directe" qui répond exactement à ${task} en 2 à 5 phrases.`,
    "Ne remplace pas la réponse par des généralités, une prévention vague ou un plan hors sujet. Traite les mots exacts de l'utilisateur, puis détaille seulement ce qui aide à décider ou agir.",
    "Si plusieurs interprétations sont possibles, donne l'hypothèse la plus probable, puis les alternatives à vérifier. Si une information manque, explique en quoi elle change la conclusion.",
    "La réponse doit être claire, qualifiée et exploitable: conclusion, raisonnement utile, limites, niveau de confiance si nécessaire, puis prochaine action concrète."
  ];
}

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...securityHeaders() });
  res.end(JSON.stringify(body));
}

function sendJsonWithHeaders(res, status, body, headers = {}) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8", ...securityHeaders(), ...headers });
  res.end(JSON.stringify(body));
}

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name || "",
    email: user.email,
    plan: user.plan || "free",
    subscriptionStatus: user.subscriptionStatus || "free",
    reportCount: Array.isArray(user.reports) ? user.reports.length : 0,
    projectCount: Array.isArray(user.projects) ? user.projects.length : 0,
    usageToday: user.usage?.date === todayKey() ? user.usage.count : 0,
    freeDailyLimit
  };
}

function parseCookies(req) {
  return Object.fromEntries(
    String(req.headers.cookie || "")
      .split(";")
      .map((part) => part.trim())
      .filter(Boolean)
      .map((part) => {
        const index = part.indexOf("=");
        return index === -1 ? [part, ""] : [part.slice(0, index), decodeURIComponent(part.slice(index + 1))];
      })
  );
}

function isSecureRequest(req) {
  const forwardedProto = String(req.headers["x-forwarded-proto"] || "").split(",")[0].trim();
  const host = String(req.headers.host || "");
  return forwardedProto === "https" || (!host.includes("localhost") && !host.startsWith("127.0.0.1"));
}

function cookieSecurity(req) {
  return isSecureRequest(req) ? "; Secure" : "";
}

function sessionCookie(req, token) {
  const maxAge = sessionDays * 24 * 60 * 60;
  return `elec_session=${encodeURIComponent(token)}; Path=/; Max-Age=${maxAge}; SameSite=Lax; HttpOnly${cookieSecurity(req)}`;
}

function clearSessionCookie(req) {
  return `elec_session=; Path=/; Max-Age=0; SameSite=Lax; HttpOnly${cookieSecurity(req)}`;
}

function securityHeaders() {
  const contentSecurityPolicy = [
    "default-src 'self'",
    "script-src 'self'",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data:",
    "font-src 'self'",
    "connect-src 'self'",
    "base-uri 'self'",
    "form-action 'self' https://checkout.stripe.com",
    "frame-ancestors 'self'"
  ].join("; ");

  return {
    "Content-Security-Policy": contentSecurityPolicy,
    "X-Content-Type-Options": "nosniff",
    "Referrer-Policy": "strict-origin-when-cross-origin",
    "X-Frame-Options": "SAMEORIGIN",
    "Permissions-Policy": "camera=(), microphone=(), geolocation=()"
  };
}

function emptyUserStore() {
  return { users: [], sessions: {} };
}

function isSupabaseConfigured() {
  return Boolean(supabaseUrl && supabaseServiceRoleKey);
}

function normalizeUserStore(store) {
  return {
    users: Array.isArray(store?.users) ? store.users : [],
    sessions: store?.sessions && typeof store.sessions === "object" ? store.sessions : {}
  };
}

async function fetchSupabaseState() {
  const response = await fetch(
    `${supabaseUrl}/rest/v1/${encodeURIComponent(supabaseStateTable)}?key=eq.${encodeURIComponent(userStoreKey)}&select=value`,
    {
      headers: {
        apikey: supabaseServiceRoleKey,
        Authorization: `Bearer ${supabaseServiceRoleKey}`,
        Accept: "application/json"
      }
    }
  );

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase lecture impossible: ${text || response.status}`);
  }

  const rows = await response.json();
  return normalizeUserStore(rows?.[0]?.value || emptyUserStore());
}

async function saveSupabaseState(store) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${encodeURIComponent(supabaseStateTable)}`, {
    method: "POST",
    headers: {
      apikey: supabaseServiceRoleKey,
      Authorization: `Bearer ${supabaseServiceRoleKey}`,
      "Content-Type": "application/json",
      Prefer: "resolution=merge-duplicates"
    },
    body: JSON.stringify({
      key: userStoreKey,
      value: normalizeUserStore(store),
      updated_at: new Date().toISOString()
    })
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`Supabase sauvegarde impossible: ${text || response.status}`);
  }
}

async function loadUserStore() {
  if (isSupabaseConfigured()) {
    return fetchSupabaseState();
  }

  try {
    return normalizeUserStore(JSON.parse(await readFile(usersFile, "utf8")));
  } catch {
    return emptyUserStore();
  }
}

async function saveUserStore(store) {
  if (isSupabaseConfigured()) {
    await saveSupabaseState(store);
    return;
  }

  await mkdir(dataDir, { recursive: true });
  await writeFile(usersFile, JSON.stringify(normalizeUserStore(store), null, 2), "utf8");
}

function hashPassword(password) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 64).toString("hex");
  return `${salt}:${hash}`;
}

function verifyPassword(password, storedHash) {
  const [salt, hash] = String(storedHash || "").split(":");
  if (!salt || !hash) return false;
  const candidate = Buffer.from(scryptSync(password, salt, 64).toString("hex"), "hex");
  const expected = Buffer.from(hash, "hex");
  return expected.length === candidate.length && timingSafeEqual(expected, candidate);
}

function normalizeEmail(email) {
  return String(email || "").trim().toLowerCase();
}

function isProUser(user) {
  return user?.plan === "pro" && ["active", "trialing"].includes(user.subscriptionStatus || "");
}

async function getSessionUser(req, store = null) {
  const activeStore = store || await loadUserStore();
  const token = parseCookies(req).elec_session;
  const session = token ? activeStore.sessions[token] : null;
  if (!session) return { store: activeStore, token: "", user: null };

  if (session.expiresAt && new Date(session.expiresAt).getTime() < Date.now()) {
    delete activeStore.sessions[token];
    await saveUserStore(activeStore);
    return { store: activeStore, token: "", user: null };
  }

  if (session.accessPass) {
    return { store: activeStore, token, user: null, accessPass: true, accessName: session.name || "Accès invité" };
  }

  const user = activeStore.users.find((item) => item.id === session.userId) || null;
  return { store: activeStore, token, user, accessPass: false };
}

function getClientKey(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "anonymous";
}

function getRequestPath(req) {
  return String(req.url || "").split("?")[0] || "/";
}

function requestOriginAllowed(req) {
  const method = String(req.method || "GET").toUpperCase();
  const path = getRequestPath(req);
  if (method === "GET" || method === "HEAD" || method === "OPTIONS" || path === "/api/stripe-webhook") {
    return true;
  }

  const origin = String(req.headers.origin || "").trim();
  if (!origin) return true;

  const host = String(req.headers.host || "").trim();
  const protocol = isSecureRequest(req) ? "https" : "http";
  const sameOrigin = `${protocol}://${host}`;
  const configuredOrigins = String(process.env.APP_ORIGIN || process.env.PUBLIC_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  return new Set([sameOrigin, ...configuredOrigins]).has(origin);
}

function consumeRateLimit(req, scope, { limit, windowMs }) {
  const now = Date.now();
  const key = `${scope}:${getClientKey(req)}`;
  const current = rateLimitBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateLimitBuckets.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfter: 0 };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      remaining: 0,
      retryAfter: Math.max(1, Math.ceil((current.resetAt - now) / 1000))
    };
  }

  current.count += 1;
  return {
    allowed: true,
    remaining: Math.max(0, limit - current.count),
    retryAfter: 0
  };
}

function requireRateLimit(req, res, scope, options) {
  const result = consumeRateLimit(req, scope, options);
  if (result.allowed) return true;

  sendJsonWithHeaders(
    res,
    429,
    { error: options.message || "Trop de tentatives. Attends un peu avant de recommencer." },
    { "Retry-After": String(result.retryAfter) }
  );
  return false;
}

function sendError(res, error, fallback = "Erreur serveur.") {
  const status = Number(error?.statusCode || error?.status || 500);
  sendJson(res, status >= 400 && status < 600 ? status : 500, {
    error: error?.message || fallback
  });
}

async function consumeUsage(req, res, feature) {
  const auth = await getSessionUser(req);
  const date = todayKey();

  if (isProUser(auth.user)) {
    return { allowed: true, user: auth.user };
  }

  if (auth.accessPass) {
    return { allowed: true, user: null };
  }

  if (auth.user) {
    if (!auth.user.usage || auth.user.usage.date !== date) {
      auth.user.usage = { date, count: 0 };
    }
    if (auth.user.usage.count >= freeDailyLimit) {
      sendJson(res, 402, {
        error: `Limite gratuite atteinte (${freeDailyLimit} utilisations aujourd'hui). Passe en Pro pour continuer.`,
        upgradeRequired: true
      });
      return { allowed: false, user: auth.user };
    }
    auth.user.usage.count += 1;
    auth.user.lastFeature = feature;
    await saveUserStore(auth.store);
    return { allowed: true, user: auth.user };
  }

  const key = `${date}:${getClientKey(req)}`;
  const current = anonymousUsage.get(key) || 0;
  if (current >= anonDailyLimit) {
    sendJson(res, 402, {
      error: `Limite libre-service atteinte (${anonDailyLimit} essais gratuits aujourd'hui). Crée un compte gratuit pour continuer.`,
      signupRequired: true
    });
    return { allowed: false, user: null };
  }
  anonymousUsage.set(key, current + 1);
  return { allowed: true, user: null };
}

function extractResponseText(data) {
  if (typeof data.output_text === "string" && data.output_text.trim()) {
    return data.output_text.trim();
  }

  const parts = [];
  for (const item of data.output || []) {
    for (const content of item.content || []) {
      if (content.type === "output_text" && content.text) {
        parts.push(content.text);
      }
      if (content.type === "text" && content.text) {
        parts.push(content.text);
      }
    }
  }

  return parts.join("\n").trim();
}

async function readLimitedBody(req, limitBytes) {
  const chunks = [];
  let totalBytes = 0;
  for await (const chunk of req) {
    totalBytes += chunk.length;
    if (totalBytes > limitBytes) {
      const error = new Error("Requête trop volumineuse.");
      error.statusCode = 413;
      throw error;
    }
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
}

async function readRequestJson(req, { limitBytes = maxJsonBodyBytes } = {}) {
  const rawBody = await readLimitedBody(req, limitBytes);
  try {
    return JSON.parse(rawBody.toString("utf8") || "{}");
  } catch {
    const error = new Error("JSON de requête invalide.");
    error.statusCode = 400;
    throw error;
  }
}

async function readUpstreamJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      error: {
        message: text || "Réponse OpenAI illisible."
      }
    };
  }
}

function normalizeSourceUrl(rawUrl) {
  let url;
  try {
    url = new URL(String(rawUrl || "").trim());
  } catch {
    throw new Error("URL de source invalide. Colle une adresse complete qui commence par https://");
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    throw new Error("La source doit être une URL web en http ou https.");
  }

  if (url.username || url.password) {
    throw new Error("La source ne doit pas contenir d'identifiant ou de mot de passe.");
  }

  const hostname = url.hostname.toLowerCase();
  const blockedHosts = ["localhost", "127.0.0.1", "0.0.0.0", "::1"];
  const blockedPrefixes = ["10.", "192.168.", "169.254."];
  const private172 = /^172\.(1[6-9]|2\d|3[0-1])\./;
  if (blockedHosts.includes(hostname) || blockedPrefixes.some((prefix) => hostname.startsWith(prefix)) || private172.test(hostname)) {
    throw new Error("Cette adresse n'est pas acceptee comme source publique.");
  }

  return url.toString();
}

function cleanSourceText(html) {
  return String(html || "")
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&quot;/gi, "\"")
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 18000);
}

async function readSourcePage(rawUrl) {
  const sourceUrl = normalizeSourceUrl(rawUrl);
  const response = await fetch(sourceUrl, {
    headers: {
      "Accept": "text/html,text/plain,application/xhtml+xml",
      "User-Agent": "VoltiaSourceReader/1.0"
    },
    redirect: "follow"
  });

  if (!response.ok) {
    throw new Error(`Impossible de lire la source indiquee (${response.status}).`);
  }

  const contentType = String(response.headers.get("content-type") || "").toLowerCase();
  if (!contentType.includes("text/html") && !contentType.includes("text/plain") && !contentType.includes("application/xhtml")) {
    throw new Error("La source doit être une page web lisible en texte.");
  }

  const text = cleanSourceText(await response.text());
  if (text.length < 80) {
    throw new Error("La page source ne contient pas assez de texte lisible.");
  }

  return { url: sourceUrl, text };
}

function isSupportedImageDataUrl(value) {
  return /^data:image\/(?:png|jpe?g|webp);base64,/i.test(String(value || ""));
}

function dataImageByteLength(value) {
  const payload = String(value || "").split(",", 2)[1] || "";
  return Math.ceil((payload.length * 3) / 4);
}

function assertSupportedImageDataUrl(value, label = "Image") {
  if (!isSupportedImageDataUrl(value)) {
    const error = new Error(`${label} manquante ou format non supporté.`);
    error.statusCode = 400;
    throw error;
  }

  if (dataImageByteLength(value) > maxDataImageBytes) {
    const error = new Error(`${label} trop lourde. Limite serveur: ${Math.round(maxDataImageBytes / 1024 / 1024)} Mo.`);
    error.statusCode = 413;
    throw error;
  }
}

async function handleSignup(req, res) {
  if (!requireRateLimit(req, res, "auth:signup", {
    limit: 5,
    windowMs: 60 * 60 * 1000,
    message: "Trop de créations de compte depuis cette adresse. Réessaie plus tard."
  })) return;

  try {
    const { name = "", email, password } = await readRequestJson(req);
    const cleanName = String(name || "").trim().slice(0, 80);
    const cleanEmail = normalizeEmail(email);
    const cleanPassword = String(password || "");

    if (!cleanName) {
      sendJson(res, 400, { error: "Ajoute ton nom ou prenom." });
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      sendJson(res, 400, { error: "Adresse email invalide." });
      return;
    }
    if (cleanPassword.length < 8) {
      sendJson(res, 400, { error: "Le mot de passe doit contenir au moins 8 caracteres." });
      return;
    }

    const store = await loadUserStore();
    if (store.users.some((user) => user.email === cleanEmail)) {
      sendJson(res, 409, { error: "Un compte existe deja avec cet email." });
      return;
    }

    const user = {
      id: randomBytes(12).toString("hex"),
      name: cleanName,
      email: cleanEmail,
      passwordHash: hashPassword(cleanPassword),
      plan: "free",
      subscriptionStatus: "free",
      usage: { date: todayKey(), count: 0 },
      createdAt: new Date().toISOString()
    };
    const token = randomBytes(32).toString("hex");
    store.users.push(user);
    store.sessions[token] = {
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000).toISOString()
    };
    await saveUserStore(store);

    sendJsonWithHeaders(res, 201, { user: publicUser(user) }, { "Set-Cookie": sessionCookie(req, token) });
  } catch (error) {
    sendError(res, error);
  }
}

async function handleLogin(req, res) {
  if (!requireRateLimit(req, res, "auth:login", {
    limit: 8,
    windowMs: 15 * 60 * 1000,
    message: "Trop de tentatives de connexion. Attends quelques minutes avant de recommencer."
  })) return;

  try {
    const { email, password } = await readRequestJson(req);
    const cleanEmail = normalizeEmail(email);
    const store = await loadUserStore();
    const user = store.users.find((item) => item.email === cleanEmail);

    if (!user || !verifyPassword(String(password || ""), user.passwordHash)) {
      sendJson(res, 401, { error: "Email ou mot de passe incorrect." });
      return;
    }

    const token = randomBytes(32).toString("hex");
    store.sessions[token] = {
      userId: user.id,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000).toISOString()
    };
    await saveUserStore(store);

    sendJsonWithHeaders(res, 200, { user: publicUser(user) }, { "Set-Cookie": sessionCookie(req, token) });
  } catch (error) {
    sendError(res, error);
  }
}

async function handleLogout(req, res) {
  const auth = await getSessionUser(req);
  if (auth.token) {
    delete auth.store.sessions[auth.token];
    await saveUserStore(auth.store);
  }
  sendJsonWithHeaders(res, 200, { ok: true }, { "Set-Cookie": clearSessionCookie(req) });
}

async function handleAccessCode(req, res) {
  if (!requireRateLimit(req, res, "auth:access-code", {
    limit: 6,
    windowMs: 15 * 60 * 1000,
    message: "Trop de tentatives de code d'accès. Attends quelques minutes avant de recommencer."
  })) return;

  try {
    const { code = "" } = await readRequestJson(req);
    const expectedCode = String(process.env.ACCESS_CODE || "").trim();

    if (!expectedCode) {
      sendJson(res, 503, { error: "Code d'accès non configuré." });
      return;
    }

    if (String(code || "").trim() !== expectedCode) {
      sendJson(res, 401, { error: "Code d'accès incorrect." });
      return;
    }

    const store = await loadUserStore();
    const token = randomBytes(32).toString("hex");
    store.sessions[token] = {
      accessPass: true,
      name: "Créateur Voltia",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000).toISOString()
    };
    await saveUserStore(store);

    sendJsonWithHeaders(
      res,
      200,
      {
        accessPass: true,
        accessName: "Créateur Voltia",
        message: "Accès complet activé."
      },
      { "Set-Cookie": sessionCookie(req, token) }
    );
  } catch (error) {
    sendError(res, error);
  }
}

async function handleMe(req, res) {
  const auth = await getSessionUser(req);
  sendJson(res, 200, {
    user: publicUser(auth.user),
    accessPass: Boolean(auth.accessPass),
    accessName: auth.accessName || "",
    anonymousDailyLimit: anonDailyLimit
  });
}

function privateUserExport(user) {
  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    plan: user.plan || "free",
    subscriptionStatus: user.subscriptionStatus || "free",
    usage: user.usage || null,
    lastFeature: user.lastFeature || "",
    createdAt: user.createdAt || "",
    updatedAt: user.updatedAt || "",
    stripeCustomerId: user.stripeCustomerId || "",
    stripeSubscriptionId: user.stripeSubscriptionId || "",
    projects: Array.isArray(user.projects) ? user.projects : [],
    reports: Array.isArray(user.reports) ? user.reports : []
  };
}

async function handleAccountExport(req, res) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour exporter tes données." });
    return;
  }

  sendJsonWithHeaders(
    res,
    200,
    {
      app: "Voltia",
      exportVersion: 1,
      generatedAt: new Date().toISOString(),
      user: privateUserExport(auth.user)
    },
    {
      "Cache-Control": "no-store",
      "Content-Disposition": `attachment; filename="voltia-donnees-${auth.user.id}.json"`
    }
  );
}

async function handleDeleteAccount(req, res) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour supprimer ton compte." });
    return;
  }

  const deletedUser = auth.user;
  auth.store.users = auth.store.users.filter((user) => user.id !== deletedUser.id);
  for (const [token, session] of Object.entries(auth.store.sessions || {})) {
    if (token === auth.token || session?.userId === deletedUser.id) {
      delete auth.store.sessions[token];
    }
  }

  await saveUserStore(auth.store);
  sendJsonWithHeaders(
    res,
    200,
    {
      ok: true,
      deletedUserId: deletedUser.id,
      billingNotice: deletedUser.stripeSubscriptionId
        ? "Le compte Voltia local est supprimé. Si un abonnement Stripe existe encore, il doit être annulé dans Stripe."
        : ""
    },
    { "Set-Cookie": clearSessionCookie(req), "Cache-Control": "no-store" }
  );
}

function publicReport(report) {
  return {
    id: report.id,
    title: report.title || "Rapport Voltia",
    preview: report.preview || "",
    createdAt: report.createdAt || "",
    exportVersion: report.exportVersion || 1,
    projectId: report.projectId || "",
    projectName: report.projectName || ""
  };
}

function projectMapForUser(user) {
  return new Map(
    (Array.isArray(user?.projects) ? user.projects : []).map((project) => [project.id, project])
  );
}

function decorateReport(report, projectMap = new Map()) {
  const project = report?.projectId ? projectMap.get(report.projectId) : null;
  return {
    ...report,
    projectId: report?.projectId || "",
    projectName: project?.name || ""
  };
}

function publicProject(project, reports = []) {
  const projectReports = reports.filter((report) => report.projectId === project.id);
  return {
    id: project.id,
    name: project.name || "Dossier Voltia",
    description: project.description || "",
    createdAt: project.createdAt || "",
    updatedAt: project.updatedAt || project.createdAt || "",
    reportCount: projectReports.length,
    latestReportAt: projectReports[0]?.createdAt || ""
  };
}

function listUserProjects(user) {
  const projects = Array.isArray(user?.projects) ? user.projects : [];
  const reports = Array.isArray(user?.reports) ? user.reports : [];
  return projects
    .slice()
    .sort((left, right) => String(right.updatedAt || right.createdAt || "").localeCompare(String(left.updatedAt || left.createdAt || "")))
    .map((project) => publicProject(project, reports));
}

function decodeHtmlEntities(text) {
  return String(text || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, "\"")
    .replace(/&#39;/g, "'");
}

function textFromHtml(html) {
  return decodeHtmlEntities(
    String(html || "")
      .replace(/<div[^>]*class="[^"]*avatar[^"]*"[^>]*>[\s\S]*?<\/div>/gi, "")
      .replace(/<span[^>]*class="[^"]*message-label[^"]*"[^>]*>[\s\S]*?<\/span>/gi, "")
      .replace(/<button[\s\S]*?<\/button>/gi, "")
      .replace(/<br\s*\/?>/gi, "\n")
      .replace(/<\/(p|div|li|h[1-6]|pre)>/gi, "\n")
      .replace(/<style[\s\S]*?<\/style>/gi, "")
      .replace(/<script[\s\S]*?<\/script>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/[ \t]+/g, " ")
      .replace(/\n\s+/g, "\n")
      .trim()
  );
}

function conversationFromReportHtml(html) {
  const source = String(html || "");
  const matches = [...source.matchAll(/<article[^>]*class="[^"]*message\s+(user|assistant)[^"]*"[^>]*>([\s\S]*?)<\/article>/gi)];

  return matches
    .map((match) => {
      const role = match[1] === "user" ? "user" : "assistant";
      const bubble = /<div[^>]*class="[^"]*bubble[^"]*"[^>]*>([\s\S]*?)<\/div>/i.exec(match[2]);
      const content = textFromHtml(bubble?.[1] || match[2]).slice(0, 6000);
      return { role, content };
    })
    .filter((message) => message.content && !["AI", "VO", "Voltia", "Vous", "AI Voltia", "VO Vous"].includes(message.content))
    .slice(0, 40);
}

async function handleListReports(req, res) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour voir tes rapports." });
    return;
  }

  const projectMap = projectMapForUser(auth.user);
  const reports = Array.isArray(auth.user.reports) ? auth.user.reports : [];
  sendJson(res, 200, { reports: reports.slice(0, 12).map((report) => publicReport(decorateReport(report, projectMap))) });
}

async function handleGetReport(req, res, reportId) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour reprendre une conversation." });
    return;
  }

  const projectMap = projectMapForUser(auth.user);
  const reports = Array.isArray(auth.user.reports) ? auth.user.reports : [];
  const report = reports.find((item) => item.id === reportId);
  if (!report) {
    sendJson(res, 404, { error: "Rapport introuvable." });
    return;
  }

  const conversation = Array.isArray(report.conversation) && report.conversation.length
    ? report.conversation
    : conversationFromReportHtml(report.html);

  sendJson(res, 200, {
    report: {
      ...publicReport(decorateReport(report, projectMap)),
      conversation
    }
  });
}

async function handleExportReportHtml(req, res, reportId) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    res.writeHead(401, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders() });
    res.end("Connecte-toi pour exporter ce rapport.");
    return;
  }

  const reports = Array.isArray(auth.user.reports) ? auth.user.reports : [];
  const report = reports.find((item) => item.id === reportId);
  if (!report) {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders() });
    res.end("Rapport introuvable.");
    return;
  }

  const safeTitle = String(report.title || "rapport-voltia")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "rapport-voltia";
  const html = String(report.html || "");
  res.writeHead(200, {
    "Content-Type": "text/html; charset=utf-8",
    "Content-Disposition": `inline; filename="${safeTitle}.html"`,
    "Cache-Control": "no-store",
    ...securityHeaders()
  });
  res.end(html || "<!doctype html><meta charset=\"utf-8\"><title>Rapport Voltia</title><p>Rapport vide.</p>");
}

async function handleSaveReport(req, res) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour sauvegarder un rapport." });
    return;
  }

  try {
    const { title = "", preview = "", html = "", conversation = [], projectId = "" } = await readRequestJson(req);
    const cleanTitle = String(title || "Rapport Voltia").trim().slice(0, 120) || "Rapport Voltia";
    const cleanPreview = String(preview || "").trim().replace(/\s+/g, " ").slice(0, 220);
    const cleanHtml = String(html || "").slice(0, 180000);
    const cleanProjectId = String(projectId || "").trim().slice(0, 80);
    const cleanConversation = Array.isArray(conversation)
      ? conversation
        .slice(0, 40)
        .map((message) => ({
          role: message?.role === "user" ? "user" : "assistant",
          content: String(message?.content || "").trim().slice(0, 6000)
        }))
        .filter((message) => message.content)
      : [];

    if (!cleanHtml.includes("Rapport Voltia")) {
      sendJson(res, 400, { error: "Rapport invalide ou vide." });
      return;
    }

    auth.user.reports = Array.isArray(auth.user.reports) ? auth.user.reports : [];
    auth.user.projects = Array.isArray(auth.user.projects) ? auth.user.projects : [];
    let linkedProject = null;

    if (cleanProjectId) {
      if (!isProUser(auth.user)) {
        sendJson(res, 402, {
          error: "Les dossiers Pro permettent de classer les rapports par chantier. Passe en Pro pour utiliser cette fonction.",
          upgradeRequired: true,
          feature: "projects"
        });
        return;
      }

      linkedProject = auth.user.projects.find((project) => project.id === cleanProjectId) || null;
      if (!linkedProject) {
        sendJson(res, 404, { error: "Dossier introuvable." });
        return;
      }
    }

    const report = {
      id: randomBytes(10).toString("hex"),
      title: cleanTitle,
      preview: cleanPreview,
      html: cleanHtml,
      conversation: cleanConversation,
      projectId: linkedProject?.id || "",
      exportVersion: 2,
      createdAt: new Date().toISOString()
    };

    auth.user.reports.unshift(report);
    auth.user.reports = auth.user.reports.slice(0, 20);
    if (linkedProject) {
      linkedProject.updatedAt = new Date().toISOString();
    }
    auth.user.updatedAt = new Date().toISOString();
    await saveUserStore(auth.store);

    const projectMap = projectMapForUser(auth.user);
    sendJson(res, 201, {
      report: publicReport(decorateReport(report, projectMap)),
      reports: auth.user.reports.slice(0, 12).map((item) => publicReport(decorateReport(item, projectMap))),
      projects: listUserProjects(auth.user)
    });
  } catch (error) {
    sendError(res, error);
  }
}

async function handleListProjects(req, res) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour voir tes dossiers." });
    return;
  }

  auth.user.projects = Array.isArray(auth.user.projects) ? auth.user.projects : [];
  sendJson(res, 200, {
    projects: listUserProjects(auth.user),
    canCreateProjects: isProUser(auth.user)
  });
}

async function handleGetProject(req, res, projectId) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour ouvrir ce dossier." });
    return;
  }

  auth.user.projects = Array.isArray(auth.user.projects) ? auth.user.projects : [];
  const project = auth.user.projects.find((item) => item.id === projectId);
  if (!project) {
    sendJson(res, 404, { error: "Dossier introuvable." });
    return;
  }

  const projectMap = projectMapForUser(auth.user);
  const reports = (Array.isArray(auth.user.reports) ? auth.user.reports : [])
    .filter((report) => report.projectId === project.id)
    .map((report) => publicReport(decorateReport(report, projectMap)));

  sendJson(res, 200, {
    project: publicProject(project, auth.user.reports || []),
    reports
  });
}

async function handleCreateProject(req, res) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi avant de créer un dossier." });
    return;
  }

  if (!isProUser(auth.user)) {
    sendJson(res, 402, {
      error: "Les dossiers par chantier sont réservés à Voltia Pro.",
      upgradeRequired: true,
      feature: "projects"
    });
    return;
  }

  try {
    const { name = "", description = "" } = await readRequestJson(req);
    const cleanName = String(name || "").trim().replace(/\s+/g, " ").slice(0, 80);
    const cleanDescription = String(description || "").trim().replace(/\s+/g, " ").slice(0, 180);

    if (!cleanName) {
      sendJson(res, 400, { error: "Donne un nom au dossier." });
      return;
    }

    auth.user.projects = Array.isArray(auth.user.projects) ? auth.user.projects : [];
    const exists = auth.user.projects.some((project) => project.name.toLowerCase() === cleanName.toLowerCase());
    if (exists) {
      sendJson(res, 409, { error: "Un dossier existe déjà avec ce nom." });
      return;
    }

    const project = {
      id: randomBytes(10).toString("hex"),
      name: cleanName,
      description: cleanDescription,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    auth.user.projects.unshift(project);
    auth.user.projects = auth.user.projects.slice(0, 24);
    auth.user.updatedAt = new Date().toISOString();
    await saveUserStore(auth.store);

    sendJson(res, 201, {
      project: publicProject(project, auth.user.reports || []),
      projects: listUserProjects(auth.user)
    });
  } catch (error) {
    sendError(res, error);
  }
}

function stripeFormBody(values) {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(values)) {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, value);
    }
  }
  return params;
}

async function handleCreateCheckout(req, res) {
  if (!requireRateLimit(req, res, "billing:checkout", {
    limit: 10,
    windowMs: 15 * 60 * 1000,
    message: "Trop de tentatives de paiement. Attends quelques minutes avant de recommencer."
  })) return;

  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi avant de passer en Pro." });
    return;
  }
  if (!process.env.STRIPE_SECRET_KEY || !process.env.STRIPE_PRICE_ID) {
    sendJson(res, 501, {
      error: "Stripe n'est pas encore configure. Ajoute STRIPE_SECRET_KEY et STRIPE_PRICE_ID sur Render."
    });
    return;
  }

  try {
    const host = req.headers.host || `localhost:${port}`;
    const protocol = host.includes("localhost") ? "http" : "https";
    const response = await fetch("https://api.stripe.com/v1/checkout/sessions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.STRIPE_SECRET_KEY}`,
        "Content-Type": "application/x-www-form-urlencoded"
      },
      body: stripeFormBody({
        mode: "subscription",
        "line_items[0][price]": process.env.STRIPE_PRICE_ID,
        "line_items[0][quantity]": "1",
        success_url: `${protocol}://${host}/?checkout=success`,
        cancel_url: `${protocol}://${host}/?checkout=cancel`,
        client_reference_id: auth.user.id,
        customer_email: auth.user.email,
        "metadata[name]": auth.user.name || "",
        "metadata[userId]": auth.user.id
      })
    });

    const data = await readUpstreamJson(response);
    if (!response.ok) {
      sendJson(res, response.status, { error: data.error?.message || "Erreur Stripe." });
      return;
    }

    sendJson(res, 200, { url: data.url });
  } catch (error) {
    sendError(res, error);
  }
}

async function readRawBody(req, { limitBytes = maxStripeBodyBytes } = {}) {
  return readLimitedBody(req, limitBytes);
}

function verifyStripeSignature(rawBody, signature, secret) {
  const parts = Object.fromEntries(
    String(signature || "")
      .split(",")
      .map((part) => part.split("="))
      .filter((part) => part.length === 2)
  );
  if (!parts.t || !parts.v1) return false;
  const payload = `${parts.t}.${rawBody.toString("utf8")}`;
  const expected = createHmac("sha256", secret).update(payload).digest("hex");
  const expectedBuffer = Buffer.from(expected);
  const actualBuffer = Buffer.from(parts.v1);
  return expectedBuffer.length === actualBuffer.length && timingSafeEqual(expectedBuffer, actualBuffer);
}

async function handleStripeWebhook(req, res) {
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    sendJson(res, 501, { error: "STRIPE_WEBHOOK_SECRET manquant." });
    return;
  }

  try {
    const rawBody = await readRawBody(req);
    if (!verifyStripeSignature(rawBody, req.headers["stripe-signature"], process.env.STRIPE_WEBHOOK_SECRET)) {
      sendJson(res, 400, { error: "Signature Stripe invalide." });
      return;
    }

    const event = JSON.parse(rawBody.toString("utf8"));
    const store = await loadUserStore();

    if (event.type === "checkout.session.completed") {
      const session = event.data?.object || {};
      const userId = session.client_reference_id || session.metadata?.userId;
      const user = store.users.find((item) => item.id === userId);
      if (user) {
        user.plan = "pro";
        user.subscriptionStatus = "active";
        user.stripeCustomerId = session.customer;
        user.stripeSubscriptionId = session.subscription;
        user.updatedAt = new Date().toISOString();
        await saveUserStore(store);
      }
    }

    if (event.type === "customer.subscription.deleted") {
      const subscription = event.data?.object || {};
      const user = store.users.find((item) => item.stripeSubscriptionId === subscription.id);
      if (user) {
        user.plan = "free";
        user.subscriptionStatus = "canceled";
        user.updatedAt = new Date().toISOString();
        await saveUserStore(store);
      }
    }

    sendJson(res, 200, { received: true });
  } catch (error) {
    sendError(res, error, "Webhook Stripe illisible.");
  }
}

function normalizePromptText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function textHasAny(text, words) {
  return words.some((word) => text.includes(word));
}

function latestUserMessage(messages = []) {
  return [...messages]
    .reverse()
    .find((message) => message?.role !== "assistant")?.content || "";
}

function isHighRiskOperationalRequest(messages = []) {
  const text = normalizePromptText(latestUserMessage(messages));
  const evChargingPlanning = textHasAny(text, [
    "borne de recharge",
    "irve"
  ]) && textHasAny(text, [
    "facteur",
    "facteurs",
    "verifier",
    "dimensionnement",
    "dimensionner",
    "section de cable",
    "chute de tension",
    "differentiel",
    "protection"
  ]) && !textHasAny(text, [
    "schema de branchement",
    "schema de raccordement",
    "couleurs",
    "phase",
    "neutre",
    "terre",
    "etapes",
    "procedure",
    "raccorde",
    "raccordement",
    "branche",
    "brancher",
    "repiqu"
  ]);
  if (evChargingPlanning) return false;

  const actionDemand = textHasAny(text, [
    "branche",
    "branchement",
    "brancher",
    "raccorde",
    "raccordement",
    "repiqu",
    "cablage",
    "cabler",
    "etapes",
    "procedure"
  ]);
  const operationalDetailDemand = textHasAny(text, [
    "donne-moi le schema",
    "donne moi le schema",
    "schema de branchement",
    "schema de raccordement",
    "couleur",
    "couleurs",
    "calibre",
    "bornier",
    "borne"
  ]);
  const executionIntent = actionDemand || (
    operationalDetailDemand && textHasAny(text, [
      "comment",
      "faire",
      "installer",
      "ajouter",
      "ce soir",
      "rapidement",
      "etapes"
    ])
  );
  const electricalParts = textHasAny(text, [
    "couleur",
    "couleurs",
    "calibre",
    "bornier",
    "borne",
    "fil",
    "phase",
    "neutre",
    "terre"
  ]);
  const dangerousContext = textHasAny(text, [
    "sous tension",
    "sans couper",
    "ne pas couper",
    "tableau",
    "disjoncteur",
    "differentiel",
    "salle de bain",
    "douche",
    "baignoire",
    "humidite",
    "prise",
    "chauffe-eau",
    "four",
    "lave-linge",
    "contacteur",
    "230v",
    "400v"
  ]);
  const nonCompliantIntent = textHasAny(text, [
    "ce soir",
    "rapidement",
    "temporaire",
    "bricol",
    "sans terre",
    "circuit lumiere",
    "circuit eclairage",
    "ajouter une prise",
    "faire moi meme"
  ]);

  return executionIntent && electricalParts && (dangerousContext || nonCompliantIntent);
}

function requestedDetailLevel(messages = []) {
  const text = normalizePromptText(messages.map((message) => message?.content || "").join("\n"));
  if (text.includes("niveau de reponse: expert") || text.includes("mode expert")) return "expert";
  if (text.includes("niveau de reponse: confirme")) return "confirme";
  return "debutant";
}

function highRiskOperationalReply(messages = []) {
  const request = String(latestUserMessage(messages) || "demande de modification électrique").trim();
  return [
    "Résumé rapide",
    "",
    `Ta demande concerne une intervention électrique potentiellement dangereuse: ${request.slice(0, 260)}${request.length > 260 ? "..." : ""}`,
    "",
    "Je ne peux pas fournir de schéma de raccordement, d'étapes de branchement, de correspondance de fils, de couleurs à connecter, de calibres à choisir ou de procédure d'installation pour ce cas. Quand la demande vise une intervention opérationnelle sur une installation réelle, surtout avec repiquage, tableau, protection, environnement humide, absence de terre ou volonté de ne pas couper correctement l'alimentation, transformer la réponse en tutoriel serait risqué.",
    "",
    "Niveau de danger",
    "",
    "Le risque principal est le choc électrique, surtout si l'intervention est réalisée sous tension ou sur un circuit mal identifié. Le second risque est l'incendie ou l'échauffement si un circuit est détourné de son usage, si la protection n'est pas adaptée ou si la terre et le différentiel ne sont pas vérifiés sur place.",
    "",
    "Pourquoi ce montage ne doit pas être improvisé",
    "",
    "- Un nouveau point d'utilisation dépend de l'usage prévu, du cheminement, des protections, de la section, de la terre, du différentiel et de l'état réel du tableau.",
    "- Un circuit existant ne peut pas être supposé apte à recevoir un nouvel usage simplement parce qu'il y a une phase et un neutre quelque part.",
    "- Un repiquage sans repérage complet peut masquer une absence de terre, une section inadaptée, une protection mal identifiée, un neutre partagé ou une erreur de circuit.",
    "- Garder une partie du logement alimentée ne justifie pas de travailler sous tension. Il faut organiser l'alimentation temporaire des appareils sensibles autrement.",
    "",
    "Ce que tu peux faire sans danger maintenant",
    "",
    "- Ne commence pas le raccordement ce soir.",
    "- Ne démonte pas de prise, d'interrupteur, de luminaire ou de tableau sous tension.",
    "- Note l'objectif exact: emplacement souhaité, appareil prévu, puissance, contraintes de coupure, âge du tableau et présence visible d'un différentiel.",
    "- Prends des photos générales, sans ouvrir les parties sous tension: tableau fermé, étiquettes de circuits, zone concernée, chemin possible de câbles.",
    "- Prévois une solution temporaire non invasive pour les appareils à maintenir pendant une coupure organisée.",
    "",
    "Alternative conforme à demander",
    "",
    "Demande à un électricien qualifié de créer ou valider un circuit adapté à l'usage, avec protection différentielle, conducteur de protection, section et protection cohérentes, cheminement acceptable et contrôle final. La bonne solution dépend du tableau, de la terre, de la puissance, de la longueur, du mode de pose et du contexte réel: elle ne peut pas être certifiée à distance.",
    "",
    "Informations à préparer pour le professionnel",
    "",
    "- Photos du tableau et des étiquettes de circuits.",
    "- Emplacement exact souhaité et contraintes autour du point d'utilisation.",
    "- Type d'appareil qui sera branché.",
    "- Année approximative de l'installation et présence ou non de prises avec terre dans la pièce.",
    "- Contraintes de coupure électrique et appareils à maintenir.",
    "",
    "Prochaine action",
    "",
    "Ne réalise pas l'intervention si elle suppose un repiquage, un raccordement incertain ou un travail sous tension. Planifie une intervention hors tension avec un électricien, ou demande au minimum une validation sur place avant achat et perçage. Voltia peut t'aider à préparer la liste de questions et un mini-cahier des charges, mais pas à transformer un montage dangereux en procédure de branchement."
  ].join("\n");
}

async function handleChat(req, res) {
  try {
    const usage = await consumeUsage(req, res, "chat");
    if (!usage.allowed) return;

    const { messages = [], sourceOnly = false, sourceUrl = "", normsSearch = false } = await readRequestJson(req);
    const sourceContext = sourceOnly ? await readSourcePage(sourceUrl) : null;
    const shouldSearchNorms = Boolean(normsSearch && !sourceContext);
    const highRiskOperational = isHighRiskOperationalRequest(messages);
    const detailLevel = requestedDetailLevel(messages);

    if (highRiskOperational) {
      sendJson(res, 200, { reply: highRiskOperationalReply(messages), safetyBlocked: true });
      return;
    }

    if (!process.env.OPENAI_API_KEY) {
      sendJson(res, 500, {
        error: "OPENAI_API_KEY manquant. Ajoute ta clé dans l'environnement puis relance le serveur."
      });
      return;
    }

    const input = messages.map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content || "")
    }));

    if (sourceContext) {
      input.unshift({
        role: "user",
        content: [
          `Source unique autorisee: ${sourceContext.url}`,
          "Contenu lisible de cette source:",
          sourceContext.text
        ].join("\n\n")
      });
    }

    const model = getOpenAIModel();
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        ...openAIQualityOptions(model, {
          expert: detailLevel === "expert",
          verbosity: detailLevel === "expert" ? "high" : "medium"
        }),
        tools: shouldSearchNorms ? [
          {
            type: "web_search",
            search_context_size: "medium"
          }
        ] : undefined,
        tool_choice: shouldSearchNorms ? "required" : undefined,
        instructions: [
          "Tu es Voltia, un assistant français spécialisé dans l'électricité domestique et petit tertiaire en France.",
          ...clearAnswerInstructions("la question électrique posée par l'utilisateur"),
          "Réponds comme un expert prudent: diagnostic, raisonnement, priorisation du risque, limites et prochaine action. Tu dois être utile sans donner de procédure dangereuse.",
          "Adapte fortement la taille et l'agencement à la question. Une question simple appelle une réponse courte. Une question experte, un rapport ou un cas complexe appelle une réponse complète avec paragraphes structurés et listes ciblées.",
          "En mode expert, donne une analyse approfondie: résumé exécutif, niveau de danger, raisonnement technique, hypothèses classées, contrôles sans danger, informations à collecter, limites et plan d'action. Utilise des paragraphes courts de 2 à 4 phrases, puis des listes quand elles clarifient.",
          "Ne recycle pas une structure inadaptée. Pour une question normative, n'utilise pas 'Causes possibles' sauf s'il y a une panne; utilise plutôt 'Règles à vérifier', 'Points de vigilance', 'Ce qui reste à confirmer' et 'Sources'.",
          "Quand la demande vise un diagnostic ou un rapport, réponds comme un livrable professionnel non certifiant avec sections explicites et conclusions actionnables.",
          "Pour une demande de dimensionnement, borne de recharge, IRVE, puissance, protection ou section de câble, réponds de façon qualifiée avec les ordres de grandeur utiles, les facteurs de calcul (puissance, courant, monophasé/triphasé, longueur, chute de tension, mode de pose, température, protection, terre, différentiel, délestage), les limites et les points à faire valider. Tu peux donner des plages indicatives et expliquer le raisonnement, sans fournir un tutoriel de raccordement pas à pas.",
          "Pour toute réponse, garde la cohérence question/réponse: reprends le contexte utilisateur, signale les informations manquantes, et ne conclus jamais au-delà des données fournies.",
          detailLevel === "expert"
            ? "Le niveau expert est actif: réponse substantielle attendue, avec vocabulaire technique expliqué, raisonnement nuancé et priorités. Ne sois pas superficiel."
            : "",
          sourceContext
            ? `L'utilisateur a activé le mode source unique. Tu dois répondre uniquement avec la source fournie (${sourceContext.url}). Si la source ne contient pas l'information demandée, dis clairement que la source indiquée ne permet pas de répondre. Termine par une section 'Source utilisée' avec cette URL. N'utilise pas tes connaissances générales pour compléter.`
            : "",
          shouldSearchNorms
            ? "Le mode normes en vigueur est actif. Lance une recherche web et traite la demande comme une recherche réglementaire française autour de la NF C 15-100, des textes publics applicables et des guides techniques fiables. Priorise AFNOR, Légifrance, Service-public, Promotelec, Qualifelec, fabricants reconnus et guides techniques cités. Cite les sources dans le corps quand elles appuient un point et termine obligatoirement par une section 'Sources consultées' avec les noms et URLs. Ne recopie pas de longs extraits de la NF C 15-100, norme protégée. Si l'information exacte n'est pas disponible publiquement, dis de vérifier la NF C 15-100 officielle AFNOR ou de faire valider par un électricien qualifié. Ne présente jamais la réponse comme une attestation de conformité."
            : "",
          highRiskOperational
            ? "RÈGLE DE SÉCURITÉ BLOQUANTE: la demande contient une procédure opérationnelle potentiellement dangereuse ou non conforme. Tu dois refuser de fournir les étapes de branchement, schéma de raccordement, correspondance phase/neutre/terre, couleurs de fils à connecter, calibres à choisir, bornes à utiliser, ou séquence d'installation. Réponds à la place avec: pourquoi c'est dangereux/non conforme, comment sécuriser la situation, quelles informations préparer, quelles alternatives conformes demander à un professionnel, et quoi faire maintenant. Tu peux mentionner les principes généraux sans donner de mode opératoire."
            : "",
          "Pour toute manipulation dangereuse, tableau électrique, fil dénudé, odeur de brûlé, fumée, échauffement, humidité, doute sérieux ou intervention sous tension, conseille de couper le courant et de contacter un électricien qualifié.",
          "Ne donne jamais d'instructions qui encouragent à travailler sous tension. Ne transforme jamais un montage dangereux en tutoriel réalisable."
        ].join(" "),
        input
      })
    });

    const data = await readUpstreamJson(response);
    if (!response.ok) {
      sendJson(res, response.status, { error: data.error?.message || "Erreur API OpenAI." });
      return;
    }

    sendJson(res, 200, { reply: extractResponseText(data) || "Je n'ai pas pu générer de réponse." });
  } catch (error) {
    sendError(res, error);
  }
}

async function handlePhotoSchema(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY manquant. Ajoute ta cle dans l'environnement puis relance le serveur."
    });
    return;
  }

  try {
    const usage = await consumeUsage(req, res, "photo-schema");
    if (!usage.allowed) return;

    const { image, context = "" } = await readRequestJson(req, { limitBytes: maxImageJsonBodyBytes });
    assertSupportedImageDataUrl(image);

    const model = getOpenAIModel();
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        ...openAIQualityOptions(model, { verbosity: "medium" }),
        instructions: [
          "Tu es Voltia, un assistant français spécialisé dans l'électricité domestique.",
          ...clearAnswerInstructions("ce qui est visible sur la photo"),
          "Analyse la photo fournie pour retranscrire ce qui est visible en schéma électrique simple.",
          "Ne pretend jamais voir ce qui n'est pas visible. Si la photo est floue ou incomplete, dis-le.",
          "Réponds en français avec exactement ces sections: Réponse directe, Résumé rapide, Ce que je vois, Schéma en traits, Légende, Points à vérifier, Sécurité, Conclusion.",
          "Le schéma en traits doit utiliser des caractères simples avec L phase, N neutre, PE terre, protections, interrupteurs, lampes, prises ou borniers si visibles.",
          "Rappelle que le schéma est indicatif et qu'il faut couper le courant et faire valider par un électricien qualifié avant toute intervention."
        ].join(" "),
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: `Contexte utilisateur: ${String(context || "aucun contexte").slice(0, 800)}`
              },
              {
                type: "input_image",
                image_url: image
              }
            ]
          }
        ]
      })
    });

    const data = await readUpstreamJson(response);
    if (!response.ok) {
      sendJson(res, response.status, { error: data.error?.message || "Erreur API OpenAI." });
      return;
    }

    sendJson(res, 200, { reply: extractResponseText(data) || "Je n'ai pas pu analyser cette photo." });
  } catch (error) {
    sendError(res, error);
  }
}

async function handleManualSearch(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY manquant. Ajoute ta cle dans l'environnement puis relance le serveur."
    });
    return;
  }

  try {
    const usage = await consumeUsage(req, res, "manual-search");
    if (!usage.allowed) return;

    const { reference = "", image = "" } = await readRequestJson(req, { limitBytes: maxImageJsonBodyBytes });
    const cleanReference = String(reference || "").slice(0, 300).trim();
    const hasImage = Boolean(image);
    if (hasImage) {
      assertSupportedImageDataUrl(image, "Photo de référence");
    }

    if (!cleanReference && !hasImage) {
      sendJson(res, 400, { error: "Ajoute une référence ou une photo pour rechercher une notice." });
      return;
    }

    const userContent = [
      {
        type: "input_text",
        text: [
          "Recherche une notice technique ou notice utilisateur fiable pour cet appareil électrique.",
          `Référence saisie: ${cleanReference || "aucune référence texte"}.`,
          "Si une photo est fournie, lis la marque, le modèle, la référence, les tensions/courants visibles, puis utilise ces éléments pour chercher.",
          "Réponds en français avec ces sections: Réponse directe, Résumé rapide, Référence identifiée, Liens de notice probables, Infos utiles, Points de vigilance, Conclusion.",
          "Dans Liens de notice probables, donne uniquement des liens ou sources que tu juges plausibles, avec le nom du site et pourquoi c'est probablement la bonne notice.",
          "Si tu n'es pas certain, dis clairement que la notice doit être vérifiée par comparaison exacte de la référence."
        ].join(" ")
      }
    ];

    if (hasImage) {
      userContent.push({
        type: "input_image",
        image_url: image
      });
    }

    const model = getOpenAISearchModel();
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        ...openAIQualityOptions(model, { verbosity: "medium" }),
        tools: [{ type: "web_search_preview" }],
        instructions: [
          "Tu es Voltia, un assistant français spécialisé dans l'électricité domestique.",
          ...clearAnswerInstructions("la notice ou reference demandee"),
          "Tu aides à retrouver des notices constructeur à partir d'une référence texte ou d'une photo.",
          "Priorise les sources constructeur, distributeurs techniques reconnus, catalogues officiels et PDF de notice.",
          "Ne donne pas de certitude si la référence ne correspond pas exactement.",
          "N'invente jamais un lien. Si aucune notice fiable n'est trouvee, propose les mots-cles exacts a rechercher.",
          "Rappelle que les notices électriques doivent être lues avant toute intervention et qu'il faut couper le courant pour toute manipulation."
        ].join(" "),
        input: [
          {
            role: "user",
            content: userContent
          }
        ]
      })
    });

    const data = await readUpstreamJson(response);
    if (!response.ok) {
      sendJson(res, response.status, { error: data.error?.message || "Erreur API OpenAI." });
      return;
    }

    sendJson(res, 200, { reply: extractResponseText(data) || "Je n'ai pas pu trouver de notice fiable." });
  } catch (error) {
    sendError(res, error);
  }
}

async function handleLightingPlan(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY manquant. Ajoute ta cle dans l'environnement puis relance le serveur."
    });
    return;
  }

  try {
    const usage = await consumeUsage(req, res, "lighting-plan");
    if (!usage.allowed) return;

    const {
      image,
      room = "",
      dimensions = "",
      height = "",
      type = "",
      level = "debutant"
    } = await readRequestJson(req, { limitBytes: maxImageJsonBodyBytes });

    assertSupportedImageDataUrl(image, "Plan");

    const model = getOpenAIModel();
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        ...openAIQualityOptions(model, {
          expert: level === "expert",
          verbosity: level === "expert" ? "high" : "medium"
        }),
        instructions: [
          "Tu es Voltia, un assistant français spécialisé dans l'éclairage domestique et le dimensionnement indicatif.",
          ...clearAnswerInstructions("la demande d'implantation lumineuse"),
          "Analyse le plan fourni et propose une implantation logique des éclairages selon les dimensions visibles, l'agencement, les zones de passage, les meubles, les plans de travail et l'usage de la pièce.",
          "Si l'échelle ou les cotes ne sont pas lisibles, fais une estimation prudente et dis clairement ce qui manque.",
          "Utilise des objectifs de lux indicatifs: chambre 100 a 200 lux, salon 150 a 300 lux, cuisine 300 a 500 lux, plan de travail 500 lux, salle de bain 200 a 300 lux, couloir 100 a 150 lux, bureau 300 a 500 lux.",
          "Calcule une puissance indicative a partir des lumens, en rappelant qu'une LED courante donne environ 80 a 120 lm/W selon modele.",
          "Propose le type de luminaire adapté: spot encastré, suspension, plafonnier, rail, applique, ruban LED ou éclairage de tâche.",
          "Ne présente pas le résultat comme une étude professionnelle. Rappelle de respecter les normes, volumes de salle d'eau, distances, IP, protections et validation par un électricien qualifié.",
          "Réponds avec exactement ces sections: Réponse directe, Résumé rapide, Lecture du plan, Hypothèses, Calcul indicatif, Implantation proposée, Plan en traits, Type et puissance des luminaires, Sécurité, Conclusion.",
          "Dans Plan en traits, fais un petit plan ASCII simple avec les points lumineux notes L1, L2, L3 et les zones importantes."
        ].join(" "),
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: [
                  `Pièce ou usage: ${String(room || "non précisé").slice(0, 120)}.`,
                  `Dimensions connues: ${String(dimensions || "non précisées").slice(0, 120)}.`,
                  `Hauteur sous plafond: ${String(height || "non précisée").slice(0, 80)}.`,
                  `Type de luminaire souhaité: ${String(type || "non précisé").slice(0, 80)}.`,
                  `Niveau de détail demandé: ${String(level || "débutant").slice(0, 40)}.`,
                  "Donne une proposition claire, lisible et exploitable pour placer les points lumineux."
                ].join(" ")
              },
              {
                type: "input_image",
                image_url: image
              }
            ]
          }
        ]
      })
    });

    const data = await readUpstreamJson(response);
    if (!response.ok) {
      sendJson(res, response.status, { error: data.error?.message || "Erreur API OpenAI." });
      return;
    }

    sendJson(res, 200, { reply: extractResponseText(data) || "Je n'ai pas pu dimensionner cet éclairage." });
  } catch (error) {
    sendError(res, error);
  }
}

function climateCoefficient(value, map, fallback = 1) {
  return map[String(value || "").toLowerCase()] || fallback;
}

function estimateClimateSizing(input) {
  const area = Math.min(Math.max(Number(input.area || 0), 5), 250);
  const height = Math.min(Math.max(Number(input.height || 2.5), 2), 5);
  const people = Math.min(Math.max(Number(input.people || 1), 1), 20);
  const room = String(input.room || "Salon / sejour");

  const baseWattsPerM2 = room.toLowerCase().includes("cuisine")
    ? 120
    : room.toLowerCase().includes("bureau")
      ? 105
      : 100;

  const insulationCoef = climateCoefficient(input.insulation, {
    "bonne": 0.9,
    "correcte": 1,
    "moyenne": 1.12,
    "faible": 1.28
  });
  const sunCoef = climateCoefficient(input.sun, {
    "peu exposee": 0.92,
    "normale": 1,
    "tres ensoleillee": 1.18
  });
  const heatCoef = climateCoefficient(input.heatSources, {
    "peu": 0.96,
    "normaux": 1,
    "nombreux": 1.12
  });
  const regionCoef = climateCoefficient(input.region, {
    "tempere": 1,
    "chaud": 1.12,
    "tres chaud": 1.24
  });
  const heightCoef = height > 2.5 ? height / 2.5 : 1;
  const peopleExtraWatts = Math.max(people - 1, 0) * 100;

  const rawWatts = area * baseWattsPerM2 * heightCoef * insulationCoef * sunCoef * heatCoef * regionCoef + peopleExtraWatts;
  const recommendedWatts = Math.round(rawWatts / 100) * 100;
  const recommendedKw = Number((recommendedWatts / 1000).toFixed(1));
  const recommendedBtu = Math.round((recommendedWatts * 3.412) / 500) * 500;

  return {
    area,
    height,
    volume: Number((area * height).toFixed(1)),
    recommendedWatts,
    recommendedKw,
    recommendedBtu,
    baseWattsPerM2,
    coefficients: {
      isolation: insulationCoef,
      soleil: sunCoef,
      hauteur: Number(heightCoef.toFixed(2)),
      appareils: heatCoef,
      region: regionCoef,
      personnesSupplementaires: peopleExtraWatts
    }
  };
}

async function handleClimateSizing(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY manquant. Ajoute ta cle dans l'environnement puis relance le serveur."
    });
    return;
  }

  try {
    const usage = await consumeUsage(req, res, "climate-sizing");
    if (!usage.allowed) return;

    const input = await readRequestJson(req);
    const estimate = estimateClimateSizing(input);

    if (!estimate.area || estimate.area < 5) {
      sendJson(res, 400, { error: "Superficie manquante ou trop faible." });
      return;
    }

    const model = getOpenAIModel();
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model,
        ...openAIQualityOptions(model, {
          expert: input.level === "expert",
          verbosity: input.level === "expert" ? "high" : "medium"
        }),
        instructions: [
          "Tu es Voltia, un assistant français spécialisé dans le dimensionnement indicatif de climatisation domestique.",
          ...clearAnswerInstructions("la demande de dimensionnement de climatisation"),
          "Explique une estimation de puissance de climatiseur à partir des données fournies.",
          "Ne présente jamais le résultat comme une étude thermique professionnelle.",
          "Rappelle qu'un bilan thermique réel dépend des vitrages, murs, orientation, apports internes, ventilation, région, humidité et contraintes de pose.",
          "Réponds avec exactement ces sections: Réponse directe, Résumé rapide, Données prises en compte, Calcul indicatif, Puissance conseillée, Type de climatiseur, Points de vigilance, Conclusion.",
          "Donne la puissance en kW, W et BTU/h. Explique si l'appareil pourrait être sous-dimensionné ou surdimensionné."
        ].join(" "),
        input: [
          {
            role: "user",
            content: [
              "Dimensionne une climatisation avec ces donnees.",
              `Superficie: ${estimate.area} m2.`,
              `Hauteur: ${estimate.height} m.`,
              `Volume: ${estimate.volume} m3.`,
              `Piece: ${String(input.room || "non precise").slice(0, 80)}.`,
              `Isolation: ${String(input.insulation || "non precisee").slice(0, 80)}.`,
              `Exposition soleil: ${String(input.sun || "non precisee").slice(0, 80)}.`,
              `Personnes: ${String(input.people || "1").slice(0, 20)}.`,
              `Appareils chauffants: ${String(input.heatSources || "non precise").slice(0, 80)}.`,
              `Region/climat: ${String(input.region || "non precise").slice(0, 80)}.`,
              `Estimation calculee: ${estimate.recommendedWatts} W, ${estimate.recommendedKw} kW, environ ${estimate.recommendedBtu} BTU/h.`,
              `Base W/m2: ${estimate.baseWattsPerM2}. Coefficients: ${JSON.stringify(estimate.coefficients)}.`,
              `Niveau de detail: ${String(input.level || "debutant").slice(0, 40)}.`
            ].join(" ")
          }
        ]
      })
    });

    const data = await readUpstreamJson(response);
    if (!response.ok) {
      sendJson(res, response.status, { error: data.error?.message || "Erreur API OpenAI." });
      return;
    }

    sendJson(res, 200, {
      reply: extractResponseText(data) || "Je n'ai pas pu dimensionner cette climatisation.",
      estimate
    });
  } catch (error) {
    sendError(res, error);
  }
}

async function handleHealth(req, res) {
  let storage = isSupabaseConfigured() ? "supabase" : "local-file";
  let storageReady = true;

  try {
    await loadUserStore();
  } catch (error) {
    storageReady = false;
    storage = `${storage}: ${error.message || "indisponible"}`;
  }

  sendJson(res, storageReady ? 200 : 503, {
    ok: storageReady,
    app: "Voltia",
    storage,
    storageMode: supabaseStorageMode,
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
    checkedAt: new Date().toISOString()
  });
}

async function serveStatic(req, res) {
  const pathOnly = req.url.split("?")[0];
  const rawPath = pathOnly === "/" ? "/index.html" : pathOnly;
  const decodedPath = decodeURIComponent(rawPath);
  const safePath = normalize(decodedPath).replace(/^[/\\]+/, "");
  const filePath = resolve(publicDir, safePath);

  if (!filePath.startsWith(resolve(publicDir))) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders() });
    res.end("Accès refusé");
    return;
  }

  try {
    const file = await readFile(filePath);
    res.writeHead(200, {
      "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream",
      ...securityHeaders()
    });
    res.end(file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders() });
    res.end("Page introuvable");
  }
}

async function requestListener(req, res) {
  const path = getRequestPath(req);

  if (!requestOriginAllowed(req)) {
    sendJson(res, 403, { error: "Origine de requête non autorisée." });
    return;
  }

  if (req.method === "GET" && path === "/api/health") {
    await handleHealth(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/auth/signup") {
    await handleSignup(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/auth/login") {
    await handleLogin(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/auth/logout") {
    await handleLogout(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/access-code") {
    await handleAccessCode(req, res);
    return;
  }

  if (req.method === "GET" && path === "/api/auth/me") {
    await handleMe(req, res);
    return;
  }

  if (req.method === "GET" && path === "/api/account/export") {
    await handleAccountExport(req, res);
    return;
  }

  if (req.method === "DELETE" && path === "/api/account") {
    await handleDeleteAccount(req, res);
    return;
  }

  if (req.method === "GET" && path === "/api/reports") {
    await handleListReports(req, res);
    return;
  }

  if (req.method === "GET" && path === "/api/projects") {
    await handleListProjects(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/projects") {
    await handleCreateProject(req, res);
    return;
  }

  if (req.method === "GET" && path.startsWith("/api/projects/")) {
    const projectId = decodeURIComponent(path.replace("/api/projects/", ""));
    await handleGetProject(req, res, projectId);
    return;
  }

  const reportExportMatch = /^\/api\/reports\/([^/]+)\/export\.html$/.exec(path);
  if (req.method === "GET" && reportExportMatch) {
    await handleExportReportHtml(req, res, decodeURIComponent(reportExportMatch[1]));
    return;
  }

  if (req.method === "GET" && path.startsWith("/api/reports/")) {
    const reportId = decodeURIComponent(path.replace("/api/reports/", ""));
    await handleGetReport(req, res, reportId);
    return;
  }

  if (req.method === "POST" && path === "/api/reports") {
    await handleSaveReport(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/billing/checkout") {
    await handleCreateCheckout(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/stripe-webhook") {
    await handleStripeWebhook(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/chat") {
    await handleChat(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/photo-schema") {
    await handlePhotoSchema(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/manual-search") {
    await handleManualSearch(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/lighting-plan") {
    await handleLightingPlan(req, res);
    return;
  }

  if (req.method === "POST" && path === "/api/climate-sizing") {
    await handleClimateSizing(req, res);
    return;
  }

  if (req.method === "GET") {
    await serveStatic(req, res);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders() });
  res.end("Methode non autorisee");
}

if (process.env.NODE_ENV !== "test") {
  createServer(requestListener).listen(port, () => {
    console.log(`Voltia chat site: http://localhost:${port}`);
  });
}

export {
  assertSupportedImageDataUrl,
  clearAnswerInstructions,
  estimateClimateSizing,
  highRiskOperationalReply,
  isHighRiskOperationalRequest,
  normalizeSourceUrl,
  requestListener,
  requestedDetailLevel
};
