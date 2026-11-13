# framesnfold portfolio: project context

## Who and what
- Niyaj is building a portfolio site for his brother, **Nawaz Kumanali**, a reel editor and videographer.
- Brand: **framesnfold** (Instagram: `@framesnfold`, https://www.instagram.com/framesnfold). Nawaz's personal account is `@nawaz_frames`: gym edits, day-in-life, photos.
- framesnfold is new. Its content: car and bike edits, promo reels for local shops, shop-opening reels, offer-announcement reels for clients.
- Audience: local shop owners who want attention-grabbing reels. Main goal: they contact Nawaz. Secondary: show the work.
- Instagram could not be fetched (blocked), so everything above comes from Niyaj. No real clips, logo or brand colours exist yet.
- Scope right now: **hero section only**. The rest of the site comes after the hero is final.

## Stack
- Vite + React 19 + TypeScript (`npm create vite@latest framesnfold -- --template react-ts`), plain CSS files, no UI library.
- Template tsconfig is strict-ish: `verbatimModuleSyntax` (use `import type`), `noUnusedLocals`, `erasableSyntaxOnly` (no enums or parameter properties). Lint is ESLint 10 (`eslint.config.js`, `npm run lint` → `eslint .`), not oxlint.
- Fonts via Google Fonts link in `index.html`: Big Shoulders Display (700, 900) for display, Manrope (400, 600, 700) for body.
- Deploy plan: GitHub, then Vercel (Vite preset).
- Windows + PowerShell: if `npm` is blocked, run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` or use `npm.cmd`.

## Design direction (decided)
- Dark cinematic, motion-first. Deliberately a single dark look, no light theme.
- Tokens (in `src/index.css`): `--ink #0e0d0c`, `--paper #f2ede6`, `--ember #ff5a1f` (the one accent), `--ember-deep #c9360a`, `--mute #aaa299`, `--line`, `--dwell 3.8s`.
- Boldness lives in one place: the three vertical 9:16 reel panels that start folded in half and unfold once on load (the "fold" in framesnfold). Everything else stays quiet.
- Single viewport: the app is a grid (`auto` header + `1fr` hero) at `min-height: 100svh`. The document must never scroll at any size. Verified exact fit at 1440×900, 1280×800, 1024×768, 800×526, 390×844, 360×640, 320×568, 844×390.
- Hero layout: left column has the big lowercase wordmark, a cycling pitch line, a short lead, two buttons. Right column is a fanned, overlapping deck of the three panels (active centred, the other two fanned left/right). Under 760px it stacks to one column with the deck below the copy.
- The deck fan uses a circular offset (`--o`), so the neighbours are always one on each side; the deck never drifts to an edge. Active panel is centred and larger; the others sit lower, smaller, dimmed and rotated.
- Copy: "Reels for" + cycling phrase ("bike and car pages." / "shop openings." / "weekend offers."). Lead: "Edits for bike and car pages, shop openings and offer announcements. Shot and cut by Nawaz Kumanali." Buttons: "Watch the reels" and "Book a reel on Instagram" (both link to the framesnfold profile for now).
- Space is bought back on short screens: the lead hides at `max-width: 760px and max-height: 700px` and at `max-height: 500px`; the wordmark and pitch shrink on short viewports. This is intentional, not a bug.
- Avoid: generic photographer-template look, all-caps eyebrow labels, numbered markers, emoji, gradient hero, identical rounded cards.

## Behaviour (implemented)
- One phrase, one panel and one progress bar are "on" at a time. The ember underline under the phrase runs for `--dwell`, and its `animationend` (name `dwell`) advances to the next reel. Pausing is done in CSS (`.paused` freezes the bar and the panel progress).
- Selecting a reel: click/tap a panel, focus it, `←`/`→`, a horizontal wheel/trackpad gesture, or a horizontal swipe on the deck. Vertical scroll is never intercepted (no `preventDefault`), so the page stays free for the next section; `↑`/`↓` scroll the page. Hover only pauses/previews; it does not select, so panels never re-fan under the cursor. `useReelNav` owns wheel, keys and swipe.
- Panels are real `<button>`s with `aria-pressed`; the deck is a `role="group"` labelled "Sample reels". The hint under the deck tells people to swipe sideways or tap.
- Mouse-only effects: orange light follows the cursor (`--mx/--my` on `.hero`), panels tilt in 3D (`--nx/--ny` on `.deck`), a cursor glare moves across the active panel (`--gx/--gy`), wordmark letters near the cursor lift and warm to ember (`--p` per letter), buttons lean toward the cursor and run a shine. All written as CSS variables so React does not re-render.
- Active panel scales up and glows; inactive panels dim and freeze. Timecode counts from zero when a panel turns on and holds while paused. Scenes have per-scene motion (sun breathe, stamp, text up, tag in, HUD in) that only runs while that reel is on.
- Page chrome: fixed film grain over everything, a cinema vignette behind the content, 1px frame lines at the app edges on desktop.
- `prefers-reduced-motion`: no fold, no cycling, no grain, no pointer effects, no scene motion, static progress.
- Wordmark: `h1` with `aria-label`, letters `aria-hidden`. The pitch has a screen-reader-only full sentence.

## File map
```
index.html                     fonts, meta (viewport-fit=cover), title "framesnfold"
src/index.css                  tokens, body, grain, .sr, .app viewport grid, vignette
src/App.tsx                    .app wrapper: Header + Hero
src/types.ts                   CSSVars (custom-property typing), ReelData
src/hooks/useCycle.ts          current reel, paused state, next/prev
src/hooks/useReelNav.ts        wheel, keyboard and swipe navigation for the deck
src/hooks/usePointerFx.ts      cursor light, deck tilt and glare vars
src/hooks/useTimecode.ts       30fps timecode written straight to the DOM
src/hooks/useReducedMotion.ts
src/components/Header/         Header.tsx, Header.css (entrance + compact mobile)
src/components/Hero/
  Hero.tsx, Hero.css           layout, cycle wiring, deck, all hero styles
  Reel.tsx                     one folding panel (single scene layer + fold halves)
  scenes.tsx                   3 placeholder scenes drawn in CSS ("Sample frame")
  reels.tsx                    REELS array, order = cycle order
  Wordmark.tsx                 letter rise + cursor proximity
  MagnetLink.tsx               button-styled link that leans toward the mouse
```
Scenes use container query units (`cqw`) so they scale with panel width.

## Status
- `npm run build` (tsc + vite) and `npm run lint` (ESLint) pass.
- Checked in the in-app browser: no console errors; the document is exactly viewport height at 1440×900, 1280×800, 1024×768, 800×526, 390×844, 360×640, 320×568 and 844×390 (no horizontal or vertical page scroll).
- Interaction verified: auto-cycle advances after `--dwell`, click and `ArrowRight` select, horizontal wheel and swipe step, vertical wheel does not change the reel, hovering the deck pauses the dwell animation and resumes on leave.
- Still worth checking on a real phone: fold animation (3D, `backface-visibility`), tilt feel, letter effect, anything clipped.
- Placeholder scenes only. No real footage, logo or photo yet.

## Known issue to solve next: real video in the panels
Each panel renders its scene twice (left and right half) so it can fold at the crease. Two `<video>` elements would drift out of sync. Options:
1. Keep the fold only for the intro, then swap the panel to a single `<video>` once it has opened.
2. Draw one video into two canvases.
3. Put one `<video>` under the halves and mask/clip it.
Needs a decision once Niyaj has a few real reels (9:16 mp4, short, compressed; put in `public/reels/`). Keep `muted loop playsInline`.

## Next steps
1. Review on a real phone (fold, tilt, small-screen spacing), then fix what looks off.
2. Replace placeholder scenes with real reels (see above).
3. Real brand assets if they exist (logo, colours), then adjust the ember accent if needed.
4. Point "Book a reel" to a real contact path (WhatsApp or Instagram DM link), once Nawaz decides.
5. Deploy to Vercel (GitHub push is done).
6. Then the rest of the site: work/portfolio grid, services, about, contact.

## Working preferences
- Concise, technically precise answers. Practical, role-specific guidance over generic advice.
- Push back with specific reasons when a suggestion does not fit.
- When showing code changes, include a small before/after or sample output where it helps.
