"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const assets = path.join(__dirname, "../app/src/main/assets");
const html = fs.readFileSync(path.join(assets, "index.html"), "utf8");
const workspace = fs.readFileSync(path.join(assets, "module-workspace.js"), "utf8");

test("all clinical dashboard menu entries route to a working module", () => {
  for (const key of ["guides", "emergency", "ai", "references"]) {
    assert.match(html, new RegExp('data-module="' + key + '"'));
    assert.match(workspace, new RegExp('^\\s*' + key + ':', "m"));
  }
  assert.match(html, /id="moduleWorkspace"/);
  assert.match(html, /module-workspace\.js/);
  assert.match(workspace, /function showWorkspace\(key\)/);
  assert.doesNotMatch(html, /sedang dalam tahap pengembangan/);
});

test("clinical guide and emergency modules contain actionable offline checklists", () => {
  assert.match(workspace, /Penilaian awal pasien: ABCDE/);
  assert.match(workspace, /Serah terima SBAR/);
  assert.match(workspace, /type="checkbox"/);
  assert.match(workspace, /Dokumentasi rujukan/);
});

test("offline clinical assistant builds, clears and copies a SOAP note without claiming AI diagnosis", () => {
  assert.match(html, /Asisten Klinis Offline/);
  assert.match(workspace, /id="buildSoap"/);
  assert.match(workspace, /id="clearSoap"/);
  assert.match(workspace, /id="copySoap"/);
  assert.match(workspace, /CATATAN KLINIS MEDORA/);
  assert.match(workspace, /Tidak menganalisis diagnosis/);
});

test("medical references provide direct links and explain internet requirement", () => {
  assert.match(workspace, /https:\/\/www\.who\.int\/publications/);
  assert.match(workspace, /https:\/\/www\.kemkes\.go\.id/);
  assert.match(workspace, /https:\/\/www\.idai\.or\.id/);
  assert.match(workspace, /Membuka tautan memerlukan koneksi internet/);
});

test("settings can back up, restore and clear local favorites and dose history", () => {
  assert.match(workspace, /id="copyLocalBackup"/);
  assert.match(workspace, /id="restoreLocalBackup"/);
  assert.match(workspace, /id="clearLocalHistory"/);
  assert.match(workspace, /id="clearLocalFavorites"/);
  assert.match(workspace, /backup\.app !== "MEDORA"/);
  assert.match(workspace, /updateLocalDataSummary/);
});

test("settings navigation opens the workspace instead of a development alert", () => {
  assert.match(workspace, /\$\("navSettings"\)\.addEventListener/);
  assert.match(workspace, /showWorkspace\("settings"\)/);
  assert.doesNotMatch(html, /Pengaturan MEDORA sedang dalam tahap pengembangan/);
});
