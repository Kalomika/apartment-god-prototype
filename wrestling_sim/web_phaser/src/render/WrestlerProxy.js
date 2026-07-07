export class WrestlerProxy {
  constructor(scene, label, color = 0xffffff) {
    this.scene = scene;
    this.label = label;
    this.color = color;
    this.container = scene.add.container(0, 0);
    this.graphics = scene.add.graphics();
    this.nameText = scene.add.text(0, 0, label, {
      fontFamily: 'Arial',
      fontSize: '11px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 3
    }).setOrigin(0.5, 0);

    this.container.add([this.graphics, this.nameText]);
    this.state = 'idle';
    this.scale = 1;
    this.draw();
  }

  setState(state) {
    this.state = state;
    this.draw();
  }

  setPosition(x, y) {
    this.container.setPosition(x, y);
  }

  setFacingRadians(angle) {
    this.container.setRotation(angle);
  }

  setSpriteScale(scale) {
    this.scale = scale;
    this.container.setScale(scale);
  }

  draw() {
    const g = this.graphics;
    g.clear();

    const line = 0x000000;
    const fill = this.color;
    const accent = this.state === 'selling' ? 0xdcdcdc : 0xf2f2f2;

    // Strict top down low detail wrestler silhouette.
    g.fillStyle(fill, 1);
    g.lineStyle(3, line, 1);

    // Legs behind torso.
    this.drawCapsule(g, -15, 18, -24, 46, 7, accent, line);
    this.drawCapsule(g, 15, 18, 24, 46, 7, accent, line);

    // Boots.
    this.drawCapsule(g, -25, 43, -27, 60, 8, 0xd6d6d6, line);
    this.drawCapsule(g, 25, 43, 27, 60, 8, 0xd6d6d6, line);

    // Knee pads.
    g.fillStyle(0xe0e0e0, 1);
    g.fillEllipse(-20, 34, 18, 12);
    g.strokeEllipse(-20, 34, 18, 12);
    g.fillEllipse(20, 34, 18, 12);
    g.strokeEllipse(20, 34, 18, 12);

    // Torso and trunks.
    g.fillStyle(fill, 1);
    g.fillEllipse(0, -4, 62, 48);
    g.strokeEllipse(0, -4, 62, 48);
    g.fillStyle(0xe0e0e0, 1);
    g.fillEllipse(0, 20, 42, 25);
    g.strokeEllipse(0, 20, 42, 25);

    // Arms.
    const armRaise = this.state === 'lockup' ? -8 : 0;
    this.drawCapsule(g, -28, -5, -42, 18 + armRaise, 8, fill, line);
    this.drawCapsule(g, -42, 18 + armRaise, -35, 38 + armRaise, 7, fill, line);
    this.drawCapsule(g, 28, -5, 42, 18 + armRaise, 8, fill, line);
    this.drawCapsule(g, 42, 18 + armRaise, 35, 38 + armRaise, 7, fill, line);

    // Hands and wrist tape.
    g.fillStyle(fill, 1);
    g.fillEllipse(-34, 45 + armRaise, 13, 10);
    g.strokeEllipse(-34, 45 + armRaise, 13, 10);
    g.fillEllipse(34, 45 + armRaise, 13, 10);
    g.strokeEllipse(34, 45 + armRaise, 13, 10);
    g.fillStyle(0xe0e0e0, 1);
    g.fillCircle(-38, 34 + armRaise, 6);
    g.strokeCircle(-38, 34 + armRaise, 6);
    g.fillCircle(38, 34 + armRaise, 6);
    g.strokeCircle(38, 34 + armRaise, 6);

    // Head and hair.
    g.fillStyle(fill, 1);
    g.fillEllipse(0, -40, 27, 34);
    g.strokeEllipse(0, -40, 27, 34);
    g.fillStyle(0x111111, 1);
    g.fillEllipse(0, -55, 28, 10);

    // State marker.
    if (this.state === 'advantage') {
      g.lineStyle(2, 0x000000, 1);
      g.strokeCircle(0, -4, 38);
    }

    this.nameText.setY(64);
  }

  drawCapsule(g, x1, y1, x2, y2, radius, fill, line) {
    g.lineStyle(radius * 2 + 2, line, 1);
    g.lineBetween(x1, y1, x2, y2);
    g.lineStyle(radius * 2, fill, 1);
    g.lineBetween(x1, y1, x2, y2);
    g.fillStyle(fill, 1);
    g.fillCircle(x1, y1, radius);
    g.fillCircle(x2, y2, radius);
    g.lineStyle(2, line, 1);
    g.strokeCircle(x1, y1, radius);
    g.strokeCircle(x2, y2, radius);
  }
}
