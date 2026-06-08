const form = document.querySelector("#chatForm");
const promptInput = document.querySelector("#prompt");
const messagesEl = document.querySelector("#messages");
const clearButton = document.querySelector("#clearChat");
const hint = document.querySelector("#hint");
const counter = document.querySelector("#counter");
const sendButton = document.querySelector("#sendButton");
const sourceOnlyToggle = document.querySelector("#sourceOnlyToggle");
const sourceUrlInput = document.querySelector("#sourceUrlInput");
const suggestionButtons = document.querySelectorAll("[data-prompt]");
const issueButtons = document.querySelectorAll("[data-issue]");
const levelButtons = document.querySelectorAll("[data-level]");
const accountStatus = document.querySelector("#accountStatus");
const authFields = document.querySelector("#authFields");
const accessCodeFields = document.querySelector("#accessCodeFields");
const accessCodeInput = document.querySelector("#accessCodeInput");
const accessCodeButton = document.querySelector("#accessCodeButton");
const authName = document.querySelector("#authName");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const signupButton = document.querySelector("#signupButton");
const loginButton = document.querySelector("#loginButton");
const memberActions = document.querySelector("#memberActions");
const upgradeButton = document.querySelector("#upgradeButton");
const logoutButton = document.querySelector("#logoutButton");
const symptomInput = document.querySelector("#symptomInput");
const riskSelect = document.querySelector("#riskSelect");
const startDiagnostic = document.querySelector("#startDiagnostic");
const schemaType = document.querySelector("#schemaType");
const schemaRoom = document.querySelector("#schemaRoom");
const schemaUse = document.querySelector("#schemaUse");
const socketCount = document.querySelector("#socketCount");
const lightCount = document.querySelector("#lightCount");
const switchCount = document.querySelector("#switchCount");
const createSchema = document.querySelector("#createSchema");
const photoInput = document.querySelector("#photoInput");
const photoLabel = document.querySelector("#photoLabel");
const photoPreview = document.querySelector("#photoPreview");
const photoContext = document.querySelector("#photoContext");
const analyzePhoto = document.querySelector("#analyzePhoto");
const manualReference = document.querySelector("#manualReference");
const manualPhotoInput = document.querySelector("#manualPhotoInput");
const manualPhotoLabel = document.querySelector("#manualPhotoLabel");
const manualPhotoPreview = document.querySelector("#manualPhotoPreview");
const searchManual = document.querySelector("#searchManual");
const lightingPlanInput = document.querySelector("#lightingPlanInput");
const lightingPlanLabel = document.querySelector("#lightingPlanLabel");
const lightingPlanPreview = document.querySelector("#lightingPlanPreview");
const lightingRoom = document.querySelector("#lightingRoom");
const lightingDimensions = document.querySelector("#lightingDimensions");
const lightingHeight = document.querySelector("#lightingHeight");
const lightingType = document.querySelector("#lightingType");
const analyzeLighting = document.querySelector("#analyzeLighting");
const climateArea = document.querySelector("#climateArea");
const climateHeight = document.querySelector("#climateHeight");
const climateRoom = document.querySelector("#climateRoom");
const climateInsulation = document.querySelector("#climateInsulation");
const climateSun = document.querySelector("#climateSun");
const climatePeople = document.querySelector("#climatePeople");
const climateHeatSources = document.querySelector("#climateHeatSources");
const climateRegion = document.querySelector("#climateRegion");
const sizeClimate = document.querySelector("#sizeClimate");

const messages = [];
const maxLength = Number(promptInput.getAttribute("maxlength") || 1200);
let selectedIssue = "Disjoncteur qui saute";
let selectedPhotoDataUrl = "";
let selectedManualPhotoDataUrl = "";
let selectedLightingPlanDataUrl = "";
let selectedLevel = "debutant";
let currentUser = null;
let hasAccessPass = false;

function updateCounter() {
  counter.textContent = `${promptInput.value.length} / ${maxLength}`;
}

function addMessage(role, content, options = {}) {
  const item = document.createElement("article");
  item.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "VO" : "AI";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = role === "user" ? "Vous" : "Voltia";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (options.loading) {
    bubble.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
  } else if (role === "assistant") {
    bubble.classList.add("formatted-response");
    bubble.innerHTML = renderAssistantContent(content);
  } else {
    bubble.textContent = content;
  }

  stack.append(label, bubble);

  if (role === "assistant" && !options.loading && content) {
    stack.append(createCopyAction(content));
  }

  item.append(avatar, stack);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return item;
}

function createCopyAction(content) {
  const actions = document.createElement("div");
  actions.className = "message-actions";

  const copyButton = document.createElement("button");
  copyButton.type = "button";
  copyButton.textContent = "Copier";
  copyButton.addEventListener("click", async () => {
    await navigator.clipboard.writeText(content);
    copyButton.textContent = "Copie";
    setTimeout(() => {
      copyButton.textContent = "Copier";
    }, 1200);
  });

  actions.append(copyButton);
  return actions;
}

function setAssistantMessage(item, content) {
  const bubble = item.querySelector(".bubble");
  bubble.classList.add("formatted-response");
  bubble.innerHTML = renderAssistantContent(content);
  item.querySelector(".message-stack").append(createCopyAction(content));
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function formatInline(value) {
  return escapeHtml(value)
    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
    .replace(/`([^`]+)`/g, "<code>$1</code>");
}

function renderAssistantContent(content) {
  const lines = String(content || "").replace(/\r\n/g, "\n").split("\n");
  const html = [];
  let listItems = [];
  let codeLines = [];
  let inCode = false;

  function flushList() {
    if (!listItems.length) return;
    html.push(`<ul>${listItems.map((item) => `<li>${formatInline(item)}</li>`).join("")}</ul>`);
    listItems = [];
  }

  function flushCode() {
    if (!codeLines.length) return;
    html.push(`<pre class="response-code">${escapeHtml(codeLines.join("\n"))}</pre>`);
    codeLines = [];
  }

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (line.startsWith("```")) {
      if (inCode) {
        flushCode();
        inCode = false;
      } else {
        flushList();
        inCode = true;
      }
      continue;
    }

    if (inCode) {
      codeLines.push(rawLine);
      continue;
    }

    if (!line) {
      flushList();
      continue;
    }

    const headingMatch = /^(?:#{1,3}\s*)?(?:\d+[.)]\s*)?([A-ZÀ-Ÿ][A-Za-zÀ-ÿ0-9\s'’/-]{2,38})\s*:?\s*$/.exec(line);
    const listMatch = /^(?:[-*•]|\d+[.)])\s+(.+)$/.exec(line);

    if (listMatch) {
      listItems.push(listMatch[1]);
      continue;
    }

    flushList();

    if (headingMatch && line.length <= 48) {
      html.push(`<h3>${formatInline(headingMatch[1])}</h3>`);
    } else {
      html.push(`<p>${formatInline(line)}</p>`);
    }
  }

  flushList();
  flushCode();

  return html.join("") || "<p>Je n'ai pas pu generer de reponse.</p>";
}

