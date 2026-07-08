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

## Priority still open

This pass gives the lab playable combat logic and button coverage, but visual animation depth still needs more work. The next pass should improve the 3D actor rig poses so body shots visibly fold the torso, sweeps show leg contact, mounted fighters sit higher on the grounded fighter, and rifles sling cleanly to the back during fist fighting.

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
- `top-shot/index.html`
- `top-shot/asset_inbox/reference_notes/CQC_LAB_COMBAT_IMPLEMENTATION_LOG.md`
- `top-shot/asset_inbox/ASSET_MANIFEST.md`
