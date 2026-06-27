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
  neutral: ':)', happy: ':D', calm: '=)', tired: 'Zz', hungry: 'FO', stinky: 'ew',
  love: '<3', playful: ';)', spooked: '!!', hyped: 'GO', phone: 'PH', dog: 'wo'
};

export const COLORS = {
  wall: '#263241', wallDark: '#1d2632', floor: '#303b4c', floorAlt: '#354254',
  roomLine: '#61708a', text: '#f4f7fb', muted: '#b6c1d2', shadow: 'rgba(0,0,0,.28)',
  resident: '#79b7ff', girlfriend: '#f2a3d7', dog: '#d7a66a', active: '#f2d66d'
};

export const ACTIONS = {
  couch: [['watch_tv', 'Watch TV'], ['relax', 'Relax'], ['nap', 'Nap']],
  tv: [['watch_tv', 'Watch TV'], ['comedy', 'Comedy Channel'], ['horror', 'Horror Channel'], ['sports', 'Sports Channel']],
  fridge: [['snack', 'Get Snack'], ['meal', 'Cook Meal'], ['bring_food', 'Bring Food']],
  stove: [['meal', 'Cook Meal']],
  sink: [['clean', 'Clean'], ['brush_teeth', 'Brush Teeth'], ['groom', 'Groom']],
  shower: [['shower', 'Take Shower'], ['groom', 'Groom']],
  toilet: [['toilet', 'Use Toilet']],
  door: [['work', 'Work'], ['errand', 'Quick Errand'], ['mall', 'Mall Trip'], ['movies', 'Movie Theater'], ['date', 'Date Night']],
  bed: [['sleep', 'Sleep'], ['relax', 'Relax']],
  desk: [['desk_work', 'Work at Desk'], ['play_game', 'Play Game'], ['phone', 'Phone'], ['shop', 'Shop']],
  dog_bowl: [['feed_dog', 'Feed Dog']],
  light: [['toggle_light', 'Toggle Room Light']]
};

export const SOCIAL_ACTIONS = [['talk', 'Talk'], ['kiss', 'Kiss'], ['cuddle', 'Cuddle'], ['tickle', 'Tickle'], ['hands', 'Hold Hands']];
export const DOG_SOCIAL_ACTIONS = [['pet', 'Pet Dog'], ['train', 'Train Dog'], ['fetch', 'Fetch']];

export const ACTION_TIMES = {
  watch_tv: 7, comedy: 7, horror: 7, sports: 7, relax: 5, nap: 8, snack: 4, meal: 7,
  bring_food: 6, clean: 6, brush_teeth: 4, groom: 5, shower: 7, toilet: 4, sleep: 12,
  desk_work: 8, play_game: 7, phone: 5, shop: 5, feed_dog: 3, toggle_light: 1,
  talk: 4, kiss: 3, cuddle: 6, tickle: 3, hands: 4, pet: 3, train: 5, fetch: 0,
  work: 14, errand: 9, mall: 12, movies: 13, date: 14
};
