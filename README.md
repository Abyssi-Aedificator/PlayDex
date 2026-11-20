# PlayDex

![PlayDex icon](icon-192.png)

PlayDex is an installable game-session tracker that runs in your browser. Track active playtime, plan your week, and follow personal milestones and playthroughs. Your library stays in local browser storage, with optional Dropbox sync and JSON backups.

## Getting started

Open `index.html` directly for basic local use, or serve the app over localhost for service-worker, installation, and Dropbox features. From the PlayDex folder, run:

```sh
python -m http.server 8080 --bind 127.0.0.1 --directory ..
```

Visit **http://localhost:8080/PlayDex/**. Keeping the `/PlayDex/` path matches the app's PWA identity and GitHub Pages deployment. There is no build step, package installation, or backend server.

Browser storage belongs to the browser profile and origin you use. Export a backup before switching browsers, moving the app, or clearing site data.

## Games and sessions

- Add games with optional artwork, tags, and a platform. Pin, search, filter, archive, or restore them from Games. Platform statistics use the game's assigned platform.
- Start a session with an optional time target, pause and resume it, then stop to review active time, paused time, daily totals, HLTB progress, and pending milestones.
- Add or correct sessions manually. Unchanged timing preserves the recorded duration; changed timing accounts for saved pauses. Overlap warnings help identify conflicting sessions.
- Use Sessions to filter history, edit or delete entries, and export matching rows. A session's **Synced** flag is a manual status, separate from Dropbox synchronization.
- Settings includes **Check session history** for overlaps, sessions under five active minutes, unusually long sessions, and missing game references. Review, edit, reassign, or delete flagged sessions; nothing is changed automatically.

The Games tab includes a **Playthroughs** filter for games with runs, without runs, with open runs, or with finished runs. It combines with other filters and supports removable filter chips and Clear filters. Games without runs also show a **No playthrough** badge. Platform badges appear only as **No platform** when a platform is missing.

### HLTB and playthroughs

Store **Main Story** and **Main + Extra** reference hours in a game's HLTB section. This card has no progress calculation. Games can also be marked as not requiring HLTB or having no available estimate. HLTB progress belongs only to playthroughs: each run combines its assigned recorded time with its own previously played hours. Statistics and tracked-playtime milestones exclude previously played hours. New playthroughs can copy the game's reference estimates; existing runs remain independent.

Create named playthroughs from the game's dashboard. Each run has independent HLTB and milestone progress, while lifetime totals continue to include all sessions. Assign older sessions to a run, compare runs, or finish and reopen them through **Run actions**. Unassigned sessions remain part of lifetime history.

Use **Run actions → Set as default** to preselect an open run for new sessions. **Clear default** removes the preference; finishing or removing the run clears it automatically. Editing an existing session preserves its assignment.

## Weekly rotation

Open **Plan week** from **This week's rotation** on Today:

1. Use the alphabetical **Add games** picker to select games individually or select all available games.
2. Give each selected game a target of **1 to 168 whole hours** within the weekly budget. New and re-added entries start at 0 and cannot be saved until a positive target is set.
3. Optionally choose a planned day, mark high priority with the star, or select a playthrough.
4. Review the budget and choose **Save plan**. Cancel, Escape, and backdrop dismissal ask before discarding changed drafts.

Weekly rotation requires a specific run when open playthroughs exist. Valid saved selections remain; otherwise it chooses the default open run or the alphabetically first open run. The picker has no Any playthrough option. Changes from older combined selections stay in the planner draft until Save plan. Games without open runs remain usable without a run assignment. Other-run milestone projections retain their existing combined calculations. Presets and Load last week use the same selection rules.

The weekly capacity comes from the daily goal times seven, or the automatic average from the previous calendar week times seven. **Game targets** and optional **Weekday targets** are independent allocations against that capacity; they are never added together. Zero-hour weekdays are rest days. Remaining game time is displayed as complete hours, rounded down; less than one hour shows 0h and 0% remaining. Budget validation still uses exact values.

Today lists high-priority games first, alphabetically within each priority level. A game assigned to a specific day appears only on that day, although all sessions in the week count toward its target. Games disappear from Today's rotation once their targets are reached; the editor keeps them visible with **Target reached**. Rotation games are excluded from **Start a Game**.

Plans reset to empty at the start of the calendar week selected in **Week starts on**. **Load last week** copies available games, targets, days, and run choices into the draft while retaining current weekday hours. **More actions** includes presets, previous-week comparisons, and unfinished-target reviews. Archived or unavailable games are skipped when reusing a plan.

Rotation HLTB estimates use playthroughs only. Any playthrough sums remaining estimates across open runs; games without runs have no HLTB completion projection. Where run estimates are available, entries show remaining time and completion projections at the allocated weekly hours. HLTB milestones in the selected playthrough show the target date, before/on/after-target status and HLTB source without repeating the completion projection. Other-run and combined milestone projections retain their detailed calculations. Projections assume an even weekly pace and never complete objectives automatically.

## Personal milestones

Milestones support four progress types:

| Type | How progress is recorded |
|------|--------------------------|
| Manual | Mark the objective done |
| Checklist | Complete named steps |
| Counter | Update a whole-number count toward a target |
| Tracked playtime | Accumulate recorded hours, either total time or time since creation |

