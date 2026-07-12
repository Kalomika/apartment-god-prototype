# Apartment God PNG Upload Fallback

Last update: 2026-07-12 03:14 PM CT

Purpose: define the official fallback path for getting generated or uploaded PNG sprites into `Kalomika/apartment-god-prototype` when Agent or Codex usage is limited and the native GitHub connector cannot directly transmit binary image streams.

This is a handbook supplement until the main handbook and development matrix are next merged or until ChatGPT gains reliable native binary write support through the GitHub connector.

---

## Status

```txt
Status: IMPLEMENTED AS DOCUMENTATION
Runtime files changed: no
Render playable branch updated: no
Branch: phaser-migration
```

This document does not mean the sprite replacement pipeline is implemented in runtime. It only defines a safe upload route for future PNG asset commits.

---

## Core Decision

Do not depend on Agent or Codex as the only path for PNG delivery.

Preferred fallback:

```txt
Use a Custom GPT Action or equivalent GitHub REST API action that sends Base64 PNG data to the GitHub Repository Contents API.
```

This is preferred over committing `.png.b64` text files because the API can write the final repository path as a real, viewable `.png` file.

Emergency fallback only:

```txt
Commit `.png.b64` files only when no direct API upload action is available, then decode them into real PNG files before runtime integration.
```

Do not treat `.png.b64` files as final game assets.

---

## Correct API Target

Use the GitHub API host, not the normal website host:

```txt
https://api.github.com
```

Endpoint:

```txt
PUT /repos/{owner}/{repo}/contents/{path}
```

Example target path:

```txt
/assets/sprites/resident/idle_down.png
```

The request body must include:

```json
{
  "message": "Add Resident idle down sprite",
  "content": "<base64_png_without_data_uri_prefix>",
  "branch": "phaser-migration"
}
```

When replacing an existing file, include the current file SHA:

```json
{
  "message": "Update Resident idle down sprite",
  "content": "<base64_png_without_data_uri_prefix>",
  "branch": "phaser-migration",
  "sha": "<existing_file_sha>"
}
```

Never include a `data:image/png;base64,` prefix in the `content` field. Send only the Base64 payload.

---

## Custom GPT Action Requirements

If Kam creates a Custom GPT Action for this, the action must:

```txt
1. Use https://api.github.com as the server.
2. Use PUT /repos/{owner}/{repo}/contents/{path}.
3. Require owner, repo, path, message, content, and branch.
4. Support optional sha for updating an existing PNG.
5. Default work to branch phaser-migration unless Kam explicitly says otherwise.
6. Never write to main unless Kam explicitly asks for a Render playable branch update.
7. Never modify Render settings.
8. Never touch Kalomika/ai-rpg-engine.
```

Minimum OpenAPI schema:

```json
{
  "openapi": "3.1.0",
  "info": {
    "title": "GitHub PNG Asset Committer",
    "description": "Uploads Base64 encoded PNG assets to a GitHub repository path as real files.",
    "version": "1.0.0"
  },
  "servers": [
    {
      "url": "https://api.github.com"
    }
  ],
  "paths": {
    "/repos/{owner}/{repo}/contents/{path}": {
      "put": {
        "summary": "Create or update a repository file",
        "operationId": "createOrUpdateRepositoryFile",
        "parameters": [
          {
            "name": "owner",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "repo",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "path",
            "in": "path",
            "required": true,
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "message",
                  "content",
                  "branch"
                ],
                "properties": {
                  "message": {
                    "type": "string"
                  },
                  "content": {
                    "type": "string",
                    "description": "Base64 encoded file content only. Do not include a data URI prefix."
                  },
                  "branch": {
                    "type": "string",
                    "default": "phaser-migration"
                  },
                  "sha": {
                    "type": "string",
                    "description": "Required by GitHub when updating an existing file. Omit only for new files."
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "File updated."
          },
          "201": {
            "description": "File created."
          }
        }
      }
    }
  }
}
```

---

## Authentication Rule

Use a fine grained GitHub Personal Access Token only when Kam explicitly sets up the Custom GPT Action.

Token rules:

```txt
1. Limit the token to Kalomika/apartment-god-prototype.
2. Give Contents read and write only.
3. Use an expiration date.
4. Store it only in the Custom GPT Action authentication field.
5. Do not paste the token into normal chat.
6. Do not commit the token into the repo.
7. Rotate or delete the token if it is exposed.
```

The action should use Bearer authentication.

---

## Apartment God Asset Rules

PNG uploads must still obey the visual production rules.

Before uploading any PNG sprite, confirm:

```txt
1. The asset is true top down, not isometric.
2. The asset is not a toilet door style character.
3. The asset is not crude, toy like, emoji like, or blob like.
4. The asset has a clear target object, character, action, or animation state.
5. The asset has a safe path under assets or another approved runtime asset folder.
6. The asset does not overwrite another agent's work without inspection.
7. The asset has a manifest entry planned or created before runtime wiring.
8. Runtime integration stays behind safe fallbacks until browser tested.
```

Recommended future asset folders:

```txt
assets/sprites/characters/<character_id>/
assets/sprites/objects/<object_id>/
assets/sprites/vehicles/<vehicle_id>/
assets/sprites/effects/<effect_id>/
assets/manifests/
```

Each character or object should get its own folder when a sprite set has multiple directions, poses, or animation states.

---

## Required Future Matrix Update

At the next safe matrix edit, update `apartment-god-production/DEVELOPMENT_MATRIX.md` so the `Sprite replacement pipeline` row mentions:

```txt
Custom GPT Action PNG upload fallback documented in docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md. This allows Base64 PNG data to be committed through the GitHub Repository Contents API as real PNG files when Agent or Codex usage is limited. Runtime sprite replacement remains PLANNED until assets are uploaded, manifested, wired behind fallbacks, and browser tested.
```

Also add a risk row or note:

```txt
PNG API upload fallback | Medium | Can bypass local build checks and can overwrite assets if sha, branch, or paths are wrong. | Use phaser-migration, require sha for updates, keep manifests, inspect existing files first, and never write to main without explicit Render update approval.
```

---

## Required Future Handbook Update

At the next safe handbook edit, add this file to the required reading list:

```txt
docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md
```

Add a short rule near the visual or repo workflow section:

```txt
When Agent or Codex usage is limited, use the PNG upload fallback instead of blocking sprite delivery. The fallback uses a Custom GPT Action or equivalent GitHub REST API call to write Base64 PNG content to a real .png path on phaser-migration. Do not use .png.b64 files as final assets.
```

---

## Ongoing Log Entry To Merge

```txt
## 2026-07-12 03:14 PM CT, PNG Upload Fallback Documented

Status: IMPLEMENTED
Branch: phaser-migration
Commit: current documentation commit
Files changed:
docs/APARTMENT_GOD_PNG_UPLOAD_FALLBACK.md
Runtime files changed: no
Render playable branch updated: no
Backup branch:
backup/phaser-migration-before-development-matrix-2026-07-11

Summary:
Documented the official fallback path for committing PNG sprites when Agent or Codex usage is limited and the native GitHub connector cannot directly transmit binary image streams.

Implementation details:
The document defines the Custom GPT Action or GitHub REST API workflow using Base64 PNG content, the corrected api.github.com server, the repository contents endpoint, branch discipline for phaser-migration, sha requirements for updates, token security, asset folder guidance, and future matrix and handbook sync notes.

Testing performed:
Documentation only. Confirmed repo access, phaser-migration file access, matrix file presence, and backup branch file access before adding the documentation file.

Testing requested:
None for runtime. Future PNG upload tests should start with a harmless test image on phaser-migration, confirm GitHub renders it as a normal PNG, then remove or replace the test asset before production use.

Known risks:
The fallback can bypass local build checks. Wrong branch, wrong path, missing sha on update, or careless overwrite could damage asset organization. This must be used with strict path, branch, and manifest discipline.

Follow ups:
Merge this supplement into the main handbook required reading list and development matrix during the next safe documentation sync. Then run a small PNG upload proof test on phaser-migration before using it for production sprite sets.
```
