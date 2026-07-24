# CI Expectations, Full Phaser Audit

The Phaser Parity CI workflow must verify the exact repair head with:

- repository checks
- JavaScript syntax checks
- Vitest regression suite
- static build
- Phaser vendor output
- Phaser entry point

A passing earlier phaser-migration run does not certify this repair branch. Record the new workflow run ID and exact head after completion.
