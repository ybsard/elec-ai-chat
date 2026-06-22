const form = document.querySelector("#chatForm");
const promptInput = document.querySelector("#prompt");
const messagesEl = document.querySelector("#messages");
const chatShell = document.querySelector(".chat-shell");
const fullscreenButton = document.querySelector("#toggleChatFullscreen");
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
const plusToolCards = document.querySelectorAll(".schema-card, .photo-card, .manual-card, .lighting-card, .climate-card");
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
const loginModeButton = document.querySelector("#loginModeButton");
const loginFields = document.querySelector("#loginFields");
const signupEmail = document.querySelector("#signupEmail");
const signupPassword = document.querySelector("#signupPassword");
const signupAccountRole = document.querySelector("#signupAccountRole");
const signupButton = document.querySelector("#signupButton");
const loginButton = document.querySelector("#loginButton");
const accessCodeDisclosure = document.querySelector("#accessCodeDisclosure");
const memberActions = document.querySelector("#memberActions");
const upgradeButton = document.querySelector("#upgradeButton");
const exportAccountButton = document.querySelector("#exportAccountButton");
const deleteAccountButton = document.querySelector("#deleteAccountButton");
const logoutButton = document.querySelector("#logoutButton");
const pedagogyPanel = document.querySelector("#pedagogyPanel");
const pedagogyBadge = document.querySelector("#pedagogyBadge");
const teacherPedagogyPanel = document.querySelector("#teacherPedagogyPanel");
const studentPedagogyPanel = document.querySelector("#studentPedagogyPanel");
const pedagogyClassName = document.querySelector("#pedagogyClassName");
const pedagogyResponseMode = document.querySelector("#pedagogyResponseMode");
const pedagogyCategoryInputs = document.querySelectorAll("[name='pedagogyCategory']");
const pedagogyCustomRules = document.querySelector("#pedagogyCustomRules");
const pedagogyTeacherMessage = document.querySelector("#pedagogyTeacherMessage");
const pedagogyActive = document.querySelector("#pedagogyActive");
const savePedagogyButton = document.querySelector("#savePedagogyButton");
const regeneratePedagogyCodeButton = document.querySelector("#regeneratePedagogyCodeButton");
const deletePedagogyButton = document.querySelector("#deletePedagogyButton");
const pedagogyCodeCard = document.querySelector("#pedagogyCodeCard");
const pedagogyClassCode = document.querySelector("#pedagogyClassCode");
const copyPedagogyCodeButton = document.querySelector("#copyPedagogyCodeButton");
const pedagogyStudentCount = document.querySelector("#pedagogyStudentCount");
const pedagogyStudentRoster = document.querySelector("#pedagogyStudentRoster");
const pedagogyStudentList = document.querySelector("#pedagogyStudentList");
const studentClassroomStatus = document.querySelector("#studentClassroomStatus");
const studentJoinClassroom = document.querySelector("#studentJoinClassroom");
const studentClassCode = document.querySelector("#studentClassCode");
const joinClassroomButton = document.querySelector("#joinClassroomButton");
const pedagogyNotice = document.querySelector("#pedagogyNotice");
const reportHistory = document.querySelector("#reportHistory");
const reportHistoryTitle = document.querySelector("#reportHistoryTitle");
const reportHistorySubtitle = document.querySelector("#reportHistorySubtitle");
const reportList = document.querySelector("#reportList");
const projectWorkspace = document.querySelector("#projectWorkspace");
const projectWorkspaceTitle = document.querySelector("#projectWorkspaceTitle");
const projectWorkspaceSubtitle = document.querySelector("#projectWorkspaceSubtitle");
const activeProjectBadge = document.querySelector("#activeProjectBadge");
const projectExportLink = document.querySelector("#projectExportLink");
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
const photoObjectResult = document.querySelector("#photoObjectResult");
const analyzePhoto = document.querySelector("#analyzePhoto");
const manualReference = document.querySelector("#manualReference");
const manualPhotoInput = document.querySelector("#manualPhotoInput");
const manualPhotoLabel = document.querySelector("#manualPhotoLabel");
const manualPhotoPreview = document.querySelector("#manualPhotoPreview");
const searchManual = document.querySelector("#searchManual");
const lightingPlanInput = document.querySelector("#lightingPlanInput");
const lightingPlanLabel = document.querySelector("#lightingPlanLabel");
const lightingPlanPreview = document.querySelector("#lightingPlanPreview");
const lightingSketchCanvas = document.querySelector("#lightingSketchCanvas");
const lightingDrawModeButtons = document.querySelectorAll("[data-lighting-draw-mode]");
const useLightingSketch = document.querySelector("#useLightingSketch");
const clearLightingSketch = document.querySelector("#clearLightingSketch");
const lightingSketchStatus = document.querySelector("#lightingSketchStatus");
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
let schemaRenderSequence = 0;
let selectedPhotoDataUrl = "";
let selectedManualPhotoDataUrl = "";
let selectedLightingPlanDataUrl = "";
let selectedLightingPlanSource = "";
let selectedLevel = "debutant";
let currentUser = null;
let pedagogyContext = { role: "anonymous", classroom: null };
let hasAccessPass = false;
const pageParams = new URLSearchParams(window.location.search);
let conversionPrimaryAction = () => {};
let conversionSecondaryAction = () => {};
let projectsCache = [];
let allReportsCache = [];
let activeProjectId = "";
let anonymousQuotaExhausted = false;
let fallbackChatFullscreen = false;
let lightingSketchMode = "draw";
let lightingSketchDrawing = false;
let lightingSketchCurrentStroke = null;
let lightingSketchStrokes = [];

function updateCounter() {
  counter.textContent = `${promptInput.value.length} / ${maxLength}`;
}

function setChatFullscreenState(active) {
  fallbackChatFullscreen = active && document.fullscreenElement !== chatShell;
  chatShell?.classList.toggle("is-chat-fullscreen", active);
  document.body.classList.toggle("chat-fullscreen-active", active);

  if (!fullscreenButton) return;
  fullscreenButton.setAttribute("aria-pressed", String(active));
  fullscreenButton.textContent = active ? "Réduire" : "Plein écran";
  fullscreenButton.title = active ? "Quitter le plein écran" : "Mettre le chat en plein écran";
  fullscreenButton.setAttribute(
    "aria-label",
    active ? "Quitter le plein écran du chat" : "Mettre le chat en plein écran"
  );
}

async function enterChatFullscreen() {
  if (!chatShell) return;

  if (chatShell.requestFullscreen) {
    try {
      await chatShell.requestFullscreen();
      setChatFullscreenState(true);
      return;
    } catch {
      // Fallback for browsers or embedded contexts that block the fullscreen API.
    }
  }

  setChatFullscreenState(true);
}

async function exitChatFullscreen() {
  if (document.fullscreenElement === chatShell && document.exitFullscreen) {
    await document.exitFullscreen();
    return;
  }

  setChatFullscreenState(false);
}

async function toggleChatFullscreen() {
  if (chatShell?.classList.contains("is-chat-fullscreen") || document.fullscreenElement === chatShell) {
    await exitChatFullscreen();
    return;
  }

  await enterChatFullscreen();
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
    const codeText = codeLines.join("\n");
    const codeClasses = [];
    if (/⊗\s*S\d+|S\d+/.test(codeText)) codeClasses.push("lighting-plan-code");
    if (/(?:QF|ID|PC|XTB)\s*\d+|L\s*[\/|]\s*N\s*[\/|]\s*PE|SCH[ÉE]MA\s+UNIFILAIRE/i.test(codeText)) {
      codeClasses.push("electrical-plan-code");
    }
    const extraClass = codeClasses.length ? ` ${codeClasses.join(" ")}` : "";
    html.push(`<pre class="response-code${extraClass}">${escapeHtml(codeText)}</pre>`);
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

function addDiagramMessage(title, svgMarkup, note) {
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

function cleanIdentityValue(value) {
  const text = String(value || "").trim();
  return /^(inconn|illisible|non visible|non identifi)/i.test(text) ? "" : text;
}

function renderRecognizedObject(identity) {
  if (!photoObjectResult) return;

  const category = cleanIdentityValue(identity?.category);
  const brand = cleanIdentityValue(identity?.brand);
  const model = cleanIdentityValue(identity?.model);
  const reference = cleanIdentityValue(identity?.reference);
  const confidence = cleanIdentityValue(identity?.confidence);
  const values = [brand, model, reference].filter(Boolean);

  if (!category && !values.length) {
    photoObjectResult.hidden = true;
    photoObjectResult.innerHTML = "";
    return;
  }

  photoObjectResult.hidden = false;
  photoObjectResult.innerHTML = `
    <strong>Objet reconnu</strong>
    <span>${escapeHtml([category, ...values].filter(Boolean).join(" · "))}</span>
    ${confidence ? `<small>Confiance IA : ${escapeHtml(confidence)}</small>` : ""}
    <small>La référence doit correspondre exactement à l'étiquette avant d'utiliser une notice.</small>
  `;

  if (!manualReference.value.trim() && values.length) {
    manualReference.value = values.join(" ");
  }
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

function getLightingSketchContext() {
  return lightingSketchCanvas?.getContext("2d") || null;
}

function drawLightingSketchGrid(ctx) {
  const width = lightingSketchCanvas.width;
  const height = lightingSketchCanvas.height;
  ctx.clearRect(0, 0, width, height);
  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, width, height);

  for (let x = 0; x <= width; x += 20) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, height);
    ctx.strokeStyle = x % 100 === 0 ? "#b7cbd6" : "#e4edf2";
    ctx.lineWidth = x % 100 === 0 ? 1.4 : 1;
    ctx.stroke();
  }

  for (let y = 0; y <= height; y += 20) {
    ctx.beginPath();
    ctx.moveTo(0, y);
    ctx.lineTo(width, y);
    ctx.strokeStyle = y % 100 === 0 ? "#b7cbd6" : "#e4edf2";
    ctx.lineWidth = y % 100 === 0 ? 1.4 : 1;
    ctx.stroke();
  }
}

function drawLightingSketchStroke(ctx, stroke) {
  if (!stroke?.points?.length) return;
  ctx.save();
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.strokeStyle = stroke.mode === "erase" ? "#ffffff" : "#10212b";
  ctx.lineWidth = stroke.mode === "erase" ? 28 : 5;
  ctx.beginPath();
  stroke.points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });
  ctx.stroke();
  ctx.restore();
}

function renderLightingSketch() {
  const ctx = getLightingSketchContext();
  if (!ctx) return;
  drawLightingSketchGrid(ctx);
  lightingSketchStrokes.forEach((stroke) => drawLightingSketchStroke(ctx, stroke));
}

function getLightingSketchPoint(event) {
  const rect = lightingSketchCanvas.getBoundingClientRect();
  const scaleX = lightingSketchCanvas.width / rect.width;
  const scaleY = lightingSketchCanvas.height / rect.height;
  return {
    x: Math.min(Math.max((event.clientX - rect.left) * scaleX, 0), lightingSketchCanvas.width),
    y: Math.min(Math.max((event.clientY - rect.top) * scaleY, 0), lightingSketchCanvas.height)
  };
}

function setLightingSketchMode(mode) {
  lightingSketchMode = mode === "erase" ? "erase" : "draw";
  lightingDrawModeButtons.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.lightingDrawMode === lightingSketchMode);
  });
  if (lightingSketchStatus) {
    lightingSketchStatus.textContent = lightingSketchMode === "erase"
      ? "Gomme active. Efface les traits inutiles puis utilise le croquis comme plan."
      : "Crayon actif. Dessine murs, portes, meubles, zones et cotes utiles.";
  }
}

function useLightingSketchAsPlan({ silent = false } = {}) {
  if (!lightingSketchCanvas || !lightingSketchStrokes.length) {
    if (!silent) {
      setHint("Dessine d'abord un croquis sur le quadrillage ou importe un plan.", true);
      lightingSketchCanvas?.focus();
    }
    return false;
  }

  selectedLightingPlanDataUrl = lightingSketchCanvas.toDataURL("image/png");
  selectedLightingPlanSource = "sketch";
  lightingPlanLabel.textContent = "Croquis quadrillé";
  lightingPlanPreview.hidden = false;
  lightingPlanPreview.innerHTML = `<img src="${selectedLightingPlanDataUrl}" alt="Aperçu du croquis quadrillé">`;
  if (lightingSketchStatus) {
    lightingSketchStatus.textContent = "Croquis utilisé comme plan d'entrée pour Voltia.";
  }
  if (!silent) {
    setHint("Croquis quadrillé prêt. Ajoute les cotes connues puis lance le dimensionnement.");
  }
  return true;
}

function clearLightingSketchCanvas() {
  lightingSketchStrokes = [];
  lightingSketchCurrentStroke = null;
  lightingSketchDrawing = false;
  renderLightingSketch();

  if (selectedLightingPlanSource === "sketch") {
    selectedLightingPlanDataUrl = "";
    selectedLightingPlanSource = "";
    lightingPlanLabel.textContent = "Choisir un plan";
    lightingPlanPreview.hidden = true;
    lightingPlanPreview.innerHTML = "";
  }

  if (lightingSketchStatus) {
    lightingSketchStatus.textContent = "Croquis effacé. Redessine la pièce ou importe un plan.";
  }
  setHint("Croquis effacé.");
}

function startLightingSketchStroke(event) {
  if (!lightingSketchCanvas) return;
  event.preventDefault();
  lightingSketchDrawing = true;
  lightingSketchCurrentStroke = {
    mode: lightingSketchMode,
    points: [getLightingSketchPoint(event)]
  };
  lightingSketchCanvas.setPointerCapture?.(event.pointerId);
}

function moveLightingSketchStroke(event) {
  if (!lightingSketchDrawing || !lightingSketchCurrentStroke) return;
  event.preventDefault();
  lightingSketchCurrentStroke.points.push(getLightingSketchPoint(event));
  renderLightingSketch();
  drawLightingSketchStroke(getLightingSketchContext(), lightingSketchCurrentStroke);
}

