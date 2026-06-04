const form = document.querySelector("#chatForm");
const promptInput = document.querySelector("#prompt");
const messagesEl = document.querySelector("#messages");
const clearButton = document.querySelector("#clearChat");
const hint = document.querySelector("#hint");

const messages = [];

function addMessage(role, content) {
  const item = document.createElement("article");
  item.className = `message ${role}`;

  const bubble = document.createElement("div");
  bubble.className = "bubble";
  bubble.textContent = content;

  item.append(bubble);
  messagesEl.append(item);
  messagesEl.scrollTop = messagesEl.scrollHeight;
  return item;
}

function autosize() {
  promptInput.style.height = "auto";
  promptInput.style.height = `${promptInput.scrollHeight}px`;
}

async function askAssistant(content) {
  messages.push({ role: "user", content });
  addMessage("user", content);

  const pending = addMessage("assistant", "Réflexion en cours...");
  const button = form.querySelector("button");
  button.disabled = true;

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

    const reply = data.reply.trim();
    pending.querySelector(".bubble").textContent = reply;
    messages.push({ role: "assistant", content: reply });
    hint.textContent = "Réponse générée par l'IA.";
  } catch (error) {
    pending.querySelector(".bubble").textContent = `Je ne peux pas répondre pour l'instant: ${error.message}`;
    hint.textContent = "Ajoute OPENAI_API_KEY dans l'environnement du serveur pour activer l'IA.";
  } finally {
    button.disabled = false;
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
  addMessage("assistant", "Conversation effacée. Quelle est ta prochaine question ?");
  promptInput.focus();
});
