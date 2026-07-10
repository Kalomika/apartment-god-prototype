import { destinationFor, VACATION_DESTINATIONS } from './travelLocations.js';
import { log, say } from './state.js';

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTH_NAMES = ['Dawn', 'Bloom', 'Ember', 'Rain', 'Suncrest', 'Harvest', 'Gold', 'Shadow', 'Hearth', 'Frost', 'Star', 'Renewal'];
const DAYS_PER_MONTH = 30;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS_PER_YEAR;

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
  for (const booking of state.calendar.bookings) normalizeBooking(booking);
  return state.calendar;
}

function normalizeBooking(booking) {
  booking.id ||= `booking_${Date.now()}_${Math.floor(Math.random() * 9999)}`;
  booking.type ||= 'travel';
  booking.actionId ||= 'errand';
  booking.actorId ||= 'resident';
  booking.invitedIds = Array.isArray(booking.invitedIds) ? booking.invitedIds : [];
  booking.vehicleId ||= 'auto';
  booking.createdAt = Number.isFinite(booking.createdAt) ? booking.createdAt : 0;
  booking.startMinute = Number.isFinite(booking.startMinute) ? booking.startMinute : 0;
  booking.status ||= 'scheduled';
  booking.label ||= destinationFor(booking.actionId)?.label || booking.actionId.replaceAll('_', ' ');
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
  const year = Math.floor(absoluteDay / DAYS_PER_YEAR) + 1;
  const dayOfYear = absoluteDay % DAYS_PER_YEAR;
  const month = Math.floor(dayOfYear / DAYS_PER_MONTH);
  const day = dayOfYear % DAYS_PER_MONTH + 1;
  const week = Math.floor(absoluteDay / 7) + 1;
  return { absoluteDay, year, month, monthName: MONTH_NAMES[month], day, week, dayName: DAY_NAMES[absoluteDay % 7] };
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
  const duration = destination?.duration || 30;
  const conflict = actorCalendarConflict(state, actor.id, startMinute, duration);
  if (conflict) {
    log(state, `${actor.name} already has ${conflict.label} booked then.`);
    say(actor, 'BUSY');
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
    status: 'scheduled'
  };
  state.calendar.bookings.push(booking);
  state.calendar.bookings = state.calendar.bookings.slice(-24);
  log(state, `${actor.name} booked ${booking.label} for ${bookingTimeLabel(booking)}.`);
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

export function actorCalendarConflict(state, actorId, startMinute, duration = 30) {
  ensureCalendar(state);
  const end = startMinute + duration;
  return state.calendar.bookings.find(b => {
    normalizeBooking(b);
    if (b.status !== 'scheduled') return false;
    if (b.actorId !== actorId && !b.invitedIds.includes(actorId)) return false;
    const bEnd = b.startMinute + (b.duration || 30);
    return startMinute < bEnd && end > b.startMinute;
  }) || null;
}

export function upcomingBookings(state, actor = null, limit = 6) {
  ensureCalendar(state);
  const now = state.time || 0;
  return state.calendar.bookings
    .map(normalizeBooking)
    .filter(b => b.status === 'scheduled' && b.startMinute >= now && (!actor || b.actorId === actor.id || b.invitedIds.includes(actor.id)))
    .sort((a, b) => a.startMinute - b.startMinute)
    .slice(0, limit);
}

export function dueCalendarBookings(state) {
  ensureCalendar(state);
  const now = state.time || 0;
  return state.calendar.bookings
    .map(normalizeBooking)
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

export function bookingTimeLabel(booking) {
  return `${dayNameForMinute(booking.startMinute)} ${timeText(booking.startMinute)}`;
}

export function bookingShortLabel(booking) {
  return `${booking.label} ${bookingTimeLabel(booking)}`;
}

export function calendarMenuRows(state, actor) {
  ensureCalendar(state);
  const rows = upcomingBookings(state, actor, 6).map(b => ({ label: bookingShortLabel(b), booking: b }));
  if (!rows.length) rows.push({ label: 'No upcoming bookings', booking: null });
  return rows;
}

export function vacationOptions() {
  return VACATION_DESTINATIONS.slice(0, 10).map(destination => ({ id: destination.id, label: destination.label }));
}
