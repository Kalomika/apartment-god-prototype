import { approachPoint, clampToPlay, getObject } from './world.js';
import { commandObject } from './movement.js';

const COUCH_CLEARANCE = 38;
const STOVE_CONTACT_LIMIT = 92;

export function applyRuntimeRegressionGuards(state) {
  if (!state?.entities?.length) return;
  for (const entity of state.entities) {
    if (!entity || entity.hidden || entity.type !== 'person') continue;
    guardBadCookingContact(state, entity);
    guardIdleCouchTrap(entity);
  }
}

function guardBadCookingContact(state, entity) {
  const text = `${entity.currentActionId || ''} ${entity.action || ''} ${entity.pose || ''}`.toLowerCase();
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
