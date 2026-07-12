# Ongoing Design Log Append, Full Code Audit Cadence Rule

## 2026-07-12 05:05 AM CT, Full Code Audit Cadence Rule Added

Status: IMPLEMENTED
Branch: phaser-migration
Commit: docs 93995745f65f94c5bdedbec1063da0cf7ee7c542, handbook append 1d510a2df43e30e2d911a97281bc0ad56f4f0a30, matrix append fd4313f8564cf9743cd233872af5bff38e7ed116
Files changed:
- docs/APARTMENT_GOD_FULL_CODE_AUDIT_CADENCE_RULE.md
- docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK_APPEND_2026-07-12_FULL_CODE_AUDIT_CADENCE_RULE.md
- apartment-god-production/DEVELOPMENT_MATRIX_APPEND_2026-07-12_FULL_CODE_AUDIT_CADENCE_RULE.md
- apartment-god-production/ONGOING_DESIGN_LOG_APPEND_2026-07-12_FULL_CODE_AUDIT_CADENCE_RULE.md
Runtime files changed: no
Render playable branch updated: no
Backup branch: not required, documentation only

Summary:
Added a production rule requiring a full code audit after every 5 meaningful runtime or gameplay code changes.

Implementation details:
The new rule defines the audit cadence, what counts as a meaningful runtime or gameplay change, what counts as a real anomaly, what does not count as an anomaly, the required audit scope, and the expected audit report format.

The rule explicitly says anomalies are confirmed or strongly supported source issues, not things an agent merely does not understand. Agents must read the handbook, backup policy, no broad implementation rule, ongoing log, development matrix, and relevant source before judging code.

The rule also says safe blatant issues found during an audit should be fixed before continuing broad new feature work, while risky fixes should be reported honestly instead of hidden.

Testing performed:
Documentation only. Created rule, handbook append, matrix append, and log append on phaser-migration.

Testing requested:
No runtime test needed. Future development runs should count meaningful runtime changes and trigger a full code audit after 5 such changes or sooner when a risky system is touched.

Known risks:
The main handbook and main development matrix should eventually be consolidated with this append when safe full file editing is available. Until then, future agents must not ignore the append files.

Follow ups:
On the next documentation consolidation pass, merge this rule directly into docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md and apartment-god-production/DEVELOPMENT_MATRIX.md required sections so it cannot be missed.
