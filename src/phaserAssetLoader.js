import { spriteKeyFromPath } from './spritePipeline.js';

export function queueSpriteManifestAssets(scene, manifest) {
  if (!scene || !manifest) return;
  const queued = new Set();

  for (const sprite of manifest.sprites || []) {
    queueImage(scene, sprite.file, queued);
  }

  for (const animation of manifest.animations || []) {
    for (const frame of animation.frames || []) queueImage(scene, frame.file, queued);
  }

  if (manifest.atlas?.image && manifest.atlas?.json) {
    const atlasKey = 'apartment_god_sprite_atlas';
    if (!scene.textures.exists(atlasKey)) scene.load.atlas(atlasKey, `/${manifest.atlas.image}`, `/${manifest.atlas.json}`);
  }
}

export function queueImage(scene, file, queued = new Set()) {
  if (!file) return null;
  const key = spriteKeyFromPath(file);
  if (queued.has(key) || scene.textures.exists(key)) return key;
  queued.add(key);
  scene.load.image(key, `/${file}`);
  return key;
}

export function createManifestAnimations(scene, manifest) {
  for (const animation of manifest.animations || []) {
    if (!animation.frames?.length || scene.anims.exists(animation.state_id)) continue;
    const frames = animation.frames
      .map(frame => {
        const key = spriteKeyFromPath(frame.file);
        if (!scene.textures.exists(key)) return null;
        return { key, duration: frame.duration_ms || 120 };
      })
      .filter(Boolean);
    if (!frames.length) continue;
    scene.anims.create({
      key: animation.state_id,
      frames,
      repeat: animation.loop ? -1 : 0,
      frameRate: Math.max(1, Math.round(1000 / (animation.frames[0]?.duration_ms || 120)))
    });
  }
}

export function hasUsableSprite(scene, file) {
  return Boolean(file && scene.textures.exists(spriteKeyFromPath(file)));
}
