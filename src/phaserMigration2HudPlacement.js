import { calendarCompactHudLine } from './calendarDisplay.js';

export function installPhaserMigration2HudPlacement(game) {
  if (!game) return () => {};
  const calendar = document.getElementById('hud-calendar-pill');
  const money = document.getElementById('hud-money-pill');
  let disposed = false;

  const sync = () => {
    if (disposed) return;
    const scene = game.scene?.getScene?.('ApartmentGodNativeScene');
    if (!scene?.state) return;

    if (scene.statusText) {
      scene.statusText.destroy?.();
      scene.statusText = null;
    }
    if (scene.runtimeText) {
      scene.runtimeText.destroy?.();
      scene.runtimeText = null;
    }

    if (calendar) calendar.textContent = calendarCompactHudLine(scene.state);
    if (money) money.textContent = `$${Math.round(scene.state.money ?? 0)}`;
  };

  sync();
  const interval = window.setInterval(sync, 120);
  const dispose = () => {
    if (disposed) return;
    disposed = true;
    window.clearInterval(interval);
  };
  game.events?.once?.('destroy', dispose);
  window.addEventListener('beforeunload', dispose, { once: true });
  return dispose;
}
