import { ACTION_TIMES } from './config.js';
import { changeNeed, log, say, setMood } from './state.js';

export const AUTONOMY_MODES = ['manual', 'guided', 'free'];

export function cycleAutonomyMode(state) {
  const index = AUTONOMY_MODES.indexOf(state.autonomyMode);
  state.autonomyMode = AUTONOMY_MODES[(index + 1) % AUTONOMY_MODES.length];
  log(state, `Autonomy mode: ${state.autonomyMode.toUpperCase()}`);
}

export function canAutoAct(state) {
  return state.autonomyMode !== 'manual';
}

export function canAutoSpend(state, actor, amount) {
  if (state.autonomyMode !== 'free') return false;
  if (state.money < amount) return false;
  const moneySkill = actor.skills?.moneyManagement ?? 1;
  if (actor.traits?.frugal && amount > 25) return false;
  if (moneySkill >= 5) return state.money - amount > 150;
  if (moneySkill >= 3) return state.money - amount > 75;
  return actor.traits?.spender === true;
}

export function spendMoney(state, amount, reason) {
  if (state.money < amount) {
    log(state, `Not enough money for ${reason}.`);
    return false;
  }
  state.money -= amount;
  log(state, `Spent $${amount} on ${reason}.`);
  return true;
}

export function orderFood(state, actor, automatic = false) {
  const cost = 18;
  if (automatic && !canAutoSpend(state, actor, cost)) {
    say(actor, 'COOK?');
    return false;
  }
  if (!spendMoney(state, cost, 'food delivery')) return false;
  actor.action = 'Ordering food on phone';
  actor.actionT = ACTION_TIMES.order_food ?? 5;
  actor.pose = 'sit';
  setMood(actor, 'phone');
  say(actor, 'ORDER');
  return true;
}

export function buyWorkoutGear(state, actor) {
  if (state.objectState.workoutGear) {
    log(state, 'Workout gear is already in the apartment.');
    return false;
  }
  const cost = 220;
  if (!spendMoney(state, cost, 'workout gear')) return false;
  state.objectState.workoutGear = true;
  actor.action = 'Ordered workout gear';
  actor.actionT = ACTION_TIMES.buy_workout ?? 6;
  actor.pose = 'sit';
  setMood(actor, 'phone');
  say(actor, 'GYM');
  log(state, 'Workout gear delivered to the living room corner.');
  return true;
}

export function startSkillSession(state, actor, skill) {
  if (skill === 'strength' && !state.objectState.workoutGear) {
    say(actor, 'NEED GYM');
    log(state, 'Buy workout gear first or send them out for fitness later.');
    return false;
  }
  const labels = {
    strength: 'Training strength',
    intellect: 'Studying on laptop',
    cooking: 'Practicing cooking',
    moneyManagement: 'Practicing money management'
  };
  actor.action = labels[skill] || `Training ${skill}`;
  actor.trainingSkill = skill;
  actor.actionT = ACTION_TIMES[`train_${skill}`] || 14;
  actor.pose = skill === 'strength' ? 'stand' : 'sit';
  say(actor, skill === 'strength' ? 'LIFT' : 'STUDY');
  changeNeed(actor, 'fun', -8);
  changeNeed(actor, 'stamina', skill === 'strength' ? -18 : -7);
  log(state, `${actor.name} started ${labels[skill] || skill}.`);
  return true;
}

export function finishLifeAction(state, actor, text) {
  if (text.includes('ordering food')) {
    changeNeed(actor, 'hunger', 32);
    changeNeed(actor, 'fun', 3);
    setMood(actor, 'happy');
    say(actor, 'FOOD');
    return true;
  }
  if (text.includes('workout gear')) return true;
  if (actor.trainingSkill) {
    improveSkill(state, actor, actor.trainingSkill);
    actor.trainingSkill = null;
    return true;
  }
  return false;
}

export function improveSkill(state, actor, skill) {
  actor.skills ??= {};
  actor.skillCaps ??= {};
  const current = actor.skills[skill] ?? 1;
  const cap = actor.skillCaps[skill] ?? 6;
  const learning = actor.skills.learning ?? 2;
  const gain = Math.max(0.12, 0.18 + learning * 0.035);
  actor.skills[skill] = Math.min(cap, +(current + gain).toFixed(2));
  if (actor.skills[skill] >= cap) {
    say(actor, 'LIMIT');
    log(state, `${actor.name} hit their current ceiling in ${skill}.`);
  } else {
    say(actor, '+SKILL');
    log(state, `${actor.name} improved ${skill} to ${actor.skills[skill].toFixed(1)}.`);
  }
}

export function addRoutine(state, actor, skill) {
  state.routines.push({ actorId: actor.id, skill, hour: skill === 'strength' ? 7 : 20, lastDay: -1 });
  log(state, `${actor.name} scheduled ${skill} practice.`);
}

export function runScheduledRoutines(state) {
  const day = Math.floor(state.time / (24 * 60));
  const hour = Math.floor((state.time % (24 * 60)) / 60);
  for (const routine of state.routines) {
    if (routine.lastDay === day || routine.hour !== hour) continue;
    const actor = state.entities.find(e => e.id === routine.actorId);
    if (!actor || actor.hidden || actor.path.length || actor.actionT > 0 || actor.stopped) continue;
    if (startSkillSession(state, actor, routine.skill)) routine.lastDay = day;
  }
}
