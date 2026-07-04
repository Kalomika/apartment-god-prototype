import { PLAY_H, PLAY_W } from './config.js';

export const floors = [
  {
    id: 0,
    name: 'Floor 1',
    rooms: [
      { id: 'living', name: 'Living Room', x: 24, y: 36, w: 416, h: 292 },
      { id: 'kitchen', name: 'Kitchen', x: 456, y: 36, w: 318, h: 292 },
      { id: 'bath', name: 'Bathroom', x: 790, y: 36, w: 146, h: 292 },
      { id: 'entry', name: 'Entry', x: 24, y: 344, w: 690, h: 174 },
      { id: 'stairs', name: 'Stairs', x: 720, y: 344, w: 216, h: 340 }
    ]
  },
  {
    id: 1,
    name: 'Floor 2',
    rooms: [
      { id: 'bedroom', name: 'Bedroom', x: 24, y: 36, w: 440, h: 340 },
      { id: 'office', name: 'Office', x: 480, y: 36, w: 284, h: 340 },
      { id: 'bath2', name: 'Upstairs Bath', x: 780, y: 36, w: 156, h: 340 },
      { id: 'hall', name: 'Hall', x: 24, y: 392, w: 912, h: 126 },
      { id: 'stairs2', name: 'Stairs', x: 720, y: 534, w: 216, h: 150 }
    ]
  },
  {
    id: 2,
    name: 'Basement Game Room',
    rooms: [
      { id: 'basement_game', name: 'Game Room', x: 24, y: 36, w: 500, h: 430 },
      { id: 'basement_media', name: 'Console Nook', x: 540, y: 36, w: 396, h: 210 },
      { id: 'basement_utility', name: 'Utility / Storage', x: 540, y: 262, w: 396, h: 204 },
      { id: 'basement_stairs', name: 'Basement Stairs', x: 720, y: 534, w: 216, h: 150 }
    ]
  }
];

export const objects = [
  { id: 'couch', label: 'Couch', kind: 'couch', floor: 0, room: 'living', x: 74, y: 176, w: 154, h: 62, solid: true },
  { id: 'tv', label: 'TV', kind: 'tv', floor: 0, room: 'living', x: 292, y: 82, w: 92, h: 36, solid: true },
  { id: 'stereo', label: 'Stereo', kind: 'stereo', floor: 0, room: 'living', x: 320, y: 130, w: 58, h: 34, solid: true },
  { id: 'fridge', label: 'Fridge', kind: 'fridge', floor: 0, room: 'kitchen', x: 488, y: 70, w: 58, h: 88, solid: true },
  { id: 'stove', label: 'Stove', kind: 'stove', floor: 0, room: 'kitchen', x: 598, y: 70, w: 72, h: 64, solid: true },
  { id: 'sink', label: 'Sink', kind: 'sink', floor: 0, room: 'kitchen', x: 690, y: 78, w: 54, h: 48, solid: true },
  { id: 'shower', label: 'Shower', kind: 'shower', floor: 0, room: 'bath', x: 806, y: 70, w: 60, h: 88, solid: true, enterable: true },
  { id: 'toilet', label: 'Toilet', kind: 'toilet', floor: 0, room: 'bath', x: 878, y: 212, w: 44, h: 54, solid: true, enterable: true },
  { id: 'door', label: 'Front Door', kind: 'door', floor: 0, room: 'entry', x: 50, y: 386, w: 42, h: 96, solid: false },
  { id: 'basement_door', label: 'Basement Door', kind: 'stairs', floor: 0, room: 'stairs', x: 642, y: 390, w: 52, h: 92, solid: false, toFloor: 2, exitId: 'basement_stairs_up' },
  { id: 'dog_bowl', label: 'Dog Bowl', kind: 'dog_bowl', floor: 0, room: 'kitchen', x: 558, y: 256, w: 36, h: 26, solid: false },
  { id: 'light_living', label: 'Living Light', kind: 'light', floor: 0, room: 'living', x: 408, y: 52, w: 22, h: 22, solid: false },
  { id: 'stairs_down', label: 'Upstairs Stairs', kind: 'stairs', floor: 0, room: 'stairs', x: 766, y: 554, w: 118, h: 84, solid: false, toFloor: 1, exitId: 'stairs_up' },
  { id: 'bed', label: 'Bed', kind: 'bed', floor: 1, room: 'bedroom', x: 82, y: 98, w: 190, h: 112, solid: true, enterable: true },
  { id: 'desk', label: 'Laptop Desk', kind: 'desk', floor: 1, room: 'office', x: 552, y: 96, w: 122, h: 66, solid: true },
  { id: 'shower2', label: 'Upstairs Shower', kind: 'shower', floor: 1, room: 'bath2', x: 798, y: 72, w: 62, h: 90, solid: true, enterable: true },
  { id: 'toilet2', label: 'Upstairs Toilet', kind: 'toilet', floor: 1, room: 'bath2', x: 880, y: 222, w: 44, h: 54, solid: true, enterable: true },
  { id: 'light_bedroom', label: 'Bedroom Light', kind: 'light', floor: 1, room: 'bedroom', x: 430, y: 52, w: 22, h: 22, solid: false },
  { id: 'stairs_up', label: 'Downstairs Stairs', kind: 'stairs', floor: 1, room: 'stairs2', x: 766, y: 554, w: 118, h: 84, solid: false, toFloor: 0, exitId: 'stairs_down' },
  { id: 'basement_stairs_up', label: 'Main Floor Stairs', kind: 'stairs', floor: 2, room: 'basement_stairs', x: 766, y: 554, w: 118, h: 84, solid: false, toFloor: 0, exitId: 'basement_door' },
  { id: 'pool_table', label: 'Pool Table', kind: 'pool_table', floor: 2, room: 'basement_game', x: 128, y: 142, w: 250, h: 122, solid: true },
  { id: 'dartboard', label: 'Dart Board', kind: 'dartboard', floor: 2, room: 'basement_game', x: 44, y: 86, w: 34, h: 34, solid: false },
  { id: 'arcade_machine', label: 'Arcade Machine', kind: 'arcade', floor: 2, room: 'basement_game', x: 430, y: 86, w: 54, h: 78, solid: true },
  { id: 'game_console', label: 'Console Setup', kind: 'game_console', floor: 2, room: 'basement_media', x: 640, y: 86, w: 172, h: 58, solid: true },
  { id: 'basement_couch', label: 'Basement Couch', kind: 'couch', floor: 2, room: 'basement_media', x: 632, y: 168, w: 168, h: 62, solid: true },
  { id: 'light_basement_game', label: 'Game Room Light', kind: 'light', floor: 2, room: 'basement_game', x: 494, y: 52, w: 22, h: 22, solid: false }
];

