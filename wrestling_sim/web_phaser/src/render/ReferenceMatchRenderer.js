const FRAME_MS = 125;

export class ReferenceMatchRenderer {
  constructor(scene) {
    this.scene = scene;
    this.image = scene.add.image(0, 0, 'reference-match').setOrigin(0, 0).setDepth(0);
    this.fx = scene.add.graphics().setDepth(5);
    this.frame = 0;
    this.nextFrameAt = 0;
    this.lastRedMove = null;
    this.lastBlueMove = null;
    this.impactFrames = 0;
    this.layoutState = null;
  }

  layout(layout) {
    this.layoutState = layout;
    this.image.setPosition(0, 0);
    this.image.setDisplaySize(layout.width, layout.arenaHeight);
    this.drawHud(null);
  }

  update(time, snapshot) {
    if (!this.layoutState || time < this.nextFrameAt) return;

    this.nextFrameAt = time + FRAME_MS;
    this.frame = (this.frame + 1) % 8;

    const redMove = snapshot?.red?.lastMove ?? null;
    const blueMove = snapshot?.blue?.lastMove ?? null;
    if (redMove !== this.lastRedMove || blueMove !== this.lastBlueMove) {
      this.lastRedMove = redMove;
      this.lastBlueMove = blueMove;
      this.impactFrames = this.getImpactFrames(redMove, blueMove);
    }

    const crowdPulse = this.frame % 2 === 0 ? 1 : 0.985;
    this.image.setScale(crowdPulse);
    this.image.setPosition(
      crowdPulse === 1 ? 0 : this.layoutState.width * 0.0075,
      crowdPulse === 1 ? 0 : this.layoutState.arenaHeight * 0.0075
    );
    this.image.setDisplaySize(
      this.layoutState.width * crowdPulse,
      this.layoutState.arenaHeight * crowdPulse
    );

    if (this.impactFrames > 0) {
      const heavy = this.impactFrames >= 4;
      const shake = heavy ? 5 : 2;
      const x = (this.frame % 2 === 0 ? -1 : 1) * shake;
      const y = (this.frame % 3 === 0 ? -1 : 1) * Math.max(1, shake * 0.45);
      this.image.x += x;
      this.image.y += y;
      this.impactFrames -= 1;
    }

    this.drawHud(snapshot);
  }

  getImpactFrames(redMove, blueMove) {
    const move = redMove || blueMove;
    if (move === 'basic_slam') return 6;
    if (move === 'basic_punch') return 3;
    if (move === 'irish_whip') return 4;
    if (move === 'lockup') return 2;
    if (move === 'pin_attempt') return 3;
    return 0;
  }

  drawHud(snapshot) {
    if (!this.layoutState) return;

    const { width, arenaHeight } = this.layoutState;
    const g = this.fx;
    g.clear();

    const redStamina = snapshot?.red?.stamina ?? 100;
    const blueStamina = snapshot?.blue?.stamina ?? 100;
    const redDamage = snapshot?.red?.damage ?? 0;
    const blueDamage = snapshot?.blue?.damage ?? 0;

    const barW = Math.min(145, width * 0.24);
    const barH = Math.max(7, arenaHeight * 0.018);
    const top = Math.max(11, arenaHeight * 0.026);
    const leftX = width * 0.22;
    const rightX = width * 0.78 - barW;

    this.drawBar(g, leftX, top, barW, barH, redStamina / 100, 0xf5d328);
    this.drawBar(g, rightX, top, barW, barH, blueStamina / 100, 0xf5d328);
    this.drawBar(g, leftX, top + barH + 5, barW * 0.56, Math.max(4, barH * 0.55), redDamage / 100, 0x39a7e8);
    this.drawBar(g, rightX + barW * 0.44, top + barH + 5, barW * 0.56, Math.max(4, barH * 0.55), blueDamage / 100, 0xe544a7);

    if (this.impactFrames > 0) {
      g.fillStyle(0xffffff, this.impactFrames % 2 === 0 ? 0.11 : 0.04);
      g.fillRect(0, 0, width, arenaHeight);
    }
  }

  drawBar(g, x, y, width, height, value, color) {
    const clamped = Math.max(0, Math.min(1, value));
    g.fillStyle(0x050505, 0.92);
    g.fillRect(x - 2, y - 2, width + 4, height + 4);
    g.fillStyle(0x222222, 0.95);
    g.fillRect(x, y, width, height);
    g.fillStyle(color, 1);
    g.fillRect(x, y, width * clamped, height);
    g.lineStyle(1, 0xffffff, 0.7);
    g.strokeRect(x, y, width, height);
  }
}
