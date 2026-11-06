"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const assets = path.join(__dirname, "../app/src/main/assets");
const html = fs.readFileSync(path.join(assets, "index.html"), "utf8");
const workspace = fs.readFileSync(path.join(assets, "module-workspace.js"), "utf8");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(assets, "database.js"), "utf8"), context);
const database = context.window.MEDORA_DATABASE;

test("clinical dashboard opens the offline medicine database panel", () => {
  assert.match(html, /id="medicineDatabasePanel"/);
  assert.match(html, /id="medicineDbSearch"/);
  assert.match(html, /id="medicineDbFilters"/);
  assert.match(html, /id="medicineDbList"/);
  assert.match(html, /id="medicineDbDetail"/);
  assert.match(html, /module-workspace\.js/);
  assert.match(workspace, /key === "drugs".*showMedicineDatabase\(\)/);
  assert.match(html, /body\.medicine-database-mode #medicineDatabasePanel\{display:block\}/);
  assert.match(html, /classList\.remove\("medical-mode","icd-mode","medicine-database-mode","module-workspace-mode"\)/);
});

test("medicine database renders all catalog entries and searches profile metadata", () => {
  assert.match(html, /const medicineCatalog = window\.MEDORA_DATABASE\.drugs/);
  assert.match(html, /const medicineProfiles = window\.MEDORA_DATABASE\.medicineProfiles/);
  assert.match(html, /profile\.activeIngredient/);
  assert.match(html, /profile\.dosageForms/);
  assert.match(html, /p\.keyWarnings/);
  assert.match(html, /medicineCatalog\.filter/);
  assert.equal(database.drugs.length, 32);
  assert.equal(Object.keys(database.medicineProfiles).length, 16);
});

test("medicine detail escapes dynamic catalog and profile text before rendering", () => {
  assert.match(html, /function escapeHTML\(/);
  assert.match(html, /escapeHTML\(p\.formulationNote\)/);
  assert.match(html, /p\.keyWarnings\.map\(x=>'<li>'\+escapeHTML\(x\)/);
  assert.match(html, /escapeHTML\(ingredient\)/);
});

test("database UI does not fabricate dosing for profiles without a dose-engine function", () => {
  assert.match(html, /Belum tersedia kalkulator dosis tervalidasi untuk produk ini/);
  assert.match(html, /Tersambung ke fungsi kalkulator dosis:/);
  for (const name of [
    "Cendo Xitrol Tetes Mata", "Cendo Xitrol Salep Mata",
    "Erlamycetin Tetes Mata", "Erlamycetin Tetes Telinga", "Erlamycetin Salep Mata"
  ]) {
    assert.equal(database.medicineProfiles[name].doseEngineFunction, null, name);
  }
});

test("medicine detail displays field-level source provenance and pending verification labels", () => {
  assert.match(html, /p\.provenance\|\|\{\}/);
  assert.match(html, /Asal data & status verifikasi/);
  assert.match(html, /Perlu verifikasi produk/);
  assert.match(html, /sourceRegistry\[id\]/);
});

test("medicine database shows exact profile coverage and pending verification state", () => {
  assert.match(html, /medicineCoverage = window\.MEDORA_DATABASE\.metadata\.medicineProfiles\?\.coverage/);
  assert.match(html, /profil terstruktur/);
  assert.match(html, /menunggu verifikasi/);
  assert.match(html, /batas usia, dan peringatan belum boleh dianggap tervalidasi/);
});
