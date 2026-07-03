# Render Mapping Plan

## Purpose

This file keeps the wrestling sim ready for later Render testing without connecting it to any existing game runtime yet.

## Current State

The current module is a pure Node simulation package.

It can run a text based match simulation and produce a structured match report.

## Later Render Shape

A future Render test can expose three simple endpoints.

```text
GET /health
Confirms the service is alive.

POST /simulate
Runs a match between two wrestler profiles.

POST /choices
Returns the current manager choice tray for a live or paused match state.
```

## Visual Layer Later

The visual layer can be added after the simulation loop feels right.

Possible visual stages:

```text
stage 1 text match log
stage 2 2D ring diagram
stage 3 simple 3D capsules under hard cam
stage 4 mannequin wrestlers
stage 5 styled custom wrestlers
stage 6 crowd foreground and broadcast presentation
```

## Integration Boundary

Do not import this module into any other game until a separate integration branch is made.

Suggested future branch:

```text
wrestling-sim-render-prototype
```

The first Render pass should be a service wrapper around this isolated module, not a rewrite of the apartment game or AI RPG engine.
