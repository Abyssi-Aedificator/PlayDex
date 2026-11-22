# AGENTS.md

Single-file PWA game-session tracker. The repository has no build, lint, test, or typecheck command.

## Files

| File | Purpose |
|------|---------|
| `index.html` | Entire app (UI, styles, logic, data model) in one file |
| `changelog.txt` | Plain-text changelog, most recent version first |
| `sw.js` | Service worker — offline cache. Advance `CACHE_NAME` whenever `index.html` changes; `SW_VERSION` mirrors the app release version. |
| `manifest.webmanifest` | PWA install manifest, identity locked to `/PlayDex/` |
| `icon-192.png`, `icon-512.png`, `apple-touch-icon.png` | App icons |
| `README.md` | User-facing docs |
| `plan_dontwant.txt` | Ideas explicitly rejected for this project |
| `AGENTS.md` | Repo conventions (this file) |

Before proposing or implementing features, consult `plan_dontwant.txt`. Do not propose or implement its rejected ideas unless the user explicitly changes their decision.

## Validation

- No package installation or build step is required. Do not assume Node/npm/make is on PATH. An optional bundled runtime may be available in the execution environment; inspect it before use.
- Validate inline JavaScript and `sw.js` with a syntax parser when available; otherwise use a string/comment-aware brace balancer. Check static `<div>`/`<span>` open/close counts and parse `manifest.webmanifest` as JSON.
- For behavior changes, use isolated browser storage and mocked Dropbox requests. Never load test fixtures into the user's real library or contact their Dropbox account for tests.
- Keep throwaway checks and screenshots under `%TEMP%\opencode`, never in the repository. Check mobile/desktop layouts in Classic, Material 3 and Liquid Glass for affected interfaces.
- Documentation-only changes need link, consistency and `git diff --check` checks; they do not require an app/cache version change.

## Branches and delivery

- `main` is the current local branch and the remote default. The user removed local `dev`; do not recreate it automatically or follow stale remote-tracking refs as if they were live branches.
- Inspect branch and working-tree state before changes. Respect the user's explicit branch selection and preserve unrelated work.
- The user has requested an individual commit for each completed change. Follow that standing instruction and the existing message style (`git log --oneline`). Push only when explicitly requested.
- `main` is the delivery branch. Push to `origin/main` only when the user explicitly requests a push. Never push automatically after committing, updating documentation, changing a version, or finishing a task.

## Commit policy

- Each bug fix or feature change is a separate, individual commit; short imperative description.
- **Never include version numbers in commit messages.**
- **Never bump the version unless explicitly asked.**
- Version bumps are folded into the commit for the release's last actual change — never a standalone "Bump version" commit. The `changelog.txt` version header and the `.version-badge` span ship in that same commit.
- **Changelog entries describe user-facing changes only.** Never write a standalone version/cache-bump line in a `changelog.txt` bullet (e.g. "Bumped SW_VERSION/cache to playdex-vX"). Version/cache bumps are implicit in the release commit, not listed as a change.
- **Every changelog bullet is exactly one line.** Never wrap a bullet onto a continuation line — keep each entry on a single line regardless of length.

## Version-update requests

- When the user asks to update or bump the version, inspect the current app version and ask them to choose **Consolidation**, **Major**, **Minor**, or **Patch** before editing any version markers. Use the user-input tool when available and show the resulting version for each bump choice.
- For a current version `A.B.C`, Major increments the first segment and resets the others (`(A+1).0.0`); Minor increments the second segment and resets the patch (`A.(B+1).0`); Patch increments the third segment (`A.B.(C+1)`). These correspond to `x.z.z`, `z.x.z`, and `z.z.x` respectively.
- Consolidation combines existing release entries rather than adding a new empty release. Ask for any missing start/end range and target version, then follow the consolidation rules below.
- An exact version number alone does not replace the release-type question. Keep an explicitly supplied target; clarify any mismatch with the chosen release type rather than silently changing it.
- Do not repeat a choice the user has already answered for the same release request. An explicit request such as "bump patch" already supplies the type.
- After the choice, keep version markers and cache handling consistent with the rules below. Preserve the existing commit policy and push only on explicit request.

