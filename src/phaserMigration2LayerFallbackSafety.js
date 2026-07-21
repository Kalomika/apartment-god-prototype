const GAME_SCENE_KEY = 'ApartmentGodNativeScene';
const OPTIONAL_LAYER_KEYS = ['verticalTop', 'verticalBottom', 'sideTop', 'sideBottom'];

export function installPhaserMigration2LayerFallbackSafety(game) {
  if (!game || game.__pm2LayerFallbackSafetyInstalled) return game;
  game.__pm2LayerFallbackSafetyInstalled = true;

  const waitForScene = window.setInterval(() => {
    const scene = game.scene?.getScene?.(GAME_SCENE_KEY);
    if (!scene?.events || !scene?.pm2ActorVisuals) return;
    window.clearInterval(waitForScene);
    installSceneSafety(scene);
  }, 40);

  window.setTimeout(() => window.clearInterval(waitForScene), 15000);
  return game;
}

function installSceneSafety(scene) {
  if (scene.__pm2LayerFallbackSafetyInstalled) return;
  scene.__pm2LayerFallbackSafetyInstalled = true;

  const sync = () => {
    for (const record of scene.pm2ActorVisuals?.values?.() || []) {
      for (const key of OPTIONAL_LAYER_KEYS) {
        const layer = record?.[key];
        if (!layer) continue;
        const missing = layer.texture?.key === '__MISSING' || !layer.frame;
        if (missing) layer.setVisible(false);
      }
    }
  };

  scene.events.on('postupdate', sync);
  scene.events.once('shutdown', () => scene.events.off('postupdate', sync));
  scene.events.once('destroy', () => scene.events.off('postupdate', sync));
  sync();
}
