export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const PLAY_W = 960;
export const PLAY_H = 720;
export const ENTITY_RADIUS = 16;
export const DOUBLE_TAP_MS = 320;

export const NEEDS = [
  ['hunger', 'Hunger'],
  ['freshness', 'Hygiene'],
  ['energy', 'Energy'],
  ['fun', 'Fun'],
  ['bladder', 'Bladder'],
  ['social', 'Social'],
  ['stamina', 'Stamina']
];

export const MOODS = {
  neutral: '🙂', happy: '😄', calm: '😌', tired: '😴', hungry: '😋', stinky: '🤢',
  love: '😍', playful: '😉', spooked: '😱', hyped: '🔥', phone: '📱', dog: '🐶'
};

export const COLORS = {
  wall: '#263241', wallDark: '#1d2632', floor: '#303b4c', floorAlt: '#354254',
  roomLine: '#61708a', text: '#f4f7fb', muted: '#b6c1d2', shadow: 'rgba(0,0,0,.28)',
  resident: '#79b7ff', girlfriend: '#f2a3d7', dog: '#d7a66a', active: '#f2d66d'
};

const VEHICLE_DESTINATIONS = [
  ['work', 'Work'], ['errand', 'Quick Errand'], ['mall', 'Mall Trip'], ['movies', 'Movie Theater'], ['date', 'Date Night']
];

export const ACTIONS = {
  couch: [['watch_tv', 'Watch TV'], ['watch_together', 'Watch TV Together'], ['relax', 'Relax'], ['nap', 'Nap']],
  tv: [['watch_tv', 'Watch TV'], ['watch_together', 'Watch TV Together'], ['comedy', 'Comedy Channel'], ['horror', 'Horror Channel'], ['sports', 'Sports Channel']],
  stereo: [['music_song', 'Play Song'], ['music_album', 'Play Album']],
  bookshelf: [['read', 'Read Book'], ['study', 'Study']],
  fridge: [['snack', 'Get Snack'], ['meal', 'Cook Meal'], ['bring_food', 'Bring Food']],
  stove: [['meal', 'Cook Meal']],
  sink: [['groom', 'Wash Hands / Groom'], ['brush_teeth', 'Brush Teeth'], ['clean', 'Clean Sink'], ['wash_dishes', 'Wash Dishes']],
  coffee_maker: [['coffee', 'Make Coffee']],
  dining_table: [['eat_meal', 'Eat at Table'], ['sit_table', 'Sit at Table']],
  cleaning_closet: [['get_cleaning_supplies', 'Get Cleaning Supplies']],
  vacuum_cleaner: [['vacuum_clean', 'Vacuum Crumbs']],
  robot_vacuum: [['robot_vacuum_start', 'Start Robot Vacuum']],
  shower: [['shower', 'Take Shower'], ['groom', 'Groom']],
  bathtub: [['shower', 'Take Bath']],
  toilet: [['pee_stand', 'Pee Standing'], ['toilet', 'Use Toilet Seated']],
  panic_room_door: [['use', 'Check Steel Door']],
  security_panel: [['use', 'Check Alarm Panel']],
  security_locker: [['use', 'Inspect Secured Locker']],
  security_supply: [['use', 'Check Emergency Supplies']],
  door: [['work', 'Work'], ['errand', 'Quick Errand'], ['mall', 'Mall Trip'], ['movies', 'Movie Theater'], ['date', 'Date Night']],
  bed: [['sleep', 'Sleep'], ['bed_together', 'Go To Bed Together'], ['make_bed', 'Make Bed'], ['intimacy', 'Private Moment'], ['relax', 'Relax']],
  closet: [['change_clothes', 'Change Clothes'], ['plan_week_outfits', 'Plan Weekly Outfits']],
  desk: [['desk_work', 'Work at Desk'], ['play_game', 'Play Game'], ['phone', 'Phone'], ['shop', 'Shop']],
  dog_bath: [['wash_dog', 'Wash Dog']],
  dog_bowl: [['feed_dog', 'Feed Dog']],
  dog_bed: [['dog_rest', 'Dog Rest']],
  light: [['toggle_light', 'Toggle Room Light']],
  stairs: [['use_stairs', 'Use Stairs']],
  pool_table: [['pool_solo', 'Practice Pool'], ['pool_together', 'Play Pool Together']],
  arcade: [['arcade', 'Play Arcade'], ['arcade_together', 'Play Arcade Together']],
  game_console: [['console_game', 'Play Console'], ['console_together', 'Play Console Together']],
  dartboard: [['darts', 'Throw Darts'], ['darts_together', 'Play Darts Together']],
  trash_can: [['throw_trash', 'Throw Away Trash'], ['take_trash_out', 'Take Trash Out']],
  outdoor_trash: [['dump_trash', 'Dump Trash Bag']],
  treadmill: [['treadmill', 'Run Treadmill']],
  weight_bench: [['lift_weights', 'Lift Weights']],
  heavy_bag: [['heavy_bag', 'Hit Heavy Bag']],
  swim_pool: [['swim', 'Swim'], ['swim_together', 'Swim Together']],
  soccer_field: [['soccer_practice', 'Kick Soccer Ball']],
  kennel: [['dog_rest', 'Dog Rest'], ['call_dog_yard', 'Call Dog To Yard']],
  car: [['work', 'Drive to Work'], ['errand', 'Drive Errand'], ['mall', 'Drive to Mall'], ['movies', 'Drive to Movies'], ['date', 'Drive Date Night'], ['drive', 'Cruise Around'], ['maintain_vehicle', 'Maintain Vehicle']],
  bike: VEHICLE_DESTINATIONS.map(([id, label]) => [id, `Bike to ${label}`]),
  motorbike: VEHICLE_DESTINATIONS.map(([id, label]) => [id, `Ride Motorbike to ${label}`]),
  atv: VEHICLE_DESTINATIONS.map(([id, label]) => [id, `Ride ATV to ${label}`])
};

