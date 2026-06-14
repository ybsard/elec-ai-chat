import assert from "node:assert/strict";
import { test } from "node:test";

process.env.NODE_ENV = "test";

const {
  assertSupportedImageDataUrl,
  clearAnswerInstructions,
  estimateClimateSizing,
  highRiskOperationalReply,
  isHighRiskOperationalRequest,
  normalizeSourceUrl,
  requestedDetailLevel
} = await import("../server.js");

test("blocks dangerous operational wiring requests", () => {
  const messages = [
    {
      role: "user",
      content: "Comment brancher rapidement une prise dans la salle de bain en repiquant sur le circuit lumiere ? Donne les couleurs phase neutre terre."
    }
  ];

  assert.equal(isHighRiskOperationalRequest(messages), true);
  assert.match(highRiskOperationalReply(messages), /Je ne peux pas fournir/i);
  assert.match(highRiskOperationalReply(messages), /Ne réalise pas|Ne rÃ©alise pas/i);
});

test("does not block legitimate sizing questions", () => {
  const messages = [
    {
      role: "user",
      content: "Je veux installer une borne de recharge IRVE 7,4 kW. Quels facteurs verifier pour la section de cable et le differentiel ?"
    }
  ];

  assert.equal(isHighRiskOperationalRequest(messages), false);
});

test("uses the latest user message for danger detection", () => {
  const messages = [
    {
      role: "user",
      content: "Comment brancher une prise dans une salle de bain sans couper le courant ?"
    },
    {
      role: "assistant",
      content: "Je refuse de fournir une procedure dangereuse."
    },
    {
      role: "user",
      content: "Finalement explique seulement pourquoi un differentiel 30 mA declenche quand le four chauffe."
    }
  ];

  assert.equal(isHighRiskOperationalRequest(messages), false);
});

test("normalizes only public http sources", () => {
  assert.equal(normalizeSourceUrl("https://example.com/page#top"), "https://example.com/page#top");
  assert.throws(() => normalizeSourceUrl("file:///etc/passwd"), /http ou https/);
  assert.throws(() => normalizeSourceUrl("http://127.0.0.1:3000"), /source publique/);
  assert.throws(() => normalizeSourceUrl("https://user:pass@example.com"), /identifiant/);
});

test("rejects unsupported or oversized data images", () => {
  assert.doesNotThrow(() => assertSupportedImageDataUrl("data:image/png;base64,aGVsbG8="));
  assert.throws(() => assertSupportedImageDataUrl("data:image/svg+xml;base64,PHN2Zy8+"), /format non support/);
  assert.throws(() => assertSupportedImageDataUrl(`data:image/png;base64,${"a".repeat(9_000_000)}`), /trop lourde/);
});

test("keeps answer contract focused on direct response", () => {
  const instructions = clearAnswerInstructions("la question test").join("\n");
  assert.match(instructions, /Réponse directe|RÃ©ponse directe/);
  assert.match(instructions, /exactement/);
});

test("detects expert detail level from conversation", () => {
  assert.equal(
    requestedDetailLevel([{ role: "user", content: "Niveau de reponse: expert\nAnalyse ce tableau." }]),
    "expert"
  );
});

test("estimates climate sizing with bounded numeric output", () => {
  const estimate = estimateClimateSizing({
    area: 30,
    height: 2.5,
    room: "Salon",
    insulation: "moyenne",
    sun: "normale",
    people: 2,
    heatSources: "normaux",
    region: "tempere"
  });

  assert.equal(estimate.area, 30);
  assert.equal(estimate.recommendedKw > 0, true);
  assert.equal(estimate.recommendedBtu > estimate.recommendedWatts, true);
});
