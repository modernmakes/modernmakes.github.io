# Modern Makes

The editorial voice of the 3D printing enthusiast.

## Stack
- **Framework:** Astro (static site generation)
- **Hosting:** GitHub Pages (free)
- **Data:** JSON files (Airtable → JSON export pipeline coming)
- **Styles:** Custom CSS design system (no Tailwind)

## Development

```bash
# Install dependencies (first time only)
npm install

# Start local dev server
npm run dev
# → Opens at http://localhost:4321

# Build for production
npm run build

# Preview production build locally
npm run preview
```

## Project structure

```
src/
  components/     # Reusable Astro components (Nav, Footer)
  layouts/        # Page layouts (Base.astro)
  pages/          # Every .astro file here = a page
    index.astro   # Homepage
    voron/        # Voron ecosystem pages
      index.astro       # /voron hub
      hotends.astro     # /voron/hotends
      configurator.astro # /voron/configurator
    ratrig/       # RatRig ecosystem
    bambu/        # Bambu Lab mod directory
    ...
  data/
    products/     # JSON product data files
  styles/
    global.css    # Design system tokens + utilities
public/
  images/         # Static images
.github/
  workflows/
    deploy.yml    # Auto-deploy to GitHub Pages on push to main
```

## Deployment

Push to `main` branch → GitHub Actions builds automatically → live at modernmakes.github.io

## Adding products

Edit `src/data/products/hotends.json` (or relevant file) and push.
