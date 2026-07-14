# Development Matrix Append, Living Dining Kitchen Cleanup

Date: 2026-07-14
Branches: phaser-migration and main
Status: NEEDS_TESTING
Backup: backup manifests created because create_branch was unavailable in the loaded GitHub schema

## Living Room
Status: NEEDS_TESTING

Update:
- Coffee table has been restored between couch and TV in the main floor polish layer.
- Wall TV and media shelf/stereo are redrawn after the living room clear/lighting pass so the media shelf is not visually cut in half.

Required test:
- Main floor should show a coffee table between couch and TV.
- Media shelf/stereo near the TV should appear whole, not sliced by a floor overlay.

## Dining Set
Status: NEEDS_TESTING

Update:
- Dining clear region was expanded to remove the visible residue from the old table and old chairs under the newer dining set.
- Dining set remains constructed from separate visible pieces: individual chairs and table piece.

Required test:
- Verify no old dining-table or chair residue remains under the current table.
- Verify chairs remain separate pieces.
- Verify actor eating/sitting alignment still uses a visible chair.

## Kitchen Sink And Counter
Status: NEEDS_TESTING

Update:
- Kitchen sink object patch moved to the L counter corner.
- Sink is drawn as a diagonal corner sink facing into the kitchen rather than sitting awkwardly on the straight counter run.
- Coffee maker remains separated on the right-side counter.

Required test:
- Sink should read as a natural diagonal corner sink.
- Sink and coffee maker should not overlap.
- L counter should still read as a continuous kitchen counter.

## Branch And Render Notes
Status: NEEDS_TESTING

Update:
- Fix applied on phaser-migration and mirrored to main for Render-visible review.
- Render settings were not changed.
- No manual Render deploy was triggered.

Risk:
- If Render still shows the old layout after rebuild and hard refresh, inspect served module URLs and deployed commit before changing the layout code again.
