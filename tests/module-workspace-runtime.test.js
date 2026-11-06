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
    value: "",
    checked: false,
    matches(selector) { return selector === ".checkRow input[type=checkbox]"; }
  };
}

function createHarness() {
  const elements = new Map();
  const emergencyCheckboxes = Array.from({ length: 7 }, () => makeElement());
  const document = {
    body: { classList: { add() {}, remove() {} } },
    getElementById(id) {
      if (!elements.has(id)) elements.set(id, makeElement());
      return elements.get(id);
    },
    querySelectorAll(selector) {
      return selector === "#moduleWorkspaceContent .checkRow input[type=checkbox]" ? emergencyCheckboxes : [];
    }
  };
  const calls = [];
  const storage = new Map();
  let failNextSetKey = null;
  const localStorage = { getItem(key) { return storage.has(key) ? storage.get(key) : null; }, setItem(key, value) { if (failNextSetKey === key) { failNextSetKey = null; throw new Error("quota exceeded"); } storage.set(key, String(value)); }, removeItem(key) { storage.delete(key); } };
  let copiedText = "";
  const window = {
    MEDORA_DATABASE: { drugs: [["Paracetamol"]] },
    scrollTo() {}
  };
  const context = {
    document,
    localStorage,
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
    saveFavorites: () => true,
    persistDoseHistory: () => true,
    renderDoseHistory: () => {},
    copyTextToClipboard: async text => { copiedText = text; },
    confirm: () => true
  };
  vm.runInNewContext(source, context);
  [
    "soapAge", "soapSex", "soapComplaint", "soapHistory", "soapVitals",
    "soapExam", "soapAssessment", "soapPlan", "soapOutput", "soapStatus",
    "restoreBackup", "settingsStatus", "localDataSummary"
  ].forEach(id => document.getElementById(id));
  return { elements, calls, window, emergencyCheckboxes, storage, failNextSet(key) { failNextSetKey = key; }, get copiedText() { return copiedText; } };
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
    references: null,
    integrated: null,
    ultrasound: null,
    laboratory: null,
    records: null,
    anthropometry: null,
    vitals: null
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
          ai: "Asisten Klinis Offline", references: "Referensi Medis",
          integrated: "Kasus Terpadu", ultrasound: "USG Kandungan",
          laboratory: "Interpretasi Laboratorium", records: "Rekam Medis",
          anthropometry: "IMT & Lingkar Tubuh", vitals: "Tanda Vital" })[key]);
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
  assert.ok(note.indexOf("S") < note.indexOf("Demam 2 hari"));
  assert.ok(note.indexOf("O") < note.indexOf("Suhu 38,5 C"));
  assert.ok(note.indexOf("A") < note.indexOf("Febris"));
  assert.match(elements.get("soapStatus").textContent, /Periksa kembali/);

  await elements.get("moduleWorkspaceContent").click({ target: { id: "copySoap" } });
  assert.match(harness.copiedText, /Demam 2 hari/);

  elements.get("moduleWorkspaceContent").click({ target: { id: "clearSoap" } });
  assert.equal(elements.get("soapAge").value, "");
  assert.equal(elements.get("soapOutput").textContent, "Hasil catatan akan tampil di sini.");
});

test("settings backup exports local favorites and dose history", async () => {
  const harness = createHarness();
  const { elements } = harness;
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
  assert.match(elements.get("settingsStatus").textContent, /Daftar favorit berhasil dihapus/);
  assert.match(elements.get("localDataSummary").textContent, /0 obat favorit dan 0 catatan riwayat/);
});


