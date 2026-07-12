export const TEST_ACTOR_ID = 'lab_test_subject';

function makePose(family, frameNeed, referenceStudy, fallback = 'idle', status = 'UPGRADED_FIRST_PASS') {
  return { family, status, fallback, frameNeed, referenceStudy };
}

export const TEST_ACTOR_POSE_LIBRARY = {
  idle: makePose('standing', 'breathing hold', 'overhead anatomy, adult proportions, head direction', 'procedural_person'),
  walk: makePose('locomotion', 'four frame low fps walk', 'top down stride, shoulder counter motion, no pawn sliding'),
  chair_sit: makePose('seated', 'seated hold', 'bent knees, seated pelvis, table or chair posture'),
  couch_sit: makePose('seated', 'relaxed seated hold', 'couch posture, relaxed shoulders, readable legs', 'chair_sit'),
  tv_watch: makePose('seated_object', 'long screen facing hold', 'TV watching posture, couch orientation, screen glow', 'couch_sit'),
  desk_sit: makePose('seated_object', 'desk hold', 'desk posture, elbows forward, laptop placement', 'chair_sit'),
  laptop_desk_work: makePose('seated_object', 'typing loop', 'laptop desk work, both hands, screen rectangle', 'desk_sit'),
  laptop_lap: makePose('seated_object', 'laptop lap hold', 'laptop on lap, knees and device relationship', 'couch_sit'),
  reading: makePose('seated_object', 'page hold loop', 'reading pose, book placement, arm placement', 'chair_sit'),
  phone_use: makePose('seated_object', 'phone glow hold', 'phone posture, one hand and screen glow', 'chair_sit'),
  eating_table: makePose('seated_object', 'bite loop', 'table eating, plate, cup, arms toward surface', 'chair_sit'),
  coffee_drink: makePose('standing_object', 'cup lift loop', 'cup to mouth object aware hand pose'),
  sleep_bed: makePose('lying', 'breathing loop', 'bed posture, blanket, pillow, head placement', 'procedural_sleep'),
  lying_bed_awake: makePose('lying', 'awake prop hold', 'lying awake, phone or book, head and torso relationship', 'sleep_bed'),
  floor_lounging: makePose('floor', 'floor hold', 'floor lounging, diagonals, leg readability'),
  pool_table_use: makePose('object_interaction', 'cue aim hold', 'pool cue reach, stance, object alignment'),
  console_game: makePose('seated_object', 'controller loop', 'gaming posture, hands together, screen facing', 'couch_sit'),
  cooking: makePose('standing_object', 'stir or pan loop', 'counter stance, arms forward, body square to stove'),
  cleaning: makePose('standing_object', 'wipe or reach loop', 'chore posture, one arm extended, stable stance'),
  changing_clothes: makePose('standing_object', 'outfit hold', 'closet posture, clothing prop without crude privacy shorthand'),
  lift_weights: makePose('gym_object', 'bench press rep loop', 'barbell contact, bench alignment, hands on bar, no generic stretching'),
  heavy_bag: makePose('gym_object', 'punch contact loop', 'boxing stance, extended punch, contact timing, bag relation'),
  treadmill_run: makePose('gym_object', 'belt stride loop', 'treadmill contact, feet on belt, hand rail relation'),
  soccer_kick: makePose('sport_object', 'kick contact loop', 'soccer plant foot, ball, swing leg, top down readability'),
  pet_interaction: makePose('pet', 'kneel and reach hold', 'petting posture, hand to animal, dog scale from above', 'floor_lounging'),
  cuddle_bed: makePose('social', 'shared pose later', 'couple and cuddle overlap without collision', 'sleep_bed', 'FALLBACK_FIRST_PASS'),
  reaction: makePose('emotion', 'custom reaction later', 'emotional body shape, not only bubbles', 'idle', 'FALLBACK_FIRST_PASS')
};

export const TEST_ACTOR_ACTION_TO_POSE = {
  idle: 'idle', walk: 'walk',
  sleep: 'sleep_bed', nap: 'sleep_bed', bed_together: 'cuddle_bed', intimacy: 'cuddle_bed', relax: 'lying_bed_awake',
  watch_tv: 'tv_watch', watch_together: 'tv_watch', comedy: 'tv_watch', horror: 'tv_watch', sports: 'tv_watch',
  desk_work: 'laptop_desk_work', study: 'laptop_desk_work', play_game: 'laptop_desk_work', shop: 'laptop_desk_work',
  phone: 'phone_use', read: 'reading', eat_meal: 'eating_table', sit_table: 'chair_sit', snack: 'eating_table',
  meal: 'cooking', bring_food: 'eating_table', coffee: 'coffee_drink',
  pool_solo: 'pool_table_use', pool_together: 'pool_table_use',
  arcade: 'console_game', arcade_together: 'console_game', console_game: 'console_game', console_together: 'console_game',
  clean: 'cleaning', wash_dishes: 'cleaning', take_trash_out: 'cleaning', throw_trash: 'cleaning', dump_trash: 'cleaning', brush_teeth: 'cleaning', groom: 'cleaning',
  change_clothes: 'changing_clothes', plan_week_outfits: 'changing_clothes',
  treadmill: 'treadmill_run', lift_weights: 'lift_weights', heavy_bag: 'heavy_bag',
  soccer_practice: 'soccer_kick', soccer_match: 'soccer_kick',
  pet: 'pet_interaction', train: 'pet_interaction', fetch: 'pet_interaction',
  cuddle: 'cuddle_bed', kiss: 'reaction', tickle: 'reaction', hands: 'reaction', talk: 'reaction'
};

export const TEST_ACTOR_FALLBACK_POSE = 'idle';

export function isTestActor(entity) {
  return entity?.id === TEST_ACTOR_ID && entity?.type === 'person';
}

export function activityPoseForAction(actionId, entity = null) {
  if (entity && !isTestActor(entity)) return null;
  return TEST_ACTOR_ACTION_TO_POSE[String(actionId || '').toLowerCase()] || null;
}

export function resolveTestActorPose(entity) {
  if (!isTestActor(entity)) return null;

  const actionId = String(entity.currentActionId || '').toLowerCase();
  const pose = String(entity.pose || '').toLowerCase();
  const action = String(entity.action || '').toLowerCase();
  const moving = Boolean(entity.path?.length) || Boolean(entity.target) || pose === 'walk' || action.includes('heading') || action.includes('walking to');

  if (moving && !entity.actionT) return withMeta('walk', 'movement');

  const mapped = activityPoseForAction(actionId);
  if (mapped) return withMeta(mapped, 'currentActionId');
  if (TEST_ACTOR_POSE_LIBRARY[pose]) return withMeta(pose, 'pose');

  if (action.includes('lift')) return withMeta('lift_weights', 'action');
  if (action.includes('heavy bag') || action.includes('punch')) return withMeta('heavy_bag', 'action');
  if (action.includes('treadmill') || action.includes('run')) return withMeta('treadmill_run', 'action');
  if (action.includes('soccer') || action.includes('kick')) return withMeta('soccer_kick', 'action');
  if (action.includes('sleep') || action.includes('nap')) return withMeta('sleep_bed', 'action');
  if (action.includes('waking') || action.includes('relax')) return withMeta('lying_bed_awake', 'action');
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

  return withMeta(TEST_ACTOR_FALLBACK_POSE, 'fallback');
}

function withMeta(poseId, matchedBy) {
  const definition = TEST_ACTOR_POSE_LIBRARY[poseId] || TEST_ACTOR_POSE_LIBRARY[TEST_ACTOR_FALLBACK_POSE];
  return { poseId, matchedBy, definition };
}
