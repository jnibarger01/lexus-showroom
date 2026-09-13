# Lexus Showroom

A React + TypeScript single-page showroom site featuring the Lexus ES, NX, RX,
and LX lineup — built with Vite and Tailwind CSS.

## Stack

- [Vite](https://vitejs.dev/) — build tool and dev server
- [React](https://react.dev/) + TypeScript
- [Tailwind CSS](https://tailwindcss.com/) — styling

## Project structure

```
src/
  components/   Navbar, Hero, Button, CarCard, SpecTable, Footer
  data/         vehicles.ts — typed vehicle data (edit this to change/add models)
  App.tsx       Page layout wiring the components together
```

Vehicle data in `src/data/vehicles.ts` uses 2026 MY entry-trim specs and
MSRP + DPH from Lexus USA Newsroom press materials. The UI labels this as
approximate / demo comparison data — not a dealer quote. Update that file to
refresh models.

## 3D models

`CarShowroom3D` loads GLBs from `public/models` via `import.meta.env.BASE_URL`
(`/lexus-showroom/` on GitHub Pages). Each lineup vehicle maps to
`models/{id}.glb` (`es`, `nx`, `rx`, `lx`) and falls back to the bundled
`models/hero.glb`. See `public/models/README.md` for naming and asset rules.
The viewer shows load progress, a WebGL fallback, and an error state if no
GLB is available.

## Local development

Requires Node.js 20+.

```bash
npm install
npm run dev
```

This starts a local dev server (Vite will print the URL, typically
`http://localhost:5173`).

## Type checking

```bash
npm run typecheck
```

## Accessibility smoke

```bash
npm run test:a11y
```

Runs a Vitest + axe-core smoke check on the home page (3D viewer mocked).
Contrast for brand accent text is handled via the `lexus.accent-bright` theme token.

## Playwright smoke (Pages base path)

CI runs a Chromium smoke against the **production preview** served under
`base: /lexus-showroom/` so a broken Vite base or missing entry JS/CSS fails
the PR job.

```bash
npm run build
npx playwright install chromium   # once per machine / after Playwright upgrades
npm run test:e2e
```

Refresh notes:

- If the repo (and Pages subpath) is renamed, update `base` in
  `vite.config.ts` **and** the `BASE` constant in `e2e/home-smoke.spec.ts`
  plus `playwright.config.ts` to match.
- After bumping `@playwright/test`, re-run `npx playwright install chromium`
  (CI uses `npx playwright install --with-deps chromium`).
- Spec lives in `e2e/home-smoke.spec.ts`; extend there for extra critical
  selectors — keep it a smoke, not a full suite.

## Production build

```bash
npm run build
```

Outputs a static site to `dist/`. Preview the production build locally with:

```bash
npm run preview
```

## Deployment (GitHub Pages)

This repo includes a GitHub Actions workflow
(`.github/workflows/pages.yml`) that builds the site and deploys `dist/` to
GitHub Pages automatically on every push to `main`.

One-time setup in the GitHub repo settings:

1. Go to **Settings → Pages**.
2. Under **Build and deployment → Source**, select **GitHub Actions**.

After that, pushing to `main` (or running the workflow manually via
**Actions → Deploy Vite site to GitHub Pages → Run workflow**) will publish
the site to `https://<username>.github.io/lexus-showroom/`.

**Note:** `vite.config.ts` sets `base: "/lexus-showroom/"` to match this
repo's name, since GitHub Pages serves project repos from a subpath. If the
repo is ever renamed, update `base` to match.
