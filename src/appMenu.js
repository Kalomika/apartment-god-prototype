import { handleBuildRequest } from './buildRequests.js';
import { startObjectAction, startOffsite } from './actions.js';
import { assignCareer, CAREER_TRACKS, careerFor, quitCareer, trackForCareer, workDueText } from './careerSystem.js';
import { bookCalendarTravel, bookingCostLabel, bookingTimeLabel, calendarDateLabel, calendarMenuRows, cancelBooking, rescheduleBooking, updateBookingDestination, updateBookingDuration, vacationOptions } from './calendarSystem.js';
import { canSkipToBooking, skipToBookingPrep } from './calendarSkipSystem.js';
import { startCookingFlow } from './cooking.js';
import { orderFood, buyWorkoutGear } from './economy.js';
import { buyInvestment, investmentSummary, INVESTMENTS } from './investmentSystem.js';
import { lifeControlLabel, lifeQualityMenuRows, toggleLifeControlMode } from './lifeQualitySystem.js';
import { relationshipLabel, relationshipSummary } from './reactionSystem.js';
import { startMusic } from './music.js';
import { objects } from './world.js';

export function openDeviceHome(state, actor, openMenu) {
  actor.action = 'Using phone';
  actor.pose = 'sit';
  const cell = (title, items) => openMenu(660, 86, `Cell: ${title}`, [...items, { label: 'Back to Cell', run: () => openDeviceHome(state, actor, openMenu) }]);
  const foodMenu = () => cell('Food / Delivery', [
    { label: 'Order Food Delivery', run: () => orderFood(state, actor, false) },
    { label: 'Get Snack From Fridge', run: () => startObjectAction(state, actor, objects.find(o => o.id === 'fridge'), 'snack') },
    { label: 'Cook Meal', run: () => startCookingFlow(state, actor) }
  ]);
  const shopMenu = () => cell('Shop / Build Items', [
    { label: 'Workout Gear Now', run: () => buyWorkoutGear(state, actor) },
    { label: 'Bookshelf', run: () => handleBuildRequest(state, actor, 'bookshelf') },
    { label: 'Couch', run: () => handleBuildRequest(state, actor, 'couch') },
    { label: 'Desk', run: () => handleBuildRequest(state, actor, 'desk') },
    { label: 'TV', run: () => handleBuildRequest(state, actor, 'tv') },
    { label: 'Pool Table', run: () => handleBuildRequest(state, actor, 'pool table') },
    { label: 'Arcade Machine', run: () => handleBuildRequest(state, actor, 'arcade') },
    { label: 'Console Setup', run: () => handleBuildRequest(state, actor, 'console') },
    { label: 'Dart Board', run: () => handleBuildRequest(state, actor, 'dart board') }
  ]);
  const musicMenu = () => cell('Music Apps', ['rap', 'jazz', 'cyberpunk', 'ambient', 'rock', 'dance'].map(genre => ({ label: `Play ${genre}`, run: () => startMusic(state, actor, genre) })));
  const lifeMenu = () => {
    const rows = lifeQualityMenuRows(state, actor).map(row => ({ label: row.label, run: lifeMenu }));
    cell('Life Review', [
      { label: `Control: ${lifeControlLabel(state)}`, run: () => { toggleLifeControlMode(state); lifeMenu(); } },
      ...rows
    ]);
  };
  const investmentMenu = () => cell('Investments', [
    { label: investmentSummary(state).replaceAll('<br>', ' | '), run: investmentMenu },
    ...INVESTMENTS.map(item => ({ label: `Buy ${item.label}: $${item.buyIn}`, run: () => buyInvestment(state, item.id) }))
  ]);
  const careerMenu = () => {
    const career = careerFor(state, actor);
    const track = trackForCareer(career);
    const items = [
      { label: workDueText(state, actor), run: careerMenu },
      { label: track ? `Work Shift Now: ${track.label}` : 'Temp Work Shift Now', run: () => startOffsite(state, actor, 'work', [], 'auto') }
    ];
    if (track) items.push({ label: `Quit ${track.label}`, run: () => quitCareer(state, actor) });
    for (const option of CAREER_TRACKS) items.push({ label: `Apply: ${option.label} (${option.scheduleLabel})`, run: () => assignCareer(state, actor, option.id) });
    cell('Career / Work', items);
  };
  const relationshipMenu = () => {
    const summary = relationshipSummary(state, actor);
    const items = [];
    const addRows = (label, rows) => {
      if (!rows.length) items.push({ label: `${label}: none yet`, run: relationshipMenu });
      for (const row of rows) items.push({ label: `${label}: ${relationshipLabel(state, actor, row.id)}`, run: relationshipMenu });
    };
    addRows('Vibing', summary.vibing);
    addRows('Beefing', summary.beefing);
    if (!items.length) items.push({ label: 'No relationship reads yet', run: relationshipMenu });
    cell('Relationships', items);
  };
  const calendarMenu = () => {
    const upcoming = calendarMenuRows(state, actor).map(row => ({
      label: row.label,
      run: () => row.booking ? eventDetailMenu(row.booking) : calendarMenu()
    }));
    cell('Calendar', [
      { label: `Today: ${calendarDateLabel(state)}`, run: calendarMenu },
      ...upcoming,
      { label: 'Book Movie Ticket...', run: () => bookingMenu('Movie Ticket', 'movies') },
      { label: 'Book Date Night...', run: () => bookingMenu('Date Night', 'date') },
      { label: 'Book Mall Trip...', run: () => bookingMenu('Mall Trip', 'mall') },
      { label: 'Book Quick Errand...', run: () => bookingMenu('Quick Errand', 'errand') },
      { label: 'Book Trip / Flight...', run: tripMenu }
    ]);
  };
  const eventDetailMenu = booking => {
    const skipItems = canSkipToBooking(state, booking) ? [{ label: 'Skip to one hour before this event...', run: () => confirmSkipMenu(booking) }] : [];
    cell(`Event: ${booking.label}`, [
      { label: `When: ${bookingTimeLabel(booking)}`, run: () => eventDetailMenu(booking) },
      { label: bookingCostLabel(booking), run: () => eventDetailMenu(booking) },
      { label: `Status: ${booking.status}`, run: () => eventDetailMenu(booking) },
      ...skipItems,
      { label: 'Reschedule event...', run: () => rescheduleMenu(booking) },
      { label: 'Update event...', run: () => updateEventMenu(booking) },
      { label: 'Cancel event', run: () => cancelEventMenu(booking) },
      { label: 'Back to Calendar', run: calendarMenu }
    ]);
  };
  const confirmSkipMenu = booking => cell('Skip to prep time?', [
    { label: `Yes, skip to one hour before ${booking.label}`, run: () => skipToBookingPrep(state, actor, booking.id) },
    { label: 'No, stay here', run: () => eventDetailMenu(booking) }
  ]);
  const cancelEventMenu = booking => cell('Cancel event?', [
    { label: `Yes, cancel ${booking.label}`, run: () => cancelBooking(state, actor, booking.id) },
    { label: 'No, keep event', run: () => eventDetailMenu(booking) }
  ]);
  const rescheduleMenu = booking => cell('Reschedule event', [
    { label: 'In 10 minutes', run: () => rescheduleBooking(state, actor, booking.id, { minute: (state.time || 0) + 10 }) },
    { label: 'Tonight 7 PM', run: () => rescheduleBooking(state, actor, booking.id, { daysFromNow: 0, hour: 19 }) },
    { label: 'Tomorrow 10 AM', run: () => rescheduleBooking(state, actor, booking.id, { daysFromNow: 1, hour: 10 }) },
    { label: 'Tomorrow 7 PM', run: () => rescheduleBooking(state, actor, booking.id, { daysFromNow: 1, hour: 19 }) },
    { label: 'Back to Event', run: () => eventDetailMenu(booking) }
  ]);
  const updateEventMenu = booking => {
    const vacation = String(booking.actionId || '').startsWith('vacation_');
    const items = vacation ? [
      { label: 'Change vacation spot...', run: () => vacationUpdateMenu(booking) },
      { label: 'Change trip length...', run: () => durationUpdateMenu(booking) },
      { label: 'Back to Event', run: () => eventDetailMenu(booking) }
    ] : [
      { label: 'Only vacations support length and spot updates right now', run: () => eventDetailMenu(booking) },
      { label: 'Back to Event', run: () => eventDetailMenu(booking) }
    ];
    cell('Update Event', items);
  };
  const durationUpdateMenu = booking => {
    const base = Math.max(90, Math.round((booking.duration || 120) / 10) * 10);
    cell('Trip Length', [
      { label: 'Standard length', run: () => updateBookingDuration(state, actor, booking.id, base) },
      { label: 'Longer trip, plus 1 hour', run: () => updateBookingDuration(state, actor, booking.id, base + 60) },
      { label: 'Long vacation, plus 2 hours', run: () => updateBookingDuration(state, actor, booking.id, base + 120) },
      { label: 'Extended vacation, plus 3 hours', run: () => updateBookingDuration(state, actor, booking.id, base + 180) },
      { label: 'Back to Update Event', run: () => updateEventMenu(booking) }
    ]);
  };
  const vacationUpdateMenu = booking => cell('Vacation Spots', vacationOptions().map(destination => ({
    label: `${destination.label}`,
    run: () => updateBookingDestination(state, actor, booking.id, destination.id)
  })).concat([{ label: 'Back to Update Event', run: () => updateEventMenu(booking) }]));
  const bookingMenu = (label, actionId) => cell(`Book ${label}`, [
    { label: 'In 10 minutes', run: () => bookCalendarTravel(state, actor, actionId, { minute: (state.time || 0) + 10 }) },
    { label: 'Tonight 7 PM', run: () => bookCalendarTravel(state, actor, actionId, { daysFromNow: 0, hour: 19 }) },
    { label: 'Tomorrow 10 AM', run: () => bookCalendarTravel(state, actor, actionId, { daysFromNow: 1, hour: 10 }) },
    { label: 'Tomorrow 7 PM', run: () => bookCalendarTravel(state, actor, actionId, { daysFromNow: 1, hour: 19 }) }
  ]);
  const tripMenu = () => cell('Book Trip / Flight', vacationOptions().map(destination => ({
    label: `${destination.label}: Tomorrow 9 AM`,
    run: () => bookCalendarTravel(state, actor, destination.id, { daysFromNow: 1, hour: 9 }, { label: destination.label, duration: destination.duration })
  })));
  openMenu(660, 86, 'Cell', [
    { label: 'Food / Delivery', run: foodMenu },
    { label: 'Calendar', run: calendarMenu },
    { label: 'Life Review', run: lifeMenu },
    { label: 'Career / Work', run: careerMenu },
    { label: 'Relationships', run: relationshipMenu },
    { label: 'Investments / Magic Fund', run: investmentMenu },
    { label: 'Shop / Build Items', run: shopMenu },
    { label: 'Music Apps', run: musicMenu }
  ]);
}
