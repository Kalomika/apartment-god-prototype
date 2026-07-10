import { updateActorAnimationState3D, applyMicroMotion3D } from './animationState3D.js';

const DEFAULT_ACCEL = 9.5;
const DEFAULT_DECEL = 13.5;
const DEFAULT_TURN = 11.0;

const SCALE_SPEEDS = {
  human: 4.8,
  enhanced: 6.2,
  superhuman: 8.8,
  cosmic: 11.5
};

export function applyActorPresentationMotion3D(world, actor, fighter, dt, options = {}) {
  if (!world || !actor?.group || !fighter) return null;
  const safeDt = Math.min(0.05, Math.max(0, dt || 0));
  const target = options.target || actor.group.position;
  const motion = ensureMotion(actor, target, fighter);
  const locked = options.locked || shouldLockMotion(fighter);

  if (locked || fighter.preview || safeDt <= 0) {
    snapMotion(motion, target, fighter);
    actor.group.position.set(motion.px, motion.py, motion.pz);
    actor.group.rotation.y = motion.facingCurrent;
    updateActorAnimationState3D(actor, fighter, safeDt, motion);
    applyMicroMotion3D(actor, fighter, world.elapsed || 0);
    return motion;
  }

  const dx = target.x - motion.px;
  const dy = target.y - motion.py;
  const dz = target.z - motion.pz;
  const dist = Math.hypot(dx, dz);
  const dirX = dist > 0.0001 ? dx / dist : 0;
  const dirZ = dist > 0.0001 ? dz / dist : 0;
  const maxSpeed = maxPresentationSpeed(fighter);
  const chaseSpeed = dist > 1.2 ? maxSpeed * 1.45 : maxSpeed;
  motion.speedTarget = dist > 0.025 ? Math.min(chaseSpeed, dist / Math.max(0.001, safeDt) * 0.92) : 0;
  const rate = motion.speedTarget > motion.speedCurrent ? accelerationFor(fighter) : decelerationFor(fighter);
  motion.speedCurrent = approach(motion.speedCurrent, motion.speedTarget, rate * safeDt);
  motion.vx = dirX * motion.speedCurrent;
  motion.vy = dy / Math.max(0.001, safeDt);
  motion.vz = dirZ * motion.speedCurrent;
  motion.px += motion.vx * safeDt;
  motion.py = approach(motion.py, target.y, Math.max(0.18, Math.abs(dy)) * 12 * safeDt + 0.02);
  motion.pz += motion.vz * safeDt;

  if (dist < 0.018 && motion.speedTarget <= 0.02) {
    motion.px = target.x;
    motion.pz = target.z;
    motion.vx = 0;
    motion.vz = 0;
    motion.speedCurrent = 0;
  }

  const facingTarget = Number.isFinite(fighter.facing) ? -fighter.facing : motion.facingTarget;
  motion.facingTarget = facingTarget;
  motion.facingCurrent = smoothAngle(motion.facingCurrent, motion.facingTarget, turnRateFor(fighter) * safeDt);

  actor.group.position.set(motion.px, motion.py, motion.pz);
  actor.group.rotation.y = motion.facingCurrent;
  updateActorAnimationState3D(actor, fighter, safeDt, motion);
  applyMicroMotion3D(actor, fighter, world.elapsed || 0);
  return motion;
}

export function snapActorPresentationMotion3D(actor, fighter) {
  if (!actor?.group) return null;
  const motion = ensureMotion(actor, actor.group.position, fighter);
  snapMotion(motion, actor.group.position, fighter);
  actor.group.rotation.y = motion.facingCurrent;
  return motion;
}

function ensureMotion(actor, target, fighter) {
  if (!actor.motion3D) {
    actor.motion3D = {
      px: target.x || 0,
      py: target.y || 0,
      pz: target.z || 0,
      vx: 0,
      vy: 0,
      vz: 0,
      speedTarget: 0,
      speedCurrent: 0,
      facingTarget: Number.isFinite(fighter?.facing) ? -fighter.facing : actor.group.rotation.y || 0,
      facingCurrent: actor.group.rotation.y || (Number.isFinite(fighter?.facing) ? -fighter.facing : 0)
    };
  }
  return actor.motion3D;
}

function snapMotion(motion, target, fighter) {
  motion.px = target.x || 0;
  motion.py = target.y || 0;
  motion.pz = target.z || 0;
  motion.vx = 0;
  motion.vy = 0;
  motion.vz = 0;
  motion.speedTarget = 0;
  motion.speedCurrent = 0;
  motion.facingTarget = Number.isFinite(fighter?.facing) ? -fighter.facing : motion.facingTarget || 0;
  motion.facingCurrent = motion.facingTarget;
}

function shouldLockMotion(fighter) {
  return Boolean(
    fighter?.extracted ||
    fighter?.deployAltitude > 0.08 ||
    fighter?.cqc?.mounting ||
    fighter?.cqc?.mountedBy ||
    fighter?.cqc?.grounded ||
    ['mounted_bottom', 'mount_top', 'mount_pressure', 'ground_punch', 'ground_knife_stab', 'swept_fall', 'thrown', 'down'].includes(fighter?.pose)
  );
}

function maxPresentationSpeed(fighter) {
  const profile = fighter?.profile || fighter?.characterProfile || {};
  const scale = profile.scale || fighter?.scale || 'human';
  const base = SCALE_SPEEDS[scale] || SCALE_SPEEDS.human;
  const statBoost = Number.isFinite(profile.speed) ? 0.75 + profile.speed / 140 : 1;
  const stagePenalty = fighter?.stamina < 20 ? 0.72 : fighter?.bleed?.rate > 0 ? 0.82 : 1;
  return base * statBoost * stagePenalty;
}

function accelerationFor(fighter) {
  const scale = fighter?.profile?.scale || fighter?.scale || 'human';
  return DEFAULT_ACCEL * (scale === 'superhuman' ? 1.35 : scale === 'cosmic' ? 1.6 : scale === 'enhanced' ? 1.15 : 1);
}

function decelerationFor(fighter) {
  const scale = fighter?.profile?.scale || fighter?.scale || 'human';
  return DEFAULT_DECEL * (scale === 'superhuman' ? 1.2 : scale === 'cosmic' ? 1.35 : 1);
}

function turnRateFor(fighter) {
  const scale = fighter?.profile?.scale || fighter?.scale || 'human';
  return DEFAULT_TURN * (scale === 'superhuman' ? 1.25 : scale === 'cosmic' ? 1.45 : 1);
}

function approach(value, target, amount) {
  if (value < target) return Math.min(target, value + amount);
  return Math.max(target, value - amount);
}

function smoothAngle(current, target, amount) {
  const delta = normalizeAngle(target - current);
  if (Math.abs(delta) <= amount) return target;
  return current + Math.sign(delta) * amount;
}

function normalizeAngle(angle) {
  let a = angle;
  while (a > Math.PI) a -= Math.PI * 2;
  while (a < -Math.PI) a += Math.PI * 2;
  return a;
}
