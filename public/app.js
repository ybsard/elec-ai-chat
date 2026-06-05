const form = document.querySelector("#chatForm");
const promptInput = document.querySelector("#prompt");
const messagesEl = document.querySelector("#messages");
const clearButton = document.querySelector("#clearChat");
const hint = document.querySelector("#hint");
const counter = document.querySelector("#counter");
const sendButton = document.querySelector("#sendButton");
const suggestionButtons = document.querySelectorAll("[data-prompt]");
const issueButtons = document.querySelectorAll("[data-issue]");
const symptomInput = document.querySelector("#symptomInput");
const riskSelect = document.querySelector("#riskSelect");
const startDiagnostic = document.querySelector("#startDiagnostic");
const schemaType = document.querySelector("#schemaType");
const schemaRoom = document.querySelector("#schemaRoom");
const schemaUse = document.querySelector("#schemaUse");
const createSchema = document.querySelector("#createSchema");

const messages = [];
const maxLength = Number(promptInput.getAttribute("maxlength") || 1200);
let selectedIssue = "Disjoncteur qui saute";

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
  label.textContent = role === "user" ? "Vous" : "ELEC.AI";

  const bubble = document.createElement("div");
  bubble.className = "bubble";

  if (options.loading) {
    bubble.innerHTML = '<span class="typing"><span></span><span></span><span></span></span>';
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
  bubble.textContent = content;
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

function addDiagramMessage(title, svgMarkup, note) {
  const item = document.createElement("article");
  item.className = "message assistant";

  const avatar = document.createElement("div");
  avatar.className = "avatar";
  avatar.textContent = "AI";

  const stack = document.createElement("div");
  stack.className = "message-stack";

  const label = document.createElement("span");
  label.className = "message-label";
  label.textContent = "ELEC.AI";

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

function autosize() {
  promptInput.style.height = "auto";
  promptInput.style.height = `${promptInput.scrollHeight}px`;
  updateCounter();
}

function buildDiagnosticPrompt() {
  const symptom = symptomInput.value.trim() || "L'utilisateur n'a pas encore donne de detail.";
  const risk = riskSelect.value;
  return [
    "Demande de diagnostic electrique guide.",
    `Type de probleme: ${selectedIssue}.`,
    `Observation: ${symptom}.`,
    `Niveau de risque indique: ${risk}.`,
    "Reponds avec: 1) danger immediat ou non, 2) causes possibles, 3) verifications simples sans danger, 4) quand appeler un electricien."
  ].join("\n");
}

function buildSchema(type, room, usage) {
  const safeRoom = escapeHtml(room || "piece a definir");
  const safeUsage = escapeHtml(usage || "usage a definir");
  const baseLabels = {
    prise: ["Tableau", "Disjoncteur 16A/20A", "Phase + Neutre + Terre", "Prise"],
    eclairage: ["Tableau", "Disjoncteur 10A/16A", "Interrupteur", "Point lumineux"],
    "va-et-vient": ["Tableau", "Interrupteur A", "Navettes", "Interrupteur B", "Point lumineux"],
    tableau: ["Arrivee", "Interrupteur differentiel", "Disjoncteurs", "Circuits"]
  };
  const labels = baseLabels[type] || baseLabels.prise;
  const blocks = labels.map((label, index) => {
    const x = 35 + index * (460 / Math.max(labels.length - 1, 1));
    const line = index === labels.length - 1 ? "" : `<line x1="${x + 70}" y1="96" x2="${35 + (index + 1) * (460 / Math.max(labels.length - 1, 1)) - 6}" y2="96" />`;
    return `
      <g>
        <rect x="${x - 8}" y="58" width="86" height="74" rx="8" />
        <text x="${x + 35}" y="88">${escapeHtml(label)}</text>
        <text x="${x + 35}" y="108">${index + 1}</text>
      </g>
      ${line}
    `;
  }).join("");

  return `
    <svg viewBox="0 0 560 210" role="img" aria-label="Schema electrique simplifie">
      <defs>
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="5" markerHeight="5" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z"></path>
        </marker>
      </defs>
      <text class="diagram-title" x="24" y="28">Schema indicatif - ${safeRoom}</text>
      <text class="diagram-subtitle" x="24" y="48">Usage: ${safeUsage}</text>
      <g class="diagram-circuit" marker-end="url(#arrow)">
        ${blocks}
      </g>
      <text class="diagram-note" x="24" y="178">Representation simplifiee: verifier la norme applicable et faire valider par un professionnel.</text>
    </svg>
  `;
}

function buildSchemaPrompt() {
  const typeLabel = schemaType.options[schemaType.selectedIndex].textContent;
  const room = schemaRoom.value.trim() || "piece non precisee";
  const usage = schemaUse.value.trim() || "usage non precise";
  return [
    "Explique ce schema electrique indicatif.",
    `Type: ${typeLabel}.`,
    `Piece: ${room}.`,
    `Usage ou puissance: ${usage}.`,
    "Donne une explication simple, les points de securite, et rappelle qu'un schema reel doit respecter la norme applicable et etre valide par un electricien."
  ].join("\n");
}

async function askAssistant(content) {
  messages.push({ role: "user", content });
  addMessage("user", content);

  const pending = addMessage("assistant", "", { loading: true });
  sendButton.disabled = true;
  promptInput.disabled = true;
  hint.textContent = "ELEC.AI analyse les pistes possibles...";

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ messages })
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || "Erreur inconnue.");
    }

    const reply = (data.reply || "").trim() || "Je n'ai pas pu generer de reponse.";
    setAssistantMessage(pending, reply);
    messages.push({ role: "assistant", content: reply });
    hint.textContent = "Reponse generee. Precise le contexte si tu veux une piste plus exacte.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas repondre pour l'instant: ${error.message}`);
    hint.textContent = "Verifie OPENAI_API_KEY, le quota OpenAI et les logs Render si le site est en ligne.";
  } finally {
    sendButton.disabled = false;
    promptInput.disabled = false;
    promptInput.focus();
  }
}

promptInput.addEventListener("input", autosize);

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

startDiagnostic.addEventListener("click", async () => {
  await askAssistant(buildDiagnosticPrompt());
});

createSchema.addEventListener("click", async () => {
  const typeLabel = schemaType.options[schemaType.selectedIndex].textContent;
  const room = schemaRoom.value.trim();
  const usage = schemaUse.value.trim();
  addDiagramMessage(
    typeLabel,
    buildSchema(schemaType.value, room, usage),
    "Schema indicatif genere par ELEC.AI. Ne pas intervenir sous tension."
  );
  await askAssistant(buildSchemaPrompt());
});

autosize();
