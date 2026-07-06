async function boot() {
  try {
    const { bootPhaserGame } = await import('./phaserRuntime.js');
    bootPhaserGame();
  } catch (error) {
    console.error('Phaser start problem. Loading visual parity mode.', error);
    const { bootCanvasGame } = await import('./canvasRuntime.js');
    bootCanvasGame(error?.message || 'Phaser start problem');
  }
}

boot();
