# framesnfold

Portfolio hero for **framesnfold**, the reel and videography brand of Nawaz
Kumanali: reels for bike and car pages, shop openings and weekend offers.

Vite + React 19 + TypeScript, plain CSS, no UI library. Dark only, one accent.

## Develop

```bash
npm install
npm run dev
npm run build
npm run lint
```

## Adding reels

The three hero panels are wired for real footage. Drop these files into
`public/reels/` and nothing else needs to change:

```
public/reels/bike.mp4    public/reels/bike.jpg
public/reels/shop.mp4    public/reels/shop.jpg
public/reels/offer.mp4   public/reels/offer.jpg
```

- 9:16, 5–8 s, H.264 MP4, no audio, under about **2 MB each**.
- The `.jpg` is the poster frame. The fold halves use it, and it stays up if the
  video cannot load or autoplay is blocked.
- If a video is missing, unreadable or too slow to start (about 4 s), that panel
  falls back to the drawn placeholder scene. The page never breaks.

Compress a clip and pull a poster frame:

```bash
# compress: 9:16, 720x1280, no audio, web-friendly
ffmpeg -i in.mp4 -t 7 -vf "scale=720:1280:force_original_aspect_ratio=increase,crop=720:1280" \
  -c:v libx264 -crf 28 -preset slow -an -movflags +faststart public/reels/bike.mp4

# poster: first good frame as a small JPEG
ffmpeg -ss 1 -i public/reels/bike.mp4 -frames:v 1 -q:v 4 public/reels/bike.jpg
```
