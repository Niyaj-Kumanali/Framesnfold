# framesnfold

Single-page portfolio for **framesnfold**, the reel and videography brand of
Nawaz Kumanali: reels for bike and car pages, shop openings and weekend offers.
The page runs from a one-viewport hero into Work, Services, About, Contact and a
quiet footer.

Vite + React 19 + TypeScript, plain CSS, no UI library. Dark only, one accent.

## Develop

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Links and booking

Accounts and the booking destination live in `src/config.ts`.

- Set `whatsappNumber` to the international format, digits only (`919876543210`).
  Every booking button then says "Book a reel on WhatsApp" and opens `wa.me` with
  `whatsappMessage` pre-filled. The contact block also shows the number and a
  Copy button, with "Message on Instagram" as the secondary option.
- Leave it empty and the booking buttons ask for an Instagram DM
  (`ig.me/m/framesnfold`).
- `instagram`, `instagramPersonal` and `youtube` feed the shared header and
  footer icons. The personal account carries the small ember dot.
- The hero's "Watch the reels" button scrolls to Work; the header's Work,
  Services and About links scroll to their sections.

## Page content

- Prices are in `src/data/prices.ts` and are formatted with `₹` and Indian digit
  grouping. The shop package is shown as "From ₹2,000 for 4 reels"; the quieter
  edit card reads "Simple edits from ₹100. With shooting, ₹300 to ₹500."
- The six Work entries are in `src/data/work.ts`. Rename the placeholder titles
  there; the `kind` field drives the filter row.
- About copy is a placeholder in `src/components/About/About.tsx`. Replace it
  with Nawaz's own words when he has them.
- The About photo is loaded from `public/nawaz.jpg`. Until that file exists, a
  same-size drawn panel with a large "N" takes its place, so nothing shifts.

## Adding reels

The three hero panels and the six Work tiles are wired for real footage. Drop
these files into `public/reels/` and nothing else needs to change:

```
public/reels/bike.mp4    public/reels/bike.jpg
public/reels/shop.mp4    public/reels/shop.jpg
public/reels/offer.mp4   public/reels/offer.jpg

public/reels/work-1.mp4  public/reels/work-1.jpg
public/reels/work-2.mp4  public/reels/work-2.jpg
public/reels/work-3.mp4  public/reels/work-3.jpg
public/reels/work-4.mp4  public/reels/work-4.jpg
public/reels/work-5.mp4  public/reels/work-5.jpg
public/reels/work-6.mp4  public/reels/work-6.jpg
```

- 9:16, about 5–8 s for the hero, H.264 MP4, no audio, under roughly **2 MB
  each**. Work tiles may be shorter; playback loops.
- The `.jpg` is the poster frame. The fold halves use it, and it stays up if a
  video cannot load or autoplay is blocked. Work tiles check the poster as an
  `Image` first, so a missing file never paints a broken-image icon.
- If a video is missing or unreadable, that panel or tile keeps its drawn
  placeholder. A slow hero start (about 4 s) shows the placeholder once and then
  retries a single time when that reel is on screen. The page never breaks.
- The hero clip's length sets the cycle timing, clamped to 3–8 s. Without a clip
  the original 3.8 s dwell is used.
- Only one Work video plays at a time: hover on desktop, keyboard focus, or the
  most visible tile on touch. The hidden tab and the open lightbox release it.
  Reduced motion shows posters only.

Compress a clip and pull a poster frame:

```bash
# compress: 9:16, 720x1280, no audio, web-friendly
ffmpeg -i in.mp4 -t 7 -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
  -c:v libx264 -crf 28 -preset slow -an -movflags +faststart public/reels/bike.mp4

# poster: first good frame as a small JPEG
ffmpeg -ss 1 -i public/reels/bike.mp4 -frames:v 1 -q:v 4 public/reels/bike.jpg
```
