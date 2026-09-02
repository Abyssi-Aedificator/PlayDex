# AGENTS.md

Single-file PWA game-session tracker. No build, lint, test, or typecheck tooling exists.

## Commands
- **No `node`/npm/make is installed.** There is no build/test/lint command in this repo.
- **Validation is manual:** use a string-aware brace balancer on the JS and check `<div>`/`<span>` open/close counts. Small throwaway Python/PowerShell checks under `%TEMP%\opencode` are the established pattern (never leave them in the repo).
- Git branch is `dev` (not `main`); commit/push explicitly, follow existing message style (`git log --oneline`).
- **Never include a version bump in the changelog or as its own commit.** Fold the version bump into the latest actual change (its commit message and changelog entry).

## Architecture
- **Everything lives in `index.html`** (~3500 lines). CSS is in `<head><style>`; JS is a single IIFE from `<script>` (~line 1950) closing with `})();` near the end.
- There are no external frameworks or build artifacts. Data lives in `localStorage`; optional Dropbox sync is XHR/cloud (the browser's own storage, not server-side).
- PWA identity is locked to `/PlayDex/` (see `manifest.webmanifest`) because sibling PWAs (e.g. `MedsADay`) live on the **same GitHub Pages origin**. Never reintroduce `clients.claim()` or a global `caches.keys().filter(k => k !== X).forEach(delete)` — that crosses app scopes.

## Theming / layout gotchas (recurring bugs)
- **CSS specificity tripping over global input rules:** `input[type="text"], input[type="number"], input[type="time"] { width:100%; padding:11px 14px; ... }` (line ~481) has specificity (0,1,1) and will silently override class `.foo { ... }` (0,1,0). When theming a control built on a native input, target it as `input.foo` (0,2,0) or the width/padding/radius will not apply (this bit the themed time picker).
- **Keep the nav clearance:** `.app-content` needs `padding-bottom:96px`, but the `@media (min-width:768px)` `padding` shorthand overrides it. Keep `padding:28px 28px 96px` on desktop. Re-verify whenever you touch `.app-content` padding.
- **Time picker (Add/Edit Session):** the four HH/MM inputs are custom RTF controls, not `<input type="time">`. The trigger ids (`add-session-time`, ...) live on the `.cal-field` wrapper divs, set via `createTimeField()`. `setCalDateTime`/`getCalDateTime(dateField, timeField, iso)` take field *objects*, not string ids. Value is stored 24h `HH:MM` but shown as AM/PM.
- **Animations:** all smooth motion is `cubic-bezier(0.4,0,0.2,1)`; stagger delays are capped (`Math.min(i*40,320)`). A `@media (prefers-reduced-motion: reduce)` block (line ~1445) forces durations to 0.01ms. `renderSessionsTab(animate=true)` — pass `animate=false` for in-place updates (sync/delete toggles) so the whole list doesn't re-animate.

## Workflow conventions
- This repo is served via GitHub Pages under `/PlayDex/`; asset links are relative so they work at any subpath.
- Verify JSON (`manifest.webmanifest`) parses and `sw.js` braces balance after editing them.