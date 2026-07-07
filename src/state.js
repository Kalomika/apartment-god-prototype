import { MOODS } from './config.js';

const baseNeeds = () => ({ hunger: 72, freshness: 76, energy: 74, fun: 62, bladder: 72, social: 64, stamina: 82 });

function baseSkills(id, type) {
  if (type === 'dog') return { strength: 1, cooking: 0, intellect: 1, learning: 2, money: 0, handy: 0 };
  if (id === 'girlfriend') return { strength: 3, cooking: 3.5, intellect: 3, learning: 3, money: 4, handy: 2 };
  return { strength: 4.5, cooking: 2, intellect: 3.5, learning: 3.5, money: 2.5, handy: 2.5 };
}

function skillCaps(id, type) {
  if (type === 'dog') return { strength: 3, cooking: 0, intellect: 2, learning: 4, money: 0, handy: 0 };
  if (id === 'girlfriend') return { strength: 6, cooking: 7, intellect: 6, learning: 6, money: 8, handy: 5 };
  return { strength: 8, cooking: 6, intellect: 7, learning: 7, money: 6, handy: 6 };
}

function entity(id, name, type, floor, x, y, color) {
  return {
    id, name, type, floor, x, y, color,
    vx: 0, vy: 0, speed: type === 'dog' ? 120 : 92,
    path: [], target: null, action: null, actionT: 0, pending: null,
    pose: 'stand', mood: type === 'dog' ? 'dog' : 'neutral', bubble: '', bubbleT: 0,
    idleT: 0, stopped: false, hidden: false, trainingSkill: null, carrying: null,
    needs: baseNeeds(), skills: baseSkills(id, type), skillCaps: skillCaps(id, type),
    memory: { favorites: [], dislikes: [], activities: [], movies: [], foods: [] },
    traits: id === 'girlfriend' ? { frugal: true, spender: false, social: true, meticulous: true } : { frugal: false, spender: false, social: false }
  };
}

export function createState() {
  return {
    floor: 0,
    selectedId: 'resident',
    speed: 1,
    paused: false,
    time: 8 * 60,
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
    notifications: ['Apartment God booted.'],
    tv: { on: false, channel: 'Idle', pulse: 0 },
    offsite: null,
    investments: { holdings: {}, tick: 0, lifetime: 0 },
    rewards: { freeTickets: {}, messages: [] },
    secretLog: { used: {}, lastRewardAt: 0 },
    careers: { workHours: 0, movieTheaterHours: 0, airlineHours: 0 },
    garbage: { kitchen: 0, bagsOutside: 0, looseItems: [] },
    roomLights: {
      living: true, kitchen: true, bath: true, entry: true, stairs: true,
      bedroom: true, office: true, bath2: true, hall: true, stairs2: true,
      basement_game: true, basement_gym: true, basement_media: true, basement_stairs: true,
      garage_bay: true, garage_storage: true, garage_entry: true,
      yard: true, pool_area: true, kennel_area: true
    },
    objectState: { workoutGear: false, bookshelf: false, openWindows: {}, vehicleInUse: null, garageDoorOpen: false },
    entities: [
      entity('resident', 'Resident', 'person', 0, 150, 420, '#79b7ff'),
      entity('girlfriend', 'Girlfriend', 'person', 0, 265, 420, '#f2a3d7'),
      entity('dog', 'Dog', 'dog', 0, 610, 286, '#d7a66a')
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
