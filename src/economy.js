import { addGarbage } from './garbage.js';
import { commandMove } from './movement.js';
import { changeNeed, log, say, setMood } from './state.js';
import { approachPoint, getObject, objects } from './world.js';

const DELIVERY_SECONDS = {
  foodArrival: 7,
  foodExchange: 4,
  foodEating: 6,
  workoutArrival: 12,
  workoutExchange: 5,
  workoutInstall: 15,
};

function setTimedAction(actor, action, seconds, pose = 'stand') {
  actor.action = action;
  actor.actionT = seconds;
  actor.actionTotal = seconds;
  actor.pose = pose;
}

function clearDelivery(state, actor = null) {
  state.objectState.doorOpen = false;
  if (actor) {
    actor.actionT = 0;
    actor.actionTotal = 0;
    actor.carrying = null;
  }
  state.delivery = null;
}

export function pay(state, amount, label) {
  if (state.money < amount) {
    log(state, `Not enough money for ${label}.`);
    return false;
  }
  state.money -= amount;
  log(state, `Paid $${amount} for ${label}.`);
  return true;
}

export function orderFood(state, actor, auto = false) {
  if (auto && state.autonomyMode !== 'free') return false;
  if (auto && actor.traits?.frugal && (actor.skills?.money ?? 1) < 4) return false;
  if (state.delivery) {
    log(state, 'A delivery is already on the way.');
    return false;
  }
  if (!pay(state, 18, 'food delivery')) return false;
  const door = getObject('door');
  if (door) {
    const p = approachPoint(door, 'delivery');
    commandMove(actor, p.x, p.y);
  }
  setTimedAction(actor, 'Waiting for food delivery', DELIVERY_SECONDS.foodArrival, 'walk');
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  state.delivery = {
    type: 'food',
    phase: 'arriving',
    actorId: actor.id,
    t: DELIVERY_SECONDS.foodArrival,
    x: 220,
    y: 630,
    floor: 0,
    bubble: 'FOOD',
  };
  log(state, `${actor.name} ordered food. The delivery person is on the way.`);
  return true;
}

function beginFoodExchange(state, actor, job) {
  job.phase = 'exchange';
  job.t = DELIVERY_SECONDS.foodExchange;
  job.x = 286;
  job.y = 622;
  job.bubble = 'DELIVERY';
  state.objectState.doorOpen = true;
  setTimedAction(actor, 'Receiving food delivery', DELIVERY_SECONDS.foodExchange);
  actor.carrying = 'food bag';
  say(actor, 'THANKS');
  log(state, 'The delivery person arrived at the front porch.');
}

function beginEatingDelivery(state, actor, job) {
  job.phase = 'eating';
  job.t = DELIVERY_SECONDS.foodEating;
  job.bubble = 'ENJOY';
  job.x = 220;
  job.y = 646;
  state.objectState.doorOpen = false;
  setTimedAction(actor, 'Eating delivered food', DELIVERY_SECONDS.foodEating, 'sit');
  actor.carrying = 'food bag';
  say(actor, 'EAT');
  log(state, `${actor.name} collected the delivery and is eating now.`);
}

function finishFoodDelivery(state, actor) {
  changeNeed(actor, 'hunger', 30);
  changeNeed(actor, 'fun', 3);
  addGarbage(state, 'delivery', 14, actor);
  setMood(actor, 'happy');
  say(actor, 'DONE');
  actor.action = 'Finished delivery meal';
  log(state, `${actor.name} finished the delivered food.`);
  clearDelivery(state, actor);
}

function beginWorkoutExchange(state, actor, job) {
  job.phase = 'exchange';
  job.t = DELIVERY_SECONDS.workoutExchange;
  job.x = 286;
  job.y = 622;
  job.bubble = 'GEAR';
  state.objectState.doorOpen = true;
  setTimedAction(actor, 'Receiving workout gear', DELIVERY_SECONDS.workoutExchange);
  actor.carrying = 'workout boxes';
  say(actor, 'THANKS');
  log(state, 'The workout gear delivery arrived at the front porch.');
}

function beginWorkoutInstall(state, actor, job) {
  job.phase = 'installing';
  job.t = DELIVERY_SECONDS.workoutInstall;
  job.x = 220;
  job.y = 646;
  job.bubble = 'SETUP';
  state.objectState.doorOpen = false;
  setTimedAction(actor, 'Installing workout gear', DELIVERY_SECONDS.workoutInstall);
  actor.carrying = 'workout boxes';
  say(actor, 'SETUP');
  log(state, `${actor.name} brought the workout gear inside and started installing it.`);
}

function finishWorkoutDelivery(state, actor) {
  state.objectState.workoutGear = true;
  if (!objects.some(object => object.id === 'workout_gear')) {
    objects.push({
      id: 'workout_gear',
      label: 'Workout Gear',
      kind: 'workout',
      floor: 0,
      room: 'living',
      x: 356,
      y: 240,
      w: 72,
      h: 42,
      solid: true,
    });
  }
  actor.action = 'Finished installing workout gear';
  setMood(actor, 'happy');
  say(actor, 'DONE');
  log(state, 'Workout gear was installed in the living room.');
  clearDelivery(state, actor);
}

export function updateDelivery(state, dt) {
  const job = state.delivery;
  if (!job) return;
  const actor = state.entities.find(entity => entity.id === job.actorId);
  if (!actor) {
    log(state, 'The active delivery was cancelled because its receiving actor is unavailable.');
    clearDelivery(state);
    return;
  }

  job.t -= dt;
  if (job.t > 0) return;

  if (job.type === 'food') {
    if (job.phase === 'arriving') return beginFoodExchange(state, actor, job);
    if (job.phase === 'exchange') return beginEatingDelivery(state, actor, job);
    if (job.phase === 'eating') return finishFoodDelivery(state, actor);
  }

  if (job.type === 'workout') {
    if (job.phase === 'arriving') return beginWorkoutExchange(state, actor, job);
    if (job.phase === 'exchange') return beginWorkoutInstall(state, actor, job);
    if (job.phase === 'installing') return finishWorkoutDelivery(state, actor);
  }

  log(state, `Unknown delivery type ${job.type}. Delivery cancelled.`);
  clearDelivery(state, actor);
}

export function buyWorkoutGear(state, actor) {
  if (state.objectState.workoutGear) {
    log(state, 'Workout gear is already here.');
    return false;
  }
  if (state.delivery) {
    log(state, 'Finish the active delivery before ordering workout gear.');
    return false;
  }
  if (!pay(state, 220, 'workout gear')) return false;

  const door = getObject('door');
  if (door) {
    const p = approachPoint(door, 'delivery');
    commandMove(actor, p.x, p.y);
  }
  setTimedAction(actor, 'Waiting for workout gear delivery', DELIVERY_SECONDS.workoutArrival, 'walk');
  setMood(actor, 'phone');
  say(actor, 'GYM');
  state.delivery = {
    type: 'workout',
    phase: 'arriving',
    actorId: actor.id,
    t: DELIVERY_SECONDS.workoutArrival,
    x: 220,
    y: 630,
    floor: 0,
    bubble: 'GEAR',
  };
  log(state, `${actor.name} ordered workout gear. The delivery is on the way.`);
  return true;
}