Use prerequisites, optional target dates, and manual ordering. Pin a game milestone to show it during play and in rotation. Progress can be updated while prerequisites are incomplete, but completion waits for them. Corrections can reopen objectives and their dependents. Milestones use a single ordered list without groups.

Choose **Estimate completion using** to base a dated objective on Main Story HLTB, Main + Extra HLTB, or custom hours remaining. HLTB-based game milestones must be moved to a playthrough to calculate completion; custom-hours and tracked-time estimates remain available at game level. Explicit HLTB choices do not fall back to another track when unavailable. Older objectives retain their existing fallback behavior until edited; tracked-playtime milestones use their own remaining target.

Save milestone sets as templates, preview and apply independent copies, or delete unused templates. Applied templates start with fresh progress and remapped prerequisite links.

To move an existing game objective into a run, open its **More → Move to playthrough** action and choose an open playthrough of the same game. The confirmation lists any prerequisites and dependent milestones that must move together. Entered progress, IDs, creation dates, and target dates are retained; sessions do not move. Tracked-playtime goals recalculate using the destination run and may reopen. An existing playthrough pin takes precedence over a moved pin.

**General milestones**, at the bottom of Games, hold unassigned objectives with optional target dates. **Assign** moves one to an active game without losing its identity or dates. Unassigned objectives do not count toward completion badges.

Today's **Milestone targets** lists unfinished dated objectives in target-date order with time left or overdue status. Matching names share one row with a **Multiple** label after the name, followed by the expand arrow; hover it for the linked game/run names, or expand the row to open each target. The summary uses the earliest date when targets differ. It is hidden during a running session and excludes archived games and finished playthroughs. Settings → Session tracking → Personal milestones controls its visibility and the optional completion prompts in **Session saved**. Profile's **Completion timeline** shows recently completed objectives with dates and artwork.

## Stats, Top, and Profile

Stats includes recent daily playtime, a twelve-month playtime chart, session-length ranges, a twelve-week trend, monthly gaming consistency, platform totals, milestone progress, playthrough comparisons, game comparisons, and month/year recaps. Charts use recorded active duration and exclude running sessions. Calendar activity is grouped by each session's local start date; calendar-week views follow **Week starts on**.

Top supports **This week**, **7 days**, **Month**, and **All time**, with rankings, trends, most consistent games, and distribution insights. Profile brings together personal records, favorite-game information, completion history, badges, quests, and earned levels.

## Dropbox, backups, and recovery

JSON export/import and CSV session export are available in Settings. Importing replaces the local library after confirmation. Keep regular exports even when using sync.

To connect Dropbox, create an app with **App folder** access in the [Dropbox App Console](https://www.dropbox.com/developers/apps), register the app's exact URL as a redirect URI, then enter the app key in Settings → Dropbox. Use HTTPS or localhost. Requests go directly from the browser to Dropbox.

**Review changes** compares local and remote game, session, and shared-setting records. **Preview download** and version-history previews show replacements before applying them. Competing edits require explicit choices. Opening Settings alone does not fetch remote data, and unchanged uploads do not rewrite the backup or its history.

The five previous remote versions are retained. Restores first save a local recovery copy and, when connected, create a new remote revision. Automatic transfers pause during an active review or restore. Theme, interface, and accent stay on the device; a session's manual Synced flag does not control these transfers.

### Older DLC-enabled backups

DLC support has been removed. Older libraries and backups convert to ordinary game sessions while preserving recorded active durations, pauses, session IDs and counts, sync flags, and playthrough assignments. DLC details and DLC-only rotation entries are discarded. Game statistics and tracked milestones subsequently count all recorded time for the game; HLTB progress remains scoped to playthroughs.

An existing local library receives a pre-conversion recovery copy before its first upgrade. Find **Export pre-conversion copy** under Settings → Dropbox → Local recovery. Failed conversions preserve the original records and block editing until the problem is resolved.

## Appearance, navigation, and installation

Choose Classic, Material 3, or Liquid Glass, with light/dark themes and accent colours. Liquid Glass includes device-local transparency and contrast options. Motion follows the system's reduced-motion preference.

The bottom tabs switch pages. On desktop, the left section rail jumps between features within the current page; smaller screens use **Sections**. Hover or focus a section icon for its label.

Settings → Data → About PlayDex opens either the latest release notes or the full changelog in a scrollable themed dialog. Release history is cached with the app for offline access.

Serve over HTTPS or localhost to install the PWA and use offline caching. Use the header's **Install app** or the browser's install action. On iOS, use Safari → Share → Add to Home Screen. When a new worker is ready, **Update available** lets you apply it. The update popup also offers **What's new**, which reads the pending release's notes without installing it; **Update now** remains a separate action.

## Repository layout

| File | Purpose |
|------|---------|
| `index.html` | Application markup, styles, logic, and local data model |
| `sw.js` | Scoped offline cache and update handling |
| `manifest.webmanifest` | PWA identity at `/PlayDex/` |
| `icon-*.png`, `apple-touch-icon.png` | App icons |
| `assets/material/` | Bundled Material font assets |
| `changelog.txt` | Release history |
| `plan_dontwant.txt` | Rejected ideas |
| `AGENTS.md` | Contributor instructions and implementation constraints |

There is no project build, lint, or test command. See [AGENTS.md](AGENTS.md) for validation and contribution conventions, and [changelog.txt](changelog.txt) for release changes.

## License

This project is for personal/portfolio use. No warranty is provided.
