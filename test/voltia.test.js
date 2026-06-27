import assert from "node:assert/strict";
import { test } from "node:test";

process.env.NODE_ENV = "test";

const {
  assertSupportedImageDataUrl,
  clearAnswerInstructions,
  estimateClimateSizing,
  estimateLightingSizing,
  evaluatePedagogicalRestriction,
  extractObjectIdentity,
  highRiskOperationalReply,
  isHighRiskOperationalRequest,
  normalizeSourceUrl,
  normalizePedagogicalCode,
  pedagogicalBlockedReply,
  requestedDetailLevel,
  safetyMessagesForRequest,
  specialistQualityContract
} = await import("../server.js");

test("flags dangerous operational wiring requests without a generic refusal", () => {
  const messages = [
    {
      role: "user",
      content: "Comment brancher rapidement une prise dans la salle de bain en repiquant sur le circuit lumiere ? Donne les couleurs phase neutre terre."
    }
  ];

  assert.equal(isHighRiskOperationalRequest(messages), true);
  assert.doesNotMatch(highRiskOperationalReply(messages), /Je ne peux pas fournir/i);
  assert.match(highRiskOperationalReply(messages), /Je peux t'aider utilement/i);
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

test("does not confuse a generated schema explanation with a wiring request", () => {
  const messages = safetyMessagesForRequest({
    messages: [{ role: "user", content: "Explique ce schema avec ses calibres, bornes et protections." }],
    requestKind: "schema-explanation",
    safetyContext: "Cuisine, four 20 A, circuit dedie"
  });

  assert.equal(isHighRiskOperationalRequest(messages), false);
  assert.equal(messages[0].content, "Cuisine, four 20 A, circuit dedie");
});

test("keeps dangerous schema context blocked", () => {
  const messages = safetyMessagesForRequest({
    requestKind: "schema-explanation",
    safetyContext: "Comment brancher ce four sous tension avec phase neutre et terre ?"
  });

  assert.equal(isHighRiskOperationalRequest(messages), true);
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

test("defines domain specialist contracts for climate placement", () => {
  const contract = specialistQualityContract("climate-sizing").join("\n");

  assert.match(contract, /Spécialiste climatisation|SpÃ©cialiste climatisation/);
  assert.match(contract, /emplacement de l'unité intérieure|emplacement de l'unitÃ© intÃ©rieure/);
  assert.match(contract, /soufflage/);
  assert.match(contract, /sans donner de procédure de pose|sans donner de procÃ©dure de pose/);
});

test("estimates lighting from metric room dimensions", () => {
  const estimate = estimateLightingSizing({
    room: "Cuisine",
    dimensions: "4,2 x 3,1 m",
    type: "Spots encastres"
  });

  assert.equal(estimate.area, 13.02);
  assert.equal(estimate.targetLux, 400);
  assert.equal(estimate.pointCount >= 8, true);
  assert.equal(estimate.totalLumens > 5000, true);
});

test("extracts a recognized object for the notice workflow", () => {
  const identity = extractObjectIdentity(`
Objet reconnu
- Categorie: contacteur
- Marque: Schneider Electric
- Modele: Acti9 iCT
- Reference exacte: A9C20842
- Confiance: 92 %
  `);

  assert.deepEqual(identity, {
    category: "contacteur",
    brand: "Schneider Electric",
    model: "Acti9 iCT",
    reference: "A9C20842",
    confidence: "92 %"
  });
});

test("normalizes classroom invite codes", () => {
  assert.equal(normalizePedagogicalCode("vlt abcd"), "VLT-ABCD");
  assert.equal(normalizePedagogicalCode("VLT-2K9M"), "VLT-2K9M");
});

test("blocks teacher-selected pedagogical categories before AI", () => {
  const classroom = {
    name: "BTS ELEC 1",
    active: true,
    responseMode: "block",
    blockedCategories: ["assessments", "calculations"],
    customRules: ["transformateur triphasé"]
  };

  assert.equal(
    evaluatePedagogicalRestriction(classroom, {
      feature: "chat",
      text: "Donne-moi les réponses de ce contrôle de fin de module"
    }).blocked,
    true
  );
  assert.equal(
    evaluatePedagogicalRestriction(classroom, {
      feature: "climate-sizing",
      text: "dimensionnement d'une salle"
    }).category,
    "calculations"
  );
  assert.equal(
    evaluatePedagogicalRestriction(classroom, {
      feature: "chat",
      text: "Explique le fonctionnement du transformateur triphase"
    }).category,
    "custom"
  );
  assert.equal(
    evaluatePedagogicalRestriction(classroom, {
      feature: "chat",
      text: "Pourquoi un différentiel déclenche-t-il ?"
    }).blocked,
    false
  );
});

test("returns a pedagogical refusal without leaking an answer", () => {
  const reply = pedagogicalBlockedReply(
    {
      name: "CAP Électricité",
      responseMode: "guided",
      teacherMessage: "Montre d'abord ton raisonnement."
    },
    { reason: "contrôles, examens et évaluations" }
  );

  assert.match(reply, /cadre pédagogique/i);
  assert.match(reply, /Montre d'abord ton raisonnement/i);
  assert.match(reply, /méthode|indice/i);
});
