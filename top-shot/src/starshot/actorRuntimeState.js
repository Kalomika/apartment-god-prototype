export function createActorRuntimeState(fighter, actor = null, context = {}) {
  const profile = fighter?.profile || fighter?.characterProfile || null;
  const motion = actor?.motion3D || fighter?.motion || null;
  const animationState = deriveAnimationState(fighter, actor);
  const animation = actor?.anim || { state: animationState, t: 0 };
  const currentMove = fighter?.currentMove || null;
  const target = deriveTarget(fighter);
  const timing = context.timing?.snapshot?.() || context.timing || { profile: 'real_time', scale: 1 };

  return {
    id: fighter?.id || actor?.group?.name || 'unknown',
    team: fighter?.team || 'preview',
    archetypeId: fighter?.archetypeId || actor?.archetypeId || 'unknown',
    profile: {
      id: profile?.id || fighter?.archetypeId || actor?.archetypeId || 'unknown',
      label: profile?.label || profile?.name || fighter?.name || actor?.style?.label || 'Fighter',
      powerScale: profile?.powerScale || profile?.scale || fighter?.powerScale || fighter?.scale || 'human'
    },
    motion: normalizeMotion(motion, fighter),
    animation: {
      state: animation?.state || animationState,
      prevState: animation?.prevState || actor?.prevAnimationState || null,
      subState: animation?.subState || currentMove?.kind || null,
      t: finite(animation?.t),
      steppedFps: steppedFpsFor(animation?.state || animationState),
      sourcePose: fighter?.currentMove?.id || fighter?.pose || fighter?.intent || null
    },
    combat: {
      state: combatStateFor(fighter),
      currentMoveId: currentMove?.id || null,
      currentMoveKind: currentMove?.kind || null,
      targetId: currentMove?.target || target?.id || null,
      hitFrameOpen: Boolean(currentMove?.hitFrameOpen || currentMove?.active || fighter?.combat?.hitFrameOpen),
      counterWindowOpen: Boolean(fighter?.combat?.counterWindowOpen || fighter?.cqc?.counterWindowOpen),
      zone: currentMove?.zone || fighter?.cqc?.lastZone || null,
      mounted: Boolean(fighter?.cqc?.mounting || fighter?.cqc?.mountedBy),
      grounded: Boolean(fighter?.cqc?.grounded || fighter?.prone),
      recoilT: finite(fighter?.cqc?.recoilT)
    },
    ai: {
      intent: fighter?.brain?.intent || fighter?.intent || 'idle',
      command: fighter?.memory?.command?.type || null,
      target: normalizeTarget(target),
      lastSeen: normalizePoint(fighter?.memory?.lastSeen),
      awareness: fighter?.awareness?.phase || null,
      stuckFrames: Math.max(0, Math.floor(fighter?.stuckFrames || 0))
    },
    arena: {
      x: finite(fighter?.x),
      y: finite(fighter?.y),
      facing: finite(fighter?.facing),
      coverPinned: Boolean(fighter?.coverPinned),
      shadowHidden: Boolean(fighter?.shadowHidden),
      deployAltitude: finite(fighter?.deployAltitude)
    },
    rendering: {
      visible: actor?.group ? actor.group.visible !== false : !fighter?.extracted,
      actorState: actor?.animationState || null,
      style: context.renderStyle || 'default'
    },
    timing,
    debug: {
      flags: debugFlagsFor(fighter),
      source: 'starshot_runtime_state_v1'
    }
  };
}

export function updateActorRuntimeState(target, fighter, actor = null, context = {}) {
  const next = createActorRuntimeState(fighter, actor, context);
  if (!target) return next;
  Object.assign(target, next);
  return target;
}

function normalizeMotion(motion, fighter) {
  const vx = finite(motion?.vx);
  const vy = finite(motion?.vy);
  const vz = finite(motion?.vz);
  const vectorSpeed = Math.hypot(vx, vz);
  const fallbackSpeed = finite(fighter?.lastMove) * 6;
  const speedCurrent = Number.isFinite(motion?.speedCurrent)
    ? Math.max(0, motion.speedCurrent)
    : Math.max(vectorSpeed, fallbackSpeed);
  return {
    state: motionStateFor(fighter, speedCurrent),
    vx,
    vy,
    vz,
    speedCurrent,
    speedTarget: Number.isFinite(motion?.speedTarget) ? Math.max(0, motion.speedTarget) : speedCurrent,
    facingCurrent: Number.isFinite(motion?.facingCurrent) ? motion.facingCurrent : -finite(fighter?.facing),
    facingTarget: Number.isFinite(motion?.facingTarget) ? motion.facingTarget : -finite(fighter?.facing)
  };
}

