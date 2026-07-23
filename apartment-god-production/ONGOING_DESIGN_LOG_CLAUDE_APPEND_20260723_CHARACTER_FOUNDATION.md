# Ongoing Design Log — Claude Append 2026-07-23 — Modular Character Foundation

> Append file. Canonical `ONGOING_DESIGN_LOG.md` is frozen at 2026-07-13; per repo convention this
> append must be merged into the canonical log at the next safe documentation sync.
> **Canonical merge pending: yes.**

## Entry: Modular top-down character system — foundation proving slice

- **Status:** Committed — NEEDS_REVIEW (visual first pass) / NEEDS_TESTING (not yet wired into game runtime).
  Verified by code inspection + headless browser render (Chromium) of the standalone character lab.
- **Branch:** `claude/true-topdown-20260723` (true top-down interpretation). Sibling `claude/iso-20260723`
  planned after this foundation is reviewed.
- **Base / backup:** branched from `phaser-migration@3e8722052e7dc4fbf781b11979f339327b8b6b06`.
  Backup branch created + pushed: `backup/phaser-migration-pre-claude-character-system-20260723`.
- **Files added (runtime-adjacent but NOT in the live game path yet):**
  - `src/character/modularCharacter.js` — layered, data-driven character (base body + hair + top +
    bottom + shoes + skin), 4 directions, poses (idle/walk/sit/sleep/computer), pure functions →
    SVG string, safe fallbacks for unknown pose/direction.
  - `src/characterLab.js` + `character-lab.html` — standalone preview page. Renders directions ×
    poses + a wardrobe-swap row. Does NOT import or touch the game runtime.
  - Reference library (separate prior commit `0f261e9`): `apartment-god-production/reference/visual_targets/`.
- **Runtime files changed:** No — the live game (`main.js` → `phaserParityRuntime.js`) is untouched.
  The character system is isolated in `src/character/` + the lab page. Nothing in the live boot path
  imports it yet. Boot behavior of the game is unchanged.
- **Render playable branch (`main`) updated:** No. **Render settings changed:** No. **Deployed:** No.
- **Summary:** Built the foundation for the intended swappable-parts character. Proves the architecture
  (clothes/hair/shoes/skin swap on one rig) and a first-pass true-top-down art style that is clearly
  sprite-layered, not a procedural blob. Organized Kam's pose references into an activity-adjacent
  taxonomy so future model work has targets beside the code.
- **Implementation details:** Appearance is a data record (`DEFAULT_APPEARANCE`) resolved against
  palettes; each body part is an authored SVG fragment; poses are limb-geometry rigs; facing is
  authored via head/face cue + arm asymmetry (NOT naive full-body rotation, which read as "lying down"
  in the first attempt and was corrected). Adult proportions (small head, broad shoulders) per the
  "no chibi / no blob" rule.
- **Testing performed:** `npx eslint src/character/modularCharacter.js src/characterLab.js` → 0 errors.
  Headless Chromium render of `character-lab.html` → 17 character SVGs rendered, 0 page/console errors
  (one benign favicon 404). Existing suite unaffected (`npx vitest run` → 44 passing before changes;
  no runtime files touched). Screenshot captured and shared with Kam.
- **Testing requested from Kam:** review the character lab look/direction (true top-down vs the
  isometric sibling) and approve the art baseline before I (a) scale to full pose set + Resident/
  Girlfriend/Dog and (b) integrate behind a safe fallback into `phaserParityRuntime.js`.
- **Known risks / honest limitations (first pass):**
  - Directional distinction (N/E/W vs S) is subtle; may need clearer per-direction art for gameplay
    readability.
  - Art is clean but simple/flat; reaching the rendered `target_mockups/` fidelity is iterative.
  - Not yet integrated into the game; integration is the next, higher-risk step (backup already exists).
  - Sleep pose is rendered upright (placeholder); a true lying-in-bed pose is a later refinement.
- **Follow-ups:** (1) Kam review/approve art direction. (2) Port to `claude/iso-20260723`.
  (3) Expand pose set (yoga, cook, guitar, read, shower) using `reference/visual_targets/`.
  (4) Integrate into runtime behind fallback. (5) Dog/pet modular pass.
