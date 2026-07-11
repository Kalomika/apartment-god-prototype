export const TEST_ACTOR_ID = 'lab_test_subject';

export const TEST_ACTOR_POSE_LIBRARY = {
  idle: {
    family: 'standing',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'procedural_person',
    frameNeed: 'semi static idle loop',
    referenceStudy: 'top down generic overhead anatomy, head direction, shoulder mass, arm separation'
  },
  walk: {
    family: 'locomotion',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    frameNeed: 'four frame low fps walk feel',
    referenceStudy: 'top down foot spacing, shoulder counter motion, readable adult proportions'
  },
  chair_sit: {
    family: 'seated',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    objectFamilies: ['chair', 'dining_table'],
    frameNeed: 'static hold plus breathing',
    referenceStudy: 'seated top down pelvis, bent knees, arms resting on surface'
  },
  couch_sit: {
    family: 'seated',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'chair_sit',
    objectFamilies: ['couch'],
    frameNeed: 'static hold',
    referenceStudy: 'couch seated back pose, relaxed shoulders, readable bent legs'
  },
  tv_watch: {
    family: 'seated_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'couch_sit',
    objectFamilies: ['tv', 'couch'],
    frameNeed: 'long hold with subtle screen glow',
    referenceStudy: 'screen facing couch posture, lap hands, relaxed knees'
  },
  desk_sit: {
    family: 'seated_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'chair_sit',
    objectFamilies: ['desk'],
    frameNeed: 'static hold plus hand motion',
    referenceStudy: 'desk and laptop posture from above, elbows forward, neck direction'
  },
  laptop_desk_work: {
    family: 'seated_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'desk_sit',
    objectFamilies: ['desk', 'laptop'],
    frameNeed: 'short typing loop',
    referenceStudy: 'laptop desk work, both hands, screen rectangle, shoulder angle'
  },
  laptop_lap: {
    family: 'seated_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'couch_sit',
    objectFamilies: ['couch', 'bed'],
    frameNeed: 'semi static hold',
    referenceStudy: 'laptop on lap, knees and device relationship'
  },
  reading: {
    family: 'seated_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'chair_sit',
    objectFamilies: ['bookshelf', 'couch', 'floor'],
    frameNeed: 'page hold with tiny hand adjustment',
    referenceStudy: 'reading pose, book placement, top down arm placement'
  },
  phone_use: {
    family: 'seated_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'chair_sit',
    objectFamilies: ['chair', 'couch', 'bed'],
    frameNeed: 'phone glow hold',
    referenceStudy: 'phone posture, one hand close to head, screen glow readability'
  },
  eating_table: {
    family: 'seated_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'chair_sit',
    objectFamilies: ['dining_table'],
    frameNeed: 'small bite loop',
    referenceStudy: 'table eating posture, plate, cup, bent arms toward surface'
  },
  coffee_drink: {
    family: 'standing_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    objectFamilies: ['coffee_maker', 'dining_table'],
    frameNeed: 'cup lift loop',
    referenceStudy: 'object aware hand to cup pose'
  },
  sleep_bed: {
    family: 'lying',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'procedural_sleep',
    objectFamilies: ['bed'],
    frameNeed: 'quiet breathing loop',
    referenceStudy: 'bed posture, blanket coverage, pillow and head placement'
  },
  lying_bed_awake: {
    family: 'lying',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'sleep_bed',
    objectFamilies: ['bed'],
    frameNeed: 'awake hold with prop option',
    referenceStudy: 'lying awake, phone or book, head and torso relationship'
  },
  floor_lounging: {
    family: 'floor',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    objectFamilies: ['floor'],
    frameNeed: 'static hold',
    referenceStudy: 'floor lounging, diagonals, leg readability from above'
  },
  pool_table_use: {
    family: 'object_interaction',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    objectFamilies: ['pool_table'],
    frameNeed: 'cue aim hold',
    referenceStudy: 'object aligned reach pose, long prop line, stance readability'
  },
  console_game: {
    family: 'seated_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'couch_sit',
    objectFamilies: ['game_console', 'arcade'],
    frameNeed: 'controller hand loop',
    referenceStudy: 'gaming posture, hands close together, screen-facing silhouette'
  },
  cooking: {
    family: 'standing_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    objectFamilies: ['stove', 'fridge'],
    frameNeed: 'pan or counter hand loop',
    referenceStudy: 'counter stance, arms forward, body square to object'
  },
  cleaning: {
    family: 'standing_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    objectFamilies: ['sink', 'trash_can'],
    frameNeed: 'wipe or reach loop',
    referenceStudy: 'chore posture, one arm extended, stable stance'
  },
  changing_clothes: {
    family: 'standing_object',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    objectFamilies: ['closet'],
    frameNeed: 'outfit hold transition',
    referenceStudy: 'closet posture and clothing prop without crude privacy shorthand'
  },
  workout_stretch: {
    family: 'floor_or_gym',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'idle',
    objectFamilies: ['treadmill', 'weight_bench', 'heavy_bag', 'soccer_field'],
    frameNeed: 'strong activity silhouette',
    referenceStudy: 'active pose spacing, readable limbs, contact timing'
  },
  pet_interaction: {
    family: 'pet',
    status: 'UPGRADED_FIRST_PASS',
    fallback: 'floor_lounging',
    objectFamilies: ['dog', 'kennel'],
    frameNeed: 'kneel and reach hold',
    referenceStudy: 'pet interaction, hand to animal, dog resting scale from above'
  },
  cuddle_bed: {
    family: 'social',
    status: 'FALLBACK_FIRST_PASS',
    fallback: 'sleep_bed',
    objectFamilies: ['bed', 'couch'],
    frameNeed: 'shared pose set later',
    referenceStudy: 'couple and cuddle references, shared overlap without collision'
  },
  reaction: {
    family: 'emotion',
    status: 'FALLBACK_FIRST_PASS',
    fallback: 'idle',
    frameNeed: 'custom emotion sheets later',
    referenceStudy: 'emotional pose clarity, not only bubbles'
  }
};

