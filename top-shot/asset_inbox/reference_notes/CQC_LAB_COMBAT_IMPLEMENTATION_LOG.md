# Top Shot CQC Lab Combat Implementation Log

Date: 2026-07-08
Branch: asset/cqc-lab-combat-notes
Purpose: Preserve the requested CQC Lab combat direction for Codex/runtime implementation without touching live gameplay files.

## Current visual note

The current CQC Lab bodies are acceptable for prototype testing. The bodies may be slightly bulky, but that can read as armor on the soldier. Do not prioritize redesigning body proportions right now. Prioritize combat function, spacing, hit detection, believable reactions, auto combat, and close range camera readability.

## Primary CQC goal

CQC Lab must become a useful test area for close quarters combat. Fighters need to close distance until fists, elbows, knees, kicks, headbutts, grabs, knife attacks, gun strikes, and disarms can actually connect. They must not walk through each other or share the exact same body space.

## Distance, collision, and body contact

- Fighters should automatically close the gap when attacking.
- They should stop at believable striking, clinch, sweep, grab, or mount range.
- Each fighter needs a collision barrier so full body clipping cannot happen.
- Use a slightly smaller invisible collision core inside the visible body so a tiny amount of visual compression can sell impact.
- The visible sprite can overlap slightly for contact readability, but the invisible collision core must prevent one body from passing through another body.

## Body part hitboxes

Each fighter should eventually have individual hitboxes for:

- Head
- Neck
- Chest
- Ribs
- Solar plexus
- Abdomen
- Liver area
- Kidney area
- Back
- Left arm
- Right arm
- Left forearm block zone
- Right forearm block zone
- Left hand
- Right hand
- Left leg
- Right leg
- Left knee
- Right knee
- Left shin
- Right shin
- Left foot
- Right foot

These hitboxes should support punches, body shots, elbows, knees, kicks, headbutts, grabs, sweeps, knife strikes, gun butt strikes, bullets, disarms, limb control, and grounded attacks.

## Strike range

Attacks should only connect if the attacking limb reaches the target hitbox. A punch should be able to hit a face when fighters are close enough. Do not let attacks hit from unrealistic distance, and do not force fighters to stay too far apart during CQC.

## Directional impact reactions

Do not make the whole body simply jitter backward on impact. Reactions should depend on the attack direction and hit location.

- A front hit should push or fold the target backward.
- A punch coming from the attacker's right side should make the victim stagger away from that force.
- A kick from the side should stagger the target opposite the kick direction.
- A head hit should affect the upper body and head more strongly than the lower body.
- A gut shot should fold the fighter inward.
- A rib shot should twist the torso.
- A liver side hit should stagger the target sideways and slow recovery.
- A thigh kick should weaken stance.
- A calf kick or sweep attempt should affect balance.

## Body shots

CQC cannot only target the head. Add body shot support for:

- Ribs
- Solar plexus
- Gut
- Liver area
- Kidneys
- Chest
- Back
- Thighs
- Calves

Body shots should produce reactions that differ from head shots. A gut shot should fold the target inward, a rib shot should twist the target, and a leg shot should affect stance and movement.

## Blocking logic

Blocks should respond to the side and height of the incoming attack.

- Right punch incoming, defender usually blocks with the left arm.
- Left punch incoming, defender usually blocks with the right arm.
- Right kick incoming, defender blocks or checks with the left side depending on the move.
- Left kick incoming, defender blocks or checks with the right side depending on the move.
- When attackers switch strike side, defenders should switch block side.
- Blocks should visually match the attack they are defending against.

## Sweeps, trips, and balance

Add sweep attacks and trip logic.

Sweep outcomes:

- Clean sweep, defender falls.
- Partial sweep, defender stumbles but stays up.
- Blocked sweep, defender checks, lifts, or avoids the leg.
- Countered sweep, attacker can be grabbed, shoved, kicked, thrown, or punished.

