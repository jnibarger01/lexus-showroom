# Lineup still images

Original placeholder stills for the ES / NX / RX / LX cards. These are
**not** official Lexus photography — silhouettes and gradient cards generated
for this demo so GitHub Pages stays light and license-clean.

## Naming

| File | Vehicle | Intrinsic size | Role |
| ---- | ------- | -------------- | ---- |
| `es.svg` | Lexus ES | 640×356 | 1x / default `src` |
| `es@2x.svg` | Lexus ES | 1280×712 | 2x density (`srcset`) |
| `nx.svg` / `nx@2x.svg` | Lexus NX | same | same |
| `rx.svg` / `rx@2x.svg` | Lexus RX | same | same |
| `lx.svg` / `lx@2x.svg` | Lexus LX | same | same |

Runtime URLs use `import.meta.env.BASE_URL` (see `src/data/vehicles.ts`):

- `{BASE_URL}stills/{id}.svg`
- `{BASE_URL}stills/{id}@2x.svg`

On GitHub Pages that is `/lexus-showroom/stills/…`.

## Size budgets (Pages)

| Asset | Budget | Notes |
| ----- | ------ | ----- |
| Per-model 1x still | ≤ 25 KB | SVG placeholders today are ~1.7 KB each |
| Per-model 2x still | ≤ 50 KB | SVG placeholders today are ~1.7 KB each |
| Total lineup stills | ≤ 200 KB | Eight files for four models |

Prefer SVG or compressed WebP/PNG when replacing placeholders. Avoid shipping
uncompressed multi‑MB photos to Pages.

## Wiring

`CarCard` renders:

```html
<img
  src="…/stills/es.svg"
  srcset="…/stills/es.svg 1x, …/stills/es@2x.svg 2x"
  alt="Lexus ES"
/>
```

Alt text comes from `vehicle.name`. On load error the card swaps to a labeled
fallback (`{name} — image unavailable`) so a broken URL never silently blanks.

The marketing `Hero` keeps its decorative inline SVG (not a per-model still);
per-model stills are the lineup cards only. Distinct from GLB wiring (#3) and
lazy 3D (#9).

## Replacing assets

1. Drop licensed or original art as `{id}.svg` / `{id}@2x.svg` (or update
   `VEHICLE_STILL_FILES` if you switch to WebP/PNG).
2. Keep filenames or update `src/data/vehicles.ts`.
3. Recheck byte sizes against the table above and note before/after in the PR.
