import { markBookingStatus, upcomingBookings } from './calendarSystem.js';
import { commandMove } from './movement.js';
import { changeNeed, log, say, setMood } from './state.js';
import { getObject, roomAt } from './world.js';

const BOOK_READ_DURATION = 32;
const BOOK_RETURN_DURATION = 8;
const LIVING_COUCH_SEATS = [
  { id: 'l_couch_left_read', label: 'left side of the L couch', floor: 0, x: 192, y: 244, surfaceX: 188, surfaceY: 214, surfaceLabel: 'L couch cushion' },
  { id: 'l_couch_chaise_read', label: 'chaise side of the L couch', floor: 0, x: 300, y: 244, surfaceX: 304, surfaceY: 218, surfaceLabel: 'L couch chaise' }
];
const OUTSIDE_READING_SEATS = [
  { id: 'front_porch_read_chair_1', label: 'front porch reading chair', floor: 0, x: 184, y: 626, surfaceX: 182, surfaceY: 612, surfaceLabel: 'porch chair' },
  { id: 'front_porch_read_chair_2', label: 'second front porch reading chair', floor: 0, x: 274, y: 626, surfaceX: 272, surfaceY: 612, surfaceLabel: 'porch chair' }
];

export function ensureBookState(state) {
  state.books ??= { loose: [], returned: 0 };
  state.books.loose = Array.isArray(state.books.loose) ? state.books.loose.filter(Boolean).slice(-20) : [];
  state.tidiness ??= { rooms: {} };
  state.tidiness.rooms ??= {};
  return state.books;
}

export function startBookReadingRoute(state, actor, shelf) {
  if (!actor || !shelf) return false;
  ensureBookState(state);
  const seat = chooseReadingSeat(state, actor);
  actor.bookReading = false;
  actor.trainingSkill = 'intellect';
  actor.carrying = 'book';
  actor.bookTask = {
    shelfId: shelf.id,
    seatId: seat.id,
    seatLabel: seat.label,
    surfaceX: seat.surfaceX,
    surfaceY: seat.surfaceY,
    surfaceLabel: seat.surfaceLabel,
    startedAt: state.time || 0
  };
  state.objectState.bookOut = shelf.id;
  commandMove(actor, seat.x, seat.y, false);
  actor.target = { type: 'bookSeat', ...actor.bookTask };
  actor.action = `Taking book to ${seat.label}`;
  actor.pose = 'walk';
  say(actor, 'BOOK');
  log(state, `${actor.name} pulled a book from ${shelf.label || 'the bookshelf'} and is taking it to ${seat.label}.`);
  return true;
}

function chooseReadingSeat(state, actor) {
  const couchBusy = state.entities?.some(e => e.id !== actor.id && !e.hidden && e.floor === 0 && actorUsingCouch(e));
  if (couchBusy) return LIVING_COUCH_SEATS[1];
  const wantsOutside = (state.time || 0) % 3 > 1.8 && !nextCommitmentSoon(state, actor, 45);
  if (wantsOutside) return OUTSIDE_READING_SEATS[0];
  return LIVING_COUCH_SEATS[0];
}

function actorUsingCouch(actor) {
  const action = String(actor.action || '').toLowerCase();
  const pose = String(actor.pose || '').toLowerCase();
  return pose === 'sit' || action.includes('watch') || action.includes('tv') || action.includes('movie') || action.includes('couch') || action.includes('relax');
}

export function startBookReadingAtSeat(state, actor, target) {
  ensureBookState(state);
  actor.bookReading = true;
  actor.trainingSkill = 'intellect';
  actor.carrying = 'book';
  actor.bookTask = { ...(actor.bookTask || {}), ...target };
  actor.action = `Reading book on ${target.seatLabel || 'seat'}`;
  actor.actionT = BOOK_READ_DURATION;
  actor.actionTotal = BOOK_READ_DURATION;
  actor.currentActionId = 'read_carried_book';
  actor.pose = 'sit';
  changeNeed(actor, 'fun', -2);
  changeNeed(actor, 'stamina', -4);
  say(actor, 'READ');
  log(state, `${actor.name} sat down and started reading.`);
  return true;
}

