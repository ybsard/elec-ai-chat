const form = document.querySelector("#chatForm");
const promptInput = document.querySelector("#prompt");
const messagesEl = document.querySelector("#messages");
const clearButton = document.querySelector("#clearChat");
const hint = document.querySelector("#hint");
const counter = document.querySelector("#counter");
const sendButton = document.querySelector("#sendButton");
const suggestionButtons = document.querySelectorAll("[data-prompt]");

const messages = [];
const maxLength = Number(promptInput.getAttribute("maxlength") || 1200);

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
    stack.append(actions);
  }

  item.append(avatar, stack);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return item;
}

function setAssistantMessage(item, content) {
  const bubble = item.querySelector(".bubble");
  bubble.textContent = content;

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
  item.querySelector(".message-stack").append(actions);
}

function autosize() {
  promptInput.style.height = "auto";
  promptInput.style.height = `${promptInput.scrollHeight}px`;
  updateCounter();
}

async function askAssistant(content) {
  messages.push({ role: "user", content });
  addMessage("user", content);

  const pending = addMessage("assistant", "", { loading: true });
  sendButton.disabled = true;
  promptInput.disabled = true;
  hint.textContent = "ELEC.AI prepare une reponse...";

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
    hint.textContent = "Reponse generee. Tu peux continuer la conversation.";
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
  addMessage("assistant", "Conversation effacee. Quelle est ta prochaine question ?");
  hint.textContent = "Nouvelle conversation demarree.";
  promptInput.focus();
});

suggestionButtons.forEach((button) => {
  button.addEventListener("click", () => {
    promptInput.value = button.dataset.prompt;
    autosize();
    promptInput.focus();
  });
});

autosize();
