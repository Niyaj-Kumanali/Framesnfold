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
- Header bar: the wordmark in Big Shoulders with a small 9:16 mark beside it — cream panel, ember panel, hinged down the middle, the ember half folds open on hover/focus. Social accounts are icon-only on the right (Instagram page, Instagram personal with an ember dot badge, YouTube), 2rem tap targets, 18px stroke icons drawn inline. No section links yet; there are no sections.
- The bar is sticky and hides while scrolling down, returning on scroll up or at the top. It only grows its ink backdrop and hairline once the page has moved, so at rest it is just type and icons over the hero. `useHideOnScroll` owns that.
- Single viewport: the app is a grid (`auto` header + `1fr` hero) at `min-height: 100svh`. The document must never scroll at any size. Verified exact fit at 1440×900, 1280×800, 1024×768, 800×526, 390×844, 360×640, 320×568, 844×390.
- Hero layout: left column has the big lowercase wordmark, a cycling pitch line, a short lead, two buttons. Right column is a fanned, overlapping deck of the three panels (active centred, the other two fanned left/right). Under 760px it stacks to one column with the deck below the copy.
- The deck fan uses a circular offset (`--o`), so the neighbours are always one on each side; the deck never drifts to an edge. Active panel is centred and larger; the others sit lower, smaller, dimmed and rotated.
- Copy: "Reels for" + cycling phrase ("bike and car pages." / "shop openings." / "weekend offers."). Lead: "Edits for bike and car pages, shop openings and offer announcements. Shot and cut by Nawaz Kumanali." Buttons: "Watch the reels" and "Book a reel on Instagram" (both link to the framesnfold profile for now).
- Space is bought back on short screens: the lead hides at `max-width: 760px and max-height: 700px` and at `max-height: 500px`; the wordmark and pitch shrink on short viewports. This is intentional, not a bug.
- Avoid: generic photographer-template look, all-caps eyebrow labels, numbered markers, emoji, gradient hero, identical rounded cards.

## Behaviour (implemented)
- One phrase, one panel and one progress bar are "on" at a time. The ember underline under the phrase runs for `--dwell`, and its `animationend` (name `dwell`) advances to the next reel. `Hero.tsx` stores each real clip's `loadedmetadata` duration (clamped 3–8 s) and puts the active one on `.hero` as `--dwell`, so the underline, the panel progress bar and the clip share one length. Without real footage the 3.8 s token in `index.css` still applies. Pausing is done in CSS (`.paused` freezes the bar and the panel progress).
- Selecting a reel: click/tap a panel, focus it, `←`/`→`, a horizontal wheel/trackpad gesture, or a horizontal swipe on the deck. Vertical scroll is never intercepted (no `preventDefault`), so the page stays free for the next section; `↑`/`↓` scroll the page. Hover only pauses/previews; it does not select, so panels never re-fan under the cursor. `useReelNav` owns wheel, keys and swipe.
- Pause rules: hover pauses, and clicking a panel clears that pause so the chosen reel plays (the pointer is still over the deck, so it stays playing until it leaves and returns). Focus only pauses when it came from the keyboard (`:focus-visible`) — a click also focuses the button, and pausing on that froze the cycle until the user clicked elsewhere.
- Panels are real `<button>`s with `aria-pressed`; the deck is a `role="group"` labelled "Sample reels". The hint under the deck tells people to swipe sideways or tap.
- Mouse-only effects: orange light follows the cursor (`--mx/--my` on `.hero`), panels tilt in 3D (`--nx/--ny` on `.deck`), a cursor glare moves across the active panel (`--gx/--gy`), wordmark letters near the cursor lift and warm to ember (`--p` per letter). All written as CSS variables so React does not re-render.
- Buttons are static: no magnet lean, no shine sweep. The only thing that answers the pointer is the `↗`, which shifts 3px up and right on hover. Colour changes on `.primary`/`.ghost` stay.
- Active panel scales up and glows; inactive panels dim and freeze. Timecode counts from zero when a panel turns on and holds while paused. Scenes have per-scene motion (sun breathe, stamp, text up, tag in, HUD in) that only runs while that reel is on.
- Page chrome: fixed film grain over everything, a cinema vignette behind the content, 1px frame lines at the app edges on desktop.
- `prefers-reduced-motion`: no fold, no cycling, no grain, no pointer effects, no scene motion, static progress.
- Reels: a single `<video muted loop playsInline preload poster aria-hidden disablePictureInPicture>` sits under the drawn scene inside the active panel. Only the active reel plays; `currentTime` resets when a reel turns on; hover/keyboard pause pauses it too. It shows once `loadeddata` fires and stays behind the drawn scene until then. A tap calls `play()` directly in the click handler (React's effect is too late for iOS's gesture rule). A stalled load times out after 4 s and falls back, but gets **one** retry when that reel is active: `el.load()` on the same element, so no second video and no poster flicker. An `error` event (404, bad codec) is permanent and never retries; a second timeout also sticks. The video element stays mounted after failure so the retry can reload it. The fold halves never get their own video — they use the poster JPEG, sized `200% 100%` and offset like `.l .s`/`.r .s`, so the crease cannot drift. Active + next preload `auto`, the third `metadata`.
- Wordmark: `h1` with `aria-label`, letters `aria-hidden`. The pitch has a screen-reader-only full sentence.
- Accounts and the booking destination live in `src/config.ts` (`LINKS`, `bookLink()`). The ghost CTA says "Book a reel on WhatsApp" and opens `wa.me` once `whatsappNumber` is set; until then it says "Book a reel on Instagram" and opens `ig.me/m/framesnfold`.
- Link preview: `index.html` carries OG/Twitter/canonical tags pointing at `https://framesnfold.vercel.app/`, with `public/og.png` (1200×630, ink background, ember accent).

