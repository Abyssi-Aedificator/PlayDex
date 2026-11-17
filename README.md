# PlayDex

A lightweight, installable web app that tracks your game sessions, playtime by game, and daily playtime goals. Everything runs locally in your browser as a single file, with optional Dropbox backup.

![PlayDex icon](icon-512.png)

## Features

- **Track sessions** – start/stop with live elapsed time, pause/resume, and an optional time target (notifies when reached).
- **Session log** – review, edit, sync-flag, and delete sessions; set a platform per session, filter by game and date range, and export matching sessions; overlap warnings help catch conflicting times; the running session shows in the tab title.
- **Playtime stats** – last 7 / last 30 days charts, playtime by platform, a this-week review, side-by-side game comparisons, and monthly/yearly gaming recaps.
- **Daily goal & quests** – daily playtime goal, daily/weekly quests, and play-streaks with earned streak freezes.
- **Play suggestions & rotation** - find games for the time you have using typical session lengths; choose any number of weekly focus games and track which you have played.
- **Game library** – add, edit, archive, pin, and search games; see how long ago each was last played.
- **Top insights** - rank games by period or custom dates, with biggest movers, a cover-art podium, most consistent games, new discoveries, and playtime distribution; optionally include archived games.
- **Player profile & badges** – achievements and levels, milestones, a time-of-day heatmap, and a cumulative playtime curve.
- **Backup & export** – JSON export/import and CSV export, plus optional Dropbox sync across devices with the five previous changes and rollback from Settings.
- **Installable PWA** – works offline; install it as a standalone app on desktop or mobile.
- **Themes & interfaces** – dark / light (follows your system) with accent-colour choices, and a choice of Classic, Google Material 3 Expressive, or an Apple-inspired Liquid Glass interface with grouped surfaces, adaptive translucent navigation, and accessibility display options.

