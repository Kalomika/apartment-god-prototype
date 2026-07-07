import Phaser from 'phaser';
import { RingRenderer } from '../render/RingRenderer.js';
import { WrestlerProxy } from '../render/WrestlerProxy.js';
import { ChoicePanel } from '../ui/ChoicePanel.js';
import { initialMatch, roster } from '../data/roster.js';
import { MatchEngine } from '../sim/matchEngine.js';

const wrestlerTextureKey = (id) => `wrestler-${id}`;

export class ArenaScene extends Phaser.Scene {
  constructor() {
    super('ArenaScene');
    this.layout = null;
    this.snapshot = null;
  }

  preload() {
    this.load.svg(wrestlerTextureKey('rex-sterling'), 'assets/wrestlers/rex_sterling_neutral.svg', { width: 256, height: 256 });
    this.load.svg(wrestlerTextureKey('dante-crowe'), 'assets/wrestlers/dante_crowe_neutral.svg', { width: 256, height: 256 });
  }

  create() {
    const red = roster.find((wrestler) => wrestler.id === initialMatch.redCornerId);
    const blue = roster.find((wrestler) => wrestler.id === initialMatch.blueCornerId);

    this.engine = new MatchEngine({ red, blue, ruleSet: initialMatch.ruleSet });
    this.ring = new RingRenderer(this);
    this.choicePanel = new ChoicePanel(this);
    this.wrestlerA = new WrestlerProxy(this, red, wrestlerTextureKey(red.id));
    this.wrestlerB = new WrestlerProxy(this, blue, wrestlerTextureKey(blue.id));
    this.referee = this.createReferee();
    this.hudText = this.add.text(0, 0, '', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '16px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 0);

    this.choicePanel.setMode('match');
    this.choicePanel.setChoices(this.engine.getChoiceList(), (choice) => {
      this.engine.queueSuggestion(choice.id);
      this.choicePanel.setDialogue('GM', `Suggest ${choice.label}.`);
    });

    this.scale.on('resize', this.handleResize, this);
    this.handleResize({ width: this.scale.width, height: this.scale.height });
    this.choicePanel.setDialogue('GM OFFICE', `${red.name} versus ${blue.name} is booked.`);
  }

  createReferee() {
    const container = this.add.container(0, 0);
    const g = this.add.graphics();
    const label = this.add.text(0, 22, 'REF', {
      fontFamily: 'Arial Black, Arial, sans-serif',
      fontSize: '11px',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5, 0);

    g.fillStyle(0xffffff, 1);
    g.lineStyle(2.2, 0x111111, 1);
    g.fillEllipse(0, 0, 22, 30);
    g.strokeEllipse(0, 0, 22, 30);
    g.fillStyle(0x111111, 1);
    g.fillRect(-8, -9, 4, 18);
    g.fillRect(2, -9, 4, 18);
    g.fillEllipse(0, -21, 14, 16);
    container.add([g, label]);
    return container;
  }

  handleResize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    const arenaHeight = Math.floor(height * 0.50);
    this.layout = { width, height, arenaHeight };
    this.ring.draw(this.layout);
    this.choicePanel.layout(this.layout);
    this.positionFromSnapshot();
  }

  update(time, delta) {
    if (!this.layout || !this.ring.bounds || !this.engine) return;
    this.snapshot = this.engine.update(delta);
    this.positionFromSnapshot();
    this.choicePanel.setLog(this.snapshot.log);
  }

  positionFromSnapshot() {
    if (!this.snapshot || !this.ring.bounds) {
      const first = this.engine?.getSnapshot();
      if (!first) return;
      this.snapshot = first;
    }

    const redScreen = this.ring.ringToScreen(this.snapshot.red.position.x, this.snapshot.red.position.y);
    const blueScreen = this.ring.ringToScreen(this.snapshot.blue.position.x, this.snapshot.blue.position.y);
    const refScreen = this.ring.ringToScreen(this.snapshot.referee.position.x, this.snapshot.referee.position.y);
    const sizeScale = Phaser.Math.Clamp(this.ring.bounds.size / 420, 0.72, 1.15);

    this.wrestlerA.setSpriteScale(sizeScale);
    this.wrestlerB.setSpriteScale(sizeScale);
    this.wrestlerA.setPosition(Math.round(redScreen.x), Math.round(redScreen.y));
    this.wrestlerB.setPosition(Math.round(blueScreen.x), Math.round(blueScreen.y));
    this.wrestlerA.setFacingRadians(this.snapshot.red.facing);
    this.wrestlerB.setFacingRadians(this.snapshot.blue.facing);
    this.wrestlerA.setState(this.snapshot.red.state);
    this.wrestlerB.setState(this.snapshot.blue.state);
    this.referee.setPosition(Math.round(refScreen.x), Math.round(refScreen.y));
    this.referee.setScale(sizeScale * 0.72);
    this.hudText.setPosition(Math.round(this.layout.width * 0.5), 8);
    this.hudText.setFontSize(this.layout.width < 430 ? 13 : 16);
    this.hudText.setText(`${this.snapshot.red.profile.shortName} STA ${Math.round(this.snapshot.red.stamina)} DMG ${Math.round(this.snapshot.red.damage)}   ${this.snapshot.blue.profile.shortName} STA ${Math.round(this.snapshot.blue.stamina)} DMG ${Math.round(this.snapshot.blue.damage)}`);
  }
}
