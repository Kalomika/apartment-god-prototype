// Focused visual regression fixes that are not already owned by realismCorrectionPass.js.
// Couch and porch redraws were removed from this layer during the pre-test bug audit
// because they duplicated the active realism correction pass and caused stacked visuals.

const CYAN = '#74e6ff';
const GOLD = '#f1c66a';

export function drawVisualRegressionFixes(ctx, state) {
  if (state.floor !== 0) return;
  drawCoffeeTable(ctx);
}

function drawCoffeeTable(ctx) {
  ctx.save();
  ctx.shadowColor = 'transparent';
  round(ctx, 150, 148, 130, 46, 14, 'rgba(35,40,47,.18)');
  round(ctx, 158, 146, 114, 38, 12, '#6b4a34');
  round(ctx, 168, 153, 94, 24, 8, '#9b7652');
  circle(ctx, 190, 165, 6, '#efe7dc');
  circle(ctx, 236, 165, 5, CYAN);
  round(ctx, 246, 155, 10, 14, 5, GOLD);
  ctx.restore();
}

function round(ctx, x, y, w, h, r, color) {
  if (color) ctx.fillStyle = color;
  ctx.beginPath();
  if (ctx.roundRect) ctx.roundRect(x, y, Math.max(1, w), Math.max(1, h), Math.max(0, r));
  else ctx.rect(x, y, Math.max(1, w), Math.max(1, h));
  ctx.fill();
}

function circle(ctx, x, y, r, color) {
  ctx.fillStyle = color;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}
