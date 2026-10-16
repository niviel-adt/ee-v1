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
Edit `src/data/staff.ts`, `teams.ts`, and `site.ts`. Staff: Xia (Operations), Avior (Internal), Wasabi (External). Contact Us opens Facebook; Join Now opens Discord. Member photos currently use externally hosted Google Drive thumbnail links and require public link access. For reliable production loading, replace those URLs with local image paths in `public/`. External image loading could not be verified in the development environment due to its network policy.

The emblem uses a transparent PNG rendered white through CSS. Portraits display in full color. Team selection, member dialogs, expandable values, navigation tracking, and reduced motion are supported.

Legacy logo assets remain in the repository; prior website source remains available in Git history. The private design-review Site has its own separate deployment configuration and is not tied to this repository.
