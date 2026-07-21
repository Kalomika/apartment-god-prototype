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
  actor.action = 'Waiting for food delivery';
  actor.actionT = 7;
  actor.actionTotal = 7;
  actor.pose = 'walk';
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  state.delivery = { type: 'food', phase: 'arriving', actorId: actor.id, t: 7, x: 220, y: 630, floor: 0, bubble: 'FOOD' };
  log(state, `${actor.name} ordered food. The delivery person is on the way.`);
  return true;
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

  if (job.phase === 'arriving' && job.t <= 0) {
    job.phase = 'exchange';
    job.t = job.type === 'workout_gear' ? 5 : 4;
    job.x = 286;
    job.y = 622;
    job.bubble = job.type === 'workout_gear' ? 'GEAR' : 'DELIVERY';
    state.objectState.doorOpen = true;
    actor.action = job.type === 'workout_gear' ? 'Receiving workout gear' : 'Receiving food delivery';
    actor.actionT = job.t;
    actor.actionTotal = job.t;
    actor.pose = 'stand';
    actor.carrying = job.type === 'workout_gear' ? 'workout boxes' : 'food bag';
    say(actor, 'THANKS');
    log(state, job.type === 'workout_gear' ? 'The workout gear delivery arrived.' : 'The delivery person arrived at the front porch.');
    return;
  }

  if (job.phase === 'exchange' && job.t <= 0) {
    if (job.type === 'workout_gear') {
      job.phase = 'installing';
      job.t = 15;
      job.bubble = 'SETUP';
      job.x = 356;
      job.y = 240;
      state.objectState.doorOpen = false;
      actor.action = 'Installing workout gear';
      actor.actionT = 15;
      actor.actionTotal = 15;
      actor.pose = 'stand';
      actor.carrying = 'workout boxes';
      say(actor, 'SETUP');
      log(state, `${actor.name} is setting up the workout gear.`);
      return;
    }

    job.phase = 'eating';
    job.t = 6;
    job.bubble = 'ENJOY';
    job.x = 220;
    job.y = 646;
    state.objectState.doorOpen = false;
    actor.action = 'Eating delivered food';
    actor.actionT = 6;
    actor.actionTotal = 6;
    actor.pose = 'sit';
    actor.carrying = 'food bag';
    say(actor, 'EAT');
    log(state, `${actor.name} collected the delivery and is eating now.`);
    return;
  }

  if (job.phase === 'installing' && job.t <= 0) {
    state.objectState.workoutGear = true;
    if (!objects.some(o => o.id === 'workout_gear')) {
      objects.push({ id: 'workout_gear', label: 'Workout Gear', kind: 'workout', floor: 0, room: 'living', x: 356, y: 240, w: 72, h: 42, solid: true });
    }
    setMood(actor, 'happy');
    say(actor, 'DONE');
    actor.action = 'Finished workout gear setup';
    actor.actionT = 0;
    actor.actionTotal = 0;
    actor.carrying = null;
    log(state, 'Workout gear was installed in the living room.');
    state.delivery = null;
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

export function buyWorkoutGear(state, actor) {
  if (state.objectState.workoutGear) {
    log(state, 'Workout gear is already here.');
    return false;
  }
  if (state.delivery) {
    log(state, 'A delivery is already on the way.');
    return false;
  }
  if (!pay(state, 220, 'workout gear')) return false;
  const door = getObject('door');
  if (door) {
    const p = approachPoint(door, 'delivery');
    commandMove(actor, p.x, p.y);
  }
  actor.action = 'Waiting for workout gear delivery';
  actor.actionT = 12;
  actor.actionTotal = 12;
  actor.pose = 'walk';
  setMood(actor, 'phone');
  say(actor, 'GYM');
  state.delivery = { type: 'workout_gear', phase: 'arriving', actorId: actor.id, t: 12, x: 220, y: 630, floor: 0, bubble: 'GEAR' };
  log(state, 'Workout gear was ordered. The delivery is on the way.');
  return true;
}
