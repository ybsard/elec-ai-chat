const form = document.querySelector("#chatForm");
const promptInput = document.querySelector("#prompt");
const messagesEl = document.querySelector("#messages");
const clearButton = document.querySelector("#clearChat");
const exportReportButton = document.querySelector("#exportReport");
const saveReportButton = document.querySelector("#saveReport");
const reportType = document.querySelector("#reportType");
const showSampleReport = document.querySelector("#showSampleReport");
const hint = document.querySelector("#hint");
const counter = document.querySelector("#counter");
const sendButton = document.querySelector("#sendButton");
const sourceOnlyToggle = document.querySelector("#sourceOnlyToggle");
const sourceUrlInput = document.querySelector("#sourceUrlInput");
const normsSearchToggle = document.querySelector("#normsSearchToggle");
const conversionBanner = document.querySelector("#conversionBanner");
const conversionBannerTitle = document.querySelector("#conversionBannerTitle");
const conversionBannerText = document.querySelector("#conversionBannerText");
const conversionPrimaryButton = document.querySelector("#conversionPrimaryButton");
const conversionSecondaryButton = document.querySelector("#conversionSecondaryButton");
const issueButtons = document.querySelectorAll("[data-issue]");
const levelButtons = document.querySelectorAll("[data-level]");
const toolCards = document.querySelectorAll(".diagnostic-card, .schema-card, .photo-card, .manual-card, .lighting-card, .climate-card");
const accountCard = document.querySelector(".intro-account-card");
const accountStatus = document.querySelector("#accountStatus");
const accountAuthDetails = document.querySelector(".account-auth-details");
const authFields = document.querySelector("#authFields");
const accessCodeFields = document.querySelector("#accessCodeFields");
const accessCodeInput = document.querySelector("#accessCodeInput");
const accessCodeButton = document.querySelector("#accessCodeButton");
const authName = document.querySelector("#authName");
const authEmail = document.querySelector("#authEmail");
const authPassword = document.querySelector("#authPassword");
const signupFields = document.querySelector("#signupFields");
const signupToggleButton = document.querySelector("#signupToggleButton");
const signupEmail = document.querySelector("#signupEmail");
const signupPassword = document.querySelector("#signupPassword");
const signupButton = document.querySelector("#signupButton");
const loginButton = document.querySelector("#loginButton");
const memberActions = document.querySelector("#memberActions");
const upgradeButton = document.querySelector("#upgradeButton");
const logoutButton = document.querySelector("#logoutButton");
const reportHistory = document.querySelector("#reportHistory");
const reportHistoryTitle = document.querySelector("#reportHistoryTitle");
const reportHistorySubtitle = document.querySelector("#reportHistorySubtitle");
const reportList = document.querySelector("#reportList");
const projectWorkspace = document.querySelector("#projectWorkspace");
const projectWorkspaceTitle = document.querySelector("#projectWorkspaceTitle");
const projectWorkspaceSubtitle = document.querySelector("#projectWorkspaceSubtitle");
const activeProjectBadge = document.querySelector("#activeProjectBadge");
const projectUpsell = document.querySelector("#projectUpsell");
const projectUpsellButton = document.querySelector("#projectUpsellButton");
const projectManager = document.querySelector("#projectManager");
const projectNameInput = document.querySelector("#projectNameInput");
const projectDescriptionInput = document.querySelector("#projectDescriptionInput");
const createProjectButton = document.querySelector("#createProjectButton");
const projectList = document.querySelector("#projectList");
const symptomInput = document.querySelector("#symptomInput");
const riskSelect = document.querySelector("#riskSelect");
const startDiagnostic = document.querySelector("#startDiagnostic");
const schemaType = document.querySelector("#schemaType");
const schemaSymbolMode = document.querySelector("#schemaSymbolMode");
const schemaRoom = document.querySelector("#schemaRoom");
const schemaUse = document.querySelector("#schemaUse");
const socketCount = document.querySelector("#socketCount");
const lightCount = document.querySelector("#lightCount");
const switchCount = document.querySelector("#switchCount");
const breakerCount = document.querySelector("#breakerCount");
const breakerRatings = document.querySelector("#breakerRatings");
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
const saveTargetText = document.querySelector("#saveTargetText");

const messages = [];
const maxLength = Number(promptInput.getAttribute("maxlength") || 1200);
let selectedIssue = "Disjoncteur qui saute";
let selectedPhotoDataUrl = "";
let selectedManualPhotoDataUrl = "";
let selectedLightingPlanDataUrl = "";
let selectedLevel = "debutant";
let currentUser = null;
let hasAccessPass = false;
const pageParams = new URLSearchParams(window.location.search);
let conversionPrimaryAction = () => {};
let conversionSecondaryAction = () => {};
let projectsCache = [];
let allReportsCache = [];
let activeProjectId = "";

function updateCounter() {
  counter.textContent = `${promptInput.value.length} / ${maxLength}`;
}

function addMessage(role, content, options = {}) {
  const item = document.createElement("article");
  item.className = `message ${role}`;

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = role === "user" ? "VO" : "V";

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
    try {
      if (!navigator.clipboard?.writeText) {
        throw new Error("clipboard-unavailable");
      }

      await navigator.clipboard.writeText(content);
      copyButton.textContent = "Copie";
    } catch {
      copyButton.textContent = "Impossible";
    }

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
    .replace(/`([^`]+)`/g, "<code>$1</code>")
    .replace(/https?:\/\/[^\s<]+/g, (match) => {
      const trailing = /[),.;:!?]+$/.exec(match)?.[0] || "";
      const url = trailing ? match.slice(0, -trailing.length) : match;
      return `<a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a>${trailing}`;
    });
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

  return html.join("") || "<p>Je n'ai pas pu générer de réponse.</p>";
}

function addDiagramMessage(title, svgMarkup, note, lineSchema = "") {
  const item = document.createElement("article");
  item.className = "message assistant";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "V";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = "Voltia";

  const bubble = document.createElement("div");
  bubble.className = "bubble diagram-bubble";
  bubble.innerHTML = `
    <strong>${escapeHtml(title)}</strong>
    <div class="diagram-frame">${svgMarkup}</div>
    ${lineSchema ? `
      <section class="line-schema-card" aria-label="Plan en traits simplifié">
        <div class="line-schema-heading">
          <span>Plan en traits</span>
          <small>Vue lisible des liaisons principales</small>
        </div>
        <pre class="line-schema">${escapeHtml(lineSchema)}</pre>
      </section>
    ` : ""}
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
    <strong>Photo à retranscrire en schéma</strong>
    <img src="${dataUrl}" alt="Photo envoyée pour analyse">
    <span>${escapeHtml(context || "Sans contexte ajouté")}</span>
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
    ${dataUrl ? `<img src="${dataUrl}" alt="Photo de référence envoyée">` : ""}
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
    <strong>Dimensionnement éclairage</strong>
    ${dataUrl ? `<img src="${dataUrl}" alt="Plan envoyé pour dimensionnement">` : ""}
    <span>${escapeHtml(details || "Plan et contexte envoyés")}</span>
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

function getReportTypeLabel() {
  return reportType?.selectedOptions?.[0]?.textContent || "Diagnostic de panne";
}

function getPrimaryUserRequest() {
  const firstUserBubble = Array.from(messagesEl.querySelectorAll(".message.user .bubble")).find((item) => item.textContent.trim());
  return firstUserBubble?.textContent?.trim().replace(/\s+/g, " ").slice(0, 180) || "Demande non précisée.";
}

function getLastAssistantSummary() {
  const lastAssistantBubble = Array.from(messagesEl.querySelectorAll(".message.assistant .bubble")).reverse()
    .find((item) => item.textContent.trim() && !item.querySelector(".typing"));
  return lastAssistantBubble?.textContent?.trim().replace(/\s+/g, " ").slice(0, 260) || "Analyse en attente de détails complémentaires.";
}

