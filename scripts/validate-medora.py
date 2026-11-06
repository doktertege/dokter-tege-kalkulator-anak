#!/usr/bin/env python3
"""Static integrity checks for MEDORA's embedded WebView application."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import re
import subprocess
import tempfile


HTML_FILE = Path("app/src/main/assets/index.html")
DOSE_ENGINE_FILE = Path("app/src/main/assets/dose-engine.js")
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

    html = HTML_FILE.read_text(encoding="utf-8")
    if '<script src="dose-engine.js"></script>' not in html:
        raise SystemExit("ERROR: MEDORA dose engine is not loaded before the inline application script")

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
