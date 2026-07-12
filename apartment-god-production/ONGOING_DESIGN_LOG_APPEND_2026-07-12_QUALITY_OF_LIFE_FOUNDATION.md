# 2026-07-12, Quality Of Life Foundation and Life Arc Roadmap

Status: PARTIAL IMPLEMENTED, NEEDS_BROWSER_TESTING
Branch: phaser-migration
Backup branch:
backup/phaser-migration-before-quality-of-life-foundation-2026-07-12

## Files changed

```txt
src/lifeQualitySystem.js
src/actions.js
src/autonomy.js
src/reactionSystem.js
src/appMenu.js
src/ui.js
src/canvasRuntime.js
src/state.js
src/investmentSystem.js
apartment-god-production/QUALITY_OF_LIFE_AND_LIFE_ARC_ROADMAP.md
```

Runtime files changed: yes
Vehicle files changed: no
Render playable branch updated: no
Main updated: no
PR opened: no
Deploy performed: no
Render settings changed: no

## Summary

Added the first runtime foundation for character quality of life, monthly and yearly review pressure, activity satisfaction and boredom tracking, Auto versus Semi Auto life choice control, romance and patience relationship meters, and a high volatility Magic Fund investment. Also logged the larger life arc roadmap for marriage, babies, aging, roommates, dating, breakdown recovery, job change reviews, family continuation, and deeper messiness systems.

## Implementation details

- Added `lifeQualitySystem.js`.
- Human actors now track monthly and yearly activity history.
- Completed timed actions now record into life quality history.
- Monthly reviews score needs, activity satisfaction, boredom, relationships, money, and tidiness.
- Yearly reviews score longer term life direction and award a household bonus for strong years.
- Low monthly or yearly reviews create pending life choices in Semi Auto mode.
- Auto mode applies a light auto adjustment instead of waiting for God approval.
- Activity repetition can create boredom and temporary avoidance for optional activities.
- Autonomy now avoids optional activities that are temporarily burned out.
- Relationship state now includes romance and patience/tolerance in addition to vibe, beef, and annoyance.
- Privacy and noise problems now also affect romance/patience.
- Phone now includes Life Review and Investments / Magic Fund menus.
- HUD now shows quality of life and the current life control mode.
- Bottom command panel now has Life Auto instead of the older broad Auto Mode toggle.
- Magic Fund is now a high volatility investment with harsher crashes and higher upside.
- The long form roadmap records the larger features that are not implemented yet and must not be falsely marked complete.

## Testing performed

GitHub source verification was performed on the new and modified files.
GitHub compare was run against the backup branch.

No local npm build or browser test was performed from this connector run.

## Testing requested

```txt
Refresh phaser-migration.
Open the HUD and confirm QoL appears for the selected human.
Open phone > Life Review and confirm current mode, QoL, top activities, and pending choices display.
Press Life Auto and confirm it toggles between Semi Auto and Auto life choices.
Run several activities and confirm top activity counts appear in Life Review.
Repeat the same optional activity heavily and confirm boredom pressure appears.
Let enough in-game time pass to trigger monthly review and confirm the log records it.
Open phone > Relationships and confirm romance/patience are shown.
Open phone > Investments / Magic Fund and confirm Magic Fund can be bought.
Confirm no vehicle behavior changed.
```

## Known risks

This is a foundation pass, not the full life arc. Marriage, pregnancy, adoption, kids, dating app, roommate app, divorce/leaving, job change approvals, and breakdown recovery transport are roadmap items only.

The monthly/yearly review system is not browser tested. Balance values will need tuning after observation. The system can log and queue life choices, but there is not yet a full approval UI for each pending life choice.

Concurrent branch work appears to have added full code audit cadence documentation after the backup point. This pass did not edit those files.

## Follow ups

```txt
Add life choice approval UI for pending Semi Auto choices.
Build marriage proposal and baby/adoption thresholds only after romance flow is tested.
Extend mess lifecycle from books to towels, clothes, dishes, and wrappers.
Add trait drift after several monthly reviews.
Add job change and firing review logic after career stability is tested.
Add dating and roommate phone apps in a separate pass.
Design aging and family continuation before implementing permanent life end states.
```