test("emergency checklist tracks completion and can be reset", () => {
  const { elements, emergencyCheckboxes } = createHarness();
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "emergency" } }) }
  });
  assert.equal(elements.get("emergencyChecklistProgress").textContent, "0 dari 7 langkah ditandai (0%).");
  emergencyCheckboxes[0].checked = true;
  elements.get("moduleWorkspaceContent").listeners.change({
    target: { matches: selector => selector === ".checkRow input[type=checkbox]" }
  });
  assert.equal(elements.get("emergencyChecklistProgress").textContent, "1 dari 7 langkah ditandai (14%).");
  elements.get("moduleWorkspaceContent").click({ target: { id: "resetEmergencyChecklist" } });
  assert.ok(emergencyCheckboxes.every(input => input.checked === false));
  assert.equal(elements.get("emergencyChecklistProgress").textContent, "0 dari 7 langkah ditandai (0%).");
});

test("settings restore rolls back the first write when the second storage write fails", async () => {
  const harness = createHarness();
  const { elements, storage, failNextSet } = harness;
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "settings" } }) }
  });

  const oldFavorites = JSON.stringify([]);
  const oldHistory = JSON.stringify([]);
  storage.set("dt_favorites", oldFavorites);
  storage.set("medora_dose_history", oldHistory);
  elements.get("restoreBackup").value = JSON.stringify({
    app: "MEDORA", version: 1, favorites: ["Paracetamol"], doseHistory: []
  });
  failNextSet("medora_dose_history");

  await elements.get("moduleWorkspaceContent").click({ target: { id: "restoreLocalBackup" } });
  assert.match(elements.get("settingsStatus").textContent, /Penyimpanan perangkat gagal/);
  assert.equal(storage.get("dt_favorites"), oldFavorites);
  assert.equal(storage.get("medora_dose_history"), oldHistory);
  assert.equal(elements.get("localDataSummary").textContent,
    "0 obat favorit dan 0 catatan riwayat tersimpan di perangkat ini.");
});

test("emergency checklist never carries completed actions into a new session", () => {
  const harness = createHarness();
  const { elements, emergencyCheckboxes, storage } = harness;
  storage.set("medora_emergency_checklist_v1", JSON.stringify([true, true, false, false, false, false, false]));
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "emergency" } }) }
  });
  assert.ok(emergencyCheckboxes.every(input => input.checked === false));
  assert.equal(storage.has("medora_emergency_checklist_v1"), false);
  assert.match(elements.get("emergencyChecklistStatus").textContent, /setiap kali menu dibuka/);
});

test("emergency checklist changes remain session-only and are not persisted", () => {
  const { elements, emergencyCheckboxes, storage } = createHarness();
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "emergency" } }) }
  });
  emergencyCheckboxes[0].checked = true;
  elements.get("moduleWorkspaceContent").listeners.change({
    target: { matches: selector => selector === ".checkRow input[type=checkbox]" }
  });
  assert.equal(storage.has("medora_emergency_checklist_v1"), false);
  assert.match(elements.get("emergencyChecklistStatus").textContent, /sesi ini saja/);
});

test("settings explains sensitive details contained in exported backups", () => {
  const { elements } = createHarness();
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "settings" } }) }
  });
  assert.match(elements.get("moduleWorkspaceContent").innerHTML, /nama obat, usia, berat badan, hasil, dan tanggal/);
  assert.match(elements.get("moduleWorkspaceContent").innerHTML, /informasi kesehatan yang sensitif/);
});

test("SOAP output explicitly flags empty sections instead of silently omitting them", () => {
  const { elements } = createHarness();
  elements.get("homeDashboard").click({
    target: { closest: () => ({ dataset: { module: "ai" } }) }
  });
  elements.get("soapComplaint").value = "Batuk 3 hari";
  elements.get("soapAssessment").value = "ISPA";
  elements.get("moduleWorkspaceContent").click({ target: { id: "buildSoap" } });
  const note = elements.get("soapOutput").textContent;
  assert.match(note, /O - Objektif[\\s\\S]*?\\[BELUM DIISI\\]/);
  assert.match(note, /P - Rencana[\\s\\S]*?\\[BELUM DIISI\\]/);
  assert.match(elements.get("soapStatus").textContent, /belum lengkap/);
  assert.match(elements.get("soapStatus").textContent, /Objektif, Rencana/);
});