export const SOCIAL_ACTIONS = [
  ['talk', 'Talk'], ['kiss', 'Kiss'], ['cuddle', 'Cuddle'], ['tickle', 'Tickle'], ['hands', 'Hold Hands'],
  ['watch_together', 'Watch TV Together'], ['bed_together', 'Go To Bed Together'], ['intimacy', 'Private Moment']
];
export const DOG_SOCIAL_ACTIONS = [['pet', 'Pet Dog'], ['train', 'Train Dog'], ['fetch']];

export const ACTION_TIMES = {
  watch_tv: 60,
  watch_together: 60,
  comedy: 60,
  horror: 60,
  sports: 60,
  relax: 18,
  nap: 45,
  snack: 10,
  meal: 24,
  gather_ingredients: 7,
  cook_meal: 22,
  serve_meal: 5,
  bring_food: 12,
  clean: 18,
  wash_dishes: 18,
  brush_teeth: 10,
  groom: 14,
  shower: 24,
  pee_stand: 5,
  toilet: 9,
  sleep: 90,
  bed_together: 90,
  make_bed: 10,
  intimacy: 40,
  change_clothes: 12,
  plan_week_outfits: 18,
  get_cleaning_supplies: 8,
  vacuum_clean: 26,
  robot_vacuum_start: 4,
  desk_work: 60,
  play_game: 45,
  phone: 18,
  shop: 24,
  wash_dog: 28,
  feed_dog: 8,
  toggle_light: 1,
  talk: 14,
  kiss: 5,
  cuddle: 24,
  tickle: 7,
  hands: 12,
  pet: 10,
  train: 22,
  fetch: 0,
  work: 60,
  errand: 30,
  mall: 60,
  movies: 120,
  date: 90,
  pool_solo: 0,
  pool_together: 0,
  arcade: 30,
  arcade_together: 36,
  console_game: 45,
  console_together: 50,
  darts: 24,
  darts_together: 30,
  throw_trash: 6,
  take_trash_out: 24,
  dump_trash: 6,
  treadmill: 35,
  lift_weights: 35,
  heavy_bag: 30,
  swim: 45,
  swim_together: 50,
  soccer_practice: 45,
  soccer_match: 60,
  dog_rest: 30,
  call_dog_yard: 8,
  drive: 18,
  maintain_vehicle: 35,
  bike_trip: 36,
  motorbike_trip: 30,
  music_song: 20,
  music_album: 60,
  read: 45,
  study: 60,
  coffee: 12,
  eat_meal: 20,
  sit_table: 18,
  enter_car: 2,
  enter_bike: 2,
  enter_motorbike: 2,
  enter_atv: 2,
  pack_luggage: 18,
  load_luggage: 8,
  unload_luggage: 8
};
