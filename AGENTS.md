# framesnfold portfolio: project context

## Current state
- The site is being rebuilt from a clean React + TypeScript scaffold. No design, content or media decisions are final yet.
- The previous redesign was intentionally reset. Git history still contains it, but the old design notes are not current guidance.

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
