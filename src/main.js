import './runtimeObjectCorrections.js?v=20260721-full-audit-repair';
import { installPhaserParityCorrections } from './phaserParityCorrections.js?v=20260721-full-audit-repair';
import { installPhaserVisualParityOverlay } from './phaserVisualParityOverlay.js?v=20260721-full-audit-repair';

const gameCanvas = document.getElementById('game');
if (gameCanvas) gameCanvas.dataset.phaserOwned = 'true';

const { bootPhaserParityGame } = await import('./phaserParityRuntime.js?v=20260721-full-audit-repair');
const game = await bootPhaserParityGame();
installPhaserParityCorrections(game);
installPhaserVisualParityOverlay(game);

function refreshPhaserScale() {
  window.requestAnimationFrame(() => {
    const canvas = game?.canvas || gameCanvas;
    if (canvas) {
      canvas.style.margin = '0';
      canvas.style.marginTop = '0';
      canvas.style.marginLeft = '0';
      canvas.style.transform = 'none';
    }
    game?.scale?.refresh?.();
  });
}

window.addEventListener('resize', refreshPhaserScale);
window.addEventListener('pageshow', refreshPhaserScale);
window.addEventListener('orientationchange', () => window.setTimeout(refreshPhaserScale, 80));
refreshPhaserScale();
