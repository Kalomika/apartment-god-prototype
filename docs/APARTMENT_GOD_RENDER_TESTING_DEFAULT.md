# Apartment God Render Testing Default

Status: ACTIVE USER WORKFLOW RULE
Date: 2026-07-17

## Default

Kam tests Apartment God through the Render service attached to `main`.

For user requested runtime work in this project, once the intended source branch is verified and a current `main` backup exists, update `main` to the intended testable branch state so Kam can actually review the result through Render, unless Kam explicitly says not to update Render access.

When Kam asks to restore the previous playable main while a migration branch is being corrected, restore `main` immediately from the confirmed main backup and continue overhaul work only on the migration branch.

This applies to committed work that needs browser testing. It does not mean the work is approved, complete, or production ready. Use `NEEDS_TESTING` until Kam tests it.

## Safety

1. Verify the repository is `Kalomika/apartment-god-prototype`.
2. Verify the intended source branch and exact source commit.
3. Create or confirm a current backup of `main`.
4. Create or confirm a backup of the source branch for major overhauls.
5. Update only the `main` branch pointer for Render access.
6. Do not change Render settings.
7. Do not manually trigger Render.
8. Do not touch `Kalomika/ai-rpg-engine`.
9. Log the source branch, source commit, backup branches, and test status.

## Major Overhaul Testing

A major unverified overhaul may temporarily replace `main` when Kam explicitly asks to test it. Preserve the previous `main` in a backup branch first. Report clearly that the promoted branch is a test candidate, not a verified stable replacement.
