import { addGarbage } from './garbage.js';
import { commandMove } from './movement.js';
import { changeNeed, log, say, setMood } from './state.js';
import { approachPoint, getObject, objects } from './world.js';

export function pay(state, amount, label) {
  if (state.money < amount) {
    log(state, `Not enough money for ${label}.`);
    return false;
  }
  state.money -= amount;
  log(state, `Paid $${amount} for ${label}.`);
  return true;
}

function moveToDeliveryDoor(actor) {
  const door = getObject('door');
  if (!door) return;
  const p = approachPoint(door, 'delivery');
  commandMove(actor, p.x, p.y);
}

function beginTimedAction(actor, action, seconds, pose = 'stand') {
  actor.action = action;
  actor.actionT = seconds;
  actor.actionTotal = seconds;
  actor.pose = pose;
}

export function orderFood(state, actor, auto = false) {
  if (auto && state.autonomyMode !== 'free') return false;
  if (auto && actor.traits?.frugal && (actor.skills?.money ?? 1) < 4) return false;
  if (state.delivery) {
    log(state, 'A delivery is already on the way.');
    return false;
  }
  if (!pay(state, 18, 'food delivery')) return false;
  moveToDeliveryDoor(actor);
  beginTimedAction(actor, 'Waiting for food delivery', 7, 'walk');
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  state.delivery = { type: 'food', phase: 'arriving', actorId: actor.id, t: 7, x: 220, y: 630, floor: 0, bubble: 'FOOD' };
  log(state, `${actor.name} ordered food. The delivery person is on the way.`);
  return true;
}

function addWorkoutGearToWorld(state) {
  state.objectState.workoutGear = true;
  if (!objects.some(o => o.id === 'workout_gear')) {
    objects.push({ id: 'workout_gear', label: 'Workout Gear', kind: 'workout', floor: 0, room: 'living', x: 356, y: 240, w: 72, h: 42, solid: true });
  }
}

function updateFoodDelivery(state, actor, job) {
  if (job.phase === 'arriving' && job.t <= 0) {
    job.phase = 'exchange';
    job.t = 4;
    job.x = 286;
    job.y = 622;
    job.bubble = 'DELIVERY';
    state.objectState.doorOpen = true;
    beginTimedAction(actor, 'Receiving food delivery', 4);
    actor.carrying = 'food bag';
    say(actor, 'THANKS');
    log(state, 'The delivery person arrived at the front porch.');
    return;
  }

  if (job.phase === 'exchange' && job.t <= 0) {
    job.phase = 'eating';
    job.t = 6;
    job.bubble = 'ENJOY';
    job.x = 220;
    job.y = 646;
    state.objectState.doorOpen = false;
    beginTimedAction(actor, 'Eating delivered food', 6, 'sit');
    actor.carrying = 'food bag';
    say(actor, 'EAT');
    log(state, `${actor.name} collected the delivery and is eating now.`);
    return;
  }

  if (job.phase === 'eating' && job.t <= 0) {
    changeNeed(actor, 'hunger', 30);
    changeNeed(actor, 'fun', 3);
    addGarbage(state, 'delivery', 14, actor);
    setMood(actor, 'happy');
    say(actor, 'DONE');
    actor.action = 'Finished delivery meal';
    actor.actionT = 0;
    actor.actionTotal = 0;
    actor.carrying = null;
    log(state, `${actor.name} finished the delivered food.`);
    state.delivery = null;
  }
}

function updateWorkoutGearDelivery(state, actor, job) {
  if (job.phase === 'arriving' && job.t <= 0) {
    job.phase = 'exchange';
    job.t = 5;
    job.x = 286;
    job.y = 622;
    job.bubble = 'GEAR';
    state.objectState.doorOpen = true;
    beginTimedAction(actor, 'Receiving workout gear', 5);
    actor.carrying = 'workout boxes';
    say(actor, 'YEAH');
    log(state, 'The workout gear delivery arrived at the front porch.');
    return;
  }

  if (job.phase === 'exchange' && job.t <= 0) {
    job.phase = 'installing';
    job.t = 15;
    job.x = 220;
    job.y = 646;
    job.bubble = 'SETUP';
    state.objectState.doorOpen = false;
    beginTimedAction(actor, 'Installing workout gear', 15, 'stand');
    actor.carrying = 'workout boxes';
    say(actor, 'SETUP');
    log(state, `${actor.name} brought the workout gear inside and started setting it up.`);
    return;
  }

  if (job.phase === 'installing' && job.t <= 0) {
    addWorkoutGearToWorld(state);
    actor.carrying = null;
    actor.action = 'Workout gear installed';
    actor.actionT = 0;
    actor.actionTotal = 0;
    setMood(actor, 'happy');
    say(actor, 'DONE');
    log(state, 'Workout gear was installed in the living room.');
    state.delivery = null;
  }
}

export function updateDelivery(state, dt) {
  const job = state.delivery;
  if (!job) return;
  const actor = state.entities.find(e => e.id === job.actorId);
  if (!actor) {
    state.objectState.doorOpen = false;
    state.delivery = null;
    return;
  }
  job.t -= dt;

  if (job.type === 'workout_gear') {
    updateWorkoutGearDelivery(state, actor, job);
    return;
  }
  updateFoodDelivery(state, actor, job);
}

export function buyWorkoutGear(state, actor) {
  if (state.objectState.workoutGear) {
    log(state, 'Workout gear is already here.');
    return false;
  }
  if (state.delivery?.type === 'workout_gear') {
    log(state, 'Workout gear is already on the way.');
    return false;
  }
  if (state.delivery) {
    log(state, 'Finish the current delivery before ordering workout gear.');
    return false;
  }
  if (!pay(state, 220, 'workout gear')) return false;
  moveToDeliveryDoor(actor);
  beginTimedAction(actor, 'Waiting for workout gear', 12, 'walk');
  setMood(actor, 'phone');
  say(actor, 'GYM');
  state.delivery = { type: 'workout_gear', phase: 'arriving', actorId: actor.id, t: 12, x: 220, y: 630, floor: 0, bubble: 'GEAR' };
  log(state, `${actor.name} ordered workout gear. The delivery is on the way.`);
  return true;
}
