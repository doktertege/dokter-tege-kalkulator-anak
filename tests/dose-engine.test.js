const test = require("node:test");
const assert = require("node:assert/strict");
const { paracetamol, ibuprofen } = require("../app/src/main/assets/dose-engine.js");

test("paracetamol calculates 10–15 mg/kg and conservative daily ceiling", () => {
  const result = paracetamol(12, 120);
  assert.equal(result.lowMg, 120);
  assert.equal(result.highMg, 180);
  assert.equal(result.lowMl, 5);
  assert.equal(result.highMl, 7.5);
  assert.equal(result.maxDailyMg, 720);
});

test("paracetamol applies per-dose and daily absolute caps", () => {
  const result = paracetamol(80, 250);
  assert.equal(result.lowMg, 800);
  assert.equal(result.highMg, 1000);
  assert.equal(result.maxDailyMg, 4000);
});

test("ibuprofen calculates dose range and weight-based daily maximum", () => {
  const result = ibuprofen(10, 100);
  assert.equal(result.lowMg, 50);
  assert.equal(result.highMg, 100);
  assert.equal(result.lowMl, 2.5);
  assert.equal(result.highMl, 5);
  assert.equal(result.maxDailyMg, 400);
  assert.equal(result.maxDosesAtHighDose, 4);
});

test("ibuprofen applies adult absolute daily cap and 400 mg dose cap", () => {
  const result = ibuprofen(40, 100);
  assert.equal(result.lowMg, 200);
  assert.equal(result.highMg, 400);
  assert.equal(result.maxDailyMg, 1200);
  assert.equal(result.maxDosesAtHighDose, 3);
});

test("dose engine rejects zero, negative, and non-finite inputs", () => {
  assert.throws(() => paracetamol(0, 120), RangeError);
  assert.throws(() => paracetamol(10, 0), RangeError);
  assert.throws(() => ibuprofen(-1, 100), RangeError);
  assert.throws(() => ibuprofen(10, Number.NaN), RangeError);
});
