export function drawMissingSprite(scene, x, y, w, h, label, options = {}) {
  const graphics = options.graphics || scene.add.graphics();
  const width = Math.max(22, w || 42);
  const height = Math.max(18, h || 34);
  graphics.fillStyle(0x111827, 0.72).fillRect(x - width / 2, y - height / 2, width, height);
  graphics.lineStyle(2, 0xff4d7d, 0.92).strokeRect(x - width / 2, y - height / 2, width, height);
  graphics.lineStyle(1, 0xffd166, 0.72);
  graphics.lineBetween(x - width / 2, y - height / 2, x + width / 2, y + height / 2);
  graphics.lineBetween(x + width / 2, y - height / 2, x - width / 2, y + height / 2);
  if (options.showLabel === false) return graphics;
  const text = scene.add.text(x - width / 2, y + height / 2 + 2, String(label || 'missing'), {
    fontFamily: 'system-ui, Segoe UI, sans-serif',
    fontSize: '9px',
    color: '#ffd166',
    backgroundColor: 'rgba(0,0,0,.65)',
    padding: { x: 3, y: 1 }
  });
  text.setDepth(options.depth || 20);
  if (options.labels) options.labels.push(text);
  return graphics;
}

export function shouldShowMissingSpriteDebug() {
  try {
    return new URLSearchParams(window.location.search).has('debugSprites');
  } catch {
    return false;
  }
}
