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
const userStoreKey = "voltia_user_store";
const sessionDays = 30;
const anonymousUsage = new Map();

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
  return {
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
    return { store: activeStore, token, user: null, accessPass: true, accessName: session.name || "Acces invite" };
  }

  const user = activeStore.users.find((item) => item.id === session.userId) || null;
  return { store: activeStore, token, user, accessPass: false };
}

function getClientKey(req) {
  const forwarded = String(req.headers["x-forwarded-for"] || "").split(",")[0].trim();
  return forwarded || req.socket.remoteAddress || "anonymous";
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
      error: `Limite libre-service atteinte (${anonDailyLimit} essais gratuits aujourd'hui). Cree un compte gratuit pour continuer.`,
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

async function readRequestJson(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return JSON.parse(Buffer.concat(chunks).toString("utf8") || "{}");
}

async function readUpstreamJson(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      error: {
        message: text || "Reponse OpenAI illisible."
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
    throw new Error("La source doit etre une URL web en http ou https.");
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
    throw new Error("La source doit etre une page web lisible en texte.");
  }

  const text = cleanSourceText(await response.text());
  if (text.length < 80) {
    throw new Error("La page source ne contient pas assez de texte lisible.");
  }

  return { url: sourceUrl, text };
}

async function handleSignup(req, res) {
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
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
  }
}

async function handleLogin(req, res) {
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
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
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
  try {
    const { code = "" } = await readRequestJson(req);
    const expectedCode = String(process.env.ACCESS_CODE || "VOLTIA-YB-2026");

    if (String(code || "").trim() !== expectedCode) {
      sendJson(res, 401, { error: "Code d'acces incorrect." });
      return;
    }

    const store = await loadUserStore();
    const token = randomBytes(32).toString("hex");
    store.sessions[token] = {
      accessPass: true,
      name: "Createur Voltia",
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + sessionDays * 24 * 60 * 60 * 1000).toISOString()
    };
    await saveUserStore(store);

    sendJsonWithHeaders(
      res,
      200,
      {
        accessPass: true,
        accessName: "Createur Voltia",
        message: "Acces complet active."
      },
      { "Set-Cookie": sessionCookie(req, token) }
    );
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
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

function publicReport(report) {
  return {
    id: report.id,
    title: report.title || "Rapport Voltia",
    preview: report.preview || "",
    createdAt: report.createdAt || ""
  };
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

  const reports = Array.isArray(auth.user.reports) ? auth.user.reports : [];
  sendJson(res, 200, { reports: reports.slice(0, 12).map(publicReport) });
}

async function handleGetReport(req, res, reportId) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour reprendre une conversation." });
    return;
  }

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
      ...publicReport(report),
      conversation
    }
  });
}

async function handleSaveReport(req, res) {
  const auth = await getSessionUser(req);
  if (!auth.user) {
    sendJson(res, 401, { error: "Connecte-toi pour sauvegarder un rapport." });
    return;
  }

  try {
    const { title = "", preview = "", html = "", conversation = [] } = await readRequestJson(req);
    const cleanTitle = String(title || "Rapport Voltia").trim().slice(0, 120) || "Rapport Voltia";
    const cleanPreview = String(preview || "").trim().replace(/\s+/g, " ").slice(0, 220);
    const cleanHtml = String(html || "").slice(0, 180000);
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
    const report = {
      id: randomBytes(10).toString("hex"),
      title: cleanTitle,
      preview: cleanPreview,
      html: cleanHtml,
      conversation: cleanConversation,
      createdAt: new Date().toISOString()
    };

    auth.user.reports.unshift(report);
    auth.user.reports = auth.user.reports.slice(0, 20);
    auth.user.updatedAt = new Date().toISOString();
    await saveUserStore(auth.store);

    sendJson(res, 201, { report: publicReport(report), reports: auth.user.reports.slice(0, 12).map(publicReport) });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
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
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
  }
}

