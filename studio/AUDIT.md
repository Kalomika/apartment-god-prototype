# Studio Audit Standard

Run `python tools/studio_audit.py` from the repository root.

## Audit scope

The audit checks:

- required governance files exist;
- repository identity and branch rules are declared;
- machine-readable state matches the expected schema version;
- task, claim, role, and decision IDs are unique;
- active claims reference real tasks;
- no task has more than one active claim;
- accepted tasks carry evidence;
- high-risk tasks name backup requirements;
- main and Render protections are present;
- task and claim ledgers are structurally coherent;
- required Apartment God governance documents exist.

The audit is intentionally read-only. It reports errors and warnings and exits nonzero on structural errors.

## What the audit does not prove

- browser behavior;
- visual quality;
- correct gameplay;
- Render deployment state;
- absence of regressions in unexecuted code;
- legal ownership or licensing;
- creative approval.

## Audit result language

- `PASS`: no structural errors.
- `PASS_WITH_WARNINGS`: no structural errors, but incomplete or stale records exist.
- `FAIL`: one or more structural errors exist.

A pass is not permission to call runtime work complete.
