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

    const safePad = Math.max(14, Math.min(width, height) * 0.018);
    const availableW = width - safePad * 2;
    const availableH = arenaHeight - safePad * 2;
    const ringOuter = Math.min(availableW, availableH) * 0.94;
    const cx = width * 0.5;
    const cy = safePad + availableH * 0.48;
    const matSize = ringOuter * 0.74;
    const matX = cx - matSize * 0.5;
    const matY = cy - matSize * 0.5;
    const matRight = matX + matSize;
    const matBottom = matY + matSize;
    const ropeGap = Math.max(7, ringOuter * 0.024);
    const ropeLine = Math.max(2.6, ringOuter * 0.0075);
    const ropeOffset = Math.max(14, ringOuter * 0.062);
    const postReach = ropeOffset + ropeGap * 1.8;
    const postRadius = Math.max(9, ringOuter * 0.036);
    const padW = Math.max(24, ringOuter * 0.085);
    const padH = Math.max(20, ringOuter * 0.070);

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
    this.drawRopes(g, matX, matY, matRight, matBottom, ropeOffset, ropeGap, ropeLine);

    this.drawCorner(g, matX, matY, -1, -1, padW, padH, postReach, postRadius);
    this.drawCorner(g, matRight, matY, 1, -1, padW, padH, postReach, postRadius);
    this.drawCorner(g, matX, matBottom, -1, 1, padW, padH, postReach, postRadius);
    this.drawCorner(g, matRight, matBottom, 1, 1, padW, padH, postReach, postRadius);
  }

  drawArena(g, width, arenaHeight, cx, cy, ringOuter) {
    g.fillStyle(0x090909, 1);
    g.fillRect(0, 0, width, arenaHeight);

    const glowW = ringOuter * 1.24;
    g.fillStyle(0x1a1a1a, 1);
    g.fillRoundedRect(cx - glowW * 0.5, cy - glowW * 0.5, glowW, glowW, 18);

    g.lineStyle(2, 0xffffff, 0.12);
    g.strokeRoundedRect(cx - glowW * 0.5, cy - glowW * 0.5, glowW, glowW, 18);

    this.drawCrowdRows(g, width, arenaHeight, ringOuter);

    g.lineStyle(2, 0xffffff, 0.18);
    g.lineBetween(0, arenaHeight - 58, width, arenaHeight - 58);
  }

  drawCrowdRows(g, width, arenaHeight, ringOuter) {
    const railY = arenaHeight - 56;
    const dotBase = Math.max(3, ringOuter * 0.012);

    for (let row = 0; row < 4; row += 1) {
      const y = railY + 12 + row * 18;
      const step = Math.max(20, 30 - row * 2);
      for (let x = 10 + (row % 2) * 12; x < width; x += step) {
        g.fillStyle(0xffffff, 0.18 + row * 0.04);
        g.fillCircle(x, y, dotBase + (row % 2));
      }
    }

    for (let row = 0; row < 3; row += 1) {
      const y = 18 + row * 16;
      const step = Math.max(22, 32 - row * 2);
      for (let x = 8 + (row % 2) * 11; x < width; x += step) {
        g.fillStyle(0xffffff, 0.09 + row * 0.035);
        g.fillCircle(x, y, dotBase * 0.8 + row * 0.45);
      }
    }
  }

  drawApron(g, cx, cy, matSize, ropeOffset, ropeGap) {
    const apronPad = ropeOffset + ropeGap * 3.2;
    const apronX = cx - matSize * 0.5 - apronPad;
    const apronY = cy - matSize * 0.5 - apronPad;
    const apronSize = matSize + apronPad * 2;

    g.fillStyle(0x101010, 1);
    g.fillRoundedRect(apronX, apronY, apronSize, apronSize, 8);
    g.lineStyle(3, 0x000000, 1);
    g.strokeRoundedRect(apronX, apronY, apronSize, apronSize, 8);

    g.lineStyle(1, 0xffffff, 0.12);
    g.strokeRoundedRect(apronX + 6, apronY + 6, apronSize - 12, apronSize - 12, 6);
  }

  drawMat(g, matX, matY, matSize) {
    g.fillStyle(0xffffff, 1);
    g.fillRect(matX, matY, matSize, matSize);

    g.lineStyle(4, 0x050505, 1);
    g.strokeRect(matX, matY, matSize, matSize);

    const inner = matSize * 0.047;
    g.lineStyle(1.5, 0x252525, 0.42);
    g.strokeRect(matX + inner, matY + inner, matSize - inner * 2, matSize - inner * 2);

    g.lineStyle(1, 0x111111, 0.08);
    const stitchStep = matSize / 7;
    for (let i = 1; i < 7; i += 1) {
      const x = matX + stitchStep * i;
      const y = matY + stitchStep * i;
      g.lineBetween(x, matY + inner, x, matY + matSize - inner);
      g.lineBetween(matX + inner, y, matX + matSize - inner, y);
    }
  }

  drawRopes(g, matX, matY, matRight, matBottom, ropeOffset, ropeGap, ropeLine) {
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
    g.lineStyle(width + 3, 0xffffff, 0.22);
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
    g.fillCircle(postX, postY, postRadius * 1.2);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(postX, postY, postRadius * 0.58);
    g.lineStyle(2.5, 0x000000, 1);
    g.strokeCircle(postX, postY, postRadius * 0.58);

    const padX = x + (sx > 0 ? -padW * 0.08 : -padW * 0.92);
    const padY = y + (sy > 0 ? -padH * 0.08 : -padH * 0.92);
    g.fillStyle(0x000000, 1);
    g.fillRoundedRect(padX - 4, padY - 4, padW + 8, padH + 8, 8);
    g.fillStyle(0xffffff, 1);
    g.fillRoundedRect(padX, padY, padW, padH, 7);
    g.lineStyle(2.5, 0x000000, 1);
    g.strokeRoundedRect(padX, padY, padW, padH, 7);

    g.lineStyle(1, 0x000000, 0.45);
    const seamY = padY + padH * 0.5;
    g.lineBetween(padX + 4, seamY, padX + padW - 4, seamY);
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
