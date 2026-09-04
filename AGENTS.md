# AGENTS.md

Single-file PWA game-session tracker. No build, lint, test, or typecheck tooling exists.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Entire app (UI, styles, logic, data model) in one file |
| `changelog.txt` | Plain-text changelog, most recent version first |
| `sw.js` | Service worker — offline cache. Bump the `CACHE` name (e.g. `playdex-v3`) and `SW_VERSION` whenever `index.html` changes. |
| `manifest.webmanifest` | PWA install manifest, identity locked to `/PlayDex/` |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons |
| `README.md` | User-facing docs |
| `AGENTS.md` | Repo conventions (this file) |

## Commands

- **No `node`/npm/make is installed.** There is no build/test/lint command in this repo.
- **Validation is manual:** use a string-aware brace balancer on the JS and check `<div>`/`<span>` open/close counts. Small throwaway Python/PowerShell checks under `%TEMP%\opencode` are the established pattern (never leave them in the repo).
- Verify JSON (`manifest.webmanifest`) parses and `sw.js` braces balance after editing them.

## Branches

- `dev` — active development (current default)
- `main` — production / stable

Commit/push only when explicitly asked. Follow existing message style (`git log --oneline`).

## Commit policy

- Each bug fix or feature change is a separate, individual commit; short imperative description.
- **Never include version numbers in commit messages.**
- **Never bump the version unless explicitly asked.**
- Version bumps are folded into the commit for the release's last actual change — never a standalone "Bump version" commit. The `changelog.txt` version header and the `.version-badge` span ship in that same commit.
- **Changelog entries describe user-facing changes only.** Never write a standalone version/cache-bump line in a `changelog.txt` bullet (e.g. "Bumped SW_VERSION/cache to playdex-vX"). Version/cache bumps are implicit in the release commit, not listed as a change.

## Version representation

- `APP_VERSION` constant in `index.html` (~line 3695), used by the new-version prompt.
- Displayed version: the `.version-badge` span in `index.html` (~line 1460).
- Service worker version: `SW_VERSION` constant in `sw.js` (~line 2) — also used in the `playdex-vX` cache name.
- Keep the badge, `APP_VERSION`, and `SW_VERSION`/cache name in sync whenever version changes.

## Version consolidation

- Consolidation is a routine the user triggers explicitly, phrased like
  "consolidate version from X to Y" (e.g. 1.0.1 to 1.0.8).
- The user supplies BOTH the start/end range AND the target consolidated
  version (e.g. 1.1.0) AND the new cache name (e.g. `playdex-vX`). Follow
  those exactly; never derive or invent them.
- Collapse every changelog entry whose version falls within and includes the
  start/end range into ONE new block at the top under the consolidated version,
  combining their user-facing bullets. Dedupe near-duplicates; keep entries
  user-facing; preserve ~oldest-to-newest feature order.
- Versions below the start of the range remain as their own entries, unchanged.
- Update ALL version markers to the consolidated version and new cache name:
  `.version-badge`, `APP_VERSION`, `SW_VERSION`, and `CACHE_NAME`.
- This is a version/cache operation only — no feature behavior changes.
- No standalone "bumped cache/version to playdex-vX" bullet; changelog entries
  stay user-facing only.

## Workflow

- After finishing each feature: update `changelog.txt` (new entry at the top), commit, then update AGENTS.md if needed.

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