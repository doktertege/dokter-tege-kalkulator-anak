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

    html = HTML_FILE.read_text(encoding="utf-8")
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
        r'^\["([A-Z][0-9]{2}(?:\.[0-9A-Z]{1,2})?)","([^"]+)","([^"]+)"\],?$',
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
    drug_end = database_javascript.find("\\n  ];", drug_start)
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

    # Bottom-navigation handlers must be registered exactly once. Duplicate
    # listeners can make a single tap trigger multiple navigation actions.
    navigation_ids = {"navHome", "navSearch", "navFavorites", "navHistory", "navSettings"}
    click_handlers = Counter(re.findall(r'\$\("([^"]+)"\)\.addEventListener\("click"', javascript))
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
        raise SystemExit("ERROR: offline database syntax check failed:\\n" + database_check.stderr)

    engine_check = subprocess.run(
        ["node", "--check", str(DOSE_ENGINE_FILE)],
        text=True,
        capture_output=True,
        check=False,
    )
    if engine_check.returncode:
        raise SystemExit("ERROR: dose engine syntax check failed:\\n" + engine_check.stderr)

    print(
        "MEDORA validation passed: "
        f"{len(parser.ids)} HTML IDs, {len(EXPECTED_DYNAMIC_IDS)} documented dynamic dose controls, "
        f"{len(javascript)} JavaScript characters; all static and dynamic element references resolved."
    )


if __name__ == "__main__":
    main()
,
        drug_match.group(1),
        re.M,
    )
    raw_drug_rows = re.findall(r'^\\s*\\["', drug_match.group(1), re.M)
    if len(drug_entries) != len(raw_drug_rows) or len(drug_entries) != 32:
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

    # Bottom-navigation handlers must be registered exactly once. Duplicate
    # listeners can make a single tap trigger multiple navigation actions.
    navigation_ids = {"navHome", "navSearch", "navFavorites", "navHistory", "navSettings"}
    click_handlers = Counter(re.findall(r'\$\("([^"]+)"\)\.addEventListener\("click"', javascript))
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
        raise SystemExit("ERROR: offline database syntax check failed:\\n" + database_check.stderr)

    engine_check = subprocess.run(
        ["node", "--check", str(DOSE_ENGINE_FILE)],
        text=True,
        capture_output=True,
        check=False,
    )
    if engine_check.returncode:
        raise SystemExit("ERROR: dose engine syntax check failed:\\n" + engine_check.stderr)

    print(
        "MEDORA validation passed: "
        f"{len(parser.ids)} HTML IDs, {len(EXPECTED_DYNAMIC_IDS)} documented dynamic dose controls, "
        f"{len(javascript)} JavaScript characters; all static and dynamic element references resolved."
    )


if __name__ == "__main__":
    main()