function buildReportDocument() {
  const reportMessages = messagesEl.cloneNode(true);
  reportMessages.querySelectorAll(".typing, .message-actions").forEach((item) => item.remove());
  reportMessages.querySelectorAll("[id]").forEach((item) => item.removeAttribute("id"));

  const generatedAt = new Date().toLocaleString("fr-FR");
  const reportLabel = getReportTypeLabel();
  const primaryRequest = getPrimaryUserRequest();
  const assistantSummary = getLastAssistantSummary();
  const reportTitle = escapeHtml(getReportTitle());

  return `<!doctype html>
    <html lang="fr">
      <head>
        <meta charset="utf-8">
        <title>${reportTitle}</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            padding: 30px;
            color: #10212b;
            font-family: Arial, Helvetica, sans-serif;
            background: #eef4f5;
          }
          .report {
            max-width: 1040px;
            margin: 0 auto;
            border: 1px solid #cfdde2;
            border-radius: 16px;
            background: #ffffff;
            overflow: hidden;
          }
          .cover {
            padding: 34px;
            color: #ffffff;
            background: linear-gradient(135deg, #101820, #14556d 58%, #1e8a5a);
          }
          .brand-row {
            display: flex;
            justify-content: space-between;
            gap: 24px;
            align-items: flex-start;
          }
          .brand {
            font-size: 34px;
            font-weight: 950;
            letter-spacing: -0.03em;
          }
          .kicker {
            color: rgba(255, 255, 255, 0.72);
            font-size: 12px;
            font-weight: 900;
            text-transform: uppercase;
          }
          h1 {
            max-width: 760px;
            margin: 28px 0 0;
            font-size: 38px;
            line-height: 1.05;
          }
          .meta {
            color: rgba(255, 255, 255, 0.82);
            text-align: right;
            font-size: 13px;
            line-height: 1.55;
          }
          .content {
            display: grid;
            gap: 18px;
            padding: 28px;
          }
          .summary-grid {
            display: grid;
            grid-template-columns: 1.05fr 0.95fr;
            gap: 14px;
          }
          .panel {
            padding: 18px;
            border: 1px solid #d9e1e7;
            border-radius: 12px;
            background: #ffffff;
            page-break-inside: avoid;
          }
          .panel.soft {
            background: #f8fbfb;
          }
          .panel.warning {
            border-color: #f2a51a;
            background: #fff8e8;
          }
          .panel h2 {
            margin: 0 0 10px;
            font-size: 18px;
          }
          .panel p {
            margin: 0;
            color: #4f5d68;
            line-height: 1.58;
          }
          .checklist {
            display: grid;
            gap: 8px;
            margin: 0;
            padding: 0;
            list-style: none;
          }
          .checklist li {
            padding-left: 22px;
            position: relative;
            color: #263542;
            line-height: 1.45;
            font-weight: 750;
          }
          .checklist li::before {
            content: "";
            position: absolute;
            left: 0;
            top: 0.45em;
            width: 9px;
            height: 9px;
            border-radius: 999px;
            background: #f2a51a;
          }
          .messages-section h2 {
            margin: 0 0 14px;
            font-size: 20px;
          }
          .messages {
            display: grid;
            gap: 14px;
            padding: 0;
            background: transparent;
          }
          .message {
            display: grid;
            grid-template-columns: 42px minmax(0, 1fr);
            gap: 10px;
            margin: 0;
            page-break-inside: avoid;
          }
          .avatar {
            width: 34px;
            height: 34px;
            display: grid;
            place-items: center;
            border-radius: 50%;
            background: #101820;
            color: white;
            font-size: 11px;
            font-weight: 900;
          }
          .message.user .avatar { background: #1d6f8f; }
          .message-stack { max-width: none; }
          .message-label {
            display: block;
            margin-bottom: 5px;
            color: #637280;
            font-size: 12px;
            font-weight: 800;
          }
          .bubble {
            padding: 14px 16px;
            border: 1px solid #d9e1e7;
            border-radius: 10px;
            background: #ffffff;
            line-height: 1.55;
            white-space: pre-wrap;
          }
          .message.user .bubble {
            border-color: #15566f;
            background: #eaf6fa;
            color: #10212b;
          }
          .formatted-response { white-space: normal; }
          .formatted-response p,
          .formatted-response ul,
          .formatted-response ol { margin: 0 0 10px; }
          .line-schema-card {
            margin: 12px 0;
            padding: 12px;
            border: 1px solid rgba(20, 85, 109, 0.16);
            border-radius: 10px;
            background: #f8fbfb;
          }
          .line-schema-heading {
            display: flex;
            justify-content: space-between;
            gap: 12px;
            margin-bottom: 8px;
            color: #10212b;
            font-weight: 900;
          }
          .line-schema-heading small { color: #637280; font-size: 11px; }
          .line-schema {
            overflow: visible;
            white-space: pre-wrap;
            margin: 0;
            padding: 14px;
            border: 1px solid rgba(159, 180, 193, 0.45);
            border-radius: 8px;
            background:
              linear-gradient(90deg, rgba(20, 85, 109, 0.045) 1px, transparent 1px),
              linear-gradient(180deg, rgba(20, 85, 109, 0.045) 1px, transparent 1px),
              #ffffff;
            background-size: 18px 18px;
            color: #16303b;
            font-family: "Cascadia Mono", Consolas, monospace;
            font-size: 11px;
            font-weight: 800;
          }
          .diagram-frame {
            overflow: hidden;
            margin: 10px 0;
            border: 1px solid rgba(20, 85, 109, 0.16);
            border-radius: 12px;
            background: #f8fbfb;
          }
          .diagram-frame svg { display: block; width: 100%; height: auto; }
          .report-footer {
            margin-top: 6px;
            padding-top: 16px;
            border-top: 1px solid #d9e1e7;
            color: #637280;
            font-size: 12px;
            line-height: 1.5;
          }
          @media print {
            body { padding: 0; background: white; }
            .report { border: 0; border-radius: 0; }
            .cover { border-radius: 0; }
          }
        </style>
      </head>
      <body>
        <main class="report">
          <section class="cover">
            <div class="brand-row">
              <div>
                <div class="brand">Voltia</div>
                <div class="kicker">Rapport électrique indicatif</div>
              </div>
              <div class="meta">
                Généré le ${escapeHtml(generatedAt)}<br>
                Type : ${escapeHtml(reportLabel)}<br>
                Niveau : ${escapeHtml(selectedLevel)}
              </div>
            </div>
            <h1>${reportTitle}</h1>
          </section>

          <section class="content">
            <div class="summary-grid">
              <article class="panel soft">
                <h2>Résumé de la demande</h2>
                <p>${escapeHtml(primaryRequest)}</p>
              </article>
              <article class="panel soft">
                <h2>Synthèse Voltia</h2>
                <p>${escapeHtml(assistantSummary)}</p>
              </article>
            </div>

            <article class="panel warning">
              <h2>Checklist sécurité avant toute action</h2>
              <ul class="checklist">
                <li>Couper l'alimentation avant toute manipulation.</li>
                <li>Vérifier l'absence de tension avec un appareil adapté.</li>
                <li>Ne pas intervenir si fumée, odeur de brûlé, humidité, chaleur ou fil dénudé.</li>
                <li>Faire valider les travaux par un électricien qualifié.</li>
              </ul>
            </article>

            <section class="messages-section panel">
              <h2>Analyse détaillée et livrables</h2>
              ${reportMessages.outerHTML}
            </section>

            <article class="panel">
              <h2>Limites et prochaines actions</h2>
              <p>Ce rapport est une aide à la compréhension et à la préparation. Il ne constitue pas une attestation de conformité. Vérifie les notices fabricants, la norme applicable et fais valider toute intervention par un professionnel qualifié.</p>
            </article>

            <footer class="report-footer">
              Voltia by yb - Assistant IA indicatif. Éditeur : Yanis Barthe.
            </footer>
          </section>
        </main>
      </body>
    </html>`;
}

function getReportPreviewText() {
  const preview = Array.from(messagesEl.querySelectorAll(".message.assistant .bubble"))
    .map((item) => item.textContent.trim())
    .filter(Boolean)
    .join(" ")
    .replace(/\s+/g, " ")
    .slice(0, 220);
  return preview || getPrimaryUserRequest();
}

function getReportTitle() {
  const lastUserBubble = Array.from(messagesEl.querySelectorAll(".message.user .bubble")).pop();
  const base = lastUserBubble?.textContent?.trim().replace(/\s+/g, " ").slice(0, 64);
  const prefix = getReportTypeLabel();
  return base ? `${prefix} - ${base}` : `${prefix} Voltia ${new Date().toLocaleDateString("fr-FR")}`;
}

function getVisibleConversation() {
  return Array.from(messagesEl.querySelectorAll(".message"))
    .map((item) => ({
      role: item.classList.contains("user") ? "user" : "assistant",
      content: item.querySelector(".bubble")?.textContent?.trim().replace(/\s+/g, " ") || ""
    }))
    .filter((message) => message.content && !message.content.includes("Conversation effacée"))
    .slice(-40);
}

function exportConversationReport() {
  const hasConversation = messagesEl.querySelectorAll(".message").length > 0;
  if (!hasConversation) {
    setHint("Lance d'abord une conversation avant d'exporter un rapport.", true);
    return;
  }

  const reportWindow = window.open("", "_blank");
  if (!reportWindow) {
    setHint("Autorise l'ouverture de pop-up pour exporter le rapport PDF.", true);
    return;
  }

  reportWindow.document.open();
  reportWindow.document.write(buildReportDocument());
  reportWindow.document.close();
  window.setTimeout(() => {
    reportWindow.focus();
    reportWindow.print();
  }, 350);
  hint.textContent = "Rapport ouvert. Choisis Enregistrer en PDF dans la fenetre d'impression.";
}

function showProfessionalReportExample() {
  messages.length = 0;
  messagesEl.innerHTML = "";
  if (reportType) {
    reportType.value = "diagnostic";
  }
  schemaSymbolMode.value = "normalized";

  const request = "Exemple: le disjoncteur saute quand le four démarre dans la cuisine.";
  const response = [
    "Résumé rapide",
    "- Le symptôme évoque un défaut lié au circuit du four, à l'appareil ou à une surcharge.",
    "",
    "Sécurité",
    "- Ne pas ouvrir le tableau sous tension.",
    "- Couper l'alimentation si odeur de brûlé, chaleur anormale ou déclenchements répétés.",
    "",
    "Hypothèses",
    "- Four défectueux ou résistance en défaut d'isolement.",
    "- Circuit spécialisé insuffisant ou protection inadaptée.",
    "- Mauvais serrage ou échauffement sur le circuit.",
    "",
    "Vérifications sans danger",
    "- Noter quel disjoncteur déclenche exactement.",
    "- Tester si le défaut arrive four branché mais éteint, puis au démarrage.",
    "- Vérifier la référence du four et la puissance indiquée sur la plaque signalétique.",
    "",
    "Prochaine action",
    "- Faire contrôler le circuit four et l'appareil par un électricien qualifié."
  ].join("\n");

  addMessage("user", request);
  messages.push({ role: "user", content: request });
  addMessage("assistant", response);
  messages.push({ role: "assistant", content: response });

  addDiagramMessage(
    "Schéma indicatif normalisé - circuit four",
    buildSchema("prise", "cuisine", "four 20A", {
      sockets: 1,
      lights: 0,
      switches: 0,
      breakers: 1,
      breakerRatings: "20A four",
      symbolMode: "normalized"
    }),
    "Exemple indicatif: le circuit spécialisé four doit être vérifié selon l'installation réelle.",
    buildLineSchema("prise", { sockets: 1 })
  );

  setHint("Exemple de rapport chargé. Tu peux exporter le PDF ou sauvegarder ce modèle dans ton compte.");
}

