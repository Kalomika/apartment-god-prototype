export class WrestlerProxy {
  constructor(scene, profile) {
    this.scene = scene;
    this.profile = profile;
    this.container = scene.add.container(0, 0);
    this.graphics = scene.add.graphics();
    this.state = 'idle';
    this.scale = 1;

    this.nameText = scene.add.text(0, 72, profile.shortName, {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '10px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 0);

    this.container.add([this.graphics, this.nameText]);
    this.draw();
  }

  setState(state) {
    if (this.state !== state) {
      this.state = state;
      this.draw();
    }
  }

  setPosition(x, y) {
    this.container.setPosition(x, y);
  }

  setFacingRadians(angle) {
    this.container.setRotation(angle);
  }

  setSpriteScale(scale) {
    this.scale = scale * (this.profile.bodyScale ?? 1);
    this.container.setScale(this.scale);
  }

  draw() {
    const g = this.graphics;
    g.setVisible(true);
    g.clear();

    const palette = this.getPalette();
    const state = this.state;
    const isDown = state === 'downed' || state === 'pinned';

    if (isDown) {
      this.drawDownedFigure(g, palette);
      this.nameText.setY(48);
      return;
    }

    this.drawStandingFigure(g, palette);
    this.nameText.setY(72);
  }

  getPalette() {
    const darkGear = this.profile.gearColor === 0x303030 || this.profile.gearColor === 0x202020 || this.profile.gearColor === 0x3b3b3b;

    return {
      ink: this.profile.outlineColor ?? 0x071018,
      softInk: darkGear ? 0xd8d8d8 : 0x565656,
      skin: this.profile.id === 'dante-crowe' ? 0xe8c3a2 : 0xf4dcc4,
      gear: this.profile.gearColor ?? 0xf4f4f4,
      gearLine: darkGear ? 0xffffff : 0x151515,
      hair: this.profile.hairColor ?? 0x111111,
      boot: darkGear ? 0x121212 : 0xf1f1f1,
      tape: darkGear ? 0xf7f7f7 : 0xffffff
    };
  }

  drawStandingFigure(g, p) {
    const state = this.state;
    const locking = state === 'lockup' || state === 'grappleAdvantage';
    const striking = state === 'striking';
    const running = state === 'ropeRun' || state === 'closingDistance';
    const selling = state === 'selling' || state === 'recovering';
    const pinning = state === 'pinning';

    const step = running ? 12 : selling ? 5 : 0;
    const crouch = locking ? 3 : selling ? 2 : 0;
    const shoulderY = -19 + crouch;
    const hipY = 30 + crouch;

    this.drawMatShadow(g, 0, 8, 64, 94);

    this.drawCurvedLimb(g, -13, hipY, -22, 49 + step, -19, 70 + step * 0.25, 5.4, p.ink, p.skin);
    this.drawCurvedLimb(g, 13, hipY, 21, 43 - step * 0.45, 20, 64 - step * 0.35, 5.4, p.ink, p.skin);
    this.drawFoot(g, -19, 76 + step * 0.25, 10, 18, p.ink, p.boot);
    this.drawFoot(g, 20, 70 - step * 0.35, 10, 18, p.ink, p.boot);
    this.drawPad(g, -20, 51 + step, 15, 8, p.ink, p.gear, p.gearLine);
    this.drawPad(g, 21, 44 - step * 0.45, 15, 8, p.ink, p.gear, p.gearLine);

    this.drawTorso(g, p, crouch, selling);

    const leftArm = this.getArmPose('left', { locking, striking, running, selling, pinning, shoulderY });
    const rightArm = this.getArmPose('right', { locking, striking, running, selling, pinning, shoulderY });
    this.drawArm(g, leftArm, p);
    this.drawArm(g, rightArm, p);

    this.drawHead(g, p, crouch);

    if (locking) {
      g.lineStyle(2, p.ink, 0.55);
      g.strokeCircle(0, -24, 42);
      g.lineStyle(1.2, p.softInk, 0.65);
      g.lineBetween(-30, -48, -7, -32);
      g.lineBetween(30, -48, 7, -32);
    }
  }

  getArmPose(side, flags) {
    const sx = side === 'left' ? -34 : 34;
    const mirror = side === 'left' ? -1 : 1;
    const { locking, striking, running, selling, pinning, shoulderY } = flags;

    if (locking) {
      return {
        shoulder: [sx, shoulderY],
        elbow: [mirror * 42, -43],
        wrist: [mirror * 25, -65],
        hand: [mirror * 20, -73],
        open: true
      };
    }

    if (pinning) {
      return {
        shoulder: [sx, shoulderY],
        elbow: [mirror * 44, 0],
        wrist: [mirror * 23, 18],
        hand: [mirror * 18, 25],
        open: true
      };
    }

    if (striking && side === 'right') {
      return {
        shoulder: [sx, shoulderY],
        elbow: [mirror * 42, -35],
        wrist: [mirror * 22, -63],
        hand: [mirror * 20, -71],
        open: false
      };
    }

    if (running) {
      return {
        shoulder: [sx, shoulderY],
        elbow: [mirror * 48, side === 'left' ? 4 : -34],
        wrist: [mirror * 40, side === 'left' ? 34 : -50],
        hand: [mirror * 39, side === 'left' ? 42 : -58],
        open: false
      };
    }

    if (selling) {
      return {
        shoulder: [sx, shoulderY],
        elbow: [mirror * 48, 6],
        wrist: [mirror * 35, 32],
        hand: [mirror * 34, 40],
        open: true
      };
    }

    return {
      shoulder: [sx, shoulderY],
      elbow: [mirror * 48, 8],
      wrist: [mirror * 40, 34],
      hand: [mirror * 39, 43],
      open: false
    };
  }

  drawTorso(g, p, crouch, selling) {
    const topY = -30 + crouch;
    const shoulderY = -20 + crouch;
    const hipY = 31 + crouch;
    const waistY = 19 + crouch;
    const shoulderSpread = selling ? 30 : 35;

    g.lineStyle(2.1, p.ink, 1);
    g.fillStyle(p.skin, 1);
    g.beginPath();
    g.moveTo(-shoulderSpread, shoulderY);
    g.quadraticCurveTo(-27, topY - 10, -8, topY - 12);
    g.quadraticCurveTo(14, topY - 13, shoulderSpread, shoulderY);
    g.quadraticCurveTo(39, -1 + crouch, 26, 17 + crouch);
    g.quadraticCurveTo(17, hipY, 0, hipY + 4);
    g.quadraticCurveTo(-17, hipY, -26, 17 + crouch);
    g.quadraticCurveTo(-39, -1 + crouch, -shoulderSpread, shoulderY);
    g.closePath();
    g.fillPath();
    g.strokePath();

    g.fillStyle(p.gear, 1);
    g.lineStyle(1.7, p.ink, 1);
    g.beginPath();
    g.moveTo(-24, waistY);
    g.quadraticCurveTo(-11, 31 + crouch, 0, 33 + crouch);
    g.quadraticCurveTo(11, 31 + crouch, 24, waistY);
    g.quadraticCurveTo(18, 42 + crouch, 0, 45 + crouch);
    g.quadraticCurveTo(-18, 42 + crouch, -24, waistY);
    g.closePath();
    g.fillPath();
    g.strokePath();

    g.lineStyle(1.35, p.softInk, 0.75);
    g.beginPath();
    g.moveTo(0, topY - 4);
    g.quadraticCurveTo(-2, -7 + crouch, 0, 17 + crouch);
    g.moveTo(-21, -13 + crouch);
    g.quadraticCurveTo(-11, -7 + crouch, -7, 3 + crouch);
    g.moveTo(21, -13 + crouch);
    g.quadraticCurveTo(11, -7 + crouch, 7, 3 + crouch);
    g.moveTo(-19, 19 + crouch);
    g.quadraticCurveTo(0, 26 + crouch, 19, 19 + crouch);
    g.strokePath();

    g.lineStyle(1.1, p.gearLine, 0.85);
    g.beginPath();
    g.moveTo(-20, 35 + crouch);
    g.quadraticCurveTo(0, 40 + crouch, 20, 35 + crouch);
    g.strokePath();
  }

  drawArm(g, pose, p) {
    const [sx, sy] = pose.shoulder;
    const [ex, ey] = pose.elbow;
    const [wx, wy] = pose.wrist;
    const [hx, hy] = pose.hand;

    this.drawCurvedLimb(g, sx, sy, ex, ey, wx, wy, 5.0, p.ink, p.skin);
    this.drawPad(g, wx, wy, 9, 7, p.ink, p.tape, p.ink);
    this.drawHand(g, hx, hy, p.ink, p.skin, pose.open);
  }

  drawHead(g, p, crouch) {
    const y = -52 + crouch;

    this.ellipse(g, 0, y, 25, 31, p.ink, p.skin, 1.9);

    g.fillStyle(p.hair, 1);
    g.lineStyle(1.7, p.ink, 1);
    g.beginPath();
    g.moveTo(-14, y - 7);
    g.quadraticCurveTo(-12, y - 25, 2, y - 30);
    g.quadraticCurveTo(18, y - 29, 16, y - 8);
    g.quadraticCurveTo(9, y - 13, 0, y - 12);
    g.quadraticCurveTo(-8, y - 12, -14, y - 7);
    g.closePath();
    g.fillPath();
    g.strokePath();

    g.lineStyle(1.1, p.softInk, 0.55);
    g.beginPath();
    g.moveTo(-6, y + 14);
    g.quadraticCurveTo(0, y + 19, 6, y + 14);
    g.strokePath();
  }

  drawDownedFigure(g, p) {
    this.drawMatShadow(g, 0, 5, 86, 42);

    g.lineStyle(2, p.ink, 1);
    g.fillStyle(p.skin, 1);
    g.beginPath();
    g.moveTo(-39, -11);
    g.quadraticCurveTo(-16, -34, 18, -26);
    g.quadraticCurveTo(43, -17, 38, 8);
    g.quadraticCurveTo(17, 27, -18, 20);
    g.quadraticCurveTo(-42, 13, -39, -11);
    g.closePath();
    g.fillPath();
    g.strokePath();

    this.ellipse(g, 49, -14, 25, 23, p.ink, p.skin, 1.8);
    g.fillStyle(p.hair, 1);
    g.lineStyle(1.4, p.ink, 1);
    g.beginPath();
    g.moveTo(42, -20);
    g.quadraticCurveTo(50, -34, 64, -25);
    g.quadraticCurveTo(67, -16, 58, -10);
    g.quadraticCurveTo(51, -15, 42, -20);
    g.closePath();
    g.fillPath();
    g.strokePath();

    this.drawCurvedLimb(g, -12, 15, -27, 36, -49, 46, 4.5, p.ink, p.skin);
    this.drawCurvedLimb(g, 8, 17, 18, 40, 42, 45, 4.5, p.ink, p.skin);
    this.drawFoot(g, -52, 48, 10, 17, p.ink, p.boot);
    this.drawFoot(g, 45, 47, 10, 17, p.ink, p.boot);
    this.drawCurvedLimb(g, -21, -14, -44, -20, -57, -2, 4.2, p.ink, p.skin);
    this.drawCurvedLimb(g, 18, -20, 34, -39, 53, -34, 4.2, p.ink, p.skin);
    this.drawHand(g, -60, 0, p.ink, p.skin, true);
    this.drawHand(g, 56, -35, p.ink, p.skin, true);

    g.lineStyle(1.2, p.softInk, 0.65);
    g.beginPath();
    g.moveTo(-24, -12);
    g.quadraticCurveTo(-1, -4, 24, -13);
    g.moveTo(-18, 7);
    g.quadraticCurveTo(5, 15, 29, 5);
    g.strokePath();
  }

  drawCurvedLimb(g, sx, sy, ex, ey, wx, wy, width, ink, fill) {
    g.lineStyle(width + 2.1, ink, 1);
    g.beginPath();
    g.moveTo(sx, sy);
    g.quadraticCurveTo(ex, ey, wx, wy);
    g.strokePath();

    g.lineStyle(width, fill, 1);
    g.beginPath();
    g.moveTo(sx, sy);
    g.quadraticCurveTo(ex, ey, wx, wy);
    g.strokePath();

    g.lineStyle(1.05, ink, 0.9);
    g.beginPath();
    g.moveTo(sx, sy);
    g.quadraticCurveTo(ex, ey, wx, wy);
    g.strokePath();
  }

  drawHand(g, x, y, ink, fill, open) {
    g.fillStyle(fill, 1);
    g.lineStyle(1.4, ink, 1);
    if (open) {
      g.beginPath();
      g.moveTo(x - 6, y - 4);
      g.quadraticCurveTo(x - 2, y - 10, x + 5, y - 7);
      g.quadraticCurveTo(x + 9, y - 1, x + 5, y + 6);
      g.quadraticCurveTo(x - 2, y + 10, x - 7, y + 4);
      g.quadraticCurveTo(x - 9, y, x - 6, y - 4);
      g.closePath();
      g.fillPath();
      g.strokePath();
      return;
    }

    g.fillEllipse(x, y, 10, 9);
    g.strokeEllipse(x, y, 10, 9);
  }

  drawFoot(g, x, y, w, h, ink, fill) {
    this.ellipse(g, x, y, w, h, ink, fill, 1.4);
    g.lineStyle(1, ink, 0.55);
    g.lineBetween(x - w * 0.3, y + h * 0.25, x + w * 0.3, y + h * 0.25);
  }

  drawPad(g, x, y, w, h, ink, fill, line) {
    this.ellipse(g, x, y, w, h, ink, fill, 1.25);
    g.lineStyle(0.9, line, 0.7);
    g.lineBetween(x - w * 0.3, y, x + w * 0.3, y);
  }

  drawMatShadow(g, x, y, w, h) {
    g.fillStyle(0x000000, 0.12);
    g.fillEllipse(x, y, w, h);
  }

  ellipse(g, x, y, w, h, ink, fill, lineWidth = 1.5) {
    g.fillStyle(fill, 1);
    g.lineStyle(lineWidth, ink, 1);
    g.fillEllipse(x, y, w, h);
    g.strokeEllipse(x, y, w, h);
  }
}
