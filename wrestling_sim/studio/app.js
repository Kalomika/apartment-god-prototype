const backgroundCrowdFrames = [
  './assets/crowd/hard_cam_crowd_background_frame_0.svg',
  './assets/crowd/hard_cam_crowd_background_frame_1.svg'
];

const ringFrames = [
  './assets/ring/hard_cam_ring_approval_frame_0.svg',
  './assets/ring/hard_cam_ring_approval_frame_1.svg'
];

const foregroundCrowdFrames = [
  './assets/crowd/hard_cam_crowd_foreground_frame_0.svg',
  './assets/crowd/hard_cam_crowd_foreground_frame_1.svg'
];

const DEFAULTS = Object.freeze({
  depth: 28,
  vertical: 15,
  zoom: 100,
  backgroundCrowd: true,
  foregroundCrowd: true,
  grid: false,
  safe: true,
  playing: true
});

const elements = {
  backgroundCrowdLayer: document.querySelector('#backgroundCrowdLayer'),
  backgroundCrowdImage: document.querySelector('#backgroundCrowdImage'),
  ringLayer: document.querySelector('#ringLayer'),
  ringImage: document.querySelector('#ringImage'),
  foregroundCrowdLayer: document.querySelector('#foregroundCrowdLayer'),
  foregroundCrowdImage: document.querySelector('#foregroundCrowdImage'),
  gridLayer: document.querySelector('#gridLayer'),
  safeFrame: document.querySelector('#safeFrame'),
  assetError: document.querySelector('#assetError'),
  frameReadout: document.querySelector('#frameReadout'),
  transformReadout: document.querySelector('#transformReadout'),
  depthMetric: document.querySelector('#depthMetric'),
  cadenceMetric: document.querySelector('#cadenceMetric'),
  depthRange: document.querySelector('#depthRange'),
  depthOutput: document.querySelector('#depthOutput'),
  verticalRange: document.querySelector('#verticalRange'),
  verticalOutput: document.querySelector('#verticalOutput'),
  zoomRange: document.querySelector('#zoomRange'),
  zoomOutput: document.querySelector('#zoomOutput'),
  backgroundCrowdToggle: document.querySelector('#backgroundCrowdToggle'),
  foregroundCrowdToggle: document.querySelector('#foregroundCrowdToggle'),
  gridToggle: document.querySelector('#gridToggle'),
  safeToggle: document.querySelector('#safeToggle'),
  playButton: document.querySelector('#playButton'),
  stepButton: document.querySelector('#stepButton'),
  resetButton: document.querySelector('#resetButton')
};

const state = {
  ...DEFAULTS,
  frame: 0,
  timer: null,
  failedAssets: new Set()
};

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

function getScale() {
  const depthScale = 1 - state.depth / 100;
  const inspectionScale = state.zoom / 100;
  return clamp(depthScale * inspectionScale, 0.45, 1.35);
}

function updateTransform() {
  const scale = getScale();
  elements.ringLayer.style.transform = `translateY(-${state.vertical}%) scale(${scale})`;
  elements.depthMetric.textContent = `${Math.round(scale * 100)}%`;
  elements.transformReadout.textContent = `SCALE ${Math.round(scale * 100)}% · Y ${state.vertical}%`;
  elements.depthOutput.value = `${state.depth}%`;
  elements.verticalOutput.value = `${state.vertical}%`;
  elements.zoomOutput.value = `${state.zoom}%`;
}

function updateLayers() {
  elements.backgroundCrowdLayer.hidden = !state.backgroundCrowd;
  elements.foregroundCrowdLayer.hidden = !state.foregroundCrowd;
  elements.gridLayer.classList.toggle('is-visible', state.grid);
  elements.safeFrame.hidden = !state.safe;
}

