# Apartment God Prototype

A standalone browser-based life-sim prototype. It is intentionally separate from `Kalomika/ai-rpg-engine` and contains no secrets, no API keys, no database files, and no dependency on the existing AI RPG project.

## Current playable features

- Top-down apartment sim mockup
- Two humans and one dog
- Tap/click a character to select them
- Tap/click furniture to open contextual actions
- Smart action choice, for example shower picks cleaning or bathing based on state
- Click-to-move
- Floor 1 / Floor 2 toggle
- Stairs transfer between floors
- Needs system: hunger, hygiene, energy, fun, bladder, social
- Simple time simulation
- Off-screen work action that pays money and advances time
- Girlfriend NPC routine behavior
- Dog wandering and owner-following behavior
- In-game notifications
- Keyboard support: arrows move selected character, 1/2 switch floors, space pauses

## Local run

```bash
npm install
npm start
```

Open `http://localhost:5173`.

You can also open `index.html` directly in a browser, but a local server is cleaner for module loading.

## Static build

```bash
npm run build
```

The build output goes to `dist/`.

## Render setup

Use the included `render.yaml` as a Blueprint, or create a Static Site manually with:

- Build command: `npm install && npm run build`
- Publish directory: `dist`

## First expansion targets

1. Replace shape art with a consistent generated or hand-cleaned sprite style.
2. Add save/load using `localStorage`.
3. Add object cleanliness state so cleaning matters mechanically.
4. Add dialogue bubbles between the resident and girlfriend.
5. Add a work/job system with events and income variation.
6. Add a tiny exterior area outside the apartment.
7. Add phone-style notifications for completed actions.

## Project boundaries

This is the safe version of the larger idea. It does not attempt multiplayer, real money, creator markets, police/crime systems, or a full city simulation. Those are future platform-scale features and should not be added until the apartment loop is fun.
