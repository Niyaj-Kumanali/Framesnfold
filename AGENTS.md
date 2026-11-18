# framesnfold portfolio: project context

## Who and what
- Niyaj is building a portfolio site for his brother, **Nawaz Kumanali**, a reel editor and videographer.
- Brand: **framesnfold** (Instagram: `@framesnfold`, https://www.instagram.com/framesnfold). Nawaz's personal account is `@nawaz_frames`: gym edits, day-in-life, photos.
- framesnfold is new. Its content: car and bike edits, promo reels for local shops, shop-opening reels, offer-announcement reels for clients.
- Audience: local shop owners who want attention-grabbing reels. Main goal: they contact Nawaz. Secondary: show the work.
- Instagram could not be fetched (blocked), so everything above comes from Niyaj. No real clips, logo or brand colours exist yet.
- Scope: full single-page site — hero, Work, Services, About, Contact and a footer. The hero is final; the lower sections are new and still need real content from Niyaj.

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
- Header bar: the wordmark in Big Shoulders with a small 9:16 mark beside it — cream panel, ember panel, hinged down the middle, the ember half folds open on hover/focus. Text links Work/Services/About, a small filled "Book a reel", then icon-only accounts (Instagram page, Instagram personal with an ember dot badge, YouTube), 2rem tap targets, 18px stroke icons drawn inline. On phones the three text links hide; "Book a reel" and the icons stay. One row at every width. The icons are shared with the footer via `AccountLinks`.
- The bar is sticky and hides while scrolling down, returning on scroll up or at the top. It only grows its ink backdrop and hairline once the page has moved, so at rest it is just type and icons over the hero. `useHideOnScroll` owns that.
- Page layout: only the hero is viewport-fitted (`min-height: 100svh`), pulled under the sticky bar by a negative `margin-top` equal to `--bar-h`. The page scrolls below it through Work, Services, About, Contact and the footer. `useHeaderHeight` measures the bar and publishes `--bar-h` on `.app`; sections use it as `scroll-margin-top`. Anchors scroll smoothly only under `prefers-reduced-motion: no-preference`. The hero still fits with no clipping at 1440×900, 1280×800, 1024×768, 800×526, 390×844, 360×640, 320×568, 844×390.
- Hero layout: left column has the big lowercase wordmark, a cycling pitch line, a short lead, two buttons. Right column is a fanned, overlapping deck of the three panels (active centred, the other two fanned left/right). Under 760px it stacks to one column with the deck below the copy.
- The deck fan uses a circular offset (`--o`), so the neighbours are always one on each side; the deck never drifts to an edge. Active panel is centred and larger; the others sit lower, smaller, dimmed and rotated.
- Copy: "Reels for" + cycling phrase ("bike and car pages." / "shop openings." / "weekend offers."). Lead: "Edits for bike and car pages, shop openings and offer announcements. Shot and cut by Nawaz Kumanali." Buttons: "Watch the reels" scrolls to `#work`; the other uses `bookLink()` (IG DM until a WhatsApp number is set). The IG profile stays reachable in the header icons and Contact.
- Space is bought back on short screens: the lead hides at `max-width: 760px and max-height: 700px` and at `max-height: 500px`; the wordmark and pitch shrink on short viewports. This is intentional, not a bug.
- Avoid: generic photographer-template look, all-caps eyebrow labels, numbered markers, emoji, gradient hero, identical rounded cards, accent bars on cards.
- Lower sections: Work is a 9:16 tile grid (3 columns desktop, 2 from 1024px down); Services is one large shop panel plus a quieter text block, never three equal cards; About is photo/text side by side, stacked on phones; Contact is one wide block; the footer is one quiet row. No gradient washes.

## Content decisions (decided)
- Audience is local shop owners. They should see work, read the price in seconds and tap "Book a reel".
- Shop package: **from ₹2,000 for 4 reels** — 2 shot at the shop, 2 AI reels (no shoot needed). Shop openings, offers, new stock, festival sales.
- Personal and page edits: **from ₹100** for a simple edit; **₹300 to ₹500** when Nawaz also shoots. This is the least important offer — it appears only on the quiet card, never beside the shop price.
- Turnaround: **ready in 1 to 2 days**.
- Prices use `Intl.NumberFormat('en-IN')` and `₹`, with `font-variant-numeric: tabular-nums`. They live in `src/data/prices.ts` and are always shown as "from".
- Work entries live in `src/data/work.ts` with titles that Niyaj will rename. About copy is marked as a placeholder in `About.tsx`.

## Behaviour (implemented)
- One phrase, one panel and one progress bar are "on" at a time. The ember underline under the phrase runs for `--dwell`, and its `animationend` (name `dwell`) advances to the next reel. `Hero.tsx` stores each real clip's `loadedmetadata` duration (clamped 3–8 s) and puts the active one on `.hero` as `--dwell`, so the underline, the panel progress bar and the clip share one length. Without real footage the 3.8 s token in `index.css` still applies. Pausing is done in CSS (`.paused` freezes the bar and the panel progress).
- Selecting a reel: click/tap a panel, focus it, `←`/`→`, a horizontal wheel/trackpad gesture, or a horizontal swipe on the deck. Vertical scroll is never intercepted (no `preventDefault`), so the page stays free for the next section; `↑`/`↓` scroll the page. Hover only pauses/previews; it does not select, so panels never re-fan under the cursor. `useReelNav` owns wheel, keys and swipe.
- Pause rules: hover pauses, and clicking a panel clears that pause so the chosen reel plays (the pointer is still over the deck, so it stays playing until it leaves and returns). Focus only pauses when it came from the keyboard (`:focus-visible`) — a click also focuses the button, and pausing on that froze the cycle until the user clicked elsewhere.
- Panels are real `<button>`s with `aria-pressed`; the deck is a `role="group"` labelled "Sample reels". The hint under the deck tells people to swipe sideways or tap.
- Mouse-only effects: orange light follows the cursor as a fixed full-viewport layer on `.app` (`--mx/--my` are viewport pixels written by `usePointerFx` on that same element), so it bleeds over the header and the side gutters. Panels tilt in 3D (`--nx/--ny` on `.deck`), a cursor glare moves across the active panel (`--gx/--gy`), wordmark letters near the cursor lift and warm to ember (`--p` per letter). All written as CSS variables so React does not re-render.
- Buttons are static: no magnet lean, no shine sweep. The only thing that answers the pointer is the `↗`, which shifts 3px up and right on hover. Colour changes on `.primary`/`.ghost` stay.
- Active panel scales up and glows; inactive panels dim and freeze. Timecode counts from zero when a panel turns on and holds while paused. Scenes have per-scene motion (sun breathe, stamp, text up, tag in, HUD in) that only runs while that reel is on.
- Page chrome: fixed film grain over everything and a cinema vignette behind the content. No app-edge border: it read as a hard vertical edge against the glow.
- `prefers-reduced-motion`: no fold, no cycling, no grain, no pointer effects, no scene motion, static progress.
- Reels: a single `<video muted loop playsInline preload poster aria-hidden disablePictureInPicture>` sits under the drawn scene inside the active panel. Only the active reel plays; `currentTime` resets when a reel turns on; hover/keyboard pause pauses it too. It shows once `loadeddata` fires and stays behind the drawn scene until then. A tap calls `play()` directly in the click handler (React's effect is too late for iOS's gesture rule). A stalled load times out after 4 s and falls back, but gets **one** retry when that reel is active: `el.load()` on the same element, so no second video and no poster flicker. An `error` event (404, bad codec) is permanent and never retries; a second timeout also sticks. The video element stays mounted after failure so the retry can reload it. The fold halves never get their own video — they use the poster JPEG, sized `200% 100%` and offset like `.l .s`/`.r .s`, so the crease cannot drift. Active + next preload `auto`, the third `metadata`.
- Wordmark: `h1` with `aria-label`, letters `aria-hidden`. The pitch has a screen-reader-only full sentence.
- Accounts and the booking destination live in `src/config.ts` (`LINKS`, `bookLink()`). The ghost CTA says "Book a reel on WhatsApp" and opens `wa.me` once `whatsappNumber` is set; until then it says "Book a reel on Instagram" and opens `ig.me/m/framesnfold`.
- Link preview: `index.html` carries OG/Twitter/canonical tags pointing at `https://framesnfold.vercel.app/`, with `public/og.png` (1200×630, ink background, ember accent).
- Section anchors: `work`, `services`, `about`, `contact` sit on the `<section>`s with `scroll-margin-top: var(--bar-h)`. Header links and the hero CTA scroll to them; vertical scroll is never intercepted and `useHideOnScroll` is unchanged.
- Work grid: six 9:16 tiles from `src/data/work.ts`, filters All/Bike and car/Shops/Offers with `aria-pressed`. One playback slot for the whole grid: mouse hover or keyboard focus claims it, touch uses `IntersectionObserver` for the most visible tile, the hidden tab and an open lightbox release it. Tiles are `preload="metadata"`, muted and looped; posters are checked as `Image` first so a missing file never paints a broken icon, and a failed tile shows a drawn placeholder with its title and a thin ember line. Reduced motion renders posters only.
- Lightbox: a native `<dialog>` with controls and sound on, a visible Close button, Escape, and focus returned to the tile it came from.
- About: `/nawaz.jpg` is a lazy `<img>` with width/height and alt "Nawaz Kumanali". A failed load swaps in a same-size drawn panel with a large "N" and an ember line, so nothing shifts.
- Contact: the primary button and the header booking link both use `bookLink()`. "Message on Instagram" appears only once WhatsApp is primary. With a number set, the digits are selectable text beside a Copy button; `navigator.clipboard.writeText` runs in the click handler, rejection is caught, and the button says "Copied" on success. No phone number is hardcoded in a component.
- `prefers-reduced-motion` also covers the lower sections: no smooth anchor scroll, no tile video, no transitions.

## File map
```
index.html                     fonts, meta (viewport-fit=cover), OG/Twitter tags, title "framesnfold"
public/og.png                  link preview, 1200x630, generated once
public/reels/                  footage slots: bike|shop|offer and work-1..6 (.mp4 + .jpg), empty apart from .gitkeep
public/nawaz.jpg               Niyaj adds this; absent for now
src/index.css                  tokens, body, grain, .sr, .app flow layout, vignette, .section base
src/App.tsx                    .app wrapper: Header, Hero, Work, Services, About, Contact, Footer
src/config.ts                  LINKS (accounts, whatsappNumber, whatsappMessage) + bookLink()
src/types.ts                   CSSVars (custom-property typing), ReelData (+ optional video)
src/data/work.ts               six Work entries: id, title, kind, src, poster
src/data/prices.ts             price numbers + Intl-formatted strings
src/hooks/useCycle.ts          current reel, paused state, next/prev
src/hooks/useReelNav.ts        wheel, keyboard and swipe navigation for the deck
src/hooks/usePointerFx.ts      cursor light, deck tilt and glare vars
src/hooks/useTimecode.ts       30fps timecode written straight to the DOM
src/hooks/useReducedMotion.ts
src/hooks/useHideOnScroll.ts   sticky bar: hidden on scroll down, stuck backdrop
src/hooks/useHeaderHeight.ts   publishes the bar height as --bar-h on .app
src/components/Header/         Header.tsx, Header.css (wordmark, section links, sticky)
src/components/AccountLinks/   shared header/footer icons (drawn once)
src/components/Hero/
  Hero.tsx, Hero.css           layout, cycle wiring, per-reel --dwell, deck, all hero styles
  Reel.tsx                     one folding panel: video, duration, retry, fold halves
  scenes.tsx                   3 placeholder scenes drawn in CSS ("Sample frame")
  reels.tsx                    REELS array, order = cycle order, video paths
  Wordmark.tsx                 letter rise + cursor proximity
src/components/Work/           Work.tsx, WorkTile.tsx, Work.css (filters, single playback slot, dialog)
src/components/Services/       Services.tsx, Services.css (two blocks of different weight)
src/components/About/          About.tsx, About.css (lazy photo + drawn fallback, placeholder copy)
src/components/Contact/        Contact.tsx, Contact.css (booking, conditional WhatsApp block)
src/components/Footer/         Footer.tsx, Footer.css (one quiet row)
```
Scenes use container query units (`cqw`) so they scale with panel width.

## Status
- `npm run build` (tsc + vite) and `npm run lint` (ESLint) pass.
- Checked in the in-app browser: no console errors; no horizontal page scroll at 1440×900, 1280×800, 1024×768, 800×526, 390×844, 360×640, 320×568 and 844×390. The hero box is exactly one viewport tall at every size, and its content still fits below the floating bar.
- Page verified: section anchors land at `scroll-margin-top = --bar-h` (57 px in the test tab), smooth scroll computes only without reduced motion, and the sticky bar still hides on scroll down and returns on scroll up. In that browser `requestAnimationFrame` is throttled, so scroll events and smooth scrolling had to be checked with rAF-independent probes; the unchanged `useHideOnScroll` remains verified from earlier work.
- Work verified both with no files (six drawn placeholders, no broken images) and with six generated clips (posters decode, hover/focus plays exactly one tile, leaving pauses it, switching hands the slot over, filters select 2/2/2, lightbox opens with sound on and controls, Escape closes and focus returns). Reduced motion was forced via `matchMedia`: zero videos, posters only. Test clips were deleted.
- Services, About, Contact and Footer verified: price strings read "From ₹2,000 for 4 reels" and "Simple edits from ₹100. With shooting, ₹300 to ₹500." with `tabular-nums`; the photo fallback shows a same-size "N" panel on error and a real 640×800 test JPEG decodes when loaded (that browser does not trigger `loading="lazy"` on programmatic scroll, so the URL was checked with `fetch` and a forced eager load); the footer reuses the header's three icons. Header and footer stay one row, with no overflow, at all eight tested sizes.
- Cursor glow verified at 1440×900 and 390×844: `.app::after` computes to `position: fixed`, `inset: 0`, full viewport size, `pointer-events: none`, `z-index: 0`; `.hero::before` is gone. Viewport-pixel `--mx/--my` update over both the header and the hero. `.app` has no inline border, and screenshot row/column samples across the header/hero boundary and both side gutters show no step (≤1 RGB unit at desktop; ~1–2 at mobile natural gradient), so no clipping edge.
- Interaction verified: auto-cycle advances after `--dwell`, click and `ArrowRight` select, horizontal wheel and swipe step, vertical wheel does not change the reel, hovering the deck pauses the dwell animation and resumes on leave.
- Header verified: one row at every tested size (no wrap), icon links 2rem (1.85rem mobile), last icon within 1px of the app edge, bar hides on scroll down and returns on scroll up with the backdrop only when stuck. Links: framesnfold IG, `@nawaz_frames` IG (ember dot), YouTube `@framesnfold` (channel confirmed live).
- Buttons verified static: pointermove leaves `transform: none` and sets no `--bx/--by`; on hover the button stays put and the `↗` computes to `translate(3px, -3px)`.
- Pause/resume verified: pointerenter on the deck adds `.paused` and the timecode holds; a click while the pointer stays on the deck removes `.paused` and the count runs again (2.73s in 3s); keyboard focus pauses and blur resumes. The old bug was `onFocus` pausing for mouse clicks too, leaving `focusing` true until the user clicked away.
- Reel playback verified with generated 9:16 test clips: only the active panel plays, click/`ArrowRight`/swipe/horizontal wheel switch and reset to 0, hover holds and leaving resumes, a missing `shop.mp4` fell back to the drawn scene with no console errors.
- Dwell verified with generated 4 s and 7 s clips: a 4.046 s clip set `--dwell: 4.0457s` on `.hero`, and both the phrase underline and the panel progress computed to `4.0457s`; a 7.057 s clip set `7.0568s` everywhere; the missing reel kept `3.8s`. Re-switching applied the stored length in the same render as the new `on` classes. The bars can start slightly before the video finishes decoding in this in-app browser (~1.4 s on a 4 s clip there), so the ends are not frame-perfect in that environment; real hardware should be much closer.
- Retry verified with a local server that stalled requests: at ~4 s the panel showed the placeholder, then one `emptied` event from `el.load()` was followed by `loadedmetadata`/`loadeddata` and playback. With every request stalled there was still exactly one `emptied` after 9.5 s (no second retry). A 404 fired `error` once, never retried, and kept the placeholder. The clips, server script and temporary src were removed.
- Booking verified both ways: with `whatsappNumber` empty the ghost CTA reads "Book a reel on Instagram" → `https://ig.me/m/framesnfold`; with a number set (spaces allowed, stripped to digits) it reads "Book a reel on WhatsApp" → `https://wa.me/<digits>?text=<encoded message>`. Numbers are never hardcoded in components. The test number was reverted to `''`.
- Link preview verified: tags parse in `index.html`, `public/og.png` is exactly 1200×630 and 64 KB (ink `#0e0d0c` background, cream wordmark, ember rule and mark).
- Still worth checking on a real phone: fold animation (3D, `backface-visibility`), tilt feel, letter effect, anything clipped.
- `public/reels/` is empty apart from `.gitkeep` and `public/nawaz.jpg` is absent, so the hero panels, all six Work tiles and the About photo show drawn placeholders. No real footage, logo or photo yet. All generated test media was deleted and never committed.

## Real footage
The video-in-the-fold question is settled: one `<video>` under the continuous scene, poster JPEG for the fold halves. Adding clips is now just files:

```
public/reels/bike.mp4   public/reels/bike.jpg
public/reels/shop.mp4   public/reels/shop.jpg
public/reels/offer.mp4  public/reels/offer.jpg

public/reels/work-1.mp4  public/reels/work-1.jpg
public/reels/work-2.mp4  public/reels/work-2.jpg
public/reels/work-3.mp4  public/reels/work-3.jpg
public/reels/work-4.mp4  public/reels/work-4.jpg
public/reels/work-5.mp4  public/reels/work-5.jpg
public/reels/work-6.mp4  public/reels/work-6.jpg

public/nawaz.jpg
```

9:16, H.264, no audio, roughly 2 MB each for reels. README has the ffmpeg commands. No code change is needed.
The hero clip length drives `--dwell`, clamped to 3–8 s (a 9 s reel dwells 8 s). Clips shorter than 3 s hold for 3 s; the HUD timecode is its own 30 fps count.

## Next steps
1. Review on a real phone (fold, tilt, small-screen spacing, Work tile playback), then fix what looks off.
2. Drop the three hero clips and six Work clips with posters into `public/reels/` (see above) and check them on mobile data.
3. Add `public/nawaz.jpg` (square or vertical, under about 300 KB); the drawn "N" panel goes away on its own.
4. Replace the Work titles in `src/data/work.ts` and the placeholder About copy in `src/components/About/About.tsx`.
5. Real brand assets if they exist (logo, colours), then adjust the ember accent if needed. Swap `og.png` if the wordmark or accent changes.
6. Set `whatsappNumber` in `src/config.ts` once Nawaz picks a number; every booking button, the number block and "Message on Instagram" switch over on their own.
7. Deploy to Vercel (GitHub push is done), then point the OG/canonical URLs at the real domain if one is added.

## Working preferences
- Concise, technically precise answers. Practical, role-specific guidance over generic advice.
- Push back with specific reasons when a suggestion does not fit.
- When showing code changes, include a small before/after or sample output where it helps.
