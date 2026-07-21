import fs from 'node:fs';

const file = 'src/main.js';
let source = fs.readFileSync(file, 'utf8');
source = source.replace(/(\.\/phaserMigration2Runtime\.js\?v=)[^'"\s)]+/, '$1' + '20260721-p2-modern-procedural-reconstruction');
source = source.replace(/(\.\/phaserMigration2GameplayParityBridge\.js\?v=)[^'"\s)]+/, '$1' + '20260721-p2-modern-procedural-reconstruction');
source = source.replace(/(\.\/phaserMigration2BackdropSafety\.js\?v=)[^'"\s)]+/, '$1' + '20260721-p2-modern-procedural-reconstruction');
if (!source.includes('20260721-p2-modern-procedural-reconstruction')) throw new Error('P2 modern procedural cache patch did not apply.');
fs.writeFileSync(file, source);