## Version representation

- `APP_VERSION` in `index.html`, used by the new-version prompt.
- Displayed version: the `.version-badge` span in `index.html`.
- `SW_VERSION` in `sw.js` matches `APP_VERSION`; `CACHE_NAME` uses its own increasing `playdex-v` numeric suffix.
- Keep the badge, `APP_VERSION`, and `SW_VERSION` equal on release changes. Advance the cache suffix for every app change, preserving zero padding; never infer an app-version bump from a cache change.

## Version consolidation

- Consolidation is a routine the user triggers explicitly, phrased like
  "consolidate version from X to Y" (e.g. 1.0.1 to 1.0.8).
- The user supplies the start/end range and target consolidated version
  (e.g. 1.1.0). Follow those exactly.
- Choose the next unused `playdex-v` numeric cache name automatically,
  incrementing the current suffix and preserving its zero padding. Do not ask
  the user for a cache name. If the user supplies one, use it exactly.
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
- After finishing each change: update its documentation and `changelog.txt` when user-facing, validate the affected behavior, then commit the related files together. Update these instructions in the same commit when conventions change.

## Architecture

- Application markup, CSS and logic live in `index.html`. Scripts include pre-paint setup and the main application IIFE. Search by function or semantic element ID rather than relying on fixed line numbers.
- There are no external frameworks or build artifacts. Data lives in `localStorage`; optional Dropbox sync is XHR/cloud (the browser's own storage, not server-side).
- PWA identity is locked to `/PlayDex/` (see `manifest.webmanifest`) because sibling PWAs (e.g. `MedsADay`) live on the **same GitHub Pages origin**. Never reintroduce `clients.claim()` or a global `caches.keys().filter(k => k !== X).forEach(delete)` — that crosses app scopes.

## Theming / layout gotchas (recurring bugs)

- **CSS specificity tripping over global input rules:** `input[type="text"], input[type="number"], input[type="time"] { width:100%; padding:11px 14px; ... }` has specificity (0,1,1) and will silently override class `.foo { ... }` (0,1,0). When theming a control built on a native input, target it as `input.foo` (0,2,0) or the width/padding/radius will not apply (this bit the themed time picker).
- **Keep the nav clearance:** `.app-content` needs `padding-bottom:96px`, but the `@media (min-width:768px)` `padding` shorthand overrides it. Keep `padding:28px 28px 96px` on desktop. Re-verify whenever you touch `.app-content` padding.
- **Time picker (Add/Edit Session):** the four HH/MM inputs are custom RTF controls, not `<input type="time">`. The trigger ids (`add-session-time`, ...) live on the `.cal-field` wrapper divs, set via `createTimeField()`. `setCalDateTime`/`getCalDateTime(dateField, timeField, iso)` take field *objects*, not string ids. Value is stored 24h `HH:MM` but shown as AM/PM.
- **Animations:** all smooth motion is `cubic-bezier(0.4,0,0.2,1)`; stagger delays are capped (`Math.min(i*40,320)`). A `@media (prefers-reduced-motion: reduce)` block forces durations to 0.01ms. `renderSessionsTab(animate=true)` — pass `animate=false` for in-place updates (sync/delete toggles) so the whole list doesn't re-animate.

## Interface skins (Classic / Material 3 / Apple)

- `settings.uiStyle` is `'classic'` (default), `'material'`, or `'apple'`. It is applied as a
  `data-ui` attribute on `<html>` by `applyUI()` and, to avoid a flash, by the
  pre-paint script in `<head>` alongside `data-theme`.
- Every Material 3 rule lives in one block scoped to `:root[data-ui="material"]`
  appended at the **end** of the stylesheet. It must stay last: it ties on
  specificity with `:root[data-theme="dark"]`/`[data-theme="light"]` and only
  wins on source order. The classic skin is untouched by construction.
- The M3 colour roles (`--md-primary`, `--md-surface-container*`, `--md-outline*`,
  …) are generated in JS by `m3Roles()` from whichever accent + theme are
  active — an HSL-tone approximation of Material You (tone 40 light / 80 dark),
  **not** a real HCT port. Secondary is the source hue with saturation pulled
  right down (`src.s * 0.22`, floored at 6%) so its containers read as a
  *different* colour from the primary palette rather than more of the same;
  tertiary keeps the hue rotation (`src.h - 55`) and is extracted as
  `m3TertiaryHsl()` so `m3Roles()` and `applyAccent()` share one copy of the
  maths. `applyAccent()` retargets the classic two-colour gradient at
  primary → tertiary while Material is on, so the Theme and Theme Colour pickers
  keep working and the decorative accents (medals, level badge, weekday bars)
  keep a two-tone look. `header h1` and `.boot-logo` are flattened to a solid
  primary in Material — M3 has no gradient wordmark.
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
  It is an **extended** FAB (icon + `.m3-fab-label`), collapsing to the 56px icon
  form under 400px wide.
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
- **Type:** Material applies the M3 scale explicitly — `.stat-value`,
  `.modal h3` and `header h1` are title-large (22px/500); `.card-header`,
  `.stat-label` and the tab labels are label-medium (12px/500); `.big-time` is
  display-large (45px, **fixed**, so it does not grow to 3.6rem on desktop like
  Classic does). **`.big-time` weight 500 is a deliberate deviation** from the
  spec's 400, for legibility on a live-updating timer — keep it.
- **Snackbar:** capped at `min(344px, calc(100vw - 32px))` and allowed to wrap,
  then lifted to 146px (mobile) / 168px (desktop) by
  `body:has(.m3-fab.show)` so it always sits 16dp above the FAB. The desktop
  number tracks the FAB's 96px desktop offset — retune both together.
- **Desktop keeps the bottom tab bar** (all 8 tabs) in Material mode; `body` has
  no `padding-left` and `.app-content` keeps `28px 28px 96px`. A 88px M3
  navigation rail was built and then removed at the user's request — do not
  reintroduce it without asking.
- Material uses the existing custom select adapter (`mx-native-select` and its visible trigger/menu); keep the source select and change events intact. The custom RTF time picker remains compact HH/MM controls, and the HSL palette approximates Material You.
- Watch the equal-specificity trap: `:root[data-ui="material"] input[type="text"]`
  and `:root[data-ui="material"] input.time-input` are both (0,3,1), so the
  `.time-input` override must stay **after** the generic input rule.

### Apple interface

- Apple rules are scoped to `:root[data-ui="apple"]`; Classic-only rules use `:root:is([data-ui="classic"],:not([data-ui]))` so they cannot leak into the third skin.
- Use a Theme Colour backdrop with softer translucent content panels; reserve stronger refractive effects for navigation, the header, and transient feedback. System fonts and existing inline icons require no Apple font or symbol assets.
- `appleAccentRoles()` supplies contrast-safe accent text and filled-button text before first paint and at runtime. `applyAppleAccent()` preserves the selected accent when changing skins; remove Material token overrides before applying Classic or Apple accents.
- Apple navigation retains all destinations, uses two rows below 600px, and derives content/snackbar clearance from the shared `--mx-nav-height` measurement plus safe-area insets.
- Apple uses the existing native select and compact date/time fields. Topmost-overlay focus handling is shared with Material; Material menus, picker dialogs, and the FAB remain exclusive to Material mode.
- The Liquid Glass functional layer uses a shared neutral tab-bar material and `.apple-tab-lens` selection indicator. Never add a separate backdrop filter to the selection lens or refraction to content cards; outer content panels use a single softer blur and nested panels stay dense. Primary-action tint is reserved for prominent controls.
- `refreshAppleGlass()` aligns the lens and samples the underlying DOM surfaces for legible label tones and denser material over rows. The optional inline SVG displacement filter uses a locally generated edge map; unsupported rendering falls back to regular blur, then an opaque surface when blur is unavailable.
- `appleGlassPreferences()` combines device-local display overrides with system media preferences before first paint and at runtime. Reduce transparency and Increase contrast disable refraction; The system reduced-motion preference disables pointer lighting, moving-lens transitions, press scaling, and scripted smooth scrolling; there is no app-level Reduce motion switch.
- The Apple backdrop is a separate fixed layer using a 24-second transform animation; content never moves with it. Visibility changes pause/resume its current phase, leaving Apple mode stops it, and system reduced motion or forced colours disable it.
- The backdrop uses both colours of the selected accent preset before first paint and at runtime. Reduce transparency and Increase contrast restore opaque panels; switching skins removes Apple-only backdrop properties.
- Scroll-edge decoration never receives pointer events. Keep the Apple body on `overflow-x:clip` so its sticky glass header remains attached to the viewport, and preserve navigation clearance from `--mx-nav-height` and safe-area insets.

## Top tab

- Period is user-selectable (`This week` / `7 days` / `Month` / `All time`), persisted in `settings.topPeriod` and validated against `TOP_PERIODS` via `getTopPeriod()`.
- Bounds come from `getPeriodBounds(period)` / `getPrevPeriodBounds(period)`; `start` is `null` for `all` (no previous period ⇒ trends, deltas and the "Fell out" section are hidden).
- `week` is calendar via `getWeekBounds`, respecting Week starts on; `rolling7` is the trailing 7 days. Stats This Week Review uses the same calendar week and compares against the full previous calendar week. The separate Last 7 Days card remains rolling.
- `renderTop()` owns the whole panel: the period selector is static markup (`#top-periods`), but the summary (`#top-summary`), list (`#top-list`) and fell-out block (`#top-fellout`) are rebuilt on every render. Shared helpers: `topDeltaHtml`, `championStreak`, `topPeriodBuckets`, `sparkBarsHtml`.

## Workflow conventions

- This repo is served via GitHub Pages under `/PlayDex/`; asset links are relative so they work at any subpath.

## Legacy content compatibility

- DLC support is removed. Games own sessions directly, with optional playthroughId. Do not recreate child libraries, segment editors, content choosers, or split-time displays.
- validateLegacyContentData validates older fields before stripLegacyContent removes DLC metadata and segments. Keep recorded durationMs, timestamps, pauses, IDs, sync flags and run assignments unchanged. Current sessions never generate segments.
- Startup conversion saves an exportable pre-conversion copy and uses persistLibraryReplacement for an atomic replacement. Failed conversion blocks editing and preserves the original records. Older imports/downloads/restores convert through validateBackupData; never reintroduce removed fields.
- Game HLTB is reference-only: display saved hours without progress or subtraction. Only playthrough HLTB uses run-assigned recorded time and its own previously played hours. Preserve legacy game beatAlreadyPlayedHours in storage but do not edit or calculate from it. Game tracked milestones use recordedSessionMs/contentMs game totals. Run content.base remains the stored representation for playthrough objectives and HLTB compatibility.

## Personal milestone progression

- Milestones belong to games or their playthroughs. Missing type migrates to manual; manualDone stores intent separately from completedAt. Preserve IDs, creation timestamps, and valid completion dates.
- Reuse milestoneProgress and reconcileMilestoneLibrary for completion, dependencies, and reopening. saveGames/saveSessions reconcile before writing; session saves roll back both records on failure. Never trigger recursive saves from reconciliation.
- milestoneTrackedMs uses recorded game time and clips session intervals and overlapping pauses for since-creation goals. Running sessions are provisional and must not save completion. HLTB already-played hours do not count.
- Today groups eligible dated objectives by trimmed, whitespace-normalized, case-insensitive name for display only. Multiple appears after the name, followed by the expand arrow, with game/run names in its hover title; expandable members retain their own links, dates and blocking state. Use the earliest target for summary ordering and never merge stored milestone records.
- Milestones render as one ordered list without group controls. Legacy group fields may remain in stored records; do not reintroduce the removed group feature. Prerequisites stay within one game or playthrough; validateMilestoneRecords rejects cycles and invalid progress before imports.
- Personal milestone More → Move to playthrough moves an entire connected prerequisite/dependent component into an open run of the same game after preview. Preserve milestone/checklist IDs, entered progress and dates; append in source order, retain an existing destination pin, and reconcile against run-assigned sessions. Use prepareMilestoneMove on clones and d2SaveLibrary for one atomic write; never move session assignments or leave cross-scope prerequisites.
- settings.milestoneTemplates sync through Dropbox and are restored by JSON import without replacing other local preferences. Template application remaps milestone/checklist IDs and dependencies and resets manual progress, pins, and dates.
- Optional milestone estimateSource selects mainStory, mainExtra, or hours. Explicit HLTB choices override retained custom hours and never silently fall back to another track; missing values preserve legacy behavior. Tracked-playtime milestones always use their own target. Preserve the field through templates, general assignment, playthroughs and backups.

## Weekly rotation reset

- Optional settings.weeklyRotationPriorities maps game IDs to booleans; draft/preset/history/snapshot maps use priorities. Missing flags mean normal priority. Keep draft row order stable, sort high-priority entries first on Today and alphabetically within each priority level, and preserve flags through reset snapshots, reuse, sync and backups.

- weeklyRotationWeek and weeklyRotationWeekStartsOn tag the current plan. rollWeeklyRotation clears games, targets, days, run selections, and priorities on a new calendar week and keeps weeklyRotationLastWeek as a synced snapshot. First-upgrade data adopts the current week without discarding selections.
- ensureRotationWeek guards rendering, settings saves, midnight, and resume. When Week starts on changes, rebase the plan's original week using the optional synced weeklyRotationWeekAnchor before testing for rollover; preserve same-week plans, reset across a newly elapsed boundary, and never clear a plan because the device clock moved backward.
- Load last week populates the rotation editor only, skips unavailable content, and retains Save rotation budget checks. Check the editor week before saving so a draft from an expired week cannot silently repopulate a reset rotation.

- Optional settings.weeklyRotationPlaythroughs maps game IDs to parent playthrough IDs. Drafts, presets, weekly snapshots and history use optional playthroughs maps. Missing selection means combined progress; selected runs scope rotation sessions, HLTB and milestones through rotationRunMatches/rotationContentData. Preserve these maps through sync, imports, resets and reuse; never silently start a different run if a selection becomes unavailable.

- Saving Weekly rotation requires every selected game target to be 1 to 168 whole hours. New/re-added entries may start at 0 in the draft but cannot save until corrected; weekday rest days may remain 0. Keep older zero-target backups readable.

- Optional game.defaultPlaythroughId points to one open parent playthrough. Use defaultPlaythrough for new-session and eligible planner-draft preselection; preserve explicit session edits and rotation selections. Clear the preference when its run is finished or removed, and preserve it through normalization and backups.

- rotationOpenRunMilestonesHtml renders open-run milestone estimates for Any and specific open selections. Any uses a collapsed per-run HLTB breakdown and always-visible milestone calculations; unavailable, finished or archived contexts return empty. Keep each run's progress scoped to its own sessions. Other-run projections add the selected run's remaining HLTB to the milestone's configured own remaining time, show both parts, and count the same run once. Avoid duplicate dated objectives and evaluate prerequisites against the full scope. Any sums open-run HLTB without a game-level fallback, retaining game-level dated objectives. Game HLTB-based milestones instruct users to move them to a playthrough; custom-hours and tracked-time estimates remain supported. Session-finish HLTB is shown only for an assigned run.
- Weekly rotation drafts preserve valid saved open runs. Empty, missing or unavailable selections use the default open run or alphabetically first open run. Old combined selections remain readable but are resolved only in drafts until Save plan; reuse follows the same rule.

- Today hides entries once their weekly target is reached and respects planned-day visibility. The editor keeps reached entries visible with Target reached. Remaining game hours are floored for display; exact minutes still drive validation. Missing/zero hours are explained in a themed popup on Save plan.

## Backup replacement safety

- Use persistLibraryReplacement for JSON imports, game deletion and Undo, and Dropbox download/rollback application. Prepare and reconcile cloned data first, restore successful storage writes on failure, and replace games/sessions/settings/activeSession only after all records are saved. Keep failed manual imports available for retry.
- Top rolling-day ranges use local calendar date arithmetic (setDate), not fixed 24-hour offsets, so DST does not change the number of included dates.

- Cover uploads use editor revision guards and capture their original game identity. Ignore canceled/superseded callbacks, keep Save disabled during image processing, and re-enable it when decoding fails. URL fields preserve quotes; escape at rendering instead of stripping URL characters.

## Dropbox change detection

- dbxSnapshot canonicalizes object keys and excludes device-only Theme, Interface, and Theme Colour settings. Persist only the SHA-256 synced fingerprint and its Dropbox revision, not another full local data copy.
- Await dbxMarkSynced with the exact uploaded/downloaded snapshot. Never mark later local edits as uploaded; keep them dirty and queued. No-op checks must preserve the last-sync timestamp and avoid file/history writes.
- scheduleAutoUpload compares against the known synced revision before scheduling a transfer, ignores obsolete async hash results, and cancels queued work when changes are reverted. Preserve remote revision/conflict checks for genuine changes.

## Playthroughs, planner, and sync review

- Parent games own optional playthroughs; sessions keep an optional playthroughId. Run content stores independent game milestones and HLTB values. Reconcile each run using only its assigned sessions; lifetime rankings and counts stay combined. Legacy sessions remain unassigned.
- plannerDayBudgets/plannerDayHours set planned weekday hours and Today's goal, never Weekly capacity. Weekly capacity comes from the saved daily goal times seven or the automatic last-week average times seven; the sum of weekday hours drives Planned targets when weekday planning is enabled. Validate weekday allocations and game commitments separately against that fixed budget, without adding them together or disabling automatic goals on save. Zero-hour days are rest days. rotationPresets and weeklyPlanHistory sync as shared settings; validate them on import and restore. Keep planner drafts separate until Save plan.
- The Sync & Recovery Centre uses real Dropbox requests and strict revision updates. playdex.dropbox.record-index stores per-record hashes and the synced revision, never a full baseline library. Unknown baselines require explicit choices for differing records.
- Keep automatic uploads paused while reviewing sync conflicts. Recheck local state, connection and remote revision before applying; preserve later local edits, take a recovery copy first, and retain the previous five remote versions. Device identity is local metadata and accompanies uploads.

- Keep feature UI contextual: playthroughs render inline in the game dashboard, one Plan week action opens the Weekly rotation editor, and sync/recovery renders inside Dropbox settings. Do not reintroduce a shared feature hub or Games shortcuts.
- UI state is independent for playthrough selection, planner drafts, sync review and focused editors. Opening Settings must not fetch Dropbox; pause automatic transfers only for explicit review/restore and release the guard on cancel, success or navigation away during loading.

## In-page section navigation

- The left section rail (1024px and above) and compact Sections menu navigate within the visible page, never between tabs. Keep the existing bottom tab bar.
- Collect visible card/category headings, including Sessions when merged with Today. Use stable semantic destination keys across rerenders, omit hidden sections, and preserve menu focus and scroll position.
- Reserve 72px on desktop only while section navigation is present. Measure the sticky header for section-jump offsets, keep mobile menus above bottom navigation, and respect system reduced motion.
- Section navigation icons must be unique within the current page, including merged Today/Sessions. Use the dedicated section icon catalog and its unused-icon fallback.

## Release notes

- Settings → Data → About PlayDex opens the latest release or full changelog in the shared changelog viewer. Render release text as text nodes and restore focus to the triggering control when closing.
- Cache changelog.txt in APP_SHELL. The update popup must obtain pending-release notes from that worker's PLAYDEX_CHANGELOG message, never from the approved old cache or an unrelated network release. Viewing notes must not approve or install an update.

- Weekly rotation picker no longer offers Any playthrough. normalizePlannerRuns resolves missing, empty or unavailable draft selections to a valid saved run, default open run, then alphabetically first open run. Resolve current plans, reuse and added games in the draft only; commit on Save plan. With no open runs omit the assignment and show no editable run picker. Keep old combined maps readable.

- startGame resolves omitted/empty run choices to the default open playthrough or alphabetically first open run via rotationPreferredRun. Preserve explicit valid run choices and reject invalid explicit IDs. Do not restore a start-session Unassigned picker; games without open runs remain lifetime-only and historical session editors retain unassigned corrections.
