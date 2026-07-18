const shell = document.getElementById('app-shell');
const wrap = document.getElementById('game-wrap');
const hud = document.getElementById('hud');
const canvas = document.getElementById('game');
const controlBar = document.getElementById('game-control-bar');

function fit() {
  if (!shell || !wrap || !hud || !canvas) return;
  const wide = window.innerWidth > window.innerHeight && window.innerWidth >= 900;
  if (canvas.dataset.phaserOwned !== 'true') {
    canvas.width = 960;
    canvas.height = 720;
  }

  shell.style.display = wide ? 'grid' : 'flex';
  shell.style.flexDirection = 'column';
  shell.style.width = '100vw';
  shell.style.height = '100dvh';

  wrap.style.display = 'flex';
  wrap.style.alignItems = 'flex-start';
  wrap.style.justifyContent = 'center';
  wrap.style.overflow = 'hidden';

  canvas.style.display = 'block';
  canvas.style.aspectRatio = '4 / 3';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';

  if (wide) {
    wrap.style.flex = '';
    wrap.style.height = '100dvh';
    hud.style.height = '100dvh';
    canvas.style.width = 'min(calc(100vw - 480px), calc(100dvh * 4 / 3))';
    canvas.style.height = 'auto';
    if (controlBar) controlBar.style.height = '100dvh';
    return;
  }

  const displayWidth = Math.max(280, Math.min(window.innerWidth, 960));
  const displayHeight = Math.round(displayWidth * 3 / 4);
  wrap.style.flex = `0 0 ${displayHeight}px`;
  wrap.style.height = `${displayHeight}px`;
  wrap.style.minHeight = '0';
  wrap.style.maxHeight = `${displayHeight}px`;
  canvas.style.width = `${displayWidth}px`;
  canvas.style.height = `${displayHeight}px`;
  hud.style.height = '';
  if (controlBar) controlBar.style.height = '';
}

window.addEventListener('resize', fit);
window.addEventListener('orientationchange', () => window.setTimeout(fit, 50));
fit();
