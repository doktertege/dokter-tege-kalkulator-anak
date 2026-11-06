"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");

const source = fs.readFileSync(
  require("node:path").join(__dirname, "../app/src/main/assets/database.js"),
  "utf8"
);
const context = { window: {} };
vm.runInNewContext(source, context);

const database = context.window.MEDORA_DATABASE;

test("offline database declares the expected WHO ICD-10 source version", () => {
  assert.equal(database.metadata.icd10.system, "WHO ICD-10");
  assert.equal(database.metadata.icd10.version, "2010");
});

test("ICD-10 quick-reference catalog contains 99 well-formed unique entries", () => {
  assert.equal(Array.isArray(database.icd10), true);
  assert.equal(database.icd10.length, 99);
  const codes = database.icd10.map((entry) => entry[0]);
  assert.equal(new Set(codes).size, codes.length);
  for (const entry of database.icd10) {
    assert.equal(entry.length, 3);
    assert.match(entry[0], /^[A-Z][0-9]{2}(?:\.[0-9A-Z]{1,2})?$/);
    assert.ok(entry[1].trim().length > 0);
    assert.ok(entry[2].trim().length > 0);
  }
});

test("high-yield WHO ICD-10 codes and corrected chest-pain code are present", () => {
  const codes = new Set(database.icd10.map((entry) => entry[0]));
  for (const code of ["R07.4", "A15.0", "I64", "K35.9", "N10", "G51.0", "S06.0"]) {
    assert.equal(codes.has(code), true, code + " should be present");
  }
  assert.equal(codes.has("R07.9"), false);
  assert.equal(codes.has("R11"), true);
  assert.equal(codes.has("R11.2"), false);
  const nausea = database.icd10.find((entry) => entry[0] === "R11");
  assert.equal(nausea[1], "Mual dan muntah");
});
