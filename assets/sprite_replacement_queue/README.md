# Sprite Replacement Queue

Repo: `Kalomika/apartment-god-prototype`  
Branch: `phaser-migration`  

This folder is the shared queue for replacing Apartment God’s current built in procedural visuals with approved sprite assets. Nothing in this pass changes gameplay code or swaps visuals. This is an inventory and coordination folder only.

## Files

| File | Purpose |
|---|---|
| `OBJECT_ITINERARY.md` | Human readable numbered list of every current object, room, dynamic prop, mini game item, UI item, and asset pipeline target found in the reviewed code |
| `asset_inventory.csv` | Spreadsheet friendly version of the same list |
| `asset_inventory.json` | Machine readable version for future AI agents and sprite pipeline work |

## Replacement workflow

1. Pick one row from the inventory.
2. Create the real PNG or WebP asset in the listed replacement path.
3. Keep the current procedural or SVG drawing as fallback.
4. Ask for visual approval.
5. Wire only that approved item into the runtime.
6. Test the game.
7. Move to the next row.

## Current status

- Inventory rows: 197
- Game code changed in this pass: no
- Runtime visuals replaced in this pass: no
- Existing placeholder asset system found: yes
- Existing sprite pipeline manifest found: yes

## Follow up notes

The current registry already maps many major object kinds, but it is not a full inventory yet. The next pass should update the registry only after the art path and approval workflow are agreed on.
