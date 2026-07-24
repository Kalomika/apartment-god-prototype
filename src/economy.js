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

const WORKOUT_INSTALL_POINT = Object.freeze({ x: 356, y: 240 });

function setTimedAction(actor, action, duration, pose = 'stand') {
  actor.action = action;
  actor.actionT = duration;
  actor.actionTotal = duration;
  actor.pose = pose;
}

function closeDoor(state) {
  if (state.objectState) state.objectState.doorOpen = false;
}

function clearDeliveryActorState(actor) {
  if (!actor) return;
  actor.carrying = null;
  actor.actionT = 0;
  actor.actionTotal = 0;
}

function cancelDelivery(state, actor, message) {
  closeDoor(state);
  clearDeliveryActorState(actor);
  if (message) log(state, message);
  state.delivery = null;
}

export function deliveryReceiverAvailableForTest(actor, floor = 0) {
  return Boolean(actor && !actor.hidden && actor.floor === floor);
}

function receiverCanOrder(state, actor, door) {
  if (!deliveryReceiverAvailableForTest(actor, door?.floor ?? 0)) {
    log(state, `${actor?.name || 'The selected resident'} must be available on the main floor to receive a delivery.`);
    return false;
  }
  return true;
}

function beginDoorApproach(state, actor, door) {
  const p = approachPoint(door, 'delivery');
  commandMove(actor, p.x, p.y);
  if (!actor.path?.length) {
    log(state, `${actor.name} could not reach the front door, so the order was not placed.`);
    return false;
  }
  return true;
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
  const door = getObject('door');
  if (!door || !receiverCanOrder(state, actor, door)) return false;
  if (!beginDoorApproach(state, actor, door)) return false;
  if (!pay(state, 18, 'food delivery')) {
    clearDeliveryActorState(actor);
    actor.path = [];
    return false;
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
  if (!deliveryReceiverAvailableForTest(actor, job.floor ?? 0)) {
    cancelDelivery(state, actor, 'The delivery was cancelled because the receiver was no longer available at home.');
    return;
  }

  if (job.type === 'workoutGear' && job.phase === 'moving_to_install') {
    if (actor.path?.length) return;
    job.phase = 'installing';
    job.t = DELIVERY_TIMES.workoutInstall;
    job.x = WORKOUT_INSTALL_POINT.x;
    job.y = WORKOUT_INSTALL_POINT.y;
    job.bubble = 'INSTALL';
    setTimedAction(actor, 'Installing workout gear', DELIVERY_TIMES.workoutInstall);
    actor.carrying = 'workout boxes';
    say(actor, 'SETUP');
    log(state, `${actor.name} reached the installation area and started setting up the workout gear.`);
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
      clearDeliveryActorState(actor);
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
      closeDoor(state);
      commandMove(actor, WORKOUT_INSTALL_POINT.x, WORKOUT_INSTALL_POINT.y);
      if (!actor.path?.length) {
        cancelDelivery(state, actor, `${actor.name} could not reach the workout installation area, so the delivery was cancelled safely.`);
        return;
      }
      job.phase = 'moving_to_install';
      job.t = 0;
      job.x = 220;
      job.y = 646;
      job.bubble = 'MOVE';
      actor.action = 'Carrying workout gear to the installation area';
      actor.carrying = 'workout boxes';
      say(actor, 'MOVE');
      log(state, `${actor.name} is carrying the workout boxes to the installation area.`);
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
          x: WORKOUT_INSTALL_POINT.x,
          y: WORKOUT_INSTALL_POINT.y,
          w: 72,
          h: 42,
          solid: true,
        });
      }
      actor.action = 'Finished installing workout gear';
      clearDeliveryActorState(actor);
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
  const door = getObject('door');
  if (!door || !receiverCanOrder(state, actor, door)) return false;
  if (!beginDoorApproach(state, actor, door)) return false;
  if (!pay(state, 220, 'workout gear')) {
    clearDeliveryActorState(actor);
    actor.path = [];
    return false;
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
