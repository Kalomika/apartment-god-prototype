import { blocked } from '../src/arena.js';
import { createCqcLabState, triggerCqcAction, updateCqcLab } from '../src/cqcLab.js';

const state = createCqcLabState('suit_operative', 'survival_commando');
const [a, b] = state.fighters;

assertCqcIntegrity(state, 'initial spawn');

triggerAndStep(state, 'body_shot', 20);
if (!state.lab.lastHitZone) throw new Error('Body shot did not record a hit zone.');
if (!['liver', 'gut', 'ribs', 'solar_plexus', 'chest', 'kidney', 'back'].includes(state.lab.lastHitZone)) throw new Error(`Body shot hit unexpected zone: ${state.lab.lastHitZone}`);
if (!b.cqc?.lastZone) throw new Error('Body shot did not update defender CQC last zone.');

triggerAndStep(state, 'reset', 12);
triggerAndStep(state, 'sweep', 24);
if (!b.cqc?.grounded && !['swept_fall', 'grounded_back', 'grounded_side', 'down'].includes(b.pose)) throw new Error(`Sweep did not ground or visibly destabilize defender. pose=${b.pose}`);

triggerAndStep(state, 'mount', 24);
assertMountIntegrity(state, 'manual mount');

triggerAndStep(state, 'ground_punch', 20);
assertMountIntegrity(state, 'ground punch from mount');

triggerAndStep(state, 'ground_knife', 20);
assertMountIntegrity(state, 'ground knife from mount');

triggerAndStep(state, 'escape_mount', 28);
assertCqcIntegrity(state, 'escape mount');

triggerAndStep(state, 'reset', 20);

for (const action of ['jab', 'cross', 'kick', 'trip', 'grab', 'throw', 'headbutt', 'knife_attack', 'gun_butt', 'disarm', 'limb_grab', 'jump_attack', 'block', 'parry', 'slip_left', 'slip_right', 'step_back']) {
  triggerAndStep(state, action, 20);
}

triggerCqcAction(state, 'auto');
for (let i = 0; i < 360; i++) {
  updateCqcLab(state, 1 / 60);
  assertCqcIntegrity(state, `auto frame ${i}`);
}

if (!state.lab.auto) throw new Error('Auto CQC did not stay enabled.');
if (!state.log.length) throw new Error('CQC log did not record exchanges.');
if (!Array.isArray(a.hitboxes) || !a.hitboxes.find(hitbox => hitbox.id === 'collision_core')) throw new Error('CQC hitboxes were not generated for Fighter A.');
if (!Array.isArray(b.hitboxes) || !b.hitboxes.find(hitbox => hitbox.id === 'collision_core')) throw new Error('CQC hitboxes were not generated for Fighter B.');

console.log(`CQC smoke passed with ${state.log.length} log entries. Latest: ${state.log[0]}`);

function triggerAndStep(state, action, frames = 20) {
  const ok = triggerCqcAction(state, action);
  if (!ok) throw new Error(`CQC action failed: ${action}`);
  for (let i = 0; i < frames; i++) {
    updateCqcLab(state, 1 / 60);
    assertCqcIntegrity(state, `${action} frame ${i}`);
  }
}

function assertCqcIntegrity(state, context) {
  if (!Number.isFinite(state.clock)) throw new Error(`CQC clock became invalid during ${context}.`);
  for (const fighter of state.fighters) assertFighterIntegrity(state, fighter, context);
}

function assertFighterIntegrity(state, fighter, context) {
  if (blocked(state.arena, fighter, 30)) throw new Error(`${fighter.name} entered blocked prop space during ${context} at ${Math.round(fighter.x)},${Math.round(fighter.y)}.`);
  for (const key of ['x', 'y', 'facing', 'hp', 'stamina', 'block', 'dodge', 'downT', 'dizzyT', 'lastMove']) {
    if (!Number.isFinite(fighter[key])) throw new Error(`${fighter.name}.${key} became invalid during ${context}: ${fighter[key]}`);
  }
  if (fighter.hp < 0 || fighter.hp > 100) throw new Error(`${fighter.name}.hp out of range during ${context}: ${fighter.hp}`);
  if (fighter.stamina < 0 || fighter.stamina > 100) throw new Error(`${fighter.name}.stamina out of range during ${context}: ${fighter.stamina}`);
  if (!fighter.cqc) throw new Error(`${fighter.name} missing cqc state during ${context}.`);
  for (const key of ['groundedT', 'disarmedT', 'recoilX', 'recoilY', 'recoilT', 'coreRadius']) {
    if (!Number.isFinite(fighter.cqc[key])) throw new Error(`${fighter.name}.cqc.${key} became invalid during ${context}: ${fighter.cqc[key]}`);
  }
  for (const hitbox of fighter.hitboxes || []) {
    if (!Number.isFinite(hitbox.x) || !Number.isFinite(hitbox.y) || !Number.isFinite(hitbox.radius)) throw new Error(`${fighter.name} has invalid hitbox during ${context}.`);
  }
}

function assertMountIntegrity(state, context) {
  assertCqcIntegrity(state, context);
  const mounted = state.fighters.find(f => f.cqc?.mountedBy);
  const top = state.fighters.find(f => f.cqc?.mounting === mounted?.id);
  if (!mounted || !top) throw new Error(`Mount was not locked during ${context}.`);
  const distance = Math.hypot(top.x - mounted.x, top.y - mounted.y);
  if (distance > 48) throw new Error(`Mounted fighter is too far from body during ${context}: ${distance.toFixed(1)}.`);
  if (distance < 4) throw new Error(`Mounted fighter is clipping through body center during ${context}: ${distance.toFixed(1)}.`);
  if (!mounted.prone && !mounted.cqc.grounded) throw new Error(`Mounted bottom is not grounded during ${context}.`);
  if (!['mount_top', 'mount_pressure', 'ground_punch', 'ground_knife_stab'].includes(top.pose)) throw new Error(`Top fighter has unexpected mount pose during ${context}: ${top.pose}.`);
}
