# Player UI Redesign - Decisions

## Technical Decisions

### 2026-02-06: Howler Mode

- **Decision**: Switch from `html5: true` to `html5: false`
- **Reason**: Enable Web Audio API for AnalyserNode (visualizer)
- **Trade-off**: Higher memory usage, but necessary for visualizer

### 2026-02-06: Visualizer Implementation

- **Decision**: Use Canvas + requestAnimationFrame, NOT React state
- **Reason**: Performance - 60fps updates would kill React rendering

### 2026-02-06: Dynamic Background Scope

- **Decision**: Apply only to PlayerBar, not entire app
- **Reason**: Performance and visual focus
