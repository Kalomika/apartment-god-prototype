# Apartment God Idea Bible Append: AI Studio Protocol

Date: 2026-07-23 CT
Updated: 2026-07-24 CT
Status: IMPLEMENTED, LIVE CLAIM WORKFLOW NEEDS_TESTING
Branch: phaser-migration

## Directive

Maintain a repository-native AI studio operating system for Apartment God. The system must let a newly opened AI chat inspect the latest repository state, find an unoccupied role or task, claim only that work, execute within department boundaries, update shared production memory, submit evidence, and release the claim without overwriting other agents.

## Required capabilities

- The repository is the source of truth, not chat memory.
- A Producer protocol audits the current branch, recent commits, active PRs, claims, dependencies, matrix status, logs, and risks before assigning work.
- Department roles have explicit ownership, exclusions, handoff rules, and escalation paths.
- Work is claimed before implementation and released after a logged handoff.
- Tasks carry dependencies, risk, production points, required evidence, and test level.
- Technical completion and creative approval are separate gates.
- Architecture review prevents duplicate systems and conflicting implementations.
- Studio memory records why decisions were made and which alternatives were rejected.
- Technical debt, assets, performance budgets, research work, and release promotion have dedicated controls.
- Machine-readable state supports automated audits.
- A repository audit script checks structural integrity and reports violations without changing runtime code.

## Implemented foundation

The governance foundation was installed in `a2ecddfd3a7fafe296a7eac6efe9f1bb53751efc`, accepted and recorded in `e3addef6b00a5cacbbf52dce50769da9a2ed7076`, and finalized in `ef538cbaf2bcccba4bf77a3c5dbf8e78cb15f1a1`.

Implementation status does not mean the claim protocol has been proven under concurrent real work. The first complete task claim, evidence, handoff, and release lifecycle remains a required operational test.

## Invocation goal

A future worker should be able to receive a command such as:

`Join the Apartment God studio. Read studio/START_HERE.md, claim an eligible unoccupied assignment, and follow the complete protocol.`

## Safety boundaries

- Repo: Kalomika/apartment-god-prototype
- Active development branch: phaser-migration
- Never touch Kalomika/ai-rpg-engine.
- Never update main unless Kam explicitly requests a Render playable update.
- Never deploy or change Render settings.
- Keep runtime work small, auditable, and playable.