export function objectAt(x, y, floor) {
  return [...objects].reverse().find(o => o.floor === floor && x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h) || null;
}

export function roomAt(x, y, floor) {
  return floors[floor]?.rooms.find(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) || null;
}

export function getObject(id) {
  return objects.find(o => o.id === id) || null;
}

export function getStairExit(stairs) {
  if (!stairs || stairs.kind !== 'stairs') return null;
  if (stairs.exitId) return getObject(stairs.exitId);
  return objects.find(o => o.kind === 'stairs' && o.floor === stairs.toFloor && o.toFloor === stairs.floor) || null;
}

export function getTravelStair(currentFloor, targetFloor) {
  const direct = objects.find(o => o.kind === 'stairs' && o.floor === currentFloor && o.toFloor === targetFloor);
  if (direct) return direct;
  if (currentFloor !== 0) return objects.find(o => o.kind === 'stairs' && o.floor === currentFloor && o.toFloor === 0) || null;
  return objects.find(o => o.kind === 'stairs' && o.floor === currentFloor && o.toFloor === targetFloor) || null;
}

export function clampToPlay(x, y) {
  return { x: Math.max(30, Math.min(PLAY_W - 30, x)), y: Math.max(30, Math.min(PLAY_H - 30, y)) };
}

export function approachPoint(obj, action = '') {
  const cx = obj.x + obj.w / 2;
  const cy = obj.y + obj.h / 2;
  if (obj.enterable || ['sleep', 'nap', 'shower', 'toilet'].includes(action)) return clampToPlay(cx, cy);
  if (obj.kind === 'fridge') return clampToPlay(obj.x + obj.w + 44, cy);
  if (['stove', 'sink', 'desk'].includes(obj.kind)) return clampToPlay(cx, obj.y + obj.h + 36);
  if (obj.kind === 'pool_table') return clampToPlay(cx, obj.y + obj.h + 48);
  if (obj.kind === 'arcade') return clampToPlay(cx, obj.y + obj.h + 34);
  if (obj.kind === 'game_console') return clampToPlay(cx, obj.y + obj.h + 54);
  if (obj.kind === 'dartboard') return clampToPlay(obj.x + obj.w + 80, cy + 12);
  if (obj.kind === 'tv') return clampToPlay(160, 214);
  if (obj.kind === 'couch') return clampToPlay(obj.x + obj.w / 2, obj.y + 34);
  if (obj.kind === 'door') return clampToPlay(obj.x + obj.w + 30, obj.y + obj.h / 2);
  if (obj.kind === 'stairs') return clampToPlay(cx, obj.y + obj.h + 28);
  if (obj.kind === 'dog_bowl') return clampToPlay(obj.x + obj.w / 2, obj.y + obj.h + 30);
  if (obj.kind === 'light') return clampToPlay(obj.x - 26, obj.y + 10);
  return clampToPlay(cx, obj.y + obj.h + 32);
}

export function solidObjects(floor, allowId = '') {
  return objects.filter(o => o.floor === floor && o.solid && !o.enterable && o.id !== allowId);
}

export function expandedRect(o, pad = 18) {
  return { x: o.x - pad, y: o.y - pad, w: o.w + pad * 2, h: o.h + pad * 2 };
}

export function pointInRect(x, y, r) {
  return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h;
}

export function segmentHitsRect(a, b, r) {
  const steps = Math.max(8, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 14));
  for (let i = 0; i <= steps; i++) {
    const t = i / steps;
    const x = a.x + (b.x - a.x) * t;
    const y = a.y + (b.y - a.y) * t;
    if (pointInRect(x, y, r)) return true;
  }
  return false;
}