export function finishBookReading(state, actor) {
  ensureBookState(state);
  const skill = 'intellect';
  const current = actor.skills?.[skill] ?? 1;
  const cap = actor.skillCaps?.[skill] ?? 6;
  const learning = actor.skills?.learning ?? 2;
  const gain = 0.28 + learning * 0.05;
  actor.skills[skill] = Math.min(cap, +(current + gain).toFixed(2));
  changeNeed(actor, 'fun', 8);
  setMood(actor, 'calm');
  log(state, `${actor.name} improved intellect to ${actor.skills[skill].toFixed(1)} through book reading.`);

  if (shouldReturnBookNow(state, actor)) {
    const routed = routeBookBackToShelf(state, actor, actor.bookTask?.shelfId || 'bookshelf');
    if (routed) return true;
  }

  leaveBookOnSurface(state, actor, 'left after reading');
  return false;
}

function shouldReturnBookNow(state, actor) {
  if (nextCommitmentSoon(state, actor, 35)) return false;
  if ((actor.needs?.bladder ?? 100) < 20 || (actor.needs?.hunger ?? 100) < 18 || (actor.needs?.energy ?? 100) < 14) return false;
  if (actor.traits?.meticulous) return Math.random() > 0.12;
  return Math.random() > 0.34;
}

function nextCommitmentSoon(state, actor, minutes) {
  const next = upcomingBookings(state, actor, 1)[0];
  if (!next) return false;
  return next.startMinute - (state.time || 0) <= minutes;
}

function routeBookBackToShelf(state, actor, shelfId = 'bookshelf', bookId = '') {
  const shelf = getObject(shelfId) || getObject('bookshelf');
  if (!shelf) return false;
  actor.carrying = 'book';
  actor.bookReading = false;
  actor.trainingSkill = null;
  commandMove(actor, shelf.x + shelf.w + 42, shelf.y + shelf.h / 2, false, shelf.id);
  actor.target = { type: 'bookShelfReturn', shelfId: shelf.id, bookId };
  actor.action = bookId ? 'Returning loose book to shelf' : 'Returning book to shelf';
  actor.currentActionId = 'return_book';
  actor.pose = 'walk';
  say(actor, 'RETURN');
  return true;
}

export function finishBookReturnAtShelf(state, actor, target = {}) {
  ensureBookState(state);
  if (target.bookId) {
    const before = state.books.loose.length;
    state.books.loose = state.books.loose.filter(book => book.id !== target.bookId);
    if (before !== state.books.loose.length) improveTidinessAtActor(state, actor, 7);
    if (target.bookingId) markBookingStatus(state, target.bookingId, 'completed');
    log(state, `${actor.name} put the loose book back on the bookshelf.`);
  } else {
    log(state, `${actor.name} returned the book to the bookshelf.`);
  }
  state.objectState.bookOut = false;
  state.books.returned = (state.books.returned || 0) + 1;
  actor.carrying = null;
  actor.bookReading = false;
  actor.bookTask = null;
  actor.trainingSkill = null;
  actor.action = 'Idle';
  actor.actionT = 0;
  actor.actionTotal = 0;
  actor.currentActionId = null;
  actor.pose = 'stand';
  setMood(actor, 'calm');
  say(actor, 'TIDY');
  return true;
}

export function interruptBookIfNeeded(state, actor, reason = 'interrupted') {
  if (!actor || actor.carrying !== 'book' && !actor.bookReading && actor.currentActionId !== 'read_carried_book') return false;
  ensureBookState(state);
  leaveBookOnSurface(state, actor, reason);
  actor.carrying = null;
  actor.bookReading = false;
  actor.bookTask = null;
  actor.trainingSkill = null;
  actor.currentActionId = null;
  return true;
}

function leaveBookOnSurface(state, actor, reason) {
  ensureBookState(state);
  const surface = surfaceForActor(state, actor);
  const room = roomAt(actor.x, actor.y, actor.floor)?.id || surface.room || `floor_${actor.floor}`;
  const book = {
    id: `loose_book_${Math.floor(state.time || 0)}_${actor.id}_${Math.floor(Math.random() * 9999)}`,
    actorId: actor.id,
    shelfId: actor.bookTask?.shelfId || 'bookshelf',
    floor: surface.floor ?? actor.floor,
    room,
    x: surface.x,
    y: surface.y,
    surfaceLabel: surface.label,
    createdAt: state.time || 0,
    reason
  };
  state.books.loose.push(book);
  state.books.loose = state.books.loose.slice(-20);
  hitTidiness(state, room, 8);
  scheduleBookReturn(state, actor, book);
  state.objectState.bookOut = book.shelfId;
  actor.carrying = null;
  actor.bookReading = false;
  say(actor, 'LATER');
  log(state, `${actor.name} left a book on the ${book.surfaceLabel} because ${reason}.`);
  return book;
}

