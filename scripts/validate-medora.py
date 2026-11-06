#!/usr/bin/env python3
"""Static integrity checks for MEDORA's embedded WebView application."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import json
import subprocess
import tempfile


HTML_FILE = Path("app/src/main/assets/index.html")
DOSE_ENGINE_FILE = Path("app/src/main/assets/dose-engine.js")
DATABASE_FILE = Path("app/src/main/assets/database.js")
MODULE_WORKSPACE_FILE = Path("app/src/main/assets/module-workspace.js")
REQUIRED_IDS = {
    "homeDashboard", "clinicalDashboard", "publicDashboard",
    "patientPanel", "bb", "th", "bl", "list", "detail",
    "drugName", "doseArea", "copyDose", "saveDose",
    "historyPanel", "doseHistoryList", "icdPanel", "icdSearch",
    "medicalPanel", "calcMedical", "gcsOutput",
}
EXPECTED_DYNAMIC_IDS = {
    "salDose", "salStrength", "salResult",
    "paraStrength", "paraResult", "ibuStrength", "ibuResult",
    "amoxRegimen", "amoxStrength", "amoxResult",
    "cefaStrength", "cefaResult", "cefixRegimen", "cefixStrength",
    "cefixResult", "cetiStrength", "cetiResult", "loraStrength", "loraResult",
    "zincRegimen", "zincResult",
    "orsPlan", "orsResult", "ctmStrength", "ctmResult",
    "ceftriaxoneRegimen", "ceftriaxoneResult", "cefotaximeRegimen",
    "cefotaximeDivisions", "cefotaximeResult", "gentamicinStrength", "gentamicinResult",
    "ondansetronStrength", "ondansetronResult", "diazepamStrength", "diazepamResult",
    "metroRegimen", "metroStrength", "metroResult",
    "dexSeverity", "dexForm", "dexResult",
    "predDose", "predDuration", "predResult",
    "omepIndication", "omepDuration", "omepResult",
    "lansoIndication", "lansoDuration", "lansoResult",
    "adrResult", "metaResult",
}


class DocumentInspector(HTMLParser):
    def __init__(self):
        super().__init__()
        self.ids = []
        self.inline_scripts = []
        self._inside_inline_script = False
        self._script_parts = []

    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if "id" in attrs:
            self.ids.append(attrs["id"])
        if tag.lower() == "script" and not attrs.get("src"):
            self._inside_inline_script = True
            self._script_parts = []

    def handle_data(self, data):
        if self._inside_inline_script:
            self._script_parts.append(data)

    def handle_endtag(self, tag):
        if tag.lower() == "script" and self._inside_inline_script:
            self.inline_scripts.append("".join(self._script_parts))
            self._inside_inline_script = False
            self._script_parts = []


def main():
    if not HTML_FILE.is_file():
        raise SystemExit(f"ERROR: file not found: {HTML_FILE}")

    if not DOSE_ENGINE_FILE.is_file():
        raise SystemExit(f"ERROR: dose engine file not found: {DOSE_ENGINE_FILE}")
    if not DATABASE_FILE.is_file():
        raise SystemExit(f"ERROR: offline database file not found: {DATABASE_FILE}")
    if not MODULE_WORKSPACE_FILE.is_file():
        raise SystemExit(f"ERROR: offline module workspace file not found: {MODULE_WORKSPACE_FILE}")

    html = HTML_FILE.read_text(encoding="utf-8")
    module_workspace_javascript = MODULE_WORKSPACE_FILE.read_text(encoding="utf-8")
    if '<script src="module-workspace.js"></script>' not in html:
        raise SystemExit("ERROR: offline clinical workspace is not loaded by MEDORA")
    if '<script src="dose-engine.js"></script>' not in html:
        raise SystemExit("ERROR: MEDORA dose engine is not loaded before the inline application script")
    if '<script src="database.js"></script>' not in html:
        raise SystemExit("ERROR: MEDORA offline database is not loaded before the inline application script")

    parser = DocumentInspector()
    parser.feed(html)
    counts = Counter(parser.ids)
    duplicates = sorted(item for item, count in counts.items() if count > 1)
    missing = sorted(REQUIRED_IDS - set(parser.ids))

    if duplicates:
        raise SystemExit("ERROR: duplicate HTML IDs: " + ", ".join(duplicates))
    if missing:
        raise SystemExit("ERROR: required MEDORA elements missing: " + ", ".join(missing))
    if len(parser.inline_scripts) != 1 or not parser.inline_scripts[0].strip():
        raise SystemExit(
            f"ERROR: expected exactly one non-empty inline script; found {len(parser.inline_scripts)}"
        )

    javascript = parser.inline_scripts[0]

    # ICD-10 reference catalog integrity: data lives in the offline database file,
    # not in the UI bundle. Check metadata, unique codes and visible category filters.
    database_javascript = DATABASE_FILE.read_text(encoding="utf-8")
    if 'version: "2010"' not in database_javascript or 'system: "WHO ICD-10"' not in database_javascript:
        raise SystemExit("ERROR: ICD-10 source/version metadata missing from offline database")
    if "const icdData = window.MEDORA_DATABASE.icd10;" not in javascript:
        raise SystemExit("ERROR: UI is not reading ICD-10 entries from the offline database")
    icd_match = re.search(r"root\.MEDORA_DATABASE\.icd10 = \[(.*?)\n  \];", database_javascript, re.S)
    if not icd_match:
        raise SystemExit("ERROR: ICD-10 reference catalog not found")
    icd_entries = re.findall(
        r'^\["([A-Z][0-9]{2}(?:\.[0-9A-Z])?)","([^"]+)","([^"]+)"\],?$',
        icd_match.group(1),
        re.M,
    )
    raw_icd_rows = re.findall(r'^\["', icd_match.group(1), re.M)
    icd_row_lines = [line for line in icd_match.group(1).splitlines() if line.strip()]
    missing_separators = [
        index + 1
        for index, row in enumerate(icd_row_lines[:-1])
        if not row.rstrip().endswith(",")
    ]
    if missing_separators:
        raise SystemExit(
            "ERROR: ICD-10 catalog rows missing commas after entries: "
            + ", ".join(map(str, missing_separators))
        )
    if not icd_entries or len(icd_entries) != len(raw_icd_rows):
        raise SystemExit("ERROR: ICD-10 catalog contains malformed or empty entries")
    icd_codes = [entry[0] for entry in icd_entries]
    duplicate_icd_codes = sorted(
        code for code, count in Counter(icd_codes).items() if count > 1
    )
    if duplicate_icd_codes:
        raise SystemExit("ERROR: duplicate ICD-10 codes: " + ", ".join(duplicate_icd_codes))
    if len(icd_entries) < 99:
        raise SystemExit(f"ERROR: ICD-10 reference catalog unexpectedly small: {len(icd_entries)} entries")
    required_icd_codes = {"R07.4", "A15.0", "I64", "K35.9", "N10", "G51.0", "S06.0"}
    missing_required_codes = sorted(required_icd_codes - set(icd_codes))
    if missing_required_codes:
        raise SystemExit("ERROR: required high-yield ICD-10 codes missing: " + ", ".join(missing_required_codes))
    if "R07.9" in icd_codes:
        raise SystemExit("ERROR: R07.9 is not the WHO ICD-10 code for unspecified chest pain; use R07.4")
    if "R11.2" in icd_codes:
        raise SystemExit("ERROR: R11.2 is ICD-10-CM-specific; use WHO ICD-10 R11 for nausea and vomiting")
    if "R11" not in icd_codes:
        raise SystemExit("ERROR: WHO ICD-10 R11 (nausea and vomiting) is missing")
    icd_categories = {entry[2] for entry in icd_entries}
    visible_categories = set(re.findall(r'data-icd-cat="([^"]+)"', html))
    missing_categories = sorted(icd_categories - visible_categories)
    if missing_categories:
        raise SystemExit(
            "ERROR: ICD-10 categories lack visible filters: "
            + ", ".join(missing_categories)
        )

    # Medication catalog integrity: parse JSON-shaped rows from the offline database.
    drug_start = database_javascript.find("root.MEDORA_DATABASE.drugs = [")
    drug_end = database_javascript.find("\n  ];", drug_start)
    if drug_start < 0 or drug_end < 0:
        raise SystemExit("ERROR: medication catalog not found in offline database")
    drug_block = database_javascript[drug_start + len("root.MEDORA_DATABASE.drugs = ["):drug_end]
    drug_lines = [line.strip().rstrip(",") for line in drug_block.splitlines() if line.strip()]
    try:
        drug_entries = [json.loads(line) for line in drug_lines]
    except json.JSONDecodeError as error:
        raise SystemExit("ERROR: malformed medication catalog row: " + str(error))
    if len(drug_entries) != 32 or any(
        not isinstance(entry, list) or len(entry) != 5
        or not all(isinstance(value, str) and value.strip() for value in entry)
        or entry[4] not in {"active", "excluded"}
        for entry in drug_entries
    ):
        raise SystemExit(f"ERROR: medication catalog malformed or unexpected size: {len(drug_entries)} entries")
    drug_names = [entry[0] for entry in drug_entries]
    duplicate_drugs = sorted(name for name, count in Counter(drug_names).items() if count > 1)
    if duplicate_drugs:
        raise SystemExit("ERROR: duplicate medication catalog names: " + ", ".join(duplicate_drugs))
    if "const data = window.MEDORA_DATABASE.drugs;" not in javascript:
        raise SystemExit("ERROR: UI is not reading medication catalog from offline database")
    drug_status = {entry[0]: entry[4] for entry in drug_entries}
    required_products = {
        "CTM (Chlorpheniramine)", "Oralit", "Ceftriaxone", "Cefotaxime", "Gentamicin",
        "Cendo Xitrol Tetes Mata", "Cendo Xitrol Salep Mata",
        "Erlamycetin Tetes Mata", "Erlamycetin Tetes Telinga", "Erlamycetin Salep Mata"
    }
    missing_products = sorted(required_products - set(drug_names))
    if missing_products:
        raise SystemExit("ERROR: required medication products missing: " + ", ".join(missing_products))
    if drug_status.get("Domperidone") != "excluded":
        raise SystemExit("ERROR: Domperidone must remain excluded from pediatric dose calculator")

    # Structured medicine profiles are reference/safety metadata, not dose instructions.
    profile_marker = "root.MEDORA_DATABASE.medicineProfiles = "
    profile_start = database_javascript.find(profile_marker)
    profile_end = database_javascript.find(";\n})(window);", profile_start)
    if profile_start < 0 or profile_end < 0:
        raise SystemExit("ERROR: structured medicine profiles not found")
    profile_json = database_javascript[profile_start + len(profile_marker):profile_end]
    try:
        medicine_profiles = json.loads(profile_json)
    except json.JSONDecodeError as error:
        raise SystemExit("ERROR: malformed structured medicine profiles: " + str(error))
    required_profiles = {
        "CTM (Chlorpheniramine)", "Oralit", "Ceftriaxone", "Cefotaxime", "Gentamicin",
        "Cendo Xitrol Tetes Mata", "Cendo Xitrol Salep Mata",
        "Erlamycetin Tetes Mata", "Erlamycetin Tetes Telinga", "Erlamycetin Salep Mata"
    }
    missing_profiles = sorted(required_profiles - set(medicine_profiles))
    if missing_profiles:
        raise SystemExit("ERROR: structured medicine profiles missing: " + ", ".join(missing_profiles))
    for name, profile in medicine_profiles.items():
        if not profile.get("activeIngredient") or not profile.get("dosageForms") or not profile.get("route"):
            raise SystemExit("ERROR: incomplete medicine profile: " + name)
        if not profile.get("keyWarnings") or not profile.get("prescriptionStatus"):
            raise SystemExit("ERROR: medicine profile lacks safety metadata: " + name)
    for name in required_profiles:
        if medicine_profiles[name].get("doseEngineFunction") is not None and name.startswith(("Cendo Xitrol", "Erlamycetin")):
            raise SystemExit("ERROR: topical ophthalmic/otic product must not expose a pediatric dose calculator: " + name)
    profile_metadata_marker = "root.MEDORA_DATABASE.metadata.medicineProfiles = "
    metadata_start = database_javascript.find(profile_metadata_marker)
    metadata_end = database_javascript.find(";\n  root.MEDORA_DATABASE.medicineProfiles", metadata_start)
    if metadata_start < 0 or metadata_end < 0:
        raise SystemExit("ERROR: medicine profile provenance metadata not found")
    metadata_json = database_javascript[metadata_start + len(profile_metadata_marker):metadata_end]
    try:
        profile_metadata = json.loads(metadata_json)
    except json.JSONDecodeError as error:
        raise SystemExit("ERROR: malformed medicine profile provenance metadata: " + str(error))
    source_registry = profile_metadata.get("sources", {})
    coverage = profile_metadata.get("coverage", {})
    expected_coverage = {
        name: ("excluded" if drug_status.get(name) == "excluded" else
               "structured_profile" if name in medicine_profiles else
               "pending_profile_review")
        for name in drug_status
    }
    if coverage != expected_coverage:
        raise SystemExit("ERROR: medicine profile coverage does not match the medication catalog")
    if profile_metadata.get("schemaVersion") != "1.1" or not isinstance(source_registry, dict):
        raise SystemExit("ERROR: medicine profile provenance schema/source registry invalid")
    provenance_fields = {
        "activeIngredient", "dosageForms", "route", "formulationNote",
        "strength", "prescriptionStatus", "keyWarnings", "doseEngineFunction"
    }
    valid_provenance_statuses = {
        "source_linked_reference", "pending_product_specific_verification",
        "verified_by_local_regression_test"
    }
    for name, profile in medicine_profiles.items():
        provenance = profile.get("provenance", {})
        if set(provenance) != provenance_fields:
            raise SystemExit("ERROR: incomplete field-level provenance for medicine profile: " + name)
        for field, entry in provenance.items():
            if entry.get("status") not in valid_provenance_statuses or not isinstance(entry.get("sourceRefs"), list):
                raise SystemExit("ERROR: malformed provenance entry: " + name + "." + field)
            refs = entry["sourceRefs"]
            if entry["status"] == "source_linked_reference" and not refs:
                raise SystemExit("ERROR: source-linked field has no source refs: " + name + "." + field)
            if entry["status"] == "pending_product_specific_verification" and refs:
                raise SystemExit("ERROR: pending field must not claim supporting sources: " + name + "." + field)
            for source_id in refs:
                source = source_registry.get(source_id)
                if not source or not source.get("url", "").startswith("https://"):
                    raise SystemExit("ERROR: unresolved medicine source reference: " + name + "." + field)
            if field == "doseEngineFunction" and entry["status"] != "verified_by_local_regression_test":
                raise SystemExit("ERROR: dose engine provenance must be locally regression-tested: " + name)
    if medicine_profiles.get("Oralit", {}).get("provenance", {}).get("formulationNote", {}).get("sourceRefs") != ["ygi_oralit"]:
        raise SystemExit("ERROR: Oralit dilution provenance must reference the ORS preparation source")
    if not medicine_profiles.get("Oralit", {}).get("formulationNote"):
        raise SystemExit("ERROR: Oralit must retain product-specific dilution guidance")

    # Bottom-navigation handlers must be registered exactly once. Duplicate
    # listeners can make a single tap trigger multiple navigation actions.
    navigation_ids = {"navHome", "navSearch", "navFavorites", "navHistory", "navSettings"}
    combined_javascript = javascript + "\n" + module_workspace_javascript
    click_handlers = Counter(re.findall(r'\$\("([^"]+)"\)\.addEventListener\("click"', combined_javascript))
    duplicate_navigation = sorted(item for item in navigation_ids if click_handlers[item] > 1)
    missing_navigation = sorted(item for item in navigation_ids if click_handlers[item] != 1)
    if duplicate_navigation or missing_navigation:
        details = []
        if duplicate_navigation:
            details.append("duplicate click handlers: " + ", ".join(duplicate_navigation))
        if missing_navigation:
            details.append("navigation handlers must occur exactly once: " + ", ".join(missing_navigation))
        raise SystemExit("ERROR: " + "; ".join(details))

    referenced_ids = set(re.findall(r'\$\("([^"]+)"\)', javascript))
    missing_references = sorted(referenced_ids - set(parser.ids) - EXPECTED_DYNAMIC_IDS)
    missing_dynamic_controls = sorted(
        item for item in EXPECTED_DYNAMIC_IDS if item not in javascript
    )
    if missing_references:
        raise SystemExit(
            "ERROR: JavaScript references missing HTML elements: "
            + ", ".join(missing_references)
        )
    if missing_dynamic_controls:
        raise SystemExit(
            "ERROR: expected dynamic dose controls are not present in JavaScript: "
            + ", ".join(missing_dynamic_controls)
        )

    with tempfile.NamedTemporaryFile("w", suffix=".js", encoding="utf-8") as js_file:
        js_file.write(parser.inline_scripts[0])
        js_file.flush()
        result = subprocess.run(
            ["node", "--check", js_file.name],
            text=True,
            capture_output=True,
            check=False,
        )
    if result.returncode:
        raise SystemExit("ERROR: JavaScript syntax check failed:\n" + result.stderr)

    database_check = subprocess.run(
        ["node", "--check", str(DATABASE_FILE)],
        text=True,
        capture_output=True,
        check=False,
    )
    if database_check.returncode:
        raise SystemExit("ERROR: offline database syntax check failed:\n" + database_check.stderr)

    engine_check = subprocess.run(
        ["node", "--check", str(DOSE_ENGINE_FILE)],
        text=True,
        capture_output=True,
        check=False,
    )
    if engine_check.returncode:
        raise SystemExit("ERROR: dose engine syntax check failed:\n" + engine_check.stderr)

    module_check = subprocess.run(
        ["node", "--check", str(MODULE_WORKSPACE_FILE)],
        text=True,
        capture_output=True,
        check=False,
    )
    if module_check.returncode:
        raise SystemExit("ERROR: offline module workspace syntax check failed:\n" + module_check.stderr)

    print(
        "MEDORA validation passed: "
        f"{len(parser.ids)} HTML IDs, {len(EXPECTED_DYNAMIC_IDS)} documented dynamic dose controls, "
        f"{len(javascript)} JavaScript characters; all static and dynamic element references resolved."
    )


if __name__ == "__main__":
    main()