function addDiagramMessage(title, svgMarkup, note, lineSchema = "") {
  const item = document.createElement("article");
  item.className = "message assistant";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "AI";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = "Voltia";

  const bubble = document.createElement("div");
  bubble.className = "bubble diagram-bubble";
  bubble.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    ${lineSchema ? `<pre class="line-schema">${escapeHtml(lineSchema)}</pre>` : ""}
    <div class="diagram-frame">${svgMarkup}</div>
    <p>${escapeHtml(note)}</p>
  `;

  stack.append(label, bubble);
  item.append(avatar, stack);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addPhotoMessage(dataUrl, context) {
  const item = document.createElement("article");
  item.className = "message user";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "VO";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = "Vous";

  const bubble = document.createElement("div");
  bubble.className = "bubble photo-bubble";
  bubble.innerHTML = `
    <strong>Photo a retranscrire en schema</strong>
    <img src="${dataUrl}" alt="Photo envoyee pour analyse">
    <span>${escapeHtml(context || "Sans contexte ajoute")}</span>
  `;

  stack.append(label, bubble);
  item.append(avatar, stack);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addManualSearchMessage(reference, dataUrl) {
  const item = document.createElement("article");
  item.className = "message user";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "VO";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = "Vous";

  const bubble = document.createElement("div");
  bubble.className = "bubble photo-bubble";
  bubble.innerHTML = `
    <strong>Recherche de notice</strong>
    ${dataUrl ? `<img src="${dataUrl}" alt="Photo de reference envoyee">` : ""}
    <span>${escapeHtml(reference || "Recherche depuis la photo uniquement")}</span>
  `;

  stack.append(label, bubble);
  item.append(avatar, stack);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addLightingPlanMessage(details, dataUrl) {
  const item = document.createElement("article");
  item.className = "message user";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "VO";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = "Vous";

  const bubble = document.createElement("div");
  bubble.className = "bubble photo-bubble";
  bubble.innerHTML = `
    <strong>Dimensionnement eclairage</strong>
    ${dataUrl ? `<img src="${dataUrl}" alt="Plan envoye pour dimensionnement">` : ""}
    <span>${escapeHtml(details || "Plan et contexte envoyes")}</span>
  `;

  stack.append(label, bubble);
  item.append(avatar, stack);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function addClimateSizingMessage(details) {
  const item = document.createElement("article");
  item.className = "message user";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "VO";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = "Vous";

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = `Dimensionnement climatisation\n${details}`;

  stack.append(label, bubble);
  item.append(avatar, stack);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
}

function autosize() {
  promptInput.style.height = "auto";
  promptInput.style.height = `${promptInput.scrollHeight}px`;
  updateCounter();
}

async function readJsonResponse(response) {
  const text = await response.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {
      error: text || "Reponse serveur illisible."
    };
  }
}

function updateAccountUi(user, meta = {}) {
  currentUser = user || null;
  hasAccessPass = Boolean(meta.accessPass);

  if (hasAccessPass) {
    accountStatus.textContent = `${meta.accessName || "Acces invite"} | Acces complet actif | Toutes les fonctionnalites sont debloquees.`;
    authFields.hidden = false;
    accessCodeFields.hidden = true;
    authFields.hidden = true;
    memberActions.hidden = false;
    upgradeButton.hidden = true;
    logoutButton.hidden = false;
    return;
  }

  if (!currentUser) {
    accountStatus.textContent = `Libre-service: ${meta.anonymousDailyLimit || 5} essais gratuits. Ensuite, cree un compte, passe Pro ou entre ton code d'acces.`;
    accessCodeFields.hidden = false;
    authFields.hidden = false;
    memberActions.hidden = true;
    upgradeButton.hidden = true;
    logoutButton.hidden = true;
    return;
  }

  const planLabel = currentUser.plan === "pro" ? "Pro" : "Gratuit";
  const displayName = currentUser.name || currentUser.email;
  const usage = currentUser.plan === "pro"
    ? "utilisation etendue"
    : `${currentUser.usageToday || 0} / ${currentUser.freeDailyLimit || 10} utilisations aujourd'hui`;

  accountStatus.textContent = `Bonjour ${displayName} | Offre ${planLabel} | ${usage}`;
  accessCodeFields.hidden = true;
  authFields.hidden = true;
  memberActions.hidden = false;
  upgradeButton.hidden = currentUser.plan === "pro";
  logoutButton.hidden = false;
}

function setAccountNotice(message) {
  accountStatus.textContent = message;
}

function setHint(message, important = false) {
  hint.textContent = message;
  hint.classList.toggle("important-hint", important);
}

function getSourceSettings() {
  const enabled = sourceOnlyToggle.checked;
  const url = sourceUrlInput.value.trim();
  return { enabled, url };
}

async function refreshAccount() {
  try {
    const response = await fetch("/api/auth/me");
    const data = await readJsonResponse(response);
    updateAccountUi(data.user, data);
  } catch {
    updateAccountUi(null);
  }
}

async function submitAuth(mode) {
  const name = authName.value.trim();
  const email = authEmail.value.trim();
  const password = authPassword.value;
  const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";

  if (mode === "signup" && !name) {
    setAccountNotice("Entre ton nom ou prenom pour personnaliser ton compte.");
    setHint("Entre ton nom ou prenom.");
    authName.focus();
    return;
  }

  if (!email || !password) {
    setAccountNotice("Entre un email et un mot de passe.");
    setHint("Entre un email et un mot de passe.");
    return;
  }

  signupButton.disabled = true;
  loginButton.disabled = true;
  setAccountNotice(mode === "signup" ? "Creation du compte en cours..." : "Connexion en cours...");
  setHint(mode === "signup" ? "Creation du compte..." : "Connexion...");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }

    authPassword.value = "";
    updateAccountUi(data.user);
    const displayName = data.user.name || data.user.email;
    if (mode === "signup") {
      setAccountNotice(`Bienvenue ${displayName}. Ton compte gratuit est pret. Clique sur Passer Pro pour activer l'abonnement.`);
      setHint(`Compte cree pour ${displayName}. Tu peux maintenant cliquer sur Passer Pro.`);
    } else {
      setAccountNotice(`Bonjour ${displayName}. Connexion reussie. Clique sur Passer Pro si tu veux t'abonner.`);
      setHint("Connexion reussie.");
    }
  } catch (error) {
    setAccountNotice(error.message);
    setHint(error.message);
  } finally {
    signupButton.disabled = false;
    loginButton.disabled = false;
  }
}

