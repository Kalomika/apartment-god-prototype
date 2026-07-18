const FPS = 8;
const FRAME_MS = 1000 / FPS;

export class HardCamSpriteRingRenderer {
  constructor(scene) {
    this.scene = scene;
    this.frame = 0;
    this.nextFrameAt = 0;
    this.backgroundKeys = ['hard-cam-crowd-bg-0', 'hard-cam-crowd-bg-1'];
    this.ringKeys = ['hard-cam-ring-frame-0', 'hard-cam-ring-frame-1'];
    this.foregroundKeys = ['hard-cam-crowd-fg-0', 'hard-cam-crowd-fg-1'];

    this.background = scene.add.image(0, 0, this.backgroundKeys[0]).setOrigin(0, 0).setDepth(0);
    this.ring = scene.add.image(0, 0, this.ringKeys[0]).setOrigin(0, 0).setDepth(2);
    this.foreground = scene.add.image(0, 0, this.foregroundKeys[0]).setOrigin(0, 0).setDepth(4);
  }

  layout(layout) {
    [this.background, this.ring, this.foreground].forEach((image) => {
      image.setPosition(0, 0);
      image.setDisplaySize(layout.width, layout.arenaHeight);
    });
  }

  update(time) {
    if (time < this.nextFrameAt) return;

    this.frame = (this.frame + 1) % 2;
    this.nextFrameAt = time + FRAME_MS;
    this.background.setTexture(this.backgroundKeys[this.frame]);
    this.ring.setTexture(this.ringKeys[this.frame]);
    this.foreground.setTexture(this.foregroundKeys[this.frame]);
  }
}
