# Apartment God Prototype Visual Style Guide

This document defines the target look for the upgraded Apartment God Prototype art pipeline. Every asset chat, sprite pass, reference board, and production handoff should match this guide before anything moves into an integration queue.

## Core Direction

Apartment God Prototype is a realistic top-down cyberpunk life simulation set inside an apartment world. The future look should feel grounded, adult, lived in, and readable from gameplay distance.

The style target is realistic human linework seen from an orthographic top-down camera. Characters should feel like adults living in a cramped cyberpunk apartment, not mascots, toys, icons, emojis, or chibi sprites.

## Camera and Projection

- Use an orthographic top-down game view.
- Keep perspective distortion minimal.
- Keep silhouettes readable at gameplay scale.
- Keep props and furniture aligned to the same apartment floor grid.
- Avoid dramatic side-view poses unless the state specifically needs a bed, couch, or floor interaction.
- Avoid camera angles that make the sprite feel like a portrait, sticker, or side-scroller frame.

## Human Proportions

Human characters must use adult proportions.

Do:
- Use realistic adult anatomy.
- Keep heads proportional to bodies.
- Keep shoulders, hips, arms, legs, hands, and feet believable.
- Show enough anatomical structure for the pose to read from overhead.
- Use pose language that feels natural and restrained.
- Build movement out of weight, balance, and body mechanics.

Do not:
- Use chibi proportions.
- Use oversized heads.
- Use baby-like hands or feet.
- Use cute toy bodies.
- Use emoji body language.
- Use bouncy mascot poses.
- Use childish proportions for adult characters.

## Linework Expectations

The linework should feel hand drawn, controlled, and practical for gameplay.

Required:
- Clean exterior contour lines.
- Slightly heavier outer silhouettes.
- Thinner interior lines for clothing folds, limbs, hair, and props.
- Clear separation between overlapping limbs.
- Enough detail to feel realistic without becoming noisy.
- Transparent PNG delivery for sprites.
- Consistent scale, anchor point, and state ID across frames.

Avoid:
- Sketch fuzz.
- Random scratch marks.
- Icon style simplification.
- Unreadable black blobs.
- Overly thick cartoon outlines.
- Soft painterly edges on gameplay sprites.
- AI artifacts, extra fingers, fused limbs, broken joints, or mismatched anatomy.

## Cyberpunk Apartment Tone

The apartment should feel dark, cramped, expensive to maintain, and lived in. It is not a clean sci-fi showroom. The space should feel like someone actually sleeps, eats, works, argues, relaxes, and survives there.

Use:
- Dark walls.
- Low ambient light.
- Neon cyan and magenta accents.
- Small practical light sources.
- Lived-in clutter.
- Cables, laundry, takeout, tools, monitors, dishes, papers, and personal objects.
- Furniture that feels used, not showroom perfect.
- Clear room function, even when messy.

Avoid:
- Empty rooms.
- Cute dollhouse layouts.
- Bright toy colors.
- Sterile white sci-fi interiors.
- Generic emoji apartment props.
- Flat procedural rooms with no life.

## Lighting Direction

Lighting should support readability first, mood second.

Required:
- Characters must still read clearly over dark floors and walls.
- Neon should rim or accent forms, not erase them.
- Cyan and magenta lights may separate room zones.
- Use small pools of light around lamps, screens, windows, and appliances.
- Keep shadows graphic and readable.

Do not:
- Flood every asset with neon.
- Hide gameplay silhouettes in darkness.
- Use neon as a replacement for drawing structure.
- Overuse bloom in source art.
- Bake lighting so hard that runtime color correction cannot work.

## Color Direction

The palette should stay controlled and mature.

Use:
- Deep charcoal walls.
- Blue-black shadows.
- Muted concrete or worn wood floors.
- Desaturated furniture colors.
- Cyan, magenta, violet, and amber as accents.
- Skin, hair, clothing, and dog colors that remain believable under colored light.

Avoid:
- Pastel candy palettes.
- Bubblegum pink as a dominant color.
- Toy-store primary colors.
- Cute sticker colors.
- Random rainbow lighting.
- Flat app icon colors.

## Gameplay Readability Rules

Every asset must pass these checks before approval:

- The state is readable at gameplay scale.
- The character type is clear.
- The action is clear without a text label.
- The silhouette is not swallowed by the environment.
- The anchor point stays stable across frames.
- The sprite does not pop in size between states.
- The style matches the other approved assets.
- The asset can be used by runtime later without repainting the whole game.

## Forbidden Styles

The following styles are not allowed for final production assets:

- Chibi.
- Kawaii.
- Emoji.
- Cute mascot.
- Toy figure.
- Rounded mobile icon.
- Childish sticker.
- Procedural placeholder art.
- Watermarked reference art as final art.
- Overly clean sci-fi showroom.
- Thick cartoon outline style.
- AI output with visible anatomy errors.
- Uncontrolled photobash.
- Anything that ignores the top-down apartment view.

## Approval Standard

A finished asset should look like it belongs in a realistic cyberpunk apartment life sim. It should be adult, grounded, readable, and consistent with the production scale. If an asset looks cute, toy-like, childish, icon-like, or unrelated to the apartment tone, it goes to rework or rejection.
