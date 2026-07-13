import assert from 'node:assert/strict';
import { steppedAnimationTime, TOP_SHOT_VISUAL_STYLE } from '../src/three/visualStyle3D.js';

assert.equal(TOP_SHOT_VISUAL_STYLE.outlines, false);
assert.equal(TOP_SHOT_VISUAL_STYLE.animationFps, 8);
assert.equal(TOP_SHOT_VISUAL_STYLE.effectsMode, '2d-billboards');
assert.equal(steppedAnimationTime(0.124), 0);
assert.equal(steppedAnimationTime(0.125), 0.125);
assert.equal(steppedAnimationTime(0.249), 0.125);
console.log('Top Shot visual style smoke passed');
