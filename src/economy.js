import { changeNeed, log, say, setMood } from './state.js';
import { objects } from './world.js';

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
  if (!pay(state, 18, 'food delivery')) return false;
  actor.action = 'Ordering food';
  actor.actionT = 5;
  actor.pose = 'sit';
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  setTimeout(() => changeNeed(actor, 'hunger', 30), 0);
  return true;
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
