"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const dose = require("../app/src/main/assets/dose-engine.js");

test("paracetamol converts mg/kg dose to suspension volume", () => {
  const result = dose.paracetamol(10, 120);
  assert.equal(result.lowMg, 100);
  assert.equal(result.highMg, 150);
  assert.ok(Math.abs(result.lowMl - 100 / 24) < 1e-10);
  assert.ok(Math.abs(result.highMl - 150 / 24) < 1e-10);
  assert.equal(result.maxDailyMg, 600);
});

test("ibuprofen returns dose range and daily ceiling", () => {
  const result = dose.ibuprofen(10, 100);
  assert.equal(result.lowMg, 50);
  assert.equal(result.highMg, 100);
  assert.equal(result.maxDailyMg, 400);
  assert.equal(result.maxDosesAtHighDose, 4);
});

test("cefixime divides the daily dose correctly", () => {
  const result = dose.cefixime(15, 100, 2);
  assert.equal(result.dailyMg, 120);
  assert.equal(result.perDoseMg, 60);
  assert.equal(result.volumeMl, 3);
  assert.equal(result.divisions, 2);
});

test("amoxicillin AOM regimen returns a daily range divided twice daily", () => {
  const result = dose.amoxicillin(10, 250, "aom");
  assert.equal(result.dailyLowMg, 800);
  assert.equal(result.dailyHighMg, 900);
  assert.equal(result.perDoseLowMg, 400);
  assert.equal(result.perDoseHighMg, 450);
  assert.equal(result.divisions, 2);
});

test("cefadroxil tonsillitis regimen is 30 mg/kg once daily with 1 g cap", () => {
  const result = dose.cefadroxil(14, 125);
  assert.equal(result.dailyMg, 420);
  assert.equal(result.perDoseMg, 420);
  assert.equal(result.volumeMl, 16.8);
  assert.equal(result.divisions, 1);
  assert.equal(dose.cefadroxil(40, 125).dailyMg, 1000);
});

test("cetirizine enforces its minimum age and age bands", () => {
  assert.equal(dose.cetirizine(36, 5).dailyMg, 2.5);
  assert.equal(dose.cetirizine(84, 5).dailyMg, 5);
  assert.equal(dose.cetirizine(144, 5).dailyMg, 10);
  assert.throws(() => dose.cetirizine(5, 5), RangeError);
});

test("salbutamol nebulization constrains dose to age band", () => {
  assert.equal(dose.salbutamolNebulized(48, 1).doseMg, 2.5);
  assert.throws(() => dose.salbutamolNebulized(48, 1, 5), RangeError);
  assert.throws(() => dose.salbutamolNebulized(11, 1), RangeError);
});

test("oral rehydration plans return weight-based volumes", () => {
  assert.equal(dose.oralit(10, "planA").afterEachStoolMl, 100);
  assert.equal(dose.oralit(10, "planB").totalMl, 750);
  assert.equal(dose.oralit(10, "planB").durationHours, 3);
});

test("IM adrenaline uses 1 mg/mL and caps the single dose by age", () => {
  const child = dose.adrenalineAnaphylaxisIM(10, 60, 1);
  assert.equal(child.doseMg, 0.1);
  assert.equal(child.volumeMl, 0.1);
  assert.equal(child.route, "IM into the mid-anterolateral thigh");
  assert.equal(dose.adrenalineAnaphylaxisIM(40, 60, 1).doseMg, 0.3);
  assert.throws(() => dose.adrenalineAnaphylaxisIM(10, 60, 0.1), RangeError);
});

test("invalid weight, concentration, and unsupported regimen are rejected", () => {
  assert.throws(() => dose.paracetamol(0, 120), RangeError);
  assert.throws(() => dose.ibuprofen(10, 0), RangeError);
  assert.throws(() => dose.cefixime(10, 100, 3), RangeError);
  assert.throws(() => dose.amoxicillin(10, 250, "unknown"), RangeError);
});
