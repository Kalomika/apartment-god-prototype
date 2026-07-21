import * as THREE from '../vendor/three.module.js';
import { installTopShotEffects3D } from '../src/three/effects3D.js';

const previousWindow = globalThis.window;
globalThis.window = { addEventListener() {}, removeEventListener() {} };

try {
  let renderCount = 0;
  const actor = {
    group: new THREE.Group(),
    rig: new THREE.Group(),
    parts: {},
    cqc: {},
    applyPose() {}
  };
  actor.group.add(actor.rig);

  const entity = {
    id: 'A-test',
    team: 'A',
    archetypeId: 'suit_operative',
    x: 200,
    y: 200,
    facing: 0,
    elevation: 1.5,
    deployAltitude: 10,
    preview: false,
    pose: 'parachute',
    anim: 0,
    cqc: {}
  };

  const world = {
    THREE,
    scene: new THREE.Scene(),
    camera: new THREE.PerspectiveCamera(),
    renderer: { render() { renderCount += 1; } },
    markerRoot: new THREE.Group(),
    actors: new Map([[entity.id, actor]]),
    elapsed: 0,
    syncActors() { return [entity]; },
    update(dt, state) {
      this.elapsed += dt;
      this.syncActors(state, dt);
      this.renderer.render(this.scene, this.camera);
    }
  };
  world.scene.add(world.markerRoot, actor.group);

  installTopShotEffects3D(world);
  world.update(1 / 60, { mode: 'match', fighters: [entity], effects: [], pickups: [] });

  if (renderCount !== 1) throw new Error(`Effects pipeline rendered ${renderCount} times instead of once.`);
  const expectedY = entity.elevation + entity.deployAltitude * 0.08;
  if (Math.abs(actor.group.position.y - expectedY) > 0.0001) throw new Error(`Actor deployment height was ${actor.group.position.y}, expected ${expectedY}.`);
  if (actor.group.position.y > 4) throw new Error(`Actor deployment height used raw arena altitude: ${actor.group.position.y}.`);

  console.log('Top Shot render pipeline smoke passed.');
} finally {
  globalThis.window = previousWindow;
}
