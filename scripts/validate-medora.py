#!/usr/bin/env python3
"""Static integrity checks for MEDORA's embedded WebView application."""
from collections import Counter
from html.parser import HTMLParser
from pathlib import Path
import subprocess
import tempfile


HTML_FILE = Path("app/src/main/assets/index.html")
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
    "cefixResult", "cetiStrength", "cetiResult",
    "zincRegimen", "zincResult",
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

    parser = DocumentInspector()
    parser.feed(HTML_FILE.read_text(encoding="utf-8"))
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

    print(
        "MEDORA validation passed: "
        f"{len(parser.ids)} HTML IDs, {len(EXPECTED_DYNAMIC_IDS)} documented dynamic dose controls, "
        f"{len(parser.inline_scripts[0])} JavaScript characters."
    )


if __name__ == "__main__":
    main()
