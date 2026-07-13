import { ARENA_H, ARENA_W } from '../config.js';
import { installTopShotDebugOverlay3D } from './debugOverlay3D.js';

const MAP_W = 34;
const MAP_D = 25.5;

export function installTopShotEffects3D(world) {
  if (!world || world.__topShotEffectsInstalled) return world;
  world.__topShotEffectsInstalled = true;
  world.effectMeshes = new Map();
  world.parachutes = new Map();

  const baseSyncActors = world.syncActors.bind(world);
  world.syncActors = function syncActorsWithDeployment(state, dt) {
    const entities = baseSyncActors(state, dt);
    if (state?.mode === 'cqc') anchorCqcPairs(this, state, entities);
    for (const entity of entities) {
      const actor = this.actors.get(entity.id);
      if (!actor) continue;
      const altitude = entity.deployAltitude || 0;
      actor.group.position.y = actor.group.position.y || altitude;
      actor.group.scale.setScalar((entity.preview ? 1.14 : 1.2) * (altitude > 0 ? 0.94 : 1));
      if (state?.mode === 'cqc') stabilizeCqcActor(actor, entity);
      syncParachute(this, entity, actor.group.position, altitude);
    }
    for (const [id, chute] of this.parachutes) {
      if (entities.some(entity => entity.id === id && (entity.deployAltitude || 0) > 0.08)) continue;
      this.markerRoot.remove(chute);
      disposeObject(chute);
      this.parachutes.delete(id);
    }
    return entities;
  };

  const baseUpdate = world.update.bind(world);
  world.update = function updateWithEffects(dt, state) {
    baseUpdate(dt, state);
    syncEffectMeshes(this, state);
    this.renderer.render(this.scene, this.camera);
  };

  installTopShotDebugOverlay3D(world);

  return world;
}

function anchorCqcPairs(world, state, entities) {
  const mounted = entities.find(entity => entity.cqc?.mounting);
  if (mounted) {
    const bottom = entities.find(entity => entity.id === mounted.cqc.mounting);
    const topActor = world.actors.get(mounted.id);
    const bottomActor = world.actors.get(bottom?.id);
    if (bottom && topActor && bottomActor) {
      const base = arenaToWorld(bottom.x, bottom.y);
      const facing = bottom.facing || 0;
      const forward = { x: Math.cos(facing), z: Math.sin(facing) };
      const side = { x: -forward.z, z: forward.x };
      bottomActor.group.position.set(base.x, 0, base.z);
      bottomActor.group.rotation.y = -facing;
      bottomActor.rig.rotation.set(-Math.PI / 2, 0, 0);
      bottomActor.rig.position.y = 0.18;
      bottomActor.applyPose?.('prone', 0, { ...bottom, pose: 'mounted_bottom', currentMove: null, lastMove: 0, prone: true });
      hideCqcWeapon(bottomActor, bottom);

      topActor.group.position.set(base.x - forward.x * 0.34 + side.x * 0.18, 0.62, base.z - forward.z * 0.34 + side.z * 0.18);
      topActor.group.rotation.y = -facing;
      topActor.rig.rotation.set(0.16, 0, 0);
      topActor.rig.position.y = 0.08;
      topActor.applyPose?.('crouch', 0, { ...mounted, pose: 'mount_top', currentMove: null, lastMove: 0, crouch: true });
      hideCqcWeapon(topActor, mounted);
    }
    return;
  }

  for (const entity of entities) {
    if (!entity.cqc?.grounded && !['grounded_back', 'grounded_side', 'swept_fall', 'thrown', 'mounted_bottom', 'down'].includes(entity.pose)) continue;
    const actor = world.actors.get(entity.id);
    if (!actor) continue;
    const p = arenaToWorld(entity.x, entity.y);
    actor.group.position.set(p.x, 0, p.z);
    actor.group.rotation.y = -(entity.facing || 0);
    actor.rig.rotation.set(-Math.PI / 2, 0, 0);
    actor.rig.position.y = 0.18;
    actor.applyPose?.('prone', 0, { ...entity, pose: 'prone', currentMove: null, lastMove: 0, prone: true });
    hideCqcWeapon(actor, entity);
  }
}

function stabilizeCqcActor(actor, entity) {
  const action = entity.currentMove?.id || entity.pose || '';
  const activeStrike = ['left_jab', 'right_cross', 'left_elbow', 'right_elbow', 'left_knee', 'right_knee', 'left_kick', 'right_kick', 'roundhouse', 'headbutt', 'right_body_hook', 'right_sweep', 'inside_trip', 'two_hand_grab', 'judo_throw'].some(move => action.includes(move));
  const weaponAction = ['pistol', 'burst', 'slash', 'knife', 'sword', 'blade', 'gun_butt'].some(move => action.includes(move));
  const grounded = entity.cqc?.grounded || entity.cqc?.mountedBy || ['grounded_back', 'grounded_side', 'swept_fall', 'thrown', 'mounted_bottom', 'down'].includes(entity.pose);
  const mountedTop = Boolean(entity.cqc?.mounting || ['mount_top', 'mount_pressure', 'ground_punch', 'ground_knife_stab'].includes(action));

  if (grounded || mountedTop) {
    hideCqcWeapon(actor, entity, weaponAction);
    return;
  }

  if (!activeStrike && ['idle_guard', 'guard', 'cqc_lab', 'cqc_auto', 'pressure_step'].includes(action || entity.intent)) {
    actor.rig.rotation.set(0, 0, 0);
    actor.rig.position.y = 0;
    actor.applyPose?.('idle', 0, { ...entity, pose: 'idle_guard', currentMove: null, lastMove: 0 });
  }

  hideCqcWeapon(actor, entity, weaponAction);
}

