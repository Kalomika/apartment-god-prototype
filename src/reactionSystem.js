import { changeNeed, log, say } from './state.js';
import { roomAt } from './world.js';

const DEFAULT_REL = { vibe: 50, beef: 0, annoyance: 0, privacyComfort: 35, lastReason: '' };
const DIRECT_REACTION_TYPES = new Set(['anger', 'privacy', 'noise']);
const NOISE_ACTIONS = ['tv', 'music', 'stereo', 'treadmill', 'heavy bag', 'game', 'console', 'arcade'];
const PRIVATE_ACTIONS = ['shower', 'toilet', 'intimacy'];

export function ensureRelationshipState(state) {
  state.relationships ??= {};
  for (const actor of state.entities || []) {
    if (!actor || actor.hidden) continue;
    state.relationships[actor.id] ??= {};
    for (const other of state.entities || []) {
      if (!other || other.id === actor.id || other.hidden) continue;
      state.relationships[actor.id][other.id] = normalizeRel(state.relationships[actor.id][other.id]);
    }
  }
  return state.relationships;
}

function normalizeRel(rel) {
  return { ...DEFAULT_REL, ...(rel || {}) };
}

export function relationshipBetween(state, actorId, otherId) {
  ensureRelationshipState(state);
  return state.relationships?.[actorId]?.[otherId] || { ...DEFAULT_REL };
}

export function relationshipSummary(state, actor) {
  ensureRelationshipState(state);
  const rels = state.relationships?.[actor.id] || {};
  const rows = Object.entries(rels).map(([id, rel]) => ({ id, ...normalizeRel(rel) }));
  const vibing = rows.filter(r => r.vibe >= 60 && r.beef < 35).sort((a, b) => b.vibe - a.vibe);
  const beefing = rows.filter(r => r.beef >= 20 || r.annoyance >= 25).sort((a, b) => (b.beef + b.annoyance) - (a.beef + a.annoyance));
  return { vibing, beefing };
}

export function relationshipLabel(state, actor, otherId) {
  const other = state.entities.find(e => e.id === otherId);
  const rel = relationshipBetween(state, actor.id, otherId);
  return `${other?.name || otherId}: vibe ${Math.round(rel.vibe)}, beef ${Math.round(rel.beef)}, annoyed ${Math.round(rel.annoyance)}${rel.lastReason ? `, ${rel.lastReason}` : ''}`;
}

export function updateReactionWorld(state, dt) {
  ensureRelationshipState(state);
  for (const actor of state.entities || []) {
    if (!actor) continue;
    if (actor.reaction?.t > 0) {
      actor.reaction.t = Math.max(0, actor.reaction.t - dt);
      actor.reaction.age = (actor.reaction.age || 0) + dt;
      if (actor.reaction.t <= 0) actor.reaction = null;
    }
    if (actor.hidden || actor.labOnly) continue;
    actor.reactionCooldown = Math.max(0, (actor.reactionCooldown || 0) - dt);
  }
  scanPrivacy(state);
  scanNoise(state, dt);
}

function scanPrivacy(state) {
  const actors = (state.entities || []).filter(e => !e.hidden && !e.labOnly && e.type === 'person');
  for (const privateActor of actors) {
    const text = String(privateActor.action || '').toLowerCase();
    if (!PRIVATE_ACTIONS.some(key => text.includes(key))) continue;
    if ((privateActor.reactionCooldown || 0) > 0) continue;
    const room = roomAt(privateActor.x, privateActor.y, privateActor.floor);
    if (!room) continue;
    for (const intruder of actors) {
      if (intruder.id === privateActor.id || intruder.floor !== privateActor.floor) continue;
      const intruderRoom = roomAt(intruder.x, intruder.y, intruder.floor);
      if (intruderRoom?.id !== room.id) continue;
      if (privacyComfort(state, privateActor, intruder) > 70) continue;
      reactToIntrusion(state, privateActor, intruder, text.includes('shower') ? 'shower privacy' : 'bathroom privacy');
      privateActor.reactionCooldown = 7;
      break;
    }
  }
}

