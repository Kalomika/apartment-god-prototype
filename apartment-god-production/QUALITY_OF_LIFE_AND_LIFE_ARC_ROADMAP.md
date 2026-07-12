# Apartment God Quality Of Life and Life Arc Roadmap

Status: ACTIVE ROADMAP
Branch: phaser-migration
Created: 2026-07-12

## Purpose

Apartment God should not only be a task simulator. The characters should feel like people who are quietly judging whether their life is working. The player can intervene as God, ignore them, or allow them to run on full Auto. The system should reward good life stewardship without turning the game into a fail state machine.

This roadmap records the larger life arc design so future agents do not flatten it into broad meters or shallow generic mood changes.

## Runtime foundation now implemented

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
```

Current first pass includes:

```txt
Monthly quality of life review
Yearly quality of life review
Quality of life score per human actor
Activity satisfaction tracking
Activity repetition and boredom pressure
Top activity tracking
Breaking point pressure meter
Semi auto vs Auto life choice control
Pending major life choice queue for Semi Auto
Auto adjustment hook for Auto mode
Romance meter
Patience/tolerance meter
Relationship labels showing heart/ring state language
Magic Fund high volatility investment
Phone Life Review menu
Phone Investments / Magic Fund menu
HUD quality of life line
Autonomy avoidance for temporarily burned out optional activities
```

## Core philosophy

The player is God, but the characters are not empty dolls. They should make choices, build preferences, get bored, feel fulfilled, get irritated, form bonds, make mistakes, and sometimes need intervention.

The game should support three play feelings:

```txt
1. Directed play
The player actively tells characters what to do.

2. Semi auto life
The characters handle normal life, but major life choices ask the player/God for approval.

