"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const { calculateMedicalMetrics } = require("../app/src/main/assets/medical-calculations.js");

test("medical calculator returns BMI and Mosteller BSA from valid anthropometry", () => {
  const result = calculateMedicalMetrics({ weight: "70", height: "175" });
  assert.deepEqual(result, [
    ["BMI", "22.86 kg/m²"],
    ["BSA (Mosteller)", "1.84 m²"]
  ]);
});

test("medical calculator returns CKD-EPI 2021 eGFR for an adult", () => {
  const result = calculateMedicalMetrics({
    age: "35", sex: "male", creatinine: "1.0"
  });
  assert.equal(result[0][0], "eGFR CKD-EPI 2021");
  assert.match(result[0][1], /^\d+ mL\/min\/1\.73 m²$/);
  assert.equal(result[1][0], "Kategori GFR");
});

test("medical calculator returns MAP, pulse pressure, and shock index", () => {
  const result = calculateMedicalMetrics({
    systolic: "120", diastolic: "80", heartRate: "90"
  });
  assert.deepEqual(result, [
    ["MAP", "93.33 mmHg"],
    ["Tekanan nadi", "40 mmHg"],
    ["Shock Index", "0.75"]
  ]);
});

test("medical calculator rejects incomplete anthropometry and blood pressure pairs", () => {
  assert.throws(() => calculateMedicalMetrics({ weight: "60" }), /secara bersamaan/);
  assert.throws(() => calculateMedicalMetrics({ systolic: "120" }), /sistolik dan diastolik/);
});

test("medical calculator rejects invalid blood pressure and missing systolic for shock index", () => {
  assert.throws(() => calculateMedicalMetrics({ systolic: "70", diastolic: "90" }), /Tekanan darah tidak valid/);
  assert.throws(() => calculateMedicalMetrics({ heartRate: "100" }), /tekanan sistolik/);
});

test("medical calculator requires adult age and sex when creatinine is supplied", () => {
  assert.throws(() => calculateMedicalMetrics({ age: "17", sex: "female", creatinine: "0.8" }), /usia dewasa/);
  assert.throws(() => calculateMedicalMetrics({ age: "35", creatinine: "0.8" }), /Pilih jenis kelamin/);
});

test("medical calculator rejects zero, negative, and non-finite measurements", () => {
  assert.throws(() => calculateMedicalMetrics({ weight: "0", height: "170" }), /lebih dari nol/);
  assert.throws(() => calculateMedicalMetrics({ creatinine: "-1", age: "35", sex: "male" }), /lebih dari nol/);
  assert.throws(() => calculateMedicalMetrics({ systolic: "NaN", diastolic: "80" }), /angka yang valid/);
});
