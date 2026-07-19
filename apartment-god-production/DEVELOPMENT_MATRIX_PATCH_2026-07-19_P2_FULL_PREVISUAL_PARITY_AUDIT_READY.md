# Development Matrix Patch, Full P2 Previsual Gameplay Parity Audit Ready

Date: 2026-07-19
Branch: phaser-migration-2
Previsual baseline: c8941bbe16e5725ad02eb20596ee5a07868303b8
Audited source head: 644630831fb3b5875ae914b20f08380867b211c8
Status: NEEDS_USER_BROWSER_CONFIRMATION
Backup: backup/phaser-migration-2-before-full-previsual-parity-repair-2026-07-19

| System | Status | Audit or repair result | Required confirmation |
|---|---|---|---|
| Eight playable areas | VERIFIED_BY_DATA_AUDIT | Floor IDs 0 through 7 are present, including dynamically installed Front Yard South and Driveway West. | Browse all eight areas in the isolated preview. |
| Twenty nine room regions | VERIFIED_BY_DATA_AUDIT | Normalized room IDs, names, coordinates, width, and height match the previsual baseline. | Inspect every room boundary and route. |
| Eighty eight world objects | VERIFIED_BY_DATA_AUDIT | Normalized object records match the previsual baseline. | Open every object menu and inspect placement. |
| Initial gameplay state | VERIFIED_BY_DATA_AUDIT | Top-level state structure, selected actor, floor, entity IDs, entity types, actor floors, and autonomy mode match. | Reset and compare initial browser behavior. |
| Core gameplay modules | VERIFIED_BY_SOURCE_AUDIT | Actions, movement, autonomy, state, UI, phone, camera, save, calendar, careers, front yard, driveway, gates, vehicles, pool, basketball, tidiness, time, offsite, world, runtime corrections, and regression guards remain represented. | End-to-end play session. |
| Baseline controls | VERIFIED_BY_AUDIT | No baseline DOM control IDs are missing. | Test each visible and phone-based control. |
| Runtime update coverage | VERIFIED_BY_AUDIT | No baseline runtime update calls are missing from native P2. | Observe autonomy and scheduled systems over time. |
| Object visual registration | VERIFIED_BY_AUDIT | All audited object kinds resolve to registered non-generic Phaser textures. | Inspect all objects at game scale. |
| Room visual registration | FIXED, NEEDS_DEVICE_CONFIRMATION | Dedicated curb and walkway assets eliminate the two neutral exterior fallbacks found by the first complete audit. All other regions already had deliberate mappings. | Inspect Front South and Driveway on Android. |
| Activity duplicate-body prevention | FIXED, NEEDS_BROWSER_TESTING | Activity replacement suppresses the exact base actor visual record. | Trigger every major activity and confirm one body only. |
| Exact repeated-object binding | FIXED, NEEDS_BROWSER_TESTING | Sleep and activity object IDs are used before nearest-object fallback. | Test multiple beds, sinks, showers, toilets, couches, and desks. |
| Optional visual loading | VERIFIED_BY_CODE | Activity and state art load lazily with bounded texture pools and per-asset fallback. | Trigger activities across multiple floors and watch memory and loading. |
| Runtime recovery | VERIFIED_BY_CODE | A terminal recovery state stops repeated update failures and leaves a stable diagnostic screen. | Controlled error test only. |
| Mobile canvas and controls | TESTED_IN_APPDEPLOY | Four by three playfield, money, utilities, Up, Down, Phone, and Map passed focused mobile QA. | Confirm on Kam's Android browser. |
| Static preview Phaser loading | TESTED_IN_APPDEPLOY | Raw source preview maps Phaser directly to the CDN and no longer emits the expected missing vendor request. | Hard refresh and inspect browser behavior. |
| AppDeploy QA | PASSED | Three of three final tests passed with no frontend, backend, or network errors. | User visual review. |
| Final authored visual quality | TEMPORARY, NOT_APPROVED | Current generated SVG and PNG artwork is procedural fallback, not peak authored sprite art. | Replace and approve assets individually without disturbing gameplay parity. |
| Native Phaser ownership | PRESERVED | Native Phaser scene, sprites, images, Graphics, input, depth, and scaling remain. No legacy Canvas frame bridge was restored. | Confirm native boot and pointer alignment. |
