# Apartment God Object Itinerary

Repo: `Kalomika/apartment-god-prototype`
Branch reviewed and edited: `phaser-migration`
Inventory date: 2026-07-07
Runtime changes in this pass: none

This is the numbered replacement queue for the current in game objects and built in visual pieces. Use the row numbers as the approval and implementation order reference. Add real PNG or WebP art at the replacement path, keep fallback art, get approval, then wire one item at a time.

## Known registry gaps

1. `atv` exists as a current object and `atv_top.svg` exists in the branch change list, but `src/assetRegistry.js` does not map `atv` yet.
2. `soccer_field`, `dartboard`, `stereo`, `light`, `garage_door`, and `workout` are functional or drawable, but need explicit final art registry mapping.
3. Mini game pieces like pool balls, soccer ball, goals, score panels, cue line, and trails are not in the main objects array.
4. Buildable objects create runtime copies, so final art should map by kind first.

## Counts

- Rooms, floors, and layout areas: 23
- Static placed objects: 46
- Buildable generated objects: 16
- Windows: 5
- Doorways, stairs, exits, and gates: 18
- Characters and entity UI pieces: 6
- Dynamic props and carried items: 14
- Pool mini game pieces: 10
- Soccer mini game pieces: 8
- Vehicle runtime pieces: 9
- Off site scenes and scene props: 21
- UI and overlay assets: 16
- Registry and pipeline targets: 5

Total rows: 197

## Full list

### Rooms, floors, and layout areas

1. `floor_0`, Main House, kind `floor`, replacement `assets/sprites/rooms/main_house_floor.png`, status `planned`, priority `P1`
2. `room_living`, Living Room, kind `room`, replacement `assets/sprites/rooms/living_room_floor.png`, status `planned`, priority `P1`
3. `room_kitchen`, Kitchen, kind `room`, replacement `assets/sprites/rooms/kitchen_floor.png`, status `planned`, priority `P1`
4. `room_bath`, Bathroom, kind `room`, replacement `assets/sprites/rooms/bathroom_floor.png`, status `planned`, priority `P1`
5. `room_entry`, Entry / Foyer, kind `room`, replacement `assets/sprites/rooms/entry_foyer_floor.png`, status `planned`, priority `P1`
6. `room_stairs`, Stair / Service Hall, kind `room`, replacement `assets/sprites/rooms/stair_service_hall_floor.png`, status `planned`, priority `P1`
7. `room_front_porch`, Front Porch, kind `room`, replacement `assets/sprites/rooms/front_porch_floor.png`, status `planned`, priority `P1`
8. `floor_1`, Upstairs, kind `floor`, replacement `assets/sprites/rooms/upstairs_floor.png`, status `planned`, priority `P1`
9. `room_bedroom`, Bedroom, kind `room`, replacement `assets/sprites/rooms/bedroom_floor.png`, status `planned`, priority `P1`
10. `room_office`, Office, kind `room`, replacement `assets/sprites/rooms/office_floor.png`, status `planned`, priority `P1`
11. `room_bath2`, Upstairs Bath, kind `room`, replacement `assets/sprites/rooms/upstairs_bath_floor.png`, status `planned`, priority `P1`
12. `room_hall`, Hall, kind `room`, replacement `assets/sprites/rooms/upstairs_hall_floor.png`, status `planned`, priority `P1`
13. `room_stairs2`, Stairs, kind `room`, replacement `assets/sprites/rooms/upstairs_stairs_floor.png`, status `planned`, priority `P1`
14. `floor_2`, Open Basement, kind `floor`, replacement `assets/sprites/rooms/basement_floor.png`, status `planned`, priority `P1`
15. `room_basement`, Open Basement, kind `room`, replacement `assets/sprites/rooms/open_basement_floor.png`, status `planned`, priority `P1`
16. `floor_3`, Garage Area, kind `floor`, replacement `assets/sprites/rooms/garage_area_floor.png`, status `planned`, priority `P1`
17. `room_garage_bay`, Two Car Garage, kind `room`, replacement `assets/sprites/rooms/two_car_garage_floor.png`, status `planned`, priority `P1`
18. `room_garage_storage`, Vehicle Storage, kind `room`, replacement `assets/sprites/rooms/vehicle_storage_floor.png`, status `planned`, priority `P1`
19. `room_garage_entry`, Garage Entry, kind `room`, replacement `assets/sprites/rooms/garage_entry_floor.png`, status `planned`, priority `P1`
20. `floor_4`, Backyard Area, kind `floor`, replacement `assets/sprites/rooms/backyard_area_floor.png`, status `planned`, priority `P1`
21. `room_yard`, Backyard, kind `room`, replacement `assets/sprites/rooms/backyard_floor.png`, status `planned`, priority `P1`
22. `room_pool_area`, Pool Deck, kind `room`, replacement `assets/sprites/rooms/pool_deck_floor.png`, status `planned`, priority `P1`
23. `room_kennel_area`, Kennel Area, kind `room`, replacement `assets/sprites/rooms/kennel_area_floor.png`, status `planned`, priority `P1`

