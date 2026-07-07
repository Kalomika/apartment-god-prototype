import Phaser from 'phaser';
import { RingRenderer } from '../render/RingRenderer.js';
import { WrestlerProxy } from '../render/WrestlerProxy.js';
import { ChoicePanel } from '../ui/ChoicePanel.js';

const CHOICES = [
  { id: 'lockup', label: 'Lock Up' },
  { id: 'strike', label: 'Strike' },
  { id: 'work_leg', label: 'Work Leg' },
  { id: 'recover', label: 'Recover' },
  { id: 'taunt', label: 'Taunt' },
  { id: 'auto', label: 'Let Him Decide' }
];

export class ArenaScene extends Phaser.Scene {
  constructor() {
    super('ArenaScene');
    this.layout = null;
    this.pendingChoice = null;
    this.nextBeatAt = 0;
    this.beatIndex = 0;
  }

  create() {
    this.ring = new RingRenderer(this);
    this.choicePanel = new ChoicePanel(this);
    this.wrestlerA = new WrestlerProxy(this, 'ATLAS', 0xffffff);
    this.wrestlerB = new WrestlerProxy(this, 'SAINT', 0xf7f7f7);

    this.choicePanel.setChoices(CHOICES, (choice) => {
      this.pendingChoice = choice.id;
      this.choicePanel.setLog(`Coach call queued: ${choice.label}`);
    });

    this.scale.on('resize', this.handleResize, this);
    this.handleResize({ width: this.scale.width, height: this.scale.height });
    this.choicePanel.setLog('Tap a manager choice or let the wrestlers run the sim.');
  }

  handleResize(gameSize) {
    const width = gameSize.width;
    const height = gameSize.height;
    const arenaHeight = Math.max(height * 0.52, Math.min(height * 0.62, width * 0.9));

    this.layout = { width, height, arenaHeight };
    this.ring.draw(this.layout);
    this.choicePanel.layout(this.layout);
    this.positionWrestlers();
  }

  update(time, delta) {
    if (!this.layout || !this.ring.bounds) {
      return;
    }

    if (time >= this.nextBeatAt) {
      this.advanceSimBeat();
      this.nextBeatAt = time + 900;
    }

    this.animateWrestlers(time, delta);
  }

  positionWrestlers() {
    if (!this.ring.bounds) {
      return;
    }

    const a = this.ring.ringToScreen(-0.25, 0.05);
    const b = this.ring.ringToScreen(0.25, -0.05);
    const sizeScale = Phaser.Math.Clamp(this.ring.bounds.size / 650, 0.42, 0.78);

    this.wrestlerA.setSpriteScale(sizeScale);
    this.wrestlerB.setSpriteScale(sizeScale);
    this.wrestlerA.setPosition(a.x, a.y);
    this.wrestlerB.setPosition(b.x, b.y);
    this.wrestlerA.setFacingRadians(0.15);
    this.wrestlerB.setFacingRadians(Math.PI + 0.15);
  }

  animateWrestlers(time) {
    if (!this.ring.bounds) {
      return;
    }

    const pulse = Math.sin(time / 280) * 0.018;
    this.wrestlerA.container.setScale(this.wrestlerA.scale + pulse);
    this.wrestlerB.container.setScale(this.wrestlerB.scale - pulse * 0.7);
  }

  advanceSimBeat() {
    const scripted = [
      ['circling', 'idle', 'They circle from the center, looking for contact.'],
      ['lockup', 'lockup', 'They meet in a collar and elbow lockup.'],
      ['advantage', 'selling', 'Atlas wins the first exchange and moves Saint backward.'],
      ['idle', 'recovering', 'Saint resets while Atlas holds the center.'],
      ['striking', 'selling', 'Atlas throws a short strike to test the guard.'],
      ['recovering', 'idle', 'Both men reset, the sim is waiting for the next call.']
    ];

    let event = scripted[this.beatIndex % scripted.length];

    if (this.pendingChoice && this.pendingChoice !== 'auto') {
      event = this.resolveManagerChoice(this.pendingChoice);
      this.pendingChoice = null;
    }

    this.wrestlerA.setState(event[0]);
    this.wrestlerB.setState(event[1]);
    this.choicePanel.setLog(event[2]);
    this.beatIndex += 1;
  }

  resolveManagerChoice(choice) {
    switch (choice) {
      case 'lockup':
        return ['lockup', 'lockup', 'Coach calls for a lockup. Atlas steps in and ties up.'];
      case 'strike':
        return ['striking', 'selling', 'Coach calls strike. Atlas clips Saint and creates a small opening.'];
      case 'work_leg':
        return ['advantage', 'selling', 'Coach calls leg work. Atlas shifts lower and starts targeting the base.'];
      case 'recover':
        return ['recovering', 'idle', 'Coach calls recovery. Atlas creates space instead of forcing contact.'];
      case 'taunt':
        return ['taunting', 'idle', 'Coach calls for a taunt. Atlas plays to the crowd from center ring.'];
      default:
        return ['idle', 'idle', 'The wrestler ignores the call and lets instinct take over.'];
    }
  }
}
