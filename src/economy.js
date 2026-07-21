import { addGarbage } from './garbage.js';
import { commandMove } from './movement.js';
import { changeNeed, log, say, setMood } from './state.js';
import { approachPoint, getObject, objects } from './world.js';

const DELIVERY_PHASES = {
  food: {
    arriving: 7,
    exchange: 4,
    eating: 6
  },
  workout: {
    arriving: 12,
    exchange: 5,
    installing: 15
  }
};

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

function placeWorkoutGear(state) {
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
      solid: true
    });
  }
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
  setTimedAction(actor, 'Waiting for food delivery', DELIVERY_PHASES.food.arriving, 'walk');
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  state.delivery = {
    type: 'food',
    phase: 'arriving',
    actorId: actor.id,
    t: DELIVERY_PHASES.food.arriving,
    x: 220,
    y: 630,
    floor: 0,
    bubble: 'FOOD'
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
    log(state, 'The delivery was cancelled because nobody was available to receive it.');
    return;
  }

  job.t -= dt;

  if (job.phase === 'arriving' && job.t <= 0) {
    job.phase = 'exchange';
    job.t = DELIVERY_PHASES[job.type].exchange;
    job.x = 286;
    job.y = 622;
    job.bubble = job.type === 'food' ? 'DELIVERY' : 'GYM GEAR';
    state.objectState.doorOpen = true;
    setTimedAction(
      actor,
      job.type === 'food' ? 'Receiving food delivery' : 'Receiving workout gear',
      job.t
    );
    actor.carrying = job.type === 'food' ? 'food bag' : 'workout boxes';
    say(actor, 'THANKS');
    log(state, `The ${job.type === 'food' ? 'food' : 'workout gear'} delivery arrived at the front porch.`);
    return;
  }

  if (job.type === 'food' && job.phase === 'exchange' && job.t <= 0) {
    job.phase = 'eating';
    job.t = DELIVERY_PHASES.food.eating;
    job.bubble = 'ENJOY';
    job.x = 220;
    job.y = 646;
    state.objectState.doorOpen = false;
    setTimedAction(actor, 'Eating delivered food', job.t, 'sit');
    actor.carrying = 'food bag';
    say(actor, 'EAT');
    log(state, `${actor.name} collected the delivery and is eating now.`);
    return;
  }

  if (job.type === 'food' && job.phase === 'eating' && job.t <= 0) {
    changeNeed(actor, 'hunger', 30);
    changeNeed(actor, 'fun', 3);
    addGarbage(state, 'delivery', 14, actor);
    setMood(actor, 'happy');
    say(actor, 'DONE');
    actor.action = 'Finished delivery meal';
    clearDelivery(state, actor);
    log(state, `${actor.name} finished the delivered food.`);
    return;
  }

  if (job.type === 'workout' && job.phase === 'exchange' && job.t <= 0) {
    job.phase = 'installing';
    job.t = DELIVERY_PHASES.workout.installing;
    job.bubble = 'SETTING UP';
    job.x = 356;
    job.y = 240;
    state.objectState.doorOpen = false;
    setTimedAction(actor, 'Installing workout gear', job.t, 'stand');
    actor.carrying = 'workout boxes';
    say(actor, 'RN');
    log(state, `${actor.name} brought the workout gear inside and started installing it.`);
    return;
  }

  if (job.type === 'workout' && job.phase === 'installing' && job.t <= 0) {
    placeWorkoutGear(state);
    setMood(actor, 'happy');
    say(actor, 'DONE');
    actor.action = 'Finished installing workout gear';
    clearDelivery(state, actor);
    log(state, 'Workout gear was installed in the living room.');
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

  setTimedAction(actor, 'Waiting for workout gear delivery', DELIVERY_PHASES.workout.arriving, 'walk');
  setMood(actor, 'phone');
  say(actor, 'GYM');
  state.delivery = {
    type: 'workout',
    phase: 'arriving',
    actorId: actor.id,
    t: DELIVERY_PHASES.workout.arriving,
    x: 220,
    y: 630,
    floor: 0,
    bubble: 'GYM GEAR'
  };
  log(state, `${actor.name} ordered workout gear. The delivery person is on the way.`);
  return true;
}
