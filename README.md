# Exalted Era
React, Vite, TypeScript, Tailwind CSS, Motion, and Lucide landing page.

## Local development
Node 22 or later:

```sh
npm ci
npm run dev
```

## Railway deployment
Keep this repository connected to the existing Railway service, using the `main` branch and repository root. `railway.json` defines:

- Build: `npm ci && npm run build`
- Start: `npm start`
- Health check: `/`

The server serves the compiled `dist` directory and listens on Railway's supplied `PORT` (3000 locally). Remove or update any old dashboard build/start overrides that conflict with these commands. No application secrets are required. Node 22 is pinned in `.node-version` and package engines.

Merging into `main` may automatically deploy if Railway automatic deployments are enabled. Keep the existing Railway custom domain and Namecheap DNS records; replacing source code does not require changing DNS. Confirm the Railway deployment succeeds before considering the update complete.

## Content
Edit `src/data/staff.ts`, `teams.ts`, and `site.ts`. Staff: Xia (Operations), Avior (Internal), Wasabi (External). Contact Us opens Facebook; Join Our Discord opens Discord. Member portraits are optimized WebP files hosted in `public/portraits/`. Keep new portraits local to avoid third-party image dependencies. The Highlights section links to the existing Facebook and Discord channels; it does not claim unverified match results or events. Edit it in `src/components/Highlights.tsx` when confirmed clips or results are available.

The emblem uses a transparent PNG rendered white through CSS. Portraits display in full color. Team selection, member dialogs, expandable values, navigation tracking, and reduced motion are supported.

Legacy logo assets remain in the repository; prior website source remains available in Git history. The private design-review Site has its own separate deployment configuration and is not tied to this repository.

## Constellation roster
The Players section uses four constellations with five positions each. Teams 01/02 read the current player data; Teams 03/04 show explicit placeholders until details are supplied. Map controls include pan, zoom, reset, a manual team tour, isolation, and quick profiles. On mobile, Pan Map enables map gestures; Done Panning restores page scrolling. Keyboard +/−/0 controls zoom/reset; arrows move through stars. Reduced motion is respected.

The map markup, styles, and lifecycle-managed runtime live in `src/components/constellation/`. `PlayersSection.tsx` mounts them in an isolated styling root so existing page sections keep their styling. Continue editing players in `src/data/teams.ts`.

## Shareable player profiles
Open a confirmed player's profile and choose **Copy Profile Link**. Links use `?player=05#players` (Vinc, for example); player numbers are stable identifiers even if display names change. Opening or reloading the link selects the player and opens their profile. Browser Back/Forward restores profile navigation. Closing a directly linked profile removes the player parameter while preserving other query parameters. If clipboard access is unavailable, the dialog exposes a selectable link. Reserved positions do not offer sharing, and unknown player numbers do not open a profile. These links share the website's existing social preview; per-player preview images are not generated.
