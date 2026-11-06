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

test("cefixime calculates 8 mg/kg/day divided twice daily", () => {
  const r = dose.cefixime(10, 100);
  assert.equal(r.dailyMg, 80);
  assert.equal(r.perDoseMg, 40);
  assert.equal(r.volumeMl, 2);
  assert.equal(r.divisions, 2);
});

test("cefixime supports once-daily dosing and 200 mg/5 mL suspension", () => {
  const r = dose.cefixime(10, 200, 1);
  assert.equal(r.dailyMg, 80);
  assert.equal(r.perDoseMg, 80);
  assert.equal(r.volumeMl, 2);
  assert.equal(r.divisions, 1);
});

test("cefixime applies 400 mg daily maximum", () => {
  const r = dose.cefixime(60, 100, 2);
  assert.equal(r.dailyMg, 400);
  assert.equal(r.perDoseMg, 200);
  assert.equal(r.volumeMl, 10);
});

test("cefixime rejects unsupported dose divisions", () => {
  assert.throws(() => dose.cefixime(10, 100, 3), RangeError);
});


test("amoxicillin tonsillitis regimen calculates 25 mg/kg twice daily", () => {
  const r = dose.amoxicillin(10, 250, "tonsillitis");
  assert.equal(r.dailyLowMg, 500);
  assert.equal(r.dailyHighMg, 500);
  assert.equal(r.perDoseLowMg, 250);
  assert.equal(r.perDoseHighMg, 250);
  assert.equal(r.volumeLowMl, 5);
  assert.equal(r.volumeHighMl, 5);
  assert.equal(r.divisions, 2);
  assert.equal(r.maxDailyMg, 1000);
});

test("amoxicillin tonsillitis regimen applies 500 mg per-dose ceiling", () => {
  const r = dose.amoxicillin(30, 250, "tonsillitis");
  assert.equal(r.dailyLowMg, 1000);
  assert.equal(r.perDoseLowMg, 500);
});

test("amoxicillin AOM regimen calculates 80–90 mg/kg/day divided twice daily", () => {
  const r = dose.amoxicillin(10, 250, "aom");
  assert.equal(r.dailyLowMg, 800);
  assert.equal(r.dailyHighMg, 900);
  assert.equal(r.perDoseLowMg, 400);
  assert.equal(r.perDoseHighMg, 450);
  assert.equal(r.volumeLowMl, 8);
  assert.equal(r.volumeHighMl, 9);
  assert.equal(r.divisions, 2);
  assert.equal(r.maxDailyMg, 3000);
});

test("amoxicillin AOM regimen applies 3000 mg daily ceiling", () => {
  const r = dose.amoxicillin(40, 250, "aom");
  assert.equal(r.dailyLowMg, 3000);
  assert.equal(r.dailyHighMg, 3000);
});

test("amoxicillin GAS regimen calculates 50 mg/kg once daily with 1000 mg cap", () => {
  const r = dose.amoxicillin(10, 250, "gas");
  assert.equal(r.dailyLowMg, 500);
  assert.equal(r.perDoseLowMg, 500);
  assert.equal(r.volumeLowMl, 10);
  assert.equal(r.divisions, 1);
  assert.equal(r.maxDailyMg, 1000);
  const capped = dose.amoxicillin(30, 250, "gas");
  assert.equal(capped.dailyHighMg, 1000);
});

test("amoxicillin rejects invalid inputs and unknown regimens", () => {
  assert.throws(() => dose.amoxicillin(0, 250, "gas"), RangeError);
  assert.throws(() => dose.amoxicillin(10, 0, "gas"), RangeError);
  assert.throws(() => dose.amoxicillin(10, 250, "unknown"), RangeError);
});


test("cefadroxil calculates 30 mg/kg once daily and concentration volume", () => {
  const r = dose.cefadroxil(10, 125);
  assert.equal(r.dailyMg, 300);
  assert.equal(r.perDoseMg, 300);
  assert.equal(r.volumeMl, 12);
  assert.equal(r.divisions, 1);
  assert.equal(r.maxDailyMg, 1000);
});

test("cefadroxil supports 250 mg/5 mL concentration", () => {
  const r = dose.cefadroxil(10, 250);
  assert.equal(r.volumeMl, 6);
});

