# Apartment God — Visual Target & Pose Reference Library

Created: 2026-07-23 · Branch: `claude/true-topdown-20260723` · Author: Claude

Purpose: these are **design references / pose targets** supplied by Kam, filed next to the
activities they represent so future model/sprite work has the intended look and pose sitting
beside the code that will use it. They are the north star for the modular character system and the
environment fidelity target.

> **IMPORTANT — these are references, NOT shippable runtime assets.**
> Do not load any file in this tree as a runtime game asset. Several are AI-rendered concept art
> and several are **watermarked/commercial or stock packs** (e.g. the file marked `TOFFU_watermarked`,
> and the architectural-entourage line-art people). Shipping them would be a licensing violation.
> All actual game sprites must be **original art built to these targets**, authored under
> `assets/sprites/...` behind the PNG-upload and safe-fallback rules. This folder lives under
> `apartment-god-production/` (documentation space), deliberately outside the build/runtime pipeline.

## Folder map

| Folder | What it targets | Notes |
|---|---|---|
| `target_mockups/` | The rendered "gold" look of each floor — the fidelity north star | `main_floor_night_city_FLAGSHIP.png` (a0b9453d) is the single best reference for the intended game look + HUD + the "Nova" character portrait. Also: rendered main floor (shower/dining/porch), basement game room, upstairs master. These are slightly high-angle/isometric renders. |
| `environment_mood/` | Warm painterly anime interior mood | Reference for lighting/warmth, not layout. |
| `character_poses/walk_stand/` | Base standing + walk-cycle anatomy, top-down | Includes one strict top-down line-art set and one flat-color slightly-iso set. |
| `character_poses/sit_lounge/` | Sitting, lounging, reading, phone poses | Multi-pose sheets. |
| `character_poses/computer_laptop/` | At-computer / laptop / seated-focus poses | Multi-pose sheet. |
| `character_poses/read/` | (reserved) reading poses | Reading also appears in sit_lounge + mockups. |
| `character_poses/sleep_bed/` | Sleeping / laying-in-bed poses (many variations) | Two large sheets — primary reference for the sleep activity state. |
| `character_poses/activities_mixed/` | Vacuuming, cooking, guitar, exercise, **yoga**, holding baby, etc. | One big entourage sheet; the main source for activity-specific pose identities. |
| `pets/` | Top-down dog & cat anatomy/poses | `..._flatcolor` is the color target; `..._TOFFU_watermarked` is line-art pose reference only (watermarked — reference only). |
| `vehicles/` | Top-down vehicles + mounted riders, colored + labeled | Closest existing match to the current garage vehicle sprites. |

## How these drive the modular character system

The intended character is a **layered, swappable-part sprite** (not a procedural blob, not one fused
image), so clothing/hair/shoes can change at runtime. Reference → layer mapping:

- **Base body / skin / anatomy** ← `walk_stand/` (proportions, top-down foreshortening)
- **Hair** ← head reads in `walk_stand/` + mockup portraits (`target_mockups/*FLAGSHIP*`)
- **Top / shirt / jacket** ← `walk_stand/`, `sit_lounge/`, mockup "Nova"
- **Bottom / pants / skirt** ← `walk_stand/`, `sleep_bed/` seated refs
- **Shoes** ← `walk_stand/` foot reads
- **Activity poses** (entry/loop/exit, directional, object-anchored, with fallback) ←
  `sit_lounge/`, `computer_laptop/`, `sleep_bed/`, `activities_mixed/` (yoga, cook, guitar, exercise)

## Direction note (two Claude branches)

Per Kam's decision, two Claude interpretation branches are being built:
- `claude/true-topdown-20260723` — strict bird's-eye (matches the line-art refs; cleanest for layer swaps).
- `claude/iso-20260723` — slightly high-angle/isometric (matches the rendered `target_mockups/`).

Both share this reference library. Provenance of each file is preserved in its descriptive filename.
