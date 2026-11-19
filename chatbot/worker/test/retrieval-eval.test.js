import test from "node:test";
import assert from "node:assert/strict";
import { retrieve } from "../src/retrieval.js";
import { SOURCES } from "../src/sources.js";
import { CASES } from "./retrieval-cases.js";

test("alle 24 manuelle søkecasene følger pilotens planlagte dekningsgrense", () => {
  const errors = [];
  for (const {question,expectedId} of CASES) {
    const hits = retrieve(question,SOURCES,3).map(s => s.id);
    if (expectedId && !hits.includes(expectedId)) errors.push({question,expectedId,hits});
    if (!expectedId && hits.length) errors.push({question,expectedId,hits});
  }
  assert.deepEqual(errors, []);
});
