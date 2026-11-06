"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");

const assets = path.join(__dirname, "../app/src/main/assets");
const html = fs.readFileSync(path.join(assets, "index.html"), "utf8");
const workspace = fs.readFileSync(path.join(assets, "module-workspace.js"), "utf8");

test("all clinical dashboard menu entries route to a working module", () => {
  for (const key of ["calculator", "medical", "icd", "guides", "emergency", "drugs", "ai", "references", "integrated", "ultrasound", "laboratory", "records", "anthropometry", "vitals"]) {
    assert.match(html, new RegExp('data-module="' + key + '"'));
  }
  for (const key of ["guides", "emergency", "ai", "references", "integrated", "ultrasound", "laboratory", "records", "anthropometry", "vitals"]) {
    assert.match(workspace, new RegExp('^\\s*' + key + ':', "m"));
  }
  assert.match(workspace, /key === "calculator".*showCalculator\(\)/);
  assert.match(workspace, /key === "medical".*showMedical\(\)/);
  assert.match(workspace, /key === "icd".*showIcd\(\)/);
  assert.match(workspace, /key === "drugs".*showMedicineDatabase\(\)/);
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

test("startup storage loading filters unknown favorites and malformed dose history", () => {
  assert.match(html, /const validDrugNames=new Set\(data\.map\(item=>item\[0\]\)\)/);
  assert.match(html, /savedFavorites\.filter\(name=>typeof name==="string"&&validDrugNames\.has\(name\)\)/);
  assert.match(html, /validDrugNames\.has\(h\.drug\)/);
  assert.match(html, /Number\(h\.weight\)>0&&Number\(h\.weight\)<=100/);
  assert.match(html, /h\.age\.length<=40/);
  assert.match(html, /h\.date\.length<=80/);
  assert.match(html, /h\.result\.length<=1200/);
  assert.match(html, /slice\(0,50\)/);
});

test("backup restore rejects unknown medicines, invalid weights, and oversized history payloads", () => {
  assert.match(workspace, /const catalogNames = new Set\(\(window\.MEDORA_DATABASE\?\.drugs \|\| \[\]\)\.map\(item => item\[0\]\)\)/);
  assert.match(workspace, /catalogNames\.has\(item\)/);
  assert.match(workspace, /Number\(item\.weight\) <= 0 \|\| Number\(item\.weight\) > 100/);
  assert.match(workspace, /backup\.doseHistory\.length > 50/);
  assert.match(workspace, /item\.age\.length > 40/);
  assert.match(workspace, /item\.date\.length > 80/);
  assert.match(workspace, /item\.result\.length > 1200/);
  assert.match(workspace, /Daftar favorit berisi nama obat yang tidak dikenal/);
  assert.match(workspace, /Isi riwayat backup tidak valid atau di luar batas MEDORA/);
});

test("settings navigation opens the workspace instead of a development alert", () => {
  assert.match(workspace, /\$\("navSettings"\)\.addEventListener/);
  assert.match(workspace, /showWorkspace\("settings"\)/);
  assert.doesNotMatch(html, /Pengaturan MEDORA sedang dalam tahap pengembangan/);
});

test("public health area exposes searchable, filterable articles with working detail navigation", () => {
  assert.match(html, /id="publicSearch"/);
  assert.match(html, /id="publicFilters"/);
  assert.match(html, /id="publicArticles"/);
  assert.match(html, /id="publicDetailBack"/);
  assert.match(html, /body\.public-mode \.bottomNav\{display:none\}/);
  assert.match(html, /function showPublicHome\(\)/);\n  assert.match(html, /document\.body\.classList\.add\("public-mode"\)/);
  assert.match(html, /\$\("publicSearch"\)\.addEventListener\("input",drawPublicArticles\)/);
  assert.match(html, /openPublicArticle\(b\.dataset\.article\)/);
  assert.match(html, /drawPublicArticles\(\)/);
});

test("bottom navigation exposes only home and settings destinations", () => {
  const start = html.indexOf('<nav class="bottomNav">');
  const end = html.indexOf("</nav>", start);
  assert.ok(start >= 0 && end > start);
  const nav = html.slice(start, end);
  assert.ok(nav.includes('id="navHome"'));
  assert.ok(nav.includes('id="navSettings"'));
  assert.ok(!/navSearch|navFavorites|navHistory/.test(nav));
  assert.ok(html.includes('$("navHome").addEventListener("click"'));
  assert.ok(workspace.includes('$("navSettings").addEventListener("click"'));
});
