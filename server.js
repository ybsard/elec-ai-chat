import { createServer } from "node:http";
import { readFile } from "node:fs/promises";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = fileURLToPath(new URL(".", import.meta.url));
const publicDir = join(__dirname, "public");
const port = Number(process.env.PORT || 3000);

const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml"
};

function sendJson(res, status, body) {
  res.writeHead(status, { "Content-Type": "application/json; charset=utf-8" });
  res.end(JSON.stringify(body));
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

async function handleChat(req, res) {
  if (!process.env.OPENAI_API_KEY) {
    sendJson(res, 500, {
      error: "OPENAI_API_KEY manquant. Ajoute ta clé dans l'environnement puis relance le serveur."
    });
    return;
  }

  try {
    const { messages = [] } = await readRequestJson(req);
    const input = messages.map((message) => ({
      role: message.role === "assistant" ? "assistant" : "user",
      content: String(message.content || "")
    }));

    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
        instructions: [
          "Tu es ELEC.AI, un assistant francais specialise dans l'electricite domestique.",
          "Aide l'utilisateur a comprendre les causes possibles, les verifications simples et les prochaines etapes.",
          "Organise toujours tes reponses avec des titres courts et des listes lisibles.",
          "Structure recommandee: Resume rapide, Securite, Causes possibles, A verifier sans danger, Prochaines etapes, Conclusion.",
          "Evite les gros paragraphes. Fais une idee par ligne ou par puce.",
          "Adapte le niveau de detail au niveau demande par l'utilisateur: debutant, confirme ou expert.",
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
          "Tu es ELEC.AI, un assistant francais specialise dans l'electricite domestique.",
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
          "Tu es ELEC.AI, un assistant francais specialise dans l'electricite domestique.",
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

async function serveStatic(req, res) {
  const rawPath = req.url === "/" ? "/index.html" : req.url.split("?")[0];
  const safePath = normalize(rawPath).replace(/^(\.\.[/\\])+/, "");
  const filePath = join(publicDir, safePath);

  try {
    const file = await readFile(filePath);
    res.writeHead(200, { "Content-Type": mimeTypes[extname(filePath)] || "application/octet-stream" });
    res.end(file);
  } catch {
    res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
    res.end("Page introuvable");
  }
}

createServer(async (req, res) => {
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

  if (req.method === "GET") {
    await serveStatic(req, res);
    return;
  }

  res.writeHead(405, { "Content-Type": "text/plain; charset=utf-8" });
  res.end("Méthode non autorisée");
}).listen(port, () => {
  console.log(`ELEC.AI chat site: http://localhost:${port}`);
});