function renderReportHistory(reports = [], options = {}) {
  if (!reportHistory || !reportList) return;

  reportHistory.hidden = !currentUser;
  reportList.innerHTML = "";

  if (!currentUser) return;

  const title = options.title || "Mes rapports";
  const subtitle = options.subtitle || "Les derniers rapports sauvegardés.";
  const emptyMessage = options.emptyMessage || "Aucun rapport sauvegardé pour l'instant.";

  if (reportHistoryTitle) {
    reportHistoryTitle.textContent = title;
  }
  if (reportHistorySubtitle) {
    reportHistorySubtitle.textContent = subtitle;
  }

  if (!reports.length) {
    reportList.innerHTML = `<p class="empty-history">${escapeHtml(emptyMessage)}</p>`;
    return;
  }

  reports.forEach((report) => {
    const item = document.createElement("a");
    item.className = "report-history-item";
    item.href = `/?report=${encodeURIComponent(report.id)}`;
    item.dataset.reportId = report.id;
    const date = report.createdAt ? new Date(report.createdAt).toLocaleDateString("fr-FR") : "Date inconnue";
    const type = String(report.title || "").split(" - ")[0] || "Rapport Voltia";
    const projectLabel = report.projectName ? ` · Dossier ${escapeHtml(report.projectName)}` : "";
    item.innerHTML = `
      <span class="report-item-main">
        <strong>${escapeHtml(report.title || "Rapport Voltia")}</strong>
        <small><b>${escapeHtml(type)}</b>${projectLabel} · ${escapeHtml(date)} · ${escapeHtml(report.preview || "Rapport sauvegardé")}</small>
      </span>
      <span class="report-item-action">Ouvrir</span>
    `;
    reportList.append(item);
  });
}

function getProjectById(projectId) {
  if (!projectId) return null;
  return projectsCache.find((project) => project.id === projectId) || null;
}

function renderCurrentReportHistory() {
  if (!currentUser) {
    renderReportHistory([]);
    return;
  }

  const activeProject = currentUser.plan === "pro" ? getProjectById(activeProjectId) : null;
  const reports = activeProject
    ? allReportsCache.filter((report) => report.projectId === activeProject.id)
    : allReportsCache;

  renderReportHistory(reports, {
    title: activeProject ? `Dossier : ${activeProject.name}` : "Mes rapports",
    subtitle: activeProject
      ? `${reports.length} rapport${reports.length > 1 ? "s" : ""} dans ce dossier. Les prochains enregistrements peuvent y être rangés.`
      : currentUser.plan === "pro"
        ? "Tous tes rapports récents, avec ou sans dossier."
        : "Les derniers rapports sauvegardés dans ton compte.",
    emptyMessage: activeProject
      ? "Aucun rapport dans ce dossier pour l'instant."
      : "Aucun rapport sauvegardé pour l'instant."
  });
}

function updateSaveTargetUi() {
  if (!saveTargetText) return;

  if (!currentUser) {
    saveTargetText.textContent = "Compte gratuit : sauvegarde simple dans l'historique. Pro : tu peux ranger les rapports dans des dossiers.";
    if (activeProjectBadge) {
      activeProjectBadge.textContent = "Tous les rapports";
    }
    return;
  }

  if (currentUser.plan !== "pro") {
    activeProjectId = "";
    saveTargetText.textContent = "Compte gratuit : tes rapports sont sauvegardés dans un historique unique. Passe Pro pour les classer par chantier, client ou pièce.";
    if (activeProjectBadge) {
      activeProjectBadge.textContent = "Compte gratuit";
    }
    return;
  }

  const activeProject = getProjectById(activeProjectId);
  if (activeProjectBadge) {
    activeProjectBadge.textContent = activeProject ? activeProject.name : "Tous les rapports";
  }

  if (activeProject) {
    saveTargetText.textContent = `Voltia Pro : le prochain rapport sera rangé dans le dossier "${activeProject.name}".`;
    return;
  }

  if (projectsCache.length) {
    saveTargetText.textContent = "Voltia Pro : choisis un dossier pour ranger le prochain rapport, ou garde tous les rapports dans l'historique général.";
    return;
  }

  saveTargetText.textContent = "Voltia Pro : crée un premier dossier pour classer tes rapports par chantier, logement ou intervention.";
}

function renderProjects(projects = []) {
  if (!projectWorkspace || !projectList) return;

  const isLoggedIn = Boolean(currentUser);
  const isPro = currentUser?.plan === "pro";

  projectWorkspace.hidden = !isLoggedIn;

  if (!isLoggedIn) {
    projectsCache = [];
    activeProjectId = "";
    projectList.innerHTML = "";
    projectUpsell.hidden = true;
    projectManager.hidden = true;
    updateSaveTargetUi();
    return;
  }

  projectsCache = Array.isArray(projects) ? projects : [];
  if (currentUser?.plan === "pro") {
    currentUser.projectCount = projectsCache.length;
  }
  if (activeProjectId && !getProjectById(activeProjectId)) {
    activeProjectId = "";
  }

  projectWorkspaceTitle.textContent = "Dossiers Pro";
  projectWorkspaceSubtitle.textContent = isPro
    ? "Crée un dossier puis classe tes rapports par chantier, client ou pièce."
    : "Le compte gratuit sauvegarde tes rapports. Voltia Pro ajoute un vrai classement par dossier.";

  projectUpsell.hidden = isPro;
  projectManager.hidden = !isPro;

  if (!isPro) {
    activeProjectId = "";
    projectList.innerHTML = "";
    updateSaveTargetUi();
    return;
  }

  const allReportsCard = `
    <button type="button" class="project-card ${!activeProjectId ? "is-active" : ""}" data-project-filter="all">
      <strong>Tous les rapports</strong>
      <span>Vue générale pour retrouver tous les enregistrements récents.</span>
      <small>${allReportsCache.length} rapport${allReportsCache.length > 1 ? "s" : ""}</small>
    </button>
  `;

  if (!projectsCache.length) {
    projectList.innerHTML = `
      ${allReportsCard}
      <div class="project-card project-card-empty">
        <strong>Aucun dossier créé</strong>
        <span>Commence par créer un dossier chantier pour donner une vraie structure à ton historique.</span>
      </div>
    `;
    updateSaveTargetUi();
    return;
  }

  const cards = projectsCache.map((project) => {
    const updatedAt = project.updatedAt
      ? new Date(project.updatedAt).toLocaleDateString("fr-FR")
      : "Date inconnue";
    return `
      <button type="button" class="project-card ${activeProjectId === project.id ? "is-active" : ""}" data-project-id="${escapeHtml(project.id)}">
        <strong>${escapeHtml(project.name || "Dossier Voltia")}</strong>
        <span>${escapeHtml(project.description || "Classe les rapports de ce chantier dans un espace dédié.")}</span>
        <small>${project.reportCount || 0} rapport${project.reportCount > 1 ? "s" : ""} · Maj ${escapeHtml(updatedAt)}</small>
      </button>
    `;
  });

  projectList.innerHTML = [allReportsCard, ...cards].join("");
  updateSaveTargetUi();
}

async function loadSavedConversation(reportId) {
  if (!reportId) return;

  try {
    const response = await fetch(`/api/reports/${encodeURIComponent(reportId)}`);
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error || "Rapport introuvable.");

    const conversation = data.report?.conversation || [];
    if (!conversation.length) {
      setHint("Ce rapport ne contient pas encore de conversation à reprendre.", true);
      return;
    }

    messages.length = 0;
    messagesEl.innerHTML = "";
    conversation.forEach((message) => {
      addMessage(message.role === "user" ? "user" : "assistant", message.content);
      messages.push({
        role: message.role === "user" ? "user" : "assistant",
        content: message.content
      });
    });

    promptInput.value = "";
    autosize();
    messagesEl.scrollTop = messagesEl.scrollHeight;
    if (currentUser?.plan === "pro") {
      activeProjectId = data.report?.projectId || "";
      renderProjects(projectsCache);
      renderCurrentReportHistory();
    } else {
      updateSaveTargetUi();
    }
    setHint(`Conversation reprise: ${data.report?.title || "rapport Voltia"}. Tu peux continuer dans le chat.`);
    window.history.replaceState({}, "", "/");
  } catch (error) {
    setHint(error.message, true);
  }
}

async function loadReportHistory() {
  if (!currentUser) {
    allReportsCache = [];
    renderReportHistory([]);
    return;
  }

  try {
    const response = await fetch("/api/reports");
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error || "Historique indisponible.");
    allReportsCache = data.reports || [];
    if (currentUser?.plan === "pro") {
      renderProjects(projectsCache);
    }
    renderCurrentReportHistory();
  } catch {
    allReportsCache = [];
    if (currentUser?.plan === "pro") {
      renderProjects(projectsCache);
    }
    renderReportHistory([]);
  }
}

async function loadProjects() {
  if (!currentUser) {
    renderProjects([]);
    return;
  }

  if (currentUser.plan !== "pro") {
    renderProjects([]);
    return;
  }

  try {
    const response = await fetch("/api/projects");
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Dossiers indisponibles.")) return;
    renderProjects(data.projects || []);
  } catch {
    renderProjects([]);
  }
}

