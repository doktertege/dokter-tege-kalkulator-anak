"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const source = fs.readFileSync(
  path.join(__dirname, "../app/src/main/assets/module-workspace.js"),
  "utf8"
);

function makeElement() {
  const listeners = {};
  return {
    listeners,
    dataset: {},
    style: {},
    classList: {
      add() {},
      remove() {},
      toggle() {}
    },
    addEventListener(type, callback) {
      listeners[type] = callback;
    },
    click(event = {}) {
      if (listeners.click) return listeners.click(event);
    },
    innerHTML: "",
    textContent: "",
    value: ""
  };
}

function createHarness() {
  const elements = new Map();
  const document = {
    body: { classList: { add() {}, remove() {} } },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeElement());
      return elements.get(id);
    }
  };
  const calls = [];
  let copiedText = "";
  const window = {
    MEDORA_DATABASE: { drugs: [["Paracetamol"]] },
    scrollTo() {}
  };
  const context = {
    document,
    $: id => document.getElementById(id),
    window,
    console,
    showClinicalHome: () => calls.push("clinical"),
    showCalculator: () => calls.push("calculator"),
    showMedical: () => calls.push("medical"),
    showIcd: () => calls.push("icd"),
    showMedicineDatabase: () => calls.push("drugs"),
    setNavActive: () => {},
    favorites: new Set(),
    doseHistory: [],
    draw: () => {},
    saveFavorites: () => {},
    persistDoseHistory: () => {},
    renderDoseHistory: () => {},
    copyTextToClipboard: async text => { copiedText = text; },
    confirm: () => true
  };
  vm.runInNewContext(source, context);
  return { elements, calls, window, get copiedText() { return copiedText; } };
}

test("clinical dashboard click routing invokes every destination", () => {
  const { elements, calls } = createHarness();
  const dashboard = elements.get("homeDashboard");
  const routes = {
    calculator: "calculator",
    medical: "medical",
    icd: "icd",
    drugs: "drugs",
    guides: null,
    emergency: null,
    ai: null,
    references: null
  };

  for (const [key, expected] of Object.entries(routes)) {
    const button = { dataset: { module: key } };
    dashboard.click({
      target: {
        closest(selector) {
          assert.equal(selector, "[data-module]");
          return button;
        }
      }
    });
    if (expected) {
      assert.equal(calls.at(-1), expected, key + " route");
    } else {
      assert.equal(elements.get("moduleTitle").textContent,
        ({ guides: "Panduan Klinis", emergency: "IGD & Emergency",
          ai: "Asisten Klinis Offline", references: "Referensi Medis" })[key]);
      assert.ok(elements.get("moduleWorkspaceContent").innerHTML.length > 0, key + " content");
    }
  }
});

test("module back button returns to the clinical dashboard", () => {
  const { elements, calls } = createHarness();
  elements.get("moduleBack").click();
  assert.equal(calls[0], "clinical");
});

test("settings navigation opens a usable settings workspace", () => {
  const { elements } = createHarness();
  elements.get("navSettings").click({ preventDefault() {} });
  assert.equal(elements.get("moduleTitle").textContent, "Pengaturan MEDORA");
  const html = elements.get("moduleWorkspaceContent").innerHTML;
  for (const id of ["copyLocalBackup", "restoreLocalBackup", "clearLocalHistory", "clearLocalFavorites"]) {
    assert.ok(html.includes('id="' + id + '"'), id + " control");
  }
});


test("SOAP workspace builds, clears, and copies a structured note", async () => {
  const harness = createHarness();
  const { elements } = harness;
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "ai" } }) }
  });
  elements.get("soapAge").value = "4 tahun";
  elements.get("soapSex").value = "Perempuan";
  elements.get("soapComplaint").value = "Demam 2 hari";
  elements.get("soapVitals").value = "Suhu 38,5 C";
  elements.get("soapAssessment").value = "Febris";
  elements.get("moduleWorkspaceContent").click({ target: { id: "buildSoap" } });
  const note = elements.get("soapOutput").textContent;
  assert.match(note, /CATATAN KLINIS MEDORA/);
  assert.match(note, /S\\nDemam 2 hari/);
  assert.match(note, /O\\nSuhu 38,5 C/);
  assert.match(note, /A\\nFebris/);
  assert.match(elements.get("soapStatus").textContent, /Periksa kembali/);

  await elements.get("moduleWorkspaceContent").click({ target: { id: "copySoap" } });
  assert.match(harness.copiedText, /Demam 2 hari/);

  elements.get("moduleWorkspaceContent").click({ target: { id: "clearSoap" } });
  assert.equal(elements.get("soapAge").value, "");
  assert.equal(elements.get("soapOutput").textContent, "Hasil catatan akan tampil di sini.");
});

test("settings backup exports local favorites and dose history", async () => {
  const { elements, copiedText } = createHarness();
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "settings" } }) }
  });
  await elements.get("moduleWorkspaceContent").click({ target: { id: "copyLocalBackup" } });
  const backup = JSON.parse(harness.copiedText);
  assert.equal(backup.app, "MEDORA");
  assert.equal(backup.version, 1);
  assert.deepEqual(Array.from(backup.favorites), []);
  assert.deepEqual(Array.from(backup.doseHistory), []);
  assert.match(elements.get("settingsStatus").textContent, /Backup berhasil disalin/);
});

test("settings restore accepts valid backup and rejects unknown medication names", async () => {
  const { elements, calls } = createHarness();
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "settings" } }) }
  });
  elements.get("restoreBackup").value = JSON.stringify({
    app: "MEDORA", version: 1, favorites: ["Paracetamol"], doseHistory: []
  });
  await elements.get("moduleWorkspaceContent").click({ target: { id: "restoreLocalBackup" } });
  assert.match(elements.get("settingsStatus").textContent, /Backup berhasil dipulihkan/);
  assert.equal(elements.get("localDataSummary").textContent,
    "1 obat favorit dan 0 catatan riwayat tersimpan di perangkat ini.");

  elements.get("restoreBackup").value = JSON.stringify({
    app: "MEDORA", version: 1, favorites: ["Obat Tidak Terdaftar"], doseHistory: []
  });
  await elements.get("moduleWorkspaceContent").click({ target: { id: "restoreLocalBackup" } });
  assert.match(elements.get("settingsStatus").textContent, /nama obat yang tidak dikenal/);
});

test("settings clear actions require confirmation and update local data", async () => {
  const { elements, calls } = createHarness();
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "settings" } }) }
  });
  await elements.get("moduleWorkspaceContent").click({ target: { id: "clearLocalHistory" } });
  await elements.get("moduleWorkspaceContent").click({ target: { id: "clearLocalFavorites" } });
  assert.equal(calls.filter(x => x === "clinical").length, 0);
  assert.match(elements.get("settingsStatus").textContent, /Daftar favorit dihapus/);
  assert.match(elements.get("localDataSummary").textContent, /0 obat favorit dan 0 catatan riwayat/);
});