function endLightingSketchStroke(event) {
  if (!lightingSketchDrawing || !lightingSketchCurrentStroke) return;
  event.preventDefault();
  lightingSketchDrawing = false;
  lightingSketchCanvas.releasePointerCapture?.(event.pointerId);
  lightingSketchStrokes.push(lightingSketchCurrentStroke);
  lightingSketchCurrentStroke = null;
  renderLightingSketch();
  if (lightingSketchStatus) {
    lightingSketchStatus.textContent = "Croquis modifié. Clique sur Utiliser ce croquis pour l'envoyer à Voltia.";
  }
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
                Niveau : ${escapeHtml(selectedLevel)}<br>
                Version export : 2
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
  const hasConversation = getVisibleConversation().length > 0;
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
  hint.textContent = "Rapport ouvert. Choisis Enregistrer en PDF dans la fenêtre d'impression.";
}

function showProfessionalReportExample() {
  messages.length = 0;
  messagesEl.innerHTML = "";
  if (reportType) {
    reportType.value = "diagnostic";
  }
  schemaSymbolMode.value = "engineering";

  const request = "Exemple: le disjoncteur saute quand le four démarre dans la cuisine.";
  const response = [
    "Réponse directe",
    "Le symptôme oriente d'abord vers un défaut lié au four, à son circuit dédié ou à une surcharge ponctuelle. Le bon réflexe avant toute intervention est d'identifier quel appareil de protection déclenche exactement et à quel moment.",
    "",
    "Résumé rapide",
    "- Le défaut peut venir du four lui-même, du circuit spécialisé ou d'un échauffement sur la ligne.",
    "- Voltia aide à trier les pistes et à préparer un rapport clair avant contrôle sur place.",
    "",
    "Niveau de danger",
    "- Vigilance renforcée si odeur de brûlé, chaleur anormale ou déclenchement immédiat et répété.",
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
    "Dossier bureau d'études - circuit four",
    buildSchema("prise", "cuisine", "four 20A", {
      sockets: 1,
      lights: 0,
      switches: 0,
      breakers: 1,
      breakerRatings: "20A four",
      symbolMode: "engineering"
    }),
    "Exemple indicatif: le circuit spécialisé four doit être vérifié selon l'installation réelle."
  );

  messagesEl.scrollTop = 0;

  if (!currentUser) {
    showConversionBanner({
      title: "Le format de rapport te convient ?",
      text: "Crée un compte gratuit sans carte pour sauvegarder un vrai cas, retrouver tes échanges et exporter ton prochain rapport.",
      primaryLabel: "Créer un compte gratuit",
      onPrimary: () => {
        openSignupFlow();
        setHint("Crée ton compte gratuit pour garder ce niveau de lisibilité sur tes vrais diagnostics.", true);
      },
      secondaryLabel: "Voir Plus",
      onSecondary: () => {
        window.location.href = "/pro.html";
      }
    });
  } else if (currentUser.plan !== "pro") {
    showConversionBanner({
      title: "Tu peux déjà garder ce format dans ton compte",
      text: "Le compte gratuit sauvegarde et exporte déjà tes rapports. Active Plus si tu veux les modules photo, notices, dimensionnements et les dossiers complets.",
      primaryLabel: "Sauvegarder un rapport",
      onPrimary: () => {
        saveConversationReport();
      },
      secondaryLabel: "Voir Plus",
      onSecondary: () => {
        window.location.href = "/pro.html";
      }
    });
  } else {
    hideConversionBanner();
  }

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
    const item = document.createElement("article");
    item.className = "report-history-item";
    const date = report.createdAt ? new Date(report.createdAt).toLocaleDateString("fr-FR") : "Date inconnue";
    const type = String(report.title || "").split(" - ")[0] || "Rapport Voltia";
    const projectLabel = report.projectName ? ` · Dossier ${escapeHtml(report.projectName)}` : "";
    item.innerHTML = `
      <a class="report-item-main" href="/?report=${encodeURIComponent(report.id)}" data-report-id="${escapeHtml(report.id)}">
        <strong>${escapeHtml(report.title || "Rapport Voltia")}</strong>
        <small><b>${escapeHtml(type)}</b>${projectLabel} · ${escapeHtml(date)} · ${escapeHtml(report.preview || "Rapport sauvegardé")}</small>
      </a>
      <a class="report-item-action" href="/api/reports/${encodeURIComponent(report.id)}/export.html" target="_blank" rel="noopener noreferrer">Exporter</a>
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
        ? "Tous tes rapports Plus récents, avec ou sans dossier."
        : "Les derniers rapports sauvegardés dans ton compte.",
    emptyMessage: activeProject
      ? "Aucun rapport dans ce dossier pour l'instant."
      : "Aucun rapport sauvegardé pour l'instant."
  });
}

function updateSaveTargetUi() {
  if (!saveTargetText) return;

  if (!currentUser) {
    saveTargetText.textContent = "Crée un compte gratuit pour sauvegarder et exporter tes rapports. Active Plus pour les modules photo, notices, dimensionnements et les dossiers complets.";
    if (activeProjectBadge) {
      activeProjectBadge.textContent = "Tous les rapports";
    }
    if (projectExportLink) {
      projectExportLink.hidden = true;
      projectExportLink.href = "#";
    }
    return;
  }

  if (currentUser.plan !== "pro") {
    activeProjectId = "";
    saveTargetText.textContent = "Compte gratuit : rapport sauvegardé et export individuel. Plus ajoute les modules photo, notices, dimensionnements, dossiers et export complet.";
    if (activeProjectBadge) {
      activeProjectBadge.textContent = "Compte gratuit";
    }
    if (projectExportLink) {
      projectExportLink.hidden = true;
      projectExportLink.href = "#";
    }
    return;
  }

  const activeProject = getProjectById(activeProjectId);
  if (activeProjectBadge) {
    activeProjectBadge.textContent = activeProject ? activeProject.name : "Tous les rapports";
  }
  if (projectExportLink) {
    projectExportLink.hidden = !activeProject;
    projectExportLink.href = activeProject
      ? `/api/projects/${encodeURIComponent(activeProject.id)}/export.html`
      : "#";
  }

  if (activeProject) {
    saveTargetText.textContent = `Voltia Plus : le prochain rapport sera rangé dans le dossier "${activeProject.name}". Tu peux aussi exporter ce dossier complet pour l'imprimer ou le partager.`;
    return;
  }

  if (projectsCache.length) {
    saveTargetText.textContent = "Voltia Plus : choisis un dossier pour ranger le prochain rapport, ou garde une vue générale de tous tes cas récents.";
    return;
  }

  saveTargetText.textContent = "Voltia Plus : crée un premier dossier pour classer tes photos, notices, dimensionnements et rapports.";
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

  projectWorkspaceTitle.textContent = "Dossiers Plus";
  projectWorkspaceSubtitle.textContent = isPro
    ? "Classe tes schémas, notices, dimensionnements et rapports par projet."
    : "Le compte gratuit sauvegarde tes rapports. Voltia Plus ajoute les modules premium et les dossiers.";

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
      <span>Commence par créer un dossier pour regrouper photos, notices, dimensionnements et rapports.</span>
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
        <span>${escapeHtml(project.description || "Regroupe les livrables de ce dossier dans un espace dédié.")}</span>
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
    showProjectsUpgradePrompt("Les dossiers et exports sont réservés à Voltia Plus.");
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
      secondaryLabel: "Voir Plus",
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

function setAuthMode(mode, { focus = false } = {}) {
  const signupMode = mode !== "login";
  signupFields.hidden = !signupMode;
  loginFields.hidden = signupMode;
  signupToggleButton.classList.toggle("is-active", signupMode);
  loginModeButton.classList.toggle("is-active", !signupMode);
  signupToggleButton.setAttribute("aria-selected", String(signupMode));
  loginModeButton.setAttribute("aria-selected", String(!signupMode));

  if (focus) {
    (signupMode ? authName : authEmail)?.focus();
  }
}

function setPedagogyNotice(message, important = false) {
  if (!pedagogyNotice) return;
  pedagogyNotice.textContent = message || "";
  pedagogyNotice.classList.toggle("is-important", important);
}

function pedagogyBlocksCategory(category) {
  const classroom = pedagogyContext?.role === "student" ? pedagogyContext.classroom : null;
  return Boolean(classroom?.active && classroom.blockedCategories?.includes(category));
}

function normalizePedagogyText(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[’']/g, " ")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function pedagogyCustomRuleMatches(content) {
  const classroom = pedagogyContext?.role === "student" ? pedagogyContext.classroom : null;
  if (!classroom?.active) return false;
  const text = normalizePedagogyText(content);
  const stopWords = new Set(["avec", "dans", "pour", "sans", "sous", "question", "questions", "reponse", "reponses", "type"]);
  return (classroom.customRules || []).some((rule) => {
    const normalizedRule = normalizePedagogyText(rule);
    if (!normalizedRule) return false;
    if (text.includes(normalizedRule)) return true;
    const tokens = normalizedRule.split(" ").filter((token) => token.length >= 4 && !stopWords.has(token));
    return tokens.length > 0 && tokens.every((token) => text.includes(token));
  });
}

function pedagogyBlocksRequest(category, content = "") {
  return pedagogyBlocksCategory(category) || pedagogyCustomRuleMatches(content);
}

function guardPedagogicalFeature(category, content = "") {
  if (!pedagogyBlocksRequest(category, content)) return false;
  const classroom = pedagogyContext.classroom;
  const message = [
    `Cette fonctionnalité est limitée par le cadre pédagogique de la classe « ${classroom.name} ».`,
    classroom.responseMode === "guided"
      ? "Demande plutôt une méthode, un indice ou une vérification de ta propre démarche."
      : "Consulte ton cours puis demande à ton enseignant de vérifier ton raisonnement.",
    classroom.teacherMessage || ""
  ].filter(Boolean).join(" ");
  addMessage("assistant", message);
  setHint("Cadre pédagogique actif : cette catégorie est bridée par l'enseignant.", true);
  return true;
}

function renderPedagogicalStudents(students = []) {
  if (!pedagogyStudentRoster || !pedagogyStudentList) return;
  const safeStudents = Array.isArray(students) ? students : [];
  pedagogyStudentRoster.hidden = safeStudents.length === 0;
  pedagogyStudentList.replaceChildren();
  for (const student of safeStudents) {
    const row = document.createElement("div");
    row.className = "pedagogy-student-row";
    const identity = document.createElement("span");
    const name = document.createElement("strong");
    name.textContent = student.name || "Élève";
    const joined = document.createElement("small");
    joined.textContent = student.joinedAt
      ? `Rattaché le ${new Date(student.joinedAt).toLocaleDateString("fr-FR")}`
      : "Élève rattaché";
    identity.append(name, joined);
    const removeButton = document.createElement("button");
    removeButton.type = "button";
    removeButton.className = "secondary-action danger-action";
    removeButton.dataset.studentId = String(student.id || "");
    removeButton.dataset.studentName = String(student.name || "cet élève");
    removeButton.textContent = "Détacher";
    row.append(identity, removeButton);
    pedagogyStudentList.append(row);
  }
}

function renderPedagogy(context = { role: "anonymous", classroom: null }) {
  pedagogyContext = context && typeof context === "object" ? context : { role: "anonymous", classroom: null };
  if (!pedagogyPanel) return;
  if (!currentUser) {
    pedagogyPanel.hidden = true;
    teacherPedagogyPanel.hidden = true;
    studentPedagogyPanel.hidden = true;
    return;
  }

  const role = currentUser.accountRole === "teacher" ? "teacher" : "student";
  const classroom = pedagogyContext.classroom || null;
  pedagogyPanel.hidden = false;
  teacherPedagogyPanel.hidden = role !== "teacher";
  studentPedagogyPanel.hidden = role !== "student";
  pedagogyPanel.classList.toggle("is-teacher", role === "teacher");
  pedagogyPanel.classList.toggle("is-student", role === "student");
  pedagogyPanel.classList.toggle("has-classroom", Boolean(classroom));

  if (role === "teacher") {
    pedagogyBadge.textContent = classroom
      ? classroom.active ? "Classe active" : "Cadre suspendu"
      : "À configurer";
    pedagogyClassName.value = classroom?.name || "";
    pedagogyResponseMode.value = classroom?.responseMode === "guided" ? "guided" : "block";
    pedagogyCustomRules.value = (classroom?.customRules || []).join("\n");
    pedagogyTeacherMessage.value = classroom?.teacherMessage || "";
    pedagogyActive.checked = classroom?.active !== false;
    const selectedCategories = new Set(classroom?.blockedCategories || []);
    pedagogyCategoryInputs.forEach((input) => {
      input.checked = selectedCategories.has(input.value);
    });
    savePedagogyButton.textContent = classroom ? "Enregistrer les règles" : "Créer le code classe";
    regeneratePedagogyCodeButton.hidden = !classroom;
    deletePedagogyButton.hidden = !classroom;
    pedagogyCodeCard.hidden = !classroom;
    pedagogyClassCode.textContent = classroom?.code || "VLT-••••";
    const studentCount = Number(classroom?.studentCount || 0);
    pedagogyStudentCount.textContent = `${studentCount} élève${studentCount > 1 ? "s" : ""} rattaché${studentCount > 1 ? "s" : ""}`;
    renderPedagogicalStudents(classroom?.students || []);
    return;
  }

  pedagogyBadge.textContent = classroom
    ? classroom.active ? "Classe active" : "Cadre suspendu"
    : "Aucune classe";
  studentJoinClassroom.hidden = Boolean(classroom);
  if (!classroom) {
    studentClassroomStatus.innerHTML = `
      <strong>Aucune classe rattachée</strong>
      <p>Entre le code transmis par ton enseignant. Une fois rattaché, seul l'enseignant peut retirer le cadre.</p>
    `;
    return;
  }
  const categoryCount = classroom.blockedCategories?.length || 0;
  const customCount = classroom.customRules?.length || 0;
  studentClassroomStatus.innerHTML = `
    <strong>${escapeHtml(classroom.name)}</strong>
    <p>Enseignant : ${escapeHtml(classroom.teacherName || "Enseignant")} · ${categoryCount} catégorie${categoryCount > 1 ? "s" : ""} et ${customCount} règle${customCount > 1 ? "s" : ""} personnalisée${customCount > 1 ? "s" : ""}.</p>
    <p><b>État :</b> ${classroom.active ? "actif" : "suspendu par l'enseignant"} · <b>Mode :</b> ${classroom.responseMode === "guided" ? "méthode ou indice uniquement" : "blocage total"}. ${escapeHtml(classroom.teacherMessage || "")}</p>
  `;
}

async function loadPedagogyContext() {
  if (!currentUser) {
    renderPedagogy({ role: "anonymous", classroom: null });
    return;
  }
  try {
    const response = await fetch("/api/pedagogy");
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error || "Cadre pédagogique indisponible.");
    renderPedagogy(data);
  } catch (error) {
    setPedagogyNotice(error.message, true);
  }
}