async function loadProject(projectId) {
  if (!currentUser || currentUser.plan !== "pro") return;

  if (!projectId) {
    activeProjectId = "";
    renderProjects(projectsCache);
    renderCurrentReportHistory();
    setHint("Vue générale des rapports réactivée.");
    return;
  }

  try {
    const response = await fetch(`/api/projects/${encodeURIComponent(projectId)}`);
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Dossier indisponible.")) return;

    activeProjectId = data.project?.id || projectId;

    if (data.project?.id) {
      const nextProjects = projectsCache.slice();
      const index = nextProjects.findIndex((project) => project.id === data.project.id);
      if (index >= 0) {
        nextProjects[index] = { ...nextProjects[index], ...data.project };
      }
      projectsCache = nextProjects;
    }

    if (Array.isArray(data.reports)) {
      allReportsCache = [
        ...data.reports,
        ...allReportsCache.filter((report) => report.projectId !== activeProjectId)
      ];
    }

    renderProjects(projectsCache);
    renderCurrentReportHistory();
    setHint(`Dossier actif : ${data.project?.name || "Dossier Voltia"}. Le prochain rapport y sera sauvegardé.`);
  } catch (error) {
    setHint(error.message, true);
  }
}

async function createProject() {
  if (!currentUser) {
    openSignupFlow();
    setHint("Crée d'abord un compte pour utiliser l'espace de sauvegarde.", true);
    return;
  }

  if (currentUser.plan !== "pro") {
    showProjectsUpgradePrompt("Les dossiers par chantier sont reserves a Voltia Pro.");
    return;
  }

  const name = projectNameInput?.value.trim() || "";
  const description = projectDescriptionInput?.value.trim() || "";

  if (!name) {
    setHint("Ajoute un nom de dossier avant de le créer.", true);
    projectNameInput?.focus();
    return;
  }

  createProjectButton.disabled = true;
  setHint("Création du dossier en cours...");

  try {
    const response = await fetch("/api/projects", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description })
    });
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Création du dossier impossible.")) return;

    if (projectNameInput) projectNameInput.value = "";
    if (projectDescriptionInput) projectDescriptionInput.value = "";

    activeProjectId = data.project?.id || "";
    renderProjects(data.projects || []);
    await loadReportHistory();
    hideConversionBanner();
    setHint(`Dossier créé : ${data.project?.name || "Dossier Voltia"}. Les prochains rapports peuvent y être rangés.`);
  } catch (error) {
    setHint(error.message, true);
  } finally {
    createProjectButton.disabled = false;
  }
}

async function saveConversationReport() {
  if (!currentUser) {
    setHint("Connecte-toi pour sauvegarder tes rapports dans ton compte.", true);
    setAccountNotice("Connecte-toi ou crée un compte gratuit pour sauvegarder ce rapport.");
    showConversionBanner({
      title: "Sauvegarder ce rapport",
      text: "Le compte gratuit permet déjà de conserver tes rapports et de reprendre tes conversations.",
      primaryLabel: "Créer un compte gratuit",
      onPrimary: () => {
        openSignupFlow();
      },
      secondaryLabel: "Voir Pro",
      onSecondary: () => {
        window.location.href = "/pro.html";
      }
    });
    return;
  }

  const hasConversation = messagesEl.querySelectorAll(".message").length > 0;
  if (!hasConversation) {
    setHint("Lance d'abord une conversation avant de sauvegarder un rapport.", true);
    return;
  }

  saveReportButton.disabled = true;
  setHint("Sauvegarde du rapport en cours...");

  try {
    const response = await fetch("/api/reports", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: getReportTitle(),
        preview: getReportPreviewText(),
        html: buildReportDocument(),
        conversation: getVisibleConversation(),
        projectId: currentUser?.plan === "pro" ? activeProjectId : ""
      })
    });
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Sauvegarde impossible.")) return;

    allReportsCache = data.reports || [];
    if (Array.isArray(data.projects)) {
      renderProjects(data.projects);
    }
    if (currentUser?.plan === "pro" && activeProjectId) {
      await loadProject(activeProjectId);
    } else {
      renderCurrentReportHistory();
    }
    hideConversionBanner();
    const activeProject = getProjectById(activeProjectId);
    setHint(activeProject ? `Rapport sauvegardé dans le dossier ${activeProject.name}.` : "Rapport sauvegardé dans ton compte.");
  } catch (error) {
    setHint(error.message, true);
  } finally {
    saveReportButton.disabled = false;
  }
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
      error: text || "Réponse serveur illisible."
    };
  }
}

function updateAccountUi(user, meta = {}) {
  currentUser = user || null;
  hasAccessPass = Boolean(meta.accessPass);
  accountCard?.classList.toggle("is-connected", Boolean(currentUser || hasAccessPass));

  if (hasAccessPass) {
    accountStatus.textContent = `${meta.accessName || "Accès invité"} | Accès complet activé | Toutes les fonctionnalités sont débloquées.`;
    accessCodeFields.hidden = true;
    authFields.hidden = true;
    signupFields.hidden = true;
    memberActions.hidden = false;
    upgradeButton.hidden = true;
    logoutButton.hidden = false;
    renderReportHistory([]);
    renderProjects([]);
    return;
  }

  if (!currentUser) {
    accountStatus.textContent = `Libre-service : ${meta.anonymousDailyLimit || 5} essais anonymes. Crée un compte gratuit pour passer à 10 usages par jour et sauvegarder tes rapports.`;
    accessCodeFields.hidden = false;
    authFields.hidden = false;
    signupFields.hidden = true;
    memberActions.hidden = true;
    upgradeButton.hidden = true;
    logoutButton.hidden = true;
    renderReportHistory([]);
    renderProjects([]);
    return;
  }

  const planLabel = currentUser.plan === "pro" ? "Pro" : "Gratuit";
  const displayName = currentUser.name || currentUser.email;
  const usage = currentUser.plan === "pro"
    ? "compteur quotidien levé"
    : `${currentUser.usageToday || 0} / ${currentUser.freeDailyLimit || 10} usages aujourd'hui`;
  const projectsLabel = currentUser.plan === "pro"
    ? ` | ${currentUser.projectCount || 0} dossier${currentUser.projectCount > 1 ? "s" : ""}`
    : "";

  accountStatus.textContent = `Bonjour ${displayName} | Compte ${planLabel} | ${usage}${projectsLabel} | Rapports sauvegardés`;
  accessCodeFields.hidden = true;
  authFields.hidden = true;
  signupFields.hidden = true;
  memberActions.hidden = false;
  upgradeButton.hidden = currentUser.plan === "pro";
  logoutButton.hidden = false;
  reportHistory.hidden = false;
  updateSaveTargetUi();
}

function setAccountNotice(message) {
  accountStatus.textContent = message;
}

function setHint(message, important = false) {
  hint.textContent = message;
  hint.classList.toggle("important-hint", important);
}

function hideConversionBanner() {
  if (!conversionBanner) return;
  conversionBanner.hidden = true;
}

function showConversionBanner({
  title,
  text,
  primaryLabel,
  onPrimary,
  secondaryLabel = "",
  onSecondary = null
}) {
  if (!conversionBanner || !conversionBannerTitle || !conversionBannerText || !conversionPrimaryButton || !conversionSecondaryButton) {
    return;
  }

  conversionBannerTitle.textContent = title;
  conversionBannerText.textContent = text;
  conversionPrimaryButton.textContent = primaryLabel;
  conversionPrimaryAction = typeof onPrimary === "function" ? onPrimary : (() => {});

  if (secondaryLabel && typeof onSecondary === "function") {
    conversionSecondaryButton.hidden = false;
    conversionSecondaryButton.textContent = secondaryLabel;
    conversionSecondaryAction = onSecondary;
  } else {
    conversionSecondaryButton.hidden = true;
    conversionSecondaryAction = () => {};
  }

  conversionBanner.hidden = false;
}

function openAccountPanel() {
  if (accountAuthDetails && !accountAuthDetails.open) {
    accountAuthDetails.open = true;
  }
  accountCard?.scrollIntoView({ behavior: "smooth", block: "start" });
}

function openSignupFlow() {
  openAccountPanel();
  signupFields.hidden = false;
  authName?.focus();
}

function showAnonymousUpgradePrompt(message) {
  showConversionBanner({
    title: "Tes essais anonymes sont terminés",
    text: message || "Crée un compte gratuit pour continuer avec 10 usages par jour et sauvegarder tes rapports.",
    primaryLabel: "Créer un compte gratuit",
    onPrimary: () => {
      openSignupFlow();
      setHint("Crée ton compte gratuit pour reprendre immédiatement.", true);
    },
    secondaryLabel: "Voir Pro",
    onSecondary: () => {
      window.location.href = "/pro.html";
    }
  });
}

function showProUpgradePrompt(message) {
  showConversionBanner({
    title: "Le quota du compte gratuit est atteint",
    text: message || "Passe en Pro pour lever le compteur quotidien et enchaîner plusieurs diagnostics sans interruption.",
    primaryLabel: "Passer Pro",
    onPrimary: () => {
      startCheckout();
    },
    secondaryLabel: "Voir l'offre",
    onSecondary: () => {
      window.location.href = "/pro.html";
    }
  });
}

function showProjectsUpgradePrompt(message) {
  showConversionBanner({
    title: "Classement par chantier reserve a Pro",
    text: message || "Voltia Pro ajoute des dossiers pour ranger tes rapports par client, chantier, logement ou intervention.",
    primaryLabel: "Passer Pro",
    onPrimary: () => {
      startCheckout();
    },
    secondaryLabel: "Voir l'offre",
    onSecondary: () => {
      window.location.href = "/pro.html";
    }
  });
}

