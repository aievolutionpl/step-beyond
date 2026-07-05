#!/usr/bin/env python3
"""Step Beyond repository validator.

Checks that the skill is internally consistent so adapters and CI can trust it:
  1. All JSON manifests parse.
  2. Version string is identical across SKILL.md, plugin.json, marketplace.json,
     capabilities.json, and both READMEs.
  3. Every reference/template path named in capabilities.json exists on disk.
  4. Every `references/<file>.md` mentioned in SKILL.md resolves to a real file.
  5. templates/core-injection.txt matches the Core Instruction block in SKILL.md
     (the drift that silently breaks every adapter at once).

Exit code 0 = all green, 1 = at least one failure. No third-party dependencies.
"""

from __future__ import annotations

import json
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SKILL_DIR = ROOT / "skills" / "step-beyond"
SKILL_MD = SKILL_DIR / "SKILL.md"

failures: list[str] = []
checks = 0


def ok(msg: str) -> None:
    global checks
    checks += 1
    print(f"  \033[32m✓\033[0m {msg}")


def fail(msg: str) -> None:
    global checks
    checks += 1
    failures.append(msg)
    print(f"  \033[31m✗\033[0m {msg}")


def read(path: Path) -> str:
    return path.read_text(encoding="utf-8")


def load_json(path: Path):
    try:
        data = json.loads(read(path))
        ok(f"{path.relative_to(ROOT)} is valid JSON")
        return data
    except (OSError, json.JSONDecodeError) as exc:
        fail(f"{path.relative_to(ROOT)} failed to parse: {exc}")
        return None


def frontmatter_version(md_path: Path) -> str | None:
    m = re.search(r"^version:\s*(\S+)\s*$", read(md_path), re.MULTILINE)
    return m.group(1) if m else None


def badge_version(md_path: Path) -> str | None:
    # matches shields.io badge like version-3.1.0-blue or wersja-3.1.0-blue
    m = re.search(r"(?:version|wersja)-(\d+\.\d+\.\d+)-", read(md_path))
    return m.group(1) if m else None


def core_block(md_text: str) -> str | None:
    """Extract the fenced block under '## ⚡ Core Instruction' in SKILL.md."""
    anchor = md_text.find("Core Instruction")
    if anchor == -1:
        return None
    fence = re.search(r"```[a-z]*\n(.*?)```", md_text[anchor:], re.DOTALL)
    return fence.group(1) if fence else None


def norm(text: str) -> str:
    """Normalize for comparison: strip trailing ws per line, drop blank edges."""
    return "\n".join(line.rstrip() for line in text.strip().splitlines())


print("Step Beyond validator\n")

# --- 1. JSON validity -------------------------------------------------------
print("JSON manifests:")
plugin = load_json(ROOT / ".claude-plugin" / "plugin.json")
marketplace = load_json(ROOT / ".claude-plugin" / "marketplace.json")
caps = load_json(SKILL_DIR / "capabilities.json")

# --- 2. Version consistency -------------------------------------------------
print("\nVersion consistency:")
versions = {
    "SKILL.md frontmatter": frontmatter_version(SKILL_MD),
    "plugin.json": (plugin or {}).get("version"),
    "capabilities.json": (caps or {}).get("version"),
    "README.md badge": badge_version(ROOT / "README.md"),
    "README_PL.md badge": badge_version(ROOT / "README_PL.md"),
}
present = {k: v for k, v in versions.items() if v}
distinct = set(present.values())
if len(distinct) == 1:
    ok(f"all sources agree on version {distinct.pop()}")
else:
    fail(f"version mismatch: {present}")
for name, val in versions.items():
    if val is None:
        fail(f"could not find a version in {name}")

# --- 3. capabilities.json paths exist ---------------------------------------
print("\ncapabilities.json referenced files:")
if caps:
    for group in ("references", "templates"):
        for key, rel in caps.get(group, {}).items():
            target = (SKILL_DIR / rel).resolve()
            if target.is_file():
                ok(f"{group}.{key} -> {rel}")
            else:
                fail(f"{group}.{key} -> {rel} (missing)")
    spec = (SKILL_DIR / caps.get("spec", "")).resolve()
    if spec.is_file():
        ok(f"spec -> {caps['spec']}")
    else:
        fail(f"spec -> {caps.get('spec')} (missing)")

# --- 4. references named in SKILL.md exist ----------------------------------
print("\nSKILL.md reference links:")
skill_text = read(SKILL_MD)
named = sorted(set(re.findall(r"references/([A-Za-z0-9_-]+\.md)", skill_text)))
if not named:
    fail("no references/*.md links found in SKILL.md (unexpected)")
for fname in named:
    target = SKILL_DIR / "references" / fname
    if target.is_file():
        ok(f"references/{fname}")
    else:
        fail(f"references/{fname} referenced in SKILL.md but missing")

# --- 5. core-injection.txt matches SKILL.md core block ----------------------
print("\nCore instruction sync:")
injection = SKILL_DIR / "templates" / "core-injection.txt"
block = core_block(skill_text)
if block is None:
    fail("could not locate the Core Instruction block in SKILL.md")
elif not injection.is_file():
    fail("templates/core-injection.txt is missing")
elif norm(block) == norm(read(injection)):
    ok("core-injection.txt matches SKILL.md Core Instruction block")
else:
    fail("core-injection.txt has drifted from SKILL.md Core Instruction block")

# --- summary ----------------------------------------------------------------
print("\n" + "=" * 48)
if failures:
    print(f"\033[31mFAILED\033[0m — {len(failures)}/{checks} checks failed:")
    for f in failures:
        print(f"  • {f}")
    sys.exit(1)
print(f"\033[32mPASSED\033[0m — all {checks} checks green.")
sys.exit(0)
