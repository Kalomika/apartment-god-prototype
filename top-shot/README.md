# Top Shot Prototype

Top Shot is a top-down AI arena pet battler prototype. The player trains and supports a fighter, then drops that fighter into an arena to see whether their build, instincts, weapons, stamina, stealth, counters, and damage recovery can survive another AI fighter.

This folder is intentionally isolated from the existing Apartment God prototype so it can be tested without breaking that game. It uses the same general lightweight browser-game style: plain JavaScript modules, canvas rendering, no runtime dependencies, and a static Render deployment path.

## Current v0.1 scope

- One-floor arena test.
- One-on-one AI versus AI matches.
- Four fighter archetypes: Marine, Ninja, Archer, Martial Artist.
- Segmented top-down fighter bodies with head, torso, upper arms, forearms, thighs, and calves.
- AI movement, cover seeking, line of sight, hiding, crouch/prone states, and basic patrol behavior.
- Bullet tracer flashes, ricochet flashes, rifle burst fire, pistol fire, visible arrows, visible shurikens, debris throws.
- Marine grenade super move, grenade fuse, blast radius, dive-away reactions, and blast incapacitation.
- Three dive reads: flat dive, dive roll, and ninja somersault dive.
- Sword slash variants, knife/CQC, arrow stab, punches, kicks, roundhouse, headbutt, blocks, dodges, counters, grapples, throws, disarms, and fall/get-up animation cues.
- Stamina, fight stamina, dodge meter, block meter, ammo, heat, damage stages, bandaging, trust, and incapacitation.
- Coach card drops for Fighter A: med, ammo, weapon refresh, extraction rope.
- Coach suggestions: go there, take cover, stay ranged, close in, and disarm. These are trust-based suggestions, not direct control.
- Double tap arena for an urgent run-there command. Fighters still route around walls and objects.
- Help bubbles when Fighter A is hurt, confused, drained, or asking for a commander call.

## Local run

```bash
cd top-shot
npm install
npm start
```

Open `http://localhost:5174`.

## Checks

```bash
npm run check
npm run smoke
npm run build
```

## Render

Use `top-shot/render.yaml` as a Render Blueprint. This prototype is a static site. The root directory should be `top-shot`, build command `npm install && npm run build`, and publish directory `dist`.

## Name note

Top Shot is a working title. Before public launch, do a proper name and trademark review because other media/products already use close versions of this name.

## Build philosophy

Top Shot should stay modular. Major patches should become new branches or clearly versioned folders. Small fixes can update existing modules. New systems should get their own file instead of turning one file into a fragile mega-controller.