## File map
```
index.html                     fonts, meta (viewport-fit=cover), OG/Twitter tags, title "framesnfold"
public/og.png                  link preview, 1200x630, generated once
public/reels/                  footage slot: bike|shop|offer .mp4 + .jpg (empty apart from .gitkeep)
src/index.css                  tokens, body, grain, .sr, .app viewport grid, vignette
src/App.tsx                    .app wrapper: Header + Hero
src/config.ts                  LINKS (accounts, whatsappNumber, whatsappMessage) + bookLink()
src/types.ts                   CSSVars (custom-property typing), ReelData (+ optional video)
src/hooks/useCycle.ts          current reel, paused state, next/prev
src/hooks/useReelNav.ts        wheel, keyboard and swipe navigation for the deck
src/hooks/usePointerFx.ts      cursor light, deck tilt and glare vars
src/hooks/useTimecode.ts       30fps timecode written straight to the DOM
src/hooks/useReducedMotion.ts
src/hooks/useHideOnScroll.ts   sticky bar: hidden on scroll down, stuck backdrop
src/components/Header/         Header.tsx, Header.css (wordmark + mark, icon links, sticky)
src/components/Hero/
  Hero.tsx, Hero.css           layout, cycle wiring, per-reel --dwell, deck, all hero styles
  Reel.tsx                     one folding panel: video, duration, retry, fold halves
  scenes.tsx                   3 placeholder scenes drawn in CSS ("Sample frame")
  reels.tsx                    REELS array, order = cycle order, video paths
  Wordmark.tsx                 letter rise + cursor proximity
```
Scenes use container query units (`cqw`) so they scale with panel width.

