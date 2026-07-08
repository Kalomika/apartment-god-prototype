import { doorways, windows } from './blueprint.js';
import { COLORS, PLAY_H, PLAY_W, CANVAS_H, CANVAS_W } from './config.js';
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
    ctx.fillStyle = COLORS.muted;
    ctx.font = '700 13px system-ui';
    ctx.fillText(room.name, room.x + 12, room.y + 24);
  }

  for (const d of doorways.filter(x => x.floor === state.floor)) {
    ctx.fillStyle = COLORS.floor;
    ctx.fillRect(d.x - 3, d.y - 3, d.w + 6, d.h + 6);
    ctx.strokeStyle = '#e6eef9';
    ctx.lineWidth = 2;
    if (d.w > d.h) {
      ctx.beginPath();
      ctx.moveTo(d.x + 8, d.y + d.h);
      ctx.lineTo(d.x + Math.min(44, d.w), d.y + d.h);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.moveTo(d.x, d.y + 8);
      ctx.lineTo(d.x, d.y + Math.min(44, d.h));
      ctx.stroke();
    }
  }

  const openWindows = state.objectState.openWindows || {};
  for (const w of windows.filter(x => x.floor === state.floor)) {
    ctx.fillStyle = openWindows[w.id] ? '#9ee9ff' : '#4f6d87';
    ctx.fillRect(w.x, w.y, w.w, w.h);
    ctx.strokeStyle = openWindows[w.id] ? '#dffaff' : '#a8bdd1';
    ctx.strokeRect(w.x, w.y - 2, w.w, w.h + 4);
  }

  ctx.fillStyle = COLORS.text;
  ctx.font = '800 22px system-ui';
  ctx.fillText(floor.name, 26, 694);
}
