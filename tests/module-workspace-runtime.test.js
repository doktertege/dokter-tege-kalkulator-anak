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
      if (listeners.click) listeners.click(event);
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
    copyTextToClipboard: async () => {},
    confirm: () => true
  };
  vm.runInNewContext(source, context);
  return { elements, calls, window };
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
