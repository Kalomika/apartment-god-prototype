# Development Matrix Patch: Dog Strict Top-Down Replacement

Date: 2026-07-14
Status: NEEDS_BROWSER_CONFIRMATION
Runtime files changed: yes
Render settings changed: no

## Dog Renderer

Status: NEEDS_BROWSER_CONFIRMATION

Updated notes:

- Previous dog renderer was rejected in mobile QA because it still read like the wrong/recent dog, not the intended brown and white top-down dog.
- `src/dogSpriteOverlay.js` now uses a strict top-down brown and white dog silhouette with a clear head-to-tail axis.
- Base pose faces east, with head at positive X and tail at negative X.
- Direction rotation is mapped from that base pose so head leads and tail trails.
- The dog renderer import is cache-busted with `v=20260714-dog-strict-topdown`.

## Required QA

- Dog should look noticeably different from the previous recent dog.
- Dog should be brown and white with readable dog anatomy.
- Dog head should face movement direction.
- Tail should point opposite movement direction.
- Rest/sleep should not become a sideways blob.