function handleBarrierResponse(response, data, fallbackError) {
  if (response.ok) return false;

  const errorMessage = data.error || fallbackError || "Erreur inconnue.";

  if (response.status === 402 && data.signupRequired) {
    setAccountNotice(errorMessage);
    setHint("Le mode anonyme est épuisé. Crée un compte gratuit pour continuer.", true);
    showAnonymousUpgradePrompt(errorMessage);
    return true;
  }

  if (response.status === 402 && data.upgradeRequired && data.feature === "projects") {
    setAccountNotice(errorMessage);
    setHint("Les dossiers par chantier sont reserves a Voltia Pro.", true);
    showProjectsUpgradePrompt(errorMessage);
    return true;
  }

  if (response.status === 402 && data.upgradeRequired) {
    setAccountNotice(errorMessage);
    setHint("Le quota du compte gratuit est atteint. Passe Pro pour continuer sans compteur quotidien.", true);
    showProUpgradePrompt(errorMessage);
    return true;
  }

  throw new Error(errorMessage);
}

function handleLandingState() {
  const shouldOpenAuth = pageParams.get("openAuth") === "1";
  const checkoutState = pageParams.get("checkout");

  if (shouldOpenAuth) {
    openAccountPanel();
    setHint("Crée un compte gratuit pour sauvegarder tes rapports, ou passe Pro si tu utilises Voltia plusieurs fois par semaine.");
  }

  if (checkoutState === "success") {
    setAccountNotice("Paiement confirmé. Voltia Pro est en cours d'activation sur ton compte.");
    setHint("Paiement confirmé. Recharge la page dans quelques secondes si le statut Pro n'apparaît pas encore.");
  } else if (checkoutState === "cancel") {
    setAccountNotice("Paiement annulé. Ton compte gratuit reste actif.");
    setHint("Paiement annulé. Tu peux continuer avec le compte gratuit ou réessayer plus tard.");
  }
}

function getSourceSettings() {
  const enabled = sourceOnlyToggle.checked;
  const url = sourceUrlInput.value.trim();
  const normsSearch = normsSearchToggle.checked && !enabled;
  return { enabled, url, normsSearch };
}

async function refreshAccount() {
  try {
    const response = await fetch("/api/auth/me");
    const data = await readJsonResponse(response);
    updateAccountUi(data.user, data);
    await loadProjects();
    await loadReportHistory();
    if (data.user || data.accessPass) {
      hideConversionBanner();
    }
  } catch {
    updateAccountUi(null);
  }
}

async function submitAuth(mode) {
  const name = authName.value.trim();
  const email = mode === "signup" ? signupEmail.value.trim() : authEmail.value.trim();
  const password = mode === "signup" ? signupPassword.value : authPassword.value;
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
    (mode === "signup" ? signupEmail : authEmail).focus();
    return;
  }

  signupToggleButton.disabled = true;
  signupButton.disabled = true;
  loginButton.disabled = true;
  setAccountNotice(mode === "signup" ? "Création du compte en cours..." : "Connexion en cours...");
  setHint(mode === "signup" ? "Création du compte..." : "Connexion...");

  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password })
    });
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    authPassword.value = "";
    signupPassword.value = "";
    updateAccountUi(data.user);
    await loadProjects();
    await loadReportHistory();
    const displayName = data.user.name || data.user.email;
    if (mode === "signup") {
      signupFields.hidden = true;
      setAccountNotice(`Bienvenue ${displayName}. Ton compte gratuit est prêt : jusqu'à ${data.user.freeDailyLimit || 10} usages par jour et sauvegarde de rapports.`);
      setHint(`Compte créé pour ${displayName}. Tu peux continuer gratuitement ou passer Pro pour lever le compteur quotidien.`);
      hideConversionBanner();
    } else {
      setAccountNotice(`Bonjour ${displayName}. Connexion réussie. Ton historique de rapports est disponible dans ton compte.`);
      setHint("Connexion réussie.");
      hideConversionBanner();
    }
  } catch (error) {
    setAccountNotice(error.message);
    setHint(error.message);
  } finally {
    signupToggleButton.disabled = false;
    signupButton.disabled = false;
    loginButton.disabled = false;
  }
}

async function logoutAccount() {
  await fetch("/api/auth/logout", { method: "POST" });
  updateAccountUi(null, { anonymousDailyLimit: 5 });
  renderReportHistory([]);
  hideConversionBanner();
  setHint("Tu es deconnecte.");
}

