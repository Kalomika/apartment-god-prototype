import { startOffsite } from './actions.js';
import { bookingTimeLabel, dueCalendarBookings, ensureCalendar, markBookingStatus } from './calendarSystem.js';
import { byId, log, say } from './state.js';

export function updateCalendarRuntime(state) {
  ensureCalendar(state);
  const due = dueCalendarBookings(state);
  if (!due.length) return;
  for (const booking of due) {
    const actor = byId(state, booking.actorId);
    if (!actor || actor.hidden || actor.labOnly) {
      markBookingStatus(state, booking.id, 'missed');
      log(state, `Missed ${booking.label}: actor unavailable.`);
      continue;
    }
    const overdue = (state.time || 0) - booking.startMinute;
    if (actorBusy(actor) || state.offsite || state.vehicleDeparture || state.vehicleReturn) {
      if (overdue > 90) {
        markBookingStatus(state, booking.id, 'missed');
        log(state, `${actor.name} missed ${booking.label} from ${bookingTimeLabel(booking)}.`);
        say(actor, 'MISSED');
      } else if (!actor.calendarReminderT || actor.calendarReminderT <= 0) {
        actor.calendarReminderT = 18;
        say(actor, 'PLAN');
        log(state, `${actor.name} has ${booking.label} due now but is busy.`);
      }
      continue;
    }
    const ok = startOffsite(state, actor, booking.actionId, booking.invitedIds || [], booking.vehicleId || 'auto', { fromQueue: true });
    if (ok) {
      markBookingStatus(state, booking.id, 'started');
      say(actor, 'GO');
      log(state, `${actor.name}'s calendar started ${booking.label}.`);
    }
  }
  for (const actor of state.entities || []) if (actor.calendarReminderT > 0) actor.calendarReminderT -= .6;
}

function actorBusy(actor) {
  if (!actor) return true;
  return Boolean(actor.path?.length || actor.target || actor.pending || actor.actionT > 0 || actor.hidden || actor.stopped);
}