Sweeps should use leg collision and balance states. Do not let attacker or defender pass through each other during the move.

## Knockdown and grounded states

Add grounded combat states:

- Standing
- Staggering
- Falling
- Grounded on back
- Grounded on stomach
- Grounded on side
- Trying to get up
- Mounted
- Mounting
- Escaping mount

A knocked down fighter should not instantly pop back up unless a specific move calls for it. They should have a readable recovery window.

## Mounting

Add mounting as a real CQC feature. If a fighter knocks someone down or jumps onto them, the top fighter should mount on top of the body, not clip through it.

Mount positions:

- Full mount
- Side mount
- Back mount
- Knee on body
- Standing over opponent
- Jumping mount

Mounting should use collision anchoring. The top fighter must stay visually above the downed fighter, never inside the body.

## Ground attacks and mount defense

From mount, the attacker can attempt:

- Punches
- Elbows
- Knife stab
- Knife slash
- Choke attempt
- Limb control
- Disarm
- Gun grab
- Gun press
- Head smash
- Transition to another mount

The defender can attempt:

- Block
- Buck
- Roll
- Push off
- Trap arm
- Grab weapon hand
- Kick out
- Escape
- Reverse position
- Disarm from bottom

## Limb attacks and limb control

A fighter should be able to grab or attack:

- Wrist
- Elbow
- Shoulder
- Knee
- Ankle
- Neck

Use limb control for disarms, joint control, throws, knife hand control, gun hand redirection, ground escapes, mount reversals, and weapon retention.

## Jumping attacks and acrobatics

Some characters should support more cinematic movement, especially John Woo style and Hong Kong action inspired archetypes.

Add support for:

- Jumping onto opponents
- Vaulting over a body
- Rolling over a shoulder
- Flip evasions
- Judo style throws
- Drop attacks
- Flying knee
- Flying kick
- Jumping knife attack
- Wall assisted movement later

These moves must still obey collision rules. No passing through bodies, no teleporting through enemies, and no mounting unless the fighter lands on a valid mount position.

## Knife fighting

Add knife support in CQC Lab. Some characters can have knives or pick up knives.

Knife combat should support:

- Slash
- Stab
- Block or parry
- Disarm
- Dodge
- Knife hand control
- Close range threat behavior
- Knife attack from mount
- Knife defense from bottom

## Gun handling during CQC

The fighter on the right currently appears to have a long protrusion that reads wrong. If that is the gun, fix the presentation.

Rules:

- If a fighter switches to fists, the gun should be tossed aside, lowered, slung, or put on the back.
- Do not leave the gun protruding awkwardly from the body during fist fighting.
- If the gun is still in hand and the opponent gets too close, the fighter should be able to use the gun as a melee weapon.
- Add gun butt strike behavior.
- Add disarm behavior when one fighter is close enough.

## Close range shooting

Shooting should still be possible at close range, but it should create risk.

- The attacker may get a shot off first.
- The defender may grab or disarm.
- The gun can be redirected.
- The gun can be used as a melee weapon if the shot is blocked or crowded.

## Ammo realism planning

Guns should eventually follow real magazine logic.

- AK style weapons should use realistic magazine counts.
- Fighters should know they have limited bullets.
- AI should not fire constantly with no regard for ammo.
- When out of bullets, fighters should reload if possible, switch weapons, melee, flee, or reposition.
- Focus on CQC first, but do not build combat logic that assumes infinite ammo forever.

## Auto combat mode

CQC Lab needs a true Auto mode.

When Auto is turned on:

- Fighters continuously engage.
- They close distance automatically.
- They attack, block, dodge, stagger, recover, counter, sweep, mount, escape, and reposition.
- The fight continues until Pause, Reset, or Auto is turned off.
- Auto should not require repeated player button presses.
- It should feel like a back and forth Jackie Chan, The Raid, John Wick, John Woo inspired exchange, even with simple prototype graphics.

