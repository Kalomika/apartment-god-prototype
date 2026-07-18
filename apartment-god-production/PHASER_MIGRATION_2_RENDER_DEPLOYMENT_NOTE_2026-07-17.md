# Phaser Migration 2 Separate Render Deployment

A separate Render static site or web service may target the `phaser-migration-2` branch directly. This avoids moving `main` for each migration test.

Recommended branch: phaser-migration-2
Build command: npm run build
Publish directory: dist

Keep automatic deploy enabled for the branch so every committed P2 update becomes independently testable. Main remains available as the stable comparison and fallback build.

Status: configuration guidance only. The branch still requires successful integration, checks, build, and browser acceptance before it is considered stable.