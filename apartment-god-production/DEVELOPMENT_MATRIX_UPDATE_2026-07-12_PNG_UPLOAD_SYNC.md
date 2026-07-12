# Development Matrix Update Patch, PNG Upload Sync

Created: 2026-07-12 03:37 PM CT
Branch: phaser-migration

This patch file exists because the current connector replaces whole files instead of applying small patches safely. Merge these changes into `apartment-god-production/DEVELOPMENT_MATRIX.md` during the next safe full file update.

---

## System Matrix Row Update

Replace the current `Sprite replacement pipeline` row with:

```txt
| Sprite replacement pipeline | PLANNED | `assets/sprite_replacement_queue/`, `assets/manifests/`, `docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md` | Needed for true top down visual quality. PNG upload fallback is documented so Base64 PNG data can be committed through the GitHub Repository Contents API as real PNG files when Agent or Codex usage is limited. Runtime sprite replacement remains PLANNED until assets are uploaded, manifested, wired behind fallbacks, and browser tested. | Create asset manifest before broad sprite replacement. Run a harmless PNG upload proof test on phaser-migration before production sprite sets. |
```

---

## Test Matrix Row To Add

Add this test row near visual reference use or character sprite integrity:

```txt
| PNG upload fallback proof | High | PLANNED | Use a harmless test PNG on phaser-migration through the Custom GPT Action or equivalent GitHub REST API path. Confirm GitHub renders it as a normal PNG, confirm the path is under approved assets, then remove or replace the test asset before production use. |
```

---

## Risk Matrix Row To Add

Add this risk row near Sprite pipeline:

```txt
| PNG API upload fallback | Medium | Can bypass local build checks and can overwrite assets if sha, branch, or paths are wrong. | Use phaser-migration, require sha for updates, keep manifests, inspect existing files first, and never write to main without explicit Render update approval. |
```

---

## Update Rule Addition

In Section 7, Update Rule, add:

```txt
10. PNG Upload Fallback Rule
```

---

## New Section To Add

Add this as a new section after the character and animation quality law:

```txt
## PNG Upload Fallback Rule

When Agent or Codex usage is limited, PNG sprite delivery must not stop.

Use `docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md` as the official fallback.

Preferred path:

Use a Custom GPT Action or equivalent GitHub REST API call to write Base64 PNG content directly to a real `.png` path on `phaser-migration`.

Emergency path only:

Commit `.png.b64` text files only when no direct API upload action is available, then decode them into real PNG files before runtime integration.

Rules:

1. Do not treat `.png.b64` files as final game assets.
2. Do not write PNG assets to `main` unless Kam explicitly asks for a Render playable branch update.
3. Do not change Render settings.
4. Do not touch `Kalomika/ai-rpg-engine`.
5. Inspect existing asset folders before upload.
6. Avoid overwriting other agents' work.
7. Use clear sprite folders.
8. Update or create the asset manifest.
9. Keep runtime integration behind safe fallbacks until browser tested.
10. Run a harmless PNG proof test before production sprite sets.

Recommended folders:

assets/sprites/characters/<character_id>/
assets/sprites/objects/<object_id>/
assets/sprites/vehicles/<vehicle_id>/
assets/sprites/effects/<effect_id>/
assets/manifests/
```
