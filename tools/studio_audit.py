#!/usr/bin/env python3
"""Read-only structural audit for the Apartment God repository-native studio."""

from __future__ import annotations

import json
import sys
from collections import Counter
from pathlib import Path
from typing import Any

ROOT = Path(__file__).resolve().parents[1]
STATE_PATH = ROOT / "studio/state/studio-state.json"

REQUIRED_FILES = [
    "AGENTS.md",
    "docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md",
    "docs/APARTMENT_GOD_BACKUP_POLICY.md",
    "docs/APARTMENT_GOD_NO_BROAD_IMPLEMENTATION_RULE.md",
    "docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md",
    "docs/APARTMENT_GOD_IDEA_LOGGING_RULE.md",
    "apartment-god-production/ONGOING_DESIGN_LOG.md",
    "apartment-god-production/DEVELOPMENT_MATRIX.md",
    "studio/START_HERE.md",
    "studio/CONSTITUTION.md",
    "studio/OPERATING_PROTOCOL.md",
    "studio/QA_ARCHITECTURE_RELEASE.md",
    "studio/MEMORY_AND_REGISTERS.md",
    "studio/TEMPLATES.md",
    "studio/AUDIT.md",
    "studio/state/studio-state.json",
]

ACTIVE_CLAIM_STATES = {"ACTIVE", "BLOCKED", "HANDOFF_PENDING"}
ACCEPTED_TASK_STATES = {"ACCEPTED"}
HIGH_RISKS = {"HIGH", "CRITICAL"}


class Audit:
    def __init__(self) -> None:
        self.errors: list[str] = []
        self.warnings: list[str] = []

    def error(self, message: str) -> None:
        self.errors.append(message)

    def warn(self, message: str) -> None:
        self.warnings.append(message)


def load_json(path: Path, audit: Audit) -> dict[str, Any]:
    try:
        data = json.loads(path.read_text(encoding="utf-8"))
    except FileNotFoundError:
        audit.error(f"Missing JSON file: {path.relative_to(ROOT)}")
        return {}
    except json.JSONDecodeError as exc:
        audit.error(f"Invalid JSON in {path.relative_to(ROOT)}: {exc}")
        return {}
    if not isinstance(data, dict):
        audit.error(f"Top-level JSON must be an object: {path.relative_to(ROOT)}")
        return {}
    return data


def duplicate_ids(items: list[dict[str, Any]], label: str, audit: Audit) -> None:
    ids = [item.get("id") for item in items if isinstance(item, dict)]
    missing = sum(value is None or value == "" for value in ids)
    if missing:
        audit.error(f"{label} contains {missing} record(s) without an id")
    duplicates = [value for value, count in Counter(ids).items() if value and count > 1]
    for value in duplicates:
        audit.error(f"Duplicate {label} id: {value}")


def audit_state(state: dict[str, Any], audit: Audit) -> None:
    if state.get("schemaVersion") != 1:
        audit.error("studio state schemaVersion must be 1")

    project = state.get("project")
    if not isinstance(project, dict):
        audit.error("project must be an object")
        return

    expected = {
        "name": "Apartment God",
        "repository": "Kalomika/apartment-god-prototype",
        "developmentBranch": "phaser-migration",
        "renderBranch": "main",
        "protectedRepository": "Kalomika/ai-rpg-engine",
        "deploymentAllowed": False,
        "renderSettingsChangesAllowed": False,
    }
    for key, value in expected.items():
        if project.get(key) != value:
            audit.error(f"project.{key} must be {value!r}, found {project.get(key)!r}")

    roles = state.get("roles", [])
    tasks = state.get("tasks", [])
    claims = state.get("claims", [])
    decisions = state.get("decisions", [])

    for label, value in (("roles", roles), ("tasks", tasks), ("claims", claims), ("decisions", decisions)):
        if not isinstance(value, list):
            audit.error(f"{label} must be an array")
            return

    duplicate_ids(roles, "role", audit)
    duplicate_ids(tasks, "task", audit)
    duplicate_ids(claims, "claim", audit)
    duplicate_ids(decisions, "decision", audit)

    task_by_id = {task.get("id"): task for task in tasks if isinstance(task, dict) and task.get("id")}
    active_by_task: Counter[str] = Counter()

    for task in tasks:
        if not isinstance(task, dict):
            audit.error("Task records must be objects")
            continue
        task_id = task.get("id", "<missing>")
        points = task.get("points")
        if not isinstance(points, int) or points < 1:
            audit.error(f"{task_id} points must be a positive integer")
        dependencies = task.get("dependencies")
        if not isinstance(dependencies, list):
            audit.error(f"{task_id} dependencies must be an array")
        else:
            for dependency in dependencies:
                if dependency not in task_by_id:
                    audit.error(f"{task_id} references unknown dependency {dependency}")
        risk = task.get("risk")
        if risk in HIGH_RISKS and task.get("backupRequired") is not True:
            audit.error(f"{task_id} risk {risk} requires backupRequired=true")
        if task.get("status") in ACCEPTED_TASK_STATES and not task.get("evidence"):
            audit.error(f"{task_id} is ACCEPTED without evidence")

    for claim in claims:
        if not isinstance(claim, dict):
            audit.error("Claim records must be objects")
            continue
        claim_id = claim.get("id", "<missing>")
        task_id = claim.get("taskId")
        if task_id not in task_by_id:
            audit.error(f"{claim_id} references unknown task {task_id}")
        if claim.get("state") in ACTIVE_CLAIM_STATES and isinstance(task_id, str):
            active_by_task[task_id] += 1
        branch = claim.get("branch")
        if branch == "main":
            audit.error(f"{claim_id} cannot use protected Render branch main")
        if not claim.get("createdAt"):
            audit.error(f"{claim_id} is missing createdAt")

    for task_id, count in active_by_task.items():
        if count > 1:
            audit.error(f"{task_id} has {count} active claims")

    if not claims:
        audit.warn("No active or historical claims are recorded yet")
    if state.get("lastAudit") is None:
        audit.warn("lastAudit is not recorded yet; record it after the first repository run")


def main() -> int:
    audit = Audit()

    for relative in REQUIRED_FILES:
        if not (ROOT / relative).is_file():
            audit.error(f"Missing required file: {relative}")

    state = load_json(STATE_PATH, audit)
    if state:
        audit_state(state, audit)

    for warning in audit.warnings:
        print(f"WARNING: {warning}")
    for error in audit.errors:
        print(f"ERROR: {error}")

    if audit.errors:
        print(f"FAIL: {len(audit.errors)} error(s), {len(audit.warnings)} warning(s)")
        return 1

    result = "PASS_WITH_WARNINGS" if audit.warnings else "PASS"
    print(f"{result}: 0 errors, {len(audit.warnings)} warning(s)")
    return 0


if __name__ == "__main__":
    sys.exit(main())
