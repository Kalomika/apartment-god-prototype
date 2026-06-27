# Handoff

## Current status

Apartment God Prototype is live and has been converted into a modular codebase. Current work is focused on restoring and improving life-sim readability while preserving every original feature.

Live URL:

https://apartment-god-prototype.onrender.com

Repo:

Kalomika/apartment-god-prototype

Do not modify:

Kalomika/ai-rpg-engine

## Current source of truth

Feature inventory:

`docs/FEATURE_INVENTORY.md`

Development log:

`docs/DEVELOPMENT_LOG.md`

Primary handoff issue:

https://github.com/Kalomika/apartment-god-prototype/issues/1

## Latest pass

Latest commit:

`52b43d6acc7ba7e160b768bf35b7851e32f81fc4`

Implemented:

- Visible walk-cycle body animation with arms and legs.
- Distinct sitting pose.
- Distinct lying/sleeping pose.
- Social/tickle/cuddle/kiss/hold-hands pose handling.
- Both participants now animate during social actions.
- Dog movement now includes legs/tail feedback.
- Pretend phone music with selectable genres.
- Genre effects for fun, social, stamina, calm/hype, and small intellect gains for some genres.
- Dynamic stereo object when music starts.
- Stereo rendering and stereo interaction hook.
- Feature inventory updated so animation and pretend music cannot be dropped by future refactors.

## Known limitations

- Render deployment must be allowed time to rebuild after each main commit.
- Animation is symbolic canvas body-language, not full sprite-sheet animation yet.
- Pretend music is silent intentionally to avoid licensing issues.
- Social poses are readable approximations and should be refined with stronger choreography later.
- A full furniture-populated-start versus empty-start mode is not implemented yet.
- Long-term aging/lifetime calendar is intentionally deferred.

## Next recommended test pass

On mobile, verify:

1. Character walk cycles show arms and legs.
2. Sitting actions look seated.
3. Sleep/nap looks lying down.
4. Tickle/cuddle/kiss animate both characters.
5. Dog pet/train/fetch still appears.
6. Phone: Music opens a genre prompt.
7. Choosing rap, rock, classical, jazz, afrobeat, or electronic starts pretend music.
8. Stereo appears in the living room after music starts.
9. Clock/status overlay remains visible.
10. Game canvas is not squashed.

## Required completion report

Every coding pass should report:

- Branch used
- Commit SHA
- Files changed
- What was implemented
- What was tested
- What failed or was deferred
- Exact next step
- Playable URL if deployed
