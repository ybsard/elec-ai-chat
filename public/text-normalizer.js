function normalizeVisibleText(value) {
  let text = String(value ?? "");
  const replacements = [
    ["Ã©", "é"],
    ["Ã¨", "è"],
    ["Ãª", "ê"],
    ["Ã«", "ë"],
    ["Ã ", "à"],
    ["Ã¢", "â"],
    ["Ã®", "î"],
    ["Ã¯", "ï"],
    ["Ã´", "ô"],
    ["Ã¶", "ö"],
    ["Ã¹", "ù"],
    ["Ã»", "û"],
    ["Ã¼", "ü"],
    ["Ã§", "ç"],
    ["Ã‰", "É"],
    ["ÃƒÂ©", "é"],
    ["ÃƒÂ¨", "è"],
    ["ÃƒÂª", "ê"],
    ["ÃƒÂ«", "ë"],
    ["ÃƒÂ ", "à"],
    ["ÃƒÂ¢", "â"],
    ["ÃƒÂ®", "î"],
    ["ÃƒÂ¯", "ï"],
    ["ÃƒÂ´", "ô"],
    ["ÃƒÂ¶", "ö"],
    ["ÃƒÂ¹", "ù"],
    ["ÃƒÂ»", "û"],
    ["ÃƒÂ¼", "ü"],
    ["ÃƒÂ§", "ç"],
    ["Ãƒâ€°", "É"],
    ["â‚¬", "€"],
    ["â€¢", "•"],
    ["Â«", "«"],
    ["Â»", "»"],
    ["Â :", " :"],
    ["Â ?", " ?"],
    ["Â !", " !"],
    ["Â;", ";"],
    ["Â·", "·"],
    ["Â", ""]
  ];

  for (const [from, to] of replacements) {
    text = text.replaceAll(from, to);
  }

  return text;
}

function normalizeNodeText(root) {
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const nodes = [];

  while (walker.nextNode()) {
    nodes.push(walker.currentNode);
  }

  nodes.forEach((node) => {
    const normalized = normalizeVisibleText(node.nodeValue);
    if (normalized !== node.nodeValue) {
      node.nodeValue = normalized;
    }
  });
}

function normalizeAttributes(root) {
  root.querySelectorAll("[title], [aria-label], input[placeholder], textarea[placeholder], img[alt], meta[name='description']").forEach((element) => {
    ["title", "aria-label", "placeholder", "alt", "content"].forEach((attribute) => {
      if (!element.hasAttribute(attribute)) return;
      const value = element.getAttribute(attribute);
      const normalized = normalizeVisibleText(value);
      if (normalized !== value) {
        element.setAttribute(attribute, normalized);
      }
    });
  });
}

function normalizeDocumentText() {
  document.title = normalizeVisibleText(document.title);
  normalizeNodeText(document.body);
  normalizeAttributes(document);
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", normalizeDocumentText, { once: true });
} else {
  normalizeDocumentText();
}
