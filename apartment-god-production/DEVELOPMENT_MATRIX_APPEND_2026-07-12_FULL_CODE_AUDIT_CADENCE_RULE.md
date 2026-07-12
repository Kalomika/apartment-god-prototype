# Development Matrix Append, Full Code Audit Cadence Rule

Date: 2026-07-12
Status: IMPLEMENTED
Branch: phaser-migration
Runtime files changed: no
Render playable branch updated: no
Source rule document: `docs/APARTMENT_GOD_FULL_CODE_AUDIT_CADENCE_RULE.md`

This append belongs with `apartment-god-production/DEVELOPMENT_MATRIX.md` and should be treated as part of the matrix until the main matrix body is safely consolidated.

---

## System Matrix Addition

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Full code audit cadence | IMPLEMENTED | `docs/APARTMENT_GOD_FULL_CODE_AUDIT_CADENCE_RULE.md`, this append | After every 5 meaningful runtime or gameplay code changes, run a full audit before continuing broad new feature work. An anomaly means a confirmed source issue, not unfamiliar code. | Track meaningful runtime changes, audit current source, fix safe blatant issues, log results. |

---

## Test Matrix Addition

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Five change audit trigger | Critical | NEEDS_TESTING | After 5 meaningful runtime or gameplay commits, verify an agent performs a full source audit before broad new work. |
| Anomaly definition discipline | Critical | NEEDS_TESTING | Confirm audit reports distinguish confirmed bugs from risks, unknowns, and code the agent simply has not read yet. |
| Audit fixes | High | NEEDS_TESTING | Confirm safe blatant issues found during audits are fixed in source instead of only reported. |

---

## Risk Matrix Addition

| Risk Area | Risk Level | Why It Is Dangerous | Required Protection |
|---|---|---|---|
| Audit drift | Critical | Without scheduled audits, runtime systems can contradict each other after several feature passes. | Full code audit after every 5 meaningful runtime or gameplay code changes. |
| False anomaly labeling | High | Agents may call unfamiliar code broken instead of reading the required docs and source. | Anomaly must mean confirmed or strongly supported source issue. Unknowns must be labeled unknowns. |
| Unfixed obvious defects | High | New feature work can stack on top of known broken behavior. | Fix blatant safe issues during the audit before broad new feature work. |

---

## Audit Cadence Rule

```txt
After every 5 meaningful runtime or gameplay code changes, perform a full code audit before continuing broad new feature work.
```

Meaningful runtime or gameplay changes include code affecting boot, state, saves, movement, autonomy, actions, UI, phone, app menu, world objects, vehicles, travel, activities, soccer, pool, rendering, CSS mobile playability, or build/test assumptions.

Documentation only changes do not count unless they change rules that affect runtime work.

Major risky changes can trigger an audit sooner than 5 changes.

---

## Anomaly Definition Rule

```txt
An anomaly is a confirmed or strongly supported source issue, not something the agent merely does not understand.
```

Before labeling an anomaly, the agent must read the relevant required docs and source files.

Do not call unfamiliar code anomalous until it has been understood or clearly proven inconsistent with the handbook, matrix, log, runtime behavior, or tests.

---

## Required Audit Scope

A full audit should inspect the active runtime path across boot, state, save/load, movement, autonomy, actions, guided commands, UI, phone, app menu, world objects, vehicles, travel, activities, soccer, pool, rendering, CSS, tests, and rule alignment.

Every audit should report:

```txt
Branch audited:
Files inspected:
Commands run:
Runtime tests performed:
Browser or Render tests performed:
Confirmed anomalies:
Risks needing testing:
Fixes committed:
Issues not fixed and why:
Next exact test request:
```
