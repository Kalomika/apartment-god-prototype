import { doorways, windows } from './blueprint.js';
import { CANVAS_H, CANVAS_W, COLORS, PLAY_H, PLAY_W } from './config.js';
import { floors } from './world.js';

export function drawWorld(ctx, state) {
  ctx.fillStyle = COLORS.wallDark;
  ctx.fillRect(0, 0, PLAY_W, PLAY_H);
  ctx.fillStyle = '#0f131b';
  ctx.fillRect(PLAY_W, 0, CANVAS_W - PLAY_W, CANVAS_H);

  const floor = floors[state.floor];
  for (const room of floor.rooms) {
    const lit = state.roomLights[room.id] !== false;
    ctx.fillStyle = lit ? COLORS.floor : COLORS.floorAlt;
    ctx.fillRect(room.x, room.y, room.w, room.h);
    ctx.strokeStyle = COLORS.roomLine;
    ctx.lineWidth = 5;
    ctx.strokeRect(room.x, room.y, room.w, room.h);
    ctx.fillStyle = lit ? '#f4dc75' : '#59606e';
    ctx.beginPath();
    ctx.arc(room.x + room.w - 24, room.y + 22, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.muted;
    ctx.font = '700 13px system-ui';
    ctx.fillText(room.name, room.x + 12, room.y + 24);
  }

  drawDoorways(ctx, state);
  drawWindows(ctx, state);

  ctx.fillStyle = COLORS.text;
  ctx.font = '800 22px system-ui';
  ctx.fillText(floor.name, 26, 694);
}

function drawDoorways(ctx, state) {
  for (const d of doorways.filter(x => x.floor === state.floor)) {
    ctx.fillStyle = COLORS.floor;
    ctx.fillRect(d.x, d.y, d.w, d.h);
    ctx.strokeStyle = '#e6eef9';
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (d.w > d.h) {
      ctx.arc(d.x + 8, d.y + d.h, 28, -Math.PI / 2, 0);
      ctx.moveTo(d.x + 8, d.y + d.h);
      ctx.lineTo(d.x + 36, d.y + d.h);
    } else {
      ctx.arc(d.x, d.y + 8, 28, 0, Math.PI / 2);
      ctx.moveTo(d.x, d.y + 8);
      ctx.lineTo(d.x, d.y + 36);
    }
    ctx.stroke();
  }
}

function drawWindows(ctx, state) {
  const openWindows = state.objectState.openWindows || {};
  for (const w of windows.filter(x => x.floor === state.floor)) {
    ctx.fillStyle = openWindows[w.id] ? '#9ee9ff' : '#4f6d87';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = openWindows[w.id] ? '#dffaff' : '#a8bdd1';
    ctx.strokeRect(w.x, w.y - 2, w.w, w.h + 4);
    if (openWindows[w.id]) {
      ctx.fillStyle = 'rgba(158,233,255,.22)';
      ctx.beginPath();
      ctx.ellipse(w.x + w.w / 2, w.y + 34, w.w / 2, 18, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }
}