test("cefadroxil applies 1000 mg maximum dose", () => {
  const r = dose.cefadroxil(40, 125);
  assert.equal(r.dailyMg, 1000);
  assert.equal(r.volumeMl, 40);
});

test("cefadroxil rejects invalid inputs", () => {
  assert.throws(() => dose.cefadroxil(0, 125), RangeError);
  assert.throws(() => dose.cefadroxil(10, 0), RangeError);
});


test("cetirizine uses age-based daily doses at key age boundaries", () => {
  assert.equal(dose.cetirizine(6, 5).dailyMg, 2.5);
  assert.equal(dose.cetirizine(23, 5).dailyMg, 2.5);
  assert.equal(dose.cetirizine(24, 5).dailyMg, 2.5);
  assert.equal(dose.cetirizine(71, 5).dailyMg, 2.5);
  assert.equal(dose.cetirizine(72, 5).dailyMg, 5);
  assert.equal(dose.cetirizine(143, 5).dailyMg, 5);
  assert.equal(dose.cetirizine(144, 5).dailyMg, 10);
});

test("cetirizine converts 5 mg/5 mL and 2.5 mg/5 mL concentrations", () => {
  assert.equal(dose.cetirizine(72, 5).volumeMl, 5);
  assert.equal(dose.cetirizine(72, 2.5).volumeMl, 10);
});

test("cetirizine enforces minimum age and maximum daily dose", () => {
  assert.throws(() => dose.cetirizine(5, 5), RangeError);
  assert.throws(() => dose.cetirizine(Number.NaN, 5), RangeError);
  assert.throws(() => dose.cetirizine(144, 0), RangeError);
  assert.equal(dose.cetirizine(12, 5).maxDailyMg, 2.5);
  assert.equal(dose.cetirizine(60, 5).maxDailyMg, 5);
  assert.equal(dose.cetirizine(180, 5).maxDailyMg, 10);
});


test("loratadine uses age- and weight-based pediatric syrup doses", () => {
  assert.deepEqual(dose.loratadine(20, 24, 5), {
    dailyMg: 5, volumeMl: 5, frequencyPerDay: 1, maxDailyMg: 10
  });
  assert.equal(dose.loratadine(30, 143, 5).dailyMg, 5);
  assert.equal(dose.loratadine(30.1, 143, 5).dailyMg, 10);
  assert.equal(dose.loratadine(10, 145, 5).dailyMg, 10);
  assert.equal(dose.loratadine(10, 216, 5).volumeMl, 10);
});

test("loratadine rejects under-2, over-18, invalid weight and strength", () => {
  assert.throws(() => dose.loratadine(10, 23, 5), RangeError);
  assert.throws(() => dose.loratadine(10, 217, 5), RangeError);
  assert.throws(() => dose.loratadine(0, 24, 5), RangeError);
  assert.throws(() => dose.loratadine(10, 24, 0), RangeError);
});

test("ambroxol uses age-based doses and frequencies", () => {
  assert.deepEqual(dose.ambroxol(24, 15), {
    doseMg: 7.5, volumeMl: 2.5, frequencyMinPerDay: 3, frequencyMaxPerDay: 3
  });
  assert.deepEqual(dose.ambroxol(71, 15), {
    doseMg: 7.5, volumeMl: 2.5, frequencyMinPerDay: 3, frequencyMaxPerDay: 3
  });
  assert.deepEqual(dose.ambroxol(72, 15), {
    doseMg: 15, volumeMl: 5, frequencyMinPerDay: 2, frequencyMaxPerDay: 3
  });
  assert.deepEqual(dose.ambroxol(144, 15), {
    doseMg: 15, volumeMl: 5, frequencyMinPerDay: 2, frequencyMaxPerDay: 3
  });
});

test("ambroxol converts different syrup concentrations", () => {
  assert.equal(dose.ambroxol(24, 30).volumeMl, 1.25);
  assert.equal(dose.ambroxol(72, 7.5).volumeMl, 10);
});

test("ambroxol rejects ages outside the leaflet range and invalid strengths", () => {
  assert.throws(() => dose.ambroxol(23, 15), RangeError);
  assert.throws(() => dose.ambroxol(145, 15), RangeError);
  assert.throws(() => dose.ambroxol(24, 0), RangeError);
});


