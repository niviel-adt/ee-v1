# Exalted Era — V3 Cinematic Edition

Inspired by **Zentry** (oversized typography, motion, immersive storytelling) and **Black Rose** (community esports sections and structured identity). This is an original Exalted Era design; no proprietary assets from those websites are used.

## Preview

Open `index.html` in Chrome or Edge. Optional: run a local server with `python -m http.server 8000` then open `http://localhost:8000`.

## Update the four player trailers

Open `content.js` and fill in each player's `name`, `title`, `image`, and `video` fields.

Example:

```js
{name:'IGN HERE',title:'THE FIRST ARRIVAL',image:'assets/players/player-1.webp',video:'assets/trailers/player-1.mp4',line:'ONE OF THE CHOSEN',status:'REVEALED'}
```

- Add photos to `assets/players/` and `.mp4` files to `assets/trailers/`.
- You can also use a full YouTube watch or embed URL as `video`.
- If the video field is empty, the site clearly indicates that the trailer is **coming soon**, instead of faking playback.

## Update staff profiles

Edit `staff` in `content.js`, for example:

```js
{name:'STAFF NAME',role:'TEAM MANAGER',image:'assets/staff/manager.webp',bio:'Managing the Circle.',social:'https://instagram.com/example'}
```

You can add more staff. Keep image file sizes optimized for web (WebP recommended).

## Update the application

Put your working application URL into `applicationUrl` in `content.js` after verifying it. The sample `mailto:` link is only a placeholder. This build does NOT include a functioning application backend and does NOT contain the existing original site's server-side features.

## Deploy to GitHub / Railway

1. Keep a backup of the current live repository and Railway settings.
2. Put `index.html`, `style.css`, `script.js`, `content.js`, and `assets/` in your static site repository root.
3. If Railway serves static HTML, verify its output directory and static hosting settings before switching the production domain.
4. Test mobile navigation, player videos, staff images, application URL, and any custom domains in a staging environment first.

This preview runs as a static site, with no build step. Fonts are served from Google Fonts when online; system fallbacks are provided.

### Accessibility and performance

- Native dialog for player reveals, with close button.
- Reduced motion support, semantic navigation, responsive layout.
- Static placeholders rather than fake player photos/videos.
- For best loading speed, replace large crest PNG with a transparent optimized WebP after checking visual quality (original uploaded PNG is kept as requested).