When Auto is turned off:

- Fighters stop autonomous combat.
- Manual buttons still work for testing individual actions.
- Pressing Jab should trigger one jab so the move and hit logic can be inspected.

## Manual CQC test controls

Manual CQC Lab controls should support:

- Jab
- Cross
- Hook
- Body shot
- Elbow
- Knee
- Kick
- Sweep
- Trip
- Block
- Dodge
- Grab
- Throw
- Headbutt
- Knife attack
- Gun butt strike
- Disarm
- Mount
- Escape mount
- Ground punch
- Ground knife attack
- Limb grab
- Jump attack
- Reset
- Pause
- Auto toggle
- Style profile selector

## Main Match camera requirement

The Main Match should eventually support the same close viewing level as CQC Lab. When fighters close into CQC range, the camera should zoom in enough to watch the fight clearly. Do not keep Main Match stuck too far away when CQC happens.

## Martial arts and cinema style profile system

Build CQC around original character archetypes inspired by real martial arts and cinema action language. Do not copy exact movie choreography. Study the logic, range, timing, rhythm, and movement type, then translate it into original game compatible moves.

Correction: Bruce Lee's style is Jeet Kune Do.

Candidate style profiles:

1. Military survival fighter
Inspired by Rambo type action. Focus on knife work, brutal body shots, ambushes, grabs, survival strikes, takedowns, weapon retention, and grounded finishing moves.

2. Gun fu assassin
Inspired by John Wick type action. Focus on judo throws, close range shooting, weapon retention, disarms, gun redirects, grappling into shots, knife defense, and fast transitions from standing to ground.

3. Jeet Kune Do striker
Inspired by Bruce Lee's Jeet Kune Do philosophy. Focus on interception, fast straight attacks, side kicks, trapping hands, broken rhythm, feints, counters, and efficiency.

4. Hong Kong heroic bloodshed fighter
Inspired by John Woo style action language. Focus on diving, sliding, dual weapon drama, mounted attacks, close gun threats, risky acrobatics, and stylish movement.

5. Raid style pressure fighter
Focus on elbows, knees, sweeps, clinch strikes, wall pressure, knife panic, fast counters, and brutal close range exchanges.

6. Jackie Chan improvised fighter
Focus on environmental movement, awkward escapes, object use, trips, flips, balance recovery, improvised blocks, and creative counters.

## Character fight style data

Each fighter should eventually have a fight style profile that defines:

- Preferred range
- Preferred opening move
- Strike choices
- Defense choices
- Grab choices
- Ground behavior
- Weapon behavior
- Risk level
- Acrobatic level
- Disarm skill
- Knife skill
- Gun retention skill
- Stamina behavior
- Panic behavior when hurt
- Behavior when out of ammo

## Immediate priority order

1. Fix CQC distance closing.
2. Add collision barriers so fighters cannot pass through each other.
3. Add body part hitboxes.
4. Make punches actually reach faces.
5. Add body shots.
6. Add directional stagger and lean reactions.
7. Add Auto combat loop.
8. Add side aware blocking.
9. Add sweeps and trips.
10. Add knockdowns and grounded states.
11. Add mounting.
12. Add mount attacks and mount escapes.
13. Add knife threat from standing and mount.
14. Add gun disarm and gun butt strike logic.
15. Add kicks, knees, elbows, headbutts, grabs, throws, and limb grabs.
16. Add style profile selector.
17. Later, wire this into Main Match camera zoom and ammo realism.

## Test target

In CQC Lab, pressing Auto should make both fighters close distance and continuously fight until Auto is turned off, Pause is pressed, or Reset is pressed. Manual buttons should still trigger isolated moves for testing. Fighters should look like they are actually connecting strikes at believable range without walking through each other.

A strong CQC chain should eventually support: hit, body shot, stagger, sweep, fall, mount, stab attempt, limb grab, reversal, disarm, get up, reengage.
