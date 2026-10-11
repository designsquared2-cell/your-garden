# 🌱 Garden — Bed Planner

A phone-first planner for three raised beds in the Perth Hills: what's planted where, what needs doing this month, when to water, and what to plant next.

## Run it

No build step. Serve the folder and open it:

```
python -m http.server 8080
```

Then visit http://localhost:8080. (Opening `index.html` straight from disk also works, minus offline support.)

## Layout

| File | What it holds |
|---|---|
| `index.html` | Page skeleton |
| `css/styles.css` | All styles |
| `js/data.js` | Plant library (`P`), sowing months & days-to-harvest (`TIMING`), families, seasonal stories. No preloaded garden — a fresh install starts with no beds |
| `js/state.js` | Saved state (localStorage key `gdn_v4`), migration, undo, cell & plant helpers |
| `js/ui.js` | Sheet, toast (with Undo), confetti, tab switching |
| `js/weather.js` | Open-Meteo forecast, watering verdict, location search |
| `js/tasks.js` | One task list feeding **Needs attention** and **This Month**, generated from the beds, plant timing and weather |
| `js/plants-view.js` | Plants tab, bed-aware suggestions, harvest log |
| `js/beds.js` | Bed grid, add/edit/resize beds, select mode, drag & drop, plant sheet, picker, custom plants |
| `js/settings.js` | Location, backup export/import, start fresh |
| `js/main.js` | Startup, service worker |
| `sw.js`, `manifest.webmanifest`, `icons/` | Offline support and home-screen install |

Scripts are plain `<script>` tags loaded in order (see the bottom of `index.html`), sharing globals.

## Editing plant data

Add a plant to `P` in `js/data.js`, list it in one of `COOL_VEG` / `WARM_VEG` / `HERBS` / `COMPANIONS`, and give it a `TIMING` entry (`sow` months, `days` to first harvest, `pick: true` if it keeps producing). Plants added in the app itself are stored per device in `customPlants`.

## Data

Everything is saved in the browser on each device. Use **Settings → Backup → Export** to keep a copy or move to another phone.

When changing app files, bump `CACHE` in `sw.js` so installed copies pick up the update offline.
