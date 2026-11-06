"use strict";
const test = require("node:test");
const assert = require("node:assert/strict");
const dose = require("../app/src/main/assets/dose-engine.js");

test("paracetamol calculates 10–15 mg/kg and concentration volumes", () => {
  const r = dose.paracetamol(10, 120);
  assert.equal(r.lowMg, 100);
  assert.equal(r.highMg, 150);
  assert.equal(r.lowMl, 100 / 24);
  assert.equal(r.highMl, 150 / 24);
  assert.equal(r.maxDailyMg, 600);
});

test("paracetamol applies per-dose and daily caps", () => {
  const r = dose.paracetamol(80, 250);
  assert.equal(r.lowMg, 800);
  assert.equal(r.highMg, 1000);
  assert.equal(r.maxDailyMg, 4000);
});

test("paracetamol supports 160 mg/5 mL concentration", () => {
  const r = dose.paracetamol(12, 160);
  assert.equal(r.lowMl, 3.75);
  assert.equal(r.highMl, 5.625);
});

test("ibuprofen calculates 5–10 mg/kg and daily maximum", () => {
  const r = dose.ibuprofen(10, 100);
  assert.equal(r.lowMg, 50);
  assert.equal(r.highMg, 100);
  assert.equal(r.lowMl, 2.5);
  assert.equal(r.highMl, 5);
  assert.equal(r.maxDailyMg, 400);
  assert.equal(r.maxDosesAtHighDose, 4);
});

test("ibuprofen applies 400 mg per-dose and 1200 mg daily caps", () => {
  const r = dose.ibuprofen(60, 200);
  assert.equal(r.lowMg, 300);
  assert.equal(r.highMg, 400);
  assert.equal(r.maxDailyMg, 1200);
  assert.equal(r.maxDosesAtHighDose, 3);
});

test("ibuprofen derives fewer daily doses when weight-based daily cap is limiting", () => {
  const r = dose.ibuprofen(5, 100);
  assert.equal(r.maxDailyMg, 200);
  assert.equal(r.highMg, 50);
  assert.equal(r.maxDosesAtHighDose, 4);
});

test("dose engine rejects invalid weights and concentrations", () => {
  assert.throws(() => dose.paracetamol(0, 120), RangeError);
  assert.throws(() => dose.ibuprofen(-1, 100), RangeError);
  assert.throws(() => dose.paracetamol(10, 0), RangeError);
  assert.throws(() => dose.ibuprofen(10, Number.NaN), RangeError);
});