async function logoutAccount() {
  await fetch("/api/auth/logout", { method: "POST" });
  updateAccountUi(null, { anonymousDailyLimit: 5 });
  setHint("Tu es deconnecte.");
}

async function submitAccessCode() {
  const code = accessCodeInput.value.trim();

  if (!code) {
    setAccountNotice("Entre ton code d'acces.");
    accessCodeInput.focus();
    return;
  }

  accessCodeButton.disabled = true;
  setAccountNotice("Verification du code d'acces...");

  try {
    const response = await fetch("/api/access-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }

    accessCodeInput.value = "";
    updateAccountUi(null, data);
    setHint("Acces complet active sans compte.");
  } catch (error) {
    setAccountNotice(error.message);
    setHint(error.message);
  } finally {
    accessCodeButton.disabled = false;
  }
}

async function startCheckout() {
  if (!currentUser) {
    setAccountNotice("Connecte-toi ou cree un compte avant de passer en Pro.");
    setHint("Connecte-toi ou cree un compte avant de passer Pro.", true);
    return;
  }

  upgradeButton.disabled = true;
  setAccountNotice("Preparation du paiement Stripe...");
  setHint("Preparation du paiement Stripe...");

  try {
    const response = await fetch("/api/billing/checkout", { method: "POST" });
    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }
    setAccountNotice("Redirection vers Stripe...");
    window.location.href = data.url;
  } catch (error) {
    setAccountNotice(error.message);
    setHint(error.message);
  } finally {
    upgradeButton.disabled = false;
  }
}

function buildDiagnosticPrompt() {
  const symptom = symptomInput.value.trim() || "L'utilisateur n'a pas encore donne de detail.";
  const risk = riskSelect.value;
  return [
    "Demande de diagnostic electrique guide.",
    `Type de probleme: ${selectedIssue}.`,
    `Observation: ${symptom}.`,
    `Niveau de risque indique: ${risk}.`,
    buildLevelInstruction(),
    buildResponseFormatInstruction(),
    "Reponds avec: 1) verdict securite, 2) causes possibles, 3) verifications simples sans danger, 4) quand appeler un electricien, 5) resume final."
  ].join("\n");
}

function buildLevelInstruction() {
  const instructions = {
    debutant: "Niveau de reponse: debutant. Reponds avec des mots simples, des etapes courtes, une organisation tres lisible et peu de jargon.",
    confirme: "Niveau de reponse: confirme. Reponds avec des explications plus completes, les raisons techniques principales, et une structure claire.",
    expert: "Niveau de reponse: expert. Reponds de facon approfondie, avec hypotheses, logique de diagnostic, limites, points normatifs generaux et details techniques utiles, sans donner d'instructions dangereuses sous tension."
  };
  return instructions[selectedLevel] || instructions.debutant;
}

function buildResponseFormatInstruction() {
  return [
    "Organisation obligatoire de la reponse:",
    "Utilise des titres courts suivis de listes.",
    "Structure recommandee: Resume rapide, Securite, Causes possibles, A verifier sans danger, Prochaines etapes, Conclusion.",
    "Ne fais pas de gros paragraphes: 1 idee par ligne ou par puce.",
    "Mets les avertissements importants dans la section Securite."
  ].join("\n");
}

function clampCount(value, fallback, min, max) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return fallback;
  return Math.min(Math.max(parsed, min), max);
}

function getSchemaCounts() {
  return {
    sockets: clampCount(socketCount.value, 1, 0, 12),
    lights: clampCount(lightCount.value, 1, 0, 8),
    switches: clampCount(switchCount.value, 1, 0, 6)
  };
}

function syncSchemaDefaults() {
  if (schemaType.value === "prise" && Number(socketCount.value) === 0) {
    socketCount.value = "1";
  }
  if (schemaType.value === "eclairage") {
    if (Number(lightCount.value) === 0) lightCount.value = "1";
    if (Number(switchCount.value) === 0) switchCount.value = "1";
  }
  if (schemaType.value === "va-et-vient" && Number(switchCount.value) < 2) {
    switchCount.value = "2";
  }
}

