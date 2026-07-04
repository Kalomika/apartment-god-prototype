import { commandObject } from './movement.js';
import { byId, changeNeed, log, say, setMood } from './state.js';
import { getObject } from './world.js';

const SOURCES = {
  snack: 8,
  meal: 12,
  delivery: 14,
  popcorn: 10,
  package: 6
};

export function addGarbage(state, source = 'trash', amount = 5, actor = null) {
  state.garbage ??= { kitchen: 0, bagsOutside: 0, looseItems: [] };
  state.garbage.kitchen = Math.min(100, (state.garbage.kitchen || 0) + amount);
  if (actor) actor.carrying = source === 'meal' ? 'dirty dish' : source === 'delivery' ? 'food bag' : 'wrapper';
  log(state, `${source} created trash. Kitchen trash: ${Math.round(state.garbage.kitchen)}%.`);
}

export function addGarbageFromAction(state, actionText, actor = null) {
  const text = String(actionText || '').toLowerCase();
  if (text.includes('snack')) return addGarbage(state, 'snack', SOURCES.snack, actor);
  if (text.includes('meal') || text.includes('cook')) return addGarbage(state, 'meal', SOURCES.meal, actor);
  if (text.includes('delivery') || text.includes('delivered')) return addGarbage(state, 'delivery', SOURCES.delivery, actor);
  if (text.includes('movie') || text.includes('tv')) return addGarbage(state, 'popcorn', SOURCES.popcorn, actor);
}

export function startTakeTrashOut(state, actor) {
  state.garbage ??= { kitchen: 0, bagsOutside: 0, looseItems: [] };
  if ((state.garbage.kitchen || 0) <= 0) {
    say(actor, 'EMPTY');
    log(state, 'The kitchen trash is already empty.');
    return true;
  }
  const bin = getObject('trash_kitchen');
  if (!bin) return false;
  commandObject(actor, bin, 'take_trash_out');
  say(actor, 'TRASH');
  log(state, `${actor.name} is going to bag the kitchen trash.`);
  return true;
}

export function continueTrashRun(state, actor, text) {
  if (text.includes('take trash out')) {
    const outdoor = getObject('trash_outdoor');
    if (!outdoor) return false;
    actor.carrying = 'trash bag';
    commandObject(actor, outdoor, 'dump_trash');
    say(actor, 'BAG');
    log(state, `${actor.name} is carrying the trash bag outside.`);
    return true;
  }
  if (text.includes('dump trash')) {
    state.garbage ??= { kitchen: 0, bagsOutside: 0, looseItems: [] };
    state.garbage.bagsOutside = (state.garbage.bagsOutside || 0) + 1;
    state.garbage.kitchen = 0;
    actor.carrying = null;
    changeNeed(actor, 'freshness', -4);
    changeNeed(actor, 'stamina', -3);
    setMood(actor, 'calm');
    say(actor, 'DONE');
    log(state, `${actor.name} dumped the trash outside.`);
    return true;
  }
  if (text.includes('wash dishes') || text.includes('sink: clean')) {
    if (actor.carrying) {
      actor.carrying = null;
      changeNeed(actor, 'freshness', 2);
      say(actor, 'CLEAN');
      log(state, `${actor.name} washed what they were carrying.`);
      return true;
    }
  }
  if (text.includes('throw trash')) {
    if (actor.carrying) {
      addGarbage(state, actor.carrying, 6, null);
      actor.carrying = null;
      say(actor, 'TOSS');
      log(state, `${actor.name} threw away the item they were carrying.`);
      return true;
    }
  }
  return false;
}

export function updateGarbage(state, dt) {
  state.garbage ??= { kitchen: 0, bagsOutside: 0, looseItems: [] };
  const level = state.garbage.kitchen || 0;
  if (level < 60) return;
  for (const e of state.entities || []) {
    if (e.hidden || e.floor !== 0) continue;
    const odor = level > 90 ? -0.08 : -0.035;
    changeNeed(e, 'freshness', odor * dt);
    if (level > 85 && Math.random() < dt * 0.015) {
      say(e, 'SMELL');
      setMood(e, 'stinky');
    }
  }
}

export function garbageSummary(state) {
  const g = state.garbage || {};
  return `Trash ${Math.round(g.kitchen || 0)}%, outside bags ${g.bagsOutside || 0}`;
}

export function callDogToYard(state, actor) {
  const dog = byId(state, 'dog');
  const kennel = getObject('kennel');
  if (!dog || !kennel) return false;
  commandObject(dog, kennel, 'dog_rest');
  say(actor, 'YARD');
  say(dog, 'WOOF');
  log(state, `${actor.name} called the dog to the backyard kennel.`);
  return true;
}