test("zinc preserves Indonesian age-based diarrhea regimens", () => {
  assert.deepEqual(dose.zinc(0, "indonesia"), {
    dailyMg: 10, durationMinDays: 10, durationMaxDays: 10
  });
  assert.equal(dose.zinc(5, "indonesia").dailyMg, 10);
  assert.equal(dose.zinc(6, "indonesia").dailyMg, 20);
  assert.equal(dose.zinc(60, "indonesia").dailyMg, 20);
});

test("zinc supports the WHO 2024 low-dose regimen through 10 years", () => {
  assert.deepEqual(dose.zinc(6, "who2024"), {
    dailyMg: 5, durationMinDays: 10, durationMaxDays: 14
  });
  assert.equal(dose.zinc(60, "who2024").dailyMg, 5);
  assert.equal(dose.zinc(120, "who2024").dailyMg, 5);
});

test("zinc rejects unsupported ages and regimen combinations", () => {
  assert.throws(() => dose.zinc(-1, "who2024"), RangeError);
  assert.throws(() => dose.zinc(121, "who2024"), RangeError);
  assert.throws(() => dose.zinc(61, "indonesia"), RangeError);
  assert.throws(() => dose.zinc(24, "unknown"), RangeError);
});


test("salbutamol nebulization uses age-based dose bands and concentration conversion", () => {
  assert.deepEqual(dose.salbutamolNebulized(12, 1), {
    minDoseMg: 2.5, maxDoseMg: 2.5, doseMg: 2.5, volumeMl: 2.5,
    frequency: "clinical reassessment required"
  });
  assert.equal(dose.salbutamolNebulized(71, 1).doseMg, 2.5);
  assert.equal(dose.salbutamolNebulized(72, 1, 5).volumeMl, 5);
  assert.equal(dose.salbutamolNebulized(143, 2, 5).volumeMl, 2.5);
  assert.equal(dose.salbutamolNebulized(144, 2).doseMg, 5);
});

test("salbutamol nebulization rejects unsupported ages, strengths, and doses", () => {
  assert.throws(() => dose.salbutamolNebulized(11, 1), RangeError);
  assert.throws(() => dose.salbutamolNebulized(12, 0), RangeError);
  assert.throws(() => dose.salbutamolNebulized(72, 1, 1.25), RangeError);
  assert.throws(() => dose.salbutamolNebulized(72, 1, 7.5), RangeError);
});


test("salbutamol nebulization rejects non-finite selected doses", () => {
  assert.throws(() => dose.salbutamolNebulized(72, 1, Number.NaN), RangeError);
  assert.throws(() => dose.salbutamolNebulized(72, 1, Number.POSITIVE_INFINITY), RangeError);
});

