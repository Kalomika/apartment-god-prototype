# Test Run Status

## Branch

`basement-together-mechanics`

## Current state

Runtime changes are committed to the branch. They need browser testing before merging.

## Test access

If merged to main and Render auto-deploys from main, the expected public test URL is:

https://apartment-god-prototype.onrender.com

No Render settings were changed.

## Why no local build result is attached

The execution environment could not clone GitHub because `github.com` DNS resolution failed, so local `npm run check` and `npm run build` could not be run here.

## First manual test steps

1. Load the app.
2. Click `Phone: Food` and watch for the courier near the front door.
3. Verify hunger changes after the exchange, not instantly.
4. Click the fridge or `Get food` and confirm the open panel is obvious.
5. Click the Basement button and confirm the game room appears.
6. Try pool, arcade, console, and darts actions.
7. Try together actions while the partner is free, then while the partner is busy.
