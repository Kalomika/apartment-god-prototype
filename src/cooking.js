import { startObjectAction } from './actions.js';
import { commandMove } from './movement.js';
import { changeNeed, log, say, setMood } from './state.js';
import { approachPoint, getObject } from './world.js';

export function startCookingFlow(state, actor) {
  const fridge = getObject('fridge');
  if (!fridge) return false;
  state.cookingJob = { actorId: actor.id, phase: 'toFridge' };
  startObjectAction(state, actor, fridge, 'cooking_prep');
  actor.action = 'Getting ingredients';
  say(actor, 'FOOD');
  log(state, `${actor.name} started cooking prep.`);
  return true;
}

export function updateCooking(state) {
  const job = state.cookingJob;
  if (!job) return;
  const actor = state.entities.find(e => e.id === job.actorId);
  if (!actor) { state.cookingJob = null; return; }

  if (job.phase === 'toFridge' && !actor.path.length && actor.floor === 0) {
    state.objectState.fridgeOpen = true;
    state.objectState.fridgeActivity = 'meal';
    actor.action = 'Taking food from fridge';
    actor.actionT = 3;
    actor.actionTotal = 3;
    actor.pose = 'stand';
    say(actor, 'FOOD');
    job.phase = 'prep';
    return;
  }

  if (job.phase === 'prep' && actor.actionT <= 0) {
    state.objectState.fridgeOpen = false;
    state.objectState.fridgeActivity = null;
    const stove = getObject('stove');
    const p = approachPoint(stove, 'meal');
    commandMove(actor, p.x, p.y);
    actor.action = 'Going to stove';
    job.phase = 'toStove';
    return;
  }

  if (job.phase === 'toStove' && !actor.path.length) {
    state.objectState.stovePan = true;
    state.objectState.stoveSmoke = true;
    actor.action = 'Cooking on stove';
    actor.actionT = 7;
    actor.actionTotal = 7;
    actor.pose = 'stand';
    say(actor, 'COOK');
    job.phase = 'cook';
    return;
  }

  if (job.phase === 'cook' && actor.actionT <= 0) {
    state.objectState.stovePan = false;
    state.objectState.stoveSmoke = false;
    changeNeed(actor, 'hunger', 32);
    changeNeed(actor, 'fun', 4);
    setMood(actor, 'happy');
    actor.action = 'Meal ready';
    say(actor, 'EAT');
    log(state, `${actor.name} cooked a meal.`);
    state.cookingJob = null;
  }
}
