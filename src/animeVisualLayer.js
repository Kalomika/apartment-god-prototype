// Anime visual pass 01 garage underlay was disabled on 2026-07-13 after live
// garage QA showed a mismatched metallic garage during idle versus interaction
// states. Returning false preserves the pre-metallic procedural garage renderer.

export function drawAnimeEnvironmentUnderlay() {
  return false;
}
