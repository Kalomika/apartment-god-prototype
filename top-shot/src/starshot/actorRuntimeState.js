export function createActorRuntimeState(fighter, actor = null, context = {}) {
  const profile = fighter?.profile || fighter?.characterProfile || null;
  const motion = actor?.motion3D || fighter?.motion || null;
  const animation = actor?.anim || { state: actor?.animationState || poseStateFor(fighter), t: 0 };
  const currentMove = fighter?.currentMove || null;
  const target = deriveTarget(fighter);

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
      state: animation?.state || actor?.animationState || poseStateFor(fighter),
      prevState: animation?.prevState || null,
      subState: animation?.subState || null,
      t: Number.isFinite(animation?.t) ? animation.t : 0,
      steppedFps: steppedFpsFor(animation?.state || actor?.animationState || poseStateFor(fighter))
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
      grounded: Boolean(fighter?.cqc?.grounded || fighter?.prone)
    },
    ai: {
      intent: fighter?.brain?.intent || fighter?.intent || 'idle',
      command: fighter?.memory?.command?.type || null,
      target: target ? { x: target.x, y: target.y, id: target.id || null, type: target.type || null } : null,
      lastSeen: fighter?.memory?.lastSeen ? { x: fighter.memory.lastSeen.x, y: fighter.memory.lastSeen.y } : null,
      awareness: fighter?.awareness?.phase || null,
      stuckFrames: fighter?.stuckFrames || 0
    },
    arena: {
      x: fighter?.x || 0,
      y: fighter?.y || 0,
      facing: fighter?.facing || 0,
      coverPinned: Boolean(fighter?.coverPinned),
      shadowHidden: Boolean(fighter?.shadowHidden),
      deployAltitude: fighter?.deployAltitude || 0
    },
    rendering: {
      visible: actor?.group ? actor.group.visible !== false : !fighter?.extracted,
      actorState: actor?.animationState || null,
      style: context.renderStyle || 'default'
    },
    timing: context.timing?.snapshot?.() || context.timing || { profile: 'real_time', scale: 1 },
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
  const vx = motion?.vx || 0;
  const vy = motion?.vy || 0;
  const vz = motion?.vz || 0;
  const speedCurrent = motion?.speedCurrent ?? Math.hypot(vx, vz) ?? fighter?.lastMove ?? 0;
  return {
    state: motionStateFor(fighter, speedCurrent),
    vx,
    vy,
    vz,
    speedCurrent,
    speedTarget: motion?.speedTarget || 0,
    facingCurrent: motion?.facingCurrent ?? -(fighter?.facing || 0),
    facingTarget: motion?.facingTarget ?? -(fighter?.facing || 0)
  };
}

function poseStateFor(fighter) {
  if (!fighter) return 'idle';
  const pose = fighter.currentMove?.id || fighter.pose || fighter.intent || 'idle';
  if (fighter.deployAltitude > 0.08) return 'deploy';
  if (fighter.cqc?.mounting || ['mount_top', 'mount_pressure'].includes(pose)) return 'mount_top';
  if (fighter.cqc?.mountedBy || ['mounted_bottom', 'mount_escape_blocked'].includes(pose)) return 'mount_bottom';
  if (fighter.cqc?.grounded || fighter.prone || ['prone', 'down', 'thrown', 'swept_fall'].includes(pose)) return 'prone';
  if (fighter.crouch || fighter.shadowHidden) return fighter.lastMove > 0.25 ? 'crouch_walk' : 'crouch';
  if (fighter.lastMove > 0.65) return 'run';
  if (fighter.lastMove > 0.2) return 'walk';
  return pose || 'idle';
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
  if (['attack_light', 'attack_heavy', 'attack_finisher', 'counter'].includes(state)) return 12;
  if (['mount_top', 'mount_bottom'].includes(state)) return 8;
  if (state === 'impact_pause') return 0;
  return 10;
}

function deriveTarget(fighter) {
  return fighter?.memory?.command || fighter?.memory?.navTarget || fighter?.brain?.dest || fighter?.target || null;
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
