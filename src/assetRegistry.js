/*
 * Asset registry for production visuals.
 * Final art must be loaded from files, not authored with runtime primitives.
 */

export const FALLBACK_ASSET_KEY = 'fallback_missing_asset';

export const ASSET_ENTRIES = [
  { key: FALLBACK_ASSET_KEY, type: 'svg', path: 'assets/sprites/ui/missing_asset.svg' },
  { key: 'floor_wood_tile', type: 'svg', path: 'assets/sprites/rooms/floor_wood_tile.svg' },
  { key: 'floor_tile_neutral', type: 'svg', path: 'assets/sprites/rooms/floor_tile_neutral.svg' },
  { key: 'object_couch_main', type: 'svg', path: 'assets/sprites/objects/couch_main.svg' },
  { key: 'object_bed_main', type: 'svg', path: 'assets/sprites/objects/bed_main.svg' },
  { key: 'object_fridge_main', type: 'svg', path: 'assets/sprites/objects/fridge_main.svg' },
  { key: 'object_stove_main', type: 'svg', path: 'assets/sprites/objects/stove_main.svg' },
  { key: 'object_sink_main', type: 'svg', path: 'assets/sprites/objects/sink_main.svg' },
  { key: 'object_shower_main', type: 'svg', path: 'assets/sprites/objects/shower_main.svg' },
  { key: 'object_toilet_main', type: 'svg', path: 'assets/sprites/objects/toilet_main.svg' },
  { key: 'object_tv_main', type: 'svg', path: 'assets/sprites/objects/tv_main.svg' },
  { key: 'object_desk_computer', type: 'svg', path: 'assets/sprites/objects/desk_computer.svg' },
  { key: 'object_pool_table_main', type: 'svg', path: 'assets/sprites/objects/pool_table_main.svg' },
  { key: 'object_arcade_main', type: 'svg', path: 'assets/sprites/objects/arcade_main.svg' },
  { key: 'object_console_setup', type: 'svg', path: 'assets/sprites/objects/console_setup.svg' },
  { key: 'object_bookshelf_main', type: 'svg', path: 'assets/sprites/objects/bookshelf_main.svg' },
  { key: 'object_swim_pool', type: 'svg', path: 'assets/sprites/objects/swim_pool.svg' },
  { key: 'object_kennel', type: 'svg', path: 'assets/sprites/objects/kennel.svg' },
  { key: 'object_treadmill', type: 'svg', path: 'assets/sprites/objects/treadmill.svg' },
  { key: 'object_weight_bench', type: 'svg', path: 'assets/sprites/objects/weight_bench.svg' },
  { key: 'object_heavy_bag', type: 'svg', path: 'assets/sprites/objects/heavy_bag.svg' },
  { key: 'object_trash_can', type: 'svg', path: 'assets/sprites/objects/trash_can.svg' },
  { key: 'object_dog_bowl', type: 'svg', path: 'assets/sprites/objects/dog_bowl.svg' },
  { key: 'object_stairs', type: 'svg', path: 'assets/sprites/objects/stairs.svg' },
  { key: 'object_door', type: 'svg', path: 'assets/sprites/objects/door.svg' },
  { key: 'vehicle_family_car_top', type: 'svg', path: 'assets/sprites/vehicles/family_car_top.svg' },
  { key: 'vehicle_sports_car_top', type: 'svg', path: 'assets/sprites/vehicles/sports_car_top.svg' },
  { key: 'vehicle_bike_top', type: 'svg', path: 'assets/sprites/vehicles/bike_top.svg' },
  { key: 'vehicle_motorbike_top', type: 'svg', path: 'assets/sprites/vehicles/motorbike_top.svg' },
  { key: 'character_resident_idle', type: 'svg', path: 'assets/sprites/characters/resident_idle.svg' },
  { key: 'character_girlfriend_idle', type: 'svg', path: 'assets/sprites/characters/girlfriend_idle.svg' },
  { key: 'character_dog_idle', type: 'svg', path: 'assets/sprites/characters/dog_idle.svg' }
];

const OBJECT_KIND_TO_ASSET = {
  couch: 'object_couch_main',
  bed: 'object_bed_main',
  fridge: 'object_fridge_main',
  stove: 'object_stove_main',
  sink: 'object_sink_main',
  shower: 'object_shower_main',
  toilet: 'object_toilet_main',
  tv: 'object_tv_main',
  desk: 'object_desk_computer',
  pool_table: 'object_pool_table_main',
  arcade: 'object_arcade_main',
  game_console: 'object_console_setup',
  bookshelf: 'object_bookshelf_main',
  swim_pool: 'object_swim_pool',
  kennel: 'object_kennel',
  treadmill: 'object_treadmill',
  weight_bench: 'object_weight_bench',
  heavy_bag: 'object_heavy_bag',
  trash_can: 'object_trash_can',
  outdoor_trash: 'object_trash_can',
  dog_bowl: 'object_dog_bowl',
  stairs: 'object_stairs',
  door: 'object_door',
  pet_flap: 'object_door',
  bike: 'vehicle_bike_top',
  motorbike: 'vehicle_motorbike_top'
};

export function assetForObject(object) {
  if (!object) return FALLBACK_ASSET_KEY;
  if (object.kind === 'car') return object.id === 'car_2' ? 'vehicle_sports_car_top' : 'vehicle_family_car_top';
  return OBJECT_KIND_TO_ASSET[object.kind] || FALLBACK_ASSET_KEY;
}

export function assetForVehicle(vehicle) {
  if (!vehicle) return FALLBACK_ASSET_KEY;
  if (vehicle.vehicleId === 'car_2' || vehicle.id === 'car_2') return 'vehicle_sports_car_top';
  if (vehicle.vehicleKind === 'bike' || vehicle.kind === 'bike') return 'vehicle_bike_top';
  if (vehicle.vehicleKind === 'motorbike' || vehicle.kind === 'motorbike') return 'vehicle_motorbike_top';
  return 'vehicle_family_car_top';
}

export function assetForCharacter(entity) {
  if (!entity) return FALLBACK_ASSET_KEY;
  if (entity.type === 'dog') return 'character_dog_idle';
  if (entity.id === 'girlfriend') return 'character_girlfriend_idle';
  return 'character_resident_idle';
}

export function roomFloorAsset(room) {
  const id = room?.id || '';
  if (id.includes('bath') || id.includes('garage') || id.includes('pool')) return 'floor_tile_neutral';
  return 'floor_wood_tile';
}

export function requiredAssetKeys() {
  return ASSET_ENTRIES.map(entry => entry.key);
}
