"use strict";

const test = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");

const assets = path.join(__dirname, "../app/src/main/assets");
const context = { window: {} };
vm.runInNewContext(fs.readFileSync(path.join(assets, "database.js"), "utf8"), context);
const database = context.window.MEDORA_DATABASE;
const engine = require(path.join(assets, "dose-engine.js"));

test("requested medicines have structured profiles with traceable source metadata", () => {
  assert.equal(database.metadata.medicineProfiles.schemaVersion, "1.1");
  assert.equal(database.metadata.medicineProfiles.reviewedOn, "2026-11-06");
  assert.equal(Object.keys(database.metadata.medicineProfiles.sources).length, 15);
  for (const name of [
    "CTM (Chlorpheniramine)", "Oralit", "Ceftriaxone", "Cefotaxime", "Gentamicin",
    "Cendo Xitrol Tetes Mata", "Cendo Xitrol Salep Mata",
    "Erlamycetin Tetes Mata", "Erlamycetin Tetes Telinga", "Erlamycetin Salep Mata"
  ]) {
    const profile = database.medicineProfiles[name];
    assert.ok(profile, name + " profile should exist");
    assert.ok(profile.activeIngredient, name + " active ingredient should be documented");
    assert.ok(Array.isArray(profile.dosageForms) && profile.dosageForms.length > 0);
    assert.ok(Array.isArray(profile.route) && profile.route.length > 0);
    assert.ok(Array.isArray(profile.keyWarnings) && profile.keyWarnings.length >= 2);
    assert.ok(["prescription_only", "non_prescription", "verify_local_label", "varies_by_product"].includes(profile.prescriptionStatus));
  }
});

test("dose engine links point to real exported functions; topical profiles never expose a dose calculator", () => {
  const topicalNames = [
    "Cendo Xitrol Tetes Mata", "Cendo Xitrol Salep Mata",
    "Erlamycetin Tetes Mata", "Erlamycetin Tetes Telinga", "Erlamycetin Salep Mata"
  ];
  for (const [name, profile] of Object.entries(database.medicineProfiles)) {
    if (profile.doseEngineFunction) {
      assert.equal(typeof engine[profile.doseEngineFunction], "function", name + " dose engine function");
    }
    if (topicalNames.includes(name)) assert.equal(profile.doseEngineFunction, null, name + " must not have a dose calculator");
  }
});

test("injectable products warn about product-specific reconstitution and monitoring", () => {
  for (const name of ["Ceftriaxone", "Cefotaxime", "Gentamicin"]) {
    const profile = database.medicineProfiles[name];
    assert.match(profile.formulationNote, /konsentrasi|vial|ampul/i);
    assert.ok(profile.keyWarnings.length >= 3);
  }
});

test("oralit requires exact sachet dilution and does not assume all sachets are equivalent", () => {
  const profile = database.medicineProfiles.Oralit;
  assert.match(profile.formulationNote, /volume/i);
  assert.match(profile.keyWarnings.join(" "), /tepat pada volume/i);
});

test("every profile field has explicit provenance and every source reference resolves", () => {
  const metadata = database.metadata.medicineProfiles;
  const fields = ["activeIngredient", "dosageForms", "route", "formulationNote", "strength", "prescriptionStatus", "keyWarnings", "doseEngineFunction"];
  for (const [name, profile] of Object.entries(database.medicineProfiles)) {
    assert.ok(profile.provenance, name + " provenance");
    for (const field of fields) {
      const entry = profile.provenance[field];
      assert.ok(entry, name + "." + field + " provenance entry");
      assert.ok(["source_linked_reference", "pending_product_specific_verification", "verified_by_local_regression_test"].includes(entry.status));
      assert.ok(Array.isArray(entry.sourceRefs));
      for (const sourceId of entry.sourceRefs) {
        assert.ok(metadata.sources[sourceId], name + "." + field + " source " + sourceId + " must resolve");
        assert.ok(metadata.sources[sourceId].url.startsWith("https://"));
      }
      if (entry.status === "source_linked_reference") assert.ok(entry.sourceRefs.length > 0);
      if (entry.status === "pending_product_specific_verification") assert.equal(entry.sourceRefs.length, 0);
    }
    assert.equal(profile.provenance.doseEngineFunction.status, "verified_by_local_regression_test");
  }
  assert.ok(database.medicineProfiles.Oralit.provenance.formulationNote.sourceRefs.includes("ygi_oralit"));
  assert.ok(database.medicineProfiles["Cendo Xitrol Tetes Mata"].provenance.activeIngredient.sourceRefs.includes("bpom_cendo_xitrol_drop"));
  assert.ok(database.medicineProfiles["Erlamycetin Tetes Mata"].provenance.activeIngredient.status === "pending_product_specific_verification");
});