async function submitAccessCode() {
  const code = accessCodeInput.value.trim();

  if (!code) {
    setAccountNotice("Entre ton code d'accès.");
    accessCodeInput.focus();
    return;
  }

  accessCodeButton.disabled = true;
  setAccountNotice("Vérification du code d'accès...");

  try {
    const response = await fetch("/api/access-code", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    accessCodeInput.value = "";
    updateAccountUi(null, data);
    hideConversionBanner();
    setHint("Accès complet activé sans compte.");
  } catch (error) {
    setAccountNotice(error.message);
    setHint(error.message);
  } finally {
    accessCodeButton.disabled = false;
  }
}

async function startCheckout() {
  if (!currentUser) {
    setAccountNotice("Connecte-toi ou crée un compte avant de passer en Pro.");
    setHint("Connecte-toi ou crée un compte avant de passer Pro.", true);
    openAccountPanel();
    return;
  }

  upgradeButton.disabled = true;
  setAccountNotice("Préparation du paiement Stripe pour lever le compteur quotidien...");
  setHint("Préparation du paiement Stripe...");

  try {
    const response = await fetch("/api/billing/checkout", { method: "POST" });
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;
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
  const reportLabel = getReportTypeLabel();
  return [
    "Demande de diagnostic électrique guidé.",
    `Livrable attendu: ${reportLabel}.`,
    `Type de problème: ${selectedIssue}.`,
    `Observation: ${symptom}.`,
    `Niveau de risque indique: ${risk}.`,
    buildLevelInstruction(),
    buildResponseFormatInstruction(),
    "Réponds comme un livrable professionnel avec ces sections: Réponse directe, Résumé rapide, Niveau de danger, Hypothèses, Vérifications sans danger, Schéma ou repères utiles, Quand appeler un électricien, Limites, Prochaine action."
  ].join("\n");
}

function buildLevelInstruction() {
  const instructions = {
    debutant: "Niveau de réponse: débutant. Réponds avec des mots simples, des étapes courtes, une organisation très lisible et peu de jargon.",
    confirme: "Niveau de réponse: confirmé. Réponds avec des explications complètes, les raisons techniques principales, les limites et une structure claire adaptée à la question.",
    expert: "Niveau de réponse: expert. Réponds comme un expert en électricité: analyse complète, raisonnement technique, hypothèses classées, limites, points normatifs utiles, informations manquantes et plan d'action. Utilise des paragraphes structurés quand le cas est complexe, pas seulement des listes. Ne donne jamais de procédure dangereuse, de branchement sous tension ou de tutoriel non conforme."
  };
  return instructions[selectedLevel] || instructions.debutant;
}

function buildResponseFormatInstruction() {
  return [
    "Organisation obligatoire de la réponse:",
    "Commence toujours par une section 'Réponse directe' qui répond exactement à la question posée en 2 à 5 phrases.",
    "Ne démarre pas par des généralités, un avertissement vague ou un plan standard si l'utilisateur a posé une question concrète.",
    "Après la réponse directe, ajoute seulement les détails utiles: raisonnement, limites, risques et prochaine action.",
    "Adapte les sections au type de demande au lieu de recycler toujours le même plan.",
    "Pour une panne: Réponse directe, Résumé rapide, Niveau de danger, Raisonnement, Hypothèses classées, Vérifications sans danger, À ne pas faire, Prochaines étapes, Limites.",
    "Pour une question normative: Réponse directe, Contexte, Règles à vérifier, Points de vigilance, Ce qui reste à confirmer, Sources si disponibles, Limites.",
    "Pour un rapport: Réponse directe, Synthèse, Risques, Priorités, Données manquantes, Plan d'action, Limites non certifiantes.",
    "En mode expert, alterne paragraphes courts et listes ciblées pour obtenir une réponse complète, lisible et exploitable.",
    "Mets les avertissements importants dans la section Sécurité et refuse tout mode opératoire dangereux."
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
    switches: clampCount(switchCount.value, 1, 0, 6),
    breakers: clampCount(breakerCount.value, 4, 1, 12),
    breakerRatings: breakerRatings.value.trim(),
    symbolMode: schemaSymbolMode?.value || "standard"
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
  if (schemaType.value === "tableau" && Number(breakerCount.value) < 1) {
    breakerCount.value = "4";
  }
  document.querySelector(".schema-board-fields")?.classList.toggle("hidden-field", schemaType.value !== "tableau");
}

function getBreakerItems(counts = {}) {
  const fallback = ["10A éclairage", "16A prises", "20A cuisine", "20A chauffage"];
  const raw = String(counts.breakerRatings || "")
    .split(/[,;\n]/)
    .map((item) => item.trim())
    .filter(Boolean);
  const total = clampCount(counts.breakers, Math.max(raw.length, 4), 1, 12);
  return Array.from({ length: total }, (_, index) => raw[index] || fallback[index] || `Circuit ${index + 1}`);
}

function buildSchema(type, room, usage, counts = {}) {
  const normalizedSymbols = counts.symbolMode === "normalized";
  const safeRoom = escapeHtml(room || "pièce à définir");
  const safeUsage = escapeHtml(usage || "usage a definir");
  const socketTotal = clampCount(counts.sockets, 1, 0, 12);
  const lightTotal = clampCount(counts.lights, 1, 0, 8);
  const switchTotal = clampCount(counts.switches, type === "va-et-vient" ? 2 : 1, 0, 6);
  const breakerItems = getBreakerItems(counts);
  const breakerTotal = breakerItems.length;
  const quantityLine = type === "tableau"
    ? `Disjoncteurs: ${breakerTotal} | Circuits: ${escapeHtml(breakerItems.join(", "))}`
    : `Prises: ${socketTotal} | Lumieres: ${lightTotal} | Interrupteurs: ${switchTotal}`;
  const normalizedLegend = normalizedSymbols ? `
    <g class="standard-symbol-legend">
      <rect x="24" y="222" width="252" height="34" rx="8" />
      <text x="38" y="243" text-anchor="start">Symboles: QF disjoncteur | ID différentiel | X point lumineux | PC prise 2P+T | S interrupteur</text>
    </g>
  ` : "";
  const header = `
    <defs>
      <pattern id="voltia-grid" width="20" height="20" patternUnits="userSpaceOnUse">
        <path d="M 20 0 H 0 V 20" class="diagram-grid-line" />
      </pattern>
      <filter id="component-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#10212b" flood-opacity="0.10" />
      </filter>
    </defs>
    <rect class="diagram-canvas" x="12" y="12" width="596" height="260" rx="12" />
    <text class="diagram-title" x="24" y="28">Schéma électrique - ${safeRoom}</text>
    <text class="diagram-subtitle" x="24" y="48">Usage: ${safeUsage} | ${quantityLine}</text>
    <g class="legend">
      <line class="wire phase" x1="384" y1="24" x2="418" y2="24" /><text x="425" y="28">L phase</text>
      <line class="wire neutral" x1="384" y1="42" x2="418" y2="42" /><text x="425" y="46">N neutre</text>
      <line class="wire earth" x1="384" y1="60" x2="418" y2="60" /><text x="425" y="64">PE terre</text>
    </g>
    ${normalizedLegend}
  `;

  const note = `<text class="diagram-note" x="24" y="268">Schéma de principe indicatif. Respecter la norme applicable et faire valider par un électricien qualifié.</text>`;

  const socketSymbols = Array.from({ length: Math.max(socketTotal, 1) }, (_, index) => {
    const y = 86 + index * 42;
    const branchX = 448 + index * 5;
    const symbolMarkup = normalizedSymbols ? `
      <g class="symbol socket standard-symbol">
        <circle cx="522" cy="${y}" r="18" />
        <line x1="515" y1="${y - 5}" x2="515" y2="${y + 5}" />
        <line x1="529" y1="${y - 5}" x2="529" y2="${y + 5}" />
        <path d="M 522 ${y + 7} v 10 m -8 0 h 16" />
        <text x="522" y="${y + 33}">PC ${index + 1}</text>
      </g>
    ` : `
      <g class="symbol socket">
        <rect x="486" y="${y - 16}" width="72" height="34" rx="7" />
        <circle cx="512" cy="${y}" r="4" />
        <circle cx="532" cy="${y}" r="4" />
        <path d="M 522 ${y + 8} v 9 m -8 0 h 16" />
        <text x="522" y="${y + 31}">Prise ${index + 1}</text>
      </g>
    `;
    return `
      ${symbolMarkup}
      <path class="wire phase" d="M ${branchX} 92 V ${y - 10} H 486" />
      <path class="wire neutral" d="M ${branchX + 12} 112 V ${y} H 486" />
      <path class="wire earth" d="M ${branchX + 24} 132 V ${y + 10} H 486" />
    `;
  }).join("");

  const switchSymbols = Array.from({ length: Math.max(switchTotal, 1) }, (_, index) => {
    const x = 214 + index * 78;
    return normalizedSymbols ? `
      <g class="symbol switch standard-symbol">
        <circle cx="${x}" cy="132" r="4" />
        <circle cx="${x + 38}" cy="132" r="4" />
        <line x1="${x + 5}" y1="132" x2="${x + 32}" y2="116" />
        <text x="${x + 19}" y="166">S${index + 1}</text>
      </g>
    ` : `
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
    const branchX = 468 + index * 8;
    const symbolMarkup = normalizedSymbols ? `
      <g class="symbol lamp standard-symbol">
        <circle cx="536" cy="${y}" r="20" />
        <line x1="522" y1="${y - 14}" x2="550" y2="${y + 14}" />
        <line x1="550" y1="${y - 14}" x2="522" y2="${y + 14}" />
        <text x="536" y="${y + 36}">X${index + 1}</text>
      </g>
    ` : `
      <g class="symbol lamp">
        <circle cx="536" cy="${y}" r="22" />
        <line x1="522" y1="${y - 14}" x2="550" y2="${y + 14}" />
        <line x1="550" y1="${y - 14}" x2="522" y2="${y + 14}" />
        <text x="536" y="${y + 38}">Lampe ${index + 1}</text>
      </g>
    `;
    return `
      ${symbolMarkup}
      <path class="wire phase" d="M ${214 + Math.max(switchTotal - 1, 0) * 78 + 36} 132 H ${branchX} V ${y} H 514" />
      <path class="wire neutral" d="M ${branchX + 12} 204 V ${y + 8} H 514" />
      <path class="wire earth" d="M ${branchX + 24} 224 V ${y + 16} H 514" />
    `;
  }).join("");

  const vaSwitches = Math.max(switchTotal, 2);
  const vaSpacing = vaSwitches > 4 ? 72 : 88;
  const vaStart = 162;
  const vaSwitchSymbols = Array.from({ length: vaSwitches }, (_, index) => {
    const x = vaStart + index * vaSpacing;
    const isFirst = index === 0;
    const isLast = index === vaSwitches - 1;
    const label = isFirst || isLast ? `VA ${index + 1}` : `PERM ${index}`;
    if (!isFirst && !isLast) {
      return `
        <g class="symbol switch">
          <rect x="${x - 8}" y="110" width="54" height="54" rx="8" />
          <circle cx="${x + 4}" cy="122" r="5" />
          <circle cx="${x + 34}" cy="122" r="5" />
          <circle cx="${x + 4}" cy="152" r="5" />
          <circle cx="${x + 34}" cy="152" r="5" />
          <line x1="${x + 8}" y1="122" x2="${x + 30}" y2="152" />
          <line x1="${x + 8}" y1="152" x2="${x + 30}" y2="122" />
          <text x="${x + 19}" y="184">${label}</text>
        </g>
      `;
    }
    return `
      <g class="symbol switch">
        <circle cx="${x}" cy="120" r="6" />
        <circle cx="${x}" cy="152" r="6" />
        <circle cx="${x + 36}" cy="136" r="6" />
        <line x1="${x + 6}" y1="${index % 2 === 0 ? 120 : 152}" x2="${x + 30}" y2="136" />
        <text x="${x + 18}" y="184">${label}</text>
      </g>
    `;
  }).join("");

  const vaLightSymbols = Array.from({ length: Math.max(lightTotal, 1) }, (_, index) => {
    const y = 104 + index * 42;
    const lastSwitchX = vaStart + (vaSwitches - 1) * vaSpacing + 36;
    const branchX = 486 + index * 8;
    return `
      <g class="symbol lamp">
        <circle cx="548" cy="${y}" r="20" />
        <line x1="535" y1="${y - 13}" x2="561" y2="${y + 13}" />
        <line x1="561" y1="${y - 13}" x2="535" y2="${y + 13}" />
        <text x="548" y="${y + 34}">Lampe ${index + 1}</text>
      </g>
      <path class="wire phase" d="M ${lastSwitchX} 136 H ${branchX} V ${y} H 528" />
      <path class="wire neutral" d="M ${branchX + 12} 214 V ${y + 8} H 528" />
      <path class="wire earth" d="M ${branchX + 24} 234 V ${y + 16} H 528" />
    `;
  }).join("");

  if (type === "prise") {
    return `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schéma circuit prise dynamique">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="118" height="126" rx="8" />
          <text x="87" y="112">Tableau</text>
          <rect x="48" y="130" width="78" height="38" rx="5" />
          <text x="87" y="153">${normalizedSymbols ? "QF 16/20A" : "DJ 16/20A"}</text>
        </g>
        <path class="wire phase wire-bus" d="M 126 92 H 462" />
        <path class="wire neutral wire-bus" d="M 126 112 H 474" />
        <path class="wire earth wire-bus" d="M 126 132 H 486" />
        ${socketSymbols}
        <text class="wire-label" x="258" y="82">L / N / PE séparés vers prise(s) en parallèle</text>
        ${note}
      </svg>
    `;
  }

  if (type === "eclairage") {
    return `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schéma éclairage dynamique">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="118" height="126" rx="8" />
          <text x="87" y="112">Tableau</text>
          <rect x="48" y="130" width="78" height="38" rx="5" />
          <text x="87" y="153">${normalizedSymbols ? "QF 10/16A" : "DJ 10/16A"}</text>
        </g>
        ${switchSymbols}
        <path class="wire phase wire-bus" d="M 126 132 H 214" />
        <path class="wire neutral wire-bus" d="M 126 204 H 500" />
        <path class="wire earth wire-bus" d="M 126 224 H 510" />
        ${lightSymbols}
        <text class="wire-label" x="232" y="106">Commande(s)</text>
        <text class="wire-label" x="356" y="197">N et PE distribués sur deux couloirs séparés</text>
        ${note}
      </svg>
    `;
  }

  if (type === "va-et-vient") {
    const firstX = vaStart;
    const lastX = vaStart + (vaSwitches - 1) * vaSpacing;
    return `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schéma va-et-vient dynamique">
        ${header}
        <g class="symbol board">
          <rect x="28" y="88" width="104" height="126" rx="8" />
          <text x="80" y="112">Tableau</text>
          <rect x="48" y="130" width="64" height="38" rx="5" />
          <text x="80" y="153">${normalizedSymbols ? "QF" : "DJ"}</text>
        </g>
        ${vaSwitchSymbols}
        <path class="wire phase" d="M 112 140 H ${firstX + 36}" />
        <path class="wire traveler" d="M ${firstX} 120 H ${lastX}" />
        <path class="wire traveler" d="M ${firstX} 152 H ${lastX}" />
        <path class="wire neutral wire-bus" d="M 112 214 H 516" />
        <path class="wire earth wire-bus" d="M 112 234 H 528" />
        ${vaLightSymbols}
        <text class="wire-label" x="310" y="112">Navette 1</text>
        <text class="wire-label" x="310" y="170">Navette 2</text>
        ${vaSwitches > 2 ? `<text class="wire-label" x="214" y="208">${vaSwitches - 2} permutateur(s) intermediaire(s) entre les deux va-et-vient</text>` : ""}
        ${note}
      </svg>
    `;
  }

  if (type === "tableau") {
    const items = breakerItems;
    const columnWidth = 360 / Math.max(items.length, 1);
    const breakersSvg = items.map((item, index) => {
      const x = 214 + index * columnWidth;
      const width = Math.max(30, Math.min(52, columnWidth - 6));
      const safeItem = escapeHtml(item);
      const [rating = safeItem, ...rest] = safeItem.split(/\s+/);
      const label = rest.join(" ") || `C${index + 1}`;
      return `
        <g class="symbol breaker">
          <rect x="${x}" y="122" width="${width}" height="72" rx="5" />
          <text x="${x + width / 2}" y="146">${rating}</text>
          <text x="${x + width / 2}" y="164">${label.slice(0, 10)}</text>
          <line class="wire phase" x1="${x + width / 2}" y1="112" x2="${x + width / 2}" y2="122" />
          <line class="wire neutral" x1="${x + width / 2}" y1="194" x2="${x + width / 2}" y2="214" />
        </g>
      `;
    }).join("");
    return `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schéma tableau électrique dynamique">
        ${header}
        <g class="symbol board large-board">
          <rect x="32" y="78" width="556" height="158" rx="10" />
          <text x="310" y="100">Tableau électrique - répartition indicative</text>
          <rect x="58" y="122" width="54" height="72" rx="5" />
          <text x="85" y="146">AGCP</text>
          <text x="85" y="164">arrivée</text>
          <rect x="138" y="116" width="58" height="84" rx="5" />
          <text x="167" y="142">${normalizedSymbols ? "ID Δ" : "ID"}</text>
          <text x="167" y="160">30mA</text>
          <text x="167" y="178">type A/AC</text>
          ${breakersSvg}
          <rect x="214" y="210" width="360" height="12" rx="4" />
          <text x="394" y="238">bornier neutre N et barrette de terre PE</text>
        </g>
        <path class="wire phase" d="M 112 140 H 138" />
        <path class="wire neutral" d="M 112 166 H 138" />
        <path class="wire phase" d="M 196 132 H 574" />
        <path class="wire neutral" d="M 196 186 H 574" />
        <path class="wire earth" d="M 58 218 H 574" />
        <text class="wire-label" x="248" y="117">Peigne phase depuis l'interrupteur differentiel</text>
        <text class="wire-label" x="250" y="206">Retours neutres par circuit</text>
        ${note}
      </svg>
    `;
  }

  const templates = {
    prise: `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schéma circuit prise">
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
        <path class="wire phase" d="M 126 112 H 440 V 120 H 486" />
        <path class="wire neutral" d="M 126 146 H 456 V 146 H 486" />
        <path class="wire earth" d="M 126 180 H 472 V 174 H 486" />
        <text class="wire-label" x="294" y="104">L phase</text>
        <text class="wire-label" x="310" y="138">N neutre</text>
        <text class="wire-label" x="324" y="198">PE terre</text>
        ${note}
      </svg>
    `,
    eclairage: `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schéma éclairage simple allumage">
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
        <path class="wire phase" d="M 126 128 H 318" />
        <path class="wire phase" d="M 358 128 H 480 V 137 H 492" />
        <path class="wire neutral" d="M 126 196 H 500 V 167 H 522" />
        <path class="wire earth" d="M 126 224 H 514 V 170 H 522" />
        <text class="wire-label" x="220" y="120">L coupée par interrupteur</text>
        <text class="wire-label" x="362" y="190">N direct lampe</text>
        ${note}
      </svg>
    `,
    "va-et-vient": `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schéma va-et-vient simplifié">
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
        <path class="wire phase" d="M 112 138 H 270" />
        <path class="wire traveler" d="M 230 126 H 378" />
        <path class="wire traveler" d="M 230 156 H 378" />
        <path class="wire phase" d="M 418 141 H 502 V 141 H 508" />
        <path class="wire neutral" d="M 112 212 H 520 V 169 H 536" />
        <path class="wire earth" d="M 112 236 H 532 V 171 H 536" />
        <text class="wire-label" x="300" y="118">Navette 1</text>
        <text class="wire-label" x="300" y="171">Navette 2</text>
        ${note}
      </svg>
    `,
    tableau: `
      <svg viewBox="0 0 620 290" role="img" aria-label="Schéma tableau électrique simplifié">
        ${header}
        <g class="symbol board large-board">
          <rect x="44" y="82" width="500" height="146" rx="10" />
          <text x="294" y="106">Tableau électrique simplifié</text>
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
        <path class="wire phase" d="M 154 136 H 190" />
        <path class="wire neutral" d="M 154 174 H 190" />
        <path class="wire phase" d="M 302 130 H 342" />
        <path class="wire neutral" d="M 302 174 H 342" />
        <path class="wire phase" d="M 302 146 H 438" />
        <path class="wire neutral" d="M 302 190 H 438" />
        <path class="wire earth" d="M 88 214 H 520" />
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
             ├──> [DJ lumière 10/16A] -> circuit éclairage
             │
             └──> [DJ dédié]          -> four, chauffe-eau, etc.

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
  const symbolStyle = schemaSymbolMode?.value === "normalized"
    ? "Symboles électriques normalisés: utilise les repères QF pour disjoncteur, ID pour différentiel, PC pour prise, X pour point lumineux, S pour interrupteur."
    : "Style de lecture claire: privilégie les libellés explicites.";
  const room = schemaRoom.value.trim() || "pièce non précisée";
  const usage = schemaUse.value.trim() || "usage non précisé";
  const counts = getSchemaCounts();
  return [
    "Explique ce schéma électrique indicatif.",
    `Type: ${typeLabel}.`,
    `Style demandé: ${symbolStyle}`,
    `Pièce: ${room}.`,
    `Usage ou puissance: ${usage}.`,
    `Nombre de prises: ${counts.sockets}.`,
    `Nombre de lumieres: ${counts.lights}.`,
    `Nombre d'interrupteurs: ${counts.switches}.`,
    `Nombre de disjoncteurs tableau: ${counts.breakers}.`,
    `Calibres ou circuits demandes: ${counts.breakerRatings || "non precise"}.`,
    schemaType.value === "va-et-vient" && counts.switches > 2
      ? "Important: pour plus de 2 points de commande, explique le principe avec deux va-et-vient aux extremites et un ou plusieurs permutateurs intermediaires."
      : "",
    schemaType.value === "tableau"
      ? "Pour le tableau, explique la logique arrivee/AGCP, interrupteur differentiel 30mA, peignes, disjoncteurs divisionnaires, borniers neutre et terre, sans presenter cela comme un plan de conformite."
      : "",
    buildLevelInstruction(),
    buildResponseFormatInstruction(),
    "Donne une explication simple, les points de sécurité, les limites du schéma, puis rappelle qu'un schéma réel doit respecter la norme applicable et être validé par un électricien."
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
  const asksForDrawing = /\bschema\b|\bschéma\b|\bplan electrique\b|\bplan électrique\b|\bcircuit\b|\bdessin(e|er)?\b|\btrace\b/.test(text);
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
  if (text.includes("lampe") || text.includes("lumiere") || text.includes("lumière") || text.includes("eclairage") || text.includes("éclairage") || text.includes("interrupteur")) {
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
    eclairage: "Éclairage simple allumage",
    "va-et-vient": "Va-et-vient simplifie",
    tableau: "Tableau électrique simplifié"
  };
  return titles[type] || titles.prise;
}

function addAutomaticSchema(content) {
  const type = inferSchemaType(content);
  const counts = inferSchemaCounts(content, type);
  addDiagramMessage(
    schemaTitle(type),
    buildSchema(type, "demande du chat", content.slice(0, 90), counts),
    "Schéma généré automatiquement depuis ta demande. Il reste indicatif et doit être validé avant travaux.",
    buildLineSchema(type, counts)
  );
}

async function askAssistant(content, options = {}) {
  const contentForModel = `${content}\n\n${buildLevelInstruction()}\n${buildResponseFormatInstruction()}`;
  messages.push({ role: "user", content: contentForModel });
  if (!options.skipUserMessage) {
    addMessage("user", content);
  }

  if (!options.skipAutoSchema && isSchemaRequest(content)) {
    addAutomaticSchema(content);
  }

  const pending = addMessage("assistant", "", { loading: true });

  sendButton.disabled = true;
  promptInput.disabled = true;
  const sourceSettings = getSourceSettings();
  hint.textContent = sourceSettings.enabled
    ? "Voltia lit la source indiquée puis prépare la réponse..."
    : sourceSettings.normsSearch
      ? "Voltia recherche les normes en vigueur avant de répondre..."
    : "Voltia analyse les pistes possibles...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages,
        sourceOnly: sourceSettings.enabled,
        sourceUrl: sourceSettings.url,
        normsSearch: sourceSettings.normsSearch
      })
    });

    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    const reply = (data.reply || "").trim() || "Je n'ai pas pu générer de réponse.";
    setAssistantMessage(pending, reply);
    messages.push({ role: "assistant", content: reply });
    await refreshAccount();
    hideConversionBanner();
    hint.textContent = sourceSettings.enabled
      ? "Réponse générée uniquement avec la source indiquée."
      : sourceSettings.normsSearch
        ? "Réponse générée avec recherche de normes. Vérifie toujours la NF C 15-100 officielle avant travaux."
      : "Réponse générée. Précise le contexte si tu veux une piste plus exacte.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas répondre pour l'instant: ${error.message}`);
    hint.textContent = "Vérifie OPENAI_API_KEY, le quota OpenAI et les logs Render si le site est en ligne.";
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
  hint.textContent = "Voltia analyse la photo et prépare un schéma...";

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
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    const reply = (data.reply || "").trim() || "Je n'ai pas pu analyser cette photo.";
    setAssistantMessage(pending, reply);
    messages.push({
      role: "assistant",
      content: `Analyse photo vers schéma:\n${reply}`
    });
    await refreshAccount();
    hideConversionBanner();
    hint.textContent = "Photo analysée. Vérifie toujours avec un électricien avant intervention.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas analyser cette photo pour l'instant: ${error.message}`);
    hint.textContent = "Vérifie la clé API, le quota OpenAI ou essaye une image plus nette.";
  } finally {
    analyzePhoto.disabled = false;
  }
}

async function searchManualNotice() {
  const reference = manualReference.value.trim();

  if (!reference && !selectedManualPhotoDataUrl) {
    hint.textContent = "Ajoute une référence ou une photo avant de rechercher une notice.";
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
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    const reply = (data.reply || "").trim() || "Je n'ai pas pu trouver de notice fiable.";
    setAssistantMessage(pending, reply);
    messages.push({
      role: "assistant",
      content: `Recherche de notice:\n${reply}`
    });
    await refreshAccount();
    hideConversionBanner();
    hint.textContent = "Recherche terminée. Vérifie toujours que la référence correspond exactement à ton appareil.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas rechercher la notice pour l'instant: ${error.message}`);
    hint.textContent = "Vérifie la clé API, le quota OpenAI ou retente avec une référence plus complète.";
  } finally {
    searchManual.disabled = false;
  }
}

async function analyzeLightingPlan() {
  if (!selectedLightingPlanDataUrl) {
    hint.textContent = "Ajoute un plan avant de lancer le dimensionnement éclairage.";
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
  hint.textContent = "Voltia analyse le plan et calcule une implantation d'éclairage...";

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
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    const reply = (data.reply || "").trim() || "Je n'ai pas pu dimensionner cet éclairage.";
    setAssistantMessage(pending, reply);
    messages.push({
      role: "assistant",
      content: `Dimensionnement éclairage:\n${reply}`
    });
    await refreshAccount();
    hideConversionBanner();
    hint.textContent = "Dimensionnement généré. Vérifie les cotes et fais valider avant travaux.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas dimensionner l'éclairage pour l'instant: ${error.message}`);
    hint.textContent = "Vérifie la clé API, le quota OpenAI ou ajoute un plan plus lisible.";
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
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    const reply = (data.reply || "").trim() || "Je n'ai pas pu dimensionner cette climatisation.";
    setAssistantMessage(pending, reply);
    messages.push({
      role: "assistant",
      content: `Dimensionnement climatisation:\n${reply}`
    });
    await refreshAccount();
    hideConversionBanner();
    hint.textContent = "Estimation clim générée. Vérifie avec un frigoriste avant achat ou pose.";
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
    normsSearchToggle.checked = false;
    normsSearchToggle.disabled = true;
    sourceUrlInput.focus();
    hint.textContent = "Colle l'URL exacte de la page que Voltia doit utiliser comme seule source.";
  } else {
    normsSearchToggle.disabled = false;
    hint.textContent = "Source libre : Voltia peut répondre avec ses connaissances générales.";
  }
});

