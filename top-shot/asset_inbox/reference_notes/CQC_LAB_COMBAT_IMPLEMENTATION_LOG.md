# Top Shot CQC Lab Combat Implementation Log

Date: 2026-07-08
Branch: top-shot-v0-1
Purpose: Keep the CQC Lab direction in the project log for any AI or human agent who works on Top Shot, not only Codex.

## Logged request

The CQC Lab bodies are acceptable for prototype testing. The soldier can stay bulky for now because it reads like armor. Do not prioritize redesigning body proportions right now. Prioritize CQC behavior, spacing, hit detection, readable reactions, auto combat, and close range camera readability.

## Implementation pass started

The first implementation pass has been committed to the live Top Shot branch. It adds CQC Lab systems for:

- Auto CQC toggle, fighters keep fighting until Auto is turned off, Pause is hit, or Reset is hit.
- Manual buttons for individual move testing.
- Close distance logic so fighters step into realistic strike, clinch, sweep, and mount range.
- A smaller invisible collision core so fighters do not pass through each other.
- Body part hitbox data for head, neck, chest, ribs, solar plexus, gut, liver, kidney, back, arms, forearms, hands, legs, knees, and feet.
- Body shots to gut, ribs, liver, solar plexus, thighs, and calves.
- Directional recoil, lean, stagger, fold, twist, and leg stumble reactions based on hit zone.
- Side aware blocking and parrying.
- Sweeps, trips, knockdowns, grounded states, mounting, mount escape attempts, ground punches, and ground knife threats.
- Limb control and disarm states.
- Knife attacks and gun butt strikes in CQC.
- Style based auto move choices for military survival, gun fu, Jeet Kune Do inspired striker, acrobatic blade fighter, and generalist profiles.
- A CQC smoke test that runs manual actions, Auto CQC, and hitbox generation checks.

## Animation study pass

The actor rig pass was guided by core animation principles used across 2D, 3D, and game animation:

- Staging, the pose must clearly tell what is happening even with rough placeholder characters.
- Anticipation, attacks need readable preparation before contact.
- Arcs, limbs should travel in curved, believable motion instead of robotic straight lines.
- Slow in and slow out, motion should accelerate into impact and recover with readable ease.
- Follow through and overlapping action, accessories and upper body parts should lag slightly after the main move.
- Squash and stretch, not cartoon mush, but controlled compression and extension that sells mass and impact.
- Timing, different attacks need different beats, jabs, elbows, sweeps, throws, and ground strikes should not all feel the same.
- Pose clarity, every CQC state should have a silhouette that reads from the camera.

## Animation rig pass committed

A second implementation pass has now been committed to `top-shot/src/three/actors3D.js`.

It adds or improves:

- Body shot poses with torso fold and lower hand placement.
- Head hit snap, side fold, gut fold, and leg stumble poses.
- Sweep and trip leg placement so the attacking foot reaches low across the opponent's base.
- Mount top and mounted bottom poses with the top fighter visually raised over the downed body.
- Ground punch and ground knife poses.
- Limb control, grab, disarm, judo throw, gun butt, knife stab, knee, kick, elbow, jab, and cross pose support.
- Follow through on tie, lapel, bandana, and hair pieces.
- Expanded actor hurt zones and limb volumes for head, neck, chest, ribs, solar plexus, gut, pelvis, thighs, calves, elbows, knees, fists, feet, and mount anchor.
- Rifle staging so rifles sling to the back during fist fighting instead of protruding awkwardly from the body.
- Pistol staging so pistols holster during bare hand moves and return to hand for gun butt or shooting moves.
- Blade staging so knives and blades only come forward during knife actions and otherwise read as carried or sheathed.

## Environment collision fix

A collision pass was added after the user showed a Render screenshot where fighters were going through CQC Lab objects.

The fix adds:

- Legal CQC fight anchors so fighters do not spawn or reset inside props.
- Per-frame environment collision resolution for CQC Lab fighters.
- Movement through `legalStep`, so approach, auto pressure, step back, slips, recoil, sweeps, throws, and mount anchoring respect blocked geometry.
- `legalPoint` and fallback ring searches to move fighters to the nearest legal open floor if any action pushes them into blocked space.
- Legal mount anchors so mounted pairs stay on valid floor instead of sharing a point inside a table, wall, crate, or prop.
- Smoke test assertions that fail if either fighter enters blocked prop space at spawn, during manual actions, or during Auto CQC.

## Priority still open

The lab now has playable CQC logic, stronger rig poses, and environment collision protection. The next pass should add better interpolation curves, attack anticipation frames, impact freeze frames, actual reaction timing offsets, cleaner throw arcs, sharper camera emphasis during close exchanges, and richer CQC pushbox/hurtbox visualization.

## Requested combat design target

CQC should eventually support a readable chain like:

hit, body shot, stagger, sweep, fall, mount, stab attempt, limb grab, reversal, disarm, get up, reengage.

## Cinema and martial arts direction

Use original character archetypes inspired by real martial arts and film action language. Do not copy exact choreography.

Research and translate movement logic from:

- Rambo type military survival action, knife work, ambushes, body shots, takedowns, weapon retention.
- John Wick type gun fu, judo, close range shooting, disarms, gun redirects, grappling into shots.
- Bruce Lee's Jeet Kune Do, interception, fast straight attacks, side kicks, trapping hands, broken rhythm.
- John Woo type heroic bloodshed action, diving, sliding, dramatic close gun threats, mounted attacks, stylish risk.
- The Raid style pressure, elbows, knees, sweeps, clinch strikes, knife panic, brutal counters.
- Jackie Chan style improvised action, object use, awkward escapes, trips, flips, balance recovery, creative counters.

## Files changed in this pass

- `top-shot/src/cqcLab.js`
- `top-shot/src/three/actors3D.js`
- `top-shot/index.html`
- `top-shot/tests/cqcSmoke.js`
- `top-shot/tests/modelSmoke.js`
- `top-shot/package.json`
- `top-shot/asset_inbox/reference_notes/CQC_LAB_COMBAT_IMPLEMENTATION_LOG.md`
- `top-shot/asset_inbox/ASSET_MANIFEST.md`