function buildSchema(type, room, usage, counts = {}) {
  const safeRoom = escapeHtml(room || "piece a definir");
  const safeUsage = escapeHtml(usage || "usage a definir");
  const socketTotal = clampCount(counts.sockets, 1, 0, 12);
  const lightTotal = clampCount(counts.lights, 1, 0, 8);
  const switchTotal = clampCount(counts.switches, type === "va-et-vient" ? 2 : 1, 0, 6);
  const quantityLine = `Prises: ${socketTotal} | Lumieres: ${lightTotal} | Interrupteurs: ${switchTotal}`;
  const header = `
    <text class="diagram-title" x="24" y="28">Schema electrique - ${safeRoom}</text>
    <text class="diagram-subtitle" x="24" y="48">Usage: ${safeUsage} | ${quantityLine}</text>
    <g class="legend">
      <line class="wire phase" x1="384" y1="24" x2="418" y2="24" /><text x="425" y="28">L phase</text>
      <line class="wire neutral" x1="384" y1="42" x2="418" y2="42" /><text x="425" y="46">N neutre</text>
      <line class="wire earth" x1="384" y1="60" x2="418" y2="60" /><text x="425" y="64">PE terre</text>
    </g>
  `;

  const note = `<text class="diagram-note" x="24" y="268">Schema de principe indicatif. Respecter la norme applicable et faire valider par un electricien qualifie.</text>`;

  const socketSymbols = Array.from({ length: Math.max(socketTotal, 1) }, (_, index) => {
    const y = 86 + index * 42;
    return `
      <g class="symbol socket">
        <rect x="486" y="${y - 16}" width="72" height="34" rx="7" />
        <circle cx="512" cy="${y}" r="4" />
        <circle cx="532" cy="${y}" r="4" />
        <path d="M 522 ${y + 8} v 9 m -8 0 h 16" />
        <text x="522" y="${y + 31}">Prise ${index + 1}</text>
      </g>
      <path class="wire phase" d="M 126 132 H 300 V ${y - 10} H 486" />
      <path class="wire neutral" d="M 126 150 H 318 V ${y} H 486" />
      <path class="wire earth" d="M 126 168 H 300 V ${y + 10} H 486" />
    `;
  }).join("");

  const switchSymbols = Array.from({ length: Math.max(switchTotal, 1) }, (_, index) => {
    const x = 214 + index * 78;
    return `
      <g class="symbol switch">
        <circle cx="${x}" cy="132" r="7" />
        <circle cx="${x + 36}" cy="132" r="7" />
        <line x1="${x + 7}" y1="132" x2="${x + 30}" y2="118" />
        <text x="${x + 18}" y="166">INT ${index + 1}</text>
      </g>
    `;
  }).join("");

  const lightSymbols = Array.from({ length: Math.max(lightTotal, 1) }, (_, index) => {
    const y = 92 + index * 48;
    return `
      <g class="symbol lamp">
        <circle cx="536" cy="${y}" r="22" />
        <line x1="522" y1="${y - 14}" x2="550" y2="${y + 14}" />
        <line x1="550" y1="${y - 14}" x2="522" y2="${y + 14}" />
        <text x="536" y="${y + 38}">Lampe ${index + 1}</text>
      </g>
      <path class="wire phase" d="M ${214 + Math.max(switchTotal - 1, 0) * 78 + 36} 132 H 430 V ${y} H 514" />
      <path class="wire neutral" d="M 126 158 H 178 V ${y + 8} H 514" />
      <path class="wire earth" d="M 126 174 H 162 V ${y + 16} H 514" />
    `;
  }).join("");

  const vaSwitchSymbols = Array.from({ length: Math.max(switchTotal, 2) }, (_, index) => {
    const x = 180 + index * 88;
    return `
      <g class="symbol switch">
        <circle cx="${x}" cy="120" r="6" />
        <circle cx="${x}" cy="152" r="6" />
        <circle cx="${x + 36}" cy="136" r="6" />
        <line x1="${x + 6}" y1="${index % 2 === 0 ? 120 : 152}" x2="${x + 30}" y2="136" />
        <text x="${x + 18}" y="184">VA ${index + 1}</text>
      </g>
    `;
  }).join("");

  const vaLightSymbols = Array.from({ length: Math.max(lightTotal, 1) }, (_, index) => {
    const y = 104 + index * 42;
    const lastSwitchX = 180 + (Math.max(switchTotal, 2) - 1) * 88 + 36;
    return `
      <g class="symbol lamp">
        <circle cx="548" cy="${y}" r="20" />
        <line x1="535" y1="${y - 13}" x2="561" y2="${y + 13}" />
        <line x1="561" y1="${y - 13}" x2="535" y2="${y + 13}" />
        <text x="548" y="${y + 34}">Lampe ${index + 1}</text>
      </g>
      <path class="wire phase" d="M ${lastSwitchX} 136 H 476 V ${y} H 528" />
      <path class="wire neutral" d="M 112 160 H 150 V ${y + 8} H 528" />
      <path class="wire earth" d="M 112 176 H 138 V ${y + 16} H 528" />
    `;
  }).join("");

  if (type === "prise") {
    return `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schema circuit prise dynamique">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="118" height="126" rx="8" />
          <text x="87" y="112">Tableau</text>
          <rect x="48" y="130" width="78" height="38" rx="5" />
          <text x="87" y="153">DJ 16/20A</text>
        </g>
        ${socketSymbols}
        <text class="wire-label" x="205" y="118">Alimentation prise(s) en parallele</text>
        ${note}
      </svg>
    `;
  }

  if (type === "eclairage") {
    return `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schema eclairage dynamique">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="118" height="126" rx="8" />
          <text x="87" y="112">Tableau</text>
          <rect x="48" y="130" width="78" height="38" rx="5" />
          <text x="87" y="153">DJ 10/16A</text>
        </g>
        ${switchSymbols}
        <path class="wire phase" d="M 126 138 H 214" />
        ${lightSymbols}
        <text class="wire-label" x="232" y="106">Commande(s)</text>
        <text class="wire-label" x="390" y="230">N et PE distribues vers point(s) lumineux</text>
        ${note}
      </svg>
    `;
  }

  if (type === "va-et-vient") {
    const firstX = 180;
    const lastX = 180 + (Math.max(switchTotal, 2) - 1) * 88;
    return `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schema va-et-vient dynamique">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="104" height="126" rx="8" />
          <text x="80" y="112">Tableau</text>
          <rect x="48" y="130" width="64" height="38" rx="5" />
          <text x="80" y="153">DJ</text>
        </g>
        ${vaSwitchSymbols}
        <path class="wire phase" d="M 112 140 H ${firstX + 36}" />
        <path class="wire traveler" d="M ${firstX} 120 H ${lastX}" />
        <path class="wire traveler" d="M ${firstX} 152 H ${lastX}" />
        ${vaLightSymbols}
        <text class="wire-label" x="310" y="112">Navette 1</text>
        <text class="wire-label" x="310" y="170">Navette 2</text>
        ${note}
      </svg>
    `;
  }

  const templates = {
    prise: `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schema circuit prise">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="118" height="126" rx="8" />
          <text x="87" y="112">Tableau</text>
          <rect x="48" y="130" width="78" height="38" rx="5" />
          <text x="87" y="153">DJ 16/20A</text>
        </g>
        <g class="symbol socket">
          <rect x="486" y="102" width="88" height="88" rx="12" />
          <circle cx="520" cy="146" r="6" />
          <circle cx="542" cy="146" r="6" />
          <path d="M 531 166 v 14 m -11 0 h 22" />
          <text x="530" y="212">Prise 2P+T</text>
        </g>
        <path class="wire phase" d="M 126 138 H 292 V 120 H 486" />
        <path class="wire neutral" d="M 126 150 H 308 V 146 H 486" />
        <path class="wire earth" d="M 126 162 H 292 V 174 H 486" />
        <text class="wire-label" x="306" y="114">L</text>
        <text class="wire-label" x="318" y="141">N</text>
        <text class="wire-label" x="304" y="193">PE</text>
        ${note}
      </svg>
    `,
    eclairage: `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schema eclairage simple allumage">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="118" height="126" rx="8" />
          <text x="87" y="112">Tableau</text>
          <rect x="48" y="130" width="78" height="38" rx="5" />
          <text x="87" y="153">DJ 10/16A</text>
        </g>
        <g class="symbol switch">
          <circle cx="318" cy="137" r="8" />
          <circle cx="358" cy="137" r="8" />
          <line x1="326" y1="137" x2="352" y2="119" />
          <text x="338" y="178">Interrupteur</text>
        </g>
        <g class="symbol lamp">
          <circle cx="522" cy="137" r="30" />
          <line x1="503" y1="118" x2="541" y2="156" />
          <line x1="541" y1="118" x2="503" y2="156" />
          <text x="522" y="185">Point lumineux</text>
        </g>
        <path class="wire phase" d="M 126 138 H 318" />
        <path class="wire phase" d="M 358 137 H 492" />
        <path class="wire neutral" d="M 126 158 H 230 V 212 H 522 V 167" />
        <path class="wire earth" d="M 126 174 H 214 V 232 H 522 V 170" />
        <text class="wire-label" x="220" y="132">L coupe par interrupteur</text>
        <text class="wire-label" x="362" y="207">N direct lampe</text>
        ${note}
      </svg>
    `,
    "va-et-vient": `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schema va-et-vient simplifie">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="104" height="126" rx="8" />
          <text x="80" y="112">Tableau</text>
          <rect x="48" y="130" width="64" height="38" rx="5" />
          <text x="80" y="153">DJ</text>
        </g>
        <g class="symbol switch">
          <circle cx="230" cy="126" r="7" /><circle cx="230" cy="156" r="7" /><circle cx="270" cy="141" r="7" />
          <line x1="237" y1="126" x2="263" y2="141" />
          <text x="250" y="190">Va-et-vient A</text>
        </g>
        <g class="symbol switch">
          <circle cx="378" cy="126" r="7" /><circle cx="378" cy="156" r="7" /><circle cx="418" cy="141" r="7" />
          <line x1="385" y1="156" x2="411" y2="141" />
          <text x="398" y="190">Va-et-vient B</text>
        </g>
        <g class="symbol lamp">
          <circle cx="536" cy="141" r="28" />
          <line x1="518" y1="123" x2="554" y2="159" />
          <line x1="554" y1="123" x2="518" y2="159" />
          <text x="536" y="190">Lampe</text>
        </g>
        <path class="wire phase" d="M 112 140 H 270" />
        <path class="wire traveler" d="M 230 126 H 378" />
        <path class="wire traveler" d="M 230 156 H 378" />
        <path class="wire phase" d="M 418 141 H 508" />
        <path class="wire neutral" d="M 112 160 H 168 V 222 H 536 V 169" />
        <path class="wire earth" d="M 112 176 H 152 V 242 H 536 V 171" />
        <text class="wire-label" x="300" y="118">Navette 1</text>
        <text class="wire-label" x="300" y="171">Navette 2</text>
        ${note}
      </svg>
    `,
    tableau: `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schema tableau electrique simplifie">
        ${header}
        <g class="symbol board large-board">
          <rect x="44" y="82" width="500" height="146" rx="10" />
          <text x="294" y="106">Tableau electrique simplifie</text>
          <rect x="72" y="132" width="82" height="52" rx="5" />
          <text x="113" y="154">Arrivee</text>
          <text x="113" y="170">230V</text>
          <rect x="190" y="126" width="112" height="64" rx="5" />
          <text x="246" y="150">Interrupteur</text>
          <text x="246" y="168">differentiel</text>
          <rect x="342" y="118" width="70" height="80" rx="5" />
          <text x="377" y="150">DJ</text>
          <text x="377" y="168">prises</text>
          <rect x="438" y="118" width="70" height="80" rx="5" />
          <text x="473" y="150">DJ</text>
          <text x="473" y="168">lumiere</text>
        </g>
        <path class="wire phase" d="M 154 148 H 190" />
        <path class="wire neutral" d="M 154 168 H 190" />
        <path class="wire phase" d="M 302 146 H 342" />
        <path class="wire neutral" d="M 302 170 H 342" />
        <path class="wire phase" d="M 302 138 H 438" />
        <path class="wire neutral" d="M 302 178 H 438" />
        <path class="wire earth" d="M 88 204 H 520" />
        <text class="wire-label" x="392" y="220">barrette de terre PE</text>
        ${note}
      </svg>
    `
  };

  return templates[type] || templates.prise;
}

