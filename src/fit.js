const shell = document.getElementById('app-shell');
const wrap = document.getElementById('game-wrap');
const hud = document.getElementById('hud');
const canvas = document.getElementById('game');
const controlBar = document.getElementById('game-control-bar');

function fit() {
  if (!shell || !wrap || !hud || !canvas) return;
  const wide = window.innerWidth > window.innerHeight && window.innerWidth >= 900;
  const phaserOwned = canvas.dataset.phaserOwned === 'true';

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
  canvas.style.margin = '0';
  canvas.style.marginTop = '0';
  canvas.style.marginLeft = '0';
  canvas.style.position = 'static';
  canvas.style.transform = 'none';

  if (wide) {
    wrap.style.flex = '';
    wrap.style.width = '';
    wrap.style.height = '100dvh';
    wrap.style.minHeight = '0';
    wrap.style.maxHeight = '100dvh';
    hud.style.height = '100dvh';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';
    if (!phaserOwned) {
      canvas.style.width = 'min(calc(100vw - 480px), calc(100dvh * 4 / 3))';
      canvas.style.height = 'auto';
    }
    if (controlBar) controlBar.style.height = '100dvh';
    return;
  }

  const displayWidth = Math.max(280, Math.min(window.innerWidth, 960));
  const displayHeight = Math.round(displayWidth * 3 / 4);
  wrap.style.flex = `0 0 ${displayHeight}px`;
  wrap.style.width = `${displayWidth}px`;
  wrap.style.height = `${displayHeight}px`;
  wrap.style.minHeight = '0';
  wrap.style.maxHeight = `${displayHeight}px`;
  wrap.style.alignSelf = 'center';
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.maxWidth = 'none';
  canvas.style.maxHeight = 'none';
  hud.style.height = '';
  if (controlBar) controlBar.style.height = '';
}

window.addEventListener('resize', fit);
window.addEventListener('orientationchange', () => window.setTimeout(fit, 50));
window.addEventListener('pageshow', () => window.setTimeout(fit, 0));
fit();