normsSearchToggle.addEventListener("change", () => {
  hint.textContent = normsSearchToggle.checked
    ? "Mode normes activé : Voltia cherchera les règles en vigueur et citera les sources disponibles."
    : "Mode normes désactivé.";
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
  addMessage("assistant", "Conversation effacée. Lance un diagnostic ou décris ton prochain problème électrique.");
  hint.textContent = "Nouvelle recherche démarrée.";
  promptInput.focus();
});

exportReportButton.addEventListener("click", exportConversationReport);
saveReportButton.addEventListener("click", saveConversationReport);
showSampleReport?.addEventListener("click", showProfessionalReportExample);
conversionPrimaryButton?.addEventListener("click", () => conversionPrimaryAction());
conversionSecondaryButton?.addEventListener("click", () => conversionSecondaryAction());
projectUpsellButton?.addEventListener("click", startCheckout);
createProjectButton?.addEventListener("click", createProject);

reportList?.addEventListener("click", async (event) => {
  const link = event.target.closest("[data-report-id]");
  if (!link) return;
  event.preventDefault();
  await loadSavedConversation(link.dataset.reportId);
});

projectList?.addEventListener("click", async (event) => {
  const projectButton = event.target.closest("[data-project-id]");
  const allButton = event.target.closest("[data-project-filter='all']");

  if (allButton) {
    event.preventDefault();
    await loadProject("");
    return;
  }

  if (!projectButton) return;
  event.preventDefault();
  await loadProject(projectButton.dataset.projectId);
});

