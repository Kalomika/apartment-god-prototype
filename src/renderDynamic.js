import { objects } from './world.js';
import { roundRect } from './renderHelpers.js';
import { drawVehicleSprite } from './vehicleSpriteRenderer.js';
import { drawBikeMountOverlay, isBikeLikeVehicle } from './bikeMountRenderer.js';
import { drawCarSeatBoardingOverlay, isCarLikeVehicle } from './carSeatBoardingRenderer.js';

export function drawDynamicProps(ctx, state) {
  drawPulledBook(ctx, state);
  drawCourier(ctx, state);
  drawVehicleDeparture(ctx, state);
  drawVehicleReturn(ctx, state);
  drawBuildPrompt(ctx, state);
}

export function drawCarriedItems(ctx, state) {
  for (const e of state.entities || []) {
    if (e.hidden || e.floor !== state.floor || !e.carrying) continue;
    ctx.save();
    ctx.translate(e.x + 20, e.y - 22);
    drawCarryIcon(ctx, e.carrying);
    ctx.restore();
  }
}

function drawCarryIcon(ctx, item) {
  const text = String(item).toLowerCase();
  if (text.includes('cue')) {
    ctx.save();
    ctx.rotate(-0.72);
    ctx.strokeStyle = '#d6b27a';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(-18, 0);
    ctx.lineTo(18, 0);
    ctx.stroke();
    ctx.strokeStyle = '#3b2a1d';
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(8, 0);
    ctx.lineTo(18, 0);
    ctx.stroke();
    ctx.restore();
    return;
  }
  if (text.includes('ball')) {
    ctx.fillStyle = '#f1c66a';
    ctx.strokeStyle = '#11151c';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(0, 0, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    return;
  }
  if (text.includes('towel')) {
    roundRect(ctx, -13, -10, 26, 20, 5, '#a8e9ff');
    ctx.strokeStyle = '#071018';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(-10, -7, 20, 14);
    ctx.fillStyle = '#071018';
    ctx.font = '900 6px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText('TOWEL', 0, 2);
    ctx.textAlign = 'left';
    return;
  }
  if (text.includes('luggage')) {
    drawLuggage(ctx, 0, 0, text.includes('large'));
    return;
  }
  if (text.includes('bag') || text.includes('trash')) {
    roundRect(ctx, -10, -8, 20, 18, 5, text.includes('trash') ? '#20252f' : '#f1c66a');
    ctx.fillStyle = '#10141b';
    ctx.font = '900 7px system-ui';
    ctx.textAlign = 'center';
    ctx.fillText(text.includes('trash') ? 'TR' : 'BAG', 0, 3);
    ctx.textAlign = 'left';
    return;
  }
  if (text.includes('dish')) {
    roundRect(ctx, -11, -5, 22, 10, 5, '#d7e1f0');
    return;
  }
  roundRect(ctx, -9, -7, 18, 14, 4, '#f1c66a');
}

function drawLuggage(ctx, x, y, large = false) {
  const w = large ? 26 : 20;
  const h = large ? 28 : 22;
  ctx.save();
  ctx.translate(x, y);
  ctx.strokeStyle = '#2e2118';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(-w * .25, -h * .58);
  ctx.quadraticCurveTo(0, -h * .85, w * .25, -h * .58);
  ctx.stroke();
  roundRect(ctx, -w / 2, -h / 2, w, h, 5, large ? '#b78556' : '#f1c66a');
  ctx.fillStyle = 'rgba(0,0,0,.22)';
  ctx.fillRect(-2, -h / 2 + 3, 4, h - 6);
  ctx.fillStyle = '#2e2118';
  ctx.fillRect(-w / 2 + 4, h / 2 - 3, 4, 3);
  ctx.fillRect(w / 2 - 8, h / 2 - 3, 4, 3);
  ctx.restore();
}

function drawPulledBook(ctx, state) {
  const bookOut = state.objectState.bookOut;
  if (!bookOut) return;
  const shelf = objects.find(o => o.floor === state.floor && o.kind === 'bookshelf' && (bookOut === true || bookOut === o.id));
  if (!shelf) return;
  ctx.save();
  ctx.fillStyle = '#f1c66a';
  ctx.strokeStyle = '#11151c';
  ctx.lineWidth = 2;
  ctx.translate(shelf.x + shelf.w + 12, shelf.y + 38);
  ctx.rotate(-0.12);
  ctx.fillRect(0, 0, 24, 18);
  ctx.strokeRect(0, 0, 24, 18);
  ctx.fillStyle = '#11151c';
  ctx.font = '900 10px system-ui';
  ctx.fillText('BOOK', -1, 13);
  ctx.restore();
}

function drawCourier(ctx, state) {
  const d = state.delivery;
  if (!d || d.floor !== state.floor) return;
  ctx.save();
  ctx.translate(d.x, d.y);
  ctx.fillStyle = 'rgba(0,0,0,.25)';
  ctx.beginPath();
  ctx.ellipse(0, 18, 22, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  roundRect(ctx, -15, -10, 30, 38, 8, '#1e2937');
  ctx.strokeStyle = '#74e6ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(-12, -6, 24, 18);
  ctx.fillStyle = '#f1c66a';
  ctx.fillRect(-24, 3, 16, 14);
  ctx.fillStyle = '#11151c';
  ctx.font = '900 8px system-ui';
  ctx.fillText('BAG', -23, 13);
  ctx.fillStyle = '#f8fbff';
  ctx.beginPath();
  ctx.arc(0, -20, 11, 0, Math.PI * 2);
  ctx.fill();
  const text = d.phase === 'arriving' ? '...' : d.bubble || 'ORDER';
  const w = Math.max(76, text.length * 10 + 22);
  roundRect(ctx, -w / 2, -66, w, 26, 10, '#f8fbff');
  ctx.fillStyle = '#10141b';
  ctx.font = '900 12px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, 0, -49);
  ctx.textAlign = 'left';
  ctx.restore();
}

function drawGarageDoor(ctx, state) {
  ctx.fillStyle = state.objectState.garageDoorOpen ? 'rgba(116,230,255,.35)' : '#2a3140';
  ctx.fillRect(186, 636, 548, 30);
  ctx.strokeStyle = '#74e6ff';
  ctx.lineWidth = 3;
  ctx.strokeRect(186, 636, 548, 30);
}

function drawAnimatedVehicle(ctx, v) {
  const flash = v.remoteFlashT > 0 && Math.floor(v.remoteFlashT * 12) % 2 === 0;
  const rider = riderShouldShow(v);
  const bikeLike = isBikeLikeVehicle(v);
  const carLike = isCarLikeVehicle(v);
  const drawn = drawVehicleSprite(ctx, v, null, {
    open: carLike ? false : v.open,
    trunkOpen: v.trunkOpen,
    flash,
    rider: bikeLike ? false : rider
  });
  if (!drawn) fallbackVehicleBlock(ctx, v, flash);
  if (carLike) drawCarSeatBoardingOverlay(ctx, v);
  drawBikeMountOverlay(ctx, v, null, { rider });
  drawStoredLuggage(ctx, v, v.x, v.y, v.w || 116, v.h || 230);
  if (v.remoteFlashT > 0) drawVehicleBubble(ctx, (v.x || 0) + (v.w || 80) / 2, (v.y || 0) - 18, v.remoteLabel || 'REMOTE');
}

function fallbackVehicleBlock(ctx, v, flash) {
  const x = v.x || 0;
  const y = v.y || 0;
  const w = v.w || 80;
  const h = v.h || 120;
  roundRect(ctx, x, y, w, h, 14, flash ? '#f1c66a' : '#789477');
}

function riderShouldShow(v) {
  return Boolean(v.mounted || ['mounting', 'mounted_ready', 'boarding', 'door_closing', 'remote_lock', 'garage_opening', 'leaving', 'arriving', 'parking', 'remote_unlock', 'door_opening', 'dismounting'].includes(v.phase));
}

function drawTrunkLuggagePosition(v, x, y, w, h, index) {
  const vacation = Boolean(v.vacation);
  if (!vacation) return { x: x + w * .5, y: y + h * .50 };
  if (v.trunkOpen) return { x: x + w * .30 + index * 16, y: y - 20 };
  return { x: x + w * .30 + index * 14, y: y + h * .20 };
}

function drawStoredLuggage(ctx, v, x, y, w, h) {
  if (!v.vacation || !v.luggage?.length || (!v.trunkOpen && !v.luggageLoaded)) return;
  const loaded = v.luggage.filter(item => item.loaded || v.phase === 'loading_luggage' || v.phase === 'unloading_luggage');
  loaded.slice(0, 4).forEach((item, index) => {
    const p = drawTrunkLuggagePosition(v, x, y, w, h, index);
    drawLuggage(ctx, p.x, p.y, item.count > 1);
  });
}

function drawVehicleBubble(ctx, x, y, text) {
  ctx.fillStyle = 'rgba(8,10,15,.82)';
  roundRect(ctx, x - 40, y - 12, 80, 24, 10, 'rgba(8,10,15,.82)');
  ctx.fillStyle = '#f1c66a';
  ctx.font = '900 10px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText(text, x, y + 4);
  ctx.textAlign = 'left';
}

function drawVehicleDeparture(ctx, state) {
  const v = state.vehicleDeparture;
  if (!v || state.floor !== 3) return;
  ctx.save();
  drawGarageDoor(ctx, state);
  drawAnimatedVehicle(ctx, v);
  ctx.restore();
}

function drawVehicleReturn(ctx, state) {
  const v = state.vehicleReturn;
  if (!v || state.floor !== 3) return;
  ctx.save();
  drawGarageDoor(ctx, state);
  drawAnimatedVehicle(ctx, v);
  ctx.restore();
}

function drawBuildPrompt(ctx, state) {
  if (!state.buildPick) return;
  ctx.save();
  ctx.fillStyle = 'rgba(10,12,18,.78)';
  ctx.fillRect(282, 10, 380, 34);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 15px system-ui';
  ctx.fillText(`Tap placement spot for ${state.buildPick.label}`, 294, 32);
  ctx.restore();
}
