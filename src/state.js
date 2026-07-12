import { MOODS } from './config.js';

const baseNeeds = () => ({ hunger: 72, freshness: 76, energy: 74, fun: 62, bladder: 72, social: 64, stamina: 82 });
const morningNeeds = () => ({ hunger: 58, freshness: 46, energy: 86, fun: 58, bladder: 38, social: 64, stamina: 86 });
const morningDogNeeds = () => ({ hunger: 54, freshness: 62, energy: 82, fun: 62, bladder: 68, social: 72, stamina: 86 });

function baseSkills(id, type) {
  if (type === 'dog') return { strength: 1, cooking: 0, intellect: 1, learning: 2, money: 0, handy: 0 };
  if (id === 'girlfriend') return { strength: 3, cooking: 3.5, intellect: 3, learning: 3, money: 4, handy: 2 };
  if (id === 'lab_test_subject') return { strength: 5, cooking: 3, intellect: 5, learning: 6, money: 0, handy: 4 };
  return { strength: 4.5, cooking: 2, intellect: 3.5, learning: 3.5, money: 2.5, handy: 2.5 };
}

function skillCaps(id, type) {
  if (type === 'dog') return { strength: 3, cooking: 0, intellect: 2, learning: 4, money: 0, handy: 0 };
  if (id === 'girlfriend') return { strength: 6, cooking: 7, intellect: 6, learning: 6, money: 8, handy: 5 };
  if (id === 'lab_test_subject') return { strength: 10, cooking: 6, intellect: 10, learning: 10, money: 0, handy: 8 };
  return { strength: 8, cooking: 6, intellect: 7, learning: 7, money: 6, handy: 6 };
}

function defaultWardrobe(id) {
  if (id === 'girlfriend') return {
    currentDay: 1,
    outfits: ['Rose lounge', 'Cyan streetwear', 'Black workout set', 'Gold casual', 'Purple date fit', 'Teal weekend', 'Ivory sleep set'],
    colors: ['#17131b', '#26526f', '#1c1d25', '#8a6230', '#4a2f5f', '#2f665d', '#7d6f63']
  };
  return {
    currentDay: 1,
    outfits: ['Black tee', 'Blue hoodie', 'Grey joggers', 'Green utility', 'Red graphic tee', 'Cream weekend', 'Navy sleep set'],
    colors: ['#111820', '#24324a', '#2f333a', '#263f32', '#4a1f26', '#665744', '#172235']
  };
}

function entity(id, name, type, floor, x, y, color) {
  const e = {
    id, name, type, floor, x, y, color,
    vx: 0, vy: 0, speed: type === 'dog' ? 120 : 92,
    path: [], target: null, action: null, actionT: 0, pending: null,
    pose: 'stand', mood: type === 'dog' ? 'dog' : 'neutral', bubble: '', bubbleT: 0,
    idleT: 0, stopped: false, hidden: false, trainingSkill: null, carrying: null,
    bookReading: false, bookTask: null,
    needs: baseNeeds(), skills: baseSkills(id, type), skillCaps: skillCaps(id, type),
    memory: { favorites: [], dislikes: [], activities: [], movies: [], foods: [] },
    traits: id === 'girlfriend' ? { frugal: true, spender: false, social: true, meticulous: true } : { frugal: false, spender: false, social: false }
  };
  if (type === 'person' && !id.includes('lab')) e.wardrobe = defaultWardrobe(id);
  return e;
}

function morningEntity(id, name, type, floor, x, y, color, bubble = '') {
  const e = entity(id, name, type, floor, x, y, color);
  e.pose = type === 'dog' ? 'dog_rest' : 'sleep';
  e.action = type === 'dog' ? 'Dog Bed' : 'Waking up';
  e.needs = type === 'dog' ? morningDogNeeds() : morningNeeds();
  e.bubble = bubble;
  e.bubbleT = bubble ? 4 : 0;
  e.idleT = -4;
  if (type !== 'dog') e.lastHeading = 0;
  return e;
}

