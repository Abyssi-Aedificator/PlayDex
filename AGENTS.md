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

**Never push `main`.** Do not push `main` under any circumstances, including when a release is
requested. Releasing — merging `dev` into `main` and publishing it — is the user's job; the agent
stays on `dev`. Pushing `dev` when asked is fine.

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

- **Always update the changelog when you make something.** Every user-facing feature or bugfix commit ships its `changelog.txt` bullet in the same commit (under the current pending-release version block), unless the user explicitly defers logging to a release/changelog pass. Never a standalone "no-op" commit when user-facing work is involved.
- After finishing each feature: update `changelog.txt` (new bullet), commit, then update AGENTS.md if needed.

## Architecture

- **Everything lives in `index.html`** (~3500 lines). CSS is in `<head><style>`; JS is a single IIFE from `<script>` (~line 1950) closing with `})();` near the end.
- There are no external frameworks or build artifacts. Data lives in `localStorage`; optional Dropbox sync is XHR/cloud (the browser's own storage, not server-side).
- PWA identity is locked to `/PlayDex/` (see `manifest.webmanifest`) because sibling PWAs (e.g. `MedsADay`) live on the **same GitHub Pages origin**. Never reintroduce `clients.claim()` or a global `caches.keys().filter(k => k !== X).forEach(delete)` — that crosses app scopes.

## Theming / layout gotchas (recurring bugs)

- **CSS specificity tripping over global input rules:** `input[type="text"], input[type="number"], input[type="time"] { width:100%; padding:11px 14px; ... }` (line ~481) has specificity (0,1,1) and will silently override class `.foo { ... }` (0,1,0). When theming a control built on a native input, target it as `input.foo` (0,2,0) or the width/padding/radius will not apply (this bit the themed time picker).
- **Keep the nav clearance:** `.app-content` needs `padding-bottom:96px`, but the `@media (min-width:768px)` `padding` shorthand overrides it. Keep `padding:28px 28px 96px` on desktop. Re-verify whenever you touch `.app-content` padding.
- **Time picker (Add/Edit Session):** the four HH/MM inputs are custom RTF controls, not `<input type="time">`. The trigger ids (`add-session-time`, ...) live on the `.cal-field` wrapper divs, set via `createTimeField()`. `setCalDateTime`/`getCalDateTime(dateField, timeField, iso)` take field *objects*, not string ids. Value is stored 24h `HH:MM` but shown as AM/PM.
- **Animations:** all smooth motion is `cubic-bezier(0.4,0,0.2,1)`; stagger delays are capped (`Math.min(i*40,320)`). A `@media (prefers-reduced-motion: reduce)` block (line ~1445) forces durations to 0.01ms. `renderSessionsTab(animate=true)` — pass `animate=false` for in-place updates (sync/delete toggles) so the whole list doesn't re-animate.

## Interface skins (Classic / Material 3)

- `settings.uiStyle` is `'classic'` (default) or `'material'`. It is applied as a
  `data-ui` attribute on `<html>` by `applyUI()` and, to avoid a flash, by the
  pre-paint script in `<head>` alongside `data-theme`.
- Every Material 3 rule lives in one block scoped to `:root[data-ui="material"]`
  appended at the **end** of the stylesheet. It must stay last: it ties on
  specificity with `:root[data-theme="dark"]`/`[data-theme="light"]` and only
  wins on source order. The classic skin is untouched by construction.
- The M3 colour roles (`--md-primary`, `--md-surface-container*`, `--md-outline*`,
  …) are generated in JS by `m3Roles()` from whichever accent + theme are
  active — an HSL-tone approximation of Material You (tone 40 light / 80 dark),
  **not** a real HCT port. `applyAccent()` collapses the classic two-colour
  gradient to the single M3 primary tone while Material is on, so the Theme and
  Theme Colour pickers keep working.
- The app's own colour tokens are re-pointed at the roles in JS
  (`applyMaterialTokens`, `M3_TOKEN_MAP`), not in CSS. That way, before the main
  script runs, the theme's normal palette still applies and the boot splash
  never flashes the wrong colours. Switching back to Classic removes exactly the
  properties it set.
- Floating labels: modals that already have `.field-group > label` get a real M3
  float, triggered with `:has()` (focus, filled input, select, or a non-placeholder
  `.cal-label`). Bare modal inputs are wrapped in `.m3-field`; that wrapper is
  `display:contents` with a hidden label outside Material mode, so the markup
  change is invisible in Classic.
- `.m3-fab` is a **body-level** button (never inside a tab panel — `.tab-panel.active`
  animates a transform, which would break `position:fixed`). It is shown by a
  `.show` class toggled in `goTab()` and at init, and only when Material is on.
- **State layers:** one grouped rule paints `::after { background: currentColor;
  border-radius: inherit }` at 8% hover / 10% focus / 12% pressed, and the old
  `:hover` colour-swap and elevation rules were removed in favour of it. Never
  add `.m3-fab` to that group's `position: relative` declaration — the FAB is
  `position: fixed`, the group's `relative` would win on source order, and the
  button stretches across the whole content column. Also excluded because their
  `::after` is already taken: `.dbx-toggle input` (switch thumb) and
  `.progress-fill` (shimmer).
- **Motion:** `--md-dur-short2/3/4`, `--md-dur-medium2`, `--md-decel`,
  `--md-accel` live in the token block; `.tab-panel.active` uses
  `panel-in var(--md-dur-medium2) var(--md-decel)`. Use the tokens rather than
  new literal durations.
- **Snackbar:** capped at `min(344px, calc(100vw - 32px))` and allowed to wrap,
  then lifted to 146px (mobile) / 168px (desktop) by
  `body:has(.m3-fab.show)` so it always sits 16dp above the FAB. The desktop
  number tracks the FAB's 96px desktop offset — retune both together.
- **Desktop keeps the bottom tab bar** (all 8 tabs) in Material mode; `body` has
  no `padding-left` and `.app-content` keeps `28px 28px 96px`. A 88px M3
  navigation rail was built and then removed at the user's request — do not
  reintroduce it without asking.
- Deliberate scope limits: native `<select>` popups stay native (only the closed
  state is themed); the custom RTF time picker keeps its own compact HH/MM boxes
  rather than an M3 dial; the HSL palette is close to, but not exactly,
  Material You.
- Watch the equal-specificity trap: `:root[data-ui="material"] input[type="text"]`
  and `:root[data-ui="material"] input.time-input` are both (0,3,1), so the
  `.time-input` override must stay **after** the generic input rule.

## Top tab

- Period is user-selectable (`This week` / `7 days` / `Month` / `All time`), persisted in `settings.topPeriod` and validated against `TOP_PERIODS` via `getTopPeriod()`.
- Bounds come from `getPeriodBounds(period)` / `getPrevPeriodBounds(period)`; `start` is `null` for `all` (no previous period ⇒ trends, deltas and the "Fell out" section are hidden).
- `week` is **calendar** (Mon–Sun, via `getWeekBounds`); `rolling7` is the trailing 7 days. Note the Stats tab's "This week" is rolling 7 days — the two differ by design.
- `renderTop()` owns the whole panel: the period selector is static markup (`#top-periods`), but the summary (`#top-summary`), list (`#top-list`) and fell-out block (`#top-fellout`) are rebuilt on every render. Shared helpers: `topDeltaHtml`, `championStreak`, `topPeriodBuckets`, `sparkBarsHtml`.

## Workflow conventions

- This repo is served via GitHub Pages under `/PlayDex/`; asset links are relative so they work at any subpath.