function numberedRows(label, count, prefix = "") {
  const total = Math.max(count, 1);
  return Array.from({ length: total }, (_, index) => `${prefix}${label} ${index + 1}`).join("\n");
}

function buildLineSchema(type, counts = {}) {
  const socketTotal = clampCount(counts.sockets, 1, 0, 12);
  const lightTotal = clampCount(counts.lights, 1, 0, 8);
  const switchTotal = clampCount(counts.switches, type === "va-et-vient" ? 2 : 1, 0, 6);
  const socketBranches = numberedRows("[ PRISE 2P+T ]", socketTotal, "             ├──────────────> ");
  const lightBranches = numberedRows("[ LAMPE ]", lightTotal, "             ├──────────────> ");
  const switchChain = Array.from({ length: Math.max(switchTotal, 1) }, (_, index) => `[INT ${index + 1}]`).join(" ---- ");
  const vaSwitches = Math.max(switchTotal, 2);
  const vaChain = Array.from({ length: vaSwitches }, (_, index) => `[VA ${index + 1}]`).join(" == navettes == ");
  const schemas = {
    prise: `
TABLEAU ELECTRIQUE                      BOITE / PRISE 2P+T
┌────────────────────┐                  ┌────────────────────┐
│ Disjoncteur 16/20A │                  │        PRISE       │
│                    │                  │                    │
│ borne L   o────────┼──── phase L ─────┼──> borne L         │
│ borne N   o────────┼──── neutre N ────┼──> borne N         │
│ terre PE o─────────┼──── terre PE ────┼──> borne terre     │
└────────────────────┘                  └────────────────────┘

Lecture:
L  = phase, fil alimente
N  = neutre, retour du courant
PE = terre, protection des personnes

Repartition demandee:
${socketBranches}
    `,
    eclairage: `
TABLEAU ELECTRIQUE        COMMANDE(S)                         POINT(S) LUMINEUX
┌────────────────────┐    ┌────────────────────────────┐      ┌──────────────┐
│ Disjoncteur 10/16A │    │ ${switchChain.padEnd(26, " ")} │      │ LAMPE(S)     │
│                    │    │ entree L -> sortie retour  │      │              │
│ borne L   o────────┼────┤ phase coupee par commande  ├─────>│ borne L      │
│ borne N   o────────┼───────────────────────────────────────>│ borne N      │
│ terre PE o─────────┼───────────────────────────────────────>│ terre PE     │
└────────────────────┘                                        └──────────────┘

Lecture:
La phase L passe par l'interrupteur.
Le neutre N va directement a la lampe.
La terre PE va au point lumineux si le materiel en a besoin.

Points lumineux demandes:
${lightBranches}
    `,
    "va-et-vient": `
TABLEAU                         VA-ET-VIENT / COMMANDES                         LAMPE(S)
┌─────────┐       ┌──────────────────────────────────────────────────┐          ┌────────┐
│ DJ 10A  │       │ ${vaChain.padEnd(48, " ")} │          │        │
│ L o─────┼──────>│ commun entree -> navettes -> commun retour lampe ├─────────>│ borne L│
│ N o─────┼───────────────────────────────────────────────────────────────────>│ borne N│
│PE o─────┼───────────────────────────────────────────────────────────────────>│ terre  │
└─────────┘                                                                    └────────┘

Detail navettes:
VA 1 navette 1 ============================= VA 2 navette 1
VA 1 navette 2 ============================= VA 2 navette 2

Lecture:
La phase arrive sur le commun du premier va-et-vient.
Les deux navettes relient les deux interrupteurs.
Le commun du deuxieme interrupteur devient le retour lampe.
Le neutre et la terre vont directement au point lumineux.

Points lumineux demandes:
${lightBranches}
    `,
    tableau: `
ARRIVEE 230V
┌─────────────┐
│ L  N  PE    │
└────┬──┬──┬──┘
     │  │  │
     │  │  └──────────────> Barrette de terre PE
     │  │
     v  v
┌──────────────────────────┐
│ Interrupteur differentiel│ 30mA
│ entree L/N -> sortie L/N │
└────────────┬─────────────┘
             │
             ├──> [DJ prises 16/20A]  -> circuit prises
             │
             ├──> [DJ lumiere 10/16A] -> circuit eclairage
             │
             └──> [DJ dedie]          -> four, chauffe-eau, etc.

Lecture:
Le differentiel protege les personnes.
Les disjoncteurs protegent chaque circuit.
La terre PE est distribuee vers tous les circuits concernes.
    `
  };

  return (schemas[type] || schemas.prise).trim();
}

