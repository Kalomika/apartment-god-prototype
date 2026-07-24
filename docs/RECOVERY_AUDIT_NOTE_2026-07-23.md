# Recovery Audit Note

Main currently boots the Phaser parity runtime and includes Phaser as a direct dependency. A protected backup branch was created before any recovery work proceeds.

Verified on 2026-07-23:

- `package.json` on `main` includes `phaser` as a dependency.
- `src/main.js` on `main` imports and boots `phaserParityRuntime.js`.
- Recovery work must not assume that `main` is the pre-Phaser visual baseline.
- No recovery changes should be applied directly to `main` until the correct pre-Phaser visual commit or branch has been identified and audited.
