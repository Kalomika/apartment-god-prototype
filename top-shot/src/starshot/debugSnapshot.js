import { createActorRuntimeState } from './actorRuntimeState.js';

export function createStarshotDebugSnapshot(state, world = null, options = {}) {
  const timing = options.timing || world?.starshotTiming?.snapshot?.() || { profile: 'real_time', scale: 1 };
  const actors = [];
  for (const fighter of state?.fighters || []) {
    const actor = world?.actors?.get?.(fighter.id) || null;
    actors.push(createActorDebugSnapshot(fighter, actor, { timing, renderStyle: options.renderStyle }));
  }
  return {
    mode: state?.mode || 'unknown',
    clock: state?.clock || 0,
    matchState: state?.matchState || null,
    timing,
    actors,
    eventCount: world?.starshotEventBus?.recent?.(999)?.length || 0,
    recentEvents: world?.starshotEventBus?.recent?.(8) || []
  };
}

export function createActorDebugSnapshot(fighter, actor = null, context = {}) {
  const runtime = createActorRuntimeState(fighter, actor, context);
  return {
    id: runtime.id,
    team: runtime.team,
    archetypeId: runtime.archetypeId,
    profileId: runtime.profile.id,
    powerScale: runtime.profile.powerScale,
    motionState: runtime.motion.state,
    speed: round(runtime.motion.speedCurrent),
    speedTarget: round(runtime.motion.speedTarget),
    velocity: {
      x: round(runtime.motion.vx),
      y: round(runtime.motion.vy),
      z: round(runtime.motion.vz)
    },
    animationState: runtime.animation.state,
    steppedFps: runtime.animation.steppedFps,
    combatState: runtime.combat.state,
    currentMoveId: runtime.combat.currentMoveId,
    currentMoveKind: runtime.combat.currentMoveKind,
    hitFrameOpen: runtime.combat.hitFrameOpen,
    counterWindowOpen: runtime.combat.counterWindowOpen,
    aiIntent: runtime.ai.intent,
    command: runtime.ai.command,
    target: runtime.ai.target,
    arena: runtime.arena,
    timingProfile: runtime.timing.profile || 'real_time',
    flags: runtime.debug.flags
  };
}

export function findActorSnapshot(snapshot, actorId) {
  return snapshot?.actors?.find(actor => actor.id === actorId) || null;
}

export function formatActorDebugLine(actor) {
  if (!actor) return 'starshot: none';
  const parts = [
    `anim:${actor.animationState}`,
    `fps:${actor.steppedFps}`,
    `motion:${actor.motionState}`,
    `v:${actor.speed}`,
    `combat:${actor.combatState}`
  ];
  if (actor.aiIntent) parts.push(`ai:${actor.aiIntent}`);
  if (actor.timingProfile && actor.timingProfile !== 'real_time') parts.push(`time:${actor.timingProfile}`);
  if (actor.flags?.length) parts.push(actor.flags.join(','));
  return parts.slice(0, 8).join(' | ');
}

function round(value) {
  return Number.isFinite(value) ? Math.round(value * 100) / 100 : 0;
}
