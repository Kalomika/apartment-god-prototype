import { objects } from './world.js';

export function drawDynamicProps(ctx, state) {
  drawPulledBook(ctx, state);
  drawBuildPrompt(ctx, state);
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
