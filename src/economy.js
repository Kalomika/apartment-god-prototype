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
  actor.pose = 'walk';
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  state.delivery = { type: 'food', phase: 'arriving', actorId: actor.id, t: 7, x: 36, y: 430, floor: 0, bubble: 'FOOD' };
  log(state, `${actor.name} ordered food. The delivery person is on the way.`);
  return true;
}

export function updateDelivery(state, dt) {
  const job = state.delivery;
  if (!job) return;
  const actor = state.entities.find(e => e.id === job.actorId);
  if (!actor) { state.delivery = null; return; }
  job.t -= dt;

  if (job.phase === 'arriving' && job.t <= 0) {
    job.phase = 'exchange';
    job.t = 4;
    job.x = 70;
    job.y = 430;
    job.bubble = 'here';
    state.objectState.doorOpen = true;
    actor.action = 'Receiving food delivery';
    actor.actionT = 4;
    actor.actionTotal = 4;
    actor.pose = 'stand';
    say(actor, 'thanks');
    log(state, 'The delivery person arrived at the door. Food has to be received before eating.');
    return;
  }

  if (job.phase === 'exchange' && job.t <= 0) {
    job.phase = 'eating';
    job.t = 7;
    job.x = actor.x + 26;
    job.y = actor.y + 18;
    job.floor = actor.floor;
    job.bubble = 'bag';
    state.objectState.doorOpen = false;
    actor.action = 'Eating delivered food';
    actor.actionT = 7;
    actor.actionTotal = 7;
    actor.pose = 'sit';
    say(actor, 'rn');
    log(state, `${actor.name} received the food and is eating now.`);
    return;
  }

  if (job.phase === 'eating') {
    job.x = actor.x + 26;
    job.y = actor.y + 18;
    job.floor = actor.floor;
    if (job.t <= 0) {
      changeNeed(actor, 'hunger', 30);
      changeNeed(actor, 'fun', 3);
      setMood(actor, 'happy');
      say(actor, 'good');
      actor.action = 'Ate delivered food';
      actor.actionT = 0;
      actor.actionTotal = 0;
      log(state, `${actor.name} finished the delivered food.`);
      state.delivery = null;
    }
  }
}

export function buyWorkoutGear(state, actor) {
  if (state.objectState.workoutGear) return log(state, 'Workout gear is already here.');
  if (!pay(state, 220, 'workout gear')) return false;
  state.objectState.workoutGear = true;
  if (!objects.some(o => o.id === 'workout_gear')) {
    objects.push({ id: 'workout_gear', label: 'Workout Gear', kind: 'workout', floor: 0, room: 'living', x: 356, y: 240, w: 72, h: 42, solid: true });
  }
  actor.action = 'Ordering workout gear';
  actor.actionT = 5;
  actor.pose = 'sit';
  setMood(actor, 'phone');
  say(actor, 'GYM');
  log(state, 'Workout gear was delivered to the living room.');
  return true;
}