test("all dose engines reject non-finite numeric inputs", () => {
  const bad = [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
  for (const value of bad) {
    assert.throws(() => dose.paracetamol(value, 120), RangeError);
    assert.throws(() => dose.paracetamol(10, value), RangeError);
    assert.throws(() => dose.ibuprofen(value, 100), RangeError);
    assert.throws(() => dose.ibuprofen(10, value), RangeError);
    assert.throws(() => dose.cefixime(value, 100), RangeError);
    assert.throws(() => dose.cefixime(10, value), RangeError);
    assert.throws(() => dose.amoxicillin(value, 250, "gas"), RangeError);
    assert.throws(() => dose.amoxicillin(10, value, "gas"), RangeError);
    assert.throws(() => dose.cefadroxil(value, 125), RangeError);
    assert.throws(() => dose.cefadroxil(10, value), RangeError);
    assert.throws(() => dose.cetirizine(value, 5), RangeError);
    assert.throws(() => dose.cetirizine(72, value), RangeError);
    assert.throws(() => dose.ambroxol(value, 15), RangeError);
    assert.throws(() => dose.ambroxol(24, value), RangeError);
    assert.throws(() => dose.zinc(value, "who2024"), RangeError);
    assert.throws(() => dose.salbutamolNebulized(value, 1), RangeError);
    assert.throws(() => dose.salbutamolNebulized(72, value), RangeError);
  }
});


test("oralit Plan A calculates 10 mL/kg after each watery stool", () => {
  assert.deepEqual(dose.oralit(10, "planA"), {
    plan: "planA", afterEachStoolMl: 100,
    instruction: "give after each watery stool; continue breastfeeding and feeding"
  });
});

test("oralit Plan B calculates 75 mL/kg over 3 hours", () => {
  assert.deepEqual(dose.oralit(10, "planB"), {
    plan: "planB", totalMl: 750, durationHours: 3,
    instruction: "give gradually; reassess hydration after 3 hours"
  });
});

test("oralit rejects invalid weight and unsupported plan", () => {
  assert.throws(() => dose.oralit(0, "planA"), RangeError);
  assert.throws(() => dose.oralit(10, "unknown"), RangeError);
  assert.throws(() => dose.oralit(Number.NaN, "planB"), RangeError);
});

test("chlorpheniramine uses conservative age bands and syrup concentration conversion", () => {
  assert.deepEqual(dose.chlorpheniramine(24, 2), {
    doseMg: 1, volumeMl: 2.5, intervalHoursMin: 4, intervalHoursMax: 6,
    maxDailyMg: 6, maxDosesPerDay: 6
  });
  assert.equal(dose.chlorpheniramine(72, 2).doseMg, 2);
  assert.equal(dose.chlorpheniramine(144, 2).doseMg, 4);
  assert.equal(dose.chlorpheniramine(72, 4).volumeMl, 2.5);
});

test("chlorpheniramine blocks under 2 years and rejects invalid strengths", () => {
  assert.throws(() => dose.chlorpheniramine(23, 2), RangeError);
  assert.throws(() => dose.chlorpheniramine(Number.NaN, 2), RangeError);
  assert.throws(() => dose.chlorpheniramine(24, 0), RangeError);
});

test("ceftriaxone injection calculates standard and meningitis regimens after neonatal period", () => {
  assert.deepEqual(dose.ceftriaxoneInjection(10, 24, "standard"), {
    regimen: "standard", dailyMinMg: 500, dailyMaxMg: 800,
    doseMinMg: 500, doseMaxMg: 800, divisions: 1, intervalHours: 24,
    maxDailyMg: 4000,
    route: "IV; IM only when appropriate to the indication and product instructions"
  });
  assert.equal(dose.ceftriaxoneInjection(10, 24, "meningitis").doseMaxMg, 500);
  assert.equal(dose.ceftriaxoneInjection(49, 24, "meningitis").dailyMaxMg, 4000);
});

test("ceftriaxone blocks neonatal and adult-weight calculations", () => {
  assert.throws(() => dose.ceftriaxoneInjection(3, 0, "standard"), RangeError);
  assert.throws(() => dose.ceftriaxoneInjection(50, 24, "standard"), RangeError);
  assert.throws(() => dose.ceftriaxoneInjection(10, 24, "unknown"), RangeError);
});

test("cefotaxime injection calculates divided daily dose and caps", () => {
  const standard = dose.cefotaximeInjection(10, 24, "standard", 4);
  assert.equal(standard.dailyMinMg, 500);
  assert.equal(standard.dailyMaxMg, 1800);
  assert.equal(standard.doseMinMg, 125);
  assert.equal(standard.doseMaxMg, 450);
  assert.equal(standard.intervalHours, 6);
  const meningitis = dose.cefotaximeInjection(10, 24, "meningitis", 6);
  assert.equal(meningitis.dailyMinMg, 2000);
  assert.equal(meningitis.dailyMaxMg, 3000);
  assert.equal(meningitis.intervalHours, 4);
});

test("cefotaxime blocks neonatal, adult-weight, invalid regimen and invalid divisions", () => {
  assert.throws(() => dose.cefotaximeInjection(3, 0, "standard"), RangeError);
  assert.throws(() => dose.cefotaximeInjection(10, 145, "standard"), RangeError);
  assert.throws(() => dose.cefotaximeInjection(50, 24, "standard"), RangeError);
  assert.throws(() => dose.cefotaximeInjection(10, 24, "unknown"), RangeError);
  assert.throws(() => dose.cefotaximeInjection(10, 24, "standard", 3), RangeError);
});

test("gentamicin calculates an initial dose and concentration volume only", () => {
  assert.deepEqual(dose.gentamicinInitial(10, 24, 40), {
    doseMg: 70, volumeMl: 1.75, intervalHours: null,
    frequency: "initial dose only",
    monitoring: "Check renal function and obtain gentamicin therapeutic drug monitoring before any subsequent dose; do not use this result to schedule repeat doses."
  });
});

test("gentamicin blocks neonatal and adult-weight calculations and invalid strength", () => {
  assert.throws(() => dose.gentamicinInitial(3, 0, 40), RangeError);
  assert.throws(() => dose.gentamicinInitial(50, 24, 40), RangeError);
  assert.throws(() => dose.gentamicinInitial(10, 24, 0), RangeError);
});


test("injectable antibiotic engines reject non-finite and non-positive inputs", () => {
  const bad = [Number.NaN, Number.POSITIVE_INFINITY, Number.NEGATIVE_INFINITY];
  for (const value of bad) {
    assert.throws(() => dose.ceftriaxoneInjection(value, 24, "standard"), RangeError);
    assert.throws(() => dose.ceftriaxoneInjection(10, value, "standard"), RangeError);
    assert.throws(() => dose.cefotaximeInjection(value, 24, "standard"), RangeError);
    assert.throws(() => dose.cefotaximeInjection(10, value, "standard"), RangeError);
    assert.throws(() => dose.gentamicinInitial(value, 24, 40), RangeError);
    assert.throws(() => dose.gentamicinInitial(10, value, 40), RangeError);
  }
  assert.throws(() => dose.gentamicinInitial(10, 24, Number.NaN), RangeError);
});

test("cefotaxime prevents exceeding 2 g per dose", () => {
  assert.throws(() => dose.cefotaximeInjection(49, 120, "meningitis", 4), RangeError);
  const safe = dose.cefotaximeInjection(49, 120, "meningitis", 6);
  assert.equal(safe.doseMinMg, 9800 / 6);
  assert.equal(safe.doseMaxMg, 2000);
});


test("ondansetron gastroenteritis calculates one oral dose and syrup volume", () => {
  const r = dose.ondansetronGastroenteritis(10, 24, 4);
  assert.deepEqual(r, { doseMg: 1.5, volumeMl: 1.875, frequency: "single oral dose only", maxDoseMg: 8, rehydrationDelayMin: 15, rehydrationDelayMax: 30 });
  const capped = dose.ondansetronGastroenteritis(60, 144, 4);
  assert.equal(capped.doseMg, 8);
  assert.equal(capped.volumeMl, 10);
});

test("ondansetron gastroenteritis blocks under-6-months, under-8-kg and invalid inputs", () => {
  assert.throws(() => dose.ondansetronGastroenteritis(8, 5, 4), RangeError);
  assert.throws(() => dose.ondansetronGastroenteritis(7.9, 12, 4), RangeError);
  assert.throws(() => dose.ondansetronGastroenteritis(10, 217, 4), RangeError);
  assert.throws(() => dose.ondansetronGastroenteritis(0, 24, 4), RangeError);
  assert.throws(() => dose.ondansetronGastroenteritis(10, 24, 0), RangeError);
  assert.throws(() => dose.ondansetronGastroenteritis(10, Number.NaN, 4), RangeError);
});


test("rectal diazepam calculates 0.5 mg/kg with 10 mg single-dose ceiling", () => {
  const r = dose.diazepamRectal(10, 24, 5);
  assert.deepEqual(r, { doseMg: 5, volumeMl: 1, frequency: "single rescue dose; reassess immediately", maxSingleDoseMg: 10, doseMgPerKg: 0.5 });
  const capped = dose.diazepamRectal(30, 144, 4);
  assert.equal(capped.doseMg, 10);
  assert.equal(capped.volumeMl, 2.5);
});

test("rectal diazepam rejects neonatal age, adult age and invalid inputs", () => {
  assert.throws(() => dose.diazepamRectal(3, 0, 5), RangeError);
  assert.throws(() => dose.diazepamRectal(10, 217, 5), RangeError);
  assert.throws(() => dose.diazepamRectal(0, 24, 5), RangeError);
  assert.throws(() => dose.diazepamRectal(10, 24, 0), RangeError);
  assert.throws(() => dose.diazepamRectal(10, Number.NaN, 5), RangeError);
});






test("omeprazole supports labeled 20 mg pediatric GERD capsule regimen", () => {
  const typical = dose.omeprazolePediatricGerd(25, 96, "typicalGERD", 4);
  assert.deepEqual(typical, {
    indication: "typicalGERD",
    dailyDoseMg: 20,
    capsuleStrengthMg: 20,
    capsulesPerDay: 1,
    durationWeeks: 4,
    totalCapsules: 28,
    frequency: "once daily before breakfast",
    route: "oral"
  });
  const erosive = dose.omeprazolePediatricGerd(35, 144, "erosiveEsophagitis", 8);
  assert.equal(erosive.dailyDoseMg, 20);
  assert.equal(erosive.totalCapsules, 56);
});

test("omeprazole blocks unsupported weights, ages, indications and durations", () => {
  assert.throws(() => dose.omeprazolePediatricGerd(19.9, 48, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.omeprazolePediatricGerd(20, 11, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.omeprazolePediatricGerd(20, 193, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.omeprazolePediatricGerd(20, 48, "cough", 4), RangeError);
  assert.throws(() => dose.omeprazolePediatricGerd(20, 48, "typicalGERD", 8), RangeError);
  assert.throws(() => dose.omeprazolePediatricGerd(20, 48, "erosiveEsophagitis", 6), RangeError);
  assert.throws(() => dose.omeprazolePediatricGerd(0, 48, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.omeprazolePediatricGerd(Infinity, 48, "typicalGERD", 4), RangeError);
});

test("prednisone asthma oral calculates age-capped daily dose and 3–5 day course", () => {
  const toddler = dose.prednisoneAsthmaOral(10, 18, 2, 3, 5);
  assert.equal(toddler.dailyDoseMg, 20);
  assert.equal(toddler.maxDailyMg, 20);
  assert.equal(toddler.totalCourseMg, 60);
  assert.equal(toddler.tabletsPerDayEquivalent, 4);
  assert.equal(toddler.totalTabletsEquivalent, 12);
  assert.equal(toddler.taperRequired, false);

  const preschool = dose.prednisoneAsthmaOral(20, 60, 2, 5, 5);
  assert.equal(preschool.dailyDoseMg, 30);
  assert.equal(preschool.maxDailyMg, 30);
  assert.equal(preschool.totalCourseMg, 150);

  const schoolAge = dose.prednisoneAsthmaOral(30, 120, 2, 4, 5);
  assert.equal(schoolAge.dailyDoseMg, 40);
  assert.equal(schoolAge.maxDailyMg, 40);
  assert.equal(schoolAge.totalCourseMg, 160);
});

test("prednisone asthma oral validates age, selected dose, duration and tablet strength", () => {
  assert.throws(() => dose.prednisoneAsthmaOral(10, 11, 1, 3, 5), RangeError);
  assert.throws(() => dose.prednisoneAsthmaOral(10, 144, 1, 3, 5), RangeError);
  assert.throws(() => dose.prednisoneAsthmaOral(10, 24, 1.5, 3, 5), RangeError);
  assert.throws(() => dose.prednisoneAsthmaOral(10, 24, 1, 2, 5), RangeError);
  assert.throws(() => dose.prednisoneAsthmaOral(10, 24, 1, 6, 5), RangeError);
  assert.throws(() => dose.prednisoneAsthmaOral(10, 24, 1, 3, 10), RangeError);
  assert.throws(() => dose.prednisoneAsthmaOral(0, 24, 1, 3, 5), RangeError);
  assert.throws(() => dose.prednisoneAsthmaOral(Number.POSITIVE_INFINITY, 24, 1, 3, 5), RangeError);
});

test("methylprednisolone calculates initial IV dose for severe pediatric asthma", () => {
  const r = dose.methylprednisoloneAsthmaIV(12, 60);
  assert.equal(r.doseMg, 12);
  assert.equal(r.doseMgPerKg, 1);
  assert.equal(r.maxDoseMg, 60);
  assert.equal(r.route, "IV");
  assert.match(r.frequency, /initial dose/);
  const capped = dose.methylprednisoloneAsthmaIV(80, 216);
  assert.equal(capped.doseMg, 60);
  assert.equal(capped.maxDoseMg, 60);
});

test("methylprednisolone asthma IV calculator rejects under-1-year and invalid inputs", () => {
  assert.throws(() => dose.methylprednisoloneAsthmaIV(8, 11), RangeError);
  assert.throws(() => dose.methylprednisoloneAsthmaIV(8, 217), RangeError);
  assert.throws(() => dose.methylprednisoloneAsthmaIV(0, 24), RangeError);
  assert.throws(() => dose.methylprednisoloneAsthmaIV(Number.POSITIVE_INFINITY, 24), RangeError);
  assert.throws(() => dose.methylprednisoloneAsthmaIV(8, Number.NaN), RangeError);
});

test("dexamethasone croup selects severity-specific single doses and formulation conversion", () => {
  const mild = dose.dexamethasoneCroup(10, 24, "mildModerate", "tablet");
  assert.equal(mild.doseMg, 1.5);
  assert.equal(mild.tabletCount, 3);
  assert.equal(mild.injectionVolumeMl, null);
  assert.equal(mild.frequency, "single dose only");
  const severe = dose.dexamethasoneCroup(10, 24, "severe", "injection");
  assert.equal(severe.doseMg, 6);
  assert.equal(severe.injectionVolumeMl, 1.2);
  assert.equal(severe.tabletCount, null);
  const capped = dose.dexamethasoneCroup(30, 72, "severe", "tablet");
  assert.equal(capped.doseMg, 12);
  assert.equal(capped.tabletCount, 24);
});

test("dexamethasone croup blocks atypical ages, invalid severity and formulation", () => {
  assert.throws(() => dose.dexamethasoneCroup(10, 5, "mildModerate", "tablet"), RangeError);
  assert.throws(() => dose.dexamethasoneCroup(10, 73, "severe", "tablet"), RangeError);
  assert.throws(() => dose.dexamethasoneCroup(10, 24, "asthma", "tablet"), RangeError);
  assert.throws(() => dose.dexamethasoneCroup(10, 24, "severe", "syrup"), RangeError);
  assert.throws(() => dose.dexamethasoneCroup(0, 24, "severe", "injection"), RangeError);
  assert.throws(() => dose.dexamethasoneCroup(Number.POSITIVE_INFINITY, 24, "severe", "injection"), RangeError);
});

test("metronidazole calculates separate oral amoebiasis and giardiasis regimens", () => {
  const amoeba = dose.metronidazole(10, 24, "amoebiasis", 125);
  assert.deepEqual(amoeba, {
    regimen: "amoebiasis", doseMg: 150, volumeMl: 6,
    frequencyPerDay: 3, intervalHours: 8, maxDoseMg: 800,
    dailyMg: 450, durationMinDays: 7, durationMaxDays: 10
  });
  const giardia = dose.metronidazole(10, 24, "giardiasis", 200);
  assert.deepEqual(giardia, {
    regimen: "giardiasis", doseMg: 100, volumeMl: 2.5,
    frequencyPerDay: 3, intervalHours: 8, maxDoseMg: 400,
    dailyMg: 300, durationMinDays: 5, durationMaxDays: 7
  });
  assert.equal(dose.metronidazole(60, 144, "amoebiasis", 200).doseMg, 800);
  assert.equal(dose.metronidazole(50, 144, "giardiasis", 125).doseMg, 400);
});

test("metronidazole rejects neonatal, adult, invalid and unsupported regimens", () => {
  assert.throws(() => dose.metronidazole(3, 0, "amoebiasis", 125), RangeError);
  assert.throws(() => dose.metronidazole(10, 217, "giardiasis", 125), RangeError);
  assert.throws(() => dose.metronidazole(0, 24, "amoebiasis", 125), RangeError);
  assert.throws(() => dose.metronidazole(10, 24, "amoebiasis", 0), RangeError);
  assert.throws(() => dose.metronidazole(10, 24, "anaerobic", 125), RangeError);
  assert.throws(() => dose.metronidazole(10, Number.NaN, "giardiasis", 125), RangeError);
});


test("lansoprazole supports verified 30 mg capsule pediatric GERD regimens", () => {
  const typical = dose.lansoprazolePediatricGerd(35, 120, "typicalGERD", 4);
  assert.deepEqual(typical, {
    indication: "typicalGERD", dailyDoseMg: 30, capsuleStrengthMg: 30,
    capsulesPerDay: 1, durationWeeks: 4, totalCapsules: 28,
    frequency: "once daily before breakfast", route: "oral"
  });
  const erosiveChild = dose.lansoprazolePediatricGerd(36, 132, "erosiveEsophagitis", 8);
  assert.equal(erosiveChild.dailyDoseMg, 30);
  assert.equal(erosiveChild.totalCapsules, 56);
  const erosiveAdolescent = dose.lansoprazolePediatricGerd(45, 180, "erosiveEsophagitis", 4);
  assert.equal(erosiveAdolescent.dailyDoseMg, 30);
  assert.equal(erosiveAdolescent.totalCapsules, 28);
});

test("lansoprazole blocks unsupported weights, ages, indications and durations", () => {
  assert.throws(() => dose.lansoprazolePediatricGerd(30, 120, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(25, 120, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(35, 11, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(35, 216, "erosiveEsophagitis", 8), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(35, 168, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(35, 120, "cough", 4), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(35, 120, "typicalGERD", 8), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(35, 120, "erosiveEsophagitis", 6), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(0, 120, "typicalGERD", 4), RangeError);
  assert.throws(() => dose.lansoprazolePediatricGerd(Infinity, 120, "typicalGERD", 4), RangeError);
});


test("adrenaline anaphylaxis calculates IM 1 mg/mL dose with pediatric and adolescent caps", () => {
  const child = dose.adrenalineAnaphylaxisIM(10, 60, 1);
  assert.equal(child.doseMg, 0.1);
  assert.equal(child.volumeMl, 0.1);
  assert.equal(child.maxDoseMg, 0.3);
  assert.equal(child.route, "IM into the mid-anterolateral thigh");
  assert.equal(child.repeatIntervalMinutes, 5);

  const cappedChild = dose.adrenalineAnaphylaxisIM(40, 120, 1);
  assert.equal(cappedChild.doseMg, 0.3);
  const adolescent = dose.adrenalineAnaphylaxisIM(60, 168, 1);
  assert.equal(adolescent.doseMg, 0.5);
  assert.equal(adolescent.maxDoseMg, 0.5);
});

test("adrenaline anaphylaxis blocks wrong concentration and invalid patient inputs", () => {
  assert.throws(() => dose.adrenalineAnaphylaxisIM(10, 60, 0.1), RangeError);
  assert.throws(() => dose.adrenalineAnaphylaxisIM(0, 60, 1), RangeError);
  assert.throws(() => dose.adrenalineAnaphylaxisIM(Number.NaN, 60, 1), RangeError);
  assert.throws(() => dose.adrenalineAnaphylaxisIM(10, -1, 1), RangeError);
  assert.throws(() => dose.adrenalineAnaphylaxisIM(10, 217, 1), RangeError);
});


test("metamizole oral calculates conservative pediatric dose and suspension volume", () => {
  const r = dose.metamizolePediatricOral(10, 60);
  assert.equal(r.doseMg, 100);
  assert.equal(r.doseMgPerKg, 10);
  assert.equal(r.concentrationMgPerMl, 50);
  assert.equal(r.volumeMl, 2);
  assert.equal(r.maxDailyMg, 400);
  assert.equal(r.maxDosesPer24Hours, 4);

  const capped = dose.metamizolePediatricOral(60, 168);
  assert.equal(capped.doseMg, 500);
  assert.equal(capped.maxDailyMg, 2000);
  assert.equal(capped.volumeMl, 10);
});

test("metamizole oral blocks contraindicated age and weight boundaries", () => {
  assert.throws(() => dose.metamizolePediatricOral(5, 2), RangeError);
  assert.throws(() => dose.metamizolePediatricOral(5, 3), RangeError);
  assert.throws(() => dose.metamizolePediatricOral(5, 168), RangeError);
  assert.throws(() => dose.metamizolePediatricOral(5, 169), RangeError);
  assert.throws(() => dose.metamizolePediatricOral(5, 60), RangeError);
  assert.throws(() => dose.metamizolePediatricOral(0, 60), RangeError);
  assert.throws(() => dose.metamizolePediatricOral(Number.NaN, 60), RangeError);
});
