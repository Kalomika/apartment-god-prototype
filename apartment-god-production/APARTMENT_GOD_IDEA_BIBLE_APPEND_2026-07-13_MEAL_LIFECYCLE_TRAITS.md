# Idea Bible Append: Full Meal Lifecycle And Tidy Trait System

Status: ACTIVE_APPEND_PENDING_CANONICAL_MERGE
Date: 2026-07-13

## Kam directive

Food should only appear on the dining table when someone actually prepared and served it through a real life cycle, not because a generic eat/table action is active.

The intended meal flow:

1. A character goes to the fridge and gets ingredients.
2. The character cooks at the stove.
3. The character gets plates from a cupboard or storage area.
4. The character carries each plate to the dining table.
5. Each plate is placed at a seating area.
6. Characters sit where food is placed.
7. Characters can have favorite seats, or can choose whichever seat has food near it.
8. Characters eat.
9. After eating, they take their plate to the dishwasher or sink.
10. They wash the plate or load it.
11. They place the plate back in the cupboard.
12. The cycle is complete.

## Personality and relationship behavior

Characters should eventually have personal priority traits. They can have a favorite top three traits or priorities that affect behavior. A high tidy/self-sufficient character should be more likely to clean dishes and finish the full loop. A lower tidy character may leave the plate at the table or in the sink if tidiness is not critical to them.

If one partner is not tidy, it should be able to annoy the other partner. Someone else can tell them to clean it, or they may do it later depending on their schedule, task order, and personal priority.

## Current immediate bug fix scope

This current bug pass should at minimum stop phantom food from drawing on the table unless `state.meals.tablePlates` contains a real prepared/served plate.

## Future full implementation scope

A complete pass should add:

- cupboard/storage plate source
- carry plate props
- seat-specific table plate placement
- favorite seat metadata per character
- seat selection from plated food
- dirty plate state
- sink/dishwasher/cupboard return chain
- tidy/self-sufficient trait weights
- partner annoyance and reminder behavior
- task scheduling so lower-tidy characters can clean later
- tests for prepared food, eaten food, dirty plate, washed plate, and cupboard return

Status remains PARTIAL until the full chain exists and is browser tested.
