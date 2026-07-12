# PNG Upload Instruction Update Prompt

Use this for the project or member instruction area if the instruction limit is 8K.

```txt
Apartment God PNG asset rule:
When PNG sprites or image assets need to be moved into Kalomika/apartment-god-prototype, do not depend only on Agent or Codex availability. Use docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md.

Preferred path: use a Custom GPT Action or equivalent GitHub REST API call to write Base64 PNG content directly to a real .png path on phaser-migration.

Emergency path only: commit .png.b64 text files, then decode them into real PNG files before runtime integration.

Never treat .png.b64 files as final game assets. Never write PNG assets to main unless Kam explicitly asks for a Render playable branch update. Never change Render settings. Never touch Kalomika/ai-rpg-engine.

Before uploading PNGs, inspect existing asset folders, avoid overwriting other agents' work, use clear sprite folders, update or create the asset manifest, and keep runtime integration behind safe fallbacks until browser tested.

Recommended folders:
assets/sprites/characters/<character_id>/
assets/sprites/objects/<object_id>/
assets/sprites/vehicles/<vehicle_id>/
assets/sprites/effects/<effect_id>/
assets/manifests/
```

This instruction block is intentionally under 8K characters.
