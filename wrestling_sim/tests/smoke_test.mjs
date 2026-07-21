import assert from 'node:assert/strict';
import { runDemoMatch } from '../src/sim_runner.mjs';

const report = runDemoMatch();

assert.ok(report.winner, 'report should include a winner');
assert.ok(report.loser, 'report should include a loser');
assert.ok(report.finishType, 'report should include a finish type');
assert.ok(Array.isArray(report.finalConditions), 'report should include final conditions');
assert.equal(report.finalConditions.length, 2, 'report should include both wrestlers');
assert.ok(Array.isArray(report.recentEvents), 'report should include recent events');

console.log('wrestling sim smoke test passed');
console.log(JSON.stringify(report, null, 2));
