"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const databaseSource = fs.readFileSync(
  path.join(__dirname, "../app/src/main/assets/database.js"),
  "utf8"
);
const html = fs.readFileSync(
  path.join(__dirname, "../app/src/main/assets/index.html"),
  "utf8"
);
const context = { window: {} };
vm.runInNewContext(databaseSource, context);
const database = context.window.MEDORA_DATABASE;

function getOpenDrugSource() {
  const start = html.indexOf("function openDrug(");
  const end = html.indexOf('$("close").addEventListener', start);
  assert.ok(start >= 0 && end > start, "openDrug function should be present");
  return html.slice(start, end);
}

test("every active catalog medicine has a detail handler or a dedicated topical guide", () => {
  const source = getOpenDrugSource();
  const handlers = new Set(
    [...source.matchAll(/name===["']([^"']+)["']/g)].map((match) => match[1])
  );
  const topicalBlock = source.match(/const topicalGuides=\{([\s\S]*?)\n\};/);
  assert.ok(topicalBlock, "topical guide map should be present");
  const topicalGuides = new Set(
    [...topicalBlock[1].matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1])
  );

  const uncovered = database.drugs
    .filter((entry) => entry[4] === "active")
    .map((entry) => entry[0])
    .filter((name) => !handlers.has(name) && !topicalGuides.has(name));

  assert.deepEqual(uncovered, []);
});

test("all requested eye and ear products use dedicated safety guidance, not dose calculators", () => {
  const source = getOpenDrugSource();
  const topicalBlock = source.match(/const topicalGuides=\{([\s\S]*?)\n\};/);
  assert.ok(topicalBlock, "topical guide map should be present");
  const topicalGuides = new Set(
    [...topicalBlock[1].matchAll(/^\s*"([^"]+)":/gm)].map((match) => match[1])
  );

  for (const name of [
    "Cendo Xitrol Tetes Mata",
    "Cendo Xitrol Salep Mata",
    "Erlamycetin Tetes Mata",
    "Erlamycetin Tetes Telinga",
    "Erlamycetin Salep Mata"
  ]) {
    assert.ok(database.drugs.some((entry) => entry[0] === name), name + " should be catalogued");
    assert.ok(topicalGuides.has(name), name + " should have dedicated guidance");
  }
});
