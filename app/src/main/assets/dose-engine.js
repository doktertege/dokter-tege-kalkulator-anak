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

  // Loratadine syrup: product-label pediatric dose by age and weight.
  // Under 2 years is excluded; severe hepatic impairment requires a separate regimen.
  function loratadine(weightKg, ageMonths, strengthMgPer5Ml) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 24 || ageMonths > 216) {
      throw new RangeError("loratadine is restricted to age 2 through 18 years");
    }
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    const dailyMg = ageMonths <= 144 && weightKg <= 30 ? 5 : 10;
    return {
      dailyMg,
      volumeMl: dailyMg / (strengthMgPer5Ml / 5),
      frequencyPerDay: 1,
      maxDailyMg: 10
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

  // Single oral dose to facilitate oral rehydration in selected children with acute gastroenteritis.
  // Not a routine antiemetic regimen; do not schedule repeat doses.
  function ondansetronGastroenteritis(weightKg, ageMonths, strengthMgPer5Ml) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 6 || ageMonths > 216) {
      throw new RangeError("ondansetron gastroenteritis use is restricted to age 6 months through 18 years");
    }
    if (weightKg < 8) throw new RangeError("ondansetron gastroenteritis use is not enabled below 8 kg");
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    const doseMg = Math.min(weightKg * 0.15, 8);
    return { doseMg, volumeMl: doseMg / (strengthMgPer5Ml / 5), frequency: "single oral dose only", maxDoseMg: 8, rehydrationDelayMin: 15, rehydrationDelayMax: 30 };
  }

  // Rectal rescue dose for an ongoing convulsive seizure; not for routine seizure prophylaxis.
  // Conservative single-dose ceiling; account for all benzodiazepines already administered.
  function diazepamRectal(weightKg, ageMonths, strengthMgPerMl) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 1 || ageMonths > 216) {
      throw new RangeError("rectal diazepam calculator is restricted to age 1 month through 18 years");
    }
    requirePositive(strengthMgPerMl, "strengthMgPerMl");
    const doseMg = Math.min(weightKg * 0.5, 10);
    return {
      doseMg,
      volumeMl: doseMg / strengthMgPerMl,
      frequency: "single rescue dose; reassess immediately",
      maxSingleDoseMg: 10,
      doseMgPerKg: doseMg / weightKg
    };
  }


  // Oral metronidazole regimens for selected protozoal infections only.
  // Neonates and IV/anaerobic indications require separate protocols.
  function metronidazole(weightKg, ageMonths, regimen, strengthMgPer5Ml) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 1 || ageMonths > 216) {
      throw new RangeError("oral metronidazole calculator is restricted to age 1 month through 18 years");
    }
    requirePositive(strengthMgPer5Ml, "strengthMgPer5Ml");
    let doseMg, maxDoseMg, durationMinDays, durationMaxDays;
    if (regimen === "amoebiasis") {
      doseMg = Math.min(weightKg * 15, 800);
      maxDoseMg = 800;
      durationMinDays = 7;
      durationMaxDays = 10;
    } else if (regimen === "giardiasis") {
      doseMg = Math.min(weightKg * 10, 400);
      maxDoseMg = 400;
      durationMinDays = 5;
      durationMaxDays = 7;
    } else {
      throw new RangeError("regimen must be amoebiasis or giardiasis");
    }
    return {
      regimen, doseMg, volumeMl: doseMg / (strengthMgPer5Ml / 5),
      frequencyPerDay: 3, intervalHours: 8, maxDoseMg,
      dailyMg: doseMg * 3, durationMinDays, durationMaxDays
    };
  }


  // Single-dose dexamethasone for clinically diagnosed pediatric croup only.
  // Lower dose for mild-moderate disease; standard 0.6 mg/kg for severe disease.
  function dexamethasoneCroup(weightKg, ageMonths, severity, formulation) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 6 || ageMonths > 72) {
      throw new RangeError("croup calculator is restricted to age 6 months through 6 years; atypical age requires evaluation for alternative diagnoses");
    }
    if (severity !== "mildModerate" && severity !== "severe") {
      throw new RangeError("severity must be mildModerate or severe");
    }
    if (formulation !== "tablet" && formulation !== "injection") {
      throw new RangeError("formulation must be tablet or injection");
    }
    const doseMg = Math.min(weightKg * (severity === "severe" ? 0.6 : 0.15), 12);
    return {
      doseMg,
      doseMgPerKg: severity === "severe" ? 0.6 : 0.15,
      formulation,
      tabletCount: formulation === "tablet" ? doseMg / 0.5 : null,
      injectionVolumeMl: formulation === "injection" ? doseMg / 5 : null,
      frequency: "single dose only",
      maxDoseMg: 12,
      route: formulation === "tablet" ? "oral; preferred when tolerated" : "IM/IV only when oral route is not feasible and clinically indicated"
    };
  }


  // Initial IV dose for severe pediatric acute asthma when oral corticosteroid is not feasible.
  // This is not a complete course or a general-purpose methylprednisolone calculator.
  function methylprednisoloneAsthmaIV(weightKg, ageMonths) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 12 || ageMonths > 216) {
      throw new RangeError("methylprednisolone asthma calculator is restricted to age 1 through 18 years");
    }
    const doseMg = Math.min(weightKg, 60);
    return {
      doseMg,
      doseMgPerKg: doseMg / weightKg,
      maxDoseMg: 60,
      route: "IV",
      frequency: "initial dose; if admitted, repeat only under a monitored inpatient asthma protocol (commonly 1 mg/kg/dose every 6 hours on day 1, max 60 mg/dose)",
      scope: "severe acute asthma when oral corticosteroid is not feasible; not for routine mild exacerbation"
    };
  }


  // Oral prednisone-equivalent course for clinically assessed moderate/severe acute asthma.
  // Restricted to children 1–11 years; adolescent dosing follows a separate age-based protocol.
  function prednisoneAsthmaOral(weightKg, ageMonths, doseMgPerKg, durationDays, strengthMg) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 12 || ageMonths >= 144) {
      throw new RangeError("prednisone asthma calculator is restricted to age 1 through 11 years");
    }
    if (doseMgPerKg !== 1 && doseMgPerKg !== 2) {
      throw new RangeError("doseMgPerKg must be 1 or 2");
    }
    if (![3, 4, 5].includes(durationDays)) {
      throw new RangeError("durationDays must be 3, 4 or 5");
    }
    if (strengthMg !== 5) {
      throw new RangeError("only the verified 5 mg tablet strength is supported");
    }
    const maxDailyMg = ageMonths < 24 ? 20 : ageMonths < 72 ? 30 : 40;
    const dailyDoseMg = Math.min(weightKg * doseMgPerKg, maxDailyMg);
    return {
      dailyDoseMg,
      doseMgPerKg,
      maxDailyMg,
      durationDays,
      totalCourseMg: dailyDoseMg * durationDays,
      tabletStrengthMg: strengthMg,
      tabletsPerDayEquivalent: dailyDoseMg / strengthMg,
      totalTabletsEquivalent: (dailyDoseMg * durationDays) / strengthMg,
      frequency: "once daily, preferably in the morning",
      route: "oral",
      taperRequired: false
    };
  }


  // Omeprazole delayed-release 20 mg capsule: labeled pediatric dose for patients >=20 kg.
  // Restrict to typical acid GERD symptoms or endoscopy-proven erosive esophagitis.
  function omeprazolePediatricGerd(weightKg, ageMonths, indication, durationWeeks) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 12 || ageMonths > 192) {
      throw new RangeError("omeprazole capsule calculator is restricted to age 1 through 16 years");
    }
    if (weightKg < 20) {
      throw new RangeError("20 mg capsule dose is only supported from 20 kg; lower weights need a verified pediatric formulation");
    }
    if (indication !== "typicalGERD" && indication !== "erosiveEsophagitis") {
      throw new RangeError("unsupported omeprazole indication");
    }
    if (indication === "typicalGERD" && durationWeeks !== 4) {
      throw new RangeError("typical GERD trial duration is 4 weeks before reassessment");
    }
    if (indication === "erosiveEsophagitis" && durationWeeks !== 4 && durationWeeks !== 8) {
      throw new RangeError("erosive esophagitis duration must be 4 or 8 weeks");
    }
    return {
      indication,
      dailyDoseMg: 20,
      capsuleStrengthMg: 20,
      capsulesPerDay: 1,
      durationWeeks,
      totalCapsules: durationWeeks * 7,
      frequency: "once daily before breakfast",
      route: "oral"
    };
  }


  // Lansoprazole delayed-release 30 mg capsule: only regimens matching verified local strength.
  // Typical GERD symptoms are supported for ages 1-11; adolescents are enabled only for erosive esophagitis.
  function lansoprazolePediatricGerd(weightKg, ageMonths, indication, durationWeeks) {
    requirePositive(weightKg, "weightKg");
    if (!Number.isFinite(ageMonths) || ageMonths < 12 || ageMonths >= 216) {
      throw new RangeError("lansoprazole capsule calculator is restricted to age 1 through 17 years");
    }
    if (weightKg <= 30) {
      throw new RangeError("30 mg capsule regimen is supported only above 30 kg; do not split capsule granules or estimate a lower dose");
    }
    if (indication !== "typicalGERD" && indication !== "erosiveEsophagitis") {
      throw new RangeError("unsupported lansoprazole indication");
    }
    if (indication === "typicalGERD" && ageMonths >= 144) {
      throw new RangeError("adolescent non-erosive GERD requires 15 mg, which is not enabled because a local 15 mg formulation was not verified");
    }
    if (indication === "typicalGERD" && durationWeeks !== 4) {
      throw new RangeError("typical GERD trial duration is 4 weeks before reassessment");
    }
    if (indication === "erosiveEsophagitis" && durationWeeks !== 4 && durationWeeks !== 8) {
      throw new RangeError("erosive esophagitis duration must be 4 or 8 weeks");
    }
    return {
      indication,
      dailyDoseMg: 30,
      capsuleStrengthMg: 30,
      capsulesPerDay: 1,
      durationWeeks,
      totalCapsules: durationWeeks * 7,
      frequency: "once daily before breakfast",
      route: "oral"
    };
  }

  const api = Object.freeze({ lansoprazolePediatricGerd, omeprazolePediatricGerd, prednisoneAsthmaOral, methylprednisoloneAsthmaIV, dexamethasoneCroup, metronidazole, diazepamRectal, ondansetronGastroenteritis, paracetamol, ibuprofen, cefixime, amoxicillin, cefadroxil, cetirizine, loratadine, ambroxol, zinc, salbutamolNebulized, oralit, chlorpheniramine, ceftriaxoneInjection, cefotaximeInjection, gentamicinInitial });
  root.MedoraDoseEngine = api;
  if (typeof module !== "undefined" && module.exports) module.exports = api;
})(typeof globalThis !== "undefined" ? globalThis : this);
