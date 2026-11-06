"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const vm = require("node:vm");
const path = require("node:path");

const source = fs.readFileSync(
  path.join(__dirname, "../app/src/main/assets/database.js"),
  "utf8"
);
const context = { window: {} };
vm.runInNewContext(source, context);
const database = context.window.MEDORA_DATABASE;

test("offline medication catalog contains 32 unique, well-formed products", () => {
  assert.equal(Array.isArray(database.drugs), true);
  assert.equal(database.drugs.length, 32);
  const names = database.drugs.map((entry) => entry[0]);
  assert.equal(new Set(names).size, names.length);
  for (const entry of database.drugs) {
    assert.equal(entry.length, 5);
    for (const value of entry) assert.equal(typeof value, "string");
    assert.ok(entry[0].trim().length > 0);
    assert.ok(entry[1].trim().length > 0);
    assert.ok(entry[2].trim().length > 0);
    assert.ok(["active", "excluded"].includes(entry[4]));
  }
});

test("requested pediatric medicine products remain in the offline catalog", () => {
  const names = new Set(database.drugs.map((entry) => entry[0]));
  for (const name of [
    "CTM (Chlorpheniramine)",
    "Oralit",
    "Ceftriaxone",
    "Cefotaxime",
    "Gentamicin",
    "Cendo Xitrol Tetes Mata",
    "Cendo Xitrol Salep Mata",
    "Erlamycetin Tetes Mata",
    "Erlamycetin Tetes Telinga",
    "Erlamycetin Salep Mata"
  ]) {
    assert.equal(names.has(name), true, name + " should be present");
  }
});

test("Domperidone remains excluded from pediatric dose calculation", () => {
  const domperidone = database.drugs.find((entry) => entry[0] === "Domperidone");
  assert.ok(domperidone);
  assert.equal(domperidone[4], "excluded");
});

test("every catalog medicine has an explicit structured, pending, or excluded profile status", () => {
  const coverage = database.metadata.medicineProfiles.coverage;
  assert.equal(Object.keys(coverage).length, database.drugs.length);
  for (const item of database.drugs) {
    const [name, , , , status] = item;
    assert.ok(["structured_profile", "pending_profile_review", "excluded"].includes(coverage[name]), name);
    if (status === "excluded") assert.equal(coverage[name], "excluded");
    else if (database.medicineProfiles[name]) assert.equal(coverage[name], "structured_profile");
    else assert.equal(coverage[name], "pending_profile_review");
  }
  assert.equal(Object.values(coverage).filter(x => x === "structured_profile").length, 16);
  assert.equal(Object.values(coverage).filter(x => x === "pending_profile_review").length, 15);
  assert.equal(Object.values(coverage).filter(x => x === "excluded").length, 1);
});
