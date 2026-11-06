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

  function ambroxol(ageMonths, strengthMgPer5Ml) {
    if (!Number.isFinite(ageMonths) || ageMonths < 24 || ageMonths > 144) {
      throw new RangeError("ageMonths must be between 24 and 144 months");
    }
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    const doseMg = ageMonths < 72 ? 7.5 : 15;
    const mgPerMl = strengthMgPer5Ml / 5;
    return {
      doseMg,
      volumeMl: doseMg / mgPerMl,
      frequencyMinPerDay: ageMonths < 72 ? 3 : 2,
      frequencyMaxPerDay: ageMonths < 72 ? 3 : 3
    };
  }

  function zinc(ageMonths, regimen) {
    if (!Number.isFinite(ageMonths) || ageMonths < 0 || ageMonths > 120) {
      throw new RangeError("ageMonths must be between 0 and 120 months");
    }
    if (regimen === "indonesia") {
      if (ageMonths > 60) {
        throw new RangeError("Indonesian under-five regimen applies through 60 months");
      }
      return {
        dailyMg: ageMonths < 6 ? 10 : 20,
        durationMinDays: 10,
        durationMaxDays: 10
      };
    }
    if (regimen === "who2024") {
      return {
        dailyMg: 5,
        durationMinDays: 10,
        durationMaxDays: 14
      };
    }
    throw new RangeError("regimen must be indonesia or who2024");
  }

  // Age-based nebulized salbutamol reference doses; this does not determine severity or repeat-treatment need.
  function salbutamolNebulized(ageMonths, strengthMgPerMl, selectedDoseMg) {
    if (!Number.isFinite(ageMonths) || ageMonths < 12) {
      throw new RangeError("ageMonths must be at least 12 months");
    }
    requirePositive(strengthMgPerMl, "strengthMgPerMl");
    let minDoseMg;
    let maxDoseMg;
    if (ageMonths < 72) {
      minDoseMg = maxDoseMg = 2.5;
    } else if (ageMonths < 144) {
      minDoseMg = 2.5;
      maxDoseMg = 5;
    } else {
      minDoseMg = maxDoseMg = 5;
    }
    const doseMg = selectedDoseMg === undefined ? minDoseMg : selectedDoseMg;
    if (!Number.isFinite(doseMg) || doseMg < minDoseMg || doseMg > maxDoseMg) {
      throw new RangeError("selectedDoseMg is outside the age-based dose range");
    }
    return {
      minDoseMg,
      maxDoseMg,
      doseMg,
      volumeMl: doseMg / strengthMgPerMl,
      frequency: "clinical reassessment required"
    };
  }

  // ORS: Plan A replacement after each watery stool; Plan B for some dehydration.
  // Plan B volume is delivered over 3 hours, followed by clinical reassessment.
  function oralit(weightKg, plan) {
    requirePositive(weightKg, "weightKg");
    if (plan === "planA") {
      return { plan, afterEachStoolMl: weightKg * 10, instruction: "give after each watery stool; continue breastfeeding and feeding" };
    }
    if (plan === "planB") {
      return { plan, totalMl: weightKg * 75, durationHours: 3, instruction: "give gradually; reassess hydration after 3 hours" };
    }
    throw new RangeError("plan must be planA or planB");
  }

  // Conservative age bands for immediate-release oral chlorpheniramine syrup 2 mg/5 mL.
  // Under 2 years is blocked; follow local product labeling and avoid routine use for common cold.
  function chlorpheniramine(ageMonths, strengthMgPer5Ml) {
    if (!Number.isFinite(ageMonths) || ageMonths < 24) {
      throw new RangeError("chlorpheniramine is not enabled below 2 years");
    }
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    let doseMg;
    let maxDailyMg;
    if (ageMonths < 72) {
      doseMg = 1;
      maxDailyMg = 6;
    } else if (ageMonths < 144) {
      doseMg = 2;
      maxDailyMg = 12;
    } else {
      doseMg = 4;
      maxDailyMg = 24;
    }
    const mgPerMl = strengthMgPer5Ml / 5;
    return {
      doseMg,
      volumeMl: doseMg / mgPerMl,
      intervalHoursMin: 4,
      intervalHoursMax: 6,
      maxDailyMg,
      maxDosesPerDay: maxDailyMg / doseMg
    };
  }


  // Injectable antibiotic reference calculations for children beyond the neonatal period.
  // These are dose calculations only; indication, cultures, allergy, organ function and local protocols remain clinician decisions.
  function ceftriaxoneInjection(weightKg, ageMonths, regimen) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 2 || ageMonths > 216) {
      throw new RangeError("ceftriaxone calculator is restricted to age 2 months through 18 years");
    }
    if (weightKg >= 50) throw new RangeError("weight >=50 kg requires an adult dosing protocol");
    if (regimen !== "standard" && regimen !== "meningitis") {
      throw new RangeError("regimen must be standard or meningitis");
    }
    const dailyMg = Math.min(weightKg * (regimen === "meningitis" ? 100 : 80), 4000);
    const minimumDailyMg = regimen === "standard" ? Math.min(weightKg * 50, 4000) : dailyMg;
    const divisions = regimen === "meningitis" ? 2 : 1;
    return {
      regimen,
      dailyMinMg: minimumDailyMg,
      dailyMaxMg: dailyMg,
      doseMinMg: minimumDailyMg / divisions,
      doseMaxMg: dailyMg / divisions,
      divisions,
      intervalHours: regimen === "meningitis" ? 12 : 24,
      maxDailyMg: 4000,
      route: "IV; IM only when appropriate to the indication and product instructions"
    };
  }

  function cefotaximeInjection(weightKg, ageMonths, regimen, divisions) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 2 || ageMonths > 144) {
      throw new RangeError("cefotaxime calculator is restricted to age 2 months through 12 years");
    }
    if (weightKg >= 50) throw new RangeError("weight >=50 kg requires an adult dosing protocol");
    if (regimen !== "standard" && regimen !== "meningitis") {
      throw new RangeError("regimen must be standard or meningitis");
    }
    const dosesPerDay = divisions === undefined ? (regimen === "meningitis" ? 6 : 4) : divisions;
    if (![4, 6].includes(dosesPerDay)) {
      throw new RangeError("divisions must be 4 or 6");
    }
    const minDailyMg = weightKg * (regimen === "meningitis" ? 200 : 50);
    const maxDailyMg = Math.min(weightKg * (regimen === "meningitis" ? 300 : 180), 12000, 2000 * dosesPerDay);
    if (minDailyMg > maxDailyMg) throw new RangeError("selected frequency cannot deliver the minimum daily dose within the 2 g per-dose limit; use 6 divided doses or specialist advice");
    const doseMinMg = minDailyMg / dosesPerDay;
    const doseMaxMg = maxDailyMg / dosesPerDay;
    return {
      regimen,
      dailyMinMg: minDailyMg,
      dailyMaxMg: maxDailyMg,
      doseMinMg,
      doseMaxMg,
      divisions: dosesPerDay,
      intervalHours: 24 / dosesPerDay,
      maxDoseMg: 2000,
      maxDailyMg: 12000,
      route: "IV; IM only when appropriate to the indication and product instructions"
    };
  }

  // Initial extended-interval dose only. Subsequent gentamicin doses require levels and renal assessment.
  function gentamicinInitial(weightKg, ageMonths, strengthMgPerMl) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 3 || ageMonths > 216) {
      throw new RangeError("gentamicin initial-dose calculator is restricted to age 3 months through 18 years");
    }
    if (weightKg >= 50) throw new RangeError("weight >=50 kg requires an adult dosing protocol");
    requirePositive(strengthMgPerMl, "strengthMgPerMl");
    const doseMg = weightKg * 7;
    return {
      doseMg,
      volumeMl: doseMg / strengthMgPerMl,
      intervalHours: null,
      frequency: "initial dose only",
      monitoring: "Check renal function and obtain gentamicin therapeutic drug monitoring before any subsequent dose; do not use this result to schedule repeat doses."
    };
  }

  const api = Object.freeze({ paracetamol, ibuprofen, cefixime, amoxicillin, cefadroxil, cetirizine, ambroxol, zinc, salbutamolNebulized, oralit, chlorpheniramine, ceftriaxoneInjection, cefotaximeInjection, gentamicinInitial });
  root.MedoraDoseEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
