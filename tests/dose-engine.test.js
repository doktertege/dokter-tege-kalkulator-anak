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

test("furosemide oral edema calculator enforces age and tablet-weight boundaries", () => {
  const standard = dose.furosemidePediatricOralEdema(10, 12);
  assert.equal(standard.dailyDoseMg, 10);
  assert.equal(standard.doseMgPerKgPerDay, 1);
  assert.equal(standard.tabletEquivalentPerDay, 0.25);
  assert.equal(standard.formulation, "tablet 40 mg");

  const capped = dose.furosemidePediatricOralEdema(50, 120);
  assert.equal(capped.dailyDoseMg, 40);
  assert.equal(capped.maximumDailyDoseMg, 40);
  assert.equal(capped.doseMgPerKgPerDay, 0.8);
  assert.equal(capped.tabletEquivalentPerDay, 1);

  assert.throws(() => dose.furosemidePediatricOralEdema(9.9, 12), RangeError);
  assert.throws(() => dose.furosemidePediatricOralEdema(10, 0), RangeError);
  assert.throws(() => dose.furosemidePediatricOralEdema(10, 216), RangeError);
});

test("metamizole oral calculator enforces pediatric age and weight limits", () => {
  const result = dose.metamizolePediatricOral(10, 36);
  assert.equal(result.doseMg, 100);
  assert.equal(result.volumeMl, 2);
  assert.equal(result.concentrationMgPerMl, 50);
  assert.equal(result.maxDailyMg, 400);
  assert.equal(result.maxDosesPer24Hours, 4);

  assert.throws(() => dose.metamizolePediatricOral(5, 36), RangeError);
  assert.throws(() => dose.metamizolePediatricOral(10, 2), RangeError);
  assert.throws(() => dose.metamizolePediatricOral(10, 169), RangeError);
});

test("ceftriaxone injection enforces age, weight, regimen, and daily ceiling", () => {
  const standard = dose.ceftriaxoneInjection(10, 24, "standard");
  assert.equal(standard.dailyMinMg, 500);
  assert.equal(standard.dailyMaxMg, 800);
  assert.equal(standard.divisions, 1);
  assert.equal(standard.intervalHours, 24);
  const meningitis = dose.ceftriaxoneInjection(10, 24, "meningitis");
  assert.equal(meningitis.dailyMaxMg, 1000);
  assert.equal(meningitis.divisions, 2);
  assert.equal(meningitis.intervalHours, 12);
  assert.equal(dose.ceftriaxoneInjection(49, 24, "meningitis").dailyMaxMg, 4000);
  assert.throws(() => dose.ceftriaxoneInjection(10, 1, "standard"), RangeError);
  assert.throws(() => dose.ceftriaxoneInjection(50, 24, "standard"), RangeError);
  assert.throws(() => dose.ceftriaxoneInjection(10, 24, "unknown"), RangeError);
});

test("cefotaxime injection enforces frequency and per-dose limits", () => {
  const standard = dose.cefotaximeInjection(10, 24, "standard");
  assert.equal(standard.dailyMinMg, 500);
  assert.equal(standard.dailyMaxMg, 1800);
  assert.equal(standard.divisions, 4);
  assert.equal(standard.intervalHours, 6);
  const meningitis = dose.cefotaximeInjection(10, 24, "meningitis", 6);
  assert.equal(meningitis.dailyMinMg, 2000);
  assert.equal(meningitis.dailyMaxMg, 3000);
  assert.equal(meningitis.divisions, 6);
  assert.equal(meningitis.intervalHours, 4);
  assert.throws(() => dose.cefotaximeInjection(49, 24, "meningitis", 4), RangeError);
  assert.throws(() => dose.cefotaximeInjection(10, 1, "standard"), RangeError);
  assert.throws(() => dose.cefotaximeInjection(50, 24, "standard"), RangeError);
});

test("gentamicin calculator is explicitly an initial dose only", () => {
  const result = dose.gentamicinInitial(10, 24, 40);
  assert.equal(result.doseMg, 70);
  assert.equal(result.volumeMl, 1.75);
  assert.equal(result.intervalHours, null);
  assert.match(result.frequency, /initial dose only/);
  assert.match(result.monitoring, /therapeutic drug monitoring/);
  assert.throws(() => dose.gentamicinInitial(10, 2, 40), RangeError);
  assert.throws(() => dose.gentamicinInitial(50, 24, 40), RangeError);
});

test("rectal diazepam is a single rescue dose with a hard single-dose ceiling", () => {
  const result = dose.diazepamRectal(10, 60, 5);
  assert.equal(result.doseMg, 5);
  assert.equal(result.volumeMl, 1);
  assert.equal(result.frequency, "single rescue dose; reassess immediately");
  assert.equal(result.maxSingleDoseMg, 10);
  assert.throws(() => dose.diazepamRectal(10, 0, 5), RangeError);
  assert.throws(() => dose.diazepamRectal(10, 217, 5), RangeError);
  assert.throws(() => dose.diazepamRectal(10, 60, 0), RangeError);
});

test("ondansetron gastroenteritis calculator is single-dose and enforces age and weight", () => {
  const result = dose.ondansetronGastroenteritis(10, 24, 4);
  assert.equal(result.doseMg, 1.5);
  assert.equal(result.volumeMl, 1.875);
  assert.equal(result.frequency, "single oral dose only");
  assert.equal(result.maxDoseMg, 8);
  assert.equal(result.rehydrationDelayMin, 15);
  assert.equal(result.rehydrationDelayMax, 30);
  assert.throws(() => dose.ondansetronGastroenteritis(7.9, 24, 4), RangeError);
  assert.throws(() => dose.ondansetronGastroenteritis(10, 5, 4), RangeError);
  assert.throws(() => dose.ondansetronGastroenteritis(10, 24, 0), RangeError);
});

test("dexamethasone croup calculator enforces age, severity, and single-dose use", () => {
  const mild = dose.dexamethasoneCroup(10, 24, "mildModerate", "tablet");
  assert.equal(mild.doseMg, 1.5);
  assert.equal(mild.tabletCount, 3);
  assert.equal(mild.frequency, "single dose only");
  const severe = dose.dexamethasoneCroup(30, 60, "severe", "injection");
  assert.equal(severe.doseMg, 12);
  assert.equal(severe.injectionVolumeMl, 2.4);
  assert.equal(severe.maxDoseMg, 12);
  assert.throws(() => dose.dexamethasoneCroup(10, 5, "mildModerate", "tablet"), RangeError);
  assert.throws(() => dose.dexamethasoneCroup(10, 24, "unknown", "tablet"), RangeError);
  assert.throws(() => dose.dexamethasoneCroup(10, 24, "mildModerate", "syrup"), RangeError);
});
