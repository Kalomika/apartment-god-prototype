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

  ctx.fillStyle = COLORS.text;
  ctx.font = '800 22px system-ui';
  ctx.fillText(floor.name, 26, 694);
}
