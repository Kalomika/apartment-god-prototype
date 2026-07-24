import { addGarbage } from './garbage.js';
import { commandMove } from './movement.js';
import { changeNeed, log, say, setMood } from './state.js';
import { approachPoint, getObject, objects } from './world.js';

const DELIVERY_TIMES = Object.freeze({
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

function closeDoor(state) {
  if (state.objectState) state.objectState.doorOpen = false;
}

function cancelDelivery(state, actor, message) {
  closeDoor(state);
  if (actor) {
    actor.carrying = null;
    actor.actionT = 0;
    actor.actionTotal = 0;
  }
  if (message) log(state, message);
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
  setTimedAction(actor, 'Waiting for food delivery', DELIVERY_TIMES.foodArrival, 'walk');
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  state.delivery = {
    type: 'food',
    phase: 'arriving',
    actorId: actor.id,
    t: DELIVERY_TIMES.foodArrival,
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
  const actor = state.entities.find(entity => entity.id === job.actorId);
  if (!actor) {
    cancelDelivery(state, null, 'The delivery was cancelled because nobody was available to receive it.');
    return;
  }
  job.t -= dt;

  if (job.type === 'food') {
    if (job.phase === 'arriving' && job.t <= 0) {
      job.phase = 'exchange';
      job.t = DELIVERY_TIMES.foodExchange;
      job.x = 286;
      job.y = 622;
      job.bubble = 'DELIVERY';
      state.objectState.doorOpen = true;
      setTimedAction(actor, 'Receiving food delivery', DELIVERY_TIMES.foodExchange);
      actor.carrying = 'food bag';
      say(actor, 'THANKS');
      log(state, 'The delivery person arrived at the front porch.');
      return;
    }

    if (job.phase === 'exchange' && job.t <= 0) {
      job.phase = 'eating';
      job.t = DELIVERY_TIMES.foodEating;
      job.bubble = 'ENJOY';
      job.x = 220;
      job.y = 646;
      closeDoor(state);
      setTimedAction(actor, 'Eating delivered food', DELIVERY_TIMES.foodEating, 'sit');
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
      return;
    }
  }

  if (job.type === 'workoutGear') {
    if (job.phase === 'arriving' && job.t <= 0) {
      job.phase = 'exchange';
      job.t = DELIVERY_TIMES.workoutExchange;
      job.x = 286;
      job.y = 622;
      job.bubble = 'GEAR';
      state.objectState.doorOpen = true;
      setTimedAction(actor, 'Receiving workout gear', DELIVERY_TIMES.workoutExchange);
      actor.carrying = 'workout boxes';
      say(actor, 'YEAH');
      log(state, 'The workout gear delivery arrived at the front door.');
      return;
    }

    if (job.phase === 'exchange' && job.t <= 0) {
      job.phase = 'installing';
      job.t = DELIVERY_TIMES.workoutInstall;
      job.x = 356;
      job.y = 240;
      job.bubble = 'INSTALL';
      closeDoor(state);
      setTimedAction(actor, 'Installing workout gear', DELIVERY_TIMES.workoutInstall);
      actor.carrying = 'workout boxes';
      say(actor, 'SETUP');
      log(state, `${actor.name} is installing the workout gear.`);
      return;
    }

    if (job.phase === 'installing' && job.t <= 0) {
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
      actor.actionT = 0;
      actor.actionTotal = 0;
      actor.carrying = null;
      setMood(actor, 'happy');
      say(actor, 'DONE');
      log(state, 'Workout gear was installed in the living room.');
      state.delivery = null;
      return;
    }
  }

  if (job.t <= 0) {
    cancelDelivery(state, actor, `Unknown delivery state ${job.type}:${job.phase} was cancelled safely.`);
  }
}

export function buyWorkoutGear(state, actor) {
  if (state.objectState.workoutGear) {
    log(state, 'Workout gear is already here.');
    return false;
  }
  if (state.delivery?.type === 'workoutGear') {
    log(state, 'Workout gear is already on the way.');
    return false;
  }
  if (state.delivery) {
    log(state, 'Another delivery is already on the way.');
    return false;
  }
  if (!pay(state, 220, 'workout gear')) return false;

  const door = getObject('door');
  if (door) {
    const p = approachPoint(door, 'delivery');
    commandMove(actor, p.x, p.y);
  }

  setTimedAction(actor, 'Waiting for workout gear delivery', DELIVERY_TIMES.workoutArrival, 'walk');
  setMood(actor, 'phone');
  say(actor, 'GYM');
  state.delivery = {
    type: 'workoutGear',
    phase: 'arriving',
    actorId: actor.id,
    t: DELIVERY_TIMES.workoutArrival,
    x: 220,
    y: 630,
    floor: 0,
    bubble: 'GEAR',
  };
  log(state, 'Workout gear was ordered. The delivery person is on the way.');
  return true;
}