async function readRawBody(req) {
  const chunks = [];
  for await (const chunk of req) {
    chunks.push(chunk);
  }
  return Buffer.concat(chunks);
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
}

async function handleChat(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY manquant. Ajoute ta clé dans l'environnement puis relance le serveur."
    });
    return;
  }

  try {
    const usage = await consumeUsage(req, res, "chat");
    if (!usage.allowed) return;

    const { messages = [], sourceOnly = false, sourceUrl = "", normsSearch = false } = await readRequestJson(req);
    const sourceContext = sourceOnly ? await readSourcePage(sourceUrl) : null;
    const shouldSearchNorms = Boolean(normsSearch && !sourceContext);
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

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        tools: shouldSearchNorms ? [
          {
            type: "web_search",
            search_context_size: "medium"
          }
        ] : undefined,
        tool_choice: shouldSearchNorms ? "required" : undefined,
        instructions: [
          "Tu es Voltia, un assistant francais specialise dans l'electricite domestique.",
          "Aide l'utilisateur a comprendre les causes possibles, les verifications simples et les prochaines etapes.",
          "Organise toujours tes reponses avec des titres courts et des listes lisibles.",
          "Structure recommandee: Resume rapide, Securite, Causes possibles, A verifier sans danger, Prochaines etapes, Conclusion.",
          "Evite les gros paragraphes. Fais une idee par ligne ou par puce.",
          "Adapte le niveau de detail au niveau demande par l'utilisateur: debutant, confirme ou expert.",
          sourceContext
            ? `L'utilisateur a active le mode source unique. Tu dois repondre uniquement avec la source fournie (${sourceContext.url}). Si la source ne contient pas l'information demandee, dis clairement que la source indiquee ne permet pas de repondre. Cite l'URL source en fin de reponse. N'utilise pas tes connaissances generales pour completer.`
            : "",
          shouldSearchNorms
            ? "L'utilisateur a active le mode normes en vigueur. Lance une recherche web et traite la demande comme une recherche reglementaire francaise autour de la NF C 15-100, des textes publics applicables et des guides techniques fiables. Priorise les sources AFNOR, Légifrance, Service-public, Promotelec, Qualifelec, fabricants reconnus et guides techniques cites. Donne les exigences utiles au projet de l'utilisateur: hauteurs, volumes, protections, sections, calibres, emplacements, accessibilite, pieces d'eau, prises, eclairage, tableau et circuits quand c'est pertinent. Cite clairement les sources trouvees. Ne recopie pas de longs extraits de la NF C 15-100, car la norme officielle est protegee. Si l'information exacte n'est pas disponible dans les sources publiques, dis de verifier la NF C 15-100 officielle AFNOR ou de faire valider par un electricien qualifie. Ne presente jamais la reponse comme une attestation de conformite."
            : "",
          "Pour toute manipulation dangereuse, tableau electrique, fil denude, odeur de brule, fumee, echauffement, humidite, doute serieux ou intervention sous tension, conseille de couper le courant et de contacter un electricien qualifie.",
          "Ne donne pas d'instructions qui encouragent a travailler sous tension."
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
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
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

    const { image, context = "" } = await readRequestJson(req);
    if (!image || !String(image).startsWith("data:image/")) {
      sendJson(res, 400, { error: "Image manquante ou format non supporte." });
      return;
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: [
          "Tu es Voltia, un assistant francais specialise dans l'electricite domestique.",
          "Analyse la photo fournie pour retranscrire ce qui est visible en schema electrique simple.",
          "Ne pretend jamais voir ce qui n'est pas visible. Si la photo est floue ou incomplete, dis-le.",
          "Reponds en francais avec exactement ces sections: Resume rapide, Ce que je vois, Schema en traits, Legende, Points a verifier, Securite, Conclusion.",
          "Le schema en traits doit utiliser des caracteres simples avec L phase, N neutre, PE terre, protections, interrupteurs, lampes, prises ou borniers si visibles.",
          "Rappelle que le schema est indicatif et qu'il faut couper le courant et faire valider par un electricien qualifie avant toute intervention."
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
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
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

    const { reference = "", image = "" } = await readRequestJson(req);
    const cleanReference = String(reference || "").slice(0, 300).trim();
    const hasImage = image && String(image).startsWith("data:image/");

    if (!cleanReference && !hasImage) {
      sendJson(res, 400, { error: "Ajoute une reference ou une photo pour rechercher une notice." });
      return;
    }

    const userContent = [
      {
        type: "input_text",
        text: [
          "Recherche une notice technique ou notice utilisateur fiable pour cet appareil electrique.",
          `Reference saisie: ${cleanReference || "aucune reference texte"}.`,
          "Si une photo est fournie, lis la marque, le modele, la reference, les tensions/courants visibles, puis utilise ces elements pour chercher.",
          "Reponds en francais avec ces sections: Resume rapide, Reference identifiee, Liens de notice probables, Infos utiles, Points de vigilance, Conclusion.",
          "Dans Liens de notice probables, donne uniquement des liens ou sources que tu juges plausibles, avec le nom du site et pourquoi c'est probablement la bonne notice.",
          "Si tu n'es pas certain, dis clairement que la notice doit etre verifiee par comparaison exacte de la reference."
        ].join(" ")
      }
    ];

    if (hasImage) {
      userContent.push({
        type: "input_image",
        image_url: image
      });
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_SEARCH_MODEL || process.env.OPENAI_MODEL || "gpt-4.1-mini",
        tools: [{ type: "web_search_preview" }],
        instructions: [
          "Tu es Voltia, un assistant francais specialise dans l'electricite domestique.",
          "Tu aides a retrouver des notices constructeur a partir d'une reference texte ou d'une photo.",
          "Priorise les sources constructeur, distributeurs techniques reconnus, catalogues officiels et PDF de notice.",
          "Ne donne pas de certitude si la reference ne correspond pas exactement.",
          "N'invente jamais un lien. Si aucune notice fiable n'est trouvee, propose les mots-cles exacts a rechercher.",
          "Rappelle que les notices electriques doivent etre lues avant toute intervention et qu'il faut couper le courant pour toute manipulation."
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
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
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
    } = await readRequestJson(req);

    if (!image || !String(image).startsWith("data:image/")) {
      sendJson(res, 400, { error: "Plan manquant ou format non supporte." });
      return;
    }

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: [
          "Tu es Voltia, un assistant francais specialise dans l'eclairage domestique et le dimensionnement indicatif.",
          "Analyse le plan fourni et propose une implantation logique des eclairages selon les dimensions visibles, l'agencement, les zones de passage, les meubles, les plans de travail et l'usage de la piece.",
          "Si l'echelle ou les cotes ne sont pas lisibles, fais une estimation prudente et dis clairement ce qui manque.",
          "Utilise des objectifs de lux indicatifs: chambre 100 a 200 lux, salon 150 a 300 lux, cuisine 300 a 500 lux, plan de travail 500 lux, salle de bain 200 a 300 lux, couloir 100 a 150 lux, bureau 300 a 500 lux.",
          "Calcule une puissance indicative a partir des lumens, en rappelant qu'une LED courante donne environ 80 a 120 lm/W selon modele.",
          "Propose le type de luminaire adapte: spot encastre, suspension, plafonnier, rail, applique, ruban LED ou eclairage de tache.",
          "Ne presente pas le resultat comme une etude professionnelle. Rappelle de respecter les normes, volumes de salle d'eau, distances, IP, protections et validation par un electricien qualifie.",
          "Reponds avec exactement ces sections: Resume rapide, Lecture du plan, Hypotheses, Calcul indicatif, Implantation proposee, Plan en traits, Type et puissance des luminaires, Securite, Conclusion.",
          "Dans Plan en traits, fais un petit plan ASCII simple avec les points lumineux notes L1, L2, L3 et les zones importantes."
        ].join(" "),
        input: [
          {
            role: "user",
            content: [
              {
                type: "input_text",
                text: [
                  `Piece ou usage: ${String(room || "non precise").slice(0, 120)}.`,
                  `Dimensions connues: ${String(dimensions || "non precisees").slice(0, 120)}.`,
                  `Hauteur sous plafond: ${String(height || "non precisee").slice(0, 80)}.`,
                  `Type de luminaire souhaite: ${String(type || "non precise").slice(0, 80)}.`,
                  `Niveau de detail demande: ${String(level || "debutant").slice(0, 40)}.`,
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

    sendJson(res, 200, { reply: extractResponseText(data) || "Je n'ai pas pu dimensionner cet eclairage." });
  } catch (error) {
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
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

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: [
          "Tu es Voltia, un assistant francais specialise dans le dimensionnement indicatif de climatisation domestique.",
          "Explique une estimation de puissance de climatiseur a partir des donnees fournies.",
          "Ne presente jamais le resultat comme une etude thermique professionnelle.",
          "Rappelle qu'un bilan thermique reel depend des vitrages, murs, orientation, apports internes, ventilation, region, humidite et contraintes de pose.",
          "Reponds avec exactement ces sections: Resume rapide, Donnees prises en compte, Calcul indicatif, Puissance conseillee, Type de climatiseur, Points de vigilance, Conclusion.",
          "Donne la puissance en kW, W et BTU/h. Explique si l'appareil pourrait etre sous-dimensionne ou surdimensionne."
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
    sendJson(res, 500, { error: error.message || "Erreur serveur." });
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
    openaiConfigured: Boolean(process.env.OPENAI_API_KEY),
    stripeConfigured: Boolean(process.env.STRIPE_SECRET_KEY && process.env.STRIPE_PRICE_ID),
    checkedAt: new Date().toISOString()
  });
}

async function serveStatic(req, res) {
  const rawPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const decodedPath = decodeURIComponent(rawPath);
  const safePath = normalize(decodedPath).replace(/^[/\\]+/, "");
  const filePath = resolve(publicDir, safePath);

  if (!filePath.startsWith(resolve(publicDir))) {
    res.writeHead(403, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders() });
    res.end("Acces refuse");
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

createServer(async (req, res) => {
  if (req.method === "GET" && req.url === "/api/health") {
    await handleHealth(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/auth/signup") {
    await handleSignup(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/auth/login") {
    await handleLogin(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/auth/logout") {
    await handleLogout(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/access-code") {
    await handleAccessCode(req, res);
    return;
  }

  if (req.method === "GET" && req.url === "/api/auth/me") {
    await handleMe(req, res);
    return;
  }

  if (req.method === "GET" && req.url === "/api/reports") {
    await handleListReports(req, res);
    return;
  }

  if (req.method === "GET" && req.url.startsWith("/api/reports/")) {
    const reportId = decodeURIComponent(req.url.split("?")[0].replace("/api/reports/", ""));
    await handleGetReport(req, res, reportId);
    return;
  }

  if (req.method === "POST" && req.url === "/api/reports") {
    await handleSaveReport(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/billing/checkout") {
    await handleCreateCheckout(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/stripe-webhook") {
    await handleStripeWebhook(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/chat") {
    await handleChat(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/photo-schema") {
    await handlePhotoSchema(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/manual-search") {
    await handleManualSearch(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/lighting-plan") {
    await handleLightingPlan(req, res);
    return;
  }

  if (req.method === "POST" && req.url === "/api/climate-sizing") {
    await handleClimateSizing(req, res);
    return;
  }

  if (req.method === "GET") {
    await serveStatic(req, res);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8", ...securityHeaders() });
  res.end("Methode non autorisee");
}).listen(port, () => {
  console.log(`Voltia chat site: http://localhost:${port}`);
});