async function savePedagogicalClassroom() {
  const blockedCategories = Array.from(pedagogyCategoryInputs).filter((input) => input.checked).map((input) => input.value);
  savePedagogyButton.disabled = true;
  setPedagogyNotice("Enregistrement du cadre pédagogique...");
  try {
    const response = await fetch("/api/pedagogy/classroom", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: pedagogyClassName.value.trim(),
        responseMode: pedagogyResponseMode.value,
        blockedCategories,
        customRules: pedagogyCustomRules.value.split(/\r?\n/),
        teacherMessage: pedagogyTeacherMessage.value.trim(),
        active: pedagogyActive.checked
      })
    });
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error || "Enregistrement impossible.");
    renderPedagogy(data);
    setPedagogyNotice("Cadre enregistré. Le code peut maintenant être transmis aux élèves.");
  } catch (error) {
    setPedagogyNotice(error.message, true);
  } finally {
    savePedagogyButton.disabled = false;
  }
}

async function regeneratePedagogicalCode() {
  regeneratePedagogyCodeButton.disabled = true;
  setPedagogyNotice("Remplacement du code en cours...");
  try {
    const response = await fetch("/api/pedagogy/classroom/code", { method: "POST" });
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error || "Impossible de remplacer le code.");
    renderPedagogy(data);
    setPedagogyNotice("Nouveau code généré. L'ancien code ne permet plus de rejoindre la classe.");
  } catch (error) {
    setPedagogyNotice(error.message, true);
  } finally {
    regeneratePedagogyCodeButton.disabled = false;
  }
}

async function deletePedagogicalClassroom() {
  if (!window.confirm("Supprimer ce cadre et détacher tous les élèves ?")) return;
  deletePedagogyButton.disabled = true;
  try {
    const response = await fetch("/api/pedagogy/classroom", { method: "DELETE" });
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error || "Suppression impossible.");
    renderPedagogy(data);
    setPedagogyNotice("Cadre supprimé. Tous les élèves ont été détachés.");
  } catch (error) {
    setPedagogyNotice(error.message, true);
  } finally {
    deletePedagogyButton.disabled = false;
  }
}

async function joinPedagogicalClassroom() {
  const code = studentClassCode.value.trim();
  if (!code) {
    setPedagogyNotice("Entre le code transmis par ton enseignant.", true);
    studentClassCode.focus();
    return;
  }
  joinClassroomButton.disabled = true;
  setPedagogyNotice("Vérification du code classe...");
  try {
    const response = await fetch("/api/pedagogy/join", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code })
    });
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error || "Code classe invalide.");
    if (data.user) updateAccountUi(data.user, { pedagogy: data });
    else renderPedagogy(data);
    studentClassCode.value = "";
    setPedagogyNotice("Classe rejointe. Les règles de l'enseignant sont maintenant appliquées côté serveur.");
    setHint("Cadre pédagogique actif sur ce compte.");
  } catch (error) {
    setPedagogyNotice(error.message, true);
  } finally {
    joinClassroomButton.disabled = false;
  }
}

async function copyPedagogicalCode() {
  const code = pedagogyClassCode.textContent.trim();
  if (!code || code.includes("•")) return;
  try {
    await navigator.clipboard.writeText(code);
    setPedagogyNotice(`Code ${code} copié.`);
  } catch {
    setPedagogyNotice(`Code à transmettre : ${code}`);
  }
}

async function removePedagogicalStudent(studentId, studentName) {
  if (!studentId || !window.confirm(`Détacher ${studentName || "cet élève"} de la classe ?`)) return;
  setPedagogyNotice("Détachement de l'élève...");
  try {
    const response = await fetch("/api/pedagogy/classroom/student/remove", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ studentId })
    });
    const data = await readJsonResponse(response);
    if (!response.ok) throw new Error(data.error || "Détachement impossible.");
    renderPedagogy(data);
    setPedagogyNotice(`${studentName || "L'élève"} n'est plus rattaché à la classe.`);
  } catch (error) {
    setPedagogyNotice(error.message, true);
  }
}

function updateAccountUi(user, meta = {}) {
  currentUser = user || null;
  hasAccessPass = Boolean(meta.accessPass);
  accountCard?.classList.toggle("is-connected", Boolean(currentUser || hasAccessPass));
  accountCard?.classList.toggle("is-plus-account", currentUser?.plan === "pro" || hasAccessPass);

  if (hasAccessPass) {
    accountStatus.textContent = `${meta.accessName || "Accès invité"} | Accès complet activé | Toutes les fonctionnalités sont débloquées.`;
    accessCodeFields.hidden = true;
    accessCodeDisclosure.hidden = true;
    accountAuthDetails.hidden = true;
    authFields.hidden = true;
    memberActions.hidden = false;
    upgradeButton.hidden = true;
    exportAccountButton.hidden = true;
    deleteAccountButton.hidden = true;
    logoutButton.hidden = false;
    renderReportHistory([]);
    renderProjects([]);
    renderPedagogy({ role: "anonymous", classroom: null });
    updatePlusToolCards();
    return;
  }

  if (!currentUser) {
    accountStatus.textContent = `Libre-service : ${meta.anonymousDailyLimit || 5} essais anonymes sans carte. Crée un compte gratuit pour passer à 10 usages par jour et sauvegarder tes rapports.`;
    accessCodeFields.hidden = false;
    accessCodeDisclosure.hidden = false;
    accountAuthDetails.hidden = false;
    authFields.hidden = false;
    setAuthMode("signup");
    memberActions.hidden = true;
    upgradeButton.hidden = true;
    exportAccountButton.hidden = true;
    deleteAccountButton.hidden = true;
    logoutButton.hidden = true;
    renderReportHistory([]);
    renderProjects([]);
    renderPedagogy({ role: "anonymous", classroom: null });
    updatePlusToolCards();
    return;
  }

  const planLabel = currentUser.plan === "pro" ? "Plus" : "Gratuit";
  const roleLabel = currentUser.accountRole === "teacher" ? "Enseignant" : "Élève / utilisateur";
  const displayName = currentUser.name || currentUser.email;
  const usage = currentUser.plan === "pro"
    ? "compteur quotidien levé"
    : `${currentUser.usageToday || 0} / ${currentUser.freeDailyLimit || 10} usages aujourd'hui`;
  const projectsLabel = currentUser.plan === "pro"
    ? ` | ${currentUser.projectCount || 0} dossier${currentUser.projectCount > 1 ? "s" : ""}`
    : "";
  const classroomLabel = meta.pedagogy?.classroom?.name
    ? ` | Classe ${meta.pedagogy.classroom.name}`
    : "";

  accountStatus.textContent = `Bonjour ${displayName} | ${roleLabel} | Compte ${planLabel} | ${usage}${projectsLabel}${classroomLabel} | Rapports sauvegardés`;
  accessCodeFields.hidden = true;
  accessCodeDisclosure.hidden = true;
  accountAuthDetails.hidden = true;
  authFields.hidden = true;
  memberActions.hidden = false;
  upgradeButton.hidden = currentUser.plan === "pro";
  exportAccountButton.hidden = false;
  deleteAccountButton.hidden = false;
  logoutButton.hidden = false;
  reportHistory.hidden = false;
  renderPedagogy(meta.pedagogy || { role: currentUser.accountRole || "student", classroom: null });
  updateSaveTargetUi();
  updatePlusToolCards();
}

function setAccountNotice(message) {
  accountStatus.textContent = message;
}

function setHint(message, important = false) {
  hint.textContent = message;
  hint.classList.toggle("important-hint", important);
}

function isPlusToolCard(card) {
  return Boolean(card && Array.from(plusToolCards).includes(card));
}

function getPlusToolState() {
  if (hasAccessPass || currentUser?.plan === "pro") {
    return {
      locked: false,
      label: "Plus actif",
      hint: "Module premium débloqué."
    };
  }

  if (currentUser) {
    const limit = Number(currentUser.freeDailyLimit || 10);
    const used = Number(currentUser.usageToday || 0);
    const remaining = Math.max(limit - used, 0);

    if (remaining <= 0) {
      return {
        locked: true,
        label: "Plus requis",
        hint: "Quota gratuit terminé. Active Voltia Plus pour utiliser ce module."
      };
    }

    return {
      locked: false,
      label: `${remaining} essai${remaining > 1 ? "s" : ""} gratuit${remaining > 1 ? "s" : ""}`,
      hint: "Inclus dans ton quota gratuit, puis disponible avec Voltia Plus."
    };
  }

  if (anonymousQuotaExhausted) {
    return {
      locked: true,
      label: "Compte requis",
      hint: "Tes essais anonymes sont terminés. Crée un compte gratuit pour continuer."
    };
  }

  return {
    locked: false,
    label: "Essais gratuits",
    hint: "Inclus pendant les essais gratuits, puis disponible avec Voltia Plus."
  };
}

function updatePlusToolCards() {
  const state = getPlusToolState();

  plusToolCards.forEach((card) => {
    card.classList.add("is-plus-module");
    card.classList.toggle("is-plus-locked", state.locked);
    card.classList.toggle("is-plus-active", state.label === "Plus actif");
    card.setAttribute("data-plus-state", state.label);

    const heading = card.querySelector(".card-heading");
    if (!heading) return;

    let badge = heading.querySelector(".tool-plan-badge");
    if (!badge) {
      badge = document.createElement("span");
      badge.className = "tool-plan-badge";
      heading.append(badge);
    }
    badge.textContent = state.label;
    badge.title = state.hint;

    if (state.locked) {
      card.classList.remove("is-open");
    }
  });

  syncToolCardStates();
}

function guardPlusToolCard(card) {
  if (!isPlusToolCard(card)) return false;

  const state = getPlusToolState();
  if (!state.locked) return false;

  if (!currentUser) {
    showAnonymousUpgradePrompt(state.hint);
    setHint(state.hint, true);
    updatePlusToolCards();
    return true;
  }

  showProUpgradePrompt(state.hint);
  setHint(state.hint, true);
  updatePlusToolCards();
  return true;
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
  setAuthMode("signup", { focus: true });
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
    secondaryLabel: "Voir Plus",
    onSecondary: () => {
      window.location.href = "/pro.html";
    }
  });
}

