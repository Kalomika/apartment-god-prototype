import { approachPoint, clampToPlay, getObject, objects } from './world.js';
import { commandObject } from './movement.js';
import { cleanupInactivePoolChoreography } from './poolActivityCleanup.js';

const COUCH_CLEARANCE = 38;
const STOVE_CONTACT_LIMIT = 92;

export function applyRuntimeRegressionGuards(state) {
  if (!state?.entities?.length) return;
  cleanupInactivePoolChoreography(state);
  for (const entity of state.entities) {
    if (!entity || entity.hidden || entity.type !== 'person') continue;
    guardBadCookingContact(state, entity);
    guardDiningSeatAlignment(state, entity);
    guardStairExitPlacement(entity);
    guardIdleCouchTrap(entity);
  }
}

function guardBadCookingContact(state, entity) {
  const text = actionKey(entity);
  if (!(Number(entity.actionT || 0) > 0)) return;
  if (!text.includes('cook') && !text.includes('stove')) return;
  const stove = getObject('stove');
  if (!stove || entity.floor !== stove.floor) return;
  const contact = approachPoint(stove, 'cook_meal');
  const distance = Math.hypot(entity.x - contact.x, entity.y - contact.y);
  if (distance <= STOVE_CONTACT_LIMIT) return;

  entity.actionT = 0;
  entity.actionTotal = 0;
  entity.currentActionId = null;
  entity.pose = 'walk';
  if (entity.carrying === 'cooking_meal') entity.carrying = 'ingredients';
  commandObject(entity, stove, 'cook_meal');
  entity.action = 'Walking to stove';
  state.saveStatus = { message: 'Corrected stove position' };
}

function guardDiningSeatAlignment(state, entity) {
  if (entity.floor !== 0 || !(Number(entity.actionT || 0) > 0)) return;
  const text = actionKey(entity);
  if (!text.includes('eat') && !text.includes('dining table') && !text.includes('serve_meal')) return;
  const table = getObject('dining_table');
  if (!table) return;

  const seat = diningSeatFor(entity, table, state);
  const distance = Math.hypot(entity.x - seat.x, entity.y - seat.y);
  if (distance < 4) return;
  entity.x = seat.x;
  entity.y = seat.y;
  entity.pose = 'sit';
  entity.lastHeading = 0;
  entity.path = [];
  entity.target = null;
  entity.pending = null;
  entity.blockedT = 0;
  entity.recoveryCount = 0;
}

function diningSeatFor(entity, table, state) {
  const seats = [
    { x: table.x + 42, y: table.y + table.h + 28 },
    { x: table.x + table.w - 42, y: table.y + table.h + 28 },
    { x: table.x + 42, y: table.y - 28 },
    { x: table.x + table.w - 42, y: table.y - 28 }
  ];
  if (entity.id === 'resident') return clampToPlay(seats[0].x, seats[0].y);
  if (entity.id === 'girlfriend') return clampToPlay(seats[1].x, seats[1].y);

  const eaters = (state.entities || [])
    .filter(e => e?.type === 'person' && e.floor === 0 && Number(e.actionT || 0) > 0 && actionKey(e).includes('eat'))
    .sort((a, b) => String(a.id).localeCompare(String(b.id)));
  const index = Math.max(0, eaters.findIndex(e => e.id === entity.id));
  const seat = seats[index % seats.length];
  return clampToPlay(seat.x, seat.y);
}

function guardStairExitPlacement(entity) {
  if (Number(entity.actionT || 0) > 0 || entity.target || entity.pending || entity.path?.length) return;
  const text = actionKey(entity);
  if (!text.includes('using passage') && !text.includes('changed floor')) return;
  const stair = nearestStair(entity);
  if (!stair) return;
  const cx = stair.x + stair.w / 2;
  const cy = stair.y + stair.h / 2;
  if (Math.hypot(entity.x - cx, entity.y - cy) > 128) return;
  entity.x = cx;
  entity.y = cy;
  entity.lastHeading = 0;
}

function nearestStair(entity) {
  const stairList = objects.filter(o => o.floor === entity.floor && o.kind === 'stairs');
  if (!stairList.length) return null;
  return stairList.reduce((best, stair) => {
    const distance = Math.hypot(entity.x - (stair.x + stair.w / 2), entity.y - (stair.y + stair.h / 2));
    return !best || distance < best.distance ? { stair, distance } : best;
  }, null)?.stair || null;
}

function guardIdleCouchTrap(entity) {
  if (entity.floor !== 0) return;
  if (Number(entity.actionT || 0) > 0 || entity.target || entity.pending || entity.path?.length) return;
  const couch = getObject('couch');
  if (!couch) return;
  const insideCouch = entity.x >= couch.x - 10 && entity.x <= couch.x + couch.w + 10 && entity.y >= couch.y - 10 && entity.y <= couch.y + couch.h + 18;
  if (!insideCouch) return;
  const safe = clampToPlay(entity.x, couch.y + couch.h + COUCH_CLEARANCE);
  entity.x = safe.x;
  entity.y = safe.y;
  entity.pose = 'stand';
  entity.action = 'Recovered from couch collision';
  entity.lastHeading = 0;
  entity.blockedT = 0;
  entity.recoveryCount = 0;
}

function actionKey(entity) {
  return `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
}
