import { MOODS } from './config.js';

const baseNeeds = () => ({ hunger: 72, freshness: 76, energy: 74, fun: 62, bladder: 72, social: 64, stamina: 82 });

function entity(id, name, type, floor, x, y, color) {
  return {
    id, name, type, floor, x, y, color,
    vx: 0, vy: 0, speed: type === 'dog' ? 120 : 92,
    path: [], target: null, action: null, actionT: 0, pending: null,
    pose: 'stand', mood: type === 'dog' ? 'dog' : 'neutral', bubble: '', bubbleT: 0,
    idleT: 0, stopped: false, hidden: false,
    needs: baseNeeds()
  };
}

export function createState() {
  return {
    floor: 0,
    selectedId: 'resident',
    speed: 1,
    paused: false,
    time: 8 * 60,
    bill: 42,
    menu: null,
    assign: null,
    fetch: null,
    notifications: ['Apartment God booted.'],
    tv: { on: false, channel: 'Idle', pulse: 0 },
    offsite: null,
    roomLights: {
      living: true, kitchen: true, bath: true, entry: true, stairs: true,
      bedroom: true, office: true, bath2: true, hall: true, stairs2: true
    },
    objectState: {},
    entities: [
      entity('resident', 'Resident', 'person', 0, 150, 420, '#79b7ff'),
      entity('girlfriend', 'Girlfriend', 'person', 0, 265, 420, '#f2a3d7'),
      entity('dog', 'Dog', 'dog', 0, 610, 286, '#d7a66a')
    ]
  };
}

export function selected(state) {
  return state.entities.find(e => e.id === state.selectedId) || state.entities[0];
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