function showProUpgradePrompt(message) {
  showConversionBanner({
    title: "Le quota du compte gratuit est atteint",
    text: message || "Passe à Voltia Plus pour lever le compteur quotidien et débloquer les modules premium.",
    primaryLabel: "Activer Plus",
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
    title: "Dossiers réservés à Voltia Plus",
    text: message || "Voltia Plus ajoute des dossiers pour ranger tes rapports par projet, logement ou besoin.",
    primaryLabel: "Activer Plus",
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
    anonymousQuotaExhausted = true;
    setAccountNotice(errorMessage);
    setHint("Le mode anonyme est épuisé. Crée un compte gratuit pour continuer.", true);
    updatePlusToolCards();
    showAnonymousUpgradePrompt(errorMessage);
    return true;
  }

  if (response.status === 402 && data.upgradeRequired && data.feature === "projects") {
    setAccountNotice(errorMessage);
    setHint("Les dossiers sont réservés à Voltia Plus.", true);
    updatePlusToolCards();
    showProjectsUpgradePrompt(errorMessage);
    return true;
  }

  if (response.status === 402 && data.upgradeRequired) {
    setAccountNotice(errorMessage);
    setHint("Le quota du compte gratuit est atteint. Passe à Voltia Plus pour continuer sans compteur quotidien.", true);
    updatePlusToolCards();
    showProUpgradePrompt(errorMessage);
    return true;
  }

  throw new Error(errorMessage);
}

function handlePedagogicalBlockedResponse(data) {
  if (!data?.pedagogicalBlocked) return false;
  const className = data.pedagogy?.className || pedagogyContext?.classroom?.name || "la classe";
  setHint(`Cadre pédagogique « ${className} » appliqué : aucune réponse interdite n'a été générée.`, true);
  setPedagogyNotice(`Une règle pédagogique a bloqué cette demande (${data.pedagogy?.reason || "catégorie interdite"}).`);
  return true;
}

function handleLandingState() {
  const shouldOpenAuth = pageParams.get("openAuth") === "1";
  const shouldOpenSignup = pageParams.get("openSignup") === "1";
  const shouldShowSampleReport = pageParams.get("sampleReport") === "1";
  const checkoutState = pageParams.get("checkout");
  const intent = pageParams.get("intent");

  if (shouldOpenSignup && !currentUser) {
    openSignupFlow();
    setHint("Compte gratuit : sauvegarde des rapports, reprise des échanges et 10 usages par jour.");
  } else if (shouldOpenAuth) {
    openAccountPanel();
    setHint("Crée un compte gratuit pour sauvegarder tes rapports, ou passe à Plus si tu utilises Voltia plusieurs fois par semaine.");
  }

  if (intent === "pro") {
    setAccountNotice("Crée ton compte gratuit, puis clique sur Activer Plus pour lever le quota quotidien et activer les modules premium.");
    setHint("Parcours recommandé : compte gratuit d'abord, puis activation Plus depuis l'espace compte.", true);
  }

  if (checkoutState === "success") {
    setAccountNotice("Paiement confirmé. Voltia Plus est en cours d'activation sur ton compte.");
    setHint("Paiement confirmé. Recharge la page dans quelques secondes si le statut Plus n'apparaît pas encore.");
  } else if (checkoutState === "cancel") {
    setAccountNotice("Paiement annulé. Ton compte gratuit reste actif.");
    setHint("Paiement annulé. Tu peux continuer avec le compte gratuit ou réessayer plus tard.");
  }

  if (shouldShowSampleReport) {
    showProfessionalReportExample();
    document.querySelector("#workspace")?.scrollIntoView({ behavior: "smooth", block: "start" });
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
  const accountRole = mode === "signup" ? signupAccountRole?.value || "student" : "student";
  const email = mode === "signup" ? signupEmail.value.trim() : authEmail.value.trim();
  const password = mode === "signup" ? signupPassword.value : authPassword.value;
  const endpoint = mode === "signup" ? "/api/auth/signup" : "/api/auth/login";

  if (mode === "signup" && !name) {
    setAccountNotice("Entre ton nom ou prénom pour personnaliser ton compte.");
    setHint("Entre ton nom ou prénom.");
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
      body: JSON.stringify({ name, email, password, accountRole })
    });
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    authPassword.value = "";
    signupPassword.value = "";
    updateAccountUi(data.user);
    await loadPedagogyContext();
    await loadProjects();
    await loadReportHistory();
    const displayName = data.user.name || data.user.email;
    if (mode === "signup") {
      const roleLabel = data.user.accountRole === "teacher" ? "enseignant" : "élève / utilisateur";
      setAccountNotice(`Bienvenue ${displayName}. Ton compte ${roleLabel} est prêt : jusqu'à ${data.user.freeDailyLimit || 10} usages par jour et sauvegarde de rapports.`);
      setHint(`Compte créé pour ${displayName}. Tu peux continuer gratuitement ou activer Plus pour lever le compteur quotidien.`);
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
  setHint("Tu es déconnecté.");
}

async function exportAccountData() {
  if (!currentUser) {
    setAccountNotice("Connecte-toi pour exporter tes données.");
    return;
  }

  exportAccountButton.disabled = true;
  setHint("Export des données du compte...");

  try {
    const response = await fetch("/api/account/export");
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Export impossible.")) return;

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `voltia-donnees-${data.user?.id || "compte"}.json`;
    document.body.append(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
    setHint("Export JSON généré. Conserve-le dans un emplacement sûr.");
  } catch (error) {
    setAccountNotice(error.message);
    setHint(error.message, true);
  } finally {
    exportAccountButton.disabled = false;
  }
}

async function deleteAccount() {
  if (!currentUser) return;

  const confirmed = window.confirm(
    "Supprimer ton compte Voltia, tes rapports et tes dossiers de cette application ? Cette action est définitive."
  );
  if (!confirmed) return;

  deleteAccountButton.disabled = true;
  setAccountNotice("Suppression du compte en cours...");

  try {
    const response = await fetch("/api/account", { method: "DELETE" });
    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Suppression impossible.")) return;

    updateAccountUi(null, { anonymousDailyLimit: 5 });
    renderReportHistory([]);
    renderProjects([]);
    hideConversionBanner();
    setHint(data.billingNotice || "Compte supprimé. Les données locales Voltia ont été effacées.");
  } catch (error) {
    setAccountNotice(error.message);
    setHint(error.message, true);
  } finally {
    deleteAccountButton.disabled = false;
  }
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
    setAccountNotice("Connecte-toi ou crée un compte avant d'activer Voltia Plus.");
    setHint("Connecte-toi ou crée un compte avant d'activer Plus.", true);
    openAccountPanel();
    return;
  }

  upgradeButton.disabled = true;
  setAccountNotice("Préparation du paiement Stripe pour activer Voltia Plus...");
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
  const type = schemaType.value;
  return {
    sockets: type === "prise" ? clampCount(socketCount.value, 1, 1, 12) : 0,
    lights: type === "eclairage" || type === "va-et-vient" ? clampCount(lightCount.value, 1, 1, 8) : 0,
    switches: type === "eclairage"
      ? clampCount(switchCount.value, 1, 1, 6)
      : type === "va-et-vient"
        ? clampCount(switchCount.value, 2, 2, 6)
        : 0,
    breakers: clampCount(breakerCount.value, 4, 1, 12),
    breakerRatings: breakerRatings.value.trim(),
    symbolMode: schemaSymbolMode?.value || "standard"
  };
}

function syncSchemaDefaults() {
  const type = schemaType.value;
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
  document.querySelector(".schema-socket-field")?.classList.toggle("hidden-field", type !== "prise");
  document.querySelector(".schema-light-field")?.classList.toggle("hidden-field", !["eclairage", "va-et-vient"].includes(type));
  document.querySelector(".schema-switch-field")?.classList.toggle("hidden-field", !["eclairage", "va-et-vient"].includes(type));
  document.querySelector(".schema-board-fields")?.classList.toggle("hidden-field", type !== "tableau");
}

const supportedUploadImageTypes = new Set(["image/jpeg", "image/png", "image/webp"]);

function dataUrlSizeBytes(dataUrl = "") {
  const payload = String(dataUrl || "").split(",", 2)[1] || "";
  return Math.ceil((payload.length * 3) / 4);
}

function readFileAsDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => resolve(String(reader.result || "")));
    reader.addEventListener("error", () => reject(new Error("Le navigateur n'a pas pu lire cette image.")));
    reader.readAsDataURL(file);
  });
}

function loadImageFromDataUrl(dataUrl) {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.addEventListener("load", () => resolve(image));
    image.addEventListener("error", () => reject(new Error("Image illisible. Utilise une photo JPG, PNG ou WebP.")));
    image.src = dataUrl;
  });
}

async function prepareImageUpload(file, { maxDimension = 2000, quality = 0.88 } = {}) {
  if (!supportedUploadImageTypes.has(file.type)) {
    throw new Error("Format non pris en charge. Convertis la photo en JPG, PNG ou WebP.");
  }
  if (file.size > 14 * 1024 * 1024) {
    throw new Error("Image trop lourde. Choisis une photo de moins de 14 Mo.");
  }

  const originalDataUrl = await readFileAsDataUrl(file);
  const image = await loadImageFromDataUrl(originalDataUrl);
  const width = image.naturalWidth || image.width;
  const height = image.naturalHeight || image.height;
  if (!width || !height) {
    throw new Error("Dimensions de l'image introuvables.");
  }

  const scale = Math.min(1, maxDimension / Math.max(width, height));
  if (scale === 1 && file.size <= 1_800_000) {
    return { dataUrl: originalDataUrl, width, height, bytes: file.size, optimized: false };
  }

  const outputWidth = Math.max(1, Math.round(width * scale));
  const outputHeight = Math.max(1, Math.round(height * scale));
  const canvas = document.createElement("canvas");
  canvas.width = outputWidth;
  canvas.height = outputHeight;
  const context = canvas.getContext("2d", { alpha: false }) || canvas.getContext("2d");
  if (!context) {
    throw new Error("Optimisation de l'image indisponible dans ce navigateur.");
  }

  context.fillStyle = "#ffffff";
  context.fillRect(0, 0, outputWidth, outputHeight);
  context.imageSmoothingEnabled = true;
  context.imageSmoothingQuality = "high";
  context.drawImage(image, 0, 0, outputWidth, outputHeight);

  let outputQuality = quality;
  let dataUrl = canvas.toDataURL("image/jpeg", outputQuality);
  while (dataUrlSizeBytes(dataUrl) > 4_500_000 && outputQuality > 0.64) {
    outputQuality -= 0.08;
    dataUrl = canvas.toDataURL("image/jpeg", outputQuality);
  }
  if (dataUrlSizeBytes(dataUrl) > 5_500_000) {
    throw new Error("La photo reste trop lourde après optimisation. Recadre-la autour de l'objet.");
  }

  return {
    dataUrl,
    width: outputWidth,
    height: outputHeight,
    bytes: dataUrlSizeBytes(dataUrl),
    optimized: true
  };
}

function uploadSummary(fileName, prepared) {
  const sizeMb = Math.max(prepared.bytes / 1024 / 1024, 0.01).toFixed(1);
  return `${fileName} · ${prepared.width} × ${prepared.height} px · ${sizeMb} Mo`;
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 150000) {
  const controller = new AbortController();
  const timeoutId = window.setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, { ...options, signal: controller.signal });
  } catch (error) {
    if (error?.name === "AbortError") {
      throw new Error("L'analyse a dépassé le délai prévu. Réessaie avec une photo recadrée autour de l'objet.");
    }
    if (/load failed|failed to fetch|networkerror|network request failed/i.test(String(error?.message || error))) {
      throw new Error("Connexion interrompue pendant l'envoi. La photo est maintenant optimisée automatiquement : recharge-la puis réessaie.");
    }
    throw error;
  } finally {
    window.clearTimeout(timeoutId);
  }
}