toolCards.forEach((card) => {
  const heading = card.querySelector(".card-heading");
  if (!heading) return;

  const setOpenCard = () => {
    const alreadyOpen = card.classList.contains("is-open");
    toolCards.forEach((item) => item.classList.remove("is-open"));
    if (!alreadyOpen) {
      card.classList.add("is-open");
    }
    syncToolCardStates();
  };

  heading.setAttribute("role", "button");
  heading.setAttribute("tabindex", "0");
  heading.addEventListener("click", setOpenCard);
  heading.addEventListener("keydown", (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    event.preventDefault();
    setOpenCard();
  });

  card.addEventListener("click", (event) => {
    if (event.target.closest("input, select, textarea, button, label, .upload-zone, .card-heading")) return;
    if (card.classList.contains("is-open")) return;
    setOpenCard();
  });
});

function syncToolCardStates() {
  toolCards.forEach((card) => {
    card.querySelector(".card-heading")?.setAttribute("aria-expanded", String(card.classList.contains("is-open")));
  });
}

syncToolCardStates();

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
    hint.textContent = `Niveau choisi : ${button.textContent}. Les prochaines réponses seront adaptées.`;
  });
});

signupToggleButton.addEventListener("click", () => {
  signupFields.hidden = !signupFields.hidden;
  if (!signupFields.hidden) {
    authName.focus();
    setHint("Remplis ton nom, ton email et ton mot de passe pour créer ton compte.");
  } else {
    setHint("Création de compte repliée. Tu peux te connecter si tu as déjà un compte.");
  }
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
  const styleLabel = schemaSymbolMode?.selectedOptions?.[0]?.textContent || "Lecture claire";
  const room = schemaRoom.value.trim();
  const usage = schemaUse.value.trim();
  const counts = getSchemaCounts();
  const schemaPrompt = buildSchemaPrompt();
  addMessage("user", `Crée un schéma : ${typeLabel}, style : ${styleLabel}${room ? `, pièce : ${room}` : ""}${usage ? `, usage : ${usage}` : ""}.`);
  addDiagramMessage(
    typeLabel,
    buildSchema(schemaType.value, room, usage, counts),
    "Schéma indicatif généré par Voltia. Ne pas intervenir sous tension.",
    buildLineSchema(schemaType.value, counts)
  );
  await askAssistant(schemaPrompt, { skipAutoSchema: true, skipUserMessage: true });
});

schemaType.addEventListener("change", () => {
  syncSchemaDefaults();
  hint.textContent = "Type de schéma mis à jour. Ajuste les quantités puis crée le schéma.";
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
    photoPreview.innerHTML = `<img src="${selectedPhotoDataUrl}" alt="Aperçu de la photo">`;
    hint.textContent = "Photo chargée. Ajoute un contexte si besoin puis lance l'analyse.";
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
    manualPhotoPreview.innerHTML = `<img src="${selectedManualPhotoDataUrl}" alt="Aperçu de la référence">`;
    hint.textContent = "Photo de référence chargée. Tu peux lancer la recherche de notice.";
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
    lightingPlanPreview.innerHTML = `<img src="${selectedLightingPlanDataUrl}" alt="Aperçu du plan">`;
    hint.textContent = "Plan chargé. Ajoute les dimensions connues puis lance le dimensionnement.";
  });
  reader.readAsDataURL(file);
});

analyzePhoto.addEventListener("click", analyzePhotoToSchema);
searchManual.addEventListener("click", searchManualNotice);
analyzeLighting.addEventListener("click", analyzeLightingPlan);
sizeClimate.addEventListener("click", sizeClimateSystem);

await refreshAccount();
handleLandingState();
const initialReportId = pageParams.get("report");
if (initialReportId) {
  await loadSavedConversation(initialReportId);
}
syncSchemaDefaults();
autosize();
