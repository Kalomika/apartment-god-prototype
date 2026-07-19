const ROOT = 'assets/phaser-migration-2/sprites';

export const PM2_ROOM_TEXTURES = {
  living: `${ROOT}/environment/room_living.svg`,
  kitchen: `${ROOT}/environment/room_kitchen.svg`,
  bath: `${ROOT}/environment/room_bath.svg`,
  entry: `${ROOT}/environment/room_entry.svg`,
  stairs: `${ROOT}/environment/room_stairs.svg`,
  bedroom: `${ROOT}/environment/room_bedroom.svg`,
  office: `${ROOT}/environment/room_office.svg`,
  closet: `${ROOT}/environment/room_closet.svg`,
  master_bath: `${ROOT}/environment/room_master_bath.svg`,
  panic: `${ROOT}/environment/room_panic.svg`,
  basement: `${ROOT}/environment/room_basement.svg`,
  garage: `${ROOT}/environment/room_garage.svg`,
  yard: `${ROOT}/environment/room_yard.svg`,
  curb: `${ROOT}/environment/room_curb.svg`,
  walkway: `${ROOT}/environment/room_walkway.svg`,
  pool_area: `${ROOT}/environment/room_pool_area.svg`,
  kennel_area: `${ROOT}/environment/room_kennel_area.svg`,
  lab: `${ROOT}/environment/room_lab.svg`,
  neutral: `${ROOT}/environment/room_neutral.svg`
};

export const PM2_OBJECT_TEXTURES = {
  generic: `${ROOT}/objects/generic.svg`,
  couch: `${ROOT}/objects/couch.svg`,
  dining_table: `${ROOT}/objects/dining_table.svg`,
  fridge: `${ROOT}/objects/fridge.svg`,
  stove: `${ROOT}/objects/stove.svg`,
  sink: `${ROOT}/objects/sink.svg`,
  coffee_maker: `${ROOT}/objects/coffee_maker.svg`,
  trash_can: `${ROOT}/objects/trash_can.svg`,
  outdoor_trash: `${ROOT}/objects/trash_can.svg`,
  shower: `${ROOT}/objects/shower.svg`,
  dog_bath: `${ROOT}/objects/dog_bath.svg`,
  bathtub: `${ROOT}/objects/bathtub.svg`,
  toilet: `${ROOT}/objects/toilet.svg`,
  bed: `${ROOT}/objects/bed.svg`,
  tv: `${ROOT}/objects/tv.svg`,
  desk: `${ROOT}/objects/desk.svg`,
  bookshelf: `${ROOT}/objects/bookshelf.svg`,
  pool_table: `${ROOT}/objects/pool_table.svg`,
  arcade: `${ROOT}/objects/arcade.svg`,
  arcade_machine: `${ROOT}/objects/arcade.svg`,
  game_console: `${ROOT}/objects/game_console.svg`,
  dartboard: `${ROOT}/objects/dartboard.svg`,
  treadmill: `${ROOT}/objects/treadmill.svg`,
  weight_bench: `${ROOT}/objects/weight_bench.svg`,
  heavy_bag: `${ROOT}/objects/heavy_bag.svg`,
  stairs: `${ROOT}/objects/stairs.svg`,
  door: `${ROOT}/objects/door.svg`,
  garage_door: `${ROOT}/objects/garage_door.svg`,
  dog_bed: `${ROOT}/objects/dog_bed.svg`,
  dog_bowl: `${ROOT}/objects/dog_bowl.svg`,
  closet: `${ROOT}/objects/closet.svg`,
  nightstand: `${ROOT}/objects/nightstand.svg`,
  kennel: `${ROOT}/objects/kennel.svg`,
  swim_pool: `${ROOT}/objects/swim_pool.svg`,
  soccer_field: `${ROOT}/objects/soccer_field.svg`,
  robot_vacuum: `${ROOT}/objects/robot_vacuum.svg`,
  vacuum_cleaner: `${ROOT}/objects/vacuum_cleaner.svg`,
  cleaning_closet: `${ROOT}/objects/cleaning_closet.svg`,
  light: `${ROOT}/objects/light.svg`,
  car: `${ROOT}/objects/car.svg`,
  bike: `${ROOT}/objects/bike.svg`,
  motorbike: `${ROOT}/objects/motorbike.svg`,
  atv: `${ROOT}/objects/atv.svg`,
  security_panel: `${ROOT}/objects/security_panel.svg`,
  security_locker: `${ROOT}/objects/security_locker.svg`,
  security_supply: `${ROOT}/objects/security_supply.svg`,
  panic_room_door: `${ROOT}/objects/door.svg`,
  stereo: `${ROOT}/objects/game_console.svg`,
  basketball_court: `${ROOT}/objects/soccer_field.svg`
};

export const PM2_CHARACTER_SHEETS = {
  'resident-sheet': `${ROOT}/characters/resident_8fps_sheet.svg`,
  'girlfriend-sheet': `${ROOT}/characters/girlfriend_8fps_sheet.svg`,
  'lab-subject-sheet': `${ROOT}/characters/lab_subject_8fps_sheet.svg`,
  'dog-sheet': `${ROOT}/characters/dog_8fps_sheet.svg`
};

export function textureForObject(object) {
  const key = PM2_OBJECT_TEXTURES[object?.kind] ? object.kind : 'generic';
  return `pm2-object-${key}`;
}

export function textureForRoom(room) {
  const id = String(room?.id || '');
  let key = 'neutral';
  if (id === 'living') key = 'living';
  else if (id === 'kitchen') key = 'kitchen';
  else if (id === 'bath') key = 'bath';
  else if (id === 'entry' || id === 'front_porch') key = 'entry';
  else if (id.includes('stairs') || id.includes('foyer') || id === 'hall') key = 'stairs';
  else if (id === 'bedroom') key = 'bedroom';
  else if (id === 'office') key = 'office';
  else if (id.includes('closet')) key = 'closet';
  else if (id === 'master_bath') key = 'master_bath';
  else if (id === 'panic_room') key = 'panic';
  else if (id === 'basement') key = 'basement';
  else if (id.includes('curb')) key = 'curb';
  else if (id.includes('walk')) key = 'walkway';
  else if (id === 'garage' || id.includes('driveway') || id.includes('road')) key = 'garage';
  else if (id === 'yard' || id.includes('garden')) key = 'yard';
  else if (id === 'pool_area') key = 'pool_area';
  else if (id === 'kennel_area') key = 'kennel_area';
  else if (id === 'secret_lab') key = 'lab';
  return `pm2-room-${key}`;
}