function deriveAnimationState(fighter, actor) {
  if (!fighter) return actor?.animationState || 'idle';
  if (fighter.deployAltitude > 0.08) return 'deploy';
  const pose = fighter.currentMove?.id || fighter.pose || fighter.intent || actor?.animationState || 'idle';
  if (fighter.cqc?.mounting || ['mount_top', 'mount_pressure'].includes(pose)) return 'mount_top';
  if (fighter.cqc?.mountedBy || ['mounted_bottom', 'mount_escape_blocked'].includes(pose)) return 'mount_bottom';
  if (fighter.cqc?.grounded || fighter.prone || ['prone', 'down', 'thrown', 'swept_fall'].includes(pose)) return 'prone';
  if (fighter.cqc?.recoilT > 0 || ['recoil', 'hit_react', 'body_hit_react'].includes(pose)) return 'recover';
  if (fighter.currentMove) return moveAnimationStateFor(fighter.currentMove);
  if (fighter.crouch || fighter.shadowHidden) return fighter.lastMove > 0.25 ? 'crouch_walk' : 'crouch';
  if (fighter.lastMove > 0.65) return 'run';
  if (fighter.lastMove > 0.2) return 'walk';
  if (pose === 'idle_guard') return 'idle';
  return pose || 'idle';
}

function moveAnimationStateFor(move) {
  const id = String(move?.id || '').toLowerCase();
  const kind = String(move?.kind || '').toLowerCase();
  if (move?.finisher || id.includes('finisher')) return 'attack_finisher';
  if (id.includes('counter') || kind.includes('counter') || id.includes('parry')) return 'counter';
  if (id.includes('heavy') || id.includes('throw') || id.includes('slam') || id.includes('sweep') || kind.includes('throw')) return 'attack_heavy';
  return 'attack_light';
}

function combatStateFor(fighter) {
  if (!fighter) return 'idle';
  if (fighter.currentMove?.finisher) return 'finisher';
  if (fighter.currentMove) return 'active_move';
  if (fighter.cqc?.recoilT > 0) return 'recoil';
  if (fighter.cqc?.mounting) return 'mount_top';
  if (fighter.cqc?.mountedBy) return 'mount_bottom';
  if (fighter.cqc?.grounded || fighter.prone) return 'grounded';
  if (fighter.incapacitated || fighter.defeated) return 'down';
  return 'ready';
}

function motionStateFor(fighter, speed) {
  if (fighter?.deployAltitude > 0.08) return 'deploy';
  if (fighter?.cqc?.mounting || fighter?.cqc?.mountedBy || fighter?.cqc?.grounded) return 'locked_cqc';
  if (speed > 4.2 || fighter?.lastMove > 0.65) return 'run';
  if (speed > 0.45 || fighter?.lastMove > 0.2) return 'walk';
  return 'idle';
}

function steppedFpsFor(state) {
  if (state === 'idle' || state === 'crouch' || state === 'prone') return 8;
  if (state === 'walk' || state === 'crouch_walk') return 10;
  if (state === 'run') return 12;
  if (state === 'attack_light') return 12;
  if (state === 'attack_heavy' || state === 'attack_finisher' || state === 'counter') return 14;
  if (state === 'mount_top' || state === 'mount_bottom') return 8;
  if (state === 'impact_pause') return 0;
  return 10;
}

function deriveTarget(fighter) {
  return fighter?.memory?.command || fighter?.memory?.navTarget || fighter?.brain?.dest || fighter?.target || null;
}

function normalizeTarget(target) {
  if (!target) return null;
  const point = normalizePoint(target);
  if (!point) return null;
  return { ...point, id: target.id || null, type: target.type || null };
}

function normalizePoint(point) {
  if (!point || !Number.isFinite(point.x) || !Number.isFinite(point.y)) return null;
  return { x: point.x, y: point.y };
}

function debugFlagsFor(fighter) {
  const flags = [];
  if (!fighter) return flags;
  if (fighter.coverPinned) flags.push('cover');
  if (fighter.shadowHidden) flags.push('shadow');
  if (fighter.cqc?.mounting) flags.push('mount_top');
  if (fighter.cqc?.mountedBy) flags.push('mounted');
  if (fighter.cqc?.grounded || fighter.prone) flags.push('grounded');
  if (fighter.stuckFrames > 0) flags.push(`stuck:${fighter.stuckFrames}`);
  if (fighter.extracted) flags.push('extracted');
  return flags;
}

function finite(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}
