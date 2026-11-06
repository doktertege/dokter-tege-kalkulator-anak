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

    # Every active catalog entry must resolve to a calculator or an explicit
    # product guide. This prevents selectable drugs from opening an empty detail.
    catalog_match = re.search(r"const data=\[(.*?)\n\];", javascript, re.S)
    if not catalog_match:
        raise SystemExit("ERROR: medication catalog declaration not found")
    catalog_entries = re.findall(
        r'^\["([^"]+)",.*,"(active|excluded)"\],?$',
        catalog_match.group(1),
        re.M,
    )
    active_names = {name for name, status in catalog_entries if status == "active"}
    detail_match = re.search(
        r"function openDrug\(name\)\{(.*?)function fmt\(",
        javascript,
        re.S | re.M,
    )
    if not detail_match:
        raise SystemExit("ERROR: medication detail handler not found")
    detail_script = detail_match.group(1)
    handled_names = set(re.findall(r'name===["\']([^"\']+)["\']', detail_script))
    handled_names.update(re.findall(r'^"([^"]+)":', detail_script, re.M))
    unhandled_active = sorted(active_names - handled_names)
    if unhandled_active:
        raise SystemExit(
            "ERROR: active catalog entries lack a detail handler or product guide: "
            + ", ".join(unhandled_active)
        )

    # Regression guard: list preview and detail calculator must use identical
    # age/weight eligibility. A mismatch can advertise a dose that detail rejects.
    furosemide_preview = re.search(
        r'else if\(d\[0\]===["\']Furosemide["\']&&p\.a>=(\d+)&&p\.a<(\d+)&&p\.w>=(\d+)\)',
        javascript,
    )
    furosemide_detail = re.search(
        r'if\(p\.a<(\d+)\|\|p\.a>=(\d+)\|\|p\.w<(\d+)\)',
        detail_script,
    )
    if not furosemide_preview:
        raise SystemExit("ERROR: active Furosemide catalog preview is missing")
    if not furosemide_detail:
        raise SystemExit("ERROR: Furosemide detail eligibility guard is missing")
    if furosemide_preview.groups() != furosemide_detail.groups():
        raise SystemExit(
            "ERROR: Furosemide preview/detail eligibility mismatch: "
            f"preview={furosemide_preview.groups()}, detail={furosemide_detail.groups()}"
        )

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
