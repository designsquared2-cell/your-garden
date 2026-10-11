# 🌱 Garden — Bed Planner

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
| 📅 This Month | What's in the beds |
| 🌱 Plants | Plant information — plant now, what you're growing, the plant library |
| 🐛 Pests | "What are you seeing?" finder, this month's pests, the full guide |

Keep new features in the tab they belong to: anything you tick off goes in Jobs.

## Layout

| File | What it holds |
|---|---|
| `index.html` | Page skeleton |
| `css/styles.css` | All styles |
| `js/data.js` | Plant library (`P`), sowing months & days-to-harvest (`TIMING`), families, seasonal stories. No preloaded garden — a fresh install starts with no beds |
| `js/state.js` | Saved state (localStorage key `gdn_v4`), migration, undo, cell & plant helpers |
| `js/ui.js` | Sheet, toast (with Undo), confetti, tab switching |
| `js/weather.js` | Open-Meteo forecast, watering verdict, location search |
| `js/pests.js` | Pest library (`PESTS`), beginner symptoms (`SYMPTOMS`) and which pests they point to (`PEST_ID`), pest-check and treatment jobs, Pests tab |
| `js/tasks.js` | Jobs tab, generated from the beds, plant timing, pests and weather; urgent count for the header and tab badge |
| `js/month.js` | This Month: what's in the beds |
| `js/plants-view.js` | Plants tab, plant library and info sheet, bed-aware suggestions |
| `js/beds.js` | Beds summary, bed grid, add/edit/resize beds, select mode, drag & drop, plant sheet, picker, custom plants |
| `js/settings.js` | Location, backup export/import, start fresh |
| `js/main.js` | Startup, service worker |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline support and home-screen install |

Scripts are plain `<script>` tags loaded in order (see the bottom of `index.html`), sharing globals.

## Editing plant data

Add a plant to `P` in `js/data.js`, list it in one of `COOL_VEG` / `WARM_VEG` / `HERBS` / `COMPANIONS`, and give it a `TIMING` entry (`sow` months, `days` to first harvest, `pick: true` if it keeps producing). Plants added in the app itself are stored per device in `customPlants`.

## Data

Everything is saved in the browser on each device. Use **Settings → Backup → Export** to keep a copy or move to another phone.

When changing app files, bump `CACHE` in `sw.js` so installed copies pick up the update offline.