### Static placed objects

24. `couch`, Couch, kind `couch`, replacement `assets/sprites/objects/couch_main.png`, status `placeholder_svg_exists`, priority `P1`
25. `tv`, Wall Mounted TV, kind `tv`, replacement `assets/sprites/objects/tv_main.png`, status `placeholder_svg_exists`, priority `P1`
26. `stereo`, Media Shelf, kind `stereo`, replacement `assets/sprites/objects/stereo_main.png`, status `registry_missing`, priority `P2`
27. `fridge`, Fridge, kind `fridge`, replacement `assets/sprites/objects/fridge_main.png`, status `placeholder_svg_exists`, priority `P1`
28. `stove`, Stove, kind `stove`, replacement `assets/sprites/objects/stove_main.png`, status `placeholder_svg_exists`, priority `P1`
29. `sink`, Sink, kind `sink`, replacement `assets/sprites/objects/sink_main.png`, status `placeholder_svg_exists`, priority `P1`
30. `trash_kitchen`, Kitchen Trash, kind `trash_can`, replacement `assets/sprites/objects/trash_can.png`, status `placeholder_svg_exists`, priority `P1`
31. `shower`, Shower, kind `shower`, replacement `assets/sprites/objects/shower_main.png`, status `placeholder_svg_exists`, priority `P1`
32. `toilet`, Toilet, kind `toilet`, replacement `assets/sprites/objects/toilet_main.png`, status `placeholder_svg_exists`, priority `P1`
33. `door`, Front Door, kind `door`, replacement `assets/sprites/objects/front_door.png`, status `placeholder_svg_exists`, priority `P1`
34. `pet_flap_front`, Pet Flap, kind `stairs`, replacement `assets/sprites/objects/pet_flap_front.png`, status `mapped_to_door`, priority `P2`
35. `basement_door`, Basement Door, kind `stairs`, replacement `assets/sprites/objects/basement_door.png`, status `mapped_to_stairs`, priority `P1`
36. `garage_door`, Garage Interior Door, kind `stairs`, replacement `assets/sprites/objects/garage_interior_door.png`, status `mapped_to_door`, priority `P1`
37. `backyard_door`, Back Door to Yard, kind `stairs`, replacement `assets/sprites/objects/backyard_door.png`, status `mapped_to_door`, priority `P1`
38. `dog_bowl`, Dog Bowl, kind `dog_bowl`, replacement `assets/sprites/objects/dog_bowl.png`, status `placeholder_svg_exists`, priority `P1`
39. `light_living`, Living Light, kind `light`, replacement `assets/sprites/objects/ceiling_light.png`, status `registry_missing`, priority `P2`
40. `stairs_down`, Upstairs Stairs, kind `stairs`, replacement `assets/sprites/objects/stairs_up_main.png`, status `placeholder_svg_exists`, priority `P1`
41. `bed`, Bed, kind `bed`, replacement `assets/sprites/objects/bed_main.png`, status `placeholder_svg_exists`, priority `P1`
42. `desk`, Laptop Desk, kind `desk`, replacement `assets/sprites/objects/desk_computer.png`, status `placeholder_svg_exists`, priority `P1`
43. `shower2`, Upstairs Shower, kind `shower`, replacement `assets/sprites/objects/upstairs_shower.png`, status `uses_shower_asset`, priority `P2`
44. `toilet2`, Upstairs Toilet, kind `toilet`, replacement `assets/sprites/objects/upstairs_toilet.png`, status `uses_toilet_asset`, priority `P2`
45. `light_bedroom`, Bedroom Light, kind `light`, replacement `assets/sprites/objects/bedroom_light.png`, status `registry_missing`, priority `P2`
46. `stairs_up`, Downstairs Stairs, kind `stairs`, replacement `assets/sprites/objects/stairs_down_upstairs.png`, status `placeholder_svg_exists`, priority `P1`
47. `basement_stairs_up`, Main Floor Stairs, kind `stairs`, replacement `assets/sprites/objects/basement_stairs_up.png`, status `placeholder_svg_exists`, priority `P1`
48. `pool_table`, Pool Table, kind `pool_table`, replacement `assets/sprites/objects/pool_table_main.png`, status `placeholder_svg_exists`, priority `P1`
49. `dartboard`, Dart Board, kind `dartboard`, replacement `assets/sprites/objects/dartboard.png`, status `registry_missing`, priority `P2`
50. `arcade_machine`, Arcade Machine, kind `arcade`, replacement `assets/sprites/objects/arcade_main.png`, status `placeholder_svg_exists`, priority `P1`
51. `game_console`, Console Setup, kind `game_console`, replacement `assets/sprites/objects/console_setup.png`, status `placeholder_svg_exists`, priority `P1`
52. `basement_couch`, Basement Couch, kind `couch`, replacement `assets/sprites/objects/basement_couch.png`, status `uses_couch_asset`, priority `P2`
53. `treadmill`, Treadmill, kind `treadmill`, replacement `assets/sprites/objects/treadmill.png`, status `placeholder_svg_exists`, priority `P1`
54. `weight_bench`, Weight Bench, kind `weight_bench`, replacement `assets/sprites/objects/weight_bench.png`, status `placeholder_svg_exists`, priority `P1`
55. `heavy_bag`, Heavy Bag, kind `heavy_bag`, replacement `assets/sprites/objects/heavy_bag.png`, status `placeholder_svg_exists`, priority `P1`
56. `light_basement_game`, Basement Light, kind `light`, replacement `assets/sprites/objects/basement_light.png`, status `registry_missing`, priority `P2`
57. `garage_entry_door`, House Door, kind `stairs`, replacement `assets/sprites/objects/garage_entry_house_door.png`, status `mapped_to_door`, priority `P1`
58. `garage_overhead_door`, Overhead Garage Door, kind `garage_door`, replacement `assets/sprites/objects/garage_overhead_door.png`, status `registry_missing`, priority `P1`
59. `car_1`, Family Car, kind `car`, replacement `assets/sprites/vehicles/family_car_top.png`, status `placeholder_svg_exists`, priority `P1`
60. `car_2`, Sports Car, kind `car`, replacement `assets/sprites/vehicles/sports_car_top.png`, status `placeholder_svg_exists`, priority `P1`
61. `bike`, Bicycle, kind `bike`, replacement `assets/sprites/vehicles/bike_top.png`, status `placeholder_svg_exists`, priority `P2`
62. `motorbike`, Motorbike, kind `motorbike`, replacement `assets/sprites/vehicles/motorbike_top.png`, status `placeholder_svg_exists`, priority `P2`
63. `atv`, ATV, kind `atv`, replacement `assets/sprites/vehicles/atv_top.png`, status `registry_gap`, priority `P2`
64. `trash_outdoor`, Outdoor Trash Bin, kind `outdoor_trash`, replacement `assets/sprites/objects/outdoor_trash_bin.png`, status `mapped_to_trash_can`, priority `P1`
65. `yard_back_door`, Back Door to House, kind `stairs`, replacement `assets/sprites/objects/yard_back_door.png`, status `mapped_to_door`, priority `P1`
66. `pet_flap_yard`, Pet Flap, kind `stairs`, replacement `assets/sprites/objects/pet_flap_yard.png`, status `mapped_to_door`, priority `P2`
67. `soccer_field`, Backyard Soccer Field, kind `soccer_field`, replacement `assets/sprites/objects/soccer_field.png`, status `registry_missing`, priority `P1`
68. `swim_pool`, Backyard Pool, kind `swim_pool`, replacement `assets/sprites/objects/swim_pool.png`, status `placeholder_svg_exists`, priority `P1`
69. `kennel`, Dog Kennel, kind `kennel`, replacement `assets/sprites/objects/kennel.png`, status `placeholder_svg_exists`, priority `P1`

