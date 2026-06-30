# Reconstruct Shared Reference Pack

From the repo root, run:

```bash
mkdir -p /tmp/apartment_god_refs
cat apartment-god-production/REFERENCE_LIBRARY/pack_base64/part_*.txt > /tmp/apartment_god_refs/reference_pack.b64
base64 -d /tmp/apartment_god_refs/reference_pack.b64 > /tmp/apartment_god_refs/apartment_god_shared_reference_pack.zip
mkdir -p apartment-god-production/REFERENCE_LIBRARY
unzip -o /tmp/apartment_god_refs/apartment_god_shared_reference_pack.zip -d apartment-god-production/REFERENCE_LIBRARY
```

After extraction, the folder should contain:

```txt
00_contact_sheets/
01_environment_references/
02_human_realistic_topdown_linework/
03_dog_references/
04_legacy_simple_character_refs/
05_current_game_context/
06_department_reference_prompts/
README_REFERENCE_USE.md
reference_manifest.json
```

Do not treat the raw reference images as final game assets. They are visual guidance only.
