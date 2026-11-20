# framesnfold

A scroll-driven 3D portfolio for Nawaz Kumanali. The viewport stays fixed while scrolling scrubs a single cinematic timeline through five beats: title, work grid, project close-up, services and contact.

## Development

```bash
npm install
npm run dev
```

## Checks

```bash
npm run build
npm run lint
```

## How it works

- `src/motion.ts` defines scroll progress keyframes for every layer.
- `src/App.tsx` maps `window.scrollY` directly to those keyframes. No autoplay, snapping, easing lag or swipe gestures.
- `src/components/Dust.tsx` draws scroll-driven particles on Canvas.
- `src/data/site.ts` holds projects, services and links. Real clips can be added there later.
- `prefers-reduced-motion` switches to a normal static stacked layout.

## Hero portrait

`public/hero/nawaz-hero-trimmed.png` is a transparently trimmed version of the supplied cut-out portrait. It sits on the right of the hero, overlapping the title inside a thin editorial frame with a crimson spotlight, ember rim light and ground shadow. It is driven by the same scroll timeline as the title. `HERO_IMAGE` in `src/data/site.ts` controls the source, so per-section portrait variations can be added later.

## Stack

Vite, React 19, TypeScript and plain CSS. No UI library and no 3D dependency.