function dedicatedLoadLabel(usage = "") {
  const text = normalizeText(usage);
  const loads = [
    ["plaque", "Plaque de cuisson"],
    ["four", "Four"],
    ["chauffe-eau", "Chauffe-eau"],
    ["chauffe eau", "Chauffe-eau"],
    ["lave-linge", "Lave-linge"],
    ["lave linge", "Lave-linge"],
    ["lave-vaisselle", "Lave-vaisselle"],
    ["lave vaisselle", "Lave-vaisselle"],
    ["borne", "Borne de recharge"],
    ["irve", "Borne de recharge"]
  ];
  return loads.find(([keyword]) => text.includes(keyword))?.[1] || "";
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

function buildLegacySchema(type, room, usage, counts = {}) {
  const normalizedSymbols = counts.symbolMode === "normalized";
  const safeRoom = escapeHtml(room || "pièce à définir");
  const safeUsage = escapeHtml(usage || "usage a definir");
  const socketTotal = clampCount(counts.sockets, 1, 0, 12);
  const lightTotal = clampCount(counts.lights, 1, 0, 8);
  const switchTotal = clampCount(counts.switches, type === "va-et-vient" ? 2 : 1, 0, 6);
  const breakerItems = getBreakerItems(counts);
  const breakerTotal = breakerItems.length;
  const dedicatedLoad = type === "prise" ? dedicatedLoadLabel(usage) : "";
  const quantityLine = type === "tableau"
    ? `Disjoncteurs: ${breakerTotal} | Circuits: ${escapeHtml(breakerItems.join(", "))}`
    : type === "prise"
      ? dedicatedLoad
        ? `Circuit spécialisé: ${escapeHtml(dedicatedLoad)} | Départ dédié indicatif`
        : `Prises: ${socketTotal}`
      : `Lumières: ${lightTotal} | Commandes: ${switchTotal}`;
  const normalizedLegend = normalizedSymbols ? `
    <g class="standard-symbol-legend">
      <rect x="24" y="222" width="252" height="34" rx="8" />
      <text x="38" y="243" text-anchor="start">${dedicatedLoad ? "Repères: QF protection | L phase | N neutre | PE terre | appareil dédié" : "Symboles: QF disjoncteur | ID différentiel | X point lumineux | PC prise 2P+T | S interrupteur"}</text>
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
    const symbolMarkup = dedicatedLoad ? `
      <g class="symbol dedicated-load">
        <rect x="476" y="${y - 20}" width="102" height="42" rx="8" />
        <text x="527" y="${y - 2}">${escapeHtml(dedicatedLoad)}</text>
        <text x="527" y="${y + 14}">point dédié</text>
      </g>
    ` : normalizedSymbols ? `
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
          <text x="87" y="153">${dedicatedLoad ? (normalizedSymbols ? "QF dédié" : "DJ dédié") : (normalizedSymbols ? "QF 16/20A" : "DJ 16/20A")}</text>
        </g>
        <path class="wire phase wire-bus" d="M 126 92 H 462" />
        <path class="wire neutral wire-bus" d="M 126 112 H 474" />
        <path class="wire earth wire-bus" d="M 126 132 H 486" />
        ${socketSymbols}
        <text class="wire-label" x="258" y="82">${dedicatedLoad ? "Départ spécialisé à confirmer selon la notice" : "L / N / PE séparés vers prise(s) en parallèle"}</text>
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

function professionalEquipmentBlock({ x, y, width = 112, height = 116, tag, title, lines = [], kind = "" }) {
  const safeLines = lines.slice(0, 3);
  const centerX = width / 2;
  const centerY = height / 2;
  const isSource = tag === "X0";
  const isDifferential = /^ID/i.test(tag);
  const isBreaker = tag === "AGCP" || /^QF/i.test(tag);
  let symbolMarkup = "";

  if (isSource) {
    symbolMarkup = `
      <line class="symbol-conductor" x1="0" y1="${centerY}" x2="${centerX - 24}" y2="${centerY}" />
      <circle class="source-symbol" cx="${centerX}" cy="${centerY}" r="23" />
      <path class="source-wave" d="M ${centerX - 14} ${centerY} C ${centerX - 9} ${centerY - 10}, ${centerX - 3} ${centerY - 10}, ${centerX + 2} ${centerY} S ${centerX + 11} ${centerY + 10}, ${centerX + 15} ${centerY}" />
      <line class="symbol-conductor" x1="${centerX + 23}" y1="${centerY}" x2="${width}" y2="${centerY}" />
      <path class="source-earth-mark" d="M ${centerX} ${centerY + 23} V ${centerY + 34} M ${centerX - 10} ${centerY + 34} H ${centerX + 10} M ${centerX - 7} ${centerY + 39} H ${centerX + 7} M ${centerX - 4} ${centerY + 44} H ${centerX + 4}" />
    `;
  } else if (isDifferential) {
    symbolMarkup = `
      <line class="symbol-conductor" x1="0" y1="${centerY}" x2="${centerX - 27}" y2="${centerY}" />
      <circle class="terminal-dot" cx="${centerX - 25}" cy="${centerY}" r="4" />
      <circle class="terminal-dot" cx="${centerX + 25}" cy="${centerY}" r="4" />
      <line class="switch-contact" x1="${centerX - 21}" y1="${centerY - 2}" x2="${centerX + 17}" y2="${centerY - 24}" />
      <line class="symbol-conductor" x1="${centerX + 25}" y1="${centerY}" x2="${width}" y2="${centerY}" />
      <ellipse class="differential-toroid" cx="${centerX}" cy="${centerY}" rx="19" ry="27" />
      <text class="differential-mark" x="${centerX}" y="${centerY + 7}">Δ</text>
      <circle class="test-button" cx="${centerX + 30}" cy="${centerY - 31}" r="7" />
      <text class="test-mark" x="${centerX + 30}" y="${centerY - 28}">T</text>
    `;
  } else if (isBreaker) {
    symbolMarkup = `
      <line class="symbol-conductor" x1="0" y1="${centerY}" x2="${centerX - 25}" y2="${centerY}" />
      <circle class="terminal-dot" cx="${centerX - 23}" cy="${centerY}" r="4" />
      <circle class="terminal-dot" cx="${centerX + 23}" cy="${centerY}" r="4" />
      <line class="breaker-contact" x1="${centerX - 19}" y1="${centerY - 2}" x2="${centerX + 15}" y2="${centerY - 23}" />
      <path class="breaker-trip" d="M ${centerX + 3} ${centerY - 15} q 9 8 0 16 q -9 8 0 16" />
      <line class="symbol-conductor" x1="${centerX + 23}" y1="${centerY}" x2="${width}" y2="${centerY}" />
    `;
  } else {
    symbolMarkup = `
      <line class="symbol-conductor" x1="0" y1="${centerY}" x2="${centerX - 25}" y2="${centerY}" />
      <rect class="receiver-symbol" x="${centerX - 25}" y="${centerY - 25}" width="50" height="50" />
      <line class="receiver-diagonal" x1="${centerX - 18}" y1="${centerY + 18}" x2="${centerX + 18}" y2="${centerY - 18}" />
      <line class="receiver-diagonal" x1="${centerX - 18}" y1="${centerY - 18}" x2="${centerX + 18}" y2="${centerY + 18}" />
      <line class="symbol-conductor" x1="${centerX + 25}" y1="${centerY}" x2="${width}" y2="${centerY}" />
    `;
  }

  return `
    <g class="schema-equipment iec-equipment-symbol ${kind}" transform="translate(${x} ${y})" data-symbol="${escapeHtml(tag)}">
      <text class="equipment-tag" x="${centerX}" y="10">${escapeHtml(tag)}</text>
      <g class="equipment-symbol">${symbolMarkup}</g>
      <text class="equipment-title" x="${centerX}" y="${height + 5}">${escapeHtml(title)}</text>
      ${safeLines.map((line, index) => `<text class="equipment-detail" x="${centerX}" y="${height + 20 + index * 14}">${escapeHtml(line)}</text>`).join("")}
    </g>
  `;
}

function professionalSupplyChain({ rating = "à définir", purpose = "circuit", includeAgcp = false } = {}) {
  if (includeAgcp) {
    return `
      ${professionalEquipmentBlock({ x: 38, y: 154, width: 104, tag: "X0", title: "ARRIVÉE", lines: ["230 V~", "L + N + PE"], kind: "source-equipment" })}
      ${professionalEquipmentBlock({ x: 174, y: 154, width: 104, tag: "AGCP", title: "COUPURE", lines: ["générale", "calibre à lire"], kind: "protection-equipment" })}
      ${professionalEquipmentBlock({ x: 310, y: 154, width: 104, tag: "ID1", title: "DIFFÉRENTIEL", lines: ["IΔn 30 mA", "type à confirmer"], kind: "protection-equipment" })}
      <path class="schema-single-line" d="M 142 212 H 174 M 278 212 H 310" />
      <text class="cable-callout" x="158" y="199">L/N</text>
      <text class="cable-callout" x="294" y="199">L/N</text>
    `;
  }

  return `
    ${professionalEquipmentBlock({ x: 38, y: 154, width: 104, tag: "X0", title: "ARRIVÉE", lines: ["230 V~", "L + N + PE"], kind: "source-equipment" })}
    ${professionalEquipmentBlock({ x: 174, y: 154, width: 104, tag: "ID1", title: "DIFFÉRENTIEL", lines: ["IΔn 30 mA", "type à confirmer"], kind: "protection-equipment" })}
    ${professionalEquipmentBlock({ x: 310, y: 154, width: 112, tag: "QF1", title: "DISJONCTEUR", lines: [rating, purpose], kind: "protection-equipment" })}
    <path class="schema-single-line" d="M 142 212 H 174 M 278 212 H 310" />
    <text class="cable-callout" x="158" y="199">L/N</text>
    <text class="cable-callout" x="294" y="199">L/N</text>
  `;
}

function professionalSocketSymbol(x, y, index) {
  return `
    <g class="schema-device iec-symbol socket-device" transform="translate(${x} ${y})">
      <circle class="device-symbol" cx="0" cy="0" r="23" />
      <line x1="-8" y1="-7" x2="-8" y2="7" />
      <line x1="8" y1="-7" x2="8" y2="7" />
      <path d="M 0 7 V 17 M -8 17 H 8" />
      <text class="device-tag" x="0" y="41">PC${index + 1}</text>
      <text class="device-description" x="0" y="56">prise 2P+T</text>
    </g>
  `;
}

function professionalLampSymbol(x, y, index) {
  return `
    <g class="schema-device iec-symbol lamp-device" transform="translate(${x} ${y})">
      <circle class="device-symbol" cx="0" cy="0" r="22" />
      <line x1="-14" y1="-14" x2="14" y2="14" />
      <line x1="14" y1="-14" x2="-14" y2="14" />
      <circle class="terminal-dot lamp-terminal lamp-terminal-return" cx="-22" cy="-10" r="3" />
      <circle class="terminal-dot lamp-terminal lamp-terminal-neutral" cx="-22" cy="0" r="3" />
      <circle class="terminal-dot lamp-terminal lamp-terminal-earth" cx="-22" cy="10" r="3" />
      <text class="device-tag" x="0" y="40">X${index + 1}</text>
      <text class="device-description" x="0" y="55">point lumineux</text>
    </g>
  `;
}

function professionalSwitchSymbol(x, y, index, label = "interrupteur") {
  return `
    <g class="schema-device iec-symbol switch-device" transform="translate(${x} ${y})">
      <circle class="terminal-dot" cx="-16" cy="0" r="4" />
      <circle class="terminal-dot" cx="16" cy="0" r="4" />
      <line x1="-12" y1="-2" x2="12" y2="-17" />
      <text class="device-tag" x="0" y="34">S${index + 1}</text>
      <text class="device-description" x="0" y="49">${escapeHtml(label)}</text>
    </g>
  `;
}

function professionalVaSymbol(x, y, tag, label, permutator = false, reverse = false) {
  if (permutator) {
    return `
      <g class="schema-device iec-symbol va-device" transform="translate(${x} ${y})">
        <rect class="permutator-symbol" x="-23" y="-24" width="46" height="48" rx="4" />
        <circle class="terminal-dot" cx="-14" cy="-13" r="3" /><circle class="terminal-dot" cx="14" cy="-13" r="3" />
        <circle class="terminal-dot" cx="-14" cy="13" r="3" /><circle class="terminal-dot" cx="14" cy="13" r="3" />
        <line x1="-11" y1="-11" x2="11" y2="11" /><line x1="-11" y1="11" x2="11" y2="-11" />
        <text class="device-tag" x="0" y="43">${escapeHtml(tag)}</text>
        <text class="device-description" x="0" y="58">${escapeHtml(label)}</text>
      </g>
    `;
  }
  const commonX = reverse ? 18 : -18;
  const travelerX = reverse ? -18 : 18;
  return `
    <g class="schema-device iec-symbol va-device" transform="translate(${x} ${y})">
      <circle class="terminal-dot" cx="${commonX}" cy="0" r="4" />
      <circle class="terminal-dot" cx="${travelerX}" cy="-15" r="4" />
      <circle class="terminal-dot" cx="${travelerX}" cy="15" r="4" />
      <line x1="${commonX + (reverse ? -4 : 4)}" y1="-2" x2="${travelerX + (reverse ? 4 : -4)}" y2="-15" />
      <text class="device-tag" x="0" y="43">${escapeHtml(tag)}</text>
      <text class="device-description" x="0" y="58">${escapeHtml(label)}</text>
    </g>
  `;
}

function professionalCableLabel(x, y, text) {
  const width = Math.min(Math.max(String(text).length * 6.1 + 18, 100), 250);
  return `
    <g class="cable-label" transform="translate(${x} ${y})">
      <rect x="${-width / 2}" y="-13" width="${width}" height="22" rx="4" />
      <text x="0" y="3">${escapeHtml(text)}</text>
    </g>
  `;
}

function engineeringSchemaSheet({ type, safeTitle, safeRoom, safeUsage, safeSummary, body, safeDocumentCode, instanceId, gridId }) {
  const issueDate = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "2-digit", year: "numeric" }).format(new Date());
  const nomenclature = [
    ["X0", "Alimentation"],
    ["ID", "Différentiel"],
    ["QF", "Protection circuit"],
    ["S / P", "Commande"],
    ["X", "Point lumineux"],
    ["PC", "Prise 2P+T"],
    ["XTB", "Bornier"]
  ];
  return `
    <svg class="professional-schema schema-style-engineering" viewBox="0 0 1120 680" role="img" aria-labelledby="title-${instanceId} desc-${instanceId}" data-schema-type="${escapeHtml(type)}" data-schema-form="engineering">
      <title id="title-${instanceId}">${safeTitle} — dossier bureau d'études</title>
      <desc id="desc-${instanceId}">${safeSummary}. Folio technique de principe avec symboles électriques, nomenclature, table de révision et cartouche bureau d'études.</desc>
      <defs>
        <pattern id="${gridId}" width="10" height="10" patternUnits="userSpaceOnUse">
          <path d="M 10 0 H 0 V 10" class="professional-grid-line" />
        </pattern>
      </defs>
      <rect class="schema-sheet-background" x="5" y="5" width="1110" height="670" />
      <rect class="schema-sheet-frame" x="16" y="16" width="1088" height="648" />
      <g class="engineering-header">
        <text class="engineering-brand" x="30" y="37">VOLTIA · ÉTUDE ÉLECTRIQUE DE PRINCIPE</text>
        <text class="engineering-title" x="30" y="65">${safeTitle}</text>
        <text class="engineering-header-label" x="826" y="34">DOCUMENT</text>
        <text class="engineering-header-value" x="826" y="50">${safeDocumentCode}</text>
        <text class="engineering-header-label" x="958" y="34">FOLIO</text>
        <text class="engineering-header-value" x="958" y="50">01 / 01</text>
        <text class="engineering-header-label" x="1034" y="34">INDICE</text>
        <text class="engineering-header-value" x="1034" y="50">R00</text>
        <text class="engineering-summary" x="826" y="69">${safeSummary}</text>
      </g>
      <rect class="schema-drawing-zone engineering-drawing-zone" x="24" y="96" width="868" height="430" />
      <rect class="engineering-grid" x="24" y="96" width="868" height="430" fill="url(#${gridId})" />
      <g class="engineering-zone-references">
        <text x="132" y="91">A</text><text x="350" y="91">B</text><text x="568" y="91">C</text><text x="786" y="91">D</text>
        <text x="18" y="160">1</text><text x="18" y="270">2</text><text x="18" y="380">3</text><text x="18" y="490">4</text>
      </g>
      ${body}
      <g class="engineering-side-panel">
        <rect x="912" y="96" width="184" height="430" />
        <line x1="912" y1="137" x2="1096" y2="137" />
        <line x1="912" y1="207" x2="1096" y2="207" />
        <line x1="912" y1="371" x2="1096" y2="371" />
        <line x1="912" y1="452" x2="1096" y2="452" />
        <text class="engineering-panel-title" x="924" y="116">ÉTAT DU DOCUMENT</text>
        <text class="engineering-panel-value engineering-status" x="924" y="130">POUR ÉTUDE · NON EXÉCUTOIRE</text>
        <text class="engineering-panel-title" x="924" y="157">TABLE DES RÉVISIONS</text>
        <text class="engineering-small" x="924" y="176">IND.   DATE         OBJET</text>
        <text class="engineering-small" x="924" y="193">R00    ${issueDate}   ÉMISSION INITIALE</text>
        <text class="engineering-panel-title" x="924" y="227">NOMENCLATURE</text>
        ${nomenclature.map(([tag, label], index) => `<text class="engineering-nomenclature-tag" x="924" y="${247 + index * 17}">${tag}</text><text class="engineering-small" x="964" y="${247 + index * 17}">${label}</text>`).join("")}
        <text class="engineering-panel-title" x="924" y="391">CONVENTIONS CONDUCTEURS</text>
        <line class="phase-line" x1="924" y1="407" x2="950" y2="407" /><text class="engineering-small" x="960" y="410">L · phase</text>
        <line class="neutral-line" x1="924" y1="424" x2="950" y2="424" /><text class="engineering-small" x="960" y="427">N · neutre</text>
        <line class="earth-line" x1="924" y1="441" x2="950" y2="441" /><text class="engineering-small" x="960" y="444">PE · protection</text>
        <text class="engineering-panel-title" x="924" y="473">NOTES D'ÉTUDE</text>
        <text class="engineering-small" x="924" y="491">• Relevé sur site requis</text>
        <text class="engineering-small" x="924" y="506">• Calibres et sections à confirmer</text>
        <text class="engineering-small" x="924" y="521">• Coordination à valider</text>
      </g>
      <g class="schema-title-block engineering-title-block">
        <rect x="16" y="542" width="1088" height="122" />
        <line x1="560" y1="542" x2="560" y2="664" />
        <line x1="758" y1="542" x2="758" y2="664" />
        <line x1="920" y1="542" x2="920" y2="664" />
        <line x1="16" y1="584" x2="1104" y2="584" />
        <line x1="16" y1="624" x2="1104" y2="624" />
        <text class="title-block-label" x="30" y="558">AFFAIRE / LOCAL</text>
        <text class="engineering-cartouche-main" x="30" y="578">${safeRoom}</text>
        <text class="title-block-label" x="30" y="600">TITRE DU DOCUMENT</text>
        <text class="engineering-cartouche-main" x="30" y="620">${safeTitle}</text>
        <text class="title-block-label" x="30" y="641">HYPOTHÈSE / USAGE</text>
        <text class="title-block-value" x="30" y="657">${safeUsage}</text>
        <text class="title-block-label" x="574" y="558">NUMÉRO DE DOCUMENT</text>
        <text class="title-block-value" x="574" y="578">${safeDocumentCode}</text>
        <text class="title-block-label" x="574" y="600">PHASE / NIVEAU</text>
        <text class="title-block-value" x="574" y="620">AVP · SCHÉMA DE PRINCIPE</text>
        <text class="title-block-label" x="574" y="641">FORMAT / ÉCHELLE</text>
        <text class="title-block-value" x="574" y="657">FOLIO · SANS ÉCHELLE</text>
        <text class="title-block-label" x="772" y="558">ÉTABLI PAR</text>
        <text class="title-block-value" x="772" y="578">VOLTIA</text>
        <text class="title-block-label" x="772" y="600">DATE D'ÉMISSION</text>
        <text class="title-block-value" x="772" y="620">${issueDate}</text>
        <text class="title-block-label" x="772" y="641">CONTRÔLE</text>
        <text class="title-block-value" x="772" y="657">À EFFECTUER</text>
        <text class="title-block-label" x="934" y="558">INDICE</text>
        <text class="engineering-revision" x="934" y="580">R00</text>
        <text class="title-block-label" x="1018" y="558">FOLIO</text>
        <text class="title-block-value" x="1018" y="578">01 / 01</text>
        <text class="title-block-label" x="934" y="600">STATUT</text>
        <text class="title-block-value warning-value" x="934" y="620">NON EXÉCUTOIRE</text>
        <text class="engineering-small" x="934" y="646">VALIDATION PROFESSIONNELLE REQUISE</text>
      </g>
    </svg>
  `;
}

