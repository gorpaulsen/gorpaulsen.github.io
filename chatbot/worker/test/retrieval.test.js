import test from "node:test";
import assert from "node:assert/strict";
import { retrieve, terms } from "../src/retrieval.js";
import { SOURCES } from "../src/sources.js";

test("pilotkorpus består av 11 tydelig merkede disposisjoner", () => {
  assert.equal(SOURCES.length, 11);
  assert.ok(SOURCES.every(s => s.status.includes("ikke fagfellevurdert") && s.url.startsWith("/artikler/")));
});
test("norsk bøyning og tegnsett gir søkbare termer", () => {
  assert.ok(terms("Muskelskade og muskelvekst").includes("muskelskade"));
  assert.ok(terms("utholdenhet").includes("utholdenhet"));
});
test("tretthet gir korrekt artikkel", () => {
  assert.equal(retrieve("Hva er tretthet?", SOURCES)[0]?.id, "tretthet");
});
test("spørsmål om skade finner relevant disposisjon", () => {
  const hits = retrieve("Er muskelskade nødvendig for muskelvekst?", SOURCES);
  assert.ok(hits.some(s => ["vevsskade-tilpasning","laktat-muskelskade"].includes(s.id)));
});
test("utenfor korpus gir tomt søkeresultat", () => {
  assert.equal(retrieve("Hvem er presidenten i Frankrike?", SOURCES).length, 0);
});
test("tomme spørsmål og stoppord returnerer ingen kilde", () => {
  assert.equal(retrieve("og det er en", SOURCES).length, 0);
});
