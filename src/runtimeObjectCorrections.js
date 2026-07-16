import { objects } from './world.js';
import { applyPanicRoomCorrection } from './panicRoomCorrection.js';

const VEHICLE_KINDS = new Set(['car', 'bike', 'motorbike', 'atv']);
const COLLISION_KIND = 'soccer_field';

export function applyRuntimeObjectCorrections() {
  patchObject('sink', { x: 716, y: 98, w: 44, h: 54, solid: true, enterable: false, facing: 'west' });
  patchObject('dining_table', { x: 498, y: 230, w: 174, h: 58, solid: true, enterable: false });

  for (const id of [
    'couch', 'office_couch', 'basement_couch', 'bed', 'lab_bed', 'lab_pose_chair',
    'shower', 'toilet', 'master_shower', 'master_toilet', 'master_bathtub',
    'lab_shower', 'lab_toilet'
  ]) patchObject(id, { solid: true, enterable: false });

  for (const id of ['treadmill', 'weight_bench', 'heavy_bag', 'lab_treadmill', 'lab_weight_bench', 'lab_heavy_bag']) {
    patchObject(id, { solid: true, enterable: false });
  }

  applyPanicRoomCorrection();
  syncVehicleCollisionBlocks();
}

function patchObject(id, patch) {
  const obj = objects.find(o => o.id === id);
  if (obj) Object.assign(obj, patch);
}

function syncVehicleCollisionBlocks() {
  const vehicles = objects.filter(o => VEHICLE_KINDS.has(o.kind) && !o.collisionOnly);
  for (const vehicle of vehicles) {
    const id = `collision_${vehicle.id}`;
    let blocker = objects.find(o => o.id === id);
    if (!blocker) {
      blocker = {
        id,
        label: `${vehicle.label || vehicle.id} collision`,
        kind: COLLISION_KIND,
        floor: vehicle.floor,
        room: vehicle.room,
        x: vehicle.x,
        y: vehicle.y,
        w: vehicle.w,
        h: vehicle.h,
        solid: true,
        enterable: false,
        collisionOnly: true
      };
      objects.unshift(blocker);
    }
    Object.assign(blocker, {
      floor: vehicle.floor,
      room: vehicle.room,
      x: vehicle.x,
      y: vehicle.y,
      w: vehicle.w,
      h: vehicle.h,
      solid: true,
      enterable: false,
      collisionOnly: true
    });
  }
}

applyRuntimeObjectCorrections();