function professionalSchemaSheet({ type, title, room, usage, summary, body, documentCode, symbolMode = "standard" }) {
  const instanceId = `${type}-${++schemaRenderSequence}`;
  const gridId = `professional-grid-${instanceId}`;
  const shadowId = `professional-shadow-${instanceId}`;
  const safeTitle = escapeHtml(title);
  const safeRoom = escapeHtml(String(room || "Pièce à confirmer").slice(0, 58));
  const safeUsage = escapeHtml(String(usage || "Usage à confirmer").slice(0, 78));
  const safeSummary = escapeHtml(String(summary || "").slice(0, 68));
  const safeDocumentCode = escapeHtml(documentCode);
  if (symbolMode === "engineering" || symbolMode === "normalized") {
    return engineeringSchemaSheet({ type, safeTitle, safeRoom, safeUsage, safeSummary, body, safeDocumentCode, instanceId, gridId });
  }
  return `
    <svg class="professional-schema schema-style-annotated" viewBox="0 0 900 560" role="img" aria-labelledby="title-${instanceId} desc-${instanceId}" data-schema-type="${escapeHtml(type)}" data-schema-form="annotated">
      <title id="title-${instanceId}">${safeTitle}</title>
      <desc id="desc-${instanceId}">${safeSummary}. Schéma électrique de principe indicatif avec symboles électriques, appareils repérés et cartouche.</desc>
      <defs>
        <pattern id="${gridId}" width="16" height="16" patternUnits="userSpaceOnUse">
          <path d="M 16 0 H 0 V 16" class="professional-grid-line" />
        </pattern>
        <filter id="${shadowId}" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#10212b" flood-opacity="0.12" />
        </filter>
      </defs>
      <rect class="schema-sheet-background" x="8" y="8" width="884" height="544" rx="3" />
      <rect class="schema-sheet-frame" x="16" y="16" width="868" height="528" />
      <rect class="schema-drawing-zone" x="24" y="96" width="852" height="354" />
      <rect class="schema-grid-fill" x="24" y="96" width="852" height="354" fill="url(#${gridId})" />
      <g class="schema-sheet-header">
        <text class="sheet-kicker" x="38" y="42">SCHÉMA CLAIR ANNOTÉ</text>
        <text class="sheet-title" x="38" y="70">${safeTitle}</text>
        <text class="sheet-subtitle" x="38" y="88">${safeSummary}</text>
        <rect class="document-status" x="690" y="32" width="170" height="44" rx="4" />
        <text class="document-status-title" x="775" y="50">LECTURE RAPIDE</text>
        <text class="document-status-detail" x="775" y="66">document indicatif</text>
      </g>
      <g class="conductor-legend" transform="translate(488 78)">
        <rect width="372" height="16" rx="3" />
        <text class="legend-title" x="8" y="11">LÉGENDE</text>
        <line class="phase-line" x1="72" y1="8" x2="96" y2="8" /><text x="102" y="11">L</text>
        <line class="neutral-line" x1="130" y1="8" x2="154" y2="8" /><text x="160" y="11">N</text>
        <line class="earth-line" x1="188" y1="8" x2="212" y2="8" /><text x="218" y="11">PE</text>
        <line class="return-line" x1="254" y1="8" x2="278" y2="8" /><text x="284" y="11">retour commandé</text>
      </g>
      ${body}
      <g class="schema-title-block">
        <rect x="16" y="466" width="868" height="78" />
        <line x1="520" y1="466" x2="520" y2="544" />
        <line x1="716" y1="466" x2="716" y2="544" />
        <line x1="16" y1="505" x2="884" y2="505" />
        <text class="title-block-label" x="30" y="483">LOCAL / ZONE</text>
        <text class="title-block-value" x="30" y="499">${safeRoom}</text>
        <text class="title-block-label" x="30" y="522">USAGE / HYPOTHÈSE</text>
        <text class="title-block-value" x="30" y="538">${safeUsage}</text>
        <text class="title-block-label" x="534" y="483">DOCUMENT</text>
        <text class="title-block-value" x="534" y="499">${safeDocumentCode}</text>
        <text class="title-block-label" x="534" y="522">RÉFÉRENCES</text>
        <text class="title-block-value" x="534" y="538">QF / ID / X / S / PC</text>
        <text class="title-block-label" x="730" y="483">RÉVISION</text>
        <text class="title-block-value" x="730" y="499">R00 — VOLTIA</text>
        <text class="title-block-label" x="730" y="522">STATUT</text>
        <text class="title-block-value warning-value" x="730" y="538">NON EXÉCUTOIRE</text>
      </g>
    </svg>
  `;
}

function buildProfessionalOutletSchema(room, usage, counts = {}) {
  const socketTotal = clampCount(counts.sockets, 1, 1, 12);
  const dedicatedLoad = dedicatedLoadLabel(usage);
  const displayCount = dedicatedLoad ? 1 : Math.min(socketTotal, 6);
  const rating = /(?:^|\s)(\d{1,2})\s*a\b/i.exec(String(usage || ""))?.[1];
  const ratingLabel = rating ? `${rating} A indicatif` : dedicatedLoad ? "calibre à confirmer" : "16/20 A indicatif";
  const purpose = dedicatedLoad ? dedicatedLoad : "circuit prises";
  const supply = professionalSupplyChain({ rating: ratingLabel, purpose });
  let devices = "";
  let branches = "";

  if (dedicatedLoad) {
    devices = professionalEquipmentBlock({ x: 650, y: 174, width: 164, height: 96, tag: "E1", title: dedicatedLoad.toUpperCase(), lines: ["point dédié", "notice à vérifier"], kind: "load-equipment" });
    branches = `
      <path class="schema-single-line" d="M 422 212 H 650" />
      <path class="earth-line" d="M 422 250 H 620 V 250 H 650" />
      ${professionalCableLabel(535, 196, "3 conducteurs — section à confirmer")}
    `;
  } else {
    const positions = Array.from({ length: displayCount }, (_, index) => ({
      x: 560 + (index % 3) * 120,
      y: index < 3 ? 218 : 354
    }));
    devices = positions.map((position, index) => professionalSocketSymbol(position.x, position.y, index)).join("");
    branches = `
      <path class="schema-single-line" d="M 422 212 H 500 V 354" />
      ${positions.map((position) => `<path class="schema-single-line branch-line" d="M 500 ${position.y} H ${position.x - 23}" /><circle class="junction-dot" cx="500" cy="${position.y}" r="4" />`).join("")}
      ${professionalCableLabel(498, 196, "3G2,5 mm² indicatif — à confirmer")}
      ${socketTotal > displayCount ? `<text class="overflow-note" x="815" y="424">+ ${socketTotal - displayCount} prise(s) non représentée(s)</text>` : ""}
    `;
  }

  return professionalSchemaSheet({
    type: "prise",
    title: dedicatedLoad ? `Circuit spécialisé — ${dedicatedLoad}` : "Circuit prises 2P+T",
    room,
    usage,
    summary: dedicatedLoad ? "Départ dédié avec protection et récepteur repérés" : `${socketTotal} prise(s) distribuée(s) depuis un départ protégé`,
    documentCode: "SCH-PRISE-01",
    symbolMode: counts.symbolMode,
    body: `${supply}${branches}${devices}`
  });
}

function buildProfessionalLightingSchema(room, usage, counts = {}) {
  const lightTotal = clampCount(counts.lights, 1, 1, 8);
  const switchTotal = clampCount(counts.switches, 1, 1, 6);
  const displayLights = Math.min(lightTotal, 4);
  const displaySwitches = Math.min(switchTotal, 4);
  const supply = professionalSupplyChain({ rating: "10/16 A indicatif", purpose: "éclairage" });
  const switchPositions = Array.from({ length: displaySwitches }, (_, index) => ({
    x: 555,
    y: displaySwitches === 1 ? 242 : 166 + index * (186 / Math.max(displaySwitches - 1, 1))
  }));
  const lightPositions = Array.from({ length: displayLights }, (_, index) => ({ x: 790, y: 154 + index * 78 }));
  const devices = [
    ...switchPositions.map((position, index) => professionalSwitchSymbol(position.x, position.y, index)),
    ...lightPositions.map((position, index) => professionalLampSymbol(position.x, position.y, index))
  ].join("");
  const phaseWiring = switchPositions.map((position) => `
    <path class="phase-line" d="M 478 ${position.y} H ${position.x - 16}" />
    <circle class="junction-dot" cx="478" cy="${position.y}" r="4" />
  `).join("");
  const lightingWiring = lightPositions.map((position, index) => {
    const commandIndex = Math.min(index % displaySwitches, switchPositions.length - 1);
    const command = switchPositions[commandIndex];
    const routeX = 622 + commandIndex * 18;
    return `
      <path class="return-line" d="M ${command.x + 16} ${command.y} H ${routeX} V ${position.y - 10} H ${position.x - 22}" />
      <path class="neutral-line" d="M 478 ${position.y} H ${position.x - 22}" />
      <path class="earth-line" d="M 478 ${position.y + 10} H ${position.x - 22}" />
    `;
  }).join("");
  return professionalSchemaSheet({
    type: "eclairage",
    title: "Circuit éclairage — simple allumage",
    room,
    usage,
    summary: `${lightTotal} point(s) lumineux — ${switchTotal} commande(s)`,
    documentCode: "SCH-ECL-01",
    symbolMode: counts.symbolMode,
    body: `
      ${supply}
      <path class="schema-single-line" d="M 422 212 H 478 M 478 146 V 398" />
      ${professionalCableLabel(468, 196, "3G1,5 mm² indicatif — à confirmer")}
      ${phaseWiring}${lightingWiring}${devices}
      ${lightTotal > displayLights || switchTotal > displaySwitches ? `<text class="overflow-note" x="810" y="430">+ éléments supplémentaires non représentés</text>` : ""}
    `
  });
}

function buildProfessionalVaEtVientSchema(room, usage, counts = {}) {
  const commandTotal = Math.max(clampCount(counts.switches, 2, 2, 6), 2);
  const lightTotal = clampCount(counts.lights, 1, 1, 8);
  const displayLights = Math.min(lightTotal, 4);
  const intermediateCount = Math.max(commandTotal - 2, 0);
  const deviceCount = intermediateCount + 2;
  const startX = 500;
  const endX = 720;
  const spacing = deviceCount > 1 ? (endX - startX) / (deviceCount - 1) : 0;
  const positions = Array.from({ length: deviceCount }, (_, index) => startX + index * spacing);
  const devices = positions.map((x, index) => {
    const isIntermediate = index > 0 && index < positions.length - 1;
    return professionalVaSymbol(
      x,
      220,
      isIntermediate ? `P${index}` : `S${index === 0 ? 1 : 2}`,
      isIntermediate ? "permutateur" : "va-et-vient",
      isIntermediate,
      index === positions.length - 1
    );
  }).join("");
  const firstX = positions[0];
  const lastX = positions[positions.length - 1];
  const lampX = 820;
  const lightPositions = Array.from({ length: displayLights }, (_, index) => ({
    x: lampX,
    y: displayLights === 1 ? 220 : 142 + index * (210 / Math.max(displayLights - 1, 1))
  }));
  const returnBusX = 766;
  const neutralBusX = 780;
  const earthBusX = 794;
  const firstLightY = lightPositions[0].y;
  const lastLightY = lightPositions[lightPositions.length - 1].y;
  const lightingBranches = lightPositions.map((position) => `
    <path class="return-line" d="M ${returnBusX} ${position.y - 10} H ${position.x - 22}" />
    <path class="neutral-line" d="M ${neutralBusX} ${position.y} H ${position.x - 22}" />
    <path class="earth-line" d="M ${earthBusX} ${position.y + 10} H ${position.x - 22}" />
  `).join("");
  const lights = lightPositions.map((position, index) => professionalLampSymbol(position.x, position.y, index)).join("");
  return professionalSchemaSheet({
    type: "va-et-vient",
    title: intermediateCount ? "Commande multipoints — va-et-vient et permutateur(s)" : "Circuit éclairage — va-et-vient",
    room,
    usage,
    summary: `${commandTotal} commande(s) — ${lightTotal} point(s) lumineux — navettes repérées`,
    documentCode: "SCH-VV-01",
    symbolMode: counts.symbolMode,
    body: `
      ${professionalSupplyChain({ rating: "10/16 A indicatif", purpose: "éclairage" })}
      <path class="phase-line" d="M 422 212 H 462 V 220 H ${firstX - 18}" />
      <path class="traveler-line" d="M ${firstX + 18} 205 H ${lastX - 18}" />
      <path class="traveler-line traveler-two" d="M ${firstX + 18} 235 H ${lastX - 18}" />
      <path class="return-line" d="M ${lastX + 18} 220 H ${returnBusX} V ${firstLightY - 10} M ${returnBusX} ${firstLightY - 10} V ${lastLightY - 10}" />
      <path class="neutral-line" d="M 422 300 H ${neutralBusX} V ${firstLightY} M ${neutralBusX} ${firstLightY} V ${lastLightY}" />
      <path class="earth-line" d="M 422 324 H ${earthBusX} V ${firstLightY + 10} M ${earthBusX} ${firstLightY + 10} V ${lastLightY + 10}" />
      ${professionalCableLabel(468, 196, "3G1,5 mm² indicatif")}
      <text class="wire-callout" x="610" y="194">navette 1</text>
      <text class="wire-callout" x="610" y="255">navette 2</text>
      ${devices}
      ${lightingBranches}
      ${lights}
      ${lightTotal > displayLights ? `<text class="overflow-note" x="810" y="424">+ ${lightTotal - displayLights} point(s) non représenté(s)</text>` : ""}
    `
  });
}

