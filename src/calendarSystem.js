import { destinationFor, hasTravelPass, VACATION_DESTINATIONS } from './travelLocations.js';
import { changeNeed, log, say } from './state.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Dawn', 'Bloom', 'Ember', 'Rain', 'Suncrest', 'Harvest', 'Gold', 'Shadow', 'Hearth', 'Frost', 'Star', 'Renewal'];
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR;
const CALENDAR_EPOCH_DAY_OFFSET = 1;
const VACATION_EXTRA_HOUR_COST = 80;

export const WORLD_HOLIDAYS = [
  { id: 'renewal_day', name: 'Renewal Day', month: 0, day: 1, note: 'fresh start, clean home, reset intentions' },
  { id: 'love_day', name: 'Love Day', month: 1, day: 14, note: 'romance, dates, gifts, affection' },
  { id: 'kin_day', name: 'Kin Day', month: 4, day: 21, note: 'chosen family, friends, shared meal' },
  { id: 'gratitude_feast', name: 'Gratitude Feast', month: 8, day: 24, note: 'feast without conquest mythology' },
  { id: 'gift_night', name: 'Gift Night', month: 10, day: 25, note: 'winter gift day, music, warm food' },
  { id: 'dreamwake', name: 'Dreamwake', month: 11, day: 30, note: 'year end reflection and plans' }
];

export function ensureCalendar(state) {
  const existing = state.calendar || {};
  state.calendar = {
    year: Number.isFinite(existing.year) ? existing.year : 1,
    bookings: Array.isArray(existing.bookings) ? existing.bookings.filter(Boolean).slice(-24) : [],
    history: Array.isArray(existing.history) ? existing.history.slice(-24) : [],
    holidays: Array.isArray(existing.holidays) && existing.holidays.length ? existing.holidays : WORLD_HOLIDAYS
  };
  for (const booking of state.calendar.bookings) normalizeBooking(state, booking);
  return state.calendar;
}

