# Top Shot Engagement Director Changelog

Date: 2026-07-09
Branch: `top-shot-v0-1`

Render link: `https://top-shot-prototype.onrender.com/?v=engagement-director-20260709`

Rollback created before update:

- `backup/top-shot-before-engagement-director-2026-07-09`

Files changed:

- `top-shot/src/engagementDirector.js`
- `top-shot/src/systems.js`
- `top-shot/tests/simSmoke.js`
- `top-shot/docs/CHANGELOG_ENGAGEMENT_DIRECTOR_2026-07-09.md`

Changes made:

- Added an engagement director layer so tactical behavior is not only isolated survival or isolated attack logic.
- Added a survival floor: under fire or wounded fighters are forced into cover, dive, roll, climb, smoke, grapple, or break contact.
- Added an aggression floor: if the fight stalls, a fighter must escalate with cover peek fire, close range attack, stealth flank, vertical reposition, or bound-to-cover movement.
- Added attack windows so fighters can briefly override passive preservation and actually force action when the timing is right.
- Added anti-stall tracking with last meaningful action timestamps.
- Added class-flavored escalation: gun users peek fire or bound to cover, stealth fighters flank or grapple to high cover, melee fighters close the distance.
- Updated the main tactical loop to call the engagement director before brain/tactics/attack resolution.
- Updated the smoke test so it checks for evasion under fire and verifies that fights escalate out of passive wandering.

Known risks or not verified:

- Browser runtime was not executed from this connector, so Kam should verify visually on Render.
- This is the missing logic balance layer, not the final animation quality pass. The next pass still needs authored animation timing for wound holds, cover peeks, dives, rolls, and strikes.
