## 2026-07-17, Workout Gear Delivery Mechanics

Status: NEEDS_BROWSER_TESTING
Branch: mechanics/workout-delivery-current-main-20260717
Commit: 1a6fce1b7af418c06f189079af2690544c5e4c4b
Runtime files changed: src/economy.js
Render settings changed: no
Deployment performed: no

Summary:
The current main branch still granted workout gear immediately when purchased. The purchase now creates a staged delivery instead. The actor waits at the delivery door for twelve seconds, receives visible boxes during a five second doorstep exchange, carries them inside, and performs a fifteen second installation action. The workout gear object and ownership flag are created only after installation completes.

Additional corrections:
Food delivery waiting now receives matching actionT and actionTotal values so its visible time bar stays active throughout courier arrival. Shared delivery helpers keep action labels, pose, and timing synchronized. Duplicate workout gear orders and overlapping deliveries are blocked. If the delivery actor disappears, the door closes and the job is safely cancelled.

Testing requested:
Run repository checks, unit tests, and static build. In browser, buy workout gear and verify the actor walks toward the delivery entrance, the twelve second waiting bar remains visible, the door opens during the exchange, boxes appear as carried cargo, the door closes for setup, the fifteen second setup bar remains visible, and workout gear does not become usable or appear until setup finishes. Also order food and confirm hunger increases only after the eating phase.

Known limits:
The delivery job still uses the current in memory state model. Persistence across a full reload should be handled in a separate audited save and world time pass rather than mixed into this contained flow correction.

Next target:
Add world time completion stamps and save restoration for long running deliveries and construction jobs without changing existing Render configuration.