function parseBreakerItem(item, index) {
  const safeItem = String(item || "").trim();
  const match = /^(\d{1,2}\s*A)\s*(.*)$/i.exec(safeItem);
  return {
    tag: `QF${index + 1}`,
    rating: match?.[1] || "? A",
    label: (match?.[2] || safeItem || `Circuit ${index + 1}`).slice(0, 16)
  };
}

function buildProfessionalBoardSchema(room, usage, counts = {}) {
  const breakers = getBreakerItems(counts).slice(0, 12).map(parseBreakerItem);
  const breakerWidth = 58;
  const columnGap = 8;
  const startX = 454;
  const devices = breakers.map((breaker, index) => {
    const column = index % 6;
    const row = Math.floor(index / 6);
    const x = startX + column * (breakerWidth + columnGap);
    const y = row === 0 ? 154 : 304;
    return `
      <g class="board-breaker iec-board-breaker" transform="translate(${x} ${y})" data-symbol="${escapeHtml(breaker.tag)}">
        <text class="breaker-tag" x="${breakerWidth / 2}" y="8">${escapeHtml(breaker.tag)}</text>
        <line class="breaker-wire" x1="${breakerWidth / 2}" y1="-12" x2="${breakerWidth / 2}" y2="18" />
        <circle class="breaker-terminal" cx="${breakerWidth / 2}" cy="20" r="3.5" />
        <circle class="breaker-terminal" cx="${breakerWidth / 2}" cy="58" r="3.5" />
        <line class="breaker-contact" x1="${breakerWidth / 2 + 3}" y1="18" x2="${breakerWidth / 2 + 17}" y2="47" />
        <path class="breaker-trip" d="M ${breakerWidth / 2 + 12} 37 q 8 6 0 12 q -8 6 0 12" />
        <line class="breaker-wire" x1="${breakerWidth / 2}" y1="58" x2="${breakerWidth / 2}" y2="96" />
        <text class="breaker-rating" x="${breakerWidth / 2}" y="74">${escapeHtml(breaker.rating)}</text>
        <text class="breaker-label" x="${breakerWidth / 2}" y="86">${escapeHtml(breaker.label.slice(0, 9))}</text>
        <text class="breaker-label" x="${breakerWidth / 2}" y="96">${escapeHtml(breaker.label.slice(9, 16))}</text>
      </g>
      <path class="phase-line board-feed" d="M ${x + breakerWidth / 2} ${y - 12} V ${y}" />
      <path class="neutral-line board-return" d="M ${x + breakerWidth / 2} ${y + 96} V ${row === 0 ? 276 : 428}" />
    `;
  }).join("");
  return professionalSchemaSheet({
    type: "tableau",
    title: "Tableau électrique — schéma unifilaire",
    room,
    usage,
    summary: `${breakers.length} départ(s) divisionnaire(s) repéré(s)`,
    documentCode: "SCH-TAB-01",
    symbolMode: counts.symbolMode,
    body: `
      ${professionalSupplyChain({ includeAgcp: true })}
      <path class="phase-line busbar-line" d="M 414 212 V 142 H 850 M 438 142 V 292 H 850" />
      <path class="neutral-line neutral-bus-line" d="M 438 276 H 850 M 438 276 V 430" />
      <text class="wire-callout" x="620" y="132">peigne phase — répartition indicative</text>
      ${devices}
      <g class="terminal-bar neutral-bar">
        <rect x="454" y="430" width="394" height="12" rx="3" />
        <text x="651" y="426">XTB-N — BORNIER N — retours neutres par circuit</text>
      </g>
      <g class="terminal-bar earth-bar">
        <rect x="454" y="449" width="394" height="12" rx="3" />
        <text x="651" y="446">XTB-PE — BARRETTE PE — conducteurs de protection</text>
      </g>
      <path class="earth-line board-earth-feed" d="M 438 324 H 446 V 455 H 454" />
    `
  });
}

function buildSchema(type, room, usage, counts = {}) {
  if (type === "eclairage") return buildProfessionalLightingSchema(room, usage, counts);
  if (type === "va-et-vient") return buildProfessionalVaEtVientSchema(room, usage, counts);
  if (type === "tableau") return buildProfessionalBoardSchema(room, usage, counts);
  return buildProfessionalOutletSchema(room, usage, counts);
}

function numberedRows(label, count, prefix = "") {
  const total = Math.max(count, 1);
  return Array.from({ length: total }, (_, index) => `${prefix}${label} ${index + 1}`).join("\n");
}

function buildLineSchema(type, counts = {}, usage = "") {
  const socketTotal = clampCount(counts.sockets, 1, 0, 12);
  const lightTotal = clampCount(counts.lights, 1, 0, 8);
  const switchTotal = clampCount(counts.switches, type === "va-et-vient" ? 2 : 1, 0, 6);
  const dedicatedLoad = type === "prise" ? dedicatedLoadLabel(usage) : "";
  const socketBranchLabel = dedicatedLoad ? `[ ${dedicatedLoad.toUpperCase()} / POINT DEDIE ]` : "[ PRISE 2P+T ]";
  const socketBranches = numberedRows(socketBranchLabel, socketTotal, "             ├──────────────> ");
  const lightBranches = numberedRows("[ LAMPE ]", lightTotal, "             ├──────────────> ");
  const switchChain = Array.from({ length: Math.max(switchTotal, 1) }, (_, index) => `[INT ${index + 1}]`).join(" ---- ");
  const vaSwitches = Math.max(switchTotal, 2);
  const vaChain = Array.from({ length: vaSwitches }, (_, index) => `[VA ${index + 1}]`).join(" == navettes == ");
  const receiverTitle = dedicatedLoad ? "APPAREIL / POINT DEDIE" : "BOITE / PRISE 2P+T";
  const receiverLabel = dedicatedLoad ? dedicatedLoad.toUpperCase() : "PRISE";
  const protectionLabel = dedicatedLoad ? "Protection dediee" : "Disjoncteur 16/20A";
  const schemas = {
    prise: `
TABLEAU ELECTRIQUE                      ${receiverTitle}
┌────────────────────┐                  ┌────────────────────┐
│ ${protectionLabel.padEnd(18, " ")} │                  │ ${receiverLabel.slice(0, 18).padStart(18, " ")} │
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

  const documentCodes = {
    prise: "SCH-PRISE-01",
    eclairage: "SCH-ECL-01",
    "va-et-vient": "SCH-VV-01",
    tableau: "SCH-TAB-01"
  };
  return [
    "┌──────────────────────────────────────────────────────────────────────────────┐",
    `│ SCHÉMA UNIFILAIRE DE CONTRÔLE · ${documentCodes[type] || documentCodes.prise} · RÉV. R00`,
    "│ STATUT : INDICATIF / NON EXÉCUTOIRE",
    "└──────────────────────────────────────────────────────────────────────────────┘",
    "",
    (schemas[type] || schemas.prise).trim(),
    "",
    "REPÈRES : ID différentiel · QF disjoncteur · PC prise · X lumière · S commande",
    "À CONFIRMER : calibres, sections, mode de pose, terre, sélectivité et conformité."
  ].join("\n");
}

function buildSchemaPrompt() {
  const typeLabel = schemaType.options[schemaType.selectedIndex].textContent;
  const room = schemaRoom.value.trim() || "pièce non précisée";
  const usage = schemaUse.value.trim() || "usage non précisé";
  const counts = getSchemaCounts();
  const dedicatedLoad = schemaType.value === "prise" ? dedicatedLoadLabel(usage) : "";
  const symbolStyle = schemaSymbolMode?.value === "engineering"
    ? "Format bureau d'études: analyse le folio, le numéro de document, la nomenclature, les conventions conducteurs, la table de révision et le cartouche. Reste strictement fidèle aux repères dessinés et n'ajoute aucun organe absent."
    : "Format clair annoté: privilégie les libellés explicites, la lecture rapide et reste strictement fidèle aux éléments dessinés.";
  const diagramInventory = schemaType.value === "prise"
    ? dedicatedLoad
      ? `Composants réellement dessinés et repérés: arrivée X0, interrupteur différentiel ID1, disjoncteur QF1, point dédié E1 ${dedicatedLoad}, liaison unifilaire et conducteur PE. Aucun symbole PC n'est dessiné: ne prétends pas le contraire.`
      : "Composants réellement dessinés et repérés: arrivée X0, interrupteur différentiel ID1, disjoncteur QF1, prises PC1 à PCn et dérivations unifilaires."
    : schemaType.value === "eclairage"
      ? "Composants réellement dessinés et repérés: arrivée X0, différentiel ID1, disjoncteur QF1, commandes S, points lumineux X, phase, retours lampe, neutre et terre."
      : schemaType.value === "va-et-vient"
        ? "Composants réellement dessinés et repérés: arrivée X0, différentiel ID1, disjoncteur QF1, deux commandes va-et-vient S1/S2, éventuels permutateurs P, deux navettes, retour lampe, point lumineux X1, neutre et terre."
        : "Composants réellement dessinés et repérés: arrivée X0, AGCP, ID1 30 mA, QF divisionnaires, peigne de phase, retours neutres, bornier N et barrette PE.";
  const quantityDetails = schemaType.value === "prise"
    ? [`Nombre de prises ou départs: ${counts.sockets}.`]
    : schemaType.value === "tableau"
      ? [
          `Nombre de disjoncteurs tableau: ${counts.breakers}.`,
          `Calibres ou circuits demandés: ${counts.breakerRatings || "non précisé"}.`
        ]
      : [
          `Nombre de lumières: ${counts.lights}.`,
          `Nombre de commandes: ${counts.switches}.`
        ];
  return [
    "Explique ce schéma électrique indicatif.",
    `Type: ${typeLabel}.`,
    `Format demandé: ${symbolStyle}`,
    diagramInventory,
    `Pièce: ${room}.`,
    `Usage ou puissance: ${usage}.`,
    ...quantityDetails,
    schemaType.value === "va-et-vient" && counts.switches > 2
      ? "Important: pour plus de 2 points de commande, explique le principe avec deux va-et-vient aux extremites et un ou plusieurs permutateurs intermediaires."
      : "",
    schemaType.value === "tableau"
      ? "Pour le tableau, explique la logique arrivee/AGCP, interrupteur differentiel 30mA, peignes, disjoncteurs divisionnaires, borniers neutre et terre, sans presenter cela comme un plan de conformite."
      : "",
    buildLevelInstruction(),
    buildResponseFormatInstruction(),
    "Donne une explication simple, les points de sécurité, les limites du schéma, puis rappelle qu'un schéma réel doit respecter la norme applicable et être validé par un électricien.",
    "Lis le document comme un schéma unifilaire professionnel réalisé avec des symboles électriques: cite les repères exacts du dessin, explique le cartouche et distingue clairement ce qui est représenté de ce qui reste à confirmer.",
    "Le schéma symbolique est déjà affiché dans l'interface. Ne génère aucun second schéma ASCII, aucun dessin en caractères et aucun quadrillage textuel."
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

  counts.symbolMode = /bureau d['’ ]?etudes?|bureau d['’ ]?études?|folio|dossier technique/.test(text)
    ? "engineering"
    : "standard";

  return counts;
}

function schemaTitle(type, symbolMode = "standard") {
  const titles = {
    prise: "Schéma symbolique — circuit prises",
    eclairage: "Schéma symbolique — éclairage simple allumage",
    "va-et-vient": "Schéma symbolique — commande va-et-vient",
    tableau: "Schéma symbolique — tableau électrique"
  };
  const title = titles[type] || titles.prise;
  return symbolMode === "engineering" ? title.replace("Schéma symbolique", "Dossier bureau d'études") : title;
}

function addAutomaticSchema(content) {
  const type = inferSchemaType(content);
  const counts = inferSchemaCounts(content, type);
  addDiagramMessage(
    schemaTitle(type, counts.symbolMode),
    buildSchema(type, "demande du chat", content.slice(0, 90), counts),
    "Schéma généré automatiquement depuis ta demande avec des symboles électriques. Il reste indicatif et doit être validé avant travaux."
  );
}

async function askAssistant(content, options = {}) {
  const schemaOutputInstruction = isSchemaRequest(content)
    ? "\nUn schéma SVG avec de vrais symboles électriques est déjà affiché dans l'interface. Explique-le sans produire de schéma ASCII, de dessin en traits ou de quadrillage textuel."
    : "";
  const contentForModel = `${content}${schemaOutputInstruction}\n\n${buildLevelInstruction()}\n${buildResponseFormatInstruction()}`;
  messages.push({ role: "user", content: contentForModel });
  if (!options.skipUserMessage) {
    addMessage("user", content);
  }

  if (!options.skipAutoSchema && isSchemaRequest(content) && !pedagogyBlocksRequest("schematics", content)) {
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
        normsSearch: sourceSettings.normsSearch,
        requestKind: options.requestKind || "chat",
        safetyContext: options.safetyContext || ""
      })
    });

    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    const reply = (data.reply || "").trim() || "Je n'ai pas pu générer de réponse.";
    setAssistantMessage(pending, reply);
    messages.push({ role: "assistant", content: reply });
    await refreshAccount();
    hideConversionBanner();
    if (handlePedagogicalBlockedResponse(data)) return;
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
  if (guardPedagogicalFeature("schematics")) return;
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
    const response = await fetchWithTimeout("/api/photo-schema", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: selectedPhotoDataUrl,
        context
      })
    }, 150000);

    const data = await readJsonResponse(response);
    if (handleBarrierResponse(response, data, "Erreur inconnue.")) return;

    const reply = (data.reply || "").trim() || "Je n'ai pas pu analyser cette photo.";
    setAssistantMessage(pending, reply);
    renderRecognizedObject(data.objectIdentity);
    messages.push({
      role: "assistant",
      content: `Analyse photo vers schéma:\n${reply}`
    });
    await refreshAccount();
    hideConversionBanner();
    if (handlePedagogicalBlockedResponse(data)) return;
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
    const response = await fetchWithTimeout("/api/manual-search", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        reference,
        image: selectedManualPhotoDataUrl
      })
    }, 180000);

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
    if (handlePedagogicalBlockedResponse(data)) return;
    hint.textContent = "Recherche terminée. Vérifie toujours que la référence correspond exactement à ton appareil.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas rechercher la notice pour l'instant: ${error.message}`);
    hint.textContent = "Vérifie la clé API, le quota OpenAI ou retente avec une référence plus complète.";
  } finally {
    searchManual.disabled = false;
  }
}

