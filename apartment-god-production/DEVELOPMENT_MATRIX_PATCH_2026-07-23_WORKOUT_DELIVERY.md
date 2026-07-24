# Development Matrix Patch, 2026-07-23, Workout Delivery

Canonical merge pending: apartment-god-production/DEVELOPMENT_MATRIX.md

## System Matrix addition

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Delivery and installation flow | NEEDS_TESTING | `src/economy.js`, 2026-07-23 workout delivery log append | Food and workout gear now use timed delivery phases. Workout gear is not created until arrival, exchange, and installation finish. Duplicate or overlapping deliveries are blocked. | Browser test both food and workout deliveries, actor time bars, delivery person rendering, door state, carrying states, and save or reload behavior during an active delivery. |

## Object Interaction Matrix addition

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Workout gear delivery | Front door to living room | NEEDS_TESTING | Order, receive, carry boxes, install | Human | Delivery person, open door exchange, carried boxes, installation time bar, completed workout object | Delivery renderer type support, save persistence, interruption cleanup | Code committed and inspected. Browser test required. |

## Test Matrix addition

| Test | Status | Exact Check |
|---|---|---|
| Workout gear staged delivery | NEEDS_TESTING | Buy gear once, confirm $220 charge, arrival delay, visible front door exchange, open then closed door, carried boxes, installation delay, and object creation only after completion. |
| Delivery overlap prevention | NEEDS_TESTING | Start food or workout delivery, attempt another order, confirm no second charge and no replacement of the active delivery. |
| Delivery cancellation safety | NEEDS_TESTING | Remove or invalidate the receiving actor during a test save, confirm the delivery clears safely and the door is not left open. |
