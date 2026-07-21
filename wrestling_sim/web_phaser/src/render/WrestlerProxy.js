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

  getPalette() {
    const gear = this.profile.gearColor ?? 0xf0f0f0;
    const darkGear = gear < 0x555555;

    return {
      ink: this.profile.outlineColor ?? 0x050505,
      softInk: darkGear ? 0xe8e8e8 : 0x555555,
      skin: this.profile.id === 'dante-crowe' ? 0xe7c3a2 : 0xf2dcc4,
      gear,
      gearLine: darkGear ? 0xf7f7f7 : 0x171717,
      hair: this.profile.hairColor ?? 0x141414,
      boot: darkGear ? 0x111111 : 0xf2f2f2,
      tape: 0xffffff
    };
  }

  draw() {
    const g = this.graphics;
    const p = this.getPalette();
    const state = this.state;
    const down = state === 'downed' || state === 'pinned';

    g.clear();
    g.setVisible(true);

    if (down) {
      this.drawDowned(g, p);
      this.nameText.setY(48);
      return;
    }

    this.drawStanding(g, p);
    this.nameText.setY(72);
  }

  drawStanding(g, p) {
    const locking = this.state === 'lockup' || this.state === 'grappleAdvantage';
    const striking = this.state === 'striking';
    const running = this.state === 'ropeRun' || this.state === 'closingDistance';
    const selling = this.state === 'selling' || this.state === 'recovering';

    const step = running ? 11 : selling ? 5 : 0;
    const crouch = locking ? 4 : selling ? 2 : 0;
    const armLift = locking ? -46 : 0;
    const rightStrike = striking ? -28 : 0;

    this.shadow(g, 0, 8, 66, 94);

    // Rear lower body. Feet and boots are clearer than full legs from this angle.
    this.limb(g, -13, 24 + crouch, -20, 54 + step, 6, p.ink, p.skin);
    this.limb(g, 13, 24 + crouch, 20, 48 - step * 0.45, 6, p.ink, p.skin);
    this.ellipse(g, -20, 76 + step * 0.25, 11, 19, p.ink, p.boot, 1.4);
    this.ellipse(g, 20, 70 - step * 0.35, 11, 19, p.ink, p.boot, 1.4);
    this.ellipse(g, -20, 54 + step, 15, 8, p.ink, p.gear, 1.2);
    this.ellipse(g, 20, 48 - step * 0.45, 15, 8, p.ink, p.gear, 1.2);

    // Top down torso mass, shoulders first, hips compact, no front facing face or chest doll read.
    this.ellipse(g, 0, -9 + crouch, 68, 52, p.ink, p.skin, 2.2);
    this.ellipse(g, -27, -13 + crouch, 18, 24, p.ink, p.skin, 1.7);
    this.ellipse(g, 27, -13 + crouch, 18, 24, p.ink, p.skin, 1.7);
    this.ellipse(g, 0, 24 + crouch, 42, 25, p.ink, p.gear, 1.8);

    g.lineStyle(1.3, p.softInk, 0.72);
    g.lineBetween(0, -31 + crouch, 0, 15 + crouch);
    g.lineBetween(-23, -17 + crouch, -7, -4 + crouch);
    g.lineBetween(23, -17 + crouch, 7, -4 + crouch);
    g.lineBetween(-19, 14 + crouch, 19, 14 + crouch);
    g.lineStyle(1, p.gearLine, 0.85);
    g.lineBetween(-18, 31 + crouch, 18, 31 + crouch);

    // Arms. Lockup reaches forward toward opponent, otherwise hangs naturally from shoulders.
    this.limb(g, -33, -10 + crouch, -45, 14 + armLift, 6, p.ink, p.skin);
    this.limb(g, -45, 14 + armLift, -38, 38 + armLift, 5.3, p.ink, p.skin);
    this.ellipse(g, -38, 38 + armLift, 9, 7, p.ink, p.tape, 1.2);
    this.hand(g, -38, 47 + armLift, p, locking);

    this.limb(g, 33, -10 + crouch, 45 + rightStrike * 0.28, 14 + armLift, 6, p.ink, p.skin);
    this.limb(g, 45 + rightStrike * 0.28, 14 + armLift, 38 + rightStrike, 38 + armLift, 5.3, p.ink, p.skin);
    this.ellipse(g, 38 + rightStrike, 38 + armLift, 9, 7, p.ink, p.tape, 1.2);
    this.hand(g, 38 + rightStrike, 47 + armLift, p, locking);

    // Head reads as top plane and hair crown. No face features.
    this.ellipse(g, 0, -49 + crouch, 27, 32, p.ink, p.skin, 2);
    this.hair(g, p, 0, -62 + crouch);

    if (locking) {
      g.lineStyle(2, p.ink, 0.55);
      g.strokeCircle(0, -24, 43);
      g.lineStyle(1.2, p.softInk, 0.65);
      g.lineBetween(-29, -54, -8, -34);
      g.lineBetween(29, -54, 8, -34);
    }
  }

  drawDowned(g, p) {
    this.shadow(g, 0, 5, 88, 42);

    this.ellipse(g, 0, 0, 76, 40, p.ink, p.skin, 2);
    this.ellipse(g, 48, -13, 25, 23, p.ink, p.skin, 1.8);
    this.hair(g, p, 51, -23, 0.8);
    this.ellipse(g, 0, 13, 38, 18, p.ink, p.gear, 1.5);

    this.limb(g, -14, 15, -50, 44, 5.2, p.ink, p.skin);
    this.limb(g, 12, 15, 44, 44, 5.2, p.ink, p.skin);
    this.ellipse(g, -53, 48, 10, 17, p.ink, p.boot, 1.3);
    this.ellipse(g, 47, 47, 10, 17, p.ink, p.boot, 1.3);

    this.limb(g, -24, -12, -57, -3, 5, p.ink, p.skin);
    this.limb(g, 20, -16, 55, -33, 5, p.ink, p.skin);
    this.hand(g, -61, -2, p, true);
    this.hand(g, 59, -35, p, true);

    g.lineStyle(1.2, p.softInk, 0.65);
    g.lineBetween(-25, -12, 22, -12);
    g.lineBetween(-19, 7, 28, 5);
  }

  hair(g, p, x, y, scale = 1) {
    g.fillStyle(p.hair, 1);
    g.lineStyle(1.4, p.ink, 1);
    g.fillEllipse(x, y, 29 * scale, 13 * scale);
    g.strokeEllipse(x, y, 29 * scale, 13 * scale);
    g.fillEllipse(x - 8 * scale, y + 5 * scale, 10 * scale, 8 * scale);
    g.fillEllipse(x + 8 * scale, y + 5 * scale, 10 * scale, 8 * scale);
  }

  limb(g, x1, y1, x2, y2, width, ink, fill) {
    g.lineStyle(width + 2.4, ink, 1);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(width, fill, 1);
    g.lineBetween(x1, y1, x2, y2);
  }

  hand(g, x, y, p, open) {
    const w = open ? 12 : 10;
    const h = open ? 10 : 9;
    this.ellipse(g, x, y, w, h, p.ink, p.skin, 1.25);
    if (open) {
      g.lineStyle(0.9, p.ink, 0.7);
      g.lineBetween(x - 4, y - 2, x + 4, y - 2);
      g.lineBetween(x - 4, y + 2, x + 4, y + 2);
    }
  }

  shadow(g, x, y, w, h) {
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
