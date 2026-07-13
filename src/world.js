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
    name: 'Upstairs',
    rooms: [
      { id: 'bedroom', name: 'Primary Bedroom', x: 24, y: 36, w: 440, h: 286 },
      { id: 'office', name: 'Office', x: 480, y: 36, w: 284, h: 286 },
      { id: 'bath2', name: 'Guest / Hall Bath', x: 780, y: 36, w: 156, h: 286 },
      { id: 'walkin_closet', name: 'Primary Walk In Closet', x: 24, y: 338, w: 174, h: 170 },
      { id: 'master_bath', name: 'Primary Suite Bath', x: 214, y: 338, w: 230, h: 170 },
      { id: 'hall', name: 'Upper Hall', x: 460, y: 338, w: 476, h: 170 },
      { id: 'guest_room', name: 'Guest Bedroom', x: 24, y: 524, w: 430, h: 160 },
      { id: 'upstairs_landing', name: 'Upstairs Landing', x: 470, y: 524, w: 234, h: 160 },
      { id: 'stairs2', name: 'Stairs', x: 720, y: 524, w: 216, h: 160 }
    ]
  },
  { id: 2, name: 'Open Basement', rooms: [{ id: 'basement', name: 'Open Basement', x: 24, y: 36, w: 912, h: 648 }] },
  { id: 3, name: 'Garage Area', rooms: [{ id: 'garage', name: 'Open Garage', x: 24, y: 36, w: 912, h: 648 }] },
  {
    id: 4,
    name: 'Backyard Area',
    rooms: [
      { id: 'yard', name: 'Backyard', x: 24, y: 36, w: 572, h: 600 },
      { id: 'pool_area', name: 'Pool Deck', x: 612, y: 36, w: 324, h: 330 },
      { id: 'kennel_area', name: 'Kennel Area', x: 612, y: 382, w: 324, h: 254 }
    ]
  },
  { id: 5, name: 'Secret Lab East', rooms: [{ id: 'secret_lab', name: 'Secret Sprite Test Lab', x: 24, y: 36, w: 912, h: 648 }] }
];