### Buildable generated objects

70. `build_bookshelf`, Bookshelf, kind `bookshelf`, replacement `assets/sprites/objects/bookshelf_main.png`, status `placeholder_svg_exists`, priority `P1`
71. `build_workout_gear`, Workout Gear, kind `workout`, replacement `assets/sprites/objects/workout_gear.png`, status `registry_missing`, priority `P2`
72. `build_extra_couch`, Extra Couch, kind `couch`, replacement `assets/sprites/objects/couch_variant.png`, status `uses_couch_asset`, priority `P3`
73. `build_extra_desk`, Extra Desk, kind `desk`, replacement `assets/sprites/objects/desk_variant.png`, status `uses_desk_asset`, priority `P3`
74. `build_extra_tv`, Extra TV, kind `tv`, replacement `assets/sprites/objects/tv_variant.png`, status `uses_tv_asset`, priority `P3`
75. `build_extra_stereo`, Extra Stereo, kind `stereo`, replacement `assets/sprites/objects/stereo_variant.png`, status `registry_missing`, priority `P3`
76. `build_extra_pool_table`, Extra Pool Table, kind `pool_table`, replacement `assets/sprites/objects/pool_table_variant.png`, status `uses_pool_table_asset`, priority `P3`
77. `build_extra_arcade`, Extra Arcade Machine, kind `arcade`, replacement `assets/sprites/objects/arcade_variant.png`, status `uses_arcade_asset`, priority `P3`
78. `build_extra_console`, Extra Console Setup, kind `game_console`, replacement `assets/sprites/objects/console_setup_variant.png`, status `uses_console_asset`, priority `P3`
79. `build_extra_dartboard`, Extra Dart Board, kind `dartboard`, replacement `assets/sprites/objects/dartboard_variant.png`, status `registry_missing`, priority `P3`
80. `build_extra_light`, Extra Room Light, kind `light`, replacement `assets/sprites/objects/ceiling_light_variant.png`, status `registry_missing`, priority `P3`
81. `build_extra_treadmill`, Extra Treadmill, kind `treadmill`, replacement `assets/sprites/objects/treadmill_variant.png`, status `uses_treadmill_asset`, priority `P3`
82. `build_extra_weight_bench`, Extra Weight Bench, kind `weight_bench`, replacement `assets/sprites/objects/weight_bench_variant.png`, status `uses_weight_bench_asset`, priority `P3`
83. `build_extra_heavy_bag`, Extra Heavy Bag, kind `heavy_bag`, replacement `assets/sprites/objects/heavy_bag_variant.png`, status `uses_heavy_bag_asset`, priority `P3`
84. `build_extra_trash_can`, Extra Trash Can, kind `trash_can`, replacement `assets/sprites/objects/trash_can_variant.png`, status `uses_trash_can_asset`, priority `P3`
85. `build_extra_kennel`, Extra Kennel, kind `kennel`, replacement `assets/sprites/objects/kennel_variant.png`, status `uses_kennel_asset`, priority `P3`

