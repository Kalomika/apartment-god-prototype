# Vehicle Sprite Integration Manifest

Date: 2026-07-12
Branch: phaser-migration
Status: NEEDS_TESTING

## Source sprites

Kam approved the generated top down vehicle sprite set from this chat as the visual target for the garage vehicles:

- White SUV / crossover
- Red four door sports car
- Blue bicycle
- Dark motorcycle with brown seat
- Green ATV
- Gray alarm or charging post with green indicator

The runtime implementation source is:

```txt
src/vehicleSpriteRenderer.js
src/vehicleSpriteOverlays.js
src/renderDynamic.js
src/rendering.js
```

## Runtime rule

The produced vehicle sprites are the visual source of truth. The older procedural vehicle drawings in `renderHouseStyle.js` and earlier garage corrective overlays are now fallback only. The overlay pass draws the production vehicle sprite forms above those fallbacks, and the vehicle departure or return renderer uses the same sprite renderer so parked and moving vehicles match.

## Asset parts tracked

The renderer treats these as separate sprite parts even while drawn from the same production renderer module:

```txt
SUV full body
SUV body shell
SUV doors
SUV hood
SUV hatch or trunk
SUV head lights
SUV tail lights
SUV side mirrors
Sports car full body
Sports car body shell
Sports car doors
Sports car hood
Sports car trunk
Sports car head lights
Sports car tail lights
Sports car side mirrors
Bicycle full body
Bicycle wheels
Bicycle frame
Bicycle handlebars
Bicycle seat
Bicycle pedal group
Motorcycle full body
Motorcycle wheels
Motorcycle body shell
Motorcycle handlebars and mirrors
Motorcycle seat
Motorcycle head light
ATV full body
ATV wheels
ATV body shell
ATV handlebar unit
ATV seat
ATV grill and light area
Garage alarm or charge post body
Garage alarm or charge post indicator light
```

## Quality rule

No vehicle type labels should be drawn on the vehicle sprites. The garage should communicate vehicle type through silhouette, proportions, windows, tires, handlebars, hood, trunk, and body construction, not text like SUV, CONV, BIKE, MOTO, or ATV.

## Testing requested

- Open garage on Render after main mirror.
- Confirm parked SUV no longer looks like a labeled block or sedan.
- Confirm red vehicle reads as a four door sports car, not a van or convertible label.
- Confirm bike and motorcycle are clean top down colored silhouettes.
- Confirm ATV reads as the produced green quad style.
- Start a work or errand trip and confirm the moving vehicle uses the same production sprite style.
- Confirm lock and unlock flashes happen near the selected vehicle sequence, not as a fake object interaction at the house entry door.

## Known risk

This pass is committed but not browser tested in this chat. If browser QA shows the production overlay is blocked by draw order or old corrective labels, remove the old garage vehicle corrective functions entirely and keep only the new renderer.
