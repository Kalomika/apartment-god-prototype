import { addGarbage } from './garbage.js';
import { commandMove } from './movement.js';
import { changeNeed, log, say, setMood } from './state.js';
import { approachPoint, getObject, objects } from './world.js';

const DELIVERY_TIMING = Object.freeze({
  foodArrival: 7,
  foodExchange: 4,
  foodEating: 6,
  workoutArrival: 12,
  workoutExchange: 5,
  workoutInstall: 15,
});

function setTimedAction(actor, action, duration, pose = 'stand') {
  actor.action = action;
  actor.actionT = duration;
  actor.actionTotal = duration;
  actor.pose = pose;
}

function clearDelivery(state, actor = null) {
  state.objectState.doorOpen = false;
  if (actor) {
    actor.carrying = null;
    actor.actionT = 0;
    actor.actionTotal = 0;
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
  setTimedAction(actor, 'Waiting for food delivery', DELIVERY_TIMING.foodArrival, 'walk');
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  state.delivery = {
    type: 'food',
    phase: 'arriving',
    actorId: actor.id,
    t: DELIVERY_TIMING.foodArrival,
    x: 220,
    y: 630,
    floor: 0,
    bubble: 'FOOD',
  };
  log(state, `${actor.name} ordered food. The delivery person is on the way.`);
  return true;
}

export function updateDelivery(state, dt) {
  const job = state.delivery;
  if (!job) return;
  const actor = state.entities.find(e => e.id === job.actorId);
  if (!actor) {
    clearDelivery(state);
    return;
  }
  job.t -= dt;

  if (job.phase === 'arriving' && job.t <= 0) {
    job.phase = 'exchange';
    job.t = job.type === 'workout' ? DELIVERY_TIMING.workoutExchange : DELIVERY_TIMING.foodExchange;
    job.x = 286;
    job.y = 622;
    job.bubble = job.type === 'workout' ? 'GEAR' : 'DELIVERY';
    state.objectState.doorOpen = true;
    setTimedAction(
      actor,
      job.type === 'workout' ? 'Receiving workout gear' : 'Receiving food delivery',
      job.t,
      'stand',
    );
    actor.carrying = job.type === 'workout' ? 'workout boxes' : 'food bag';
    say(actor, 'THANKS');
    log(state, `The ${job.type === 'workout' ? 'equipment' : 'food'} delivery arrived at the front porch.`);
    return;
  }

  if (job.phase === 'exchange' && job.t <= 0) {
    state.objectState.doorOpen = false;
    if (job.type === 'workout') {
      job.phase = 'installing';
      job.t = DELIVERY_TIMING.workoutInstall;
      job.bubble = 'SETUP';
      job.x = 356;
      job.y = 240;
      setTimedAction(actor, 'Installing workout gear', job.t, 'stand');
      actor.carrying = 'workout boxes';
      say(actor, 'SETUP');
      log(state, `${actor.name} brought the workout gear inside and started installing it.`);
      return;
    }

    job.phase = 'eating';
    job.t = DELIVERY_TIMING.foodEating;
    job.bubble = 'ENJOY';
    job.x = 220;
    job.y = 646;
    setTimedAction(actor, 'Eating delivered food', job.t, 'sit');
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
    actor.carrying = null;
    log(state, `${actor.name} finished the delivered food.`);
    clearDelivery(state, actor);
    return;
  }

  if (job.phase === 'installing' && job.t <= 0) {
    state.objectState.workoutGear = true;
    if (!objects.some(o => o.id === 'workout_gear')) {
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
    setMood(actor, 'happy');
    say(actor, 'DONE');
    actor.action = 'Finished installing workout gear';
    actor.carrying = null;
    log(state, `${actor.name} finished installing the workout gear.`);
    clearDelivery(state, actor);
    return;
  }

  if (!['arriving', 'exchange', 'eating', 'installing'].includes(job.phase)) {
    log(state, `Cancelled unknown delivery phase: ${job.phase}.`);
    clearDelivery(state, actor);
  }
}

export function buyWorkoutGear(state, actor) {
  if (state.objectState.workoutGear) {
    log(state, 'Workout gear is already here.');
    return false;
  }
  if (state.delivery) {
    log(state, 'Finish the current delivery before ordering workout gear.');
    return false;
  }
  if (!pay(state, 220, 'workout gear')) return false;
  const door = getObject('door');
  if (door) {
    const p = approachPoint(door, 'delivery');
    commandMove(actor, p.x, p.y);
  }
  setTimedAction(actor, 'Waiting for workout gear delivery', DELIVERY_TIMING.workoutArrival, 'walk');
  setMood(actor, 'phone');
  say(actor, 'GYM');
  state.delivery = {
    type: 'workout',
    phase: 'arriving',
    actorId: actor.id,
    t: DELIVERY_TIMING.workoutArrival,
    x: 220,
    y: 630,
    floor: 0,
    bubble: 'GEAR',
  };
  log(state, 'Workout gear was ordered. Delivery and installation will take time.');
  return true;
}
