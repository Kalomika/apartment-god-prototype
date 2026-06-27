export function installResponsiveLayout() {
  const shell = document.getElementById('app-shell');
  const wrap = document.getElementById('game-wrap');
  const hud = document.getElementById('hud');
  const canvas = document.getElementById('game');

  function apply() {
    const landscape = window.innerWidth > window.innerHeight && window.innerWidth >= 760;
    shell.style.display = 'flex';
    shell.style.width = '100vw';
    shell.style.height = '100vh';
    shell.style.flexDirection = landscape ? 'row' : 'column';
    wrap.style.display = 'flex';
    wrap.style.alignItems = 'center';
    wrap.style.justifyContent = 'center';
    wrap.style.overflow = 'hidden';
    canvas.style.aspectRatio = '16 / 9';
    canvas.style.width = 'auto';
    canvas.style.height = 'auto';
    canvas.style.maxWidth = '100%';
    canvas.style.maxHeight = '100%';

    if (landscape) {
      wrap.style.flex = '1 1 auto';
      wrap.style.height = '100vh';
      wrap.style.minHeight = '0';
      hud.style.flex = '0 0 360px';
      hud.style.height = '100vh';
      hud.style.maxWidth = '42vw';
    } else {
      wrap.style.flex = '0 0 50vh';
      wrap.style.height = '50vh';
      wrap.style.minHeight = window.innerHeight < 660 ? '260px' : '300px';
      hud.style.flex = '1 1 auto';
      hud.style.height = '';
      hud.style.maxWidth = '';
    }
  }

  window.addEventListener('resize', apply);
  window.addEventListener('orientationchange', apply);
  apply();
}
