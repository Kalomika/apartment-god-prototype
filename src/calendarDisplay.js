import { calendarDateForMinute, holidayForMinute, timeText } from './calendarSystem.js';

const MONTH_SHORT_NAMES = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LONG_NAMES = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];

export function monthShortName(monthIndex) {
  return MONTH_SHORT_NAMES[monthIndex] || MONTH_SHORT_NAMES[0];
}

export function monthLongName(monthIndex) {
  return MONTH_LONG_NAMES[monthIndex] || MONTH_LONG_NAMES[0];
}

export function calendarCompactHudLine(state) {
  const totalMinute = Number.isFinite(state?.time) ? state.time : 0;
  const date = calendarDateForMinute(totalMinute);
  return `Y${date.year} | ${date.dayName} ${monthShortName(date.month)} ${date.day} | ${timeText(totalMinute)}`;
}

export function calendarPhoneSummaryRows(state) {
  const totalMinute = Number.isFinite(state?.time) ? state.time : 0;
  const date = calendarDateForMinute(totalMinute);
  const holiday = holidayForMinute(totalMinute);
  return [
    `Year ${date.year}`,
    `${date.dayName}, ${monthLongName(date.month)} ${date.day}`,
    `Time: ${timeText(totalMinute)}`,
    `Week ${date.week}`,
    holiday ? `Holiday: ${holiday.name}` : 'Holiday: none today'
  ];
}
