# Development Matrix Patch: P2 HUD, Side Walk, and Wardrobe Layers

Status: DEPLOYED_FOR_TESTING, NEEDS_KAM_BROWSER_APPROVAL
Branch: phaser-migration-2
Runtime files changed: yes
Main touched: no
Render settings changed: no
Manual Render deployment triggered: no
Backup: backup/phaser-migration-2-before-hud-and-layered-walk-fix-2026-07-21
AppDeploy preview: https://31e6d4932a52c800f3.v2.appdeploy.ai/

| System | Status | Current state | Required test |
|---|---|---|---|
| Time and money placement | DEPLOYED_FOR_TESTING | Date/time and money now live in the side HUD. Phaser scene status text and runtime diagnostic text are removed from the playfield. | Confirm on desktop and mobile that no time/money text covers rooms or actors. |
| Resource strip duplication | DEPLOYED_FOR_TESTING | The gameplay parity bridge removes the old absolute `hud-resource-strip` and updates the side utility panel instead. | Confirm money, power, tidiness, and autonomy are readable in the HUD only. |
| Human east/west body orientation | DEPLOYED_FOR_TESTING | Resident, Girlfriend, and Lab Subject use complete horizontal body sheets for east movement and mirror the whole body for west. | Walk each human east and west. Reject any forward torso, crooked head, crop, or foot sliding. |
| Walk frame count | DOCUMENTED | Four frames per direction are played at 8 FPS. Eight FPS is playback rate, not eight frames. | Inspect cadence at actual game scale and decide whether a later authored 8-frame loop is needed. |
| Wardrobe color layers | DEPLOYED_FOR_TESTING | Separate vertical and side top/bottom layers synchronize with body frame and use the actor's current wardrobe color. | Change wardrobe day and confirm color changes without drift, flicker, or duplicate bodies. |
| Wardrobe silhouette layers | NOT_IMPLEMENTED | Shirt, jacket, dress, pants, shoe, hair, hat, and accessory silhouette swaps are not yet authored. | Build only after current layer alignment and character direction are approved. |
| Optional layer fallback | DEPLOYED_FOR_TESTING | Missing optional clothing textures are hidden after update rather than showing Phaser's missing-texture box. | Test a safely missing optional layer or confirm no broken texture icon appears. |
| Non-black backdrop | DEPLOYED_FOR_TESTING | Floor-colored backdrop remains active behind room assets. | Confirm no black loading or missing-room field. |
| AppDeploy preview | READY | Existing P2 AppDeploy launcher is pinned to runtime commit `b1f12bd6537ee55e80753d116b6fef43897182f0`. AppDeploy E2E passed 3 of 3 with no reported frontend or network errors. | Kam manually tests gameplay and visuals through the preview link. |
| Full local repo suite | BLOCKED_IN_CONNECTOR_ENVIRONMENT | Local clone failed because the local tool environment could not resolve GitHub. Repository workflow status was not returned through the available connector status endpoint. | Run `npm run check`, `npm test`, and `npm run build` in a connected checkout or workflow. |
| Final authored character art | NOT_COMPLETE | Current side sheets and wardrobe layers are temporary bridge SVG assets. | Replace through the approved static, walk, sit, and activity art ladder after visual direction approval. |

## Control ruling

Do not mark the character art final and do not promote P2 to main. The reported HUD blockage and false side orientation have code corrections and a live isolated preview, but direct browser approval remains required.
