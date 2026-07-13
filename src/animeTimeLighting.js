import { PLAY_H, PLAY_W } from './config.js';
import { objects } from './world.js';

const DAY_START = 6 * 60;
const DAY_END = 20 * 60;
const NOON = 12 * 60;

export function getAnimeSunModel(timeMinutes = NOON) {
  const minutes = normalizeDayMinutes(timeMinutes);
  const sunrise = smoothStep(DAY_START - 80, DAY_START + 80, minutes);
  const sunset = 1 - smoothStep(DAY_END - 100, DAY_END + 70, minutes);
  const daylight = clamp01(sunrise * sunset);
  const noonStrength = clamp01(1 - Math.abs(minutes - NOON) / (5.5 * 60));
  const morningWarmth = clamp01(1 - Math.abs(minutes - (7.5 * 60)) / (2.2 * 60));
  const eveningWarmth = clamp01(1 - Math.abs(minutes - (18.2 * 60)) / (2.4 * 60));
  const warmth = clamp01(Math.max(morningWarmth, eveningWarmth) * daylight);
  const night = clamp01(1 - daylight);
  const dayProgress = clamp01((minutes - DAY_START) / Math.max(1, DAY_END - DAY_START));
  const angle = -Math.PI * 0.12 + dayProgress * Math.PI * 1.24;
  return {
    minutes,
    daylight,
    night,
    noonStrength,
    warmth,
    angle,
    sunX: Math.cos(angle),
    sunY: Math.sin(angle),
    shadowX: -Math.cos(angle),
    shadowY: -Math.sin(angle)
  };
}

export function drawAnimeTimeLighting(ctx, state) {
  const sun = getAnimeSunModel(state?.time ?? NOON);
  ctx.save();
  ctx.shadowColor = 'transparent';
  drawAmbientMood(ctx, state, sun);
  drawSunLogicPatches(ctx, state, sun);
  drawFixturePools(ctx, state, sun);
  drawEdgeVignette(ctx, sun);
  ctx.restore();
}

function drawAmbientMood(ctx, state, sun) {
  const isExterior = state.floor === 4;
  const isBasement = state.floor === 2;
  const isGarage = state.floor === 3;
  const baseNight = isExterior ? 0.18 : isBasement ? 0.30 : isGarage ? 0.24 : 0.22;
  const noonLift = isExterior ? 0.035 : 0.06;
  const alpha = clamp01(baseNight * sun.night + noonLift * (1 - sun.night));
  const nightColor = isBasement ? 'rgba(7,12,20,' : 'rgba(7,13,24,';
  ctx.fillStyle = `${nightColor}${alpha})`;
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);

  if (sun.warmth > 0.02) {
    const warm = ctx.createLinearGradient(0, 0, PLAY_W, PLAY_H);
    warm.addColorStop(0, `rgba(255,190,110,${0.09 * sun.warmth})`);
    warm.addColorStop(0.5, `rgba(255,207,140,${0.045 * sun.warmth})`);
    warm.addColorStop(1, `rgba(80,130,210,${0.035 * sun.warmth})`);
    ctx.fillStyle = warm;
    ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  }
}

function drawSunLogicPatches(ctx, state, sun) {
  if (sun.daylight <= 0.08) return;
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  if (state.floor === 0) drawMainHouseSun(ctx, sun);
  else if (state.floor === 1) drawUpstairsSun(ctx, sun);
  else if (state.floor === 3) drawGarageDoorSun(ctx, sun);
  else if (state.floor === 4) drawBackyardSun(ctx, sun);
  ctx.restore();
}

function drawMainHouseSun(ctx, sun) {
  const a = 0.05 + sun.daylight * 0.08 + sun.warmth * 0.04;
  drawSlantedBeam(ctx, 36, 552, 332, 126, sun, `rgba(255,218,150,${a})`);
  drawSlantedBeam(ctx, 448, 36, 300, 120, sun, `rgba(255,225,170,${a * 0.72})`);
  drawSlantedBeam(ctx, 780, 48, 140, 116, sun, `rgba(198,240,255,${a * 0.46})`);
}

function drawUpstairsSun(ctx, sun) {
  const a = 0.06 + sun.daylight * 0.10 + sun.warmth * 0.05;
  drawSlantedBeam(ctx, 44, 50, 330, 132, sun, `rgba(255,225,160,${a})`);
  drawSlantedBeam(ctx, 510, 48, 214, 100, sun, `rgba(255,225,164,${a * 0.70})`);
  drawSlantedBeam(ctx, 782, 54, 128, 124, sun, `rgba(198,240,255,${a * 0.48})`);
}

function drawGarageDoorSun(ctx, sun) {
  const a = 0.04 + sun.daylight * 0.08;
  drawSlantedBeam(ctx, 188, 606, 546, 62, sun, `rgba(255,219,155,${a})`);
}

function drawBackyardSun(ctx, sun) {
  ctx.fillStyle = `rgba(255,227,164,${0.04 + sun.daylight * 0.08})`;
  ctx.fillRect(24, 36, 912, 600);
}

function drawFixturePools(ctx, state, sun) {
  const lightObjects = objects.filter(o => o.floor === state.floor && o.kind === 'light');
  for (const light of lightObjects) {
    const on = state.roomLights?.[light.room] !== false;
    if (!on) continue;
    const x = light.x + light.w / 2;
    const y = light.y + light.h / 2;
    const strength = 0.08 + sun.night * 0.18;
    radial(ctx, x, y, 125, `rgba(255,219,142,${strength})`, 'rgba(255,219,142,0)');
  }

  if (state.floor === 2) radial(ctx, 448, 110, 190, 'rgba(92,180,255,.10)', 'rgba(92,180,255,0)');
  if (state.floor === 5) radial(ctx, 822, 118, 260, 'rgba(91,220,255,.12)', 'rgba(91,220,255,0)');
}

function drawEdgeVignette(ctx, sun) {
  const g = ctx.createRadialGradient(PLAY_W / 2, PLAY_H / 2, PLAY_W * 0.28, PLAY_W / 2, PLAY_H / 2, PLAY_W * 0.74);
  g.addColorStop(0, 'rgba(0,0,0,0)');
  g.addColorStop(1, `rgba(3,6,12,${0.12 + sun.night * 0.10})`);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
}

function drawSlantedBeam(ctx, x, y, w, h, sun, color) {
  const slant = sun.shadowX * 52;
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(x + w, y);
  ctx.lineTo(x + w + slant, y + h);
  ctx.lineTo(x + slant, y + h);
  ctx.closePath();
  ctx.fill();
}

function radial(ctx, x, y, r, inner, outer) {
  ctx.save();
  ctx.globalCompositeOperation = 'screen';
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, inner);
  g.addColorStop(1, outer);
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function normalizeDayMinutes(value) {
  const numeric = Number.isFinite(value) ? value : NOON;
  return ((numeric % (24 * 60)) + 24 * 60) % (24 * 60);
}

function smoothStep(edge0, edge1, x) {
  const t = clamp01((x - edge0) / Math.max(1, edge1 - edge0));
  return t * t * (3 - 2 * t);
}

function clamp01(value) {
  return Math.max(0, Math.min(1, value));
}
