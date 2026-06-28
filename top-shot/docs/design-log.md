# Top Shot Design Log

This document captures Kam's Top Shot idea in sequence so another AI or future developer can read the repo and continue without needing the original chat.

## 1. Core game

Top Shot is a top-down AI arena pet battler. The player does not directly control a character in combat. The player builds, trains, supports, extracts, and upgrades their fighter, then watches the fighter survive or fail against another AI fighter.

## 2. Visual read

The fighter should be viewed from above, more realistic than Apartment God, not side-view cartoony. Body construction starts with a smaller head shape over a larger torso shape. Limbs are segmented, not single sticks. Arms have upper arm and forearm pieces with shoulder and elbow joints. Legs have thigh and calf pieces. Feet and wrists are optional later.

## 3. First test archetypes

Start with four test archetypes, not final player classes: Marine, Ninja, Archer, and a Martial Artist or Spy. Marine is Rambo/Commando style with rifle, pistol, knife, grenades later, prone/crawl, toughness, and strong projectile play. Ninja is fast, stealthy, sword-based, uses shurikens, smoke, rush attacks, but cannot absorb much punishment. Archer is Green Arrow/Hawkeye style, strong with arrows, can retrieve arrows, can stab with an arrow up close, and later can use ricochet shots. Spy is John Wick/John Woo/James Bond/Ethan Hunt style with two guns, dives, fast aim, and gun-fu. Martial Artist is Bruce Lee style with no or minimal projectiles, very strong hand-to-hand, counters, sweeps, throws, and pressure.

## 4. Combat intent

Combat should feel like small top-down Raid Redemption/Hong Kong fight choreography, not just circles touching. CQC uses left punch, right punch, left kick, right kick, headbutt, knees later, roundhouse/spin kick, grabs, throws, sword slices, knife strikes, and arrow stabs. Every action can be dodged, blocked, countered, disarmed, or broken through.

## 5. Blocking and counters

Blocks need matching motion logic. If someone attacks with a left fist, the defender should tend to block with the corresponding/right-side arm. If someone kicks with a right leg, the defender can use a leg or arm, but legs are more side-specific. Arms can defend more angles than legs. Blocks have their own limb durability. If a limb's guard is depleted, the strike can break through the block and hit the intended target.

## 6. Damage and injuries

Visible condition should use five stages: Ready, Hurt, Wounded, Critical, and Incapacitated. Being struck should physically affect the fighter. A left-side hit makes the body lean or recoil to the opposite side, a gut kick pushes the body back, a roundhouse can make the character fall sideways, and heavy impacts can knock a fighter down. Injuries should persist after a match. Reinjuring the same limb too often without proper recovery can create permanent limb vitality loss, weakening that limb's strikes and blocks.

## 7. Incapacitation, not death

The game should use incapacitation language. A fighter can be carried out, extracted, or forced into recovery. The long-term goal is that a badly damaged fighter may be unavailable for several future matches, and residual injuries can remain if the player rushes them back too early.

## 8. Extraction

The player is like Colonel Trautman to Rambo. The player can extract their fighter instead of controlling them. A rope drops in from off-screen, the fighter grabs it, and gets pulled out. This forfeits the match but saves the fighter from further damage. Finishing a fight gives more points, but going the distance can risk lasting injuries.

## 9. Coach support and trust

The player cannot move the fighter manually. The player can suggest tactics: go there, take cover, stay ranged, close in, disarm, or urgently run to a tapped location. These are suggestions, not possession. Fighters obey based on trust, discipline, and situation. Good commands that lead to wins raise long-term trust. Bad commands, over-commanding, ignored requests, and losses reduce trust. Fighters can ask for help with a speech-bubble/question icon when hurt, confused, or low on options.

## 10. Stealth and perception