function hideCqcWeapon(actor, entity, weaponAction = false) {
  if (actor.weapon) actor.weapon.visible = weaponAction;
  if (actor.parts?.tie && entity.archetypeId === 'survival_commando') actor.parts.tie.visible = false;
}

function syncParachute(world, entity, actorPos, altitude) {
  if (altitude <= 0.08) return;
  const THREE = world.THREE;
  let chute = world.parachutes.get(entity.id);
  if (!chute) {
    chute = new THREE.Group();
    const canopy = new THREE.Mesh(
      new THREE.SphereGeometry(0.82, 20, 8, 0, Math.PI * 2, 0, Math.PI * 0.52),
      new THREE.MeshBasicMaterial({ color: entity.team === 'A' ? '#d8e7ff' : '#e2d2b6', transparent: true, opacity: 0.82, depthWrite: false })
    );
    canopy.scale.set(1.55, 0.42, 1.0);
    const cordMat = new THREE.LineBasicMaterial({ color: '#f2e6cf', transparent: true, opacity: 0.56 });
    for (const offset of [-0.42, 0.42]) {
      const cordGeo = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(offset, -0.08, -0.32), new THREE.Vector3(offset * 0.22, -1.8, -0.06)]);
      chute.add(new THREE.Line(cordGeo, cordMat));
      const cordGeo2 = new THREE.BufferGeometry().setFromPoints([new THREE.Vector3(offset, -0.08, 0.32), new THREE.Vector3(offset * 0.22, -1.8, 0.06)]);
      chute.add(new THREE.Line(cordGeo2, cordMat));
    }
    chute.add(canopy);
    world.parachutes.set(entity.id, chute);
    world.markerRoot.add(chute);
  }
  chute.position.set(actorPos.x, actorPos.y + 2.25 + altitude * 0.08, actorPos.z);
  chute.rotation.y = Math.sin(entity.anim * 0.18) * 0.18;
  chute.scale.setScalar(Math.max(0.22, Math.min(1, altitude / 7)));
}

function syncEffectMeshes(world, state) {
  const active = new Set();
  for (const effect of state.effects || []) {
    if (!['muzzle_flash', 'impact_flash', 'landing_flash', 'tracer', 'suppression'].includes(effect.type)) continue;
    const key = effect.__fxKey || (effect.__fxKey = `${effect.type}:${Math.round(effect.x)}:${Math.round(effect.y)}:${Math.random().toString(36).slice(2)}`);
    active.add(key);
    let mesh = world.effectMeshes.get(key);
    if (!mesh) {
      mesh = createEffect(world, effect);
      world.effectMeshes.set(key, mesh);
      world.markerRoot.add(mesh);
    }
    updateEffect(world, mesh, effect);
  }
  for (const [key, mesh] of world.effectMeshes) {
    if (active.has(key)) continue;
    world.markerRoot.remove(mesh);
    disposeObject(mesh);
    world.effectMeshes.delete(key);
  }
}

function createEffect(world, effect) {
  const THREE = world.THREE;
  if (effect.type === 'tracer' || effect.type === 'suppression') {
    const material = new THREE.LineBasicMaterial({ color: effect.type === 'suppression' ? '#79ddff' : '#fff4b2', transparent: true, opacity: 0.95 });
    return new THREE.Line(new THREE.BufferGeometry(), material);
  }
  const color = effect.type === 'muzzle_flash' ? '#fff1a3' : effect.type === 'impact_flash' ? '#fff6d8' : '#f0d36a';
  return new THREE.Mesh(
    new THREE.PlaneGeometry(0.62, 0.62),
    new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 1, depthWrite: false })
  );
}

function updateEffect(world, mesh, effect) {
  const alpha = Math.max(0, Math.min(1, effect.ttl * (effect.type === 'tracer' ? 12 : 18)));
  if (mesh.isLine) {
    const a = arenaToWorld(effect.x, effect.y);
    const b = arenaToWorld(effect.x2 ?? effect.x, effect.y2 ?? effect.y);
    mesh.geometry.dispose();
    mesh.geometry = new world.THREE.BufferGeometry().setFromPoints([
      new world.THREE.Vector3(a.x, 0.72, a.z),
      new world.THREE.Vector3(b.x, 0.72, b.z)
    ]);
    mesh.material.opacity = effect.type === 'suppression' ? alpha * 0.35 : alpha * 0.78;
    return;
  }
  const p = arenaToWorld(effect.x, effect.y);
  const lift = effect.type === 'muzzle_flash' ? 1.08 : effect.type === 'impact_flash' ? 0.74 : 0.22;
  const scale = effect.type === 'landing_flash' ? 2.2 : effect.type === 'impact_flash' ? 1.45 : 1.0;
  mesh.position.set(p.x, lift, p.z);
  mesh.quaternion.copy(world.camera.quaternion);
  mesh.rotation.z += effect.type === 'muzzle_flash' ? Math.PI * 0.25 : 0;
  mesh.scale.setScalar(Math.max(0.08, alpha * scale));
  mesh.material.opacity = alpha;
}

function arenaToWorld(x, y) {
  return {
    x: (x / ARENA_W - 0.5) * MAP_W,
    z: (y / ARENA_H - 0.5) * MAP_D
  };
}

function disposeObject(object) {
  object.traverse?.(child => {
    child.geometry?.dispose?.();
    if (Array.isArray(child.material)) child.material.forEach(material => material.dispose?.());
    else child.material?.dispose?.();
  });
}