### Windows

86. `win_living`, Living Window, kind `window`, replacement `assets/sprites/objects/window_living.png`, status `procedural_only`, priority `P2`
87. `win_kitchen`, Kitchen Window, kind `window`, replacement `assets/sprites/objects/window_kitchen.png`, status `procedural_only`, priority `P2`
88. `win_bedroom`, Bedroom Window, kind `window`, replacement `assets/sprites/objects/window_bedroom.png`, status `procedural_only`, priority `P2`
89. `win_office`, Office Window, kind `window`, replacement `assets/sprites/objects/window_office.png`, status `procedural_only`, priority `P2`
90. `win_garage`, Garage Vent, kind `window`, replacement `assets/sprites/objects/garage_vent.png`, status `procedural_only`, priority `P2`

### Doorways, stairs, exits, and gates

91. `doorway_living_kitchen`, Living to Kitchen Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_living_kitchen.png`, status `procedural_only`, priority `P2`
92. `doorway_living_entry`, Living to Entry Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_living_entry.png`, status `procedural_only`, priority `P2`
93. `doorway_kitchen_entry`, Kitchen to Entry Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_kitchen_entry.png`, status `procedural_only`, priority `P2`
94. `doorway_bath_entry`, Bathroom to Entry Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_bath_entry.png`, status `procedural_only`, priority `P2`
95. `doorway_entry_front_porch_wide`, Entry to Front Porch Wide Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_entry_front_porch_wide.png`, status `procedural_only`, priority `P2`
96. `doorway_entry_front_porch_small`, Entry to Front Porch Small Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_entry_front_porch_small.png`, status `procedural_only`, priority `P2`
97. `doorway_entry_stairs_vertical`, Entry to Stair Hall Vertical Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_entry_stairs_vertical.png`, status `procedural_only`, priority `P2`
98. `doorway_entry_stairs_large`, Entry to Stair Hall Large Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_entry_stairs_large.png`, status `procedural_only`, priority `P2`
99. `doorway_kitchen_stairs`, Kitchen to Stair Hall Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_kitchen_stairs.png`, status `procedural_only`, priority `P2`
100. `doorway_bedroom_hall`, Bedroom to Hall Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_bedroom_hall.png`, status `procedural_only`, priority `P2`
101. `doorway_office_hall`, Office to Hall Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_office_hall.png`, status `procedural_only`, priority `P2`
102. `doorway_bath2_hall`, Upstairs Bath to Hall Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_bath2_hall.png`, status `procedural_only`, priority `P2`
103. `doorway_hall_stairs2`, Hall to Upstairs Stairs Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_hall_stairs2.png`, status `procedural_only`, priority `P2`
104. `doorway_garage_bay_storage`, Garage Bay to Storage Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_garage_bay_storage.png`, status `procedural_only`, priority `P2`
105. `doorway_garage_bay_entry`, Garage Bay to Garage Entry Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_garage_bay_entry.png`, status `procedural_only`, priority `P2`
106. `doorway_storage_entry`, Garage Storage to Entry Doorway, kind `doorway`, replacement `assets/sprites/structures/doorway_storage_entry.png`, status `procedural_only`, priority `P2`
107. `doorway_yard_pool_area`, Yard to Pool Deck Gate, kind `doorway`, replacement `assets/sprites/structures/gate_yard_pool_area.png`, status `procedural_only`, priority `P2`
108. `doorway_yard_kennel_area`, Yard to Kennel Area Gate, kind `doorway`, replacement `assets/sprites/structures/gate_yard_kennel_area.png`, status `procedural_only`, priority `P2`

### Characters and entity UI pieces

109. `resident`, Resident, kind `person`, replacement `assets/sprites/characters/resident_idle.png`, status `placeholder_svg_exists`, priority `P1`
110. `girlfriend`, Girlfriend, kind `person`, replacement `assets/sprites/characters/girlfriend_idle.png`, status `placeholder_svg_exists`, priority `P1`
111. `dog`, Dog, kind `dog`, replacement `assets/sprites/characters/dog_idle.png`, status `placeholder_svg_exists`, priority `P1`
112. `selected_ring`, Selected Character Ring, kind `ui_fx`, replacement `assets/sprites/ui/selected_ring.png`, status `procedural_only`, priority `P3`
113. `action_bar`, Action Progress Bar, kind `ui_fx`, replacement `assets/sprites/ui/action_bar.png`, status `procedural_only`, priority `P3`
114. `speech_bubble`, Speech Bubble, kind `ui_fx`, replacement `assets/sprites/ui/speech_bubble.png`, status `procedural_only`, priority `P3`

### Dynamic props and carried items

115. `carry_cue_stick`, Cue Stick, kind `carried_prop`, replacement `assets/sprites/props/cue_stick.png`, status `procedural_only`, priority `P1`
116. `carry_fetch_ball`, Fetch Ball, kind `carried_prop`, replacement `assets/sprites/props/fetch_ball.png`, status `procedural_only`, priority `P1`
117. `carry_luggage`, Luggage, kind `carried_prop`, replacement `assets/sprites/props/luggage.png`, status `procedural_only`, priority `P2`
118. `carry_large_luggage`, Large Luggage, kind `carried_prop`, replacement `assets/sprites/props/large_luggage.png`, status `procedural_only`, priority `P2`
119. `carry_trash_bag`, Trash Bag, kind `carried_prop`, replacement `assets/sprites/props/trash_bag.png`, status `procedural_only`, priority `P1`
120. `carry_food_bag`, Food Bag, kind `carried_prop`, replacement `assets/sprites/props/food_bag.png`, status `procedural_only`, priority `P2`
121. `carry_dirty_dish`, Dirty Dish, kind `carried_prop`, replacement `assets/sprites/props/dirty_dish.png`, status `procedural_only`, priority `P2`
122. `carry_wrapper`, Wrapper, kind `carried_prop`, replacement `assets/sprites/props/wrapper.png`, status `procedural_only`, priority `P2`
123. `carry_popcorn`, Popcorn, kind `carried_prop`, replacement `assets/sprites/props/popcorn.png`, status `procedural_only`, priority `P2`
124. `carry_snack`, Snack, kind `carried_prop`, replacement `assets/sprites/props/snack.png`, status `procedural_only`, priority `P2`
125. `pulled_book`, Pulled Book, kind `dynamic_prop`, replacement `assets/sprites/props/pulled_book.png`, status `procedural_only`, priority `P2`
126. `courier`, Delivery Person, kind `dynamic_character`, replacement `assets/sprites/characters/courier.png`, status `procedural_only`, priority `P2`
127. `delivery_bag`, Delivery Bag, kind `dynamic_prop`, replacement `assets/sprites/props/delivery_bag.png`, status `procedural_only`, priority `P2`
128. `build_prompt_panel`, Build Placement Prompt, kind `ui_fx`, replacement `assets/sprites/ui/build_prompt_panel.png`, status `procedural_only`, priority `P3`

### Pool mini game pieces

129. `pool_table_pockets`, Pool Table Pockets, kind `sub_object`, replacement `assets/sprites/objects/pool_table_pockets.png`, status `procedural_only`, priority `P1`
130. `pool_table_default_cues`, Pool Table Resting Cues, kind `sub_object`, replacement `assets/sprites/props/pool_table_resting_cues.png`, status `procedural_only`, priority `P1`
131. `pool_rack_triangle`, Pool Rack Triangle, kind `sub_object`, replacement `assets/sprites/props/pool_rack_triangle.png`, status `procedural_only`, priority `P2`
132. `pool_cue_ball_default`, Default Cue Ball, kind `sub_object`, replacement `assets/sprites/props/pool_cue_ball_default.png`, status `procedural_only`, priority `P1`
133. `pool_rack_balls_default`, Default Rack Balls, kind `sub_object`, replacement `assets/sprites/props/pool_rack_balls_default.png`, status `procedural_only`, priority `P1`
134. `pool_game_cue_line`, Pool Aim Line, kind `mini_game_fx`, replacement `assets/sprites/fx/pool_aim_line.png`, status `procedural_only`, priority `P3`
135. `pool_game_cue_thrust`, Pool Cue Thrust, kind `mini_game_fx`, replacement `assets/sprites/fx/pool_cue_thrust.png`, status `procedural_only`, priority `P2`
136. `pool_game_cue_ball`, Pool Game Cue Ball, kind `mini_game_prop`, replacement `assets/sprites/props/pool_game_cue_ball.png`, status `procedural_only`, priority `P1`
137. `pool_game_numbered_balls`, Pool Game Numbered Balls, kind `mini_game_prop`, replacement `assets/sprites/props/pool_numbered_balls.png`, status `procedural_only`, priority `P1`
138. `pool_score_panel`, Pool Score Panel, kind `ui_fx`, replacement `assets/sprites/ui/pool_score_panel.png`, status `procedural_only`, priority `P3`

### Soccer mini game pieces

139. `soccer_field_overlay`, Soccer Field Overlay, kind `sub_object`, replacement `assets/sprites/objects/soccer_field_overlay.png`, status `procedural_only`, priority `P1`
140. `soccer_center_circle`, Soccer Center Circle, kind `sub_object`, replacement `assets/sprites/objects/soccer_center_circle.png`, status `procedural_only`, priority `P2`
141. `soccer_midline`, Soccer Midline, kind `sub_object`, replacement `assets/sprites/objects/soccer_midline.png`, status `procedural_only`, priority `P2`
142. `soccer_goal_top`, Top Soccer Goal, kind `sub_object`, replacement `assets/sprites/objects/soccer_goal_top.png`, status `procedural_only`, priority `P1`
143. `soccer_goal_bottom`, Bottom Soccer Goal, kind `sub_object`, replacement `assets/sprites/objects/soccer_goal_bottom.png`, status `procedural_only`, priority `P1`
144. `soccer_ball`, Soccer Ball, kind `mini_game_prop`, replacement `assets/sprites/props/soccer_ball.png`, status `procedural_only`, priority `P1`
145. `soccer_ball_trail`, Soccer Ball Trail, kind `mini_game_fx`, replacement `assets/sprites/fx/soccer_ball_trail.png`, status `procedural_only`, priority `P3`
146. `soccer_score_panel`, Soccer Score Panel, kind `ui_fx`, replacement `assets/sprites/ui/soccer_score_panel.png`, status `procedural_only`, priority `P3`

### Vehicle runtime pieces

147. `animated_departure_vehicle`, Animated Departure Vehicle, kind `vehicle_runtime`, replacement `assets/sprites/vehicles/animated_departure_vehicle.png`, status `procedural_only`, priority `P1`
148. `animated_return_vehicle`, Animated Return Vehicle, kind `vehicle_runtime`, replacement `assets/sprites/vehicles/animated_return_vehicle.png`, status `procedural_only`, priority `P1`
149. `vehicle_doors_open`, Vehicle Open Doors, kind `vehicle_part`, replacement `assets/sprites/vehicles/parts/vehicle_doors_open.png`, status `procedural_only`, priority `P1`
150. `vehicle_trunk_open`, Vehicle Open Trunk, kind `vehicle_part`, replacement `assets/sprites/vehicles/parts/vehicle_trunk_open.png`, status `procedural_only`, priority `P1`
151. `vehicle_headlights`, Vehicle Headlights, kind `vehicle_part`, replacement `assets/sprites/vehicles/parts/headlights.png`, status `procedural_only`, priority `P2`
152. `vehicle_tail_lights`, Vehicle Tail Lights, kind `vehicle_part`, replacement `assets/sprites/vehicles/parts/tail_lights.png`, status `procedural_only`, priority `P2`
153. `vehicle_remote_flash`, Remote Flash FX, kind `vehicle_fx`, replacement `assets/sprites/fx/remote_flash.png`, status `procedural_only`, priority `P3`
154. `vehicle_luggage_in_trunk`, Stored Luggage In Trunk, kind `vehicle_prop`, replacement `assets/sprites/vehicles/parts/luggage_in_trunk.png`, status `procedural_only`, priority `P2`
155. `vehicle_seat_positions`, Vehicle Seat Position Markers, kind `logic_anchor`, replacement `assets/sprites/vehicles/metadata/seat_positions.json`, status `metadata_needed`, priority `P2`

### Off site scenes and scene props

156. `offsite_progress_panel`, Offsite Progress Panel, kind `ui_fx`, replacement `assets/sprites/ui/offsite_progress_panel.png`, status `procedural_only`, priority `P3`
157. `offsite_small_indicator`, Offsite Small Indicator, kind `ui_fx`, replacement `assets/sprites/ui/offsite_small_indicator.png`, status `procedural_only`, priority `P3`
158. `offsite_party_dots`, Offsite Party Dots, kind `scene_actor`, replacement `assets/sprites/ui/offsite_party_dots.png`, status `procedural_only`, priority `P3`
159. `plane_cabin`, Plane Cabin, kind `offsite_scene`, replacement `assets/sprites/offsite/plane_cabin.png`, status `procedural_only`, priority `P2`
160. `plane_seat`, Plane Seat, kind `offsite_sub_object`, replacement `assets/sprites/offsite/plane_seat.png`, status `procedural_only`, priority `P3`
161. `plane_attendant_marker`, Plane Attendant Marker, kind `offsite_sub_object`, replacement `assets/sprites/offsite/plane_attendant_marker.png`, status `procedural_only`, priority `P3`
162. `theater_screen`, Movie Theater Screen, kind `offsite_sub_object`, replacement `assets/sprites/offsite/theater_screen.png`, status `procedural_only`, priority `P2`
163. `theater_seats`, Movie Theater Seats, kind `offsite_sub_object`, replacement `assets/sprites/offsite/theater_seats.png`, status `procedural_only`, priority `P3`
164. `beach_resort_scene`, Beach Resort Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/beach_resort.png`, status `procedural_only`, priority `P2`
165. `private_island_scene`, Private Island Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/private_island.png`, status `procedural_only`, priority `P2`
166. `alps_scene`, Alps Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/alps.png`, status `procedural_only`, priority `P2`
167. `camping_scene`, Forest Camping Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/forest_camping.png`, status `procedural_only`, priority `P2`
168. `tokyo_scene`, Neon Tokyo Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/neon_tokyo.png`, status `procedural_only`, priority `P2`
169. `paris_scene`, Paris Weekend Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/paris_weekend.png`, status `procedural_only`, priority `P2`
170. `safari_scene`, Kenya Safari Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/kenya_safari.png`, status `procedural_only`, priority `P2`
171. `vegas_scene`, Vegas Lights Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/vegas_lights.png`, status `procedural_only`, priority `P2`
172. `cruise_scene`, Cruise Ship Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/cruise_ship.png`, status `procedural_only`, priority `P2`
173. `desert_spa_scene`, Desert Spa Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/desert_spa.png`, status `procedural_only`, priority `P2`
174. `mall_city_scene`, Mall City Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/mall_city.png`, status `procedural_only`, priority `P2`
175. `date_city_scene`, Date Night City Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/date_city.png`, status `procedural_only`, priority `P2`
176. `generic_offsite_scene`, Generic Offsite Scene, kind `offsite_scene`, replacement `assets/sprites/offsite/generic_offsite.png`, status `procedural_only`, priority `P3`

### UI and overlay assets

177. `phone_button`, Floating Cell Phone Button, kind `ui`, replacement `assets/sprites/ui/phone_button.png`, status `dom_ui_only`, priority `P1`
178. `phone_panel`, Cell Phone Panel, kind `ui`, replacement `assets/sprites/ui/phone_panel.png`, status `dom_ui_only`, priority `P2`
179. `phone_tab_home`, Phone Home Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_home.png`, status `dom_ui_only`, priority `P3`
180. `phone_tab_shop`, Phone Shop Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_shop.png`, status `dom_ui_only`, priority `P3`
181. `phone_tab_contacts`, Phone Contacts Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_contacts.png`, status `dom_ui_only`, priority `P3`
182. `phone_tab_music`, Phone Music Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_music.png`, status `dom_ui_only`, priority `P3`
183. `phone_tab_activities`, Phone Activities Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_activities.png`, status `dom_ui_only`, priority `P3`
184. `phone_tab_travel`, Phone Travel Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_travel.png`, status `dom_ui_only`, priority `P3`
185. `phone_tab_invest`, Phone Invest Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_invest.png`, status `dom_ui_only`, priority `P3`
186. `phone_tab_requests`, Phone Requests Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_requests.png`, status `dom_ui_only`, priority `P3`
187. `phone_tab_saves`, Phone Saves Tab, kind `ui`, replacement `assets/sprites/ui/phone_tab_saves.png`, status `dom_ui_only`, priority `P3`
188. `vertical_up_button`, Up Floor Button, kind `ui`, replacement `assets/sprites/ui/up_floor_button.png`, status `dom_ui_only`, priority `P3`
189. `vertical_down_button`, Down Floor Button, kind `ui`, replacement `assets/sprites/ui/down_floor_button.png`, status `dom_ui_only`, priority `P3`
190. `interaction_menu`, Interaction Menu, kind `ui`, replacement `assets/sprites/ui/interaction_menu.png`, status `dom_ui_only`, priority `P2`
191. `command_panel_buttons`, Command Panel Buttons, kind `ui`, replacement `assets/sprites/ui/command_panel_buttons.png`, status `dom_ui_only`, priority `P3`
192. `status_hud`, Status HUD, kind `ui`, replacement `assets/sprites/ui/status_hud.png`, status `mixed_ui`, priority `P3`

### Registry and pipeline targets

193. `fallback_missing_asset`, Missing Asset Fallback, kind `support_asset`, replacement `assets/sprites/ui/missing_asset.png`, status `placeholder_svg_exists`, priority `P1`
194. `floor_wood_tile`, Wood Floor Tile, kind `room_material`, replacement `assets/sprites/rooms/floor_wood_tile.png`, status `placeholder_svg_exists`, priority `P1`
195. `floor_tile_neutral`, Neutral Floor Tile, kind `room_material`, replacement `assets/sprites/rooms/floor_tile_neutral.png`, status `placeholder_svg_exists`, priority `P1`
196. `sprite_atlas_image`, Generated Sprite Atlas Image, kind `pipeline_asset`, replacement `assets/generated/apartment-god-sprites.png`, status `planned`, priority `P1`
197. `sprite_atlas_json`, Generated Sprite Atlas JSON, kind `pipeline_asset`, replacement `assets/generated/apartment-god-sprites.json`, status `planned`, priority `P1`
