# Ongoing Design Log Append: Bath Bed Character State Fix Started

Status: IN_PROGRESS
Branch: phaser-migration
Date: 2026-07-13
Runtime files changed: in progress
Render playable branch updated: no
Render settings changed: no
Backup branch:
- backup/phaser-migration-before-bath-bed-state-fix-2026-07-13

## Current bug/directive batch logged before completion

Kam reported the following current live issues and directives:

- Upstairs shower keeps running after the actor leaves.
- Shower steam and sliding door should only animate while someone is actively showering in that specific shower.
- Actor should not use the upstairs shower and then immediately route downstairs to use another shower/bathroom unless there is a deliberate reason.
- Towel should not float. It should attach to the actor's body as a towel wrap, with the male towel reading as a white waist/leg wrap.
- Upstairs toilet orientation is wrong and should not face the wall.
- Nearby upstairs/master bathroom should be a usable nearest choice when actors wake up upstairs.
- Standing pee and seated toilet use should be separate male states.
- Standing pee should show a small stream and partially relieve bladder.
- Seated toilet use should represent bowel/full reset behavior and fully reset the relevant meter.
- Bed should not appear instantly made after wake-up unless a make-bed action occurred.
- Actors should not walk over or through the bed as if the bed is flat floor. Wake flow should be side-of-bed, stand, then route around the bed.
- North-facing seated characters currently look like two people mashed together.
- North walking needs a real back-facing/north-facing pose, not a south/front-biased cheat.
- Food should only appear on the dining table if someone actually prepared/served a meal.
- Closing the tab/app should stop because the runtime is gone, but simply minimizing the browser/app should not pause the simulation. Life should continue as long as the app or tab is still open.
- Desktop should eventually support mouse drag pan and/or right-click compass navigation.
- The empty upstairs room near the stairs should become a panic room with a steel door and emergency/security props now if safe.
- Yearly hostile event/panic protocol system should be preserved as a planned gameplay system, not rushed into this bug fix.

## Rule added

Created `docs/APARTMENT_GOD_IDEA_LOGGING_RULE.md` so future work must log Kam's directive before execution and keep ideas searchable for other AI chats.

## Immediate implementation scope

This pass is limited to immediate state, routing, render, and platform behavior fixes that can be safely patched without another broad upstairs overhaul.

## Deferred/planned scope

The full panic room hostile event system, desktop navigation overhaul, true PNG replacements, and multi-screen upstairs expansion require separate audited passes.
