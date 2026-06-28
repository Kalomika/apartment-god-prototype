import { ARENA_H, ARENA_W } from './config.js';
import { blocked, solids } from './arena.js';
import { dist, pointInRect } from './utils.js';

export function nextWaypoint(arena, from, goal) {
  const safeGoal = nearestOpen(arena, goal) || from;
  if (clearSegment(arena, from, safeGoal)) return safeGoal;
  const nodes = buildNodes(arena, from, safeGoal);
  const start = nodes[0];
  const end = nodes[1];
  const path = aStar(arena, nodes, start, end);
  if (path.length > 1) return path[1];
  const progress = nodes
    .slice(2)
    .filter(p => clearSegment(arena, from, p) && dist(p, safeGoal) < dist(from, safeGoal))
    .sort((a, b) => dist(from, a) + dist(a, safeGoal) - (dist(from, b) + dist(b, safeGoal)))[0];
  return progress || escapePoint(arena, from, safeGoal);
}

export function nearestOpen(arena, p) {
  if (!blocked(arena, p, 17)) return clampArenaPoint(p);
  const rings = [28, 48, 72, 104, 140];
  for (const r of rings) {
    for (let i = 0; i < 16; i++) {
      const a = Math.PI * 2 * i / 16;
      const test = clampArenaPoint({ x: p.x + Math.cos(a) * r, y: p.y + Math.sin(a) * r });
      if (!blocked(arena, test, 17)) return test;
    }
  }
  return null;
}

function buildNodes(arena, from, goal) {
  const nodes = [clampArenaPoint(from), clampArenaPoint(goal)];
  const fixed = [
    [118, 360], [842, 360], [180, 160], [180, 360], [180, 560], [320, 160], [320, 360], [320, 560],
    [480, 130], [480, 250], [480, 360], [480, 470], [480, 590],
    [640, 160], [640, 360], [640, 560], [780, 160], [780, 360], [780, 560]
  ];
  for (const [x, y] of fixed) addNode(arena, nodes, { x, y });
  for (const p of arena.weaponSpawns || []) addNode(arena, nodes, p);
  for (const b of solids(arena)) {
    const margin = 40;
    addNode(arena, nodes, { x: b.x - margin, y: b.y - margin });
    addNode(arena, nodes, { x: b.x + b.w + margin, y: b.y - margin });
    addNode(arena, nodes, { x: b.x - margin, y: b.y + b.h + margin });
    addNode(arena, nodes, { x: b.x + b.w + margin, y: b.y + b.h + margin });
    addNode(arena, nodes, { x: b.x + b.w / 2, y: b.y - margin });
    addNode(arena, nodes, { x: b.x + b.w / 2, y: b.y + b.h + margin });
    addNode(arena, nodes, { x: b.x - margin, y: b.y + b.h / 2 });
    addNode(arena, nodes, { x: b.x + b.w + margin, y: b.y + b.h / 2 });
  }
  return unique(nodes);
}

function addNode(arena, nodes, p) {
  const node = nearestOpen(arena, p);
  if (!node) return;
  if (node.x < 62 || node.x > ARENA_W - 62 || node.y < 62 || node.y > ARENA_H - 62) return;
  if (!nodes.some(n => dist(n, node) < 18)) nodes.push(node);
}

function unique(nodes) {
  const out = [];
  for (const n of nodes) if (!out.some(o => dist(o, n) < 14)) out.push(n);
  return out;
}

function aStar(arena, nodes, start, end) {
  const open = new Set([0]);
  const came = new Map();
  const g = new Map([[0, 0]]);
  const f = new Map([[0, dist(start, end)]]);
  const endIndex = 1;
  let guard = 0;
  while (open.size && guard++ < 300) {
    const current = [...open].sort((a, b) => (f.get(a) ?? Infinity) - (f.get(b) ?? Infinity))[0];
    if (current === endIndex) return reconstruct(came, nodes, current);
    open.delete(current);
    for (let i = 0; i < nodes.length; i++) {
      if (i === current) continue;
      const cost = edgeCost(arena, nodes[current], nodes[i]);
      if (!Number.isFinite(cost)) continue;
      const trial = (g.get(current) ?? Infinity) + cost;
      if (trial >= (g.get(i) ?? Infinity)) continue;
      came.set(i, current);
      g.set(i, trial);
      f.set(i, trial + dist(nodes[i], end));
      open.add(i);
    }
  }
  return [];
}

function reconstruct(came, nodes, current) {
  const path = [nodes[current]];
  while (came.has(current)) {
    current = came.get(current);
    path.unshift(nodes[current]);
  }
  return path;
}

function edgeCost(arena, a, b) {
  const d = dist(a, b);
  if (d > 260) return Infinity;
  if (!clearSegment(arena, a, b)) return Infinity;
  return d;
}

function clearSegment(arena, a, b) {
  const steps = Math.max(2, Math.ceil(dist(a, b) / 10));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const p = { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
    if (solids(arena).some(box => pointInRect(p, box, 17))) return false;
  }
  return true;
}

function escapePoint(arena, from, goal) {
  const away = Math.atan2(from.y - goal.y, from.x - goal.x);
  const options = [0, 0.8, -0.8, 1.6, -1.6, Math.PI].map(o => nearestOpen(arena, { x: from.x + Math.cos(away + o) * 95, y: from.y + Math.sin(away + o) * 95 })).filter(Boolean);
  return options.sort((a, b) => dist(from, b) - dist(from, a))[0] || from;
}

function clampArenaPoint(p) {
  return { x: Math.max(64, Math.min(ARENA_W - 64, p.x)), y: Math.max(64, Math.min(ARENA_H - 64, p.y)) };
}
