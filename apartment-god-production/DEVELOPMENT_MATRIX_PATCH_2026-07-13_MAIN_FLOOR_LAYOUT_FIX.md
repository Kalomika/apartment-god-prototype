# Development Matrix Patch, Main Floor Layout Fix

## System Matrix Updates

| System | Current Status | Source Of Truth | Current Notes | Next Required Check |
|---|---|---|---|---|
| Main floor furniture layout | NEEDS_TESTING | `src/world.js`, `src/visualRegressionFixes.js` | Main couch moved lower, bookshelf moved to a smaller entry bookcase near the garage door, garage door vertical anchor adjusted, coffee table visual added, porch correction redrawn. | Render test main floor after reset. |
| Dining seat alignment | NEEDS_TESTING | `src/runtimeRegressionGuards.js` | Runtime guard separates Resident and Girlfriend to distinct bottom seats while eating at dining table. This is a protection against overlapping actors until seat reservations exist. | Test both characters eating at once. |
| Stair approach and transition alignment | NEEDS_TESTING | `src/world.js`, `src/runtimeRegressionGuards.js` | Stair approach now targets stair centers instead of below the stair asset. A guard recenters actors on nearby stairs after passage states. | Test upstairs, basement, and garage transitions. |

## Object Interaction Matrix Updates

| Object | Area Or Floor | Current Status | Actions | Actor Types | Visual State Needed | Runtime Risk | Test Status |
|---|---|---|---|---|---|---|---|
| Dining table | Main kitchen | NEEDS_TESTING | Eat meal, serve meal | Human | Actors must occupy distinct chairs, not stack in the center | Runtime snap is temporary, proper seat reservation still needed | Test two humans eating. |
| Couch | Main living room | NEEDS_TESTING | TV, rest, couch actions | Human | Lower position, chaise on kitchen side, TV facing read, coffee table gap | Correction overlay still temporary | Test couch click and TV route. |
| Porch chairs | Front porch | NEEDS_TESTING | Visual rest future | Human future | Only two visible chairs on porch, green side yards clear | Overlay may cover older placeholder art | Test mobile view and click targets around front door. |
| Bookshelf | Main entry near garage door | NEEDS_TESTING | Read | Human | Smaller bookcase near garage door, not a fake upper left doorway | Read route may need pathing test after move | Test Read and living room clearance. |
| Garage interior door | Main entry | NEEDS_TESTING | Garage transition | Human, dog maybe | Door anchor should line up better with garage side house door | Route still uses floor transfer system | Test house to garage and garage to house. |
| Stairs | Main, upstairs, basement | NEEDS_TESTING | Floor transitions | Human, dog if supported | Actor should enter stair asset, not walk past it toward screen edge | Centering guard may need tuning | Test all floor transitions. |

## Test Matrix Updates

| Test Scenario | Priority | Status | Exact Test |
|---|---|---|---|
| Dining overlap regression | Critical | NEEDS_TESTING | Put Resident and Girlfriend on Dining Table eat meal at the same time. Confirm they sit at different chairs and not on each other. |
| Main couch placement | Critical | NEEDS_TESTING | Confirm the couch is lower, adjacent to the dining table line, faces the TV, and the chaise is on the kitchen side. |
| Porch duplicate chair cleanup | High | NEEDS_TESTING | Inspect front porch. Confirm there are only two main chairs, no duplicate tiny chairs, and the side areas are green. |
| Bookshelf and garage door clearance | High | NEEDS_TESTING | Confirm bookshelf is smaller and near the garage door area, living room upper left has more space, and garage route does not hug a wrong wall. |
| Stair asset transition | Critical | NEEDS_TESTING | Use stairs up and down, basement door, and garage door. Confirm actors enter the asset/door instead of walking past the stairs to the edge of the screen. |