export const objects = [
  { id: 'couch', label: 'Couch', kind: 'couch', floor: 0, room: 'living', x: 132, y: 188, w: 198, h: 72, facing: 'up', solid: true, enterable: true },
  { id: 'tv', label: 'Wall Mounted TV', kind: 'tv', floor: 0, room: 'living', x: 172, y: 54, w: 120, h: 30, wallMounted: true, solid: true },
  { id: 'stereo', label: 'Media Shelf', kind: 'stereo', floor: 0, room: 'living', x: 304, y: 60, w: 58, h: 34, solid: true },
  { id: 'bookshelf', label: 'Bookshelf', kind: 'bookshelf', floor: 0, room: 'living', x: 42, y: 72, w: 58, h: 150, solid: true },
  { id: 'fridge', label: 'Fridge', kind: 'fridge', floor: 0, room: 'kitchen', x: 486, y: 70, w: 70, h: 88, facing: 'down', solid: true },
  { id: 'stove', label: 'Stove', kind: 'stove', floor: 0, room: 'kitchen', x: 598, y: 70, w: 72, h: 64, solid: true },
  { id: 'sink', label: 'Sink', kind: 'sink', floor: 0, room: 'kitchen', x: 690, y: 78, w: 54, h: 48, solid: true },
  { id: 'coffee_maker', label: 'Coffee Maker', kind: 'coffee_maker', floor: 0, room: 'kitchen', x: 722, y: 144, w: 42, h: 34, solid: false },
  { id: 'trash_kitchen', label: 'Kitchen Trash', kind: 'trash_can', floor: 0, room: 'kitchen', x: 728, y: 214, w: 34, h: 42, solid: false },
  { id: 'shower', label: 'Shower', kind: 'shower', floor: 0, room: 'bath', x: 806, y: 70, w: 60, h: 88, solid: true, enterable: true },
  { id: 'bath_sink', label: 'Bathroom Sink', kind: 'sink', floor: 0, room: 'bath', x: 872, y: 154, w: 48, h: 38, solid: true },
  { id: 'toilet', label: 'Toilet', kind: 'toilet', floor: 0, room: 'bath', x: 878, y: 212, w: 44, h: 54, solid: true, enterable: true },
  { id: 'door', label: 'Front Door', kind: 'door', floor: 0, room: 'entry', x: 240, y: 544, w: 96, h: 34, solid: false },
  { id: 'pet_flap_front', label: 'Front Pet Flap', kind: 'door', styleAs: 'door', floor: 0, room: 'entry', x: 354, y: 548, w: 46, h: 24, solid: false },
  { id: 'basement_door', label: 'Basement Door', kind: 'stairs', floor: 0, room: 'stairs', x: 742, y: 386, w: 82, h: 52, solid: false, toFloor: 2, exitId: 'basement_stairs_up' },
  { id: 'garage_door', label: 'Garage Interior Door', kind: 'stairs', styleAs: 'door', floor: 0, room: 'entry', x: 28, y: 418, w: 34, h: 72, solid: false, toFloor: 3, exitId: 'garage_entry_door' },
  { id: 'backyard_door', label: 'Kitchen/Living Back Door', kind: 'stairs', styleAs: 'door', floor: 0, room: 'living', x: 416, y: 38, w: 54, h: 34, solid: false, toFloor: 4, exitId: 'yard_back_door' },
  { id: 'dog_bed', label: 'Dog Bed', kind: 'dog_bed', floor: 0, room: 'entry', x: 600, y: 476, w: 64, h: 42, solid: false, enterable: true },
  { id: 'dog_bowl', label: 'Dog Bowl', kind: 'dog_bowl', floor: 0, room: 'entry', x: 674, y: 486, w: 36, h: 26, solid: false },
  { id: 'dining_table', label: 'Dining Table', kind: 'dining_table', floor: 0, room: 'kitchen', x: 466, y: 272, w: 166, h: 58, solid: true },
  { id: 'service_closet', label: 'Service Cleaning Closet', kind: 'cleaning_closet', floor: 0, room: 'stairs', x: 724, y: 462, w: 44, h: 76, facing: 'east', solid: false },
  { id: 'vacuum_cleaner', label: 'Vacuum Cleaner', kind: 'vacuum_cleaner', floor: 0, room: 'stairs', x: 778, y: 492, w: 28, h: 66, solid: false },
  { id: 'robot_vacuum', label: 'Robot Vacuum', kind: 'robot_vacuum', floor: 0, room: 'entry', x: 680, y: 444, w: 30, h: 30, solid: false },
  { id: 'light_living', label: 'Living Light', kind: 'light', floor: 0, room: 'living', x: 408, y: 52, w: 22, h: 22, solid: false },
  { id: 'stairs_down', label: 'Upstairs Stairs', kind: 'stairs', floor: 0, room: 'stairs', x: 780, y: 554, w: 118, h: 84, solid: false, toFloor: 1, exitId: 'stairs_up' },

  { id: 'bed', label: 'King Bed', kind: 'bed', floor: 1, room: 'bedroom', x: 66, y: 90, w: 236, h: 118, facing: 'east', headboard: 'west', solid: true, enterable: true },
  { id: 'primary_nightstand_north', label: 'Primary North Nightstand', kind: 'nightstand', floor: 1, room: 'bedroom', x: 38, y: 96, w: 24, h: 44, solid: true },
  { id: 'primary_nightstand_south', label: 'Primary South Nightstand', kind: 'nightstand', floor: 1, room: 'bedroom', x: 38, y: 158, w: 24, h: 44, solid: true },
  { id: 'bedroom_tv', label: 'Bedroom Wall TV', kind: 'tv', floor: 1, room: 'bedroom', x: 424, y: 124, w: 30, h: 116, facing: 'west', wallMounted: true, solid: true },
  { id: 'closet', label: 'Walk In Closet Door', kind: 'closet', floor: 1, room: 'bedroom', x: 72, y: 318, w: 80, h: 26, solid: false, enterable: true, closetEntrance: 'south' },
  { id: 'desk', label: 'Laptop Desk', kind: 'desk', floor: 1, room: 'office', x: 552, y: 96, w: 122, h: 66, solid: true },
  { id: 'shower2', label: 'Guest Bath Shower', kind: 'shower', floor: 1, room: 'bath2', x: 798, y: 64, w: 62, h: 84, solid: true, enterable: true },
  { id: 'bath2_sink', label: 'Guest Bath Sink', kind: 'sink', floor: 1, room: 'bath2', x: 872, y: 154, w: 48, h: 40, solid: true },
  { id: 'toilet2', label: 'Guest Bath Toilet', kind: 'toilet', floor: 1, room: 'bath2', x: 880, y: 220, w: 44, h: 54, solid: true, enterable: true },
  { id: 'master_bathtub', label: 'Primary Bathtub', kind: 'bathtub', floor: 1, room: 'master_bath', x: 226, y: 358, w: 86, h: 54, solid: true, enterable: true },
  { id: 'master_shower', label: 'Primary Shower', kind: 'shower', floor: 1, room: 'master_bath', x: 320, y: 358, w: 56, h: 70, solid: true, enterable: true },
  { id: 'master_bath_sink', label: 'Primary Bath Sink', kind: 'sink', floor: 1, room: 'master_bath', x: 390, y: 360, w: 42, h: 36, solid: true },
  { id: 'master_toilet', label: 'Primary Toilet', kind: 'toilet', floor: 1, room: 'master_bath', x: 390, y: 424, w: 42, h: 52, solid: true, enterable: true },
  { id: 'guest_bed', label: 'Guest Bed', kind: 'bed', floor: 1, room: 'guest_room', x: 54, y: 554, w: 158, h: 82, facing: 'east', headboard: 'west', solid: true, enterable: true },
  { id: 'guest_nightstand', label: 'Guest Nightstand', kind: 'nightstand', floor: 1, room: 'guest_room', x: 224, y: 570, w: 36, h: 36, solid: true },
  { id: 'guest_desk', label: 'Guest Study Desk', kind: 'desk', floor: 1, room: 'guest_room', x: 294, y: 558, w: 112, h: 56, solid: true },
  { id: 'light_bedroom', label: 'Bedroom Light', kind: 'light', floor: 1, room: 'bedroom', x: 402, y: 52, w: 22, h: 22, solid: false },
  { id: 'light_guest_room', label: 'Guest Room Light', kind: 'light', floor: 1, room: 'guest_room', x: 420, y: 540, w: 22, h: 22, solid: false },
  { id: 'stairs_up', label: 'Downstairs Stairs', kind: 'stairs', floor: 1, room: 'stairs2', x: 766, y: 554, w: 118, h: 84, solid: false, toFloor: 0, exitId: 'stairs_down' },

  { id: 'basement_stairs_up', label: 'Main Floor Stairs', kind: 'stairs', floor: 2, room: 'basement', x: 766, y: 554, w: 118, h: 84, solid: false, toFloor: 0, exitId: 'basement_door' },
  { id: 'pool_table', label: 'Pool Table', kind: 'pool_table', floor: 2, room: 'basement', x: 250, y: 248, w: 250, h: 122, solid: true },
  { id: 'dartboard', label: 'Dart Board', kind: 'dartboard', floor: 2, room: 'basement', x: 44, y: 86, w: 34, h: 34, solid: false },
  { id: 'arcade_machine', label: 'Arcade Machine', kind: 'arcade', floor: 2, room: 'basement', x: 420, y: 74, w: 54, h: 78, solid: true },
  { id: 'game_console', label: 'Console Setup', kind: 'game_console', floor: 2, room: 'basement', x: 620, y: 96, w: 172, h: 58, solid: true },
  { id: 'basement_couch', label: 'Basement Couch', kind: 'couch', floor: 2, room: 'basement', x: 614, y: 176, w: 168, h: 62, facing: 'up', solid: true, enterable: true },
  { id: 'treadmill', label: 'Treadmill', kind: 'treadmill', floor: 2, room: 'basement', x: 62, y: 548, w: 116, h: 56, solid: false, enterable: true },
  { id: 'weight_bench', label: 'Weight Bench', kind: 'weight_bench', floor: 2, room: 'basement', x: 216, y: 602, w: 128, h: 46, solid: false, enterable: true },
  { id: 'heavy_bag', label: 'Heavy Bag', kind: 'heavy_bag', floor: 2, room: 'basement', x: 436, y: 548, w: 44, h: 80, solid: false, enterable: true },
  { id: 'light_basement_game', label: 'Basement Light', kind: 'light', floor: 2, room: 'basement', x: 494, y: 52, w: 22, h: 22, solid: false },

  { id: 'garage_entry_door', label: 'House Door', kind: 'stairs', styleAs: 'door', floor: 3, room: 'garage', x: 872, y: 468, w: 34, h: 72, solid: false, toFloor: 0, exitId: 'garage_door' },
  { id: 'garage_overhead_door', label: 'Overhead Garage Door', kind: 'garage_door', floor: 3, room: 'garage', x: 186, y: 636, w: 548, h: 28, solid: false, facing: 'down' },
  { id: 'car_1', label: 'Family SUV', kind: 'car', floor: 3, room: 'garage', x: 196, y: 268, w: 126, h: 238, solid: true, facing: 'down', vehicleBody: 'suv' },
  { id: 'car_2', label: 'Sports Convertible', kind: 'car', floor: 3, room: 'garage', x: 506, y: 268, w: 108, h: 226, solid: true, facing: 'down', vehicleBody: 'convertible' },
  { id: 'bike', label: 'Bicycle', kind: 'bike', floor: 3, room: 'garage', x: 742, y: 260, w: 34, h: 96, solid: true, facing: 'down' },
  { id: 'motorbike', label: 'Motorbike', kind: 'motorbike', floor: 3, room: 'garage', x: 802, y: 240, w: 48, h: 122, solid: true, facing: 'down' },
  { id: 'atv', label: 'ATV', kind: 'atv', floor: 3, room: 'garage', x: 690, y: 404, w: 82, h: 116, solid: true, facing: 'down' },

  { id: 'trash_outdoor', label: 'Outdoor Trash Bin', kind: 'outdoor_trash', floor: 4, room: 'yard', x: 70, y: 92, w: 54, h: 66, solid: false },
  { id: 'yard_back_door', label: 'Back Door to House', kind: 'stairs', styleAs: 'door', floor: 4, room: 'yard', x: 148, y: 560, w: 80, h: 34, solid: false, toFloor: 0, exitId: 'backyard_door' },
  { id: 'pet_flap_yard', label: 'Yard Pet Flap', kind: 'door', styleAs: 'door', floor: 4, room: 'yard', x: 240, y: 562, w: 50, h: 24, solid: false },
  { id: 'soccer_field', label: 'Backyard Soccer Field', kind: 'soccer_field', floor: 4, room: 'yard', x: 82, y: 190, w: 420, h: 300, solid: false, enterable: true },
  { id: 'swim_pool', label: 'Backyard Pool', kind: 'swim_pool', floor: 4, room: 'pool_area', x: 632, y: 58, w: 282, h: 288, solid: false, enterable: true },
  { id: 'kennel', label: 'Dog Kennel', kind: 'kennel', floor: 4, room: 'kennel_area', x: 688, y: 430, w: 112, h: 82, solid: true },
  { id: 'dog_bath', label: 'Backyard Dog Bath', kind: 'dog_bath', floor: 4, room: 'kennel_area', x: 812, y: 520, w: 92, h: 58, solid: false, enterable: true },

  { id: 'lab_bed', label: 'Lab Bed', kind: 'bed', floor: 5, room: 'secret_lab', x: 72, y: 86, w: 180, h: 104, solid: true, enterable: true },
  { id: 'lab_laptop_desk', label: 'Animation Laptop Desk', kind: 'desk', floor: 5, room: 'secret_lab', x: 318, y: 72, w: 140, h: 72, solid: true },
  { id: 'lab_pose_chair', label: 'Pose Chair', kind: 'couch', floor: 5, room: 'secret_lab', x: 500, y: 82, w: 112, h: 56, facing: 'down', solid: true, enterable: true },
  { id: 'lab_motion_screen', label: 'Motion Review Screen', kind: 'tv', floor: 5, room: 'secret_lab', x: 690, y: 70, w: 150, h: 38, wallMounted: true, solid: true },
  { id: 'lab_shower', label: 'Lab Shower Pod', kind: 'shower', floor: 5, room: 'secret_lab', x: 72, y: 248, w: 66, h: 92, solid: true, enterable: true },
  { id: 'lab_toilet', label: 'Lab Toilet', kind: 'toilet', floor: 5, room: 'secret_lab', x: 166, y: 278, w: 46, h: 56, solid: true, enterable: true },
  { id: 'lab_pool_table', label: 'Lab Pool Table', kind: 'pool_table', floor: 5, room: 'secret_lab', x: 276, y: 260, w: 232, h: 112, solid: true },
  { id: 'lab_game_console', label: 'Lab Console Station', kind: 'game_console', floor: 5, room: 'secret_lab', x: 592, y: 246, w: 166, h: 58, solid: true },
  { id: 'lab_dartboard', label: 'Lab Dart Board', kind: 'dartboard', floor: 5, room: 'secret_lab', x: 842, y: 248, w: 36, h: 36, solid: false },
  { id: 'lab_treadmill', label: 'Lab Treadmill', kind: 'treadmill', floor: 5, room: 'secret_lab', x: 72, y: 526, w: 124, h: 58, solid: false, enterable: true },
  { id: 'lab_weight_bench', label: 'Lab Weight Bench', kind: 'weight_bench', floor: 5, room: 'secret_lab', x: 270, y: 572, w: 132, h: 48, solid: false, enterable: true },
  { id: 'lab_heavy_bag', label: 'Lab Heavy Bag', kind: 'heavy_bag', floor: 5, room: 'secret_lab', x: 512, y: 520, w: 48, h: 86, solid: false, enterable: true },
  { id: 'lab_light', label: 'Secret Lab Light', kind: 'light', floor: 5, room: 'secret_lab', x: 890, y: 58, w: 22, h: 22, solid: false }
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
  return getObject(stairs.exitId);
}

