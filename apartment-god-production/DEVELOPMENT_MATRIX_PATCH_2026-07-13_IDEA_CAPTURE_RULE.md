# Development Matrix Patch, Idea Capture Rule

## Process Matrix Updates

| Process Area | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Idea capture and backlog logging | ACTIVE | `docs/APARTMENT_GOD_IDEA_CAPTURE_RULE.md`, `apartment-god-production/ONGOING_DESIGN_LOG.md`, `apartment-god-production/DEVELOPMENT_MATRIX.md` | Every Apartment God idea Kam raises must be captured durably before the session ends. Implemented ideas must be logged with files and commits. Unimplemented ideas must be logged as PLANNED, BLOCKED, DEFERRED, or REVERTED with enough detail for another AI to execute later. | At the end of every task, audit whether any gameplay, visual, animation, layout, object, UI, AI, testing, or documentation idea was mentioned but not implemented, then log it before final response. |

## Required End Of Session Checklist Addition

| Checklist Item | Required Answer |
|---|---|
| Did Kam mention any idea or request that was not implemented this pass? | If yes, create a PLANNED or BLOCKED log/matrix entry before final response. |
| Did the final response clearly separate implemented work from logged-only work? | Must be yes. |
| Did the idea affect gameplay, visuals, animation, objects, layout, AI/autonomy, UI, or testing? | If yes, update or patch the development matrix. |

## Failure Example Captured

| Example | Status | Lesson |
|---|---|---|
| Pool joy and disappointment reactions after made shots, single misses, and repeated misses | PLANNED after correction | The first pool movement pass logged motion and shot mechanics but missed this unimplemented design requirement. Future passes must capture unimplemented design requests immediately. |