function surfaceForActor(state, actor) {
  const task = actor.bookTask || {};
  if (Number.isFinite(task.surfaceX) && Number.isFinite(task.surfaceY)) return { x: task.surfaceX, y: task.surfaceY, floor: actor.floor, label: task.surfaceLabel || 'nearby surface' };
  const surfaces = [
    { id: 'couch', label: 'L couch cushion' },
    { id: 'dining_table', label: 'dining table' },
    { id: 'desk', label: 'desk' },
    { id: 'bed', label: 'bed' },
    { id: 'bookshelf', label: 'bookshelf ledge' }
  ].map(item => ({ ...item, obj: getObject(item.id) })).filter(item => item.obj && item.obj.floor === actor.floor);
  surfaces.sort((a, b) => distanceToObj(actor, a.obj) - distanceToObj(actor, b.obj));
  const nearest = surfaces[0];
  if (nearest) return { x: nearest.obj.x + nearest.obj.w / 2, y: nearest.obj.y + 14, floor: nearest.obj.floor, label: nearest.label };
  return { x: actor.x + 12, y: actor.y + 8, floor: actor.floor, label: 'nearby chair' };
}

function distanceToObj(actor, obj) {
  return Math.hypot(actor.x - (obj.x + obj.w / 2), actor.y - (obj.y + obj.h / 2));
}

function hitTidiness(state, room, amount) {
  state.tidiness ??= { rooms: {} };
  state.tidiness.rooms ??= {};
  state.tidiness.rooms[room] = Math.max(0, Math.min(100, (state.tidiness.rooms[room] || 0) + amount));
}

function improveTidinessAtActor(state, actor, amount) {
  const room = roomAt(actor.x, actor.y, actor.floor)?.id || `floor_${actor.floor}`;
  state.tidiness ??= { rooms: {} };
  state.tidiness.rooms ??= {};
  state.tidiness.rooms[room] = Math.max(0, (state.tidiness.rooms[room] || 0) - amount);
}

function scheduleBookReturn(state, actor, book) {
  state.calendar ??= { bookings: [], history: [] };
  state.calendar.bookings ??= [];
  const existing = state.calendar.bookings.find(b => b.status === 'scheduled' && b.type === 'chore' && b.actionId === 'return_loose_book' && b.bookId === book.id);
  if (existing) return;
  const startMinute = Math.floor((state.time || 0) + (nextCommitmentSoon(state, actor, 60) ? 90 : 45));
  state.calendar.bookings.push({
    id: `booking_${Math.floor(state.time || 0)}_${actor.id}_return_book_${Math.floor(Math.random() * 9999)}`,
    type: 'chore',
    actionId: 'return_loose_book',
    actorId: actor.id,
    invitedIds: [],
    vehicleId: 'none',
    label: 'Return loose book',
    createdAt: state.time || 0,
    startMinute,
    duration: BOOK_RETURN_DURATION,
    cost: 0,
    extraCost: 0,
    status: 'scheduled',
    bookId: book.id
  });
  state.calendar.bookings = state.calendar.bookings.slice(-24);
  log(state, `${actor.name} put Return loose book on the calendar.`);
}

export function startBookReturnChore(state, actor, booking) {
  ensureBookState(state);
  const book = state.books.loose.find(item => item.id === booking.bookId) || state.books.loose.find(item => item.actorId === actor.id) || state.books.loose[0];
  if (!book) {
    markBookingStatus(state, booking.id, 'completed');
    log(state, 'No loose book needed returning.');
    return false;
  }
  if (actor.floor !== book.floor) {
    log(state, `${actor.name} needs to reach the loose book before returning it.`);
    return false;
  }
  commandMove(actor, book.x, book.y, false);
  actor.target = { type: 'looseBook', bookId: book.id, bookingId: booking.id };
  actor.action = 'Going to pick up loose book';
  actor.pose = 'walk';
  actor.currentActionId = 'return_loose_book';
  say(actor, 'TIDY');
  return true;
}

export function startLooseBookReturnFromSurface(state, actor, target) {
  ensureBookState(state);
  const book = state.books.loose.find(item => item.id === target.bookId);
  if (!book) return false;
  actor.carrying = 'book';
  actor.bookTask = { shelfId: book.shelfId || 'bookshelf' };
  return routeBookBackToShelf(state, actor, book.shelfId || 'bookshelf', book.id);
}

export function visibleLooseBooks(state) {
  ensureBookState(state);
  return state.books.loose.filter(book => book.floor === state.floor);
}

export function readingFurnitureForFloor(floor) {
  if (floor !== 0) return [];
  return [...LIVING_COUCH_SEATS, ...OUTSIDE_READING_SEATS];
}
