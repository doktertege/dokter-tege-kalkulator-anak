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
