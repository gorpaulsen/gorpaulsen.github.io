import test from "node:test";
import assert from "node:assert/strict";
import { mock } from "node:test";
import worker from "../src/index.js";

const origin = "http://localhost:8000";
const env = () => ({
  ALLOWED_ORIGIN: origin,
  OPENAI_API_KEY: "unit-test-only",
  OPENAI_MODEL: "gpt-4.1-mini",
  RATE_LIMITER: { limit: async () => ({ success: true }) }
});
function request(question, overrides = {}) {
  return new Request("http://localhost:8787/chat", {
    method: "POST",
    headers: { "Origin": origin, "Content-Type": "application/json" },
    body: JSON.stringify({ question, mode: "kort" }),
    ...overrides
  });
}

test("helse-endepunktet rapporterer ikke om samtaleinnhold", async () => {
  const r = await worker.fetch(new Request("http://localhost:8787/health"), env());
  assert.equal(r.status, 200);
  assert.equal((await r.json()).service, "niv-chatbot-pilot");
});
test("ukjent opphav avvises", async () => {
  const r = await worker.fetch(request("Hva er tretthet?", {
    headers: { "Origin": "https://not-allowed.example", "Content-Type": "application/json" }
  }), env());
  assert.equal(r.status, 403);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), null);
});
test("preflight returnerer kontrollert CORS", async () => {
  const r = await worker.fetch(new Request("http://localhost:8787/chat", {
    method: "OPTIONS", headers: { "Origin": origin }
  }), env());
  assert.equal(r.status, 204);
  assert.equal(r.headers.get("Access-Control-Allow-Origin"), origin);
});
test("spørsmål uten treff avvises uten modell", async () => {
  const r = await worker.fetch(request("Hvem er presidenten i Frankrike?"), env());
  assert.equal(r.status, 200);
  const data = await r.json();
  assert.equal(data.evidenceStatus, "insufficient");
  assert.equal(data.sources.length, 0);
});
test("pilot krever konfigurert rate-limit-binding", async () => {
  const cfg = env(); delete cfg.RATE_LIMITER;
  const r = await worker.fetch(request("Hva er tretthet?"), cfg);
  assert.equal(r.status, 503);
});
test("rate-limit stopper videre kall", async () => {
  const cfg = env(); cfg.RATE_LIMITER.limit = async () => ({ success: false });
  const r = await worker.fetch(request("Hva er tretthet?"), cfg);
  assert.equal(r.status, 429);
});
test("modellsvaret må referere til hentet kilde", async () => {
  const stub = mock.method(globalThis, "fetch", async () => new Response(
    JSON.stringify({ output: [{ content: [{ type: "output_text", text: "Disposisjonen skiller ulike former for tretthet [1]." }] }] }),
    { status: 200, headers: { "Content-Type": "application/json" } }
  ));
  try {
    const r = await worker.fetch(request("Hva er tretthet?"), env());
    assert.equal(r.status, 200);
    const answer = await r.json();
    assert.equal(answer.evidenceStatus, "draft_only");
    assert.equal(answer.sources[0].status.includes("ikke fagfellevurdert"), true);
    const apiCall = JSON.parse(stub.mock.calls[0].arguments[1].body);
    assert.equal(apiCall.store, false);
  } finally { stub.mock.restore(); }
});
test("falske kildehenvisninger avvises", async () => {
  const stub = mock.method(globalThis, "fetch", async () => new Response(
    JSON.stringify({ output: [{ content: [{ type: "output_text", text: "Dette er konklusjonen [99]." }] }] }),
    { status: 200 }
  ));
  try {
    const r = await worker.fetch(request("Hva er tretthet?"), env());
    assert.equal(r.status, 502);
  } finally { stub.mock.restore(); }
});
