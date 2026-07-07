export class WrestlerProxy {
  constructor(scene, profile) {
    this.scene = scene;
    this.profile = profile;
    this.container = scene.add.container(0, 0);
    this.graphics = scene.add.graphics();
    this.nameText = scene.add.text(0, 0, profile.shortName, {
      fontFamily: 'Arial',
      fontSize: '10px',
      color: '#2f2f2f'
    }).setOrigin(0.5, 0);

    this.container.add([this.graphics, this.nameText]);
    this.state = 'idle';
    this.scale = 1;
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
    g.clear();

    const ink = 0x3d3d3d;
    const softInk = 0x7a7a7a;
    const skin = 0xffffff;
    const gear = this.profile.gearColor ?? 0xf1f1f1;
    const hair = this.profile.hairColor ?? 0x111111;

    const isLocking = this.state === 'lockup' || this.state === 'grappleAdvantage';
    const isStriking = this.state === 'striking';
    const isRunning = this.state === 'ropeRun' || this.state === 'closingDistance';
    const isDown = this.state === 'downed' || this.state === 'pinned';
    const isSelling = this.state === 'selling' || this.state === 'recovering';

    if (isDown) {
      this.drawDownedFigure(g, ink, softInk, skin, gear, hair);
      this.nameText.setY(45);
      return;
    }

    const armReach = isLocking ? -24 : 0;
    const strikeReach = isStriking ? -34 : 0;
    const step = isRunning ? 11 : isSelling ? 5 : 0;
    const shoulderTilt = isSelling ? 5 : 0;

    // Thin architectural sketch silhouette, not chunky capsule art.
    // Legs first, staggered from direct overhead.
    this.drawLimb(g, [-13, 18], [-18, 43 + step], [-15, 62 + step * 0.2], 5.2, ink, skin);
    this.drawLimb(g, [13, 18], [20, 35 - step * 0.45], [22, 54 - step * 0.35], 5.2, ink, skin);

    // Boots as small directional ovals.
    this.drawShoe(g, -16, 64 + step * 0.2, -0.25, ink, gear);
    this.drawShoe(g, 23, 56 - step * 0.35, 0.25, ink, gear);

    // Knee pads.
    this.strokeEllipse(g, -18, 42 + step, 14, 9, ink, gear, 1.4);
    this.strokeEllipse(g, 20, 35 - step * 0.45, 14, 9, ink, gear, 1.4);

    // Torso, shoulder line, trunks.
    g.lineStyle(1.7, ink, 1);
    g.fillStyle(skin, 1);
    g.beginPath();
    g.moveTo(-33, -18 + shoulderTilt);
    g.quadraticCurveTo(-22, -34, -5, -35);
    g.quadraticCurveTo(17, -36, 34, -18 - shoulderTilt);
    g.quadraticCurveTo(35, 0, 24, 15);
    g.quadraticCurveTo(12, 27, 0, 27);
    g.quadraticCurveTo(-14, 27, -25, 15);
    g.quadraticCurveTo(-36, 0, -33, -18 + shoulderTilt);
    g.closePath();
    g.fillPath();
    g.strokePath();

    // Trunks and waist.
    g.fillStyle(gear, 1);
    g.beginPath();
    g.moveTo(-23, 12);
    g.quadraticCurveTo(-11, 25, 0, 27);
    g.quadraticCurveTo(12, 25, 23, 12);
    g.quadraticCurveTo(14, 35, 0, 35);
    g.quadraticCurveTo(-14, 35, -23, 12);
    g.closePath();
    g.fillPath();
    g.strokePath();

    // Simple internal anatomy and gear lines like the references.
    g.lineStyle(1, softInk, 0.55);
    g.beginPath();
    g.moveTo(0, -28);
    g.lineTo(0, 4);
    g.moveTo(-18, -14);
    g.quadraticCurveTo(-8, -7, -2, -6);
    g.moveTo(18, -14);
    g.quadraticCurveTo(8, -7, 2, -6);
    g.moveTo(-20, 15);
    g.quadraticCurveTo(0, 21, 20, 15);
    g.strokePath();

    // Arms with proper overhead shoulder, elbow, wrist construction.
    this.drawLimb(g, [-31, -15 + shoulderTilt], [-44, 4 + armReach], [-38, 27 + armReach], 4.8, ink, skin);
    this.drawLimb(g, [31, -15 - shoulderTilt], [45, 4 + armReach + strikeReach * 0.45], [39, 27 + armReach + strikeReach], 4.8, ink, skin);

    // Wrist tape and hands.
    this.strokeEllipse(g, -38, 27 + armReach, 9, 7, ink, gear, 1.2);
    this.strokeEllipse(g, 39, 27 + armReach + strikeReach, 9, 7, ink, gear, 1.2);
    this.drawHand(g, -38, 38 + armReach, ink, skin, -0.2);
    this.drawHand(g, 39, 38 + armReach + strikeReach, ink, skin, 0.2);

    // Head and hair, faceless top of head.
    this.strokeEllipse(g, 0, -49, 23, 30, ink, skin, 1.7);
    if (this.profile.hair === 'bald') {
      g.lineStyle(1, softInk, 0.45);
      g.beginPath();
      g.moveTo(-7, -58);
      g.quadraticCurveTo(0, -63, 7, -58);
      g.strokePath();
    } else {
      g.fillStyle(hair, 1);
      g.lineStyle(1.2, ink, 1);
      g.beginPath();
      g.moveTo(-13, -60);
      g.quadraticCurveTo(-7, -72, 4, -68);
      g.quadraticCurveTo(17, -64, 12, -53);
      g.quadraticCurveTo(4, -57, -3, -55);
      g.quadraticCurveTo(-9, -53, -13, -60);
      g.closePath();
      g.fillPath();
      g.strokePath();
    }

    // Lockup hint, arms actually raised forward instead of wobbling in place.
    if (isLocking) {
      g.lineStyle(1.2, softInk, 0.75);
      g.strokeCircle(0, -2, 36);
    }

    this.nameText.setY(70);
  }

  drawDownedFigure(g, ink, softInk, skin, gear, hair) {
    // Side lying top down silhouette for selling and pin states.
    g.lineStyle(1.7, ink, 1);
    g.fillStyle(skin, 1);

    g.beginPath();
    g.moveTo(-36, -11);
    g.quadraticCurveTo(-15, -35, 18, -24);
    g.quadraticCurveTo(40, -14, 36, 8);
    g.quadraticCurveTo(16, 25, -18, 18);
    g.quadraticCurveTo(-40, 11, -36, -11);
    g.closePath();
    g.fillPath();
    g.strokePath();

    this.strokeEllipse(g, 47, -12, 25, 22, ink, skin, 1.6);
    g.fillStyle(hair, 1);
    g.fillEllipse(55, -18, 15, 8);

    this.drawLimb(g, [-11, 15], [-26, 36], [-48, 46], 4.5, ink, skin);
    this.drawLimb(g, [8, 17], [18, 39], [41, 45], 4.5, ink, skin);
    this.drawShoe(g, -51, 47, -0.9, ink, gear);
    this.drawShoe(g, 44, 46, 0.7, ink, gear);
    this.drawLimb(g, [-20, -14], [-43, -21], [-55, -2], 4.2, ink, skin);
    this.drawLimb(g, [18, -20], [33, -38], [51, -34], 4.2, ink, skin);
    this.drawHand(g, -58, 1, ink, skin, -0.7);
    this.drawHand(g, 54, -34, ink, skin, 0.4);

    g.lineStyle(1, softInk, 0.45);
    g.beginPath();
    g.moveTo(-22, -15);
    g.quadraticCurveTo(0, -6, 24, -14);
    g.moveTo(-16, 6);
    g.quadraticCurveTo(5, 14, 28, 5);
    g.strokePath();
  }

  drawLimb(g, shoulder, elbow, wrist, width, ink, fill) {
    const [sx, sy] = shoulder;
    const [ex, ey] = elbow;
    const [wx, wy] = wrist;

    g.lineStyle(width + 2.0, ink, 1);
    g.beginPath();
    g.moveTo(sx, sy);
    g.quadraticCurveTo(ex, ey, wx, wy);
    g.strokePath();

    g.lineStyle(width, fill, 1);
    g.beginPath();
    g.moveTo(sx, sy);
    g.quadraticCurveTo(ex, ey, wx, wy);
    g.strokePath();

    g.lineStyle(1.1, ink, 1);
    g.beginPath();
    g.moveTo(sx, sy);
    g.quadraticCurveTo(ex, ey, wx, wy);
    g.strokePath();
  }

  drawHand(g, x, y, ink, fill, lean) {
    g.fillStyle(fill, 1);
    g.lineStyle(1.2, ink, 1);
    g.beginPath();
    g.moveTo(x - 4 + lean * 4, y - 4);
    g.quadraticCurveTo(x, y - 8, x + 5 + lean * 4, y - 4);
    g.quadraticCurveTo(x + 6, y + 3, x + 1, y + 7);
    g.quadraticCurveTo(x - 5, y + 4, x - 4 + lean * 4, y - 4);
    g.closePath();
    g.fillPath();
    g.strokePath();
  }

  drawShoe(g, x, y, lean, ink, fill) {
    g.save();
    g.translateCanvas(x, y);
    g.rotateCanvas(lean);
    this.strokeEllipse(g, 0, 0, 10, 18, ink, fill, 1.2);
    g.restore();
  }

  strokeEllipse(g, x, y, w, h, ink, fill, lineWidth = 1.5) {
    g.fillStyle(fill, 1);
    g.lineStyle(lineWidth, ink, 1);
    g.fillEllipse(x, y, w, h);
    g.strokeEllipse(x, y, w, h);
  }
}
