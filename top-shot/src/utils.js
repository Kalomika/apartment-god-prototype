export function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export function rand(min = 0, max = 1) {
  return min + Math.random() * (max - min);
}

export function chance(probability) {
  return Math.random() < probability;
}

export function dist(a, b) {
  return Math.hypot(a.x - b.x, a.y - b.y);
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
