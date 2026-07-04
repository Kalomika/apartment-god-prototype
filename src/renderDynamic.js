import { objects } from './world.js';
import { roundRect } from './renderHelpers.js';

export function drawDynamicProps(ctx, state) {
  drawPulledBook(ctx, state);
  drawCourier(ctx, state);
  drawBuildPrompt(ctx, state);
  drawVisiblePhone(ctx, state);
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

function drawVisiblePhone(ctx, state) {
  if (!state.phone) return;
  const actor = state.entities.find(e => e.id === state.phone.actorId);
  if (!actor || actor.hidden || actor.type === 'dog' || actor.floor !== state.floor) return;
  const bob = Math.sin(performance.now() / 180) * 1.5;
  ctx.save();
  ctx.translate(actor.x + 32, actor.y - 8 + bob);
  ctx.rotate(-0.18);
  roundRect(ctx, -8, -14, 16, 28, 4, '#0b1018');
  ctx.strokeStyle = '#74e6ff';
  ctx.lineWidth = 2;
  ctx.strokeRect(-5, -10, 10, 18);
  ctx.fillStyle = state.phone.open ? '#f1c66a' : '#74e6ff';
  ctx.fillRect(-3, -8, 6, 12);
  ctx.fillStyle = '#f8fbff';
  ctx.font = '900 7px system-ui';
  ctx.textAlign = 'center';
  ctx.fillText('CELL', 0, 22);
  ctx.restore();
}