function buildSchemaPrompt() {
  const typeLabel = schemaType.options[schemaType.selectedIndex].textContent;
  const room = schemaRoom.value.trim() || "piece non precisee";
  const usage = schemaUse.value.trim() || "usage non precise";
  const counts = getSchemaCounts();
  return [
    "Explique ce schema electrique indicatif.",
    `Type: ${typeLabel}.`,
    `Piece: ${room}.`,
    `Usage ou puissance: ${usage}.`,
    `Nombre de prises: ${counts.sockets}.`,
    `Nombre de lumieres: ${counts.lights}.`,
    `Nombre d'interrupteurs: ${counts.switches}.`,
    buildLevelInstruction(),
    buildResponseFormatInstruction(),
    "Donne une explication simple, les points de securite, les limites du schema, puis rappelle qu'un schema reel doit respecter la norme applicable et etre valide par un electricien."
  ].join("\n");
}

function normalizeText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function hasAnyWord(text, words) {
  return words.some((word) => text.includes(word));
}

function isSchemaRequest(content) {
  const text = normalizeText(content);
  const asksForDrawing = /\bschema\b|\bplan electrique\b|\bcircuit\b|\bdessin(e|er)?\b|\btrace\b/.test(text);
  const asksForWiring = /\bbranch(e|er|ement)\b|\braccord(e|er|ement)\b|\bcabl(e|er|age)\b|\binstaller\b|\bcre(e|er)\b|\bfais\b|\bfaire\b|\bmontre\b|\bexplique\b/.test(text);
  const hasElectricalTarget = hasAnyWord(text, [
    "prise",
    "luminaire",
    "lumiere",
    "lampe",
    "interrupteur",
    "va-et-vient",
    "va et vient",
    "navette",
    "tableau",
    "differentiel",
    "disjoncteur"
  ]);

  return asksForDrawing || (asksForWiring && hasElectricalTarget);
}

function inferSchemaType(content) {
  const text = normalizeText(content);
  if (text.includes("va-et-vient") || text.includes("va et vient") || text.includes("navette")) {
    return "va-et-vient";
  }
  if (text.includes("tableau") || text.includes("differentiel") || text.includes("disjoncteur")) {
    return "tableau";
  }
  if (text.includes("lampe") || text.includes("lumiere") || text.includes("eclairage") || text.includes("interrupteur")) {
    return "eclairage";
  }
  return "prise";
}

function extractMentionedCount(text, words, fallback) {
  const numberWords = {
    un: 1,
    une: 1,
    deux: 2,
    trois: 3,
    quatre: 4,
    cinq: 5,
    six: 6,
    sept: 7,
    huit: 8,
    neuf: 9,
    dix: 10,
    onze: 11,
    douze: 12
  };
  const numberPattern = `(?:\\d+|${Object.keys(numberWords).join("|")})`;

  for (const word of words) {
    const before = new RegExp(`\\b(${numberPattern})\\s+${word}s?\\b`, "i").exec(text);
    const after = new RegExp(`\\b${word}s?\\s*(?:x|:|=)?\\s*(${numberPattern})\\b`, "i").exec(text);
    const match = before || after;

    if (match) {
      const rawValue = match[1].toLowerCase();
      return Number.parseInt(rawValue, 10) || numberWords[rawValue] || fallback;
    }
  }

  return fallback;
}

function inferSchemaCounts(content, type) {
  const text = normalizeText(content);
  const defaults = {
    sockets: type === "prise" ? 1 : 0,
    lights: type === "eclairage" || type === "va-et-vient" ? 1 : 0,
    switches: type === "eclairage" ? 1 : 0
  };

  const counts = {
    sockets: extractMentionedCount(text, ["prise"], defaults.sockets),
    lights: extractMentionedCount(text, ["lumiere", "lampe", "luminaire"], defaults.lights),
    switches: extractMentionedCount(text, ["interrupteur", "bouton", "commande"], defaults.switches)
  };

  if (type === "va-et-vient") {
    counts.lights = Math.max(counts.lights, 1);
    counts.switches = Math.max(counts.switches, 2);
  }

  if (type === "eclairage") {
    counts.lights = Math.max(counts.lights, 1);
    counts.switches = Math.max(counts.switches, 1);
  }

  if (type === "prise") {
    counts.sockets = Math.max(counts.sockets, 1);
  }

  return counts;
}

function schemaTitle(type) {
  const titles = {
    prise: "Circuit prise simple",
    eclairage: "Eclairage simple allumage",
    "va-et-vient": "Va-et-vient simplifie",
    tableau: "Tableau electrique simplifie"
  };
  return titles[type] || titles.prise;
}

function addAutomaticSchema(content) {
  const type = inferSchemaType(content);
  const counts = inferSchemaCounts(content, type);
  addDiagramMessage(
    schemaTitle(type),
    buildSchema(type, "demande du chat", content.slice(0, 90), counts),
    "Schema genere automatiquement depuis ta demande. Il reste indicatif et doit etre valide avant travaux.",
    buildLineSchema(type, counts)
  );
}

