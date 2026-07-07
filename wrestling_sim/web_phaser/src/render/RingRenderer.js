export class RingRenderer {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.bounds = null;
  }

  draw(layout) {
    const { width, height, arenaHeight } = layout;
    const g = this.graphics;
    g.clear();

    const safePad = Math.max(12, Math.min(width, height) * 0.025);
    const uiGap = Math.max(8, height * 0.01);
    const ringSize = Math.min(width - safePad * 2, arenaHeight - safePad * 2 - uiGap) * 0.78;
    const cx = width * 0.5;
    const cy = arenaHeight * 0.52;
    const matSize = ringSize * 0.72;
    const matX = cx - matSize * 0.5;
    const matY = cy - matSize * 0.5;
    const matRight = matX + matSize;
    const matBottom = matY + matSize;
    const ropeGap = Math.max(5, ringSize * 0.018);
    const ropeLine = Math.max(2, ringSize * 0.0065);
    const ropeMargin = ringSize * 0.07;
    const postReach = ringSize * 0.13;
    const padSize = ringSize * 0.07;
    const postRadius = ringSize * 0.021;

    this.bounds = {
      x: matX,
      y: matY,
      size: matSize,
      centerX: cx,
      centerY: cy,
      arenaHeight
    };

    this.drawArena(g, width, arenaHeight);

    // Dark apron and mat frame.
    g.fillStyle(0x111111, 1);
    g.fillRect(matX - ropeMargin, matY - ropeMargin, matSize + ropeMargin * 2, ropeMargin * 0.55);
    g.fillRect(matX - ropeMargin, matBottom + ropeMargin * 0.45, matSize + ropeMargin * 2, ropeMargin * 0.55);
    g.fillRect(matX - ropeMargin, matY - ropeMargin, ropeMargin * 0.55, matSize + ropeMargin * 2);
    g.fillRect(matRight + ropeMargin * 0.45, matY - ropeMargin, ropeMargin * 0.55, matSize + ropeMargin * 2);

    // White mat.
    g.fillStyle(0xffffff, 1);
    g.fillRect(matX, matY, matSize, matSize);
    g.lineStyle(Math.max(3, ropeLine * 2), 0x000000, 1);
    g.strokeRect(matX, matY, matSize, matSize);
    g.lineStyle(1, 0x222222, 0.45);
    const inset = matSize * 0.045;
    g.strokeRect(matX + inset, matY + inset, matSize - inset * 2, matSize - inset * 2);

    // Ropes, transparent gaps are just empty stage background.
    g.lineStyle(ropeLine, 0x000000, 1);
    for (let i = 0; i < 3; i += 1) {
      const offset = i * ropeGap;
      g.lineBetween(matX - ropeMargin * 0.25, matY - ropeMargin + offset, matRight + ropeMargin * 0.25, matY - ropeMargin + offset);
      g.lineBetween(matX - ropeMargin * 0.25, matBottom + ropeMargin + offset, matRight + ropeMargin * 0.25, matBottom + ropeMargin + offset);
      g.lineBetween(matX - ropeMargin + offset, matY - ropeMargin * 0.25, matX - ropeMargin + offset, matBottom + ropeMargin * 0.25);
      g.lineBetween(matRight + ropeMargin + offset, matY - ropeMargin * 0.25, matRight + ropeMargin + offset, matBottom + ropeMargin * 0.25);
    }

    this.drawCorner(g, matX, matY, -1, -1, padSize, postReach, postRadius);
    this.drawCorner(g, matRight, matY, 1, -1, padSize, postReach, postRadius);
    this.drawCorner(g, matX, matBottom, -1, 1, padSize, postReach, postRadius);
    this.drawCorner(g, matRight, matBottom, 1, 1, padSize, postReach, postRadius);
  }

  drawArena(g, width, arenaHeight) {
    g.fillStyle(0x101010, 1);
    g.fillRect(0, 0, width, arenaHeight);

    const crowdRows = 3;
    for (let row = 0; row < crowdRows; row += 1) {
      const y = arenaHeight - 20 - row * 13;
      const step = 28 - row * 3;
      for (let x = 10 + (row % 2) * 10; x < width; x += step) {
        const alpha = 0.18 + row * 0.08;
        g.fillStyle(0xffffff, alpha);
        g.fillCircle(x, y, 3 + row);
      }
    }

    g.lineStyle(2, 0xffffff, 0.12);
    g.lineBetween(0, arenaHeight - 56, width, arenaHeight - 56);
  }

  drawCorner(g, x, y, sx, sy, padSize, postReach, postRadius) {
    const postX = x + sx * postReach;
    const postY = y + sy * postReach;
    const padX = x + (sx > 0 ? 0 : -padSize);
    const padY = y + (sy > 0 ? 0 : -padSize);

    g.lineStyle(Math.max(5, postRadius * 0.8), 0x000000, 1);
    g.lineBetween(x + sx * padSize * 0.35, y + sy * padSize * 0.35, postX, postY);

    g.fillStyle(0x000000, 1);
    g.fillCircle(postX, postY, postRadius * 1.15);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(postX, postY, postRadius * 0.7);
    g.lineStyle(2, 0x000000, 1);
    g.strokeCircle(postX, postY, postRadius * 0.7);

    g.fillStyle(0x000000, 1);
    g.fillRoundedRect(padX - 3 * (sx < 0 ? 0 : 1), padY - 3 * (sy < 0 ? 0 : 1), padSize + 6, padSize + 6, 8);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(padX, padY, padSize, padSize, 8);
    g.lineStyle(2, 0x000000, 1);
    g.strokeRoundedRect(padX, padY, padSize, padSize, 8);
  }

  ringToScreen(nx, ny) {
    if (!this.bounds) {
      return { x: 0, y: 0 };
    }

    return {
      x: this.bounds.x + (nx * 0.5 + 0.5) * this.bounds.size,
      y: this.bounds.y + (ny * 0.5 + 0.5) * this.bounds.size
    };
  }
}
