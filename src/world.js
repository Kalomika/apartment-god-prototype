import { PLAY_H, PLAY_W } from './config.js';

export const floors = [
  {
    id: 0,
    name: 'Main House',
    rooms: [
      { id: 'living', name: 'Living Room', x: 24, y: 36, w: 416, h: 292 },
      { id: 'kitchen', name: 'Kitchen', x: 456, y: 36, w: 318, h: 292 },
      { id: 'bath', name: 'Bathroom', x: 790, y: 36, w: 146, h: 292 },
      { id: 'entry', name: 'Entry / Foyer', x: 24, y: 344, w: 690, h: 210 },
      { id: 'stairs', name: 'Stair / Service Hall', x: 720, y: 344, w: 216, h: 340 },
      { id: 'front_porch', name: 'Front Porch', x: 136, y: 570, w: 360, h: 114 }
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
    name: 'Open Basement',
    rooms: [
      { id: 'basement', name: 'Open Basement', x: 24, y: 36, w: 912, h: 648 }
    ]
  },
  {
    id: 3,
    name: 'Garage',
    rooms: [
      { id: 'garage_bay', name: 'Two-Car Garage', x: 24, y: 36, w: 912, h: 420 },
      { id: 'garage_storage', name: 'Vehicle Storage', x: 24, y: 472, w: 460, h: 190 },
      { id: 'garage_entry', name: 'Garage Entry', x: 500, y: 472, w: 436, h: 190 }
    ]
  },
  {
    id: 4,
    name: 'Backyard',
    rooms: [
      { id: 'yard', name: 'Backyard', x: 24, y: 36, w: 572, h: 600 },
      { id: 'pool_area', name: 'Pool Deck', x: 612, y: 36, w: 324, h: 330 },
      { id: 'kennel_area', name: 'Kennel Area', x: 612, y: 382, w: 324, h: 254 }
    ]
  }
];

export const objects = [
  { id: 'couch', label: 'Couch', kind: 'couch', floor: 0, room: 'living', x: 132, y: 188, w: 198, h: 72, facing: 'up', solid: true },
  { id: 'tv', label: 'Wall Mounted TV', kind: 'tv', floor: 0, room: 'living', x: 172, y: 54, w: 120, h: 30, wallMounted: true, solid: true },
  { id: 'stereo', label: 'Media Shelf', kind: 'stereo', floor: 0, room: 'living', x: 304, y: 60, w: 58, h: 34, solid: true },
  { id: 'fridge', label: 'Fridge', kind: 'fridge', floor: 0, room: 'kitchen', x: 488, y: 70, w: 58, h: 88, solid: true },
  { id: 'stove', label: 'Stove', kind: 'stove', floor: 0, room: 'kitchen', x: 598, y: 70, w: 72, h: 64, solid: true },
  { id: 'sink', label: 'Sink', kind: 'sink', floor: 0, room: 'kitchen', x: 690, y: 78, w: 54, h: 48, solid: true },
  { id: 'trash_kitchen', label: 'Kitchen Trash', kind: 'trash_can', floor: 0, room: 'kitchen', x: 728, y: 214, w: 34, h: 42, solid: false },
  { id: 'shower', label: 'Shower', kind: 'shower', floor: 0, room: 'bath', x: 806, y: 70, w: 60, h: 88, solid: true, enterable: true },
  { id: 'toilet', label: 'Toilet', kind: 'toilet', floor: 0, room: 'bath', x: 878, y: 212, w: 44, h: 54, solid: true, enterable: true },
  { id: 'door', label: 'Front Door', kind: 'door', floor: 0, room: 'entry', x: 240, y: 544, w: 96, h: 34, solid: false },
  { id: 'pet_flap_front', label: 'Pet Flap', kind: 'stairs', floor: 0, room: 'entry', x: 354, y: 548, w: 46, h: 24, solid: false, toFloor: 4, exitId: 'yard_back_door' },
  { id: 'basement_door', label: 'Basement Door', kind: 'stairs', floor: 0, room: 'stairs', x: 742, y: 386, w: 82, h: 52, solid: false, toFloor: 2, exitId: 'basement_stairs_up' },
  { id: 'garage_door', label: 'Garage Interior Door', kind: 'stairs', floor: 0, room: 'entry', x: 640, y: 500, w: 72, h: 54, solid: false, toFloor: 3, exitId: 'garage_entry_door' },
  { id: 'backyard_door', label: 'Back Door', kind: 'stairs', floor: 0, room: 'kitchen', x: 762, y: 244, w: 36, h: 72, solid: false, toFloor: 4, exitId: 'yard_back_door' },
  { id: 'dog_bowl', label: 'Dog Bowl', kind: 'dog_bowl', floor: 0, room: 'kitchen', x: 558, y: 256, w: 36, h: 26, solid: false },
  { id: 'light_living', label: 'Living Light', kind: 'light', floor: 0, room: 'living', x: 408, y: 52, w: 22, h: 22, solid: false },
  { id: 'stairs_down', label: 'Upstairs Stairs', kind: 'stairs', floor: 0, room: 'stairs', x: 780, y: 554, w: 118, h: 84, solid: false, toFloor: 1, exitId: 'stairs_up' },
  { id: 'bed', label: 'Bed', kind: 'bed', floor: 1, room: 'bedroom', x: 82, y: 98, w: 190, h: 112, solid: true, enterable: true },
  { id: 'desk', label: 'Laptop Desk', kind: 'desk', floor: 1, room: 'office', x: 552, y: 96, w: 122, h: 66, solid: true },
  { id: 'shower2', label: 'Upstairs Shower', kind: 'shower', floor: 1, room: 'bath2', x: 798, y: 72, w: 62, h: 90, solid: true, enterable: true },
  { id: 'toilet2', label: 'Upstairs Toilet', kind: 'toilet', floor: 1, room: 'bath2', x: 880, y: 222, w: 44, h: 54, solid: true, enterable: true },
  { id: 'light_bedroom', label: 'Bedroom Light', kind: 'light', floor: 1, room: 'bedroom', x: 430, y: 52, w: 22, h: 22, solid: false },
  { id: 'stairs_up', label: 'Downstairs Stairs', kind: 'stairs', floor: 1, room: 'stairs2', x: 766, y: 554, w: 118, h: 84, solid: false, toFloor: 0, exitId: 'stairs_down' },
  { id: 'basement_stairs_up', label: 'Main Floor Stairs', kind: 'stairs', floor: 2, room: 'basement', x: 766, y: 554, w: 118, h: 84, solid: false, toFloor: 0, exitId: 'basement_door' },
  { id: 'pool_table', label: 'Pool Table', kind: 'pool_table', floor: 2, room: 'basement', x: 96, y: 100, w: 250, h: 122, solid: true },
  { id: 'dartboard', label: 'Dart Board', kind: 'dartboard', floor: 2, room: 'basement', x: 44, y: 86, w: 34, h: 34, solid: false },
  { id: 'arcade_machine', label: 'Arcade Machine', kind: 'arcade', floor: 2, room: 'basement', x: 420, y: 74, w: 54, h: 78, solid: true },
  { id: 'game_console', label: 'Console Setup', kind: 'game_console', floor: 2, room: 'basement', x: 620, y: 96, w: 172, h: 58, solid: true },
  { id: 'basement_couch', label: 'Basement Couch', kind: 'couch', floor: 2, room: 'basement', x: 614, y: 176, w: 168, h: 62, facing: 'up', solid: true },
  { id: 'treadmill', label: 'Treadmill', kind: 'treadmill', floor: 2, room: 'basement', x: 62, y: 548, w: 116, h: 56, solid: false, enterable: true },
  { id: 'weight_bench', label: 'Weight Bench', kind: 'weight_bench', floor: 2, room: 'basement', x: 216, y: 602, w: 128, h: 46, solid: false, enterable: true },
  { id: 'heavy_bag', label: 'Heavy Bag', kind: 'heavy_bag', floor: 2, room: 'basement', x: 436, y: 548, w: 44, h: 80, solid: false, enterable: true },
  { id: 'light_basement_game', label: 'Basement Light', kind: 'light', floor: 2, room: 'basement', x: 494, y: 52, w: 22, h: 22, solid: false },
  { id: 'garage_entry_door', label: 'House Door', kind: 'stairs', floor: 3, room: 'garage_entry', x: 628, y: 506, w: 68, h: 34, solid: false, toFloor: 0, exitId: 'garage_door' },
  { id: 'garage_overhead_door', label: 'Overhead Garage Door', kind: 'garage_door', floor: 3, room: 'garage_bay', x: 118, y: 38, w: 548, h: 28, solid: false },
  { id: 'car_1', label: 'Family Car', kind: 'car', floor: 3, room: 'garage_bay', x: 126, y: 138, w: 116, h: 230, solid: true },
  { id: 'car_2', label: 'Sports Car', kind: 'car', floor: 3, room: 'garage_bay', x: 426, y: 138, w: 116, h: 230, solid: true },
  { id: 'bike', label: 'Bicycle', kind: 'bike', floor: 3, room: 'garage_storage', x: 82, y: 510, w: 34, h: 96, solid: true },
  { id: 'motorbike', label: 'Motorbike', kind: 'motorbike', floor: 3, room: 'garage_storage', x: 208, y: 500, w: 48, h: 122, solid: true },
  { id: 'atv', label: 'ATV', kind: 'atv', floor: 3, room: 'garage_storage', x: 326, y: 502, w: 82, h: 116, solid: true },
  { id: 'trash_outdoor', label: 'Outdoor Trash Bin', kind: 'outdoor_trash', floor: 4, room: 'yard', x: 70, y: 92, w: 54, h: 66, solid: false },
  { id: 'yard_back_door', label: 'House Door', kind: 'stairs', floor: 4, room: 'yard', x: 148, y: 560, w: 80, h: 34, solid: false, toFloor: 0, exitId: 'backyard_door' },
  { id: 'pet_flap_yard', label: 'Pet Flap', kind: 'stairs', floor: 4, room: 'yard', x: 240, y: 562, w: 50, h: 24, solid: false, toFloor: 0, exitId: 'pet_flap_front' },
  { id: 'soccer_field', label: 'Backyard Soccer Field', kind: 'soccer_field', floor: 4, room: 'yard', x: 82, y: 190, w: 420, h: 300, solid: false, enterable: true },
  { id: 'swim_pool', label: 'Backyard Pool', kind: 'swim_pool', floor: 4, room: 'pool_area', x: 650, y: 92, w: 236, h: 190, solid: false, enterable: true },
  { id: 'kennel', label: 'Dog Kennel', kind: 'kennel', floor: 4, room: 'kennel_area', x: 688, y: 430, w: 112, h: 82, solid: true }
];

export function objectAt(x, y, floor) { return [...objects].reverse().find(o => o.floor === floor && x >= o.x && x <= o.x + o.w && y >= o.y && y <= o.y + o.h) || null; }
export function roomAt(x, y, floor) { return floors[floor]?.rooms.find(r => x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h) || null; }
export function getObject(id) { return objects.find(o => o.id === id) || null; }
export function getStairExit(stairs) { if (!stairs || stairs.kind !== 'stairs') return null; return getObject(stairs.exitId); }
export function getTravelStair(fromFloor, toFloor) {
  if (fromFloor === toFloor) return null;
  const direct = objects.find(o => o.kind === 'stairs' && o.floor === fromFloor && o.toFloor === toFloor);
  if (direct) return direct;
  if (fromFloor !== 0) return objects.find(o => o.kind === 'stairs' && o.floor === fromFloor && o.toFloor === 0) || null;
  if (toFloor === 1) return getObject('stairs_down');
  if (toFloor === 2) return getObject('basement_door');
  if (toFloor === 3) return getObject('garage_door');
  if (toFloor === 4) return getObject('backyard_door') || getObject('pet_flap_front');
  return null;
}
export function clampToPlay(x, y) { return { x: Math.max(30, Math.min(PLAY_W - 30, x)), y: Math.max(30, Math.min(PLAY_H - 30, y)) }; }
export function approachPoint(obj, action = '') { const cx = obj.x + obj.w / 2; const cy = obj.y + obj.h / 2; if (obj.enterable || ['sleep', 'nap', 'shower', 'toilet', 'swim', 'swim_together', 'soccer_practice', 'soccer_match'].includes(action)) return clampToPlay(cx, cy); if (obj.kind === 'fridge') return clampToPlay(obj.x + obj.w + 44, cy); if (['stove', 'sink'].includes(obj.kind)) return clampToPlay(cx, obj.y + obj.h + 36); if (obj.kind === 'desk') return clampToPlay(cx, obj.y + obj.h + 42); if (obj.kind === 'pool_table') return clampToPlay(cx + 18, obj.y + obj.h + 48); if (obj.kind === 'arcade') return clampToPlay(cx, obj.y + obj.h + 34); if (obj.kind === 'game_console') return clampToPlay(cx, obj.y + obj.h + 54); if (obj.kind === 'dartboard') return clampToPlay(obj.x + obj.w + 80, cy + 12); if (obj.kind === 'treadmill') return clampToPlay(cx, cy); if (obj.kind === 'weight_bench') return clampToPlay(cx, cy + 4); if (obj.kind === 'heavy_bag') return clampToPlay(obj.x + obj.w / 2, obj.y + obj.h + 42); if (obj.kind === 'kennel') return clampToPlay(cx, obj.y + obj.h + 30); if (['trash_can', 'outdoor_trash'].includes(obj.kind)) return clampToPlay(cx, obj.y + obj.h + 30); if (obj.kind === 'car') return clampToPlay(obj.x + obj.w + 28, obj.y + obj.h * 0.62); if (['bike', 'motorbike', 'atv'].includes(obj.kind)) return clampToPlay(cx + 28, cy); if (obj.kind === 'tv') { const couch = getObject(obj.room === 'living' ? 'couch' : 'basement_couch'); return couch ? clampToPlay(couch.x + couch.w / 2, couch.y + 28) : clampToPlay(cx, obj.y + 150); } if (obj.kind === 'couch') return clampToPlay(obj.x + obj.w / 2, obj.facing === 'up' ? obj.y + 30 : obj.y + obj.h - 24); if (obj.kind === 'door') return clampToPlay(obj.x + obj.w / 2, obj.y - 28); if (obj.kind === 'stairs') return clampToPlay(cx, obj.y + obj.h + 28); if (obj.kind === 'dog_bowl') return clampToPlay(obj.x + obj.w / 2, obj.y + obj.h + 30); if (obj.kind === 'light') return clampToPlay(obj.x - 26, obj.y + 10); return clampToPlay(cx, obj.y + obj.h + 32); }
export function solidObjects(floor, allowId = '') { return objects.filter(o => o.floor === floor && o.solid && !o.enterable && o.id !== allowId); }
export function expandedRect(o, pad = 18) { return { x: o.x - pad, y: o.y - pad, w: o.w + pad * 2, h: o.h + pad * 2 }; }
export function pointInRect(x, y, r) { return x >= r.x && x <= r.x + r.w && y >= r.y && y <= r.y + r.h; }
export function segmentHitsRect(a, b, r) { const steps = Math.max(8, Math.ceil(Math.hypot(b.x - a.x, b.y - a.y) / 14)); for (let i = 0; i <= steps; i++) { const t = i / steps; const x = a.x + (b.x - a.x) * t; const y = a.y + (b.y - a.y) * t; if (pointInRect(x, y, r)) return true; } return false; }