## Status
- `npm run build` (tsc + vite) and `npm run lint` (ESLint) pass.
- Checked in the in-app browser: no console errors; the document is exactly viewport height at 1440×900, 1280×800, 1024×768, 800×526, 390×844, 360×640, 320×568 and 844×390 (no horizontal or vertical page scroll).
- Interaction verified: auto-cycle advances after `--dwell`, click and `ArrowRight` select, horizontal wheel and swipe step, vertical wheel does not change the reel, hovering the deck pauses the dwell animation and resumes on leave.
- Header verified: one row at every tested size (no wrap), icon links 2rem (1.85rem mobile), last icon within 1px of the frame edge, bar hides on scroll down and returns on scroll up with the backdrop only when stuck. Links: framesnfold IG, `@nawaz_frames` IG (ember dot), YouTube `@framesnfold` (channel confirmed live).
- Buttons verified static: pointermove leaves `transform: none` and sets no `--bx/--by`; on hover the button stays put and the `↗` computes to `translate(3px, -3px)`.
- Pause/resume verified: pointerenter on the deck adds `.paused` and the timecode holds; a click while the pointer stays on the deck removes `.paused` and the count runs again (2.73s in 3s); keyboard focus pauses and blur resumes. The old bug was `onFocus` pausing for mouse clicks too, leaving `focusing` true until the user clicked away.
- Reel playback verified with generated 9:16 test clips: only the active panel plays, click/`ArrowRight`/swipe/horizontal wheel switch and reset to 0, hover holds and leaving resumes, a missing `shop.mp4` fell back to the drawn scene with no console errors.
- Dwell verified with generated 4 s and 7 s clips: a 4.046 s clip set `--dwell: 4.0457s` on `.hero`, and both the phrase underline and the panel progress computed to `4.0457s`; a 7.057 s clip set `7.0568s` everywhere; the missing reel kept `3.8s`. Re-switching applied the stored length in the same render as the new `on` classes. The bars can start slightly before the video finishes decoding in this in-app browser (~1.4 s on a 4 s clip there), so the ends are not frame-perfect in that environment; real hardware should be much closer.
- Retry verified with a local server that stalled requests: at ~4 s the panel showed the placeholder, then one `emptied` event from `el.load()` was followed by `loadedmetadata`/`loadeddata` and playback. With every request stalled there was still exactly one `emptied` after 9.5 s (no second retry). A 404 fired `error` once, never retried, and kept the placeholder. The clips, server script and temporary src were removed.
- Booking verified both ways: with `whatsappNumber` empty the ghost CTA reads "Book a reel on Instagram" → `https://ig.me/m/framesnfold`; with a number set (spaces allowed, stripped to digits) it reads "Book a reel on WhatsApp" → `https://wa.me/<digits>?text=<encoded message>`. Numbers are never hardcoded in components. The test number was reverted to `''`.
- Link preview verified: tags parse in `index.html`, `public/og.png` is exactly 1200×630 and 64 KB (ink `#0e0d0c` background, cream wordmark, ember rule and mark).
- Still worth checking on a real phone: fold animation (3D, `backface-visibility`), tilt feel, letter effect, anything clipped.
- `public/reels/` is empty apart from `.gitkeep`, so every panel shows its drawn placeholder until real clips are added. No real footage, logo or photo yet.

## Real footage
The video-in-the-fold question is settled: one `<video>` under the continuous scene, poster JPEG for the fold halves. Adding clips is now just files:

```
public/reels/bike.mp4   public/reels/bike.jpg
public/reels/shop.mp4   public/reels/shop.jpg
public/reels/offer.mp4  public/reels/offer.jpg
```

9:16, H.264, no audio, roughly 2 MB each. README has the ffmpeg commands. No code change is needed.
The clip length drives `--dwell`, clamped to 3–8 s (a 9 s reel dwells 8 s). Clips shorter than 3 s hold for 3 s; the HUD timecode is its own 30 fps count.

## Next steps
1. Review on a real phone (fold, tilt, small-screen spacing), then fix what looks off.
2. Drop the three real clips into `public/reels/` (see above) and check them on mobile data.
3. Real brand assets if they exist (logo, colours), then adjust the ember accent if needed. Swap `og.png` if the wordmark or accent changes.
4. Set `whatsappNumber` in `src/config.ts` once Nawaz picks a number; the booking button switches over on its own.
5. Deploy to Vercel (GitHub push is done), then point the OG/canonical URLs at the real domain if one is added.
6. Then the rest of the site: work/portfolio grid, services, about, contact.

## Working preferences
- Concise, technically precise answers. Practical, role-specific guidance over generic advice.
- Push back with specific reasons when a suggestion does not fit.
- When showing code changes, include a small before/after or sample output where it helps.
