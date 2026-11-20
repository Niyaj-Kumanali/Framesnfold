# framesnfold portfolio: project context

## Current state
- The site is a scroll-driven 3D portfolio for **Nawaz Kumanali / framesnfold**.
- The viewport stays fixed; scrolling scrubs one continuous cinematic timeline. No snap, autoplay, swipe or easing lag.
- Five beats: title → work grid → project close-up → services → contact.
- Services are `Reels`, `Edits` and `Shoots` only. **No pricing.**
- Placeholder cards are used; real clips will be added later through `src/data/site.ts`.
- Hero uses a transparently trimmed version of the supplied cut-out portrait (`public/hero/nawaz-hero-trimmed.png`) on the right, overlapping the title inside a thin editorial frame with a crimson spotlight and ground shadow. It is driven by the scroll timeline. Different portrait variations per section are planned later.

## Design
- Dark cinematic crimson: near-black space, deep red glow, ember accents, muted cream type.
- Monogram mark: `NK` inside a thin frame with an ember diagonal cut, rendered as inline SVG.
- CSS 3D perspective, no WebGL and no 3D dependency.
- Every layer transform, opacity, blur and dust particle is a pure function of scroll progress.
- `prefers-reduced-motion` switches to a static stacked layout with normal scrolling.

## Stack
- Vite + React 19 + TypeScript, plain CSS files, no UI library.
- Keep the template's strict TypeScript settings: `verbatimModuleSyntax` (use `import type`), `noUnusedLocals`, `erasableSyntaxOnly` (no enums or parameter properties).
- Lint with ESLint 10 via `npm run lint` (`eslint .`).
- Deploy target is Vercel using the Vite preset.

## Working preferences
- Concise, technically precise answers.
- Push back with specific reasons when a suggestion does not fit.
- Confirm before destructive or irreversible actions.
- Test with `npm run build` and `npm run lint` before committing.
