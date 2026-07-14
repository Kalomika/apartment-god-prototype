const DOG_ATLAS = new Image();
DOG_ATLAS.src = new URL('../assets/sprites/characters/dog/top_down_dog_atlas.svg', import.meta.url).href;

export function drawDogSpriteOverlay(ctx, state) {
  if (!DOG_ATLAS.complete || DOG_ATLAS.naturalWidth === 0) return;
  for (const dog of (state.entities || []).filter(e => !e.hidden && e.floor === state.floor && e.type === 'dog')) {
    const frame = directionFrame(resolveDogDirection(dog));
    ctx.save();
    ctx.translate(dog.x, dog.y);
    const moving = Array.isArray(dog.path) && dog.path.length > 0;
    const bob = moving ? Math.sin(performance.now() / 110) * 1.4 : 0;
    ctx.translate(0, bob);
    ctx.drawImage(DOG_ATLAS, frame * 128, 0, 128, 128, -37, -44, 74, 74);
    ctx.restore();
  }
}

function resolveDogDirection(dog) {
  const target = Array.isArray(dog.path) && dog.path.length > 0 ? dog.path[0] : dog.target;
  const dx = Number.isFinite(dog.vx) && Math.abs(dog.vx) > 0.01 ? dog.vx : target ? target.x - dog.x : 0;
  const dy = Number.isFinite(dog.vy) && Math.abs(dog.vy) > 0.01 ? dog.vy : target ? target.y - dog.y : 0;
  if (Math.abs(dx) + Math.abs(dy) < 0.01) return dog.lastDogDirection || 'south';
  const direction = Math.abs(dy) >= Math.abs(dx) ? (dy < 0 ? 'north' : 'south') : (dx < 0 ? 'west' : 'east');
  dog.lastDogDirection = direction;
  return direction;
}

function directionFrame(direction) {
  return { south: 0, north: 1, east: 2, west: 3 }[direction] ?? 0;
}
