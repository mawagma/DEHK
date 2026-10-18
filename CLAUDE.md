# CLAUDE.md – GMA Digitales Einzelhandelskonzept

## Read first
Read `PROJECT_HANDOFF.md` completely before changing code. It contains the binding product, UX, GIS, privacy and architecture decisions.

## Product
This repository is the PUBLIC frontend for the reusable GMA “Digitales Einzelhandelskonzept”.

It is:
- a custom responsive React/TypeScript web app,
- a modern GMA-branded data product,
- backed by ArcGIS Online WebMaps / Feature Services.

It is NOT:
- a generic GIS portal,
- an ArcGIS Experience Builder public app,
- a runtime planning-analysis engine.

## Core architecture
PUBLIC:
`React + TypeScript + Vite -> ArcGIS Maps SDK for JavaScript -> ArcGIS Online`

ArcGIS Online owns geometry, WebMaps, public feature views and cartographic configuration.
The frontend owns navigation, layout, state, profiles, filters, charts and editorial content.

All domain calculations are prepared upstream by GMA. The frontend visualizes finished data.

## Current scope
Implemented:
- `/` Overview
- `/zentren` Centers & locations
- 70/30 overview -> 30/70 center profile interaction
- municipality config for Wiesbaden
- ArcGIS WebMap loader + visual fallback

Not yet implemented:
- real map feature selection / map-list synchronization
- Nahversorgung
- Einzelhandelsstruktur
- Einzelhandel steuern
- production ArcGIS IDs

## UX constraints
Keep the existing GMA visual direction:
- blue `#006da8`
- dark gray `#34444e`
- light background
- calm, modern data-product appearance
- no generic admin-dashboard redesign

Centers page:
- overview: ~70% map / 30% list
- profile: ~30% map / 70% profile
- one shared selected-center state for map and list

## Multi-municipality requirement
Do not hardcode Wiesbaden into components.
Use explicit reusable config types and municipality-specific config files.

## Data/privacy
Never assume frontend hiding protects confidential fields.
PUBLIC services must only expose approved public data.
Do not expose exact store-level sales area or turnover unless explicitly approved.

## ArcGIS
Prefer WebMap item IDs and stable layer IDs from municipality config.
Do not recreate cartography in React unless necessary.
When implementing feature selection:
- use `view.hitTest`
- filter to configured center layer
- read configured `CENTER_ID` field
- emit selected ID to parent
- keep map and list on same React state
- use `view.goTo` for focus where appropriate

If actual IDs/field names are unknown, make them configurable. Never invent production IDs.

## Engineering
- First run install/build and inspect actual errors.
- Make minimal, reusable changes.
- Keep components reasonably small.
- Implement loading, empty and error states for real data.
- Maintain keyboard/focus accessibility.
- Do not add a backend, DB, CMS, auth or framework migration without a concrete need.
- Do not blindly upgrade dependencies.
- Run build/tests after changes.

## Next priority
1. Stabilize current V1 build.
2. Refactor municipality config to explicit types.
3. Add map center selection and map/list sync.
4. Add zoom-to-center from list.
5. Then implement:
   - Nahversorgung
   - Einzelhandelsstruktur
   - Einzelhandel steuern

## Reporting after work
Summarize:
- files changed,
- behavior changed,
- build/test result,
- config/ArcGIS values still required,
- any open technical risks.
