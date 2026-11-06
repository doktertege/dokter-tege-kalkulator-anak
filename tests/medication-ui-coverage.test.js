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

  assert.equal(uncovered.length, 0, "uncovered active medicines: " + uncovered.join(", "));
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


test("Erlamycetin topical guides do not show unverified strengths or dosing regimens", () => {
  const source = getOpenDrugSource();
  const topicalBlock = source.match(/const topicalGuides=\{([\s\S]*?)\n\};/);
  assert.ok(topicalBlock, "topical guide map should be present");
  for (const name of [
    "Erlamycetin Tetes Mata",
    "Erlamycetin Tetes Telinga",
    "Erlamycetin Salep Mata"
  ]) {
    const start = topicalBlock[1].indexOf('"' + name + '":');
    assert.ok(start >= 0, name + " guide should exist");
    const next = topicalBlock[1].indexOf(',\n"', start);
    const guide = topicalBlock[1].slice(start, next < 0 ? undefined : next);
    assert.match(guide, /profil produk belum terverifikasi/i, name);
    assert.match(guide, /Dosis, frekuensi, dan durasi tidak ditampilkan/i, name);
    assert.doesNotMatch(guide, /kloramfenikol|0,5%|1%|mg\/mL|mg\/g|\d+\s*(?:tetes|kali sehari|cm)/i, name);
  }
});


test("Cendo Xitrol eye ointment guide does not assume unverified composition or dosing", () => {
  const source = getOpenDrugSource();
  const topicalBlock = source.match(/const topicalGuides=\{([\s\S]*?)\n\};/);
  assert.ok(topicalBlock, "topical guide map should be present");
  const start = topicalBlock[1].indexOf('"Cendo Xitrol Salep Mata":');
  assert.ok(start >= 0, "Cendo Xitrol ointment guide should exist");
  const guide = topicalBlock[1].slice(start);
  assert.match(guide, /profil produk belum terverifikasi/i);
  assert.match(guide, /Dosis, frekuensi, dan durasi tidak ditampilkan/i);
  assert.doesNotMatch(guide, /deksametason|neomisin|polimiksin|0,1%|mg\/g|\d+\s*(?:kali sehari|cm)/i);
});


test("gentamicin volume calculator requires the actual ampoule concentration", () => {
  const source = getOpenDrugSource();
  const start = source.indexOf('if(name==="Gentamicin"){');
  const end = source.indexOf('\nif(name===', start + 10);
  assert.ok(start >= 0, "gentamicin calculator should exist");
  const guide = source.slice(start, end < 0 ? undefined : end);
  assert.match(guide, /id="gentamicinStrength" type="number"/);
  assert.match(guide, /Konsentrasi pada etiket \(mg\/mL\)/i);
  assert.match(guide, /Masukkan konsentrasi persis dari ampul/i);
  assert.doesNotMatch(guide, /80 mg\/2 mL|20 mg\/2 mL|value="40"|value="10"/i);
});


test("injectable cephalosporin guides do not assume product-specific reconstitution volumes", () => {
  const source = getOpenDrugSource();
  for (const [name, marker] of [
    ["Ceftriaxone", "Volume rekonstitusi tidak dihitung"],
    ["Cefotaxime", "Volume rekonstitusi tidak ditampilkan"]
  ]) {
    const start = source.indexOf('if(name==="' + name + '"){');
    const end = source.indexOf('\nif(name===', start + 10);
    assert.ok(start >= 0, name + " calculator should exist");
    const guide = source.slice(start, end < 0 ? undefined : end);
    assert.match(guide, new RegExp(marker, "i"), name);
    assert.doesNotMatch(guide, /mL\s*\/\s*vial|reconstituted concentration\s*=/i, name);
  }
});


test("CTM volume calculator requires the actual product strength from its label", () => {
  const source = getOpenDrugSource();
  const start = source.indexOf('if(name==="CTM (Chlorpheniramine)"){');
  const end = source.indexOf('\nif(name===', start + 10);
  assert.ok(start >= 0, "CTM calculator should exist");
  const guide = source.slice(start, end < 0 ? undefined : end);
  assert.match(guide, /id="ctmStrength" type="number"/);
  assert.match(guide, /Kekuatan pada etiket \(mg\/5 mL\)/i);
  assert.match(guide, /Masukkan kekuatan persis dari kemasan/i);
  assert.doesNotMatch(guide, /2 mg\/5 mL|4 mg\/5 mL|immediate-release/i);
});
