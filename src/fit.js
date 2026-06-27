const shell = document.getElementById('app-shell');
const wrap = document.getElementById('game-wrap');
const hud = document.getElementById('hud');
const canvas = document.getElementById('game');

function fit() {
  const wide = window.innerWidth > window.innerHeight && window.innerWidth >= 760;
  shell.style.display = 'flex';
  shell.style.flexDirection = wide ? 'row' : 'column';
  shell.style.width = '100vw';
  shell.style.height = '100vh';
  wrap.style.display = 'flex';
  wrap.style.alignItems = 'center';
  wrap.style.justifyContent = 'center';
  wrap.style.overflow = 'hidden';
  canvas.style.width = 'auto';
  canvas.style.height = 'auto';
  canvas.style.maxWidth = '100%';
  canvas.style.maxHeight = '100%';
  canvas.style.aspectRatio = '16 / 9';
  if (wide) {
    wrap.style.flex = '1 1 auto';
    wrap.style.height = '100vh';
    hud.style.flex = '0 0 360px';
    hud.style.height = '100vh';
  } else {
    wrap.style.flex = '0 0 50vh';
    wrap.style.height = '50vh';
    hud.style.flex = '1 1 auto';
    hud.style.height = '';
  }
}

window.addEventListener('resize', fit);
window.addEventListener('orientationchange', fit);
fit();
