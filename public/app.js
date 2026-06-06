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
const socketCount = document.querySelector("#socketCount");
const lightCount = document.querySelector("#lightCount");
const switchCount = document.querySelector("#switchCount");
const createSchema = document.querySelector("#createSchema");
const photoInput = document.querySelector("#photoInput");
const photoLabel = document.querySelector("#photoLabel");
const photoPreview = document.querySelector("#photoPreview");
const photoContext = document.querySelector("#photoContext");
const analyzePhoto = document.querySelector("#analyzePhoto");

const messages = [];
const maxLength = Number(promptInput.getAttribute("maxlength") || 1200);
let selectedIssue = "Disjoncteur qui saute";
let selectedPhotoDataUrl = "";

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
  label.textContent = "ELEC.AI";

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
    "Donne une explication simple, les points de securite, et rappelle qu'un schema reel doit respecter la norme applicable et etre valide par un electricien."
  ].join("\n");
}

function isSchemaRequest(content) {
  return /\bsch[eé]ma\b|\bplan electrique\b|\bcircuit\b/i.test(content);
}

function inferSchemaType(content) {
  const text = content.toLowerCase();
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
  addDiagramMessage(
    schemaTitle(type),
    buildSchema(type, "demande du chat", "schema demande"),
    "Schema genere automatiquement depuis ta demande. Il reste indicatif et doit etre valide avant travaux.",
    buildLineSchema(type)
  );
}

async function askAssistant(content, options = {}) {
  messages.push({ role: "user", content });
  addMessage("user", content);

  if (!options.skipAutoSchema && isSchemaRequest(content)) {
    addAutomaticSchema(content);
  }

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

    const data = await readJsonResponse(response);
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
  hint.textContent = "ELEC.AI analyse la photo et prepare un schema...";

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
    hint.textContent = "Photo analysee. Verifie toujours avec un electricien avant intervention.";
  } catch (error) {
    setAssistantMessage(pending, `Je ne peux pas analyser cette photo pour l'instant: ${error.message}`);
    hint.textContent = "Verifie la cle API, le quota OpenAI ou essaye une image plus nette.";
  } finally {
    analyzePhoto.disabled = false;
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
  const counts = getSchemaCounts();
  addDiagramMessage(
    typeLabel,
    buildSchema(schemaType.value, room, usage, counts),
    "Schema indicatif genere par ELEC.AI. Ne pas intervenir sous tension.",
    buildLineSchema(schemaType.value, counts)
  );
  await askAssistant(buildSchemaPrompt(), { skipAutoSchema: true });
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

analyzePhoto.addEventListener("click", analyzePhotoToSchema);

autosize();
