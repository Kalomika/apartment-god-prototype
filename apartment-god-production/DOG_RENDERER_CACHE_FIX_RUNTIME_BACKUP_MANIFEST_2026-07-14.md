# Runtime Backup Manifest, Dog Renderer Cache Fix

Date: 2026-07-14

Because the connector branch creation action was intermittently unavailable in the active tool slice during this pass, this manifest records the runtime files and SHAs protected before runtime patching.

## Protected files before runtime patch

- `index.html`
  - blob SHA before patch: `9b0cfeabc237300ab30a49680cccc3d4f4bf24fe`
- `src/rendering.js`
  - blob SHA before patch: `e2b0bd672d41b1a17fd4668225f45d3fbc6bcffd`

## Recovery commit

Known recovery head before dog cache fix documentation/runtime work: `5003e5d76b55ec16c6a9fbce3478af0af1fd6422`.

## Planned runtime patch

- Add a version query to the HTML module entry point.
- Add a version query to the dog overlay module import in `src/rendering.js`.

This manifest is not a replacement for a proper branch backup when branch tooling is available, but it records exact runtime file SHAs before the patch.
