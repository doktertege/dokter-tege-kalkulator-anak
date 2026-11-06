(function (root) {
  "use strict";

  function requirePositive(value, label) {
    if (!Number.isFinite(value) || value <= 0) {
      throw new RangeError(label + " must be a positive finite number");
    }
  }

  function paracetamol(weightKg, strengthMgPer5Ml) {
    requirePositive(weightKg, "weightKg");
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    const lowMg = Math.min(weightKg * 10, 1000);
    const highMg = Math.min(weightKg * 15, 1000);
    const maxDailyMg = Math.min(weightKg * 60, 4000);
    const mgPerMl = strengthMgPer5Ml / 5;
    return {
      lowMg,
      highMg,
      lowMl: lowMg / mgPerMl,
      highMl: highMg / mgPerMl,
      maxDailyMg
    };
  }

  function ibuprofen(weightKg, strengthMgPer5Ml) {
    requirePositive(weightKg, "weightKg");
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    const maxDailyMg = Math.min(weightKg * 40, 1200);
    const lowMg = Math.min(weightKg * 5, 400);
    const highMg = Math.min(weightKg * 10, 400);
    const maxDosesAtHighDose = Math.min(4, Math.floor(maxDailyMg / highMg));
    const mgPerMl = strengthMgPer5Ml / 5;
    return {
      lowMg,
      highMg,
      lowMl: lowMg / mgPerMl,
      highMl: highMg / mgPerMl,
      maxDailyMg,
      maxDosesAtHighDose
    };
  }

  function cefixime(weightKg, strengthMgPer5Ml, divisions) {
    requirePositive(weightKg, "weightKg");
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    const dosesPerDay = divisions === undefined ? 2 : divisions;
    if (dosesPerDay !== 1 && dosesPerDay !== 2) {
      throw new RangeError("divisions must be 1 or 2");
    }
    const dailyMg = Math.min(weightKg * 8, 400);
    const perDoseMg = dailyMg / dosesPerDay;
    const mgPerMl = strengthMgPer5Ml / 5;
    return {
      dailyMg,
      perDoseMg,
      volumeMl: perDoseMg / mgPerMl,
      divisions: dosesPerDay
    };
  }

  const api = Object.freeze({ paracetamol, ibuprofen, cefixime });
  root.MedoraDoseEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
