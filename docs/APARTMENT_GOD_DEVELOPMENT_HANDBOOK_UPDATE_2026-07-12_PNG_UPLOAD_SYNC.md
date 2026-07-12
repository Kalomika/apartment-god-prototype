# Handbook Update Patch, PNG Upload Sync

Created: 2026-07-12 03:36 PM CT
Branch: phaser-migration

This patch file exists because the current connector replaces whole files instead of applying small patches safely. Merge these changes into `docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md` during the next safe full file update.

---

## Required Reading Before Work Change

In Section 2, add this line inside the required reading block:

```txt
docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md
```

Recommended full block:

```txt
docs/APARTMENT_GOD_DEVELOPMENT_HANDBOOK.md
docs/APARTMENT_GOD_BACKUP_POLICY.md
docs/APARTMENT_GOD_NO_BROAD_IMPLEMENTATION_RULE.md
docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md
apartment-god-production/ONGOING_DESIGN_LOG.md
apartment-god-production/DEVELOPMENT_MATRIX.md
```

After the no broad implementation paragraph, add:

```txt
The PNG upload fallback defines how generated or uploaded PNG sprites can be committed as real .png files on phaser-migration when Agent or Codex usage is limited and the native GitHub connector cannot directly move binary image streams.
```

---

## Suggested New Section

Add this after Section 17, Visual Quality Direction, or before the Repo Map:

```txt
## PNG Asset Upload Fallback

When PNG sprites or image assets need to be moved into the repo, do not depend only on Agent or Codex availability.

Use:

docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md

Preferred path: use a Custom GPT Action or equivalent GitHub REST API call to write Base64 PNG content directly to a real .png path on phaser-migration.

Emergency path only: commit .png.b64 text files, then decode them into real PNG files before runtime integration.

Never treat .png.b64 files as final game assets.

Never write PNG assets to main unless Kam explicitly asks for a Render playable branch update.

Never change Render settings.

Never touch Kalomika/ai-rpg-engine.

Before uploading PNGs:

1. Inspect existing asset folders.
2. Avoid overwriting other agents' work.
3. Use clear sprite folders.
4. Update or create the asset manifest.
5. Keep runtime integration behind safe fallbacks until browser tested.

Recommended folders:

assets/sprites/characters/<character_id>/
assets/sprites/objects/<object_id>/
assets/sprites/vehicles/<vehicle_id>/
assets/sprites/effects/<effect_id>/
assets/manifests/
```
