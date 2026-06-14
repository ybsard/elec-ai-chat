const supabaseUrl = normalizeSupabaseUrl(process.env.SUPABASE_URL);
const serviceRoleKey = String(process.env.SUPABASE_SERVICE_ROLE_KEY || "");
const stateTable = String(process.env.SUPABASE_STATE_TABLE || "app_state");
const stateKey = "voltia_user_store";
const dryRun = String(process.env.DRY_RUN || "").trim() === "1";

if (!supabaseUrl || !serviceRoleKey) {
  console.error("SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis.");
  process.exit(1);
}

function normalizeSupabaseUrl(rawUrl) {
  return String(rawUrl || "")
    .trim()
    .replace(/\/rest\/v1\/?$/i, "")
    .replace(/\/+$/, "");
}

async function supabaseFetch(path, options = {}) {
  const response = await fetch(`${supabaseUrl}/rest/v1/${path}`, {
    ...options,
    headers: {
      apikey: serviceRoleKey,
      Authorization: `Bearer ${serviceRoleKey}`,
      "Content-Type": "application/json",
      ...(options.headers || {})
    }
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(`${options.method || "GET"} ${path} impossible: ${text || response.status}`);
  }

  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

async function loadLegacyStore() {
  const rows = await supabaseFetch(
    `${encodeURIComponent(stateTable)}?key=eq.${encodeURIComponent(stateKey)}&select=value`,
    {
      headers: { Accept: "application/json" }
    }
  );
  return rows?.[0]?.value || { users: [], sessions: {} };
}

async function upsertRows(table, rows, conflictKey = "id") {
  if (!rows.length) return;
  if (dryRun) {
    console.log(`[dry-run] ${table}: ${rows.length} ligne(s)`);
    return;
  }

  await supabaseFetch(`${table}?on_conflict=${encodeURIComponent(conflictKey)}`, {
    method: "POST",
    headers: { Prefer: "resolution=merge-duplicates" },
    body: JSON.stringify(rows)
  });
  console.log(`${table}: ${rows.length} ligne(s) upsert`);
}

function normalizeDate(value) {
  const date = value ? new Date(value) : new Date();
  return Number.isNaN(date.getTime()) ? new Date().toISOString() : date.toISOString();
}

function userRow(user) {
  return {
    id: user.id,
    name: user.name || "",
    email: user.email || "",
    password_hash: user.passwordHash || "",
    plan: user.plan || "free",
    subscription_status: user.subscriptionStatus || "free",
    usage: user.usage || null,
    last_feature: user.lastFeature || null,
    stripe_customer_id: user.stripeCustomerId || null,
    stripe_subscription_id: user.stripeSubscriptionId || null,
    created_at: normalizeDate(user.createdAt),
    updated_at: normalizeDate(user.updatedAt || user.createdAt)
  };
}

function sessionRows(sessions = {}) {
  return Object.entries(sessions).map(([token, session]) => ({
    token,
    user_id: session.userId || null,
    access_pass: Boolean(session.accessPass),
    name: session.name || null,
    created_at: normalizeDate(session.createdAt),
    expires_at: session.expiresAt ? normalizeDate(session.expiresAt) : null
  }));
}

function projectRows(users = []) {
  return users.flatMap((user) => (
    Array.isArray(user.projects) ? user.projects : []
  ).map((project) => ({
    id: project.id,
    user_id: user.id,
    name: project.name || "Dossier Voltia",
    description: project.description || "",
    created_at: normalizeDate(project.createdAt),
    updated_at: normalizeDate(project.updatedAt || project.createdAt)
  })));
}

function reportRows(users = []) {
  return users.flatMap((user) => (
    Array.isArray(user.reports) ? user.reports : []
  ).map((report) => ({
    id: report.id,
    user_id: user.id,
    project_id: report.projectId || null,
    title: report.title || "Rapport Voltia",
    preview: report.preview || "",
    html: report.html || "",
    conversation: Array.isArray(report.conversation) ? report.conversation : [],
    export_version: Number(report.exportVersion || 1),
    created_at: normalizeDate(report.createdAt)
  })));
}

const store = await loadLegacyStore();
const users = Array.isArray(store.users) ? store.users : [];
const sessions = store.sessions && typeof store.sessions === "object" ? store.sessions : {};

console.log(`Migration Voltia Supabase ${dryRun ? "(dry-run)" : ""}`);
console.log(`Utilisateurs: ${users.length}`);
console.log(`Sessions: ${Object.keys(sessions).length}`);

await upsertRows("voltia_users", users.map(userRow));
await upsertRows("voltia_projects", projectRows(users));
await upsertRows("voltia_reports", reportRows(users));
await upsertRows("voltia_sessions", sessionRows(sessions), "token");

console.log("Migration terminee.");