function scanNoise(state, dt) {
  const actors = (state.entities || []).filter(e => !e.hidden && !e.labOnly);
  for (const maker of actors) {
    const action = String(maker.action || '').toLowerCase();
    if (!NOISE_ACTIONS.some(key => action.includes(key))) continue;
    for (const listener of actors) {
      if (listener.id === maker.id || listener.floor !== maker.floor || (listener.reactionCooldown || 0) > 0) continue;
      const distance = Math.hypot(listener.x - maker.x, listener.y - maker.y);
      if (distance > 260) continue;
      const listenerAction = String(listener.action || '').toLowerCase();
      const sensitive = listenerAction.includes('sleep') || listenerAction.includes('nap') || (listener.needs?.energy ?? 100) < 30;
      if (!sensitive && Math.random() > dt * .04) continue;
      reactToNoise(state, listener, maker);
      listener.reactionCooldown = sensitive ? 8 : 13;
    }
  }
}

function privacyComfort(state, actor, other) {
  const rel = relationshipBetween(state, actor.id, other.id);
  let comfort = rel.privacyComfort || 35;
  if (rel.vibe > 70 && rel.beef < 20) comfort += 40;
  if (rel.beef > 40 || rel.annoyance > 45) comfort -= 30;
  if (actor.id === 'resident' && other.id === 'girlfriend') comfort += 25;
  if (actor.id === 'girlfriend' && other.id === 'resident') comfort += 25;
  return comfort;
}

function reactToIntrusion(state, actor, intruder, reason) {
  const style = reactionStyle(state, actor, intruder, 'privacy');
  triggerReaction(state, actor, {
    type: 'privacy',
    style,
    targetId: intruder.id,
    text: style === 'thought' ? 'privacy thought' : 'privacy burst',
    reason
  });
  adjustRelationship(state, actor.id, intruder.id, { vibe: -2, beef: style === 'speech' ? 5 : 2, annoyance: 9, reason });
  if (style === 'speech') adjustRelationship(state, intruder.id, actor.id, { vibe: -1, beef: 1, annoyance: 2, reason: 'got called out' });
  changeNeed(actor, 'social', style === 'speech' ? -5 : -2);
  log(state, `${actor.name} reacted to ${intruder.name} crossing ${reason}.`);
}

function reactToNoise(state, listener, maker) {
  const style = reactionStyle(state, listener, maker, 'noise');
  triggerReaction(state, listener, {
    type: 'noise',
    style,
    targetId: maker.id,
    text: style === 'thought' ? 'noise thought' : 'noise burst',
    reason: 'noise annoyance'
  });
  adjustRelationship(state, listener.id, maker.id, { vibe: -1, beef: style === 'speech' ? 3 : 1, annoyance: 5, reason: 'noise annoyance' });
  changeNeed(listener, 'fun', -2);
  log(state, `${listener.name} was annoyed by ${maker.name}'s noise.`);
}

function reactionStyle(state, actor, target, type) {
  const rel = relationshipBetween(state, actor.id, target.id);
  const timid = actor.traits?.timid || actor.traits?.meticulous || actor.id === 'girlfriend';
  const assertive = actor.traits?.assertive || actor.id === 'resident';
  if (type === 'privacy' && (actor.id === 'resident' || actor.id === 'girlfriend') && (target.id === 'resident' || target.id === 'girlfriend')) {
    if ((rel.vibe ?? 50) > 40 && (rel.beef ?? 0) < 35) return 'thought';
  }
  if (timid && !assertive) return 'thought';
  return DIRECT_REACTION_TYPES.has(type) ? 'speech' : 'thought';
}

export function triggerReaction(state, actor, reaction) {
  if (!actor) return false;
  actor.reaction = {
    type: reaction.type || 'emotion',
    style: reaction.style || 'speech',
    text: reaction.text || '',
    reason: reaction.reason || '',
    targetId: reaction.targetId || '',
    t: reaction.t ?? 3.4,
    total: reaction.t ?? 3.4,
    age: 0
  };
  if (reaction.style === 'speech') say(actor, cussSymbols(), 1.2);
  return true;
}

export function adjustRelationship(state, actorId, otherId, delta = {}) {
  if (!actorId || !otherId || actorId === otherId) return null;
  ensureRelationshipState(state);
  const rel = normalizeRel(state.relationships[actorId]?.[otherId]);
  rel.vibe = clamp((rel.vibe || 50) + (delta.vibe || 0), 0, 100);
  rel.beef = clamp((rel.beef || 0) + (delta.beef || 0), 0, 100);
  rel.annoyance = clamp((rel.annoyance || 0) + (delta.annoyance || 0), 0, 100);
  rel.lastReason = delta.reason || rel.lastReason || '';
  state.relationships[actorId][otherId] = rel;
  return rel;
}

function cussSymbols() {
  return ['#?!', '@!%', '!!#', '*?!'][Math.floor(Math.random() * 4)];
}

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
