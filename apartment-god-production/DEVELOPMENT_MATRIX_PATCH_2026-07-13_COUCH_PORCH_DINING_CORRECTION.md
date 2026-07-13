# Development Matrix Patch, Couch Porch Dining Correction

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Main floor visual correction stack | NEEDS_TESTING | `src/visualRegressionFixes.js`, `src/realismCorrectionPass.js` | A final correction layer now clears and redraws the couch and dining table after realismCorrectionPass so the latest Render defects are not visible. This is temporary until one canonical layout pass replaces stacked corrections. | Render test the main floor after hard refresh. |
| Porch overlay containment | NEEDS_TESTING | `src/visualRegressionFixes.js`, `src/realismCorrectionPass.js` | Broad green porch overlay is not reintroduced in visualRegressionFixes. Main must be synced to remove the old visible green band from Render. | Confirm no green rectangle cuts through house or stairs. |

## Object Interaction Matrix Updates

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Main couch | Living room | NEEDS_TESTING | Couch relax, TV, sit | Human | Pushed left, faces wall TV, chaise/L projects toward TV side not porch side | Still drawn in correction layer after realism pass | Test couch click, relax, TV route, and screenshot alignment. |
| Dining table | Main kitchen | NEEDS_TESTING | Eat meal | Human | Four chairs only in this pass, no side chair blocking stair/service entry | Runtime seat guard still temporary | Test two people eating and route around right side. |
| Front porch ground | Main porch | NEEDS_TESTING | Visual only | None yet | Grass must stay outside interior and not cross stair/service zone | Prior Render may be cached until rebuild/hard refresh | Test after Render rebuild. |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Couch L side and direction | Critical | NEEDS_TESTING | On main floor, confirm the couch is pushed against the left living wall and the chaise projects toward the TV side, not down toward the porch. |
| Dining entry clearance | Critical | NEEDS_TESTING | Confirm the right side of the dining area no longer blocks the stair/service entry. |
| Porch green overlay regression | Critical | NEEDS_TESTING | Confirm no green overlay cuts across the bottom of the house or through the stair asset. |
