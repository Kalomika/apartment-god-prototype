// Superseded legacy visual correction layer.
//
// This file used to draw first-pass couch, porch, dining, fridge, coffee, stairs,
// shower, bed, book, and arcade corrections. Those visuals are now owned by
// realismCorrectionPass.js and visualRegressionFixes.js. Keeping this older draw
// layer active caused duplicate stacked furniture and ghosted overlays.
//
// Keep the exported function names because rendering.js imports them, but make
// this layer intentionally inert until a future audited replacement deletes it.

export function drawRequestedVisualCorrections() {}

export function drawRequestedAfterEntityVisualCorrections() {}