export function createState() {
  return {
    floor: 1,
    selectedId: 'resident',
    followSelected: true,
    speed: 1,
    paused: false,
    time: 1440 + 6 * 60 + 45,
    money: 640,
    bill: 42,
    autonomyMode: 'guided',
    viewHoldT: 0,
    menu: null,
    assign: null,
    movePick: null,
    moveJob: null,
    fetch: null,
    delivery: null,
    partyPick: null,
    routines: [],
    appointments: [],
    notifications: ['Morning starts at home.'],
    tv: { on: false, channel: 'Idle', pulse: 0 },
    offsite: null,
    investments: { holdings: {}, tick: 0, lifetime: 0 },
    rewards: { freeTickets: {}, messages: [] },
    secretLog: { used: {}, lastRewardAt: 0 },
    calendar: { bookings: [], history: [] },
    books: { loose: [], returned: 0 },
    tidiness: { rooms: {} },
    careers: {
      workHours: 0,
      movieTheaterHours: 0,
      airlineHours: 0,
      people: {
        resident: { trackId: 'storyboard_artist', level: 1, xp: 0, shiftsWorked: 0, lastWorkedDay: -1, lateWarnings: 0, missedShifts: 0, lastPay: 0, status: 'employed' },
        girlfriend: { trackId: 'remote_support', level: 1, xp: 0, shiftsWorked: 0, lastWorkedDay: -1, lateWarnings: 0, missedShifts: 0, lastPay: 0, status: 'employed' }
      },
      history: []
    },
    garbage: { kitchen: 0, bagsOutside: 0, looseItems: [] },
    roomLights: {
      living: true, kitchen: true, bath: true, entry: true, stairs: true,
      bedroom: true, office: true, bath2: true, hall: true, stairs2: true,
      basement_game: true, basement_gym: true, basement_media: true, basement_stairs: true,
      garage_bay: true, garage_storage: true, garage_entry: true,
      yard: true, pool_area: true, kennel_area: true,
      secret_lab: true
    },
    objectState: { workoutGear: false, bookshelf: false, openWindows: {}, vehicleInUse: null, garageDoorOpen: false, morningGreetingDone: false, bedMade: false },
    entities: [
      morningEntity('resident', 'Resident', 'person', 1, 172, 138, '#79b7ff', 'morning'),
      morningEntity('girlfriend', 'Girlfriend', 'person', 1, 172, 194, '#f2a3d7', 'good morning'),
      morningEntity('dog', 'Dog', 'dog', 0, 632, 494, '#d7a66a'),
      { ...entity('lab_test_subject', 'Test Subject', 'person', 5, 470, 414, '#74e6ff'), stopped: true, labOnly: true }
    ]
  };
}

export function selected(state) {
  const current = state.entities.find(e => e.id === state.selectedId);
  if (current && !current.hidden) return current;
  const fallback = state.entities.find(e => !e.hidden && e.type === 'person') || state.entities.find(e => !e.hidden) || current || state.entities[0];
  if (fallback) state.selectedId = fallback.id;
  return fallback;
}

export function byId(state, id) {
  return state.entities.find(e => e.id === id) || null;
}

export function log(state, text) {
  state.notifications.unshift(text);
  state.notifications = state.notifications.slice(0, 8);
}

export function say(entity, text, seconds = 2.4) {
  entity.bubble = text;
  entity.bubbleT = seconds;
}

export function setMood(entity, mood) {
  entity.mood = MOODS[mood] ? mood : 'neutral';
}

export function changeNeed(entity, key, amount) {
  if (!entity.needs || !(key in entity.needs)) return;
  entity.needs[key] = Math.max(0, Math.min(100, entity.needs[key] + amount));
}

export function stopEntity(entity) {
  entity.path = [];
  entity.target = null;
  entity.pending = null;
  entity.action = null;
  entity.actionT = 0;
  entity.pose = 'stand';
  entity.stopped = true;
}

export function resumeEntity(entity) {
  entity.stopped = false;
  entity.idleT = 5;
}
