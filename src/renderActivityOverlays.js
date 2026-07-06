import { getObject } from './world.js';
import { roundRect } from './renderHelpers.js';

export function drawActivityOverlays(ctx, state) {
  drawPoolGame(ctx, state);
  for (const e of state.entities.filter(x => !x.hidden && x.floor === state.floor)) drawEntityActivity(ctx, e);
}

function drawEntityActivity(ctx, e) {
  const action = String(e.action || '').toLowerCase();
  const phase = Math.sin(performance.now() / 130);
  ctx.save();
  ctx.translate(e.x, e.y);
  if (action.includes('lift weights')) {
    ctx.rotate(-Math.PI / 2);
    roundRect(ctx, -28, -12, 58, 24, 10, 'rgba(10,12,18,.84)');
    ctx.strokeStyle = '#d7e1f0'; ctx.lineWidth = 5; ctx.beginPath(); ctx.moveTo(-44, -24 - phase * 10); ctx.lineTo(44, -24 - phase * 10); ctx.stroke();
    ctx.fillStyle = '#d7e1f0'; ctx.fillRect(-52, -32 - phase * 10, 10, 16); ctx.fillRect(42, -32 - phase * 10, 10, 16);
  } else if (action.includes('treadmill')) {
    ctx.strokeStyle = '#74e6ff'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-18, 22); ctx.lineTo(-6, 38 + phase * 6); ctx.moveTo(18, 22); ctx.lineTo(6, 38 - phase * 6); ctx.stroke();
  } else if (action.includes('heavy bag')) {
    ctx.strokeStyle = '#ff75df'; ctx.lineWidth = 4; ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(28 + phase * 6, -28); ctx.stroke();
    roundRect(ctx, 32 + phase * 4, -42, 22, 54, 12, '#3b1622');
  } else if (action.includes('pool')) {
    ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(-18, 18); ctx.lineTo(42, -22 + phase * 4); ctx.stroke();
  } else if (action.includes('darts')) {
    ctx.strokeStyle = '#f1c66a'; ctx.lineWidth = 3; ctx.beginPath(); ctx.moveTo(12, -8); ctx.lineTo(36 + phase * 12, -34); ctx.stroke();
  } else if (action.includes('console') || action.includes('arcade')) {
    roundRect(ctx, -18, -36, 36, 16, 5, '#111820'); ctx.fillStyle = '#74e6ff'; ctx.fillRect(-10, -32, 20, 4);
  }
  ctx.restore();
}

function drawPoolGame(ctx, state) {
  const game = state.poolGame;
  const table = getObject('pool_table');
  if (!game || !table || state.floor !== table.floor) return;
  ctx.save();
  for (const b of game.balls || []) {
    if (b.pocketed) continue;
    ctx.fillStyle = b.fill || '#f8fbff';
    ctx.strokeStyle = '#080b10';
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(b.x, b.y, b.id === 'cue' ? 7 : 6, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
  }
  roundRect(ctx, table.x + table.w - 90, table.y - 28, 86, 22, 8, 'rgba(10,12,18,.82)');
  ctx.fillStyle = '#f8fbff'; ctx.font = '900 11px system-ui';
  ctx.fillText(game.winner ? `${game.winner} WINS` : `POOL ${game.score?.[0] || 0}-${game.score?.[1] || 0}`, table.x + table.w - 82, table.y - 13);
  ctx.restore();
}
