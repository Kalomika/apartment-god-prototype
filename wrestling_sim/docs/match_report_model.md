# Match Report Model

## Purpose

Because the player is mostly watching the match, the result needs to explain itself.

The report should answer three questions.

```text
Why did my wrestler win or lose?
What did my wrestler keep trying to do?
What should I change before the next match?
```

## Tracked Factors

```text
stamina usage
move success rate
lockup success rate
counter success rate
ring zone control
pin attempts
submission attempts
risk choices
crowd heat moments
manager suggestions accepted
manager suggestions ignored
```

## Example Report

```text
Result
Atlas King defeated Iron Saint by pinfall at 8:42.

Match Pattern
Atlas King won most early lockups through strength and aggression.
Iron Saint recovered well, but spent too much stamina trying heavy counters.

Key Turning Point
At 6:10, Atlas King hit a high impact center ring move after Iron Saint ignored a recover suggestion.

Manager Influence
You suggested 9 actions.
The wrestler accepted 6.
The wrestler ignored 3 because of stamina, position, or opponent state.

Recommendation
Lower risk taking.
Raise stamina discipline.
Add one low cost center ring move.
Increase leg defense against technicians.
```

## Data Shape

```text
winner
loser
finish_type
finish_time
main_story
turning_points
style_clash_summary
manager_choice_summary
stat_warnings
recommended_adjustments
```

## Report Tone

The report should sound like a commentator, coach, and fight analyst combined.

It should be clear, specific, and useful.