async function askAssistant(content, options = {}) {
  const contentForModel = `${content}\n\n${buildLevelInstruction()}\n${buildResponseFormatInstruction()}`;
  messages.push({ role: "user", content: contentForModel });
  addMessage("user", content);

  if (!options.skipAutoSchema && isSchemaRequest(content)) {
    addAutomaticSchema(content);
  }

  const pending = addMessage("assistant", "", { loading: true });
  sendButton.disabled = true;
  promptInput.disabled = true;
  const sourceSettings = getSourceSettings();
  hint.textContent = sourceSettings.enabled
    ? "Voltia lit la source indiquee puis prepare la reponse..."
    : "Voltia analyse les pistes possibles...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        sourceOnly: sourceSettings.enabled,
        sourceUrl: sourceSettings.url
      })
    });

    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }

    const reply = (data.reply || "").trim() || "Je n'ai pas pu generer de reponse.";
    setAssistantMessage(pending, reply);
    messages.push({ role: "assistant", content: reply });
    await refreshAccount();
    hint.textContent = sourceSettings.enabled
      ? "Reponse generee uniquement avec la source indiquee."
      : "Reponse generee. Precise le contexte si tu veux une piste plus exacte.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas repondre pour l'instant: ${error.message}`);
    hint.textContent = "Verifie OPENAI_API_KEY, le quota OpenAI et les logs Render si le site est en ligne.";
  } finally {
    sendButton.disabled = false;
    promptInput.disabled = false;
    promptInput.focus();
  }
}

async function analyzePhotoToSchema() {
  if (!selectedPhotoDataUrl) {
    hint.textContent = "Ajoute une photo avant de lancer l'analyse.";
    photoInput.focus();
    return;
  }

  const context = photoContext.value.trim();
  addPhotoMessage(selectedPhotoDataUrl, context);

  const pending = addMessage("assistant", "", { loading: true });
  analyzePhoto.disabled = true;
  hint.textContent = "Voltia analyse la photo et prepare un schema...";

  try {
    const response = await fetch("/api/photo-schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: selectedPhotoDataUrl,
        context
      })
    });

    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }

    const reply = (data.reply || "").trim() || "Je n'ai pas pu analyser cette photo.";
    setAssistantMessage(pending, reply);
    messages.push({
      role: "assistant",
      content: `Analyse photo vers schema:\n${reply}`
    });
    await refreshAccount();
    hint.textContent = "Photo analysee. Verifie toujours avec un electricien avant intervention.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas analyser cette photo pour l'instant: ${error.message}`);
    hint.textContent = "Verifie la cle API, le quota OpenAI ou essaye une image plus nette.";
  } finally {
    analyzePhoto.disabled = false;
  }
}

async function searchManualNotice() {
  const reference = manualReference.value.trim();

  if (!reference && !selectedManualPhotoDataUrl) {
    hint.textContent = "Ajoute une reference ou une photo avant de rechercher une notice.";
    manualReference.focus();
    return;
  }

  addManualSearchMessage(reference, selectedManualPhotoDataUrl);

  const pending = addMessage("assistant", "", { loading: true });
  searchManual.disabled = true;
  hint.textContent = "Voltia cherche la notice et les liens probables...";

  try {
    const response = await fetch("/api/manual-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        image: selectedManualPhotoDataUrl
      })
    });

    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }

    const reply = (data.reply || "").trim() || "Je n'ai pas pu trouver de notice fiable.";
    setAssistantMessage(pending, reply);
    messages.push({
      role: "assistant",
      content: `Recherche de notice:\n${reply}`
    });
    await refreshAccount();
    hint.textContent = "Recherche terminee. Verifie toujours que la reference correspond exactement a ton appareil.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas rechercher la notice pour l'instant: ${error.message}`);
    hint.textContent = "Verifie la cle API, le quota OpenAI ou retente avec une reference plus complete.";
  } finally {
    searchManual.disabled = false;
  }
}

async function analyzeLightingPlan() {
  if (!selectedLightingPlanDataUrl) {
    hint.textContent = "Ajoute un plan avant de lancer le dimensionnement eclairage.";
    lightingPlanInput.focus();
    return;
  }

  const room = lightingRoom.value.trim();
  const dimensions = lightingDimensions.value.trim();
  const height = lightingHeight.value.trim();
  const type = lightingType.value;
  const details = [
    room ? `Piece: ${room}` : "",
    dimensions ? `Dimensions: ${dimensions}` : "",
    height ? `Hauteur: ${height}` : "",
    type ? `Type souhaite: ${type}` : ""
  ].filter(Boolean).join(" | ");

  addLightingPlanMessage(details, selectedLightingPlanDataUrl);

  const pending = addMessage("assistant", "", { loading: true });
  analyzeLighting.disabled = true;
  hint.textContent = "Voltia analyse le plan et calcule une implantation d'eclairage...";

  try {
    const response = await fetch("/api/lighting-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: selectedLightingPlanDataUrl,
        room,
        dimensions,
        height,
        type,
        level: selectedLevel
      })
    });

    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }

    const reply = (data.reply || "").trim() || "Je n'ai pas pu dimensionner cet eclairage.";
    setAssistantMessage(pending, reply);
    messages.push({
      role: "assistant",
      content: `Dimensionnement eclairage:\n${reply}`
    });
    await refreshAccount();
    hint.textContent = "Dimensionnement genere. Verifie les cotes et fais valider avant travaux.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas dimensionner l'eclairage pour l'instant: ${error.message}`);
    hint.textContent = "Verifie la cle API, le quota OpenAI ou ajoute un plan plus lisible.";
  } finally {
    analyzeLighting.disabled = false;
  }
}

async function sizeClimateSystem() {
  const area = Number(climateArea.value);
  const height = Number(climateHeight.value || 2.5);

  if (!area || area < 5) {
    hint.textContent = "Indique une superficie valide pour dimensionner la clim.";
    climateArea.focus();
    return;
  }

  const payload = {
    area,
    height,
    room: climateRoom.value,
    insulation: climateInsulation.value,
    sun: climateSun.value,
    people: Number(climatePeople.value || 1),
    heatSources: climateHeatSources.value,
    region: climateRegion.value,
    level: selectedLevel
  };

  const details = [
    `${payload.area} m2`,
    `${payload.height} m de hauteur`,
    payload.room,
    `isolation ${payload.insulation.toLowerCase()}`,
    `exposition ${payload.sun.toLowerCase()}`,
    `${payload.people} personne(s)`,
    `appareils: ${payload.heatSources.toLowerCase()}`,
    `climat ${payload.region.toLowerCase()}`
  ].join(" | ");

  addClimateSizingMessage(details);

  const pending = addMessage("assistant", "", { loading: true });
  sizeClimate.disabled = true;
  hint.textContent = "Voltia estime la puissance de climatisation...";

  try {
    const response = await fetch("/api/climate-sizing", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    const data = await readJsonResponse(response);
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }

    const reply = (data.reply || "").trim() || "Je n'ai pas pu dimensionner cette climatisation.";
    setAssistantMessage(pending, reply);
    messages.push({
      role: "assistant",
      content: `Dimensionnement climatisation:\n${reply}`
    });
    await refreshAccount();
    hint.textContent = "Estimation clim generee. Verifie avec un frigoriste avant achat ou pose.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas dimensionner la clim pour l'instant: ${error.message}`);
    hint.textContent = "Verifie les donnees ou les logs Render si le site est en ligne.";
  } finally {
    sizeClimate.disabled = false;
  }
}

