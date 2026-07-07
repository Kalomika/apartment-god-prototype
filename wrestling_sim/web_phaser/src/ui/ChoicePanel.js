export class ChoicePanel {
  constructor(scene) {
    this.scene = scene;
    this.graphics = scene.add.graphics();
    this.buttons = [];
    this.logText = scene.add.text(0, 0, '', {
      fontFamily: 'Arial',
      fontSize: '14px',
      color: '#f5f5f5',
      wordWrap: { width: 320 }
    });
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

  setLog(message) {
    this.logText.setText(message);
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
      this.titleText = this.scene.add.text(0, 0, 'MANAGER CHOICE', {
        fontFamily: 'Arial',
        fontSize: '13px',
        color: '#ffffff',
        letterSpacing: 1
      }).setOrigin(0, 0.5);
    }
    this.titleText.setPosition(pad, titleY);

    const buttonTop = panelY + pad * 1.4;
    const buttonW = Math.min(156, Math.max(104, (width - pad * 2 - 10) / 2));
    const buttonH = Math.min(48, Math.max(40, panelH * 0.17));
    const cols = width < 620 ? 2 : 3;
    const gap = Math.max(8, width * 0.015);

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
      button.text.setFontSize(width < 430 ? 12 : 14);
      button.text.setWordWrapWidth(buttonW - 16);
    });

    const logY = buttonTop + Math.ceil(this.buttons.length / cols) * (buttonH + gap) + gap * 0.75;
    this.logText.setPosition(pad, logY);
    this.logText.setFontSize(width < 430 ? 12 : 14);
    this.logText.setWordWrapWidth(width - pad * 2);
  }
}
