export const RingZone = Object.freeze({
  CENTER: 'center_ring',
  NEAR_ROPE: 'near_rope',
  FAR_ROPE: 'far_rope',
  LEFT_ROPE: 'left_rope',
  RIGHT_ROPE: 'right_rope',
  NEAR_LEFT_CORNER: 'near_left_corner',
  NEAR_RIGHT_CORNER: 'near_right_corner',
  FAR_LEFT_CORNER: 'far_left_corner',
  FAR_RIGHT_CORNER: 'far_right_corner',
  FLOOR_HARD_CAM_SIDE: 'floor_hard_cam_side',
  FLOOR_FAR_SIDE: 'floor_far_side',
  ENTRANCE_LANE: 'entrance_lane'
});

export function classifyRingZone(position) {
  const x = position.x ?? 0;
  const z = position.z ?? 0;

  const nearX = Math.abs(x) > 0.78;
  const nearZ = Math.abs(z) > 0.78;

  if (nearX && nearZ) {
    if (x < 0 && z < 0) return RingZone.NEAR_LEFT_CORNER;
    if (x > 0 && z < 0) return RingZone.NEAR_RIGHT_CORNER;
    if (x < 0 && z > 0) return RingZone.FAR_LEFT_CORNER;
    return RingZone.FAR_RIGHT_CORNER;
  }

  if (z < -0.78) return RingZone.NEAR_ROPE;
  if (z > 0.78) return RingZone.FAR_ROPE;
  if (x < -0.78) return RingZone.LEFT_ROPE;
  if (x > 0.78) return RingZone.RIGHT_ROPE;

  return RingZone.CENTER;
}

export function zoneTagsFor(zone) {
  if (zone === RingZone.CENTER) return ['center_ring'];
  if (zone.includes('corner')) return ['corner', 'rope'];
  if (zone.includes('rope')) return ['rope'];
  if (zone.includes('floor')) return ['floor'];
  return ['any'];
}

export function randomStepToward(from, to, step = 0.18) {
  const dx = (to.x ?? 0) - (from.x ?? 0);
  const dz = (to.z ?? 0) - (from.z ?? 0);
  const length = Math.max(0.0001, Math.hypot(dx, dz));

  return {
    x: clampRing((from.x ?? 0) + (dx / length) * step),
    z: clampRing((from.z ?? 0) + (dz / length) * step)
  };
}

export function randomRingPosition() {
  return {
    x: Math.random() * 1.2 - 0.6,
    z: Math.random() * 1.2 - 0.6
  };
}

function clampRing(value) {
  return Math.max(-1, Math.min(1, value));
}
