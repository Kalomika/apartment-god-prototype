# Apartment God True Top Down Anime Visual Standard

Status: active production rule

Applies to: environments, characters, animals, vehicles, props, effects, animation, and UI art that appears inside the game world

## Project Separation Rule

Apartment God and Top Shot are different games with different production pipelines.

Apartment God is a true top down 2D sprite game. Top Shot is the project that uses 3D models. Never import Top Shot model, rig, renderer, or animation pipeline instructions into Apartment God.

## Target

Apartment God should feel like a mature late 1990s science fiction anime production viewed from directly overhead. `Ghost in the Shell` and `Cowboy Bebop` are mood, lighting, costume, vehicle, and production-design references only. Do not copy characters, locations, logos, frames, or protected designs.

The game must retain its own identity. The desired traits are:

1. Adult proportions and believable construction.
2. Restrained industrial color, selective warm accents, and controlled cyan light.
3. Forms separated mainly by color, value, material, and light, not thick black toon outlines.
4. Painterly environment plates with crisp gameplay silhouettes above them.
5. Anime timing with strong poses, readable holds, and an effective 8 frames per second starting point where appropriate.
6. Hand-drawn 2D effects for impacts, steam, light, water, smoke, and emotional accents.

## Camera Law

Runtime world art uses a strict overhead camera. The top surfaces of upright things are visible. Front and side elevations are not pasted onto the floor.

Every asset must pass these checks:

1. The ground contact point or footprint is known.
2. Vertical height is communicated with overlap, top surfaces, restrained contact shadow, and material changes.
3. A standing person shows crown, shoulders, upper torso mass, arms, and feet arranged around one vertical axis.
4. A chair, appliance, toilet, cabinet, or post shows the surface that an overhead camera could see.
5. A vehicle shows roof or open cabin, hood, rear deck, glass, mirrors, and thin tire hints, not a side elevation.
6. A dog stands on four feet from above. A pose that reads as lying on its back is rejected unless that exact action is requested.
7. Isometric, three-quarter, front, and side-view contamination is rejected for runtime world sprites.

## Upright Object Test

Before approval, temporarily remove labels and ask:

1. Does the object still read correctly?
2. Does it look upright in the world instead of laid flat?
3. Are the visible surfaces possible from directly above?
4. Is the contact shadow attached to the footprint?
5. Does it preserve nearby collision scale?

If any answer is no, the asset stays out of the production manifest.

## Character And Animal Production Direction

The long-term character and animal pipeline is a shared modular 2D sprite system. Humans use consistent adult anatomy, identity sheets, reusable wardrobe layers, stable scale, and action-specific animation. The dog uses a consistent quadruped sprite base. The sprite pipeline should provide:

1. True overhead 2D anatomy turnarounds.
2. Color and light separation without heavy outlines.
3. Controlled frame sampling for anime timing.
4. Stable anchors, frame dimensions, and collision footprints.
5. Directional clips derived from one approved identity sheet per character.
6. Modular clothing and prop layers that stay aligned across actions.
7. 2D effect layers and painterly environment integration.

PNG sprite sheets are the primary runtime character and animal format. Do not build the full cast as unrelated single-frame guesses. Use approved master character sheets, consistent proportions, shared frame rules, modular layers, and coherent action sets.

## Animation Contract

Each major action must define its own approach, entry, loop, and exit needs. Do not map unrelated actions to one generic arm motion.

The production inventory must distinguish at least:

1. Locomotion and directional idles.
2. Sitting, sleeping, waking, showering, grooming, toilet use, and wardrobe changes.
3. Cooking, eating, drinking, cleaning, reading, computer work, phone use, and television.
4. Pool, weights, heavy bag, swimming, games, social actions, and emotional reactions.
5. Dog locomotion, rest, eating, drinking, petting, ball play, and bathing.
6. Vehicle approach, unlock, door open, boarding, door close, driving, parking, exit, and lock.

Use 8 frames per second as a style starting point, not a hard limit. Strong posing and contact timing come before smoothness.

## Approval Gates

An asset can be marked `production` only when:

1. A backup exists for the branch receiving the change.
2. The source reference and intended use are recorded.
3. It passes the camera and upright object tests.
4. It has transparent edges or a deliberate room-sized crop.
5. Its anchor, scale, direction, and fallback are defined.
6. It is inspected at actual game scale.
7. Loading failure does not blank or crash the game.
8. The manifest, matrix, ongoing log, development log, and handoff are updated.

Rejected generations are evidence, not runtime assets. Record why they failed, then keep them out of the game.

## Current Approved Slice

Anime visual pass 01 approves only:

1. Garage painterly floor plate.
2. Family SUV, closed state.
3. Sports convertible, closed state.

The current human and dog image attempts are rejected for camera or posture errors. Existing procedural renderers remain as safe fallbacks until approved overhead 2D sprite sets pass review.
