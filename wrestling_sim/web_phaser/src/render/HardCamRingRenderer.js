const FPS = 8;
const FRAME_MS = 1000 / FPS;

function clamp(value, min, max) {
  return Math.max(min, Math.min(max, value));
}

export class HardCamRingRenderer {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.layoutState = null;
    this.frame = 0;
    this.nextFrameAt = 0;
  }

  layout(layout) {
    this.layoutState = layout;
    this.draw(0);
  }

  update(time) {
    if (!this.layoutState) return;
    if (time < this.nextFrameAt) return;

    this.frame = (this.frame + 1) % FPS;
    this.nextFrameAt = time + FRAME_MS;
    this.draw(this.frame);
  }

  draw(frame = 0) {
    const layout = this.layoutState;
    if (!layout) return;

    const { width, arenaHeight } = layout;
    const g = this.graphics;
    g.clear();

    const viewW = width;
    const viewH = arenaHeight;
    const cx = viewW * 0.5;
    const floorY = viewH * 0.82;
    const matBackY = viewH * 0.34;
    const matFrontY = viewH * 0.61;
    const ringW = Math.min(viewW * 0.88, viewH * 1.35);
    const backW = ringW * 0.72;
    const frontW = ringW;
    const backLeft = cx - backW * 0.5;
    const backRight = cx + backW * 0.5;
    const frontLeft = cx - frontW * 0.5;
    const frontRight = cx + frontW * 0.5;
    const apronFrontY = matFrontY + viewH * 0.13;
    const apronBackY = matBackY + viewH * 0.04;
    const postTopY = matBackY - viewH * 0.19;
    const postBottomY = apronFrontY + viewH * 0.035;

    this.drawArena(g, width, viewH, frame, floorY);
    this.drawRingShadow(g, cx, matFrontY, frontW, viewH);
    this.drawApron(g, backLeft, backRight, frontLeft, frontRight, apronBackY, matFrontY, apronFrontY);
    this.drawCanvas(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, frame);
    this.drawPosts(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, postTopY, postBottomY);
    this.drawRopes(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, postTopY, postBottomY);
    this.drawTurnbuckles(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, postTopY);
    this.drawRingPaint(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, apronFrontY, frame);
  }

  drawArena(g, width, height, frame, floorY) {
    g.fillStyle(0x060606, 1);
    g.fillRect(0, 0, width, height);

    g.fillStyle(0x101010, 1);
    g.fillRect(0, height * 0.12, width, height * 0.31);
    g.lineStyle(2, 0x242424, 1);
    g.lineBetween(0, height * 0.43, width, height * 0.43);

    const pulse = frame % 2 === 0 ? 0.04 : 0;
    for (let row = 0; row < 5; row += 1) {
      const y = height * 0.145 + row * height * 0.047;
      const step = clamp(width * 0.05 - row * 2, 18, 32);
      for (let x = 8 + (row % 2) * 12; x < width; x += step) {
        const alpha = 0.10 + row * 0.025 + pulse;
        g.fillStyle(0xffffff, alpha);
        g.fillCircle(x, y, 2.4 + (row % 2));
      }
    }

    g.fillStyle(0x1b1b1b, 1);
    g.fillRect(0, floorY, width, height - floorY);
    g.lineStyle(3, 0x000000, 1);
    g.lineBetween(0, floorY, width, floorY);
    g.lineStyle(1, 0xffffff, 0.08);
    for (let i = 0; i < 9; i += 1) {
      const y = floorY + 8 + i * 12;
      g.lineBetween(0, y, width, y);
    }

    g.fillStyle(0xffffff, 0.04 + pulse * 0.5);
    g.fillTriangle(width * 0.30, height * 0.04, width * 0.43, floorY, width * 0.16, floorY);
    g.fillTriangle(width * 0.70, height * 0.04, width * 0.84, floorY, width * 0.56, floorY);
  }

  drawRingShadow(g, cx, matFrontY, frontW, height) {
    g.fillStyle(0x000000, 0.42);
    g.fillEllipse(cx, matFrontY + height * 0.13, frontW * 0.62, height * 0.10);
  }

  drawCanvas(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, frame) {
    g.fillStyle(0xf5f2ea, 1);
    this.fillTrapezoid(g, backLeft, matBackY, backRight, matBackY, frontRight, matFrontY, frontLeft, matFrontY);

    g.fillStyle(frame % 2 === 0 ? 0xffffff : 0xebe7dd, 0.10);
    this.fillTrapezoid(g, backLeft + 12, matBackY + 8, backRight - 12, matBackY + 8, frontRight - 22, matFrontY - 11, frontLeft + 22, matFrontY - 11);

    g.lineStyle(4, 0x050505, 1);
    this.strokeTrapezoid(g, backLeft, matBackY, backRight, matBackY, frontRight, matFrontY, frontLeft, matFrontY);

    g.lineStyle(1, 0x000000, 0.13);
    for (let i = 1; i < 5; i += 1) {
      const t = i / 5;
      const x1 = this.lerp(backLeft, frontLeft, t);
      const y1 = this.lerp(matBackY, matFrontY, t);
      const x2 = this.lerp(backRight, frontRight, t);
      const y2 = this.lerp(matBackY, matFrontY, t);
      g.lineBetween(x1, y1, x2, y2);
    }

    for (let i = 1; i < 6; i += 1) {
      const t = i / 6;
      const bx = this.lerp(backLeft, backRight, t);
      const fx = this.lerp(frontLeft, frontRight, t);
      g.lineBetween(bx, matBackY + 5, fx, matFrontY - 5);
    }
  }

  drawApron(g, backLeft, backRight, frontLeft, frontRight, apronBackY, matFrontY, apronFrontY) {
    g.fillStyle(0x0a0a0a, 1);
    this.fillTrapezoid(g, backLeft, apronBackY, backRight, apronBackY, frontRight + 16, apronFrontY, frontLeft - 16, apronFrontY);

    g.lineStyle(4, 0x000000, 1);
    this.strokeTrapezoid(g, backLeft, apronBackY, backRight, apronBackY, frontRight + 16, apronFrontY, frontLeft - 16, apronFrontY);

    g.fillStyle(0xffffff, 0.08);
    g.fillRect(frontLeft - 6, matFrontY + 7, frontRight - frontLeft + 12, 7);
  }

  drawPosts(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, postTopY, postBottomY) {
    const postW = 9;
    const posts = [
      { x: backLeft, y: matBackY, depth: 0.78 },
      { x: backRight, y: matBackY, depth: 0.78 },
      { x: frontLeft, y: matFrontY, depth: 1 },
      { x: frontRight, y: matFrontY, depth: 1 }
    ];

    posts.forEach((post) => {
      const top = this.lerp(post.y, postTopY, post.depth);
      const bottom = this.lerp(post.y, postBottomY, post.depth);
      g.fillStyle(0x050505, 1);
      g.fillRect(post.x - postW * 0.5, top, postW, bottom - top);
      g.fillStyle(0xffffff, 0.18);
      g.fillRect(post.x - postW * 0.15, top + 5, 2, bottom - top - 10);
    });
  }

  drawRopes(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, postTopY) {
    const ropeLevels = [0.19, 0.34, 0.49];
    ropeLevels.forEach((level) => {
      const backY = this.lerp(postTopY, matBackY, level);
      const frontY = this.lerp(postTopY, matFrontY, level + 0.12);

      this.rope(g, backLeft, backY, backRight, backY, 3.2);
      this.rope(g, frontLeft, frontY, frontRight, frontY, 4.6);
      this.rope(g, backLeft, backY, frontLeft, frontY, 3.5);
      this.rope(g, backRight, backY, frontRight, frontY, 3.5);
    });
  }

  rope(g, x1, y1, x2, y2, width) {
    g.lineStyle(width + 3, 0xffffff, 0.24);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(width, 0x000000, 1);
    g.lineBetween(x1, y1, x2, y2);
  }

  drawTurnbuckles(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, postTopY) {
    const levels = [0.22, 0.38, 0.54];
    const corners = [
      { x: backLeft, y: matBackY, sx: -1, scale: 0.75 },
      { x: backRight, y: matBackY, sx: 1, scale: 0.75 },
      { x: frontLeft, y: matFrontY, sx: -1, scale: 1 },
      { x: frontRight, y: matFrontY, sx: 1, scale: 1 }
    ];

    corners.forEach((corner) => {
      levels.forEach((level) => {
        const y = this.lerp(postTopY, corner.y, level + (corner.scale === 1 ? 0.12 : 0));
        const w = 24 * corner.scale;
        const h = 12 * corner.scale;
        const x = corner.x + corner.sx * w * 0.18;
        g.fillStyle(0x000000, 1);
        g.fillRect(x - w * 0.5 - 2, y - h * 0.5 - 2, w + 4, h + 4);
        g.fillStyle(0xffffff, 1);
        g.fillRect(x - w * 0.5, y - h * 0.5, w, h);
      });
    });
  }

  drawRingPaint(g, backLeft, backRight, frontLeft, frontRight, matBackY, matFrontY, apronFrontY, frame) {
    g.fillStyle(0xffffff, 0.11 + (frame % 2) * 0.04);
    this.fillTrapezoid(g, backLeft + 16, matBackY + 10, backRight - 16, matBackY + 10, frontRight - 34, matFrontY - 14, frontLeft + 34, matFrontY - 14);

    g.lineStyle(2, 0xffffff, 0.10);
    g.lineBetween(frontLeft, apronFrontY - 18, frontRight, apronFrontY - 18);
  }

  fillTrapezoid(g, ax, ay, bx, by, cx, cy, dx, dy) {
    g.fillTriangle(ax, ay, bx, by, cx, cy);
    g.fillTriangle(ax, ay, cx, cy, dx, dy);
  }

  strokeTrapezoid(g, ax, ay, bx, by, cx, cy, dx, dy) {
    g.lineBetween(ax, ay, bx, by);
    g.lineBetween(bx, by, cx, cy);
    g.lineBetween(cx, cy, dx, dy);
    g.lineBetween(dx, dy, ax, ay);
  }

  lerp(a, b, t) {
    return a + (b - a) * t;
  }
}
