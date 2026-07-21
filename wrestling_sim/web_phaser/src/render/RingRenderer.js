export class RingRenderer {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.bounds = null;
  }

  draw(layout) {
    const { width, arenaHeight } = layout;
    const g = this.graphics;
    g.clear();

    const safePad = Math.max(12, Math.min(width, arenaHeight) * 0.04);
    const ringOuter = Math.min(width - safePad * 2, arenaHeight - safePad * 1.8) * 0.92;
    const cx = width * 0.5;
    const cy = arenaHeight * 0.48;
    const matSize = ringOuter * 0.68;
    const matX = cx - matSize * 0.5;
    const matY = cy - matSize * 0.5;
    const ropeOffset = ringOuter * 0.075;
    const ropeGap = Math.max(6, ringOuter * 0.025);
    const ropeLine = Math.max(2.5, ringOuter * 0.008);
    const postRadius = Math.max(9, ringOuter * 0.035);
    const postReach = ropeOffset + ropeGap * 2;
    const padW = Math.max(24, ringOuter * 0.08);
    const padH = Math.max(19, ringOuter * 0.065);

    this.bounds = {
      x: matX,
      y: matY,
      size: matSize,
      centerX: cx,
      centerY: cy,
      arenaHeight
    };

    this.drawArena(g, width, arenaHeight, cx, cy, ringOuter);
    this.drawApron(g, cx, cy, matSize, ropeOffset, ropeGap);
    this.drawMat(g, matX, matY, matSize);
    this.drawRopes(g, matX, matY, matSize, ropeOffset, ropeGap, ropeLine);

    this.drawCorner(g, matX, matY, -1, -1, padW, padH, postReach, postRadius);
    this.drawCorner(g, matX + matSize, matY, 1, -1, padW, padH, postReach, postRadius);
    this.drawCorner(g, matX, matY + matSize, -1, 1, padW, padH, postReach, postRadius);
    this.drawCorner(g, matX + matSize, matY + matSize, 1, 1, padW, padH, postReach, postRadius);
  }

  drawArena(g, width, arenaHeight, cx, cy, ringOuter) {
    g.fillStyle(0x090909, 1);
    g.fillRect(0, 0, width, arenaHeight);

    const stageSize = ringOuter * 1.25;
    g.fillStyle(0x161616, 1);
    g.fillRect(cx - stageSize * 0.5, cy - stageSize * 0.5, stageSize, stageSize);
    g.lineStyle(2, 0x333333, 1);
    g.strokeRect(cx - stageSize * 0.5, cy - stageSize * 0.5, stageSize, stageSize);

    const railY = arenaHeight - 58;
    g.lineStyle(3, 0x2e2e2e, 1);
    g.lineBetween(0, railY, width, railY);

    for (let row = 0; row < 5; row += 1) {
      const y = railY + 13 + row * 17;
      const step = Math.max(20, 30 - row * 2);
      for (let x = 8 + (row % 2) * 12; x < width; x += step) {
        g.fillStyle(0xffffff, 0.18 + row * 0.035);
        g.fillCircle(x, y, 3 + (row % 2));
      }
    }

    for (let row = 0; row < 3; row += 1) {
      const y = 16 + row * 16;
      const step = 30 - row * 2;
      for (let x = 8 + (row % 2) * 11; x < width; x += step) {
        g.fillStyle(0xffffff, 0.08 + row * 0.035);
        g.fillCircle(x, y, 2.5 + row * 0.5);
      }
    }
  }

  drawApron(g, cx, cy, matSize, ropeOffset, ropeGap) {
    const apronPad = ropeOffset + ropeGap * 3;
    const apronX = cx - matSize * 0.5 - apronPad;
    const apronY = cy - matSize * 0.5 - apronPad;
    const apronSize = matSize + apronPad * 2;

    g.fillStyle(0x080808, 1);
    g.fillRect(apronX, apronY, apronSize, apronSize);
    g.lineStyle(4, 0x000000, 1);
    g.strokeRect(apronX, apronY, apronSize, apronSize);
    g.lineStyle(1.5, 0x3a3a3a, 1);
    g.strokeRect(apronX + 7, apronY + 7, apronSize - 14, apronSize - 14);
  }

  drawMat(g, matX, matY, matSize) {
    g.fillStyle(0xffffff, 1);
    g.fillRect(matX, matY, matSize, matSize);
    g.lineStyle(4, 0x050505, 1);
    g.strokeRect(matX, matY, matSize, matSize);

    const inset = matSize * 0.045;
    g.lineStyle(1.5, 0x444444, 0.42);
    g.strokeRect(matX + inset, matY + inset, matSize - inset * 2, matSize - inset * 2);

    g.lineStyle(1, 0x111111, 0.08);
    const stitchStep = matSize / 7;
    for (let i = 1; i < 7; i += 1) {
      const x = matX + stitchStep * i;
      const y = matY + stitchStep * i;
      g.lineBetween(x, matY + inset, x, matY + matSize - inset);
      g.lineBetween(matX + inset, y, matX + matSize - inset, y);
    }
  }

  drawRopes(g, matX, matY, matSize, ropeOffset, ropeGap, ropeLine) {
    const matRight = matX + matSize;
    const matBottom = matY + matSize;
    const leftPostX = matX - ropeOffset - ropeGap * 2;
    const rightPostX = matRight + ropeOffset + ropeGap * 2;
    const topPostY = matY - ropeOffset - ropeGap * 2;
    const bottomPostY = matBottom + ropeOffset + ropeGap * 2;

    for (let i = 0; i < 3; i += 1) {
      const gap = i * ropeGap;
      const topY = matY - ropeOffset - gap;
      const bottomY = matBottom + ropeOffset + gap;
      const leftX = matX - ropeOffset - gap;
      const rightX = matRight + ropeOffset + gap;

      this.drawRopeLine(g, leftPostX, topY, rightPostX, topY, ropeLine);
      this.drawRopeLine(g, leftPostX, bottomY, rightPostX, bottomY, ropeLine);
      this.drawRopeLine(g, leftX, topPostY, leftX, bottomPostY, ropeLine);
      this.drawRopeLine(g, rightX, topPostY, rightX, bottomPostY, ropeLine);
    }
  }

  drawRopeLine(g, x1, y1, x2, y2, width) {
    g.lineStyle(width + 3, 0xffffff, 0.25);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(width, 0x000000, 1);
    g.lineBetween(x1, y1, x2, y2);
  }

  drawCorner(g, x, y, sx, sy, padW, padH, postReach, postRadius) {
    const postX = x + sx * postReach;
    const postY = y + sy * postReach;

    g.lineStyle(5, 0x000000, 1);
    g.lineBetween(x, y, postX, postY);

    g.fillStyle(0x000000, 1);
    g.fillCircle(postX, postY, postRadius * 1.25);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(postX, postY, postRadius * 0.62);
    g.lineStyle(2.5, 0x000000, 1);
    g.strokeCircle(postX, postY, postRadius * 0.62);

    const padX = x + (sx > 0 ? -padW * 0.08 : -padW * 0.92);
    const padY = y + (sy > 0 ? -padH * 0.08 : -padH * 0.92);
    g.fillStyle(0x000000, 1);
    g.fillRect(padX - 4, padY - 4, padW + 8, padH + 8);
    g.fillStyle(0xffffff, 1);
    g.fillRect(padX, padY, padW, padH);
    g.lineStyle(2.5, 0x000000, 1);
    g.strokeRect(padX, padY, padW, padH);
    g.lineStyle(1, 0x000000, 0.45);
    g.lineBetween(padX + 4, padY + padH * 0.5, padX + padW - 4, padY + padH * 0.5);
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