test("paracetamol and ibuprofen profiles have BPOM-linked formulation references and valid dose-engine exports", () => {
  for (const name of ["Paracetamol", "Ibuprofen"]) {
    const profile = database.medicineProfiles[name];
    assert.ok(profile, name + " profile should exist");
    assert.ok(profile.provenance);
    assert.equal(typeof engine[profile.doseEngineFunction], "function");
    for (const field of ["activeIngredient", "dosageForms", "route", "formulationNote", "strength"]) {
      const provenance = profile.provenance[field];
      assert.equal(provenance.status, "source_linked_reference", name + "." + field);
      assert.ok(provenance.sourceRefs.length > 0);
    }
    for (const field of ["prescriptionStatus", "keyWarnings"]) {
      assert.equal(profile.provenance[field].status, "pending_product_specific_verification");
      assert.equal(profile.provenance[field].sourceRefs.length, 0);
    }
  }
  assert.match(database.medicineProfiles.Paracetamol.formulationNote, /120 mg\/5 mL.*160 mg\/5 mL|160 mg\/5 mL.*120 mg\/5 mL/);
  assert.match(database.medicineProfiles.Ibuprofen.formulationNote, /100 mg\/5 mL/);
});

test("medicine profile coverage metadata matches the expanded structured profile set", () => {
  const coverage = database.metadata.medicineProfiles.coverage;
  assert.equal(coverage.Paracetamol, "structured_profile");
  assert.equal(coverage.Ibuprofen, "structured_profile");
  assert.equal(Object.values(coverage).filter(value => value === "structured_profile").length, 16);
  assert.equal(Object.keys(database.medicineProfiles).length, 16);
});


test("cetirizine and amoxicillin profiles use BPOM-linked Indonesian formulations and real dose-engine exports", () => {
  const cetirizine = database.medicineProfiles.Cetirizine;
  const amoxicillin = database.medicineProfiles.Amoxicillin;
  for (const [name, profile] of [["Cetirizine", cetirizine], ["Amoxicillin", amoxicillin]]) {
    assert.ok(profile, name + " profile");
    assert.equal(typeof engine[profile.doseEngineFunction], "function");
    for (const field of ["activeIngredient", "dosageForms", "route", "formulationNote", "strength"]) {
      assert.equal(profile.provenance[field].status, "source_linked_reference", name + "." + field);
      assert.ok(profile.provenance[field].sourceRefs.length > 0);
    }
  }
  assert.match(cetirizine.formulationNote, /5 mg\/5 mL/);
  assert.match(cetirizine.formulationNote, /10 mg\/mL/);
  assert.equal(cetirizine.provenance.prescriptionStatus.status, "source_linked_reference");
  assert.equal(cetirizine.provenance.keyWarnings.status, "pending_product_specific_verification");
  assert.match(amoxicillin.formulationNote, /125 mg\/5 mL/);
  assert.match(amoxicillin.formulationNote, /250 mg\/5 mL/);
  assert.equal(amoxicillin.provenance.prescriptionStatus.status, "source_linked_reference");
  assert.ok(amoxicillin.provenance.prescriptionStatus.sourceRefs.includes("kemkes_antibiotic_prescription"));
  assert.equal(amoxicillin.provenance.keyWarnings.status, "pending_product_specific_verification");
});

test("cefixime profile uses BPOM-approved Cefspan product information and cefixime dose engine", () => {
  const profile = database.medicineProfiles.Cefixime;
  assert.ok(profile);
  assert.equal(profile.doseEngineFunction, "cefixime");
  assert.equal(typeof engine.cefixime, "function");
  for (const field of ["activeIngredient", "dosageForms", "route", "formulationNote", "strength", "prescriptionStatus", "keyWarnings"]) {
    assert.equal(profile.provenance[field].status, "source_linked_reference", "Cefixime." + field);
    assert.ok(profile.provenance[field].sourceRefs.includes("bpom_cefspan_cefixime"));
  }
  assert.match(profile.strength, /100 mg\/5 mL/);
  assert.match(profile.strength, /200 mg/);
  assert.match(profile.formulationNote, /spesifik produk/);
});


test("cefadroxil profile uses Indonesian manufacturer formulation data and existing dose engine", () => {
  const profile = database.medicineProfiles.Cefadroxil;
  assert.ok(profile);
  assert.equal(profile.doseEngineFunction, "cefadroxil");
  assert.equal(typeof engine.cefadroxil, "function");
  for (const field of ["activeIngredient", "dosageForms", "route", "formulationNote", "strength", "prescriptionStatus"]) {
    assert.equal(profile.provenance[field].status, "source_linked_reference", "Cefadroxil." + field);
    assert.ok(profile.provenance[field].sourceRefs.includes("novapharin_cefadroxil"));
  }
  assert.match(profile.strength, /125 mg\/5 mL/);
  assert.equal(profile.provenance.keyWarnings.status, "pending_product_specific_verification");
});

test("structured medicine profiles and coverage metadata remain in one-to-one parity", () => {
  const coverage = database.metadata.medicineProfiles.coverage;
  const structuredNames = Object.keys(coverage).filter(name => coverage[name] === "structured_profile");
  assert.equal(structuredNames.length, 16);
  assert.equal(Object.keys(database.medicineProfiles).length, 15);
  for (const name of structuredNames) assert.ok(database.medicineProfiles[name], name);
});