The Liquid Glass interface follows [Apple's Liquid Glass material guidance](https://developer.apple.com/design/human-interface-guidelines/materials): stronger optical glass effects belong to navigation and temporary controls, while content panels use a softer translucent material over a Theme Colour background. It follows supported system display preferences and offers additional Reduce transparency and Increase contrast controls. Increased contrast follows the chosen Theme Colour, while reduced-motion support follows the system preference automatically. The theme-coloured backdrop drifts gently while the app is visible and stays static when the system requests reduced motion. This is a browser implementation with progressive blur and edge-refraction effects; Apple's native platform renderer is not part of this PWA.

DLCs can be added from a game's dashboard. Each has its own cover, HLTB estimates, milestones, and rotation target. Switch content during play to split one session into Base game and DLC time. Parent rankings include all content, while HLTB and rotation targets track each content item separately. Session editors include chronological content allocation, and deleting a DLC can move its tracked time back to Base game.

Personal milestones support manual objectives, checklists, counters, and recorded-playtime goals for each Base game or DLC. Use Advanced options for prerequisites, target dates, and a pinned objective. Milestones use one ordered list without groups. Progress updates can reopen dependent milestones after corrections. Save milestone sets as templates to reuse them with fresh checklists and counts; templates are included in Dropbox sync and JSON backups.

Weekly rotations start empty each calendar week, following Week starts on. Choose games, then use Load last week to reuse the previous week's games, DLCs, targets, and planned days. Review the loaded plan and save it within the current weekly budget; archived and deleted content is skipped.




Open a game dashboard from Games to use its Playthroughs section below HLTB and Personal milestones. DLC dashboards show the same parent playthroughs with DLC-specific progress. Create named runs, assign existing sessions without changing their totals, and track independent Base game and DLC objectives and HLTB progress. A new run starts with fresh milestone progress; unassigned history and lifetime statistics remain intact. Run completions also count toward personal-milestone badges.

Use Plan week on Today's rotation card to open the single Weekly rotation editor. Enable weekday planning to distribute your fixed weekly goal across the week. Changing a weekday's hours changes the Weekday plan allocation, while Weekly capacity remains the saved daily goal times seven (or the automatic last-week average times seven). Today's goal follows its planned hours. Weekday planning and game targets are checked separately against the same weekly limit, and automatic-goal preferences are preserved. Zero-hour days are rest days and do not break goal streaks. Choose planned days in each game row, review unfinished-target moves, save named presets, and compare last week's plan with actual playtime. Changes remain drafts until saved; Cancel, Escape and backdrop dismissal confirm before discarding edits. Load last week restores available games, targets and planned days without replacing weekday planned hours.

Sync and recovery are integrated into Settings > Dropbox, below the connection controls. Refresh and review actions load cloud data; opening Settings alone does not. It reads the live Dropbox revision, compares individual games, sessions and shared settings, and asks you to resolve competing changes before applying them. Restoring a saved version creates a new Dropbox revision and first saves local recovery data. Device names identify uploads; appearance preferences stay local. Automatic transfers pause during an active review or restore, and resume after it closes. The session's Synced flag is a separate manual status. No second full library is stored for change detection: only record fingerprints are persisted.

## Getting started

PlayDex is a static, self-contained app. No build step or server is required to develop it.

### Run locally

Open `index.html` directly in a browser, or serve the folder with any static server:

```bash
# Python
python -m http.server 8080

# or Node
npx serve .
```

Then visit `http://localhost:8080`.

> Data is stored in your browser's `localStorage`. To keep it across devices, enable Dropbox sync.

### PWA install

Because it's a PWA, PlayDex needs to be served over **HTTPS** (or `localhost`) for installation and the service worker to work.

- Desktop (Chrome/Edge): open the app, then click **Install app** in the header (or use the browser's install icon in the address bar).
- Mobile (iOS): open the app in Safari → **Share** → **Add to Home Screen**.
- Mobile (Android): open the app in Chrome → **Install app** (or the browser menu → *Add to Home screen*).

## Project structure

```
PlayDex/
├── index.html              # The whole app (HTML, CSS, and JS)
├── manifest.webmanifest    # PWA manifest (name, icons, display mode)
├── sw.js                   # Service worker (offline app shell + caching)
├── icon-192.png            # Install icon (192px)
├── icon-512.png            # Install icon (512px)
├── apple-touch-icon.png    # iOS home-screen icon
└── README.md
```

## Dropbox sync

The sync features need HTTPS (or `localhost`). To connect your own Dropbox account:

1. Create a Dropbox app in the [App Console](https://www.dropbox.com/developers/apps) (permission type: *App folder*).
2. Register the exact URL of this page as a **Redirect URI** for your app.
3. Enter your app key in PlayDex → **Dropbox Sync** → connect.

Your data is sent directly from your browser to Dropbox — nothing is stored on a server. For more detail, open **Dropbox Sync** inside the app.

## License

This project is for personal/portfolio use. No warranty is provided.

Weekly rotation uses a game-first list: Add games supports search and multiple selection, then set optional whole-hour targets and planned days without changing row order. Load last week keeps current weekday hours; More actions holds presets and previous-week reviews. Opening Weekday targets enables optional daily goals; Use daily goal instead turns weekday planning off. Game targets and weekday hours each have their own remaining allocation against the same fixed weekly capacity; these totals are never added together. Cancel, Escape, or dismissing the dialog confirms before discarding edits.

Stats includes a 12-calendar-week playtime trend following Week starts on. Zero-play weeks remain visible, and the current week is marked So far; only completed recorded sessions count.

Base game vs DLC in Stats shows lifetime recorded content allocations with a per-game breakdown. Mixed sessions keep one session count; HLTB previously played hours are excluded.

Gaming consistency lets you choose a month. Days played require completed active playtime; the average divides recorded playtime by active days. The current month counts days only through today, while historical months count every calendar day.

Milestone progress in Stats combines lifetime and playthrough objectives for active Base games and DLCs. Archived games and DLCs are excluded from shared milestone summaries and reminders; their saved milestones remain in individual dashboards. Blocked and overdue counts are subsets of unfinished objectives. Upcoming/overdue links open the matching dashboard and playthrough.

Playthrough comparison in Stats compares runs of a selected game, including archived games. Run names open the dashboard with that run selected. Totals combine Base game and DLC recorded sessions, exclude running/unassigned sessions and HLTB previously played hours, and mark unfinished runs as In progress.

Today shows unfinished milestone targets in date order, with days left, Due today, or overdue days. Click an objective to open its Base game, DLC or playthrough dashboard. The card is hidden when there are no eligible targets. Settings > Session tracking > Personal milestones controls visibility; it is enabled by default and syncs with shared settings. Archived content and finished playthroughs are excluded from Today.

Weekly rotation shows estimated calendar days needed for dated Base game/DLC milestones: remaining hours divided by allocated weekly hours, multiplied by seven and rounded up. This assumes an even pace across the week. The projected completion date adds those days to today and indicates whether it is before, on or after the target date; it is an estimate, not a scheduled or automatic completion. Manual, checklist and counter milestones use their editable Hours remaining estimate. Tracked-playtime milestones derive remaining hours from recorded progress, including provisional live progress in Today. An unset target or missing estimate is labelled; milestone completion stays unchanged.


Settings > Session tracking > Personal milestones includes Ask about milestone completion after sessions (enabled by default and synced). Session saved lets you mark manual objectives, update checklist steps or save counter progress for the played content/playthrough. Prerequisites still control completion; tracked-playtime milestones remain automatic. Done skips without changing milestones. Turning the option off leaves the existing read-only milestone summary.

Profile includes a Completion timeline for completed personal milestones across active Base games, DLCs and playthroughs. It uses saved completion dates, newest first, with five initial entries and Show more. DLC artwork falls back to its parent cover, and missing/broken art uses the existing placeholder. Entries open the matching completed objective in its dashboard; reopening an objective removes it from the timeline. Archived content is excluded without deleting milestone history.

For dated manual/checklist/counter milestones without Hours remaining, rotation estimates fall back to remaining Main Story HLTB time (or Main + Extra if Main Story is unset). The HLTB source is labelled and includes the content-specific tracked/prior time shown in the HLTB row. Enter Hours remaining to override this fallback for a specific objective. HLTB never marks a milestone complete.

HLTB remaining time in rotation entries is followed by separate Main Story and Main + Extra completion projections at the allocated weekly hours. These update while editing a plan and during play, assume an even weekly pace, and never mark content complete. Dated milestones appear beneath these projections; milestones using HLTB as their estimate show their target separately without repeating the HLTB projection.

General milestones in Games keep unassigned objectives with optional target dates. Use Assign to move an objective into an active game or DLC without losing its ID, creation time, or target date. Assigned objectives use the full Personal milestones editor. Unassigned objectives do not count toward game progress or completion badges. General milestones are shared settings included in Dropbox sync and JSON backups.

Page sections: on screens at least 1024px wide, the left icon rail jumps to visible features on the current page. Hover or focus an icon for its name. Smaller screens show a Sections button beneath the header, opening the same destinations with labels. The current section is highlighted as you scroll, and the bottom tabs continue switching pages. Section jumps follow your system reduced-motion preference.

Weekly rotation playthroughs: when a game has playthroughs, each Base game or DLC row in Plan week offers a Playthrough selector. Any playthrough preserves combined progress. Choosing an open run limits the entry's weekly progress, HLTB projections and milestone details to that run, and Start launches the selected content in that run. Targets still share the same weekly budget. Selections are saved with the plan and its presets, sync through Dropbox, and are retained by Load last week. Finished or removed selections require choosing an available run or Any playthrough before starting or saving.

Milestone target-date estimates: choose Estimate completion using in a milestone editor to use Main Story (HLTB), Main + Extra (HLTB), or Custom hours remaining. General milestones can choose their HLTB basis before assignment. The deadline stays unchanged. In Weekly rotation, projections and before/after-target status use the selected estimate and weekly allocation. Explicit HLTB choices do not fall back to another track when its estimate is unavailable. Tracked-playtime milestones always use their own progress and target. Existing milestones retain their previous estimate behavior until edited. The selected basis carries through templates, JSON backups and Dropbox sync.

Weekly rotation priority: use the star beside Remove in Plan week to mark a Base game or DLC as High priority. Changes stay in the draft until Save plan. High-priority entries appear first on Today with a text badge; planner rows retain their editing order, and priority never changes targets, planned-day visibility or budget allocations. Priorities are saved with presets and previous-week plans and included in Dropbox sync and JSON backups. Removing an entry resets its priority.
