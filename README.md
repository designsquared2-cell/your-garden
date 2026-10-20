# 🌱 Your Garden

A phone-first planner for three raised beds in the Perth Hills: what's planted where, what needs doing this month, when to water, and what to plant next.

## Run it

No build step. Serve the folder and open it:

```
python -m http.server 8080
```

Then visit http://localhost:8080. (Opening `index.html` straight from disk also works, minus offline support.)

## Tabs — one job each

| Tab | Shows |
|---|---|
| 🌿 Beds | Summary (weather, counts by stage, links) and the bed layout |
| 🐝 Jobs | Every task — watering, harvests, pest checks, treatments, clearing, filling spots |
| 🧺 Harvest | What your harvests are worth, and what's ready, coming up and growing — tap a plant for tips & recipes |
| 🌱 Plants | Plant information — plant now, what you're growing, the plant library |
| 🐛 Pests | "What are you seeing?" finder, this month's pests, the full guide |

Keep new features in the tab they belong to: anything you tick off goes in Jobs.

## Layout

| File | What it holds |
|---|---|
| `index.html` | Page skeleton |
| `css/styles.css` | All styles |
| `js/data.js` | Plant library (`P`), sowing months & days-to-harvest (`TIMING`), families, seasonal stories. No preloaded garden — a fresh install starts with no beds |
| `js/state.js` | Saved state (localStorage key `gdn_v4`), migration (incl. old plant keys → crop › variety), undo, cell & plant helpers |
| `js/varieties.js` | Varieties per crop (`VARIETIES`): name, days, traits, tags, notes; your own varieties in `customVarieties` |
| `js/ui.js` | Sheet, toast (with Undo), confetti, tab switching |
| `js/weather.js` | Open-Meteo forecast, watering verdict, location search |
| `js/pests.js` | Pests + growing problems (`PESTS`, `DISORDERS`), prevention plans (`GUARDS`), remedies (`REMEDIES`: home-made / organic / native), the step-by-step finder, Pests tab |
| `js/behaviour.js` | How plants grow (`TRAITS`), crops pulled whole (`LIFTED`), spots needed, good and bad neighbours |
| `js/tasks.js` | Jobs tab, generated from the beds, plant timing, pests and weather; urgent count for the header and tab badge |
| `js/harvest.js` | Harvest tab: harvest value (`PRICE`, editable), ready / coming up / growing, "ready when" signs (`READY_SIGN`), recipe ideas (`RECIPES`), the tips & recipes sheet |
| `js/plants-view.js` | Plants tab, plant library and info sheet, bed-aware suggestions |
| `js/beds.js` | Beds summary, bed grid, add/edit/resize beds, select mode, drag & drop, plant sheet, picker, custom plants |
| `js/zones.js` | Climate zones (`ZONES`): adjusts planting months and pest seasons from the temperate/Perth data |
| `js/rotation.js` | Spacing per spot (`PER_SPOT` in data.js, bed `spot` size) and crop rotation from planting `history` |
| `js/fruit.js` | Fruit trees, berries & vines (`FRUIT`): seasons, first fruit, pruning, thinning, netting, feeding, varieties. Each type is one card (a bed with `kind:'tree'`), plus tree jobs and harvest logging by count or bowl |
| `js/crops2.js` | Extra crops testers asked for (rocket, sunflower, okra, Asian greens, Pacific staples…) and extra varieties (popcorn, daikon, wombok, runner beans, Thai basil, collards) |
| `js/feeding.js` | Feeding jobs per bed, from what's growing: leafy, fruiting, root, perennial herb and tree feeds |
| `js/seeds.js` | Seed box (`seeds`): packets, when to sow, picker and Jobs integration |
| `js/reminders.js` | Calendar reminders: exports a `.ics` file (weekly check, harvests, prevention, sowing) |
| `js/help.js` | First-time welcome (location → how hands-on → first bed), Help & tips, and Send feedback (saved to the Supabase `feedback` table — run `supabase/feedback.sql` once) |
| `js/settings.js` | Maintenance level (No / Low / Standard, saved per device as `gdn_mode`), location, backup export/import, start fresh |
| `js/main.js` | Startup, service worker |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline support and home-screen install |

Scripts are plain `<script>` tags loaded in order (see the bottom of `index.html`), sharing globals.

## Editing plant data

Add a plant to `P` in `js/data.js`, list it in one of `COOL_VEG` / `WARM_VEG` / `HERBS` / `COMPANIONS`, and give it a `TIMING` entry (`sow` months, `days` to first harvest, `pick: true` if it keeps producing). Plants added in the app itself are stored per device in `customPlants`.

## Data

Everything is saved in the browser on each device. Use **Settings → Backup → Export** to keep a copy or move to another phone.

When changing app files, bump `CACHE` in `sw.js` and the `?v=N` on every file link in `index.html`, so phones pick up the update.