promptInput.addEventListener("input", autosize);

sourceOnlyToggle.addEventListener("change", () => {
  sourceUrlInput.disabled = !sourceOnlyToggle.checked;
  if (sourceOnlyToggle.checked) {
    sourceUrlInput.focus();
    hint.textContent = "Colle l'URL exacte de la page que Voltia doit utiliser comme seule source.";
  } else {
    hint.textContent = "Source libre: Voltia peut repondre avec ses connaissances generales.";
  }
});

promptInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter" && !event.shiftKey) {
    event.preventDefault();
    form.requestSubmit();
  }
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  const content = promptInput.value.trim();
  if (!content) return;
  const sourceSettings = getSourceSettings();
  if (sourceSettings.enabled && !sourceSettings.url) {
    setHint("Colle l'URL de la source avant d'envoyer la question.", true);
    sourceUrlInput.focus();
    return;
  }

  promptInput.value = "";
  autosize();
  await askAssistant(content);
});

clearButton.addEventListener("click", () => {
  messages.length = 0;
  messagesEl.innerHTML = "";
  addMessage("assistant", "Conversation effacee. Lance un diagnostic ou decris ton prochain probleme electrique.");
  hint.textContent = "Nouvelle recherche demarree.";
  promptInput.focus();
});

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt;
    autosize();
    promptInput.focus();
  });
});

issueButtons.forEach((button) => {
  button.addEventListener("click", () => {
    issueButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedIssue = button.dataset.issue;
    hint.textContent = `Type choisi: ${selectedIssue}. Ajoute ce que tu observes puis lance le diagnostic.`;
  });
});

levelButtons.forEach((button) => {
  button.addEventListener("click", () => {
    levelButtons.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    selectedLevel = button.dataset.level;
    hint.textContent = `Niveau choisi: ${button.textContent}. Les prochaines reponses seront adaptees.`;
  });
});

signupButton.addEventListener("click", () => submitAuth("signup"));
loginButton.addEventListener("click", () => submitAuth("login"));
accessCodeButton.addEventListener("click", submitAccessCode);
logoutButton.addEventListener("click", logoutAccount);
upgradeButton.addEventListener("click", startCheckout);

startDiagnostic.addEventListener("click", async () => {
  await askAssistant(buildDiagnosticPrompt());
});

createSchema.addEventListener("click", async () => {
  syncSchemaDefaults();
  const typeLabel = schemaType.options[schemaType.selectedIndex].textContent;
  const room = schemaRoom.value.trim();
  const usage = schemaUse.value.trim();
  const counts = getSchemaCounts();
  addDiagramMessage(
    typeLabel,
    buildSchema(schemaType.value, room, usage, counts),
    "Schema indicatif genere par Voltia. Ne pas intervenir sous tension.",
    buildLineSchema(schemaType.value, counts)
  );
  await askAssistant(buildSchemaPrompt(), { skipAutoSchema: true });
});

schemaType.addEventListener("change", () => {
  syncSchemaDefaults();
  hint.textContent = "Type de schema mis a jour. Ajuste les quantites puis cree le schema.";
});

photoInput.addEventListener("change", () => {
  const file = photoInput.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    hint.textContent = "Le fichier doit etre une image.";
    return;
  }

  if (file.size > 6 * 1024 * 1024) {
    hint.textContent = "Image trop lourde. Choisis une photo de moins de 6 Mo.";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    selectedPhotoDataUrl = String(reader.result || "");
    photoLabel.textContent = file.name;
    photoPreview.hidden = false;
    photoPreview.innerHTML = `<img src="${selectedPhotoDataUrl}" alt="Apercu de la photo">`;
    hint.textContent = "Photo chargee. Ajoute un contexte si besoin puis lance l'analyse.";
  });
  reader.readAsDataURL(file);
});

manualPhotoInput.addEventListener("change", () => {
  const file = manualPhotoInput.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    hint.textContent = "Le fichier doit etre une image.";
    return;
  }

  if (file.size > 6 * 1024 * 1024) {
    hint.textContent = "Image trop lourde. Choisis une photo de moins de 6 Mo.";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    selectedManualPhotoDataUrl = String(reader.result || "");
    manualPhotoLabel.textContent = file.name;
    manualPhotoPreview.hidden = false;
    manualPhotoPreview.innerHTML = `<img src="${selectedManualPhotoDataUrl}" alt="Apercu de la reference">`;
    hint.textContent = "Photo de reference chargee. Tu peux lancer la recherche de notice.";
  });
  reader.readAsDataURL(file);
});

lightingPlanInput.addEventListener("change", () => {
  const file = lightingPlanInput.files?.[0];
  if (!file) return;

  if (!file.type.startsWith("image/")) {
    hint.textContent = "Le fichier doit etre une image.";
    return;
  }

  if (file.size > 6 * 1024 * 1024) {
    hint.textContent = "Image trop lourde. Choisis une photo de moins de 6 Mo.";
    return;
  }

  const reader = new FileReader();
  reader.addEventListener("load", () => {
    selectedLightingPlanDataUrl = String(reader.result || "");
    lightingPlanLabel.textContent = file.name;
    lightingPlanPreview.hidden = false;
    lightingPlanPreview.innerHTML = `<img src="${selectedLightingPlanDataUrl}" alt="Apercu du plan">`;
    hint.textContent = "Plan charge. Ajoute les dimensions connues puis lance le dimensionnement.";
  });
  reader.readAsDataURL(file);
});

analyzePhoto.addEventListener("click", analyzePhotoToSchema);
searchManual.addEventListener("click", searchManualNotice);
analyzeLighting.addEventListener("click", analyzeLightingPlan);
sizeClimate.addEventListener("click", sizeClimateSystem);

refreshAccount();
autosize();