The game needs line of sight like Metal Gear. Fighters have a forward sight cone. If an opponent is outside line of sight or hidden behind cover, they may not be detected. Sound matters. Fast movement makes noise. Slow movement is stealthier. Ninja can move faster without being heard. Marine can go prone and crawl to hide or ambush.

## 11. Ranged weapons and grenades

Bullets should not be animated as slow projectiles. A gunshot is a quick white tracer flash from shooter toward impact. Ricochets should show a quick spark pop. Bullet impacts should show a brief hit effect. Rifle fires three-shot bursts and overheats. Pistol fires single shots. Ninja shurikens and archer arrows should be visible moving projectiles, stick into walls, and be retrievable. Grenades are Marine super moves: high danger, limited, blast radius, instant incapacitation if too close, and strong tactical identity for slower heavily geared fighters.

## 12. Diving and blast avoidance

Characters should be able to dive away from grenades and dangerous impacts. There should be at least three dive reads: flat dive and land, dive and roll, and ninja-style somersault away. A dive shows the body from top-down as back/side/profile mass rather than standing posture. Dives cost stamina, can save the fighter, and still obey collision so they do not pass through walls or objects.

## 13. Cover, physics, and arena objects

Arenas should have walls, pillars, furniture, breakables, cover, and eventually two floors. Characters should hide behind cover, run around objects, crawl, roll, jump off walls, vault, throw opponents into walls, or throw opponents through breakable objects. Broken objects should remain broken. Their pieces can become projectiles.

## 14. Future character creator

The real game is not about default Ninja/Marine/Archer. Players should build their own fighters. The creator asks what fighting style, weapons, punch type, kick type, headbutt style, grappling style, movement style, stealth style, and defensive style they want. Each side can have choices, for example five left-punch styles, five right-punch styles, five kick styles, five knee styles, and so on. Players can mix styles like wrestling games, choosing a preset or building from scratch.

## 15. Future weapon styles

Players can create fighters inspired by archetypes without the game using protected names. Examples: shield thrower with wall bounces, two-gun spy, commando, ninja sword-and-shuriken fighter, dagger-and-grenade fighter, one-arm gun fighter, unarmed stealth bruiser, archer trick-shot fighter, and hybrid builds.

## 16. Matchmaking and growth

Long-term multiplayer goal: players train their fighter like a pet, enter arena fights, and watch results. The game should hide opponent overall ratings so people cannot only pick easy fights. Low-level fighters can still beat strong fighters through strategy, stealth, counters, cover, and lucky critical hits. Top-tier fights should feel like John Wick versus Rambo or elite custom builds clashing.

## 17. UI and phone orientation

The main screen should mostly be the arena. There should be little dialogue or phone UI during battle. If labels are ever needed, they should orient toward the phone orientation so they remain readable. The game should be easy to watch whether the player turns the phone sideways or upright.

## 18. Arena generation

Arena generation is a major pillar. The long-term goal is procedural or AI-assisted arena generation, similar in spirit to how exploration games generate worlds. Start with one test arena, then expand to at least four environment families: jungle or grassland, mall, rocky abandoned ruins, and a broken building/lobby style. Later arenas can have multiple floors, stairs, hiding spots, balconies, sightline traps, breakable props, and different tactical identities.

## 19. Base of operations

Outside the arena, the player should manage a base of operations. The base can include a tech person, training zones, projectile practice, kick/punch practice, recovery rooms, gear storage, food/rest stations, books/courses for trait growth, and customization. This is the part the player can truly control and build. The arena remains AI-driven, but the base is where the commander prepares the fighter. The base and arena are separate modes, each full-screen when active.

## 20. Name direction

Top Shot is the working title because it means top-down shot, top fighter, and shooting toward the top. Other possible future directions mentioned include Commander or U Command, because the player is more commander than direct combatant.

## 21. V0.1 rule

The first version should only prove one-floor, one-on-one AI fights. No multiplayer, no full creator, no full training hub yet. The test is whether the AI fight looks interesting and the mechanics can grow.