function renderFrame() {
  elements.backgroundCrowdImage.src = backgroundCrowdFrames[state.frame];
  elements.ringImage.src = ringFrames[state.frame];
  elements.foregroundCrowdImage.src = foregroundCrowdFrames[state.frame];
  elements.frameReadout.textContent = state.frame === 0 ? 'FRAME A' : 'FRAME B';
}

function stopTimer() {
  if (state.timer !== null) {
    window.clearInterval(state.timer);
    state.timer = null;
  }
}

function startTimer() {
  stopTimer();
  if (!state.playing) return;

  state.timer = window.setInterval(() => {
    state.frame = (state.frame + 1) % ringFrames.length;
    renderFrame();
  }, 125);
}

function updatePlaybackUi() {
  elements.playButton.textContent = state.playing ? 'Pause 8 FPS' : 'Play 8 FPS';
  elements.playButton.setAttribute('aria-pressed', String(state.playing));
  elements.cadenceMetric.textContent = state.playing ? '8 FPS' : 'Paused';
}

function setPlaying(playing) {
  state.playing = playing;
  updatePlaybackUi();
  startTimer();
}

function resetStudio() {
  Object.assign(state, DEFAULTS, { frame: 0 });

  elements.depthRange.value = String(state.depth);
  elements.verticalRange.value = String(state.vertical);
  elements.zoomRange.value = String(state.zoom);
  elements.backgroundCrowdToggle.checked = state.backgroundCrowd;
  elements.foregroundCrowdToggle.checked = state.foregroundCrowd;
  elements.gridToggle.checked = state.grid;
  elements.safeToggle.checked = state.safe;

  updateTransform();
  updateLayers();
  renderFrame();
  updatePlaybackUi();
  startTimer();
}

function updateAssetError() {
  elements.assetError.hidden = state.failedAssets.size === 0;
}

function registerAssetFailure(event) {
  state.failedAssets.add(event.currentTarget.id);
  updateAssetError();
}

function registerAssetSuccess(event) {
  state.failedAssets.delete(event.currentTarget.id);
  updateAssetError();
}

elements.depthRange.addEventListener('input', (event) => {
  state.depth = Number(event.currentTarget.value);
  updateTransform();
});

elements.verticalRange.addEventListener('input', (event) => {
  state.vertical = Number(event.currentTarget.value);
  updateTransform();
});

elements.zoomRange.addEventListener('input', (event) => {
  state.zoom = Number(event.currentTarget.value);
  updateTransform();
});

elements.backgroundCrowdToggle.addEventListener('change', (event) => {
  state.backgroundCrowd = event.currentTarget.checked;
  updateLayers();
});

elements.foregroundCrowdToggle.addEventListener('change', (event) => {
  state.foregroundCrowd = event.currentTarget.checked;
  updateLayers();
});

elements.gridToggle.addEventListener('change', (event) => {
  state.grid = event.currentTarget.checked;
  updateLayers();
});

elements.safeToggle.addEventListener('change', (event) => {
  state.safe = event.currentTarget.checked;
  updateLayers();
});

elements.playButton.addEventListener('click', () => {
  setPlaying(!state.playing);
});

elements.stepButton.addEventListener('click', () => {
  setPlaying(false);
  state.frame = (state.frame + 1) % ringFrames.length;
  renderFrame();
});

elements.resetButton.addEventListener('click', resetStudio);

[
  elements.backgroundCrowdImage,
  elements.ringImage,
  elements.foregroundCrowdImage
].forEach((image) => {
  image.addEventListener('error', registerAssetFailure);
  image.addEventListener('load', registerAssetSuccess);
});

document.addEventListener('keydown', (event) => {
  const target = event.target;
  if (target instanceof HTMLInputElement || target instanceof HTMLButtonElement) return;

  if (event.code === 'Space') {
    event.preventDefault();
    setPlaying(!state.playing);
  }

  if (event.key.toLowerCase() === 'f') {
    setPlaying(false);
    state.frame = (state.frame + 1) % ringFrames.length;
    renderFrame();
  }
});

resetStudio();
