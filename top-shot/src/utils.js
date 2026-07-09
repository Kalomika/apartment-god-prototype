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
  const safeMin = finiteOr(min, 0);
  const safeMax = finiteOr(max, safeMin);
  return safeMin + Math.random() * (safeMax - safeMin);
}

export function chance(probability) {
  return Math.random() < clamp(probability, 0, 1);
}

export function dist(a, b) {
  if (!a || !b) return Infinity;
  const ax = finiteOr(a.x, 0);
  const ay = finiteOr(a.y, 0);
  const bx = finiteOr(b.x, ax);
  const by = finiteOr(b.y, ay);
  return Math.hypot(ax - bx, ay - by);
}

export function angleTo(a, b) {
  if (!a || !b) return 0;
  const ax = finiteOr(a.x, 0);
  const ay = finiteOr(a.y, 0);
  const bx = finiteOr(b.x, ax);
  const by = finiteOr(b.y, ay);
  return Math.atan2(by - ay, bx - ax);
}

export function normalizeAngle(angle) {
  if (!Number.isFinite(angle)) return 0;
  while (angle > Math.PI) angle -= Math.PI * 2;
  while (angle < -Math.PI) angle += Math.PI * 2;
  return angle;
}

export function choose(items) {
  if (!Array.isArray(items) || !items.length) return null;
  return items[Math.floor(Math.random() * items.length)];
}

export function pointInRect(point, rect, pad = 0) {
  if (!point || !rect) return false;
  const x = point.x;
  const y = point.y;
  const rx = rect.x;
  const ry = rect.y;
  const rw = rect.w;
  const rh = rect.h;
  const safePad = finiteOr(pad, 0);
  if (![x, y, rx, ry, rw, rh].every(Number.isFinite)) return false;
  return x >= rx - safePad && x <= rx + rw + safePad && y >= ry - safePad && y <= ry + rh + safePad;
}
