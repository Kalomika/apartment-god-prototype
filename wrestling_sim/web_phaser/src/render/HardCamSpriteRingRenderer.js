const FPS = 8;
const FRAME_MS = 1000 / FPS;

export class HardCamSpriteRingRenderer {
  constructor(scene) {
    this.scene = scene;
    this.keys = ['hard-cam-ring-frame-0', 'hard-cam-ring-frame-1'];
    this.frame = 0;
    this.nextFrameAt = 0;
    this.image = scene.add.image(0, 0, this.keys[0]).setOrigin(0, 0);
  }

  layout(layout) {
    this.image.setPosition(0, 0);
    this.image.setDisplaySize(layout.width, layout.arenaHeight);
  }

  update(time) {
    if (time < this.nextFrameAt) return;

    this.frame = (this.frame + 1) % this.keys.length;
    this.nextFrameAt = time + FRAME_MS;
    this.image.setTexture(this.keys[this.frame]);
  }
}