export const TEST_ACTOR_ACTION_TO_POSE = {
  idle: 'idle',
  walk: 'walk',
  sleep: 'sleep_bed',
  nap: 'sleep_bed',
  bed_together: 'cuddle_bed',
  intimacy: 'cuddle_bed',
  relax: 'lying_bed_awake',
  watch_tv: 'tv_watch',
  watch_together: 'tv_watch',
  comedy: 'tv_watch',
  horror: 'tv_watch',
  sports: 'tv_watch',
  desk_work: 'laptop_desk_work',
  study: 'laptop_desk_work',
  play_game: 'laptop_desk_work',
  shop: 'laptop_desk_work',
  phone: 'phone_use',
  read: 'reading',
  eat_meal: 'eating_table',
  sit_table: 'chair_sit',
  snack: 'eating_table',
  meal: 'cooking',
  bring_food: 'eating_table',
  coffee: 'coffee_drink',
  pool_solo: 'pool_table_use',
  pool_together: 'pool_table_use',
  arcade: 'console_game',
  arcade_together: 'console_game',
  console_game: 'console_game',
  console_together: 'console_game',
  clean: 'cleaning',
  wash_dishes: 'cleaning',
  take_trash_out: 'cleaning',
  throw_trash: 'cleaning',
  dump_trash: 'cleaning',
  brush_teeth: 'cleaning',
  groom: 'cleaning',
  change_clothes: 'changing_clothes',
  plan_week_outfits: 'changing_clothes',
  treadmill: 'workout_stretch',
  lift_weights: 'workout_stretch',
  heavy_bag: 'workout_stretch',
  soccer_practice: 'workout_stretch',
  soccer_match: 'workout_stretch',
  pet: 'pet_interaction',
  train: 'pet_interaction',
  fetch: 'pet_interaction',
  cuddle: 'cuddle_bed',
  kiss: 'reaction',
  tickle: 'reaction',
  hands: 'reaction',
  talk: 'reaction'
};

export const TEST_ACTOR_FALLBACK_POSE = 'idle';

export function isTestActor(entity) {
  return entity?.id === TEST_ACTOR_ID && entity?.type === 'person';
}

export function activityPoseForAction(actionId, entity = null) {
  if (entity && !isTestActor(entity)) return null;
  const key = String(actionId || '').toLowerCase();
  return TEST_ACTOR_ACTION_TO_POSE[key] || null;
}

export function resolveTestActorPose(entity) {
  if (!isTestActor(entity)) return null;
  const actionId = String(entity.currentActionId || '').toLowerCase();
  const pose = String(entity.pose || '').toLowerCase();
  const action = String(entity.action || '').toLowerCase();
  const moving = Boolean(entity.path?.length) || pose === 'walk' || action.includes('heading');

  if (moving && !entity.actionT) return withMeta('walk', 'path');
  if (TEST_ACTOR_POSE_LIBRARY[pose]) return withMeta(pose, 'pose');
  if (activityPoseForAction(actionId)) return withMeta(activityPoseForAction(actionId), 'currentActionId');

  if (action.includes('waking')) return withMeta('lying_bed_awake', 'action');
  if (action.includes('sleep') || action.includes('nap')) return withMeta('sleep_bed', 'action');
  if (action.includes('laptop') || action.includes('desk')) return withMeta('laptop_desk_work', 'action');
  if (action.includes('phone')) return withMeta('phone_use', 'action');
  if (action.includes('read') || action.includes('book')) return withMeta('reading', 'action');
  if (action.includes('eat') || action.includes('table') || action.includes('snack')) return withMeta('eating_table', 'action');
  if (action.includes('coffee')) return withMeta('coffee_drink', 'action');
  if (action.includes('tv') || action.includes('watch')) return withMeta('tv_watch', 'action');
  if (action.includes('game') || action.includes('console') || action.includes('arcade')) return withMeta('console_game', 'action');
  if (action.includes('pool')) return withMeta('pool_table_use', 'action');
  if (action.includes('clean') || action.includes('wash') || action.includes('trash')) return withMeta('cleaning', 'action');
  if (action.includes('clothes') || action.includes('outfit')) return withMeta('changing_clothes', 'action');
  if (action.includes('pet') || action.includes('train') || action.includes('fetch')) return withMeta('pet_interaction', 'action');
  if (action.includes('couch')) return withMeta('couch_sit', 'action');
  if (action.includes('floor')) return withMeta('floor_lounging', 'action');
  if (action.includes('soccer') || action.includes('treadmill') || action.includes('lift') || action.includes('heavy bag')) return withMeta('workout_stretch', 'action');

  return withMeta(TEST_ACTOR_FALLBACK_POSE, 'fallback');
}

function withMeta(poseId, matchedBy) {
  const definition = TEST_ACTOR_POSE_LIBRARY[poseId] || TEST_ACTOR_POSE_LIBRARY[TEST_ACTOR_FALLBACK_POSE];
  return { poseId, matchedBy, definition };
}