async function analyzeLightingPlan() {
  if (guardPedagogicalFeature("calculations")) return;
  if (!selectedLightingPlanDataUrl) {
    const sketchReady = useLightingSketchAsPlan({ silent: true });
    if (!sketchReady) {
      hint.textContent = "Ajoute un plan ou dessine un croquis quadrillé avant de lancer le dimensionnement éclairage.";
      lightingPlanInput.focus();
      return;
    }
  }

  const room = lightingRoom.value.trim();
  const dimensions = lightingDimensions.value.trim();
  const height = lightingHeight.value.trim();
  const type = lightingType.value;
  const sourceLabel = selectedLightingPlanSource === "sketch" ? "croquis quadrillé dessiné à la main" : "plan importé";
  const details = [
    `Source: ${sourceLabel}`,
    room ? `Piece: ${room}` : "",
    dimensions ? `Dimensions: ${dimensions}` : "",
    height ? `Hauteur: ${height}` : "",
    type ? `Type souhaite: ${type}` : "",
    selectedLightingPlanSource === "sketch"
      ? "Demande: retranscrire le croquis en plan coté propre, placer les cotes sur le dessin et ajouter les spots directement sur le schéma avec le symbole lumineux ⊗ au bon endroit."
      : ""
  ].filter(Boolean).join(" | ");

  addLightingPlanMessage(details, selectedLightingPlanDataUrl);

  const pending = addMessage("assistant", "", { loading: true });
  analyzeLighting.disabled = true;
  hint.textContent = "Voltia analyse le plan et calcule une implantation d'éclairage...";

  try {
    const response = await fetchWithTimeout("/api/lighting-plan", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image: selectedLightingPlanDataUrl,
        room,
        dimensions,
        height,
        type,
        source: selectedLightingPlanSource,
        level: selectedLevel
      })
    }, 180000);

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
    if (handlePedagogicalBlockedResponse(data)) return;
    hint.textContent = "Dimensionnement généré. Vérifie les cotes et fais valider avant travaux.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas dimensionner l'éclairage pour l'instant: ${error.message}`);
    hint.textContent = "Vérifie la clé API, le quota OpenAI ou ajoute un plan plus lisible.";
  } finally {
    analyzeLighting.disabled = false;
  }
}

async function sizeClimateSystem() {
  if (guardPedagogicalFeature("calculations")) return;
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
    if (handlePedagogicalBlockedResponse(data)) return;
    hint.textContent = "Estimation clim générée. Vérifie avec un frigoriste avant achat ou pose.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas dimensionner la clim pour l'instant: ${error.message}`);
    hint.textContent = "Vérifie les données ou les logs Render si le site est en ligne.";
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
fullscreenButton?.addEventListener("click", toggleChatFullscreen);
showSampleReport?.addEventListener("click", showProfessionalReportExample);
conversionPrimaryButton?.addEventListener("click", () => conversionPrimaryAction());
conversionSecondaryButton?.addEventListener("click", () => conversionSecondaryAction());
projectUpsellButton?.addEventListener("click", startCheckout);
createProjectButton?.addEventListener("click", createProject);

document.addEventListener("fullscreenchange", () => {
  setChatFullscreenState(document.fullscreenElement === chatShell);
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape" || !fallbackChatFullscreen) return;
  setChatFullscreenState(false);
});

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
    if (guardPlusToolCard(card)) return;

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
    if (guardPlusToolCard(card)) return;
    setOpenCard();
  });
});

function syncToolCardStates() {
  toolCards.forEach((card) => {
    card.querySelector(".card-heading")?.setAttribute("aria-expanded", String(card.classList.contains("is-open")));
  });
}

syncToolCardStates();
updatePlusToolCards();

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
  setAuthMode("signup", { focus: true });
  setHint("Crée ton compte gratuit avec ton nom, ton email et un mot de passe.");
});
loginModeButton.addEventListener("click", () => {
  setAuthMode("login", { focus: true });
  setHint("Connecte-toi pour retrouver tes rapports et ton abonnement.");
});
signupButton.addEventListener("click", () => submitAuth("signup"));
loginButton.addEventListener("click", () => submitAuth("login"));
accessCodeButton.addEventListener("click", submitAccessCode);
logoutButton.addEventListener("click", logoutAccount);
exportAccountButton?.addEventListener("click", exportAccountData);
deleteAccountButton?.addEventListener("click", deleteAccount);
upgradeButton.addEventListener("click", startCheckout);
savePedagogyButton?.addEventListener("click", savePedagogicalClassroom);
regeneratePedagogyCodeButton?.addEventListener("click", regeneratePedagogicalCode);
deletePedagogyButton?.addEventListener("click", deletePedagogicalClassroom);
copyPedagogyCodeButton?.addEventListener("click", copyPedagogicalCode);
joinClassroomButton?.addEventListener("click", joinPedagogicalClassroom);
pedagogyStudentList?.addEventListener("click", (event) => {
  const button = event.target.closest("button[data-student-id]");
  if (!button) return;
  removePedagogicalStudent(button.dataset.studentId, button.dataset.studentName);
});

startDiagnostic.addEventListener("click", async () => {
  await askAssistant(buildDiagnosticPrompt());
});

createSchema.addEventListener("click", async () => {
  syncSchemaDefaults();
  const typeLabel = schemaType.options[schemaType.selectedIndex].textContent;
  const styleLabel = schemaSymbolMode?.selectedOptions?.[0]?.textContent || "Schéma clair annoté";
  const room = schemaRoom.value.trim();
  const usage = schemaUse.value.trim();
  const counts = getSchemaCounts();
  const schemaPrompt = buildSchemaPrompt();
  if (guardPedagogicalFeature("schematics", schemaPrompt)) return;
  const dedicatedLoad = schemaType.value === "prise" ? dedicatedLoadLabel(usage) : "";
  const circuitTitle = dedicatedLoad ? `Circuit spécialisé - ${dedicatedLoad}` : typeLabel;
  addMessage("user", `Crée un schéma : ${typeLabel}, style : ${styleLabel}${room ? `, pièce : ${room}` : ""}${usage ? `, usage : ${usage}` : ""}.`);
  addDiagramMessage(
    `${styleLabel} — ${circuitTitle}`,
    buildSchema(schemaType.value, room, usage, counts),
    "Schéma symbolique indicatif généré par Voltia. Ne pas intervenir sous tension."
  );
  await askAssistant(schemaPrompt, {
    skipAutoSchema: true,
    skipUserMessage: true,
    requestKind: "schema-explanation",
    safetyContext: `${room} ${usage}`.trim()
  });
});

schemaType.addEventListener("change", () => {
  syncSchemaDefaults();
  hint.textContent = "Type de schéma mis à jour. Ajuste les quantités puis crée le schéma.";
});

schemaSymbolMode?.addEventListener("change", () => {
  hint.textContent = schemaSymbolMode.value === "engineering"
    ? "Format bureau d'études sélectionné : folio, nomenclature, révision et cartouche complet."
    : "Format clair sélectionné : schéma annoté pour une lecture rapide.";
});

photoInput.addEventListener("change", async () => {
  const file = photoInput.files?.[0];
  if (!file) return;

  selectedPhotoDataUrl = "";
  analyzePhoto.disabled = true;
  hint.textContent = "Préparation et optimisation de la photo...";
  try {
    const prepared = await prepareImageUpload(file, { maxDimension: 2200, quality: 0.9 });
    selectedPhotoDataUrl = prepared.dataUrl;
    photoLabel.textContent = uploadSummary(file.name, prepared);
    photoPreview.hidden = false;
    photoPreview.innerHTML = `<img src="${selectedPhotoDataUrl}" alt="Aperçu de la photo">`;
    hint.textContent = prepared.optimized
      ? "Photo optimisée et prête. Ajoute un contexte si besoin puis lance l'analyse."
      : "Photo prête. Ajoute un contexte si besoin puis lance l'analyse.";
  } catch (error) {
    photoPreview.hidden = true;
    photoPreview.innerHTML = "";
    photoLabel.textContent = "Choisir une photo";
    hint.textContent = error.message;
  } finally {
    analyzePhoto.disabled = false;
  }
});

manualPhotoInput.addEventListener("change", async () => {
  const file = manualPhotoInput.files?.[0];
  if (!file) return;

  selectedManualPhotoDataUrl = "";
  searchManual.disabled = true;
  hint.textContent = "Préparation de la photo de référence...";
  try {
    const prepared = await prepareImageUpload(file, { maxDimension: 2400, quality: 0.92 });
    selectedManualPhotoDataUrl = prepared.dataUrl;
    manualPhotoLabel.textContent = uploadSummary(file.name, prepared);
    manualPhotoPreview.hidden = false;
    manualPhotoPreview.innerHTML = `<img src="${selectedManualPhotoDataUrl}" alt="Aperçu de la référence">`;
    hint.textContent = prepared.optimized
      ? "Photo de référence optimisée. Tu peux lancer la recherche de notice."
      : "Photo de référence prête. Tu peux lancer la recherche de notice.";
  } catch (error) {
    manualPhotoPreview.hidden = true;
    manualPhotoPreview.innerHTML = "";
    manualPhotoLabel.textContent = "Choisir une photo de référence";
    hint.textContent = error.message;
  } finally {
    searchManual.disabled = false;
  }
});

lightingPlanInput.addEventListener("change", async () => {
  const file = lightingPlanInput.files?.[0];
  if (!file) return;

  selectedLightingPlanDataUrl = "";
  analyzeLighting.disabled = true;
  hint.textContent = "Préparation du plan...";
  try {
    const prepared = await prepareImageUpload(file, { maxDimension: 2400, quality: 0.92 });
    selectedLightingPlanDataUrl = prepared.dataUrl;
    selectedLightingPlanSource = "upload";
    lightingPlanLabel.textContent = uploadSummary(file.name, prepared);
    lightingPlanPreview.hidden = false;
    lightingPlanPreview.innerHTML = `<img src="${selectedLightingPlanDataUrl}" alt="Aperçu du plan">`;
    hint.textContent = prepared.optimized
      ? "Plan optimisé. Ajoute les dimensions connues puis lance le dimensionnement."
      : "Plan prêt. Ajoute les dimensions connues puis lance le dimensionnement.";
  } catch (error) {
    lightingPlanPreview.hidden = true;
    lightingPlanPreview.innerHTML = "";
    lightingPlanLabel.textContent = "Choisir un plan";
    hint.textContent = error.message;
  } finally {
    analyzeLighting.disabled = false;
  }
});

lightingDrawModeButtons.forEach((button) => {
  button.addEventListener("click", () => {
    setLightingSketchMode(button.dataset.lightingDrawMode);
  });
});

lightingSketchCanvas?.addEventListener("pointerdown", startLightingSketchStroke);
lightingSketchCanvas?.addEventListener("pointermove", moveLightingSketchStroke);
lightingSketchCanvas?.addEventListener("pointerup", endLightingSketchStroke);
lightingSketchCanvas?.addEventListener("pointercancel", endLightingSketchStroke);
lightingSketchCanvas?.addEventListener("pointerleave", (event) => {
  if (lightingSketchDrawing) endLightingSketchStroke(event);
});
useLightingSketch?.addEventListener("click", () => useLightingSketchAsPlan());
clearLightingSketch?.addEventListener("click", clearLightingSketchCanvas);

analyzePhoto.addEventListener("click", analyzePhotoToSchema);
searchManual.addEventListener("click", searchManualNotice);
analyzeLighting.addEventListener("click", analyzeLightingPlan);
sizeClimate.addEventListener("click", sizeClimateSystem);

renderLightingSketch();
await refreshAccount();
handleLandingState();
const initialReportId = pageParams.get("report");
if (initialReportId) {
  await loadSavedConversation(initialReportId);
}
syncSchemaDefaults();
autosize();
