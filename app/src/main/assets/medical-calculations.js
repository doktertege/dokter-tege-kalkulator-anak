/* Validated adult clinical metrics for the offline MEDORA workspace. */
(function (root) {
  "use strict";

  function numberOrNull(value, label) {
    if (value === "" || value === null || value === undefined) return null;
    const parsed = Number(value);
    if (!Number.isFinite(parsed)) throw new Error(label + " harus berupa angka yang valid.");
    return parsed;
  }

  function fmt(value) {
    return Number(value.toFixed(2)).toString();
  }

  function calculateMedicalMetrics(input) {
    const age = numberOrNull(input.age, "Usia");
    const weight = numberOrNull(input.weight, "Berat badan");
    const height = numberOrNull(input.height, "Tinggi badan");
    const creatinine = numberOrNull(input.creatinine, "Kreatinin");
    const systolic = numberOrNull(input.systolic, "Tekanan sistolik");
    const diastolic = numberOrNull(input.diastolic, "Tekanan diastolik");
    const heartRate = numberOrNull(input.heartRate, "Frekuensi nadi");
    const metrics = [];

    if ((weight === null) !== (height === null)) {
      throw new Error("Isi berat badan dan tinggi badan secara bersamaan untuk menghitung BMI dan BSA.");
    }
    if (weight !== null) {
      if (weight <= 0 || height <= 0) throw new Error("Berat badan dan tinggi badan harus lebih dari nol.");
      const heightM = height / 100;
      metrics.push(["BMI", fmt(weight / (heightM * heightM)) + " kg/m²"]);
      metrics.push(["BSA (Mosteller)", fmt(Math.sqrt((height * weight) / 3600)) + " m²"]);
    }

    if (creatinine !== null) {
      if (creatinine <= 0) throw new Error("Kreatinin serum harus lebih dari nol.");
      if (age === null || age < 18 || age > 120 || !Number.isInteger(age)) {
        throw new Error("Untuk eGFR CKD-EPI 2021, masukkan usia dewasa 18–120 tahun dalam bilangan bulat.");
      }
      if (input.sex !== "female" && input.sex !== "male") {
        throw new Error("Pilih jenis kelamin untuk perhitungan eGFR.");
      }
      const female = input.sex === "female";
      const k = female ? 0.7 : 0.9;
      const alpha = female ? -0.241 : -0.302;
      const ratio = creatinine / k;
      const egfr = 142 * Math.pow(Math.min(ratio, 1), alpha) *
        Math.pow(Math.max(ratio, 1), -1.2) * Math.pow(0.9938, age) *
        (female ? 1.012 : 1);
      if (!Number.isFinite(egfr)) throw new Error("eGFR tidak dapat dihitung dari input ini.");
      const category = egfr >= 90 ? "G1 (≥90)" : egfr >= 60 ? "G2 (60–89)" :
        egfr >= 45 ? "G3a (45–59)" : egfr >= 30 ? "G3b (30–44)" :
        egfr >= 15 ? "G4 (15–29)" : "G5 (<15)";
      metrics.push(["eGFR CKD-EPI 2021", Math.round(egfr) + " mL/min/1.73 m²"]);
      metrics.push(["Kategori GFR", category]);
    }

    if ((systolic === null) !== (diastolic === null)) {
      throw new Error("Isi tekanan sistolik dan diastolik secara bersamaan.");
    }
    if (systolic !== null) {
      if (systolic <= 0 || diastolic <= 0 || systolic < diastolic) {
        throw new Error("Tekanan darah tidak valid. Pastikan sistolik ≥ diastolik dan keduanya lebih dari nol.");
      }
      metrics.push(["MAP", fmt((systolic + 2 * diastolic) / 3) + " mmHg"]);
      metrics.push(["Tekanan nadi", fmt(systolic - diastolic) + " mmHg"]);
    }

    if (heartRate !== null) {
      if (heartRate <= 0 || heartRate > 300) throw new Error("Frekuensi nadi harus antara 1–300 kali/menit.");
      if (systolic === null || systolic <= 0) {
        throw new Error("Masukkan tekanan sistolik yang valid untuk menghitung Shock Index.");
      }
      const index = heartRate / systolic;
      metrics.push(["Shock Index", fmt(index) + (index >= 1 ? " (meningkat)" : "")]);
    }

    if (!metrics.length) {
      throw new Error("Masukkan data BB + TB, kreatinin + usia, tekanan darah, atau nadi + sistolik.");
    }
    return metrics;
  }

  root.MEDORA_MEDICAL_CALCULATIONS = { calculateMedicalMetrics };
  if (typeof module !== "undefined" && module.exports) {
    module.exports = { calculateMedicalMetrics };
  }
})(typeof window !== "undefined" ? window : globalThis);
