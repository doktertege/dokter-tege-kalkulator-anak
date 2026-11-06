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

  // Mirrors the three existing MEDORA regimens. It does not select an indication.
  function amoxicillin(weightKg, strengthMgPer5Ml, regimen) {
    requirePositive(weightKg, "weightKg");
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    if (!["tonsillitis", "aom", "gas"].includes(regimen)) {
      throw new RangeError("regimen must be tonsillitis, aom, or gas");
    }

    let dailyLowMg;
    let dailyHighMg;
    let divisions;
    let maxDailyMg;

    if (regimen === "tonsillitis") {
      dailyLowMg = dailyHighMg = Math.min(weightKg * 50, 1000);
      divisions = 2;
      maxDailyMg = 1000;
    } else if (regimen === "aom") {
      dailyLowMg = weightKg * 80;
      dailyHighMg = weightKg * 90;
      divisions = 2;
      maxDailyMg = 3000;
      dailyLowMg = Math.min(dailyLowMg, maxDailyMg);
      dailyHighMg = Math.min(dailyHighMg, maxDailyMg);
    } else {
      dailyLowMg = dailyHighMg = Math.min(weightKg * 50, 1000);
      divisions = 1;
      maxDailyMg = 1000;
    }

    const mgPerMl = strengthMgPer5Ml / 5;
    const perDoseLowMg = dailyLowMg / divisions;
    const perDoseHighMg = dailyHighMg / divisions;
    return {
      dailyLowMg,
      dailyHighMg,
      perDoseLowMg,
      perDoseHighMg,
      volumeLowMl: perDoseLowMg / mgPerMl,
      volumeHighMl: perDoseHighMg / mgPerMl,
      divisions,
      maxDailyMg
    };
  }

  function cefadroxil(weightKg, strengthMgPer5Ml) {
    requirePositive(weightKg, "weightKg");
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    const dailyMg = Math.min(weightKg * 30, 1000);
    const mgPerMl = strengthMgPer5Ml / 5;
    return {
      dailyMg,
      perDoseMg: dailyMg,
      volumeMl: dailyMg / mgPerMl,
      divisions: 1,
      maxDailyMg: 1000
    };
  }

  function cetirizine(ageMonths, strengthMgPer5Ml) {
    if (!Number.isFinite(ageMonths) || ageMonths < 6) {
      throw new RangeError("ageMonths must be at least 6 months");
    }
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    let dailyMg;
    if (ageMonths < 72) dailyMg = 2.5;
    else if (ageMonths < 144) dailyMg = 5;
    else dailyMg = 10;
    const mgPerMl = strengthMgPer5Ml / 5;
    return {
      dailyMg,
      volumeMl: dailyMg / mgPerMl,
      maxDailyMg: ageMonths < 24 ? 2.5 : ageMonths < 72 ? 5 : 10,
      frequencyPerDay: 1
    };
  }

  const api = Object.freeze({ paracetamol, ibuprofen, cefixime, amoxicillin, cefadroxil, cetirizine });
  root.MedoraDoseEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
