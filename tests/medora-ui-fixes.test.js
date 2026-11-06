"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { searchIcdRows } = require("../app/src/main/assets/icd-search.js");

const rows = [
  ["R50.9", "Demam, tidak spesifik", "Gejala"],
  ["R05", "Batuk", "Gejala"],
  ["J00", "Nasofaringitis akut (common cold)", "Respirasi"],
  ["J06.9", "Infeksi saluran napas atas akut, tidak spesifik", "Respirasi"],
  ["R19.7", "Diare, tidak spesifik", "Gejala"],
  ["A09", "Gastroenteritis dan kolitis lain yang diduga infeksi atau tidak spesifik", "Infeksi"],
  ["R06.0", "Dispnea", "Gejala"],
  ["R10.9", "Nyeri abdomen, tidak spesifik", "Gejala"],
  ["K30", "Dispepsia", "Penyakit dalam"],
  ["K29.7", "Gastritis, tidak spesifik", "Penyakit dalam"],
  ["N30.0", "Sistitis akut", "Urogenital"],
  ["N39.0", "Infeksi saluran kemih, lokasi tidak spesifik", "Penyakit dalam"],
  ["R07.4", "Nyeri dada, tidak spesifik", "Gejala"]
];

test("Indonesian lay complaint terms suggest relevant symptom codes", () => {
  for (const [query, expected] of [
    ["mencret", ["R19.7", "A09"]],
    ["sesak napas", ["R06.0"]],
    ["anyang-anyangan", ["N30.0", "N39.0"]],
    ["nyeri ulu hati", ["K30", "K29.7"]],
    ["dada sakit", ["R07.4"]]
  ]) {
    const actual = searchIcdRows(query, rows).map(item => item.row[0]);
    for (const code of expected) assert.ok(actual.includes(code), query + " should suggest " + code);
  }
});

test("multi-symptom free text returns separate relevant suggestions", () => {
  const actual = searchIcdRows("batuk pilek demam", rows).map(item => item.row[0]);
  assert.ok(actual.includes("R05"));
  assert.ok(actual.includes("J00"));
  assert.ok(actual.includes("R50.9"));
});

test("direct ICD diagnosis and code search remain supported", () => {
  assert.equal(searchIcdRows("R07.4", rows)[0].row[0], "R07.4");
  assert.equal(searchIcdRows("nyeri dada", rows)[0].row[0], "R07.4");
});

test("bottom navigation contains only Beranda and Pengaturan", () => {
  const html = fs.readFileSync(path.join(__dirname, "../app/src/main/assets/index.html"), "utf8");
  const nav = html.match(/<nav class="bottomNav">([\s\S]*?)<\/nav>/);
  assert.ok(nav, "bottom navigation exists");
  assert.match(nav[1], /id="navHome"/);
  assert.match(nav[1], /id="navSettings"/);
  assert.doesNotMatch(nav[1], /id="navSearch"|id="navFavorites"|id="navHistory"/);
});

test("settings workspace is not hidden by an inline display:none rule", () => {
  const html = fs.readFileSync(path.join(__dirname, "../app/src/main/assets/index.html"), "utf8");
  const workspace = fs.readFileSync(path.join(__dirname, "../app/src/main/assets/module-workspace.js"), "utf8");
  assert.match(html, /<section class="panel" id="moduleWorkspace">/);
  assert.match(workspace, /title: "Pengaturan MEDORA"/);
  assert.ok(workspace.includes("copyLocalBackup"));
  assert.ok(workspace.includes("restoreLocalBackup"));
});

test("drug cards reserve columns for medicine name, dose and action controls", () => {
  const html = fs.readFileSync(path.join(__dirname, "../app/src/main/assets/index.html"), "utf8");
  assert.match(html, /\.drug\{display:grid;grid-template-columns:68px minmax\(0,1fr\) 105px 30px 24px/);
  assert.match(html, /grid-template-columns:48px minmax\(0,1fr\) 82px 25px 20px/);
});
