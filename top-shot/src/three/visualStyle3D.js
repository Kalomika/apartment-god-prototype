export const TOP_SHOT_VISUAL_STYLE = Object.freeze({
  animationFps: 8,
  outlines: false,
  effectsMode: '2d-billboards',
  characterLook: 'high-detail-toon',
  environmentLook: 'painterly'
});

export function createToonRampTexture(THREE, colors = ['#3b4650', '#87939b', '#d9d2bd']) {
  const data = new Uint8Array(colors.length * 4);
  colors.forEach((color, index) => {
    const c = new THREE.Color(color);
    data[index * 4] = Math.round(c.r * 255);
    data[index * 4 + 1] = Math.round(c.g * 255);
    data[index * 4 + 2] = Math.round(c.b * 255);
    data[index * 4 + 3] = 255;
  });
  const texture = new THREE.DataTexture(data, colors.length, 1, THREE.RGBAFormat);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  texture.needsUpdate = true;
  return texture;
}

export function createOutlineFreeToonMaterial(THREE, color, options = {}) {
  const material = new THREE.MeshToonMaterial({
    color,
    gradientMap: options.gradientMap,
    transparent: Boolean(options.transparent),
    opacity: options.opacity ?? 1
  });
  material.name = `top-shot-toon-${String(color).replace('#', '')}`;
  material.userData.topShotVisualStyle = 'outline-free-toon';
  return material;
}

export function steppedAnimationTime(seconds, fps = TOP_SHOT_VISUAL_STYLE.animationFps) {
  const safeSeconds = Number.isFinite(seconds) ? Math.max(0, seconds) : 0;
  const safeFps = Number.isFinite(fps) ? Math.max(1, fps) : 8;
  return Math.floor(safeSeconds * safeFps) / safeFps;
}