export function getTravelStair(fromFloor, toFloor) {
  if (fromFloor === toFloor) return null;
  if (fromFloor === 0 && toFloor === 4) return getObject('backyard_door');
  if (fromFloor === 4 && toFloor === 0) return getObject('yard_back_door');
  const direct = objects.find(o => o.kind === 'stairs' && o.floor === fromFloor && o.toFloor === toFloor);
  if (direct) return direct;
  if (fromFloor !== 0) return objects.find(o => o.kind === 'stairs' && o.floor === fromFloor && o.toFloor === 0) || null;
  if (toFloor === 1) return getObject('stairs_down');
  if (toFloor === 2) return getObject('basement_door');
  if (toFloor === 3) return getObject('garage_door');
  if (toFloor === 4) return getObject('backyard_door');
  return null;
}

export function clampToPlay(x, y) {
  return { x: Math.max(30, Math.min(PLAY_W - 30, x)), y: Math.max(30, Math.min(PLAY_H - 30, y)) };
}

export function approachPoint(obj, action = '') {
  const cx = obj.x + obj.w / 2;
  const cy = obj.y + obj.h / 2;
  if (obj.kind === 'dog_bath') return clampToPlay(cx, cy);
  if (obj.kind === 'closet') return clampToPlay(cx, obj.y + obj.h + 26);
  if (obj.enterable || ['sleep', 'nap', 'shower', 'toilet', 'swim', 'swim_together', 'soccer_practice', 'soccer_match', 'wash_dog'].includes(action)) return clampToPlay(cx, cy);
  if (obj.kind === 'fridge') return clampToPlay(cx, obj.y + obj.h + 42);
  if (['stove', 'sink'].includes(obj.kind)) return clampToPlay(cx, obj.y + obj.h + 36);
  if (obj.kind === 'coffee_maker') return clampToPlay(cx, obj.y + obj.h + 28);
  if (obj.kind === 'dining_table') return clampToPlay(cx, obj.y + obj.h + 34);
  if (obj.kind === 'cleaning_closet') return clampToPlay(obj.x + obj.w + 34, cy);
  if (obj.kind === 'vacuum_cleaner') return clampToPlay(cx + 34, cy + 6);
  if (obj.kind === 'robot_vacuum') return clampToPlay(cx + 30, cy + 4);
  if (obj.kind === 'bookshelf') return clampToPlay(obj.x + obj.w + 36, cy);
  if (obj.kind === 'desk') return clampToPlay(cx, obj.y + obj.h + 42);
  if (obj.kind === 'pool_table') return clampToPlay(cx, obj.y + obj.h + 48);
  if (obj.kind === 'arcade') return clampToPlay(cx, obj.y + obj.h + 34);
  if (obj.kind === 'game_console') return clampToPlay(cx, obj.y + obj.h + 54);
  if (obj.kind === 'dartboard') return clampToPlay(obj.x + obj.w + 80, cy + 12);
  if (['treadmill', 'weight_bench'].includes(obj.kind)) return clampToPlay(cx, cy + 4);
  if (obj.kind === 'heavy_bag') return clampToPlay(cx + 44, cy + 8);
  if (obj.kind === 'kennel') return clampToPlay(cx, obj.y + obj.h + 30);
  if (obj.kind === 'dog_bed') return clampToPlay(cx, cy);
  if (['trash_can', 'outdoor_trash'].includes(obj.kind)) return clampToPlay(cx, obj.y + obj.h + 30);
  if (obj.kind === 'car') return clampToPlay(obj.x + obj.w + 28, obj.y + obj.h * 0.58);
  if (['bike', 'motorbike', 'atv'].includes(obj.kind)) return clampToPlay(cx + 34, cy + 18);
  if (obj.kind === 'tv') {
    const seat = obj.room === 'living' ? getObject('couch') : obj.room === 'bedroom' ? getObject('bed') : obj.room === 'secret_lab' ? getObject('lab_pose_chair') : getObject('basement_couch');
    return seat ? clampToPlay(seat.x + seat.w * .55, seat.y + seat.h / 2) : clampToPlay(cx, obj.y + 150);
  }
  if (obj.kind === 'couch') return clampToPlay(cx, obj.facing === 'up' ? obj.y + obj.h * .48 : obj.y + obj.h - 24);
  if (obj.kind === 'door') return clampToPlay(cx, obj.y - 28);
  if (obj.kind === 'stairs') return obj.styleAs === 'door' ? clampToPlay(cx, cy) : clampToPlay(cx, obj.y + obj.h + 28);
  if (obj.kind === 'dog_bowl') return clampToPlay(cx, obj.y + obj.h + 30);
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
