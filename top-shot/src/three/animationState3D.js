const ATTACK_HEAVY = new Set(['right_cross', 'right_body_hook', 'right_kick', 'roundhouse', 'right_sweep', 'inside_trip', 'judo_throw', 'gun_butt', 'ground_punch', 'ground_knife_stab']);
const ATTACK_LIGHT = new Set(['left_jab', 'left_elbow', 'right_elbow', 'left_knee', 'right_knee', 'left_kick', 'knife_jab', 'knife_stab', 'pistol', 'burst']);
const COUNTERS = new Set(['block_left', 'block_right', 'parry_left', 'parry_right', 'cross_block_left', 'cross_block_right', 'slip_left', 'slip_right', 'disarm_twist']);

export function updateActorAnimationState3D(actor, fighter, dt, motion = null) {
  if (!actor) return null;
  const previous = actor.anim?.state || actor.animationState || 'idle';
  const next = deriveAnimationState(fighter, motion, previous);
  const changed = next !== previous;
  actor.anim = {
    ...(actor.anim || {}),
    prevState: changed ? previous : actor.anim?.prevState || previous,
    state: next,
    t: changed ? 0 : (actor.anim?.t || 0) + Math.max(0, dt || 0),
    subState: deriveSubState(fighter),
    speed: motion?.speedCurrent || 0,
    speedTarget: motion?.speedTarget || 0,
    velocity: motion ? { x: motion.vx || 0, y: motion.vy || 0, z: motion.vz || 0 } : actor.anim?.velocity || { x: 0, y: 0, z: 0 }
  };
  return actor.anim;
}

export function deriveAnimationState(fighter, motion = null, previous = 'idle') {
  if (!fighter) return 'idle';
  const action = fighter.currentMove?.id || fighter.currentMove?.kind || fighter.pose || fighter.intent || '';
  if (fighter.deployAltitude > 0.08) return 'deploy';
  if (fighter.cqc?.mounting || ['mount_top', 'mount_pressure'].includes(action)) return 'mount_top';
  if (fighter.cqc?.mountedBy || ['mounted_bottom', 'mount_escape_blocked'].includes(action)) return 'mount_bottom';
  if (fighter.cqc?.grounded || fighter.prone || ['prone', 'down', 'thrown', 'swept_fall', 'grounded_back', 'grounded_side'].includes(action)) return 'prone';
  if (COUNTERS.has(action)) return 'counter';
  if (ATTACK_HEAVY.has(action)) return fighter.currentMove?.finisher ? 'attack_finisher' : 'attack_heavy';
  if (ATTACK_LIGHT.has(action) || fighter.currentMove) return 'attack_light';
  if (fighter.crouch || fighter.shadowHidden) return fighter.lastMove > 0.25 ? 'crouch_walk' : 'crouch';
  if (fighter.cqc?.recoilT > 0 || action.startsWith?.('hit_') || action.includes?.('react')) return 'impact_pause';
  const speed = motion?.speedCurrent ?? fighter.lastMove ?? 0;
  if (speed > 4.2 || fighter.lastMove > 0.65 || ['run', 'rush', 'limp_run'].includes(action)) return 'run';
  if (speed > 0.45 || fighter.lastMove > 0.2 || ['walk', 'wall_strafe', 'careful_walk', 'pressure_step', 'step_back'].includes(action)) return 'walk';
  if (['walk', 'run'].includes(previous) && speed > 0.08) return 'halt';
  return 'idle';
}

function deriveSubState(fighter) {
  if (!fighter) return 'none';
  if (fighter.memory?.command?.type) return `coach:${fighter.memory.command.type}`;
  if (fighter.brain?.intent) return `brain:${fighter.brain.intent}`;
  if (fighter.intent) return `intent:${fighter.intent}`;
  return 'none';
}

export function applyMicroMotion3D(actor, fighter, clock = 0) {
  if (!actor?.parts || !actor.anim) return;
  if (!['idle', 'crouch', 'crouch_walk', 'prone', 'mount_top', 'mount_bottom'].includes(actor.anim.state)) return;
  const t = clock + (actor.anim.t || 0);
  const breath = Math.sin(t * 2.2) * 0.012;
  const sway = Math.sin(t * 1.35) * 0.018;
  const alert = fighter?.awareness?.phase === 'alert' || fighter?.currentMove ? 0.45 : 1;
  if (actor.parts.torso) actor.parts.torso.position.y += breath * alert;
  if (actor.parts.waist) actor.parts.waist.rotation.z += sway * 0.55 * alert;
  if (actor.parts.shoulders) actor.parts.shoulders.rotation.z += sway * alert;
  if (actor.parts.head) actor.parts.head.rotation.y += Math.sin(t * 0.9) * 0.025 * alert;
  if (actor.detail?.tie) actor.detail.tie.rotation.z += sway * 1.4;
  if (actor.detail?.bandana) actor.detail.bandana.rotation.z += sway * 2.1;
}
