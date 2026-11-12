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
- Template tsconfig is strict-ish: `verbatimModuleSyntax` (use `import type`), `noUnusedLocals`, `erasableSyntaxOnly` (no enums or parameter properties). Lint is `oxlint`.
- Fonts via Google Fonts link in `index.html`: Big Shoulders Display (700, 900) for display, Manrope (400, 600, 700) for body.
- Deploy plan: GitHub, then Vercel (Vite preset).
- Windows + PowerShell: if `npm` is blocked, run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned` or use `npm.cmd`.

## Design direction (decided)
- Dark cinematic, motion-first. Deliberately a single dark look, no light theme.
- Tokens (in `src/index.css`): `--ink #0e0d0c`, `--paper #f2ede6`, `--ember #ff5a1f` (the one accent), `--ember-deep #c9360a`, `--mute #aaa299`, `--line`, `--dwell 3.8s`.
- Boldness lives in one place: the three vertical 9:16 reel panels that start folded in half and unfold once on load (the "fold" in framesnfold). Everything else stays quiet.
- Hero layout: left column has the big lowercase wordmark, a cycling pitch line, a short lead, two buttons. Right column has the three panels. At phone width it stacks to one column and the panels become a row of three.
- Copy: "Reels for" + cycling phrase ("bike and car pages." / "shop openings." / "weekend offers."). Lead: "Edits for bike and car pages, shop openings and offer announcements. Shot and cut by Nawaz Kumanali." Buttons: "Watch the reels" and "Book a reel on Instagram" (both link to the framesnfold profile for now).
- Avoid: generic photographer-template look, all-caps eyebrow labels, numbered markers, emoji, gradient hero, identical rounded cards.

## Behaviour (implemented)
- One phrase, one panel and one progress bar are "on" at a time. The ember underline under the phrase runs for `--dwell`, and its `animationend` (name `dwell`) advances to the next reel. Pausing is done in CSS (`.paused` freezes the bar).
- Hover (mouse) selects a panel and pauses the cycle. Tap or click selects. Focus selects and pauses. Panels are real `<button>`s with `aria-pressed`.
- Mouse-only effects: orange light follows the cursor (`--mx/--my` on `.hero`), panels tilt in 3D (`--nx/--ny` on `.reels`), wordmark letters near the cursor lift and warm to ember (`--p` per letter), buttons lean toward the cursor. These are written as CSS variables so React does not re-render.
- Active panel scales up and glows; inactive panels dim and freeze. Timecode counts from zero when a panel turns on and holds while paused.
- `prefers-reduced-motion`: no fold, no cycling, no pointer effects, static progress.
- Wordmark: `h1` with `aria-label`, letters `aria-hidden`. The pitch has a screen-reader-only full sentence.

## File map
```
index.html                     fonts, meta, title "framesnfold"
src/index.css                  tokens, body, grain, .sr, .wrap
src/App.tsx                    Header + Hero
src/types.ts                   CSSVars (custom-property typing), ReelData
src/hooks/useCycle.ts          current reel, paused state
src/hooks/usePointerFx.ts      cursor light + tilt vars
src/hooks/useTimecode.ts       30fps timecode written straight to the DOM
src/hooks/useReducedMotion.ts
src/components/Header/         Header.tsx, Header.css
src/components/Hero/
  Hero.tsx, Hero.css           layout, cycle wiring, all hero styles
  Reel.tsx                     one folding panel (two halves share one scene)
  scenes.tsx                   3 placeholder scenes drawn in CSS ("Sample frame")
  reels.tsx                    REELS array, order = cycle order
  Wordmark.tsx                 letter rise + cursor proximity
  MagnetLink.tsx               button-styled link that leans toward the mouse
```
Scenes use container query units (`cqw`) so they scale with panel width.

## Status
- Hero builds clean in a scratch project: `npm run build` (tsc + vite) and `npm run lint` pass.
- **Not yet checked in a real browser.** Look for: fold animation (3D, `backface-visibility`), layout at about 400px width, tilt feel, letter effect, anything clipped.
- Placeholder scenes only. No real footage, logo or photo yet.

## Known issue to solve next: real video in the panels
Each panel renders its scene twice (left and right half) so it can fold at the crease. Two `<video>` elements would drift out of sync. Options:
1. Keep the fold only for the intro, then swap the panel to a single `<video>` once it has opened.
2. Draw one video into two canvases.
3. Put one `<video>` under the halves and mask/clip it.
Needs a decision once Niyaj has a few real reels (9:16 mp4, short, compressed; put in `public/reels/`). Keep `muted loop playsInline`.

## Next steps
1. Run it, review in browser and on a phone, fix what looks off.
2. Replace placeholder scenes with real reels (see above).
3. Real brand assets if they exist (logo, colours), then adjust the ember accent if needed.
4. Point "Book a reel" to a real contact path (WhatsApp or Instagram DM link), once Nawaz decides.
5. Push to GitHub, deploy to Vercel.
6. Then the rest of the site: work/portfolio grid, services, about, contact.

## Working preferences
- Concise, technically precise answers. Practical, role-specific guidance over generic advice.
- Push back with specific reasons when a suggestion does not fit.
- When showing code changes, include a small before/after or sample output where it helps.