function normalizeBooking(state, booking) {
  booking.id ||= `booking_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
  booking.type ||= 'travel';
  booking.actionId ||= 'errand';
  booking.actorId ||= 'resident';
  booking.invitedIds = Array.isArray(booking.invitedIds) ? booking.invitedIds : [];
  booking.vehicleId ||= 'auto';
  booking.createdAt = Number.isFinite(booking.createdAt) ? booking.createdAt : 0;
  booking.startMinute = Number.isFinite(booking.startMinute) ? booking.startMinute : 0;
  booking.status ||= 'scheduled';
  const destination = destinationFor(booking.actionId);
  booking.label ||= destination?.label || booking.actionId.replaceAll('_', ' ');
  booking.duration = Number.isFinite(booking.duration) ? booking.duration : destination?.duration || 30;
  booking.cost = Number.isFinite(booking.cost) ? booking.cost : bookingCost(state, booking.actionId, booking.duration);
  booking.extraCost = Number.isFinite(booking.extraCost) ? booking.extraCost : Math.max(0, booking.cost - baseTravelCost(state, booking.actionId));
  return booking;
}

export function gameDay(state) {
  return Math.floor((state.time || 0) / 1440);
}

export function minuteOfDay(stateOrMinute) {
  const total = typeof stateOrMinute === 'number' ? stateOrMinute : stateOrMinute?.time || 0;
  return ((Math.floor(total) % 1440) + 1440) % 1440;
}

export function dayNameForMinute(totalMinute) {
  return DAY_NAMES[Math.floor(totalMinute / 1440) % 7];
}

export function timeText(totalMinute) {
  const m = minuteOfDay(totalMinute);
  const h = Math.floor(m / 60);
  const mm = String(m % 60).padStart(2, '0');
  const suffix = h >= 12 ? 'PM' : 'AM';
  const hh = ((h + 11) % 12) + 1;
  return `${hh}:${mm} ${suffix}`;
}

export function calendarDateForMinute(totalMinute) {
  const absoluteDay = Math.max(0, Math.floor(totalMinute / 1440));
  const calendarDay = Math.max(0, absoluteDay - CALENDAR_EPOCH_DAY_OFFSET);
  const year = Math.floor(calendarDay / DAYS_PER_YEAR) + 1;
  const dayOfYear = calendarDay % DAYS_PER_YEAR;
  const month = Math.floor(dayOfYear / DAYS_PER_MONTH);
  const day = dayOfYear % DAYS_PER_MONTH + 1;
  const week = Math.floor(calendarDay / 7) + 1;
  return { absoluteDay, calendarDay, year, month, monthName: MONTH_NAMES[month], day, week, dayName: DAY_NAMES[absoluteDay % 7] };
}

export function calendarDateLabel(state) {
  const d = calendarDateForMinute(state.time || 0);
  const holiday = holidayForMinute(state.time || 0);
  return `${d.dayName}, ${d.monthName} ${d.day}, Year ${d.year}${holiday ? `, ${holiday.name}` : ''}`;
}

export function calendarHudLine(state) {
  ensureCalendar(state);
  const next = upcomingBookings(state, null, 1)[0];
  return next ? `Calendar: ${calendarDateLabel(state)} Next ${bookingShortLabel(next)}` : `Calendar: ${calendarDateLabel(state)}`;
}

export function holidayForMinute(totalMinute) {
  const date = calendarDateForMinute(totalMinute);
  return WORLD_HOLIDAYS.find(h => h.month === date.month && h.day === date.day) || null;
}

export function bookCalendarTravel(state, actor, actionId, when, options = {}) {
  if (!actor) return false;
  ensureCalendar(state);
  const destination = destinationFor(actionId);
  const startMinute = resolveWhen(state, when);
  const duration = Number.isFinite(options.duration) ? options.duration : destination?.duration || 30;
  const cost = bookingCost(state, actionId, duration);
  const conflict = actorCalendarConflict(state, actor.id, startMinute, duration);
  if (conflict) {
    log(state, `${actor.name} already has ${conflict.label} booked then.`);
    say(actor, 'BUSY');
    return false;
  }
  if (!canReserveBookingCost(state, cost)) {
    log(state, `Cannot book ${destination?.label || actionId.replaceAll('_', ' ')}. Need $${cost}, available $${availableCalendarMoney(state)} after scheduled plans.`);
    say(actor, 'BROKE');
    return false;
  }
  const booking = {
    id: `booking_${Math.floor(state.time || 0)}_${actor.id}_${actionId}_${Math.floor(Math.random() * 9999)}`,
    type: 'travel',
    actionId,
    actorId: actor.id,
    invitedIds: Array.isArray(options.invitedIds) ? options.invitedIds : [],
    vehicleId: options.vehicleId || 'auto',
    label: options.label || destination?.label || actionId.replaceAll('_', ' '),
    createdAt: state.time || 0,
    startMinute,
    duration,
    cost,
    extraCost: Math.max(0, cost - baseTravelCost(state, actionId)),
    status: 'scheduled'
  };
  state.calendar.bookings.push(booking);
  state.calendar.bookings = state.calendar.bookings.slice(-24);
  log(state, `${actor.name} booked ${booking.label} for ${bookingTimeLabel(booking)}. Cost $${booking.cost}.`);
  say(actor, 'BOOKED');
  return true;
}

function resolveWhen(state, when) {
  const now = Math.floor(state.time || 0);
  if (!when) return now + 10;
  if (Number.isFinite(when.minute)) return Math.max(now + 1, Math.floor(when.minute));
  const day = gameDay(state) + (Number.isFinite(when.daysFromNow) ? when.daysFromNow : 0);
  const hour = Number.isFinite(when.hour) ? when.hour : Math.floor(minuteOfDay(state) / 60);
  const minute = Number.isFinite(when.minuteOfHour) ? when.minuteOfHour : 0;
  let target = day * 1440 + hour * 60 + minute;
  if (target <= now) target += 1440;
  return target;
}

export function actorCalendarConflict(state, actorId, startMinute, duration = 30, excludeId = '') {
  ensureCalendar(state);
  const end = startMinute + duration;
  return state.calendar.bookings.find(b => {
    normalizeBooking(state, b);
    if (b.id === excludeId || b.status !== 'scheduled') return false;
    if (b.actorId !== actorId && !b.invitedIds.includes(actorId)) return false;
    const bEnd = b.startMinute + (b.duration || 30);
    return startMinute < bEnd && end > b.startMinute;
  }) || null;
}

export function upcomingBookings(state, actor = null, limit = 6) {
  ensureCalendar(state);
  const now = state.time || 0;
  return state.calendar.bookings
    .map(b => normalizeBooking(state, b))
    .filter(b => b.status === 'scheduled' && b.startMinute >= now && (!actor || b.actorId === actor.id || b.invitedIds.includes(actor.id)))
    .sort((a, b) => a.startMinute - b.startMinute)
    .slice(0, limit);
}

export function dueCalendarBookings(state) {
  ensureCalendar(state);
  const now = state.time || 0;
  return state.calendar.bookings
    .map(b => normalizeBooking(state, b))
    .filter(b => b.status === 'scheduled' && b.startMinute <= now)
    .sort((a, b) => a.startMinute - b.startMinute);
}

export function markBookingStatus(state, bookingId, status) {
  ensureCalendar(state);
  const booking = state.calendar.bookings.find(b => b.id === bookingId);
  if (!booking) return null;
  booking.status = status;
  if (status !== 'scheduled') {
    state.calendar.history.unshift({ ...booking, status, completedAt: state.time || 0 });
    state.calendar.history = state.calendar.history.slice(0, 24);
  }
  return booking;
}

export function findBooking(state, bookingId) {
  ensureCalendar(state);
  const booking = state.calendar.bookings.find(b => b.id === bookingId);
  return booking ? normalizeBooking(state, booking) : null;
}

export function cancelBooking(state, actor, bookingId) {
  const booking = markBookingStatus(state, bookingId, 'canceled');
  if (!booking) {
    log(state, 'That calendar event is no longer available.');
    return false;
  }
  log(state, `${booking.label} was canceled.`);
  if (actor) say(actor, 'CANCELED');
  return true;
}

export function rescheduleBooking(state, actor, bookingId, when) {
  const booking = findBooking(state, bookingId);
  if (!booking || booking.status !== 'scheduled') {
    log(state, 'That calendar event is no longer available.');
    return false;
  }
  const startMinute = resolveWhen(state, when);
  const conflict = actorCalendarConflict(state, booking.actorId, startMinute, booking.duration || 30, booking.id);
  if (conflict) {
    log(state, `${booking.label} conflicts with ${conflict.label}.`);
    if (actor) say(actor, 'BUSY');
    return false;
  }
  booking.startMinute = startMinute;
  log(state, `${booking.label} moved to ${bookingTimeLabel(booking)}.`);
  if (actor) say(actor, 'MOVED');
  return true;
}

export function updateBookingDestination(state, actor, bookingId, actionId) {
  const booking = findBooking(state, bookingId);
  const destination = destinationFor(actionId);
  if (!booking || booking.status !== 'scheduled' || !destination) {
    log(state, 'That event cannot be updated.');
    return false;
  }
  const duration = destination.duration || booking.duration || 30;
  const cost = bookingCost(state, actionId, duration);
  if (!canReserveBookingCost(state, cost, booking.id)) {
    log(state, `Cannot update to ${destination.label}. Need $${cost}, available $${availableCalendarMoney(state, booking.id)} after other plans.`);
    if (actor) say(actor, 'BROKE');
    return false;
  }
  booking.actionId = actionId;
  booking.label = destination.label;
  booking.duration = duration;
  booking.cost = cost;
  booking.extraCost = Math.max(0, cost - baseTravelCost(state, actionId));
  log(state, `Updated event to ${booking.label}. Cost $${booking.cost}.`);
  if (actor) say(actor, 'UPDATE');
  return true;
}

export function updateBookingDuration(state, actor, bookingId, duration) {
  const booking = findBooking(state, bookingId);
  if (!booking || booking.status !== 'scheduled') {
    log(state, 'That event cannot be updated.');
    return false;
  }
  const destination = destinationFor(booking.actionId);
  if (!destination || !String(booking.actionId).startsWith('vacation_')) {
    log(state, 'Only vacation events can change trip length right now.');
    if (actor) say(actor, 'NOPE');
    return false;
  }
  const cost = bookingCost(state, booking.actionId, duration);
  if (!canReserveBookingCost(state, cost, booking.id)) {
    log(state, `Cannot extend ${booking.label}. Need $${cost}, available $${availableCalendarMoney(state, booking.id)} after other plans.`);
    if (actor) say(actor, 'BROKE');
    return false;
  }
  booking.duration = duration;
  booking.cost = cost;
  booking.extraCost = Math.max(0, cost - baseTravelCost(state, booking.actionId));
  log(state, `${booking.label} length updated to ${durationLabel(duration)}. Cost $${booking.cost}.`);
  if (actor) say(actor, 'UPDATE');
  return true;
}

export function skipToBooking(state, actor, bookingId) {
  ensureCalendar(state);
  const booking = findBooking(state, bookingId);
  if (!booking || booking.status !== 'scheduled') {
    log(state, 'That calendar event is no longer available.');
    if (actor) say(actor, 'NOPE');
    return false;
  }
  if (state.offsite || state.vehicleDeparture || state.vehicleReturn) {
    log(state, 'Cannot skip time while the household is already traveling.');
    if (actor) say(actor, 'WAIT');
    return false;
  }
  const now = state.time || 0;
  const delta = booking.startMinute - now;
  if (delta <= 0) {
    log(state, `${booking.label} is already due now.`);
    if (actor) say(actor, 'NOW');
    return true;
  }
  applyTimeSkipConsequences(state, delta);
  resetActorsAfterTimeSkip(state, booking);
  state.time = booking.startMinute;
  state.viewHoldT = 0;
  log(state, `Skipped ${skipDurationText(delta)} to ${booking.label}.`);
  if (actor) say(actor, 'SKIP');
  return true;
}

function applyTimeSkipConsequences(state, skippedMinutes) {
  const hours = Math.max(0, skippedMinutes / 60);
  for (const entity of state.entities || []) {
    if (!entity || entity.hidden || entity.labOnly || !entity.needs) continue;
    const sleepish = String(entity.pose || '').includes('sleep') || String(entity.action || '').toLowerCase().includes('sleep');
    const dog = entity.type === 'dog';
    changeNeed(entity, 'hunger', -(dog ? .24 : .34) * hours);
    changeNeed(entity, 'bladder', -(dog ? .18 : .44) * hours);
    changeNeed(entity, 'freshness', -(dog ? .08 : .12) * hours);
    changeNeed(entity, 'fun', -.08 * hours);
    if (sleepish) {
      changeNeed(entity, 'energy', .9 * hours);
      changeNeed(entity, 'stamina', .65 * hours);
    } else {
      changeNeed(entity, 'energy', -.18 * hours);
      changeNeed(entity, 'stamina', -.1 * hours);
    }
  }
}

function resetActorsAfterTimeSkip(state, booking) {
  for (const entity of state.entities || []) {
    if (!entity || entity.hidden || entity.labOnly) continue;
    entity.path = [];
    entity.target = null;
    entity.pending = null;
    entity.queuedTask = null;
    entity.actionT = 0;
    entity.actionTotal = 0;
    entity.pose = 'stand';
    entity.stopped = false;
    if (entity.carrying && !String(entity.carrying).includes('luggage')) entity.carrying = null;
    entity.action = entity.id === booking.actorId ? `${booking.label} due` : 'Time skipped';
    entity.idleT = entity.id === booking.actorId ? 4 : 0;
  }
}

function baseTravelCost(state, actionId) {
  const destination = destinationFor(actionId);
  if (!destination || destination.cost <= 0) return 0;
  return hasTravelPass(state, actionId) ? 0 : destination.cost;
}

export function bookingCost(state, actionId, duration = null) {
  const destination = destinationFor(actionId);
  if (!destination) return 0;
  const base = baseTravelCost(state, actionId);
  if (!String(actionId).startsWith('vacation_')) return base;
  const baseDuration = destination.duration || 120;
  const tripDuration = Number.isFinite(duration) ? duration : baseDuration;
  const extraHours = Math.max(0, Math.ceil((tripDuration - baseDuration) / 60));
  return base + extraHours * VACATION_EXTRA_HOUR_COST;
}

export function availableCalendarMoney(state, excludeBookingId = '') {
  ensureCalendar(state);
  const reserved = state.calendar.bookings.reduce((sum, booking) => {
    normalizeBooking(state, booking);
    if (booking.id === excludeBookingId || booking.status !== 'scheduled') return sum;
    return sum + Math.max(0, booking.cost || 0);
  }, 0);
  return Math.max(0, Math.floor((state.money || 0) - reserved));
}

export function canReserveBookingCost(state, cost, excludeBookingId = '') {
  return Math.max(0, cost || 0) <= availableCalendarMoney(state, excludeBookingId);
}

export function canAffordBookingNow(state, booking) {
  normalizeBooking(state, booking);
  const base = baseTravelCost(state, booking.actionId);
  const extra = Math.max(0, booking.cost - base);
  return (state.money || 0) >= base + extra;
}

export function bookingCostLabel(booking) {
  return `Cost $${Math.max(0, Math.round(booking.cost || 0))}, Length ${durationLabel(booking.duration || 30)}`;
}

export function durationLabel(minutes) {
  const rounded = Math.max(1, Math.round(minutes || 0));
  const hours = Math.floor(rounded / 60);
  const mins = rounded % 60;
  if (hours && mins) return `${hours}h ${mins}m`;
  if (hours) return `${hours}h`;
  return `${mins}m`;
}

function skipDurationText(minutes) {
  const rounded = Math.max(1, Math.round(minutes));
  const days = Math.floor(rounded / 1440);
  const hours = Math.floor((rounded % 1440) / 60);
  const mins = rounded % 60;
  const parts = [];
  if (days) parts.push(`${days} day${days === 1 ? '' : 's'}`);
  if (hours) parts.push(`${hours} hour${hours === 1 ? '' : 's'}`);
  if (mins || !parts.length) parts.push(`${mins} minute${mins === 1 ? '' : 's'}`);
  return parts.join(', ');
}

export function bookingTimeLabel(booking) {
  return `${dayNameForMinute(booking.startMinute)} ${timeText(booking.startMinute)}`;
}

export function bookingShortLabel(booking) {
  return `${booking.label} ${bookingTimeLabel(booking)}`;
}

export function calendarMenuRows(state, actor) {
  ensureCalendar(state);
  const rows = upcomingBookings(state, actor, 6).map(b => ({ label: `${bookingShortLabel(b)} ${bookingCostLabel(b)}`, booking: b }));
  if (!rows.length) rows.push({ label: 'No upcoming bookings', booking: null });
  return rows;
}

export function vacationOptions() {
  return VACATION_DESTINATIONS.slice(0, 10).map(destination => ({ id: destination.id, label: destination.label, duration: destination.duration }));
}
