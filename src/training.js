import { changeNeed, log, say, setMood } from './state.js';

export function startSkill(state, actor, skill) {
  if (skill === 'strength' && !state.objectState.workoutGear) {
    say(actor, 'NEED GYM');
    log(state, 'Buy workout gear before strength training at home.');
    return false;
  }
  actor.trainingSkill = skill;
  actor.action = skill === 'strength' ? 'Training strength' : skill === 'cooking' ? 'Practicing cooking' : skill === 'money' ? 'Studying money management' : 'Studying intellect';
  actor.actionT = skill === 'strength' ? 16 : 18;
  actor.pose = skill === 'strength' ? 'stand' : 'sit';
  changeNeed(actor, 'fun', -10);
  changeNeed(actor, 'stamina', skill === 'strength' ? -18 : -6);
  say(actor, skill === 'strength' ? 'LIFT' : 'STUDY');
  log(state, `${actor.name} started ${actor.action.toLowerCase()}.`);
  return true;
}

export function addRoutine(state, actor, skill) {
  state.routines.push({ actorId: actor.id, skill, hour: skill === 'strength' ? 7 : 20, lastDay: -1 });
  log(state, `${actor.name} scheduled ${skill} practice.`);
}

export function updateTraining(state) {
  for (const actor of state.entities) {
    if (!actor.trainingSkill || actor.actionT > 0) continue;
    const skill = actor.trainingSkill;
    actor.trainingSkill = null;
    const current = actor.skills?.[skill] ?? 1;
    const cap = actor.skillCaps?.[skill] ?? 6;
    const learning = actor.skills?.learning ?? 2;
    const gain = 0.16 + learning * 0.035;
    actor.skills[skill] = Math.min(cap, +(current + gain).toFixed(2));
    if (skill === 'cooking') cookingRisk(state, actor, current);
    say(actor, actor.skills[skill] >= cap ? 'LIMIT' : '+SKILL');
    log(state, `${actor.name} improved ${skill} to ${actor.skills[skill].toFixed(1)}.`);
  }
}

function cookingRisk(state, actor, current) {
  const risk = Math.max(0.05, 0.32 - current * 0.05);
  if (Math.random() > risk) return;
  const cost = current < 2 ? 95 : 35;
  state.money = Math.max(0, state.money - cost);
  changeNeed(actor, 'fun', -12);
  changeNeed(actor, 'freshness', -8);
  setMood(actor, 'spooked');
  say(actor, 'OOPS');
  log(state, `${actor.name} made a cooking mistake. Repairs cost $${cost}.`);
}

export function runRoutines(state) {
  const day = Math.floor(state.time / (24 * 60));
  const hour = Math.floor((state.time % (24 * 60)) / 60);
  for (const routine of state.routines) {
    if (routine.lastDay === day || routine.hour !== hour) continue;
    const actor = state.entities.find(e => e.id === routine.actorId);
    if (!actor || actor.hidden || actor.path.length || actor.actionT > 0 || actor.stopped) continue;
    if (startSkill(state, actor, routine.skill)) routine.lastDay = day;
  }
}