3. Full Auto
The characters make every choice themselves, including major life choices, while the player watches and can still intervene.
```

Time pauses when the player is not watching for the current version. Future online or always-running mode can be a separate optional mode.

## Quality of life monthly review

Every month, each human character reviews their life.

The review should consider:

```txt
needs health
fun
social
freshness
stamina
energy
money pressure
home tidiness
relationship health
romance health
activity satisfaction
activity repetition boredom
work fulfillment
missed or canceled plans
vacations they wanted but could not afford
```

A low score does not mean the player loses. It means the character may need to adjust their life.

Possible monthly consequences:

```txt
try different activities
avoid a burned out activity for a while
schedule variety
try social repair
request a vacation
clean up more
complain about chores
review relationship health
start building breaking point pressure
enter a low mood phase
```

## Yearly quality of life review

Yearly review should be bigger and more reflective than monthly review.

The yearly review should eventually influence:

```txt
long term life direction
career satisfaction
job change desire
relationship commitment review
marriage readiness
family planning readiness
aging milestones
life bonus
deep dissatisfaction flags
major aspiration changes
```

Current first pass gives a money bonus for strong yearly quality of life and queues a major yearly review choice if the year is low.

Future yearly review should not fire too often. Big decisions like career changes should usually be yearly or every six months, not monthly, unless the character is fired or hits an extreme breaking point.

## Activity satisfaction and boredom

Every activity should have hidden satisfaction and boredom pressure.

The player should only see the top five activity reads, not every hidden score. The phone Life Review menu should surface what the character has been doing most and whether it is getting stale.

Rules:

```txt
Repeated optional activities can become boring.
Passion activities tolerate more repetition.
Mandatory life activities should not be blocked by boredom.
Boredom should push variety, not randomly punish survival actions.
If the player forces one activity too often, the character can burn out on it.
Burned out optional activities should be avoided by autonomy for a while.
```

Examples:

```txt
Movies are fun until overused.
Swimming is fun unless it is forced too constantly and the actor is not passionate about it.
A fitness passionate actor can lift/run more often before boredom hits.
A reading passionate actor can read more before boredom hits.
```

## Auto versus Semi Auto

Semi Auto is the default.

Semi Auto means:

```txt
normal autonomy runs
minor choices happen automatically
major life changes queue for God approval
```

Auto means:

```txt
characters can make major choices themselves
relationship consequences can progress without player approval
career changes can eventually happen automatically
family and life changes can eventually be self chosen
player can still interrupt at any time
```

The bottom control now includes Life Auto. Phone Life Review can also toggle the mode.

Future major choices that should respect this:

```txt
breakup
moving out
job change
marriage proposal
baby decision
adoption
roommate move in
roommate move out
therapy/recovery break after breaking point
big investment decision
vacation priority change
```

## Romance, marriage, and relationship state

Relationships should have at least:

```txt
vibe
romance
patience/tolerance
beef
annoyance
status
```

Status path should eventually include:

```txt
roommate
dating
engaged
married
separated
divorced
ex
```

Visual relationship icon:

```txt
heart = dating/romance
ring = married
```

Marriage should be a bonus, not just a label.

Possible marriage benefits:

```txt
yearly stability bonus
stronger shared planning
better recovery from bad months if both partners are trying
lower cost or better success for family planning
stronger emotional support during low months
shared vacation planning
relationship memories matter more
```

Marriage should also lock in consequences. A spouse should not be as easy to replace as a girlfriend/boyfriend. Divorce should require serious relationship damage, low romance, low patience, repeated irritation, or neglect.

## Baby and family planning arc

Do not implement pregnancy casually or randomly. In this world, children should be tied to high romance and good behavior.

Possible thresholds:

```txt
romance around 75% = baby/adoption discussion can appear
romance around 100% = marriage proposal can appear
marriage resets romance to mid/high baseline and asks the couple to maintain it
post marriage romance around 75% = baby discussion appears again
```

Semi Auto:

```txt
God gets asked whether to approve baby/adoption/marriage.
```

Auto:

```txt
characters decide themselves.
```

Pregnancy concept:

```txt
pregnancy appears on calendar
morning baby bubble confirms pregnancy
trimester sprite stages
visible baby bump progression
birth date auto added to calendar
family rushes to car/hospital event
8 in game hours later family returns with newborn
```

Adoption concept:

```txt
solo characters or couples can adopt
adoption app appears on phone
traits and child profile matter more than looks
adoption event adds child to household
```

Child aging concept needs deeper design. Do not rush it.

Possible first pass life stages:

```txt
newborn
child
teen
adult
older adult
elder
```

The user specifically wants accelerated generations so the player can continue the house through children and new family cycles.

## Aging and generational play

Aging must be designed carefully.

Current idea direction:

```txt
Characters should age faster than real 70 year human lives.
Every two in game years could add visible aging changes.
Gray hair and wrinkles are early visual signs.
Aging should eventually make legacy/family choices matter.
If a character reaches end of life without family/legacy, that life arc ends.
If they have children, play can continue through the next generation.
```

Do not implement permanent death casually without a full design pass.

Future aging visual ideas:

```txt
gray hair overlay
older face marks
slower stamina recovery
career seniority
family memory log
legacy transfer
```

## Breaking point and recovery

Breaking point is not the same as health. It is pressure from poor life quality, forced repetition, low sleep, bad relationships, and lack of recovery.

Future consequences:

```txt
forced sleep/recovery day
refusal to do overused optional activity
emotional low period
therapy/recovery event
six month away recovery event for extreme collapse
```

The user suggested a stretcher/white coat/straight jacket visual for extreme breaking point. This should be handled carefully, not played as a cheap gag. It can be stylized as a recovery transport if implemented.

If an extreme break happens:

```txt
character leaves household for recovery
calendar jumps or pauses around recovery window
life arc penalty is time lost and aging/life progress lost
```

This is not implemented yet.

## Irritation and boundary respect

Characters should know each other's traits and boundaries.

Examples of irritation actions:

```txt
turn stereo on while someone is watching movie
turn stereo on while someone is napping
leave towels out when living with a tidy person
leave books out
leave dirty dishes
make noise while someone is tired
miss work repeatedly
make bad investments that hurt household money
ignore romance
ignore social need
```

AI characters should be able to pick most in-game actions the player can pick, except meta tools like reset.

Eventually there should be an Irritate option that schedules small annoying behaviors. Repeated irritation should lower romance and patience.

## Messiness and incomplete tasks

The book system is the first implemented pattern.

Future systems should reuse this pattern:

```txt
towels left on chair/floor/rack
clothes pile after shower
dirty dishes on dining table or counter
unmade bed
loose books
snack wrappers
workout gear left out
```

Mess should:

```txt
appear on visible surfaces when possible
hit room tidiness
be noticed by tidy/meticulous characters
create cleanup chores
possibly affect romance/patience with a tidy partner
```

## Jobs and career changes

The current four hour work shift direction should stay.

Future job change logic:

```txt
monthly review can flag career dissatisfaction
six month or yearly review can trigger job change desire
missed shifts can cause firing
low pay can cause dissatisfaction
boring job can hurt quality of life
high passion job can protect quality of life
```

Semi Auto asks God before job changes. Auto lets the character make the change.

## Investments and Magic Fund

Businesses and Magic Fund should be real in-game risk systems, not guaranteed money.

Implemented first pass:

```txt
Magic Fund high volatility investment
can pay out or crash harder than normal business investments
phone investment menu can buy it
```

Future investment depth:

```txt
market cycle graph
business health
household members choosing investments automatically in Auto
bad investments lowering quality of life
risky investor trait
frugal trait avoiding high volatility
Magic Fund crash/moon event logs
```

## Dating and roommate apps

Future phone apps:

```txt
Dating app
Roommate app
```

Dating app should be trait based, not shallow looks based.

Potential profile fields:

```txt
cleanliness
cooking skill
social style
patience
romance style
money style
activity passions
laziness/work ethic
risk tolerance
family interest
```

Roommate app should allow non romantic household members. Romance options can exist, but they should carry risk: the roommate may reject, lose patience, move out, or become romantic only if traits/chemistry align.

## Main resident identity

The household should have a main resident. The player can switch to others, but the main resident is the central life vessel.

Future character creation should support:

```txt
male main resident
female main resident
solo start
dating start
roommate start
family plan preference
no starting kids by default
```

## What is not implemented yet

```txt
marriage proposal flow
baby/adoption flow
pregnancy sprites
birth/hospital event
children aging
dating app
roommate app
divorce/move out
job change auto approvals
true breakdown recovery transport
full towel/clothes/dish mess system
full trait drift over time
full annual legacy system
```

Do not claim any of the above as implemented until runtime files actually support it and browser testing confirms it.
