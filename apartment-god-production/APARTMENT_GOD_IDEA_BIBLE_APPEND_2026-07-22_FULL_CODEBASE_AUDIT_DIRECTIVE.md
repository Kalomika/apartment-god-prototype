# Apartment God Idea Bible Append: Full Codebase Audit Directive

Date: 2026-07-22
Status: ACTIVE AUDIT DIRECTIVE
Branch: phaser-migration-2
Runtime files changed: no
Main touched: no
Render settings changed: no

## Kam directive

Kam reported that Apartment God currently has major issues across the board and requested a serious audit of the entire codebase rather than another isolated symptom patch.

## Audit intent

The audit must inspect the latest repository state and determine actual implementation quality across:

- boot and runtime ownership
- Phaser scene architecture
- simulation update order
- renderer and visual-system overlap
- actor movement and pathfinding
- character direction and animation
- layered clothing architecture
- activity-specific poses and animations
- objects, rooms, world layout, and orientation
- collisions and routing
- HUD, phone, menus, and mobile layout
- save, refresh, reset, and state sanitation
- autonomy and action transitions
- vehicles, offsite behavior, arcade, pool, basketball, dog, and other dynamic systems
- asset manifests, generated assets, fallbacks, and source quality
- build scripts, repair scripts, workflows, tests, and claims of verification
- branch drift, duplicate systems, obsolete patches, and deployment-preview pinning
- documentation truthfulness and matrix status

## Audit standard

This is not a checklist-only review. Findings must distinguish:

- confirmed code defect
- architectural risk
- visual mismatch
- untested implementation
- obsolete or duplicate system
- misleading completion claim
- acceptable temporary fallback
- verified working behavior

The audit must not describe unfamiliar code as broken merely because it is new. It must identify concrete conflicts, unsafe state ownership, duplicated rendering, brittle patch layers, missing tests, false asset coverage, or code that contradicts Kam's stated gameplay and visual rules.

## Output requirement

Create a repo-searchable audit report ranked by severity with exact files, evidence, consequences, and repair order. Update the ongoing design log and development matrix honestly. Do not make broad runtime changes during the audit unless Kam separately authorizes a repair pass.
