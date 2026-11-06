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

  const api = Object.freeze({ paracetamol, ibuprofen });
  root.MedoraDoseEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
