import { log, say } from './state.js';

const MAX_CRUMBS = 36;
const ROBOT_SPEED = 38;

export function ensureMealState(state) {
  if (!state.meals) state.meals = { tablePlates: [] };
  if (!Array.isArray(state.meals.tablePlates)) state.meals.tablePlates = [];
  return state.meals;
}

export function ensureCleaningState(state) {
  if (!state.cleaning) state.cleaning = {};
  if (!Array.isArray(state.cleaning.crumbs)) state.cleaning.crumbs = [];
  if (!state.cleaning.robotVacuum) {
    state.cleaning.robotVacuum = { active: true, floor: 0, x: 694, y: 460, dockX: 694, dockY: 460, targetId: null, cleaned: 0 };
  }
  return state.cleaning;
}

export function placeTableMeal(state, actor, table) {
  const meals = ensureMealState(state);
  const existing = meals.tablePlates.find(p => p.actorId === actor.id && p.tableId === table.id);
  const seatIndex = actor.id === 'girlfriend' ? 1 : actor.id === 'lab_test_subject' ? 2 : 0;
  const plate = existing || { actorId: actor.id, tableId: table.id, seatIndex };
  plate.floor = table.floor;
  plate.x = table.x + table.w * (0.34 + seatIndex * 0.16);
  plate.y = table.y + table.h * 0.5;
  plate.startedAt = state.time || 0;
  plate.food = actor.carrying === 'snack' ? 'snack' : 'meal';
  if (!existing) meals.tablePlates.push(plate);
  actor.carrying = null;
  actor.mealSeat = { tableId: table.id, x: plate.x, y: plate.y };
  return plate;
}

export function clearTableMealForActor(state, actor) {
  const meals = ensureMealState(state);
  meals.tablePlates = meals.tablePlates.filter(p => p.actorId !== actor.id);
  actor.mealSeat = null;
}

export function spawnCrumbs(state, actor, amount = 3, source = 'meal') {
  const cleaning = ensureCleaningState(state);
  const room = actor.room || null;
  const count = Math.max(1, Math.min(6, amount));
  for (let i = 0; i < count; i++) {
    const angle = (i / count) * Math.PI * 2 + (state.time || 0) * 0.01;
    const radius = 12 + i * 4;
    cleaning.crumbs.push({
      id: `${actor.id}_${Math.round(state.time || 0)}_${Math.round(actor.x)}_${i}`,
      floor: actor.floor,
      room,
      x: actor.x + Math.cos(angle) * radius,
      y: actor.y + Math.sin(angle) * radius * 0.7,
      source,
      amount: 1,
      createdAt: state.time || 0
    });
  }
  cleaning.crumbs = cleaning.crumbs.slice(-MAX_CRUMBS);
}

export function cleanCrumbsNear(state, actor, radius = 116) {
  const cleaning = ensureCleaningState(state);
  const before = cleaning.crumbs.length;
  cleaning.crumbs = cleaning.crumbs.filter(c => c.floor !== actor.floor || Math.hypot(c.x - actor.x, c.y - actor.y) > radius);
  const cleaned = before - cleaning.crumbs.length;
  if (cleaned > 0) {
    log(state, `${actor.name} vacuumed ${cleaned} crumb spot${cleaned === 1 ? '' : 's'}.`);
    say(actor, 'CLEAN');
  } else {
    log(state, `${actor.name} vacuumed, but there were no crumbs nearby.`);
    say(actor, 'clear');
  }
  return cleaned;
}

export function startRobotVacuum(state, robotObject = null) {
  const cleaning = ensureCleaningState(state);
  const robot = cleaning.robotVacuum;
  robot.active = true;
  if (robotObject) {
    robot.floor = robotObject.floor;
    robot.x = robotObject.x + robotObject.w / 2;
    robot.y = robotObject.y + robotObject.h / 2;
    robot.dockX = robot.x;
    robot.dockY = robot.y;
  }
  robot.targetId = null;
  log(state, 'The robot vacuum is running and will hunt crumbs on the floor.');
}

export function updateRobotVacuum(state, dt) {
  const cleaning = ensureCleaningState(state);
  const robot = cleaning.robotVacuum;
  if (!robot.active) return;
  const crumbs = cleaning.crumbs.filter(c => c.floor === robot.floor);
  if (!crumbs.length) {
    moveRobotToward(robot, robot.dockX, robot.dockY, dt);
    return;
  }
  const target = crumbs.sort((a, b) => Math.hypot(a.x - robot.x, a.y - robot.y) - Math.hypot(b.x - robot.x, b.y - robot.y))[0];
  moveRobotToward(robot, target.x, target.y, dt);
  if (Math.hypot(target.x - robot.x, target.y - robot.y) < 18) {
    cleaning.crumbs = cleaning.crumbs.filter(c => c.id !== target.id);
    robot.cleaned = (robot.cleaned || 0) + 1;
  }
}

function moveRobotToward(robot, x, y, dt) {
  const dx = x - robot.x;
  const dy = y - robot.y;
  const dist = Math.hypot(dx, dy);
  if (dist < 1) return;
  const step = Math.min(dist, ROBOT_SPEED * dt);
  robot.x += dx / dist * step;
  robot.y += dy / dist * step;
}
