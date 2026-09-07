# Lexus Showroom

An independent editorial Lexus lineup concept with embedded model photography and responsive model detail panels. The portable `index.html` is the production entry point; the repository also retains the Vite/TypeScript toolchain for native build validation.

## Run locally

Open `index.html` directly, or serve the folder:

```bash
python3 -m http.server 8080
```

Then visit `http://localhost:8080`.

For repository-native validation, install Node.js 20+ dependencies and run:

```bash
npm ci
npm run typecheck
npm run build
```

The production build is emitted to `dist/` and is the artifact uploaded by the GitHub Pages workflow.

## Notes

- All model imagery is embedded in the HTML for a portable single-file experience.
- This is an independent design concept and is not an official Lexus website.
