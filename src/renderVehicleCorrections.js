import { objects } from './world.js';
import { roundRect } from './renderHelpers.js';

export function drawVehicleCorrections(ctx, state) {
  for (const car of objects.filter(o => o.floor === state.floor && o.kind === 'car')) drawDirectionalCar(ctx, car, state);
}

function drawDirectionalCar(ctx, o, state) {
  const minutes = state.time % 1440;
  const lightsOn = minutes >= 18 * 60 || minutes < 6 * 60 || minutes >= 12 * 60;
  ctx.save();
  ctx.shadowColor = lightsOn ? 'rgba(255,230,110,.45)' : 'transparent';
  ctx.shadowBlur = lightsOn ? 12 : 0;
  roundRect(ctx, o.x, o.y, o.w, o.h, 24, '#252d3c');
  roundRect(ctx, o.x + 22, o.y + 52, o.w - 44, o.h - 104, 18, '#111820');
  ctx.strokeStyle = '#74e6ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(o.x + 32, o.y + 76, Math.max(8, o.w - 64), Math.max(16, o.h - 152));
  ctx.fillStyle = lightsOn ? '#ffe66e' : '#98a4b8';
  ctx.fillRect(o.x + 20, o.y + 8, 20, 10);
  ctx.fillRect(o.x + o.w - 40, o.y + 8, 20, 10);
  if (lightsOn) {
    ctx.fillStyle = 'rgba(255,230,110,.22)';
    ctx.beginPath(); ctx.moveTo(o.x + 18, o.y + 8); ctx.lineTo(o.x - 14, o.y - 40); ctx.lineTo(o.x + 48, o.y - 40); ctx.closePath(); ctx.fill();
    ctx.beginPath(); ctx.moveTo(o.x + o.w - 18, o.y + 8); ctx.lineTo(o.x + o.w - 48, o.y - 40); ctx.lineTo(o.x + o.w + 14, o.y - 40); ctx.closePath(); ctx.fill();
  }
  ctx.fillStyle = '#d84b4b';
  ctx.fillRect(o.x + 20, o.y + o.h - 18, 20, 8);
  ctx.fillRect(o.x + o.w - 40, o.y + o.h - 18, 20, 8);
  ctx.restore();
}
