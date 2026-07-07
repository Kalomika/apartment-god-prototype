export class ChoicePanel {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.buttons = [];
    this.mode = 'match';
    this.logText = scene.add.text(0, 0, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#f5f5f5',
      wordWrap: { width: 320 }
    });
    this.speakerText = scene.add.text(0, 0, '', {
      fontFamily: 'Arial',
      fontSize: '13px',
      color: '#cfcfcf'
    });
  }

  setMode(mode) {
    this.mode = mode;
    if (this.titleText) {
      this.titleText.setText(mode === 'match' ? 'MOVE SUGGESTIONS' : 'GM OFFICE');
    }
  }

  setChoices(choices, onChoice) {
    for (const button of this.buttons) {
      button.container.destroy(true);
    }

    this.buttons = choices.map((choice) => {
      const container = this.scene.add.container(0, 0);
      const bg = this.scene.add.graphics();
      const text = this.scene.add.text(0, 0, choice.label, {
        fontFamily: 'Arial',
        fontSize: '14px',
        color: '#111111',
        align: 'center',
        wordWrap: { width: 120 }
      }).setOrigin(0.5);

      container.add([bg, text]);
      container.setSize(130, 46);
      container.setInteractive({ useHandCursor: true });
      container.on('pointerdown', () => onChoice(choice));

      return { choice, container, bg, text };
    });
  }

  setDialogue(speaker, message) {
    this.speakerText.setText(speaker ? `${speaker}:` : '');
    this.logText.setText(message);
  }

  setLog(message) {
    this.setDialogue('MATCH LOG', message);
  }

  layout(layout) {
    const { width, height, arenaHeight } = layout;
    const g = this.graphics;
    const panelY = arenaHeight;
    const panelH = height - arenaHeight;
    const pad = Math.max(12, width * 0.035);

    g.clear();
    g.fillStyle(0x141414, 1);
    g.fillRect(0, panelY, width, panelH);
    g.lineStyle(2, 0xffffff, 0.18);
    g.lineBetween(0, panelY, width, panelY);

    const titleY = panelY + pad * 0.6;
    if (!this.titleText) {
      this.titleText = this.scene.add.text(0, 0, this.mode === 'match' ? 'MOVE SUGGESTIONS' : 'GM OFFICE', {
        fontFamily: 'Arial',
        fontSize: '13px',
        color: '#ffffff',
        letterSpacing: 1
      }).setOrigin(0, 0.5);
    }
    this.titleText.setPosition(pad, titleY);

    this.speakerText.setPosition(pad, titleY + Math.max(16, pad * 0.8));
    this.speakerText.setFontSize(width < 430 ? 11 : 13);

    const buttonTop = panelY + pad * 2.05;
    const buttonW = Math.min(152, Math.max(102, (width - pad * 2 - 10) / 2));
    const buttonH = Math.min(46, Math.max(38, panelH * 0.145));
    const cols = width < 620 ? 2 : 4;
    const gap = Math.max(7, width * 0.012);

    this.buttons.forEach((button, index) => {
      const col = index % cols;
      const row = Math.floor(index / cols);
      const x = pad + col * (buttonW + gap);
      const y = buttonTop + row * (buttonH + gap);

      button.container.setPosition(x + buttonW * 0.5, y + buttonH * 0.5);
      button.container.setSize(buttonW, buttonH);
      button.bg.clear();
      button.bg.fillStyle(0xffffff, 1);
      button.bg.fillRoundedRect(-buttonW * 0.5, -buttonH * 0.5, buttonW, buttonH, 10);
      button.bg.lineStyle(2, 0x000000, 1);
      button.bg.strokeRoundedRect(-buttonW * 0.5, -buttonH * 0.5, buttonW, buttonH, 10);
      button.text.setFontSize(width < 430 ? 11 : 13);
      button.text.setWordWrapWidth(buttonW - 16);
    });

    const rows = Math.ceil(this.buttons.length / cols);
    const logY = buttonTop + rows * (buttonH + gap) + gap * 0.85;
    this.logText.setPosition(pad, logY);
    this.logText.setFontSize(width < 430 ? 12 : 14);
    this.logText.setWordWrapWidth(width - pad * 2);
  }
}
