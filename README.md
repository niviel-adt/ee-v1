# Exalted Era
React, Vite, TypeScript, Tailwind CSS, Motion, and Lucide landing page.

## Current interface

The public website and embedded Scrim Tracker share a light mist-and-slate palette, static Blackstar geometry, readable type, and restrained lines. `ModernHero.tsx`, `ModernNavbar.tsx`, and `src/styles/light.css` provide the public presentation. All original navigation entries remain, alongside Performance (opens the existing Circle workspace; select Performance there). The floating Back to top control appears after scrolling. The roster's Map/Cards views, profiles and share links, news controls, recruitment, and tracker integration retain their existing behavior.

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

The emblem uses the official transparent PNG. Staff portraits use a restrained grayscale treatment; player portraits retain their existing imagery. Team selection, member dialogs, expandable values, navigation tracking, and reduced motion are supported.

Legacy logo assets remain in the repository; prior website source remains available in Git history. The private design-review Site has its own separate deployment configuration and is not tied to this repository.

## Constellation roster
The Players section uses four constellations with five positions each. Teams 01/02 read the current player data; Teams 03/04 show explicit placeholders until details are supplied. Map controls include pan, zoom, reset, a manual team tour, isolation, and quick profiles. On mobile, Pan Map enables map gestures; Done Panning restores page scrolling. Keyboard +/−/0 controls zoom/reset; arrows move through stars. Reduced motion is respected.

The map markup, styles, and lifecycle-managed runtime live in `src/components/constellation/`. `PlayersSection.tsx` mounts them in an isolated styling root so existing page sections keep their styling. Continue editing players in `src/data/teams.ts`.

## Shareable player profiles
Open a confirmed player's profile and choose **Copy Profile Link**. Links use `?player=05#players` (Vinc, for example); player numbers are stable identifiers even if display names change. Opening or reloading the link selects the player and opens their profile. Browser Back/Forward restores profile navigation. Closing a directly linked profile removes the player parameter while preserving other query parameters. If clipboard access is unavailable, the dialog exposes a selectable link. Reserved positions do not offer sharing, and unknown player numbers do not open a profile. These links share the website's existing social preview; per-player preview images are not generated.

## Recruitment
The `/recruitment` page announces 10 open community slots and directs inquiries to the existing Discord invite. It includes preparation tips and an expandable FAQ; joining Discord does not submit an application or reserve a slot. Availability is static, so update `src/components/Recruitment.tsx` when the team fills slots or changes requirements. No form, database, or automated slot counter is configured. `npm start` uses the existing SPA fallback to serve direct page links.

## Scrim Tracker

The desktop and mobile navigation link to `/scrims`, which embeds the shared Exalted Era Performance Room. Members can view the four team workspaces, scrim averages, match history, and rosters without signing in. Officers sign in and edit directly in the embedded tracker; there is no separate Open tracker link. Authentication, officer permissions, and shared records stay with the tracker at `https://exalted-scrim-tracker.briskpetal32.chatgpt.site`; this website does not copy records or manage officer access. The existing SPA fallback also serves direct `/scrims` links.

## Interactive design layer
Shared motion helpers live in `src/components/fx.tsx` (scroll reveals, staggered entrances, masked headline reveals, tilt/glow cards, magnetic buttons, count-up numbers, marquee) and the hero starfield in `src/components/Starfield.tsx`. Fonts (Inter Tight, JetBrains Mono) are self-hosted through `@fontsource-variable` packages, so no third-party font requests are made.

The stats band under the hero reads `src/data/stats.ts`, which derives every number from existing data: confirmed players from `teams.ts`, staff from `staff.ts`, and the four-team / twenty-position constellation layout. `communitySlotsOpen` in the same file powers the animated count on `/recruitment`; update it together with `Recruitment.tsx`.

All motion respects `prefers-reduced-motion` (static starfield, no tilt, parallax, marquee or counters), and tilt/magnetic effects only run for a fine mouse pointer.


## News
Add or update announcements in `src/data/news.ts`. Each post needs a unique permanent `id`, its actual announcement date (`YYYY-MM-DD`), category, title, summary, detail paragraphs, and a destination link. Posts appear newest first on the homepage at `#news`; each article has its own anchor link. Use confirmed announcements only. The first post records the October 21, 2026 community recruitment announcement; its ten slots are the original announcement count, not current inventory. Update recruitment availability separately when it changes. Future posts require a build/deployment; no CMS or external feed is configured.

## Roster Map / Cards views
The roster defaults to Cards at initial viewport widths of 700px or less and Map on larger screens. Visitors can switch views without losing the selected player or team filter. Both views use `src/data/teams.ts` and the existing profile dialog/share links. Cards list confirmed players only; unannounced teams show an explanatory empty state. Names, portraits, team numbers, and any supplied `position` are shown; otherwise cards say Valorant Mobile. Search filters cards by name, number, or team. The starfield stops drawing while Cards is active; switching back recalculates map dimensions. Closing a profile returns keyboard focus to the selected card.

On phones, the Scrim Tracker embed fills the viewport below a compact website header. Its introduction remains available to screen readers, and the tracker provides its own bottom navigation and responsive scorecards.
