export function finiteOr(value, fallback = 0) {
  return Number.isFinite(value) ? value : fallback;
}

export function clamp(value, min, max) {
  const safeMin = Number.isFinite(min) ? min : 0;
  const safeMax = Number.isFinite(max) ? max : safeMin;
  const safeValue = Number.isFinite(value) ? value : safeMin;
  return Math.max(safeMin, Math.min(safeMax, safeValue));
}

export function rand(min = 0, max = 1) {
  return min + Math.random() * (max - min);
}

export function chance(probability) {
  return Math.random() < probability;
}

export function dist(a, b) {
  if (!a || !b) return Infinity;
  return Math.hypot(finiteOr(a.x, 0) - finiteOr(b.x, 0), finiteOr(a.y, 0) - finiteOr(b.y, 0));
}

export function angleTo(a, b) {
  return Math.atan2(b.y - a.y, b.x - a.x);
}

export function normalizeAngle(angle) {
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

export function choose(items) {
  return items[Math.floor(Math.random() * items.length)];
}

export function pointInRect(point, rect, pad = 0) {
  return point.x >= rect.x - pad && point.x <= rect.x + rect.w + pad && point.y >= rect.y - pad && point.y <= rect.y + rect.h + pad;
}
