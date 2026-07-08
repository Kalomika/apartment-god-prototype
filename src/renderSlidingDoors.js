const FLOOR = '#d8c4a4';
const FLOOR_SHADE = 'rgba(139,111,83,.10)';
const TRACK = '#2b3445';
const TRACK_GLOW = 'rgba(116,230,255,.38)';
const PANEL = '#6f7f86';
const PANEL_LIT = '#a8d3db';

export function drawSlidingDoorOverlays(ctx, state, doorways) {
  for (const doorway of doorways.filter(d => d.floor === state.floor)) {
    drawSlidingDoor(ctx, state, doorway);
  }
}

function drawSlidingDoor(ctx, state, doorway) {
  const gap = doorwayGapRect(doorway);
  const horizontal = doorway.w >= doorway.h;
  const open = doorwayOpenAmount(state, doorway, gap);

  ctx.save();
  ctx.fillStyle = FLOOR;
  ctx.fillRect(gap.x, gap.y, gap.w, gap.h);
  ctx.fillStyle = FLOOR_SHADE;
  ctx.fillRect(gap.x, gap.y, gap.w, gap.h);

  if (horizontal) drawHorizontalSlider(ctx, doorway, open);
  else drawVerticalSlider(ctx, doorway, open);
  ctx.restore();
}

function drawHorizontalSlider(ctx, doorway, open) {
  const y = doorway.y + doorway.h / 2;
  const x = doorway.x;
  const span = doorway.w;
  const panelW = Math.max(22, span * 0.44);
  const slide = panelW * 0.82 * open;
  const leftX = x + 2 - slide;
  const rightX = x + span - panelW - 2 + slide;

  ctx.fillStyle = TRACK;
  rounded(ctx, x - 6, y - 6, span + 12, 12, 6, true, false);
  ctx.fillStyle = TRACK_GLOW;
  ctx.fillRect(x + 4, y - 1, Math.max(8, span - 8), 2);

  drawDoorPanel(ctx, leftX, y - 9, panelW, 18, true);
  drawDoorPanel(ctx, rightX, y - 9, panelW, 18, true);
}

function drawVerticalSlider(ctx, doorway, open) {
  const x = doorway.x + doorway.w / 2;
  const y = doorway.y;
  const span = doorway.h;
  const panelH = Math.max(22, span * 0.44);
  const slide = panelH * 0.82 * open;
  const topY = y + 2 - slide;
  const bottomY = y + span - panelH - 2 + slide;

  ctx.fillStyle = TRACK;
  rounded(ctx, x - 6, y - 6, 12, span + 12, 6, true, false);
  ctx.fillStyle = TRACK_GLOW;
  ctx.fillRect(x - 1, y + 4, 2, Math.max(8, span - 8));

  drawDoorPanel(ctx, x - 9, topY, 18, panelH, false);
  drawDoorPanel(ctx, x - 9, bottomY, 18, panelH, false);
}

function drawDoorPanel(ctx, x, y, w, h, horizontal) {
  rounded(ctx, x, y, w, h, 5, true, false, PANEL);
  ctx.fillStyle = PANEL_LIT;
  if (horizontal) ctx.fillRect(x + 5, y + 4, Math.max(6, w - 10), 3);
  else ctx.fillRect(x + 4, y + 5, 3, Math.max(6, h - 10));
  ctx.strokeStyle = '#26313a';
  ctx.lineWidth = 1.5;
  rounded(ctx, x, y, w, h, 5, false, true);
}

function doorwayOpenAmount(state, doorway, gap) {
  const cx = doorway.x + doorway.w / 2;
  const cy = doorway.y + doorway.h / 2;
  const entities = state.entities || [];
  const nearEntity = entities.some(e => !e.hidden && e.floor === doorway.floor && Math.hypot(e.x - cx, e.y - cy) < 92);
  const activeTrip = state.vehicleDeparture || state.vehicleReturn || state.offsite;
  if (nearEntity || activeTrip) return 1;
  const pulse = Math.sin(((state.time || 0) + cx + cy) * 0.018) * 0.03;
  return 0.12 + pulse;
}

function doorwayGapRect(d) {
  const alongPad = 14;
  const wallCut = 22;
  if (d.w >= d.h) {
    const h = Math.max(44, d.h + wallCut * 2);
    return { x: d.x - alongPad, y: d.y + d.h / 2 - h / 2, w: d.w + alongPad * 2, h };
  }
  const w = Math.max(44, d.w + wallCut * 2);
  return { x: d.x + d.w / 2 - w / 2, y: d.y - alongPad, w, h: d.h + alongPad * 2 };
}

function rounded(ctx, x, y, w, h, r, fill = true, stroke = false, color = '') {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  if (fill) ctx.fill();
  if (stroke) ctx.stroke();
}
