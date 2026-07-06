import { drawMissingSprite, shouldShowMissingSpriteDebug } from './missingSpriteDebug.js';
import { getEntityAnimation, getObjectSprite, missingSpriteLabel, spriteKeyFromPath } from './spritePipeline.js';

export function renderObjectSprite(scene, manifest, object, fallbackDraw) {
  const spriteSpec = getObjectSprite(manifest, object);
  const key = spriteKeyFromPath(spriteSpec?.file);
  if (spriteSpec?.file && scene.textures.exists(key)) {
    const sprite = scene.add.image(object.x + object.w / 2, object.y + object.h / 2, key);
    sprite.setOrigin(spriteSpec.anchor?.x ?? 0.5, spriteSpec.anchor?.y ?? 0.5);
    sprite.setScale(spriteSpec.scale || 1);
    sprite.setDisplaySize(object.w, object.h);
    return sprite;
  }
  if (shouldShowMissingSpriteDebug()) {
    return drawMissingSprite(scene, object.x + object.w / 2, object.y + object.h / 2, object.w, object.h, missingSpriteLabel(object.kind, object.id), { labels: scene.labels });
  }
  if (fallbackDraw) return fallbackDraw(object);
  return null;
}

export function renderEntitySprite(scene, manifest, entity, fallbackDraw) {
  const animation = getEntityAnimation(manifest, entity);
  const firstFrame = animation?.frames?.[0];
  const key = spriteKeyFromPath(firstFrame?.file);
  if (animation && firstFrame?.file && scene.textures.exists(key)) {
    const sprite = scene.add.sprite(entity.x, entity.y, key);
    sprite.setOrigin(animation.anchor?.x ?? 0.5, animation.anchor?.y ?? 0.88);
    sprite.setScale(animation.scale || 1);
    if (scene.anims.exists(animation.state_id)) sprite.play(animation.state_id, true);
    return sprite;
  }
  if (shouldShowMissingSpriteDebug()) {
    return drawMissingSprite(scene, entity.x, entity.y, entity.type === 'dog' ? 46 : 34, entity.type === 'dog' ? 30 : 52, missingSpriteLabel(entity.type, entity.id), { labels: scene.labels });
  }
  if (fallbackDraw) return fallbackDraw(entity);
  return null;
}
