import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import worker from "../src/index.js";

const origin = "http://localhost:8000";
const env = () => ({
  PILOT_MODE: "local",
  ALLOWED_ORIGIN: origin,
  OPENAI_API_KEY: "unit-test-only",
  OPENAI_MODEL: "gpt-6-luna",
  RATE_LIMITER: { limit: async () => ({ success: true }) }
});
function request(question, overrides = {}) {
  return new Request("http://localhost:8787/chat", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ question, mode: "kort" }),
    ...overrides
  });
}
function modelAnswer(points = [{
  kind: "definisjon",
  text: "Disposisjonen skiller opplevd tretthet fra reduksjon i prestasjon.",
  source_ids: [1]
}], status = "answer") {
  return { status: "completed", output: [{ content: [{
    type: "output_text",
    text: JSON.stringify({
      status,
      points,
      limitations: "Dette er kun en faglig disposisjon, ikke originalpublikasjoner kontrollert i en systematisk gjennomgang."
    })
  }] }] };
}
function withModel(result, fn) {
  const stub = mock.method(globalThis, "fetch", async () => new Response(
    JSON.stringify(result), { status: 200, headers: { "Content-Type": "application/json" } }
  ));
  return Promise.resolve().then(() => fn(stub)).finally(() => stub.mock.restore());
}

test("lokal health viser tjenestens konfigurasjon", async () => {
  const r = await worker.fetch(new Request("http://localhost:8787/health"), env());
  assert.equal(r.status, 200);
  assert.equal((await r.json()).service, "niv-chatbot-pilot");
});
test("remote worker host avvises selv om origin og mode er lokal", async () => {
  const r = await worker.fetch(request("Hva er tretthet?", {
    // Request-konstruktørens URL kan ikke overskrives: lag nytt request direkte
  }), { ...env(), PILOT_MODE: "disabled" });
  assert.equal(r.status, 403);
  const remote = await worker.fetch(new Request("https://niv-test.workers.dev/chat", {
    method: "POST",
    headers: { Origin: origin, "Content-Type": "application/json" },
    body: JSON.stringify({ question: "Hva er tretthet?" })
  }), env());
  assert.equal(remote.status, 403);
});
test("ukjent origin avvises", async () => {
  const r = await worker.fetch(request("Hva er tretthet?", {
    headers: { Origin: "https://evil.example", "Content-Type": "application/json" }
  }), env());
  assert.equal(r.status, 403);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), null);
});
test("lokal CORS-preflight fungerer", async () => {
  const r = await worker.fetch(new Request("http://localhost:8787/chat", {
    method: "OPTIONS", headers: { Origin: origin }
  }), env());
  assert.equal(r.status, 204);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), origin);
});
test("spørsmål uten relevante treff bruker ikke OpenAI", async () => {
  const r = await worker.fetch(request("Hvem er presidenten i Frankrike?"), env());
  assert.equal(r.status, 200);
  const data = await r.json();
  assert.equal(data.evidenceStatus, "insufficient");
  assert.equal(data.sources.length, 0);
});
test("manglende rate-limit binder gir 503", async () => {
  const cfg = env();
  delete cfg.RATE_LIMITER;
  assert.equal((await worker.fetch(request("Hva er tretthet?"), cfg)).status, 503);
});
test("rate-limit avviser med 429", async () => {
  const cfg = env();
  cfg.RATE_LIMITER.limit = async () => ({ success: false });
  assert.equal((await worker.fetch(request("Hva er tretthet?"), cfg)).status, 429);
});
test("gyldig format gir kun kilder brukt i konkrete påstander", async () => {
  await withModel(modelAnswer(), async (stub) => {
    const r = await worker.fetch(request("Hva er tretthet?"), env());
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.evidenceStatus, "draft_only");
    assert.equal(data.sources.length, 1);
    assert.equal(data.sources[0].number, 1);
    assert.match(data.answer, /Definisjon:/);
    assert.match(data.answer, /\[1\]/);
    assert.match(data.answer, /Begrensninger:/);
    const body = JSON.parse(stub.mock.calls[0].arguments[1].body);
    assert.equal(body.store, false);
    assert.equal(body.model, "gpt-6-luna");
    assert.equal(body.text.format.type, "json_schema");
    assert.equal(body.text.format.strict, true);
  });
});
test("modell som avstår fra svar gir kildebasert utilstrekkelig-status", async () => {
  await withModel(modelAnswer([], "insufficient"), async () => {
    const r = await worker.fetch(request("Hva er tretthet?"), env());
    assert.equal(r.status, 200);
    const data = await r.json();
    assert.equal(data.evidenceStatus, "insufficient");
    assert.deepEqual(data.sources, []);
  });
});
test("oppdiktet kildenummer blokkeres", async () => {
  const bad = modelAnswer([{
    kind: "fortolkning", text: "Det er dokumentert at dette alltid gjelder.",
    source_ids: [99]
  }]);
  await withModel(bad, async () => {
    assert.equal((await worker.fetch(request("Hva er tretthet?"), env())).status, 502);
  });
});
test("påstander uten kilder blokkeres", async () => {
  const bad = modelAnswer([{
    kind: "observasjon", text: "Disposisjonen viser en målt endring i prestasjon.",
    source_ids: []
  }]);
  await withModel(bad, async () => {
    assert.equal((await worker.fetch(request("Hva er tretthet?"), env())).status, 502);
  });
});
test("ufullstendig modellrespons blokkeres", async () => {
  await withModel({ ...modelAnswer(), status: "incomplete" }, async () => {
    assert.equal((await worker.fetch(request("Hva er tretthet?"), env())).status, 502);
  });
});
test("ugyldig format blokkeres", async () => {
  await withModel({ status: "completed", output: [{ content: [{ type: "output_text", text: "Uverifisert svar [1]" }] }] }, async () => {
    assert.equal((await worker.fetch(request("Hva er tretthet?"), env())).status, 502);
  });
});
test("lange spørsmål avvises", async () => {
  const r = await worker.fetch(request("tretthet ".repeat(100)), env());
  assert.equal(r.status, 400);
});
