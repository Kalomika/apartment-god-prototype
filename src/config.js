export const CANVAS_W = 1280;
export const CANVAS_H = 720;
export const PLAY_W = 960;
export const PLAY_H = 720;
export const ENTITY_RADIUS = 18;
export const DOUBLE_TAP_MS = 320;

export const NEEDS = [
  ['hunger', 'Hunger'],
  ['freshness', 'Freshness'],
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

export const ACTIONS = {
  couch: [['watch_tv', 'Watch TV'], ['watch_together', 'Watch TV Together'], ['relax', 'Relax'], ['nap', 'Nap']],
  tv: [['watch_tv', 'Watch TV'], ['watch_together', 'Watch TV Together'], ['comedy', 'Comedy Channel'], ['horror', 'Horror Channel'], ['sports', 'Sports Channel']],
  stereo: [['music_song', 'Play Song'], ['music_album', 'Play Album']],
  bookshelf: [['read', 'Read Book'], ['study', 'Study']],
  fridge: [['snack', 'Get Snack'], ['meal', 'Cook Meal'], ['bring_food', 'Bring Food']],
  stove: [['meal', 'Cook Meal']],
  sink: [['clean', 'Clean'], ['wash_dishes', 'Wash Dishes'], ['brush_teeth', 'Brush Teeth'], ['groom', 'Groom']],
  coffee_maker: [['coffee', 'Make Coffee']],
  dining_table: [['eat_meal', 'Eat at Table'], ['sit_table', 'Sit at Table']],
  shower: [['shower', 'Take Shower'], ['groom', 'Groom']],
  toilet: [['toilet', 'Use Toilet']],
  door: [['work', 'Work'], ['errand', 'Quick Errand'], ['mall', 'Mall Trip'], ['movies', 'Movie Theater'], ['date', 'Date Night']],
  bed: [['sleep', 'Sleep'], ['bed_together', 'Go To Bed Together'], ['intimacy', 'Private Moment'], ['relax', 'Relax']],
  desk: [['desk_work', 'Work at Desk'], ['play_game', 'Play Game'], ['phone', 'Phone'], ['shop', 'Shop']],
  dog_bowl: [['feed_dog', 'Feed Dog']],
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
  soccer_field: [['soccer_practice', 'Solo Soccer Practice'], ['soccer_match', 'Mini Soccer Match']],
  kennel: [['dog_rest', 'Dog Rest'], ['call_dog_yard', 'Call Dog To Yard']],
  car: [['work', 'Drive to Work'], ['errand', 'Drive Errand'], ['mall', 'Drive to Mall'], ['movies', 'Drive to Movies'], ['date', 'Drive Date Night'], ['drive', 'Cruise Around'], ['maintain_vehicle', 'Maintain Vehicle']],
  bike: [['bike_trip', 'Bike Trip']],
  motorbike: [['motorbike_trip', 'Motorbike Trip']]
};

export const SOCIAL_ACTIONS = [
  ['talk', 'Talk'], ['kiss', 'Kiss'], ['cuddle', 'Cuddle'], ['tickle', 'Tickle'], ['hands', 'Hold Hands'],
  ['watch_together', 'Watch TV Together'], ['bed_together', 'Go To Bed Together'], ['intimacy', 'Private Moment']
];
export const DOG_SOCIAL_ACTIONS = [['pet', 'Pet Dog'], ['train', 'Train Dog'], ['fetch', 'Fetch']];

export const ACTION_TIMES = {
  watch_tv: 7, watch_together: 9, comedy: 7, horror: 7, sports: 7, relax: 5, nap: 8, snack: 4, meal: 7,
  bring_food: 6, clean: 6, wash_dishes: 5, brush_teeth: 4, groom: 5, shower: 7, toilet: 4, sleep: 12,
  bed_together: 12, intimacy: 14, desk_work: 8, play_game: 7, phone: 5, shop: 5, feed_dog: 3, toggle_light: 1,
  talk: 4, kiss: 3, cuddle: 6, tickle: 3, hands: 4, pet: 3, train: 5, fetch: 0,
  work: 14, errand: 9, mall: 12, movies: 13, date: 14,
  pool_solo: 14, pool_together: 18, arcade: 8, arcade_together: 10, console_game: 10, console_together: 12, darts: 7, darts_together: 9,
  throw_trash: 3, take_trash_out: 9, dump_trash: 3, treadmill: 10, lift_weights: 10, heavy_bag: 8, swim: 10, swim_together: 12,
  soccer_practice: 16, soccer_match: 20,
  dog_rest: 6, call_dog_yard: 3, drive: 5, maintain_vehicle: 8, bike_trip: 10, motorbike_trip: 8,
  music_song: 4, music_album: 12, read: 10, study: 12, coffee: 4, eat_meal: 7, sit_table: 5
};
