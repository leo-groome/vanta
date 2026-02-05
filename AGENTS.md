# AGENTS

This file guides agentic coding tools in this repo.

## Project facts
- Vite + React 19 + TypeScript.
- Single-page marketing site in `src/App.tsx`.
- Styling lives in `src/index.css` and `src/App.css`.
- Email form uses EmailJS in `src/App.tsx`.
- No server code; purely client-side build.

## Install
- Preferred package manager: pnpm (lockfile present).
- `pnpm install`
- If pnpm is unavailable, use `npm install`.

## Run locally
- `pnpm dev` (or `npm run dev`).
- Vite dev server binds with `--host` for LAN testing.

## Build
- `pnpm build` runs TypeScript build + Vite build.
- Output goes to `dist/`.

## Preview production build
- `pnpm preview` (or `npm run preview`).

## Lint
- `pnpm lint` runs ESLint over the repo.
- ESLint uses flat config in `eslint.config.js`.
- Targeted files: `**/*.{ts,tsx}`.
- Ignores `dist/`.

## Test
- No test runner configured in `package.json`.
- There are no `test` scripts or test frameworks installed.
- If you add tests later, document single-test commands here.
- Example placeholder: `pnpm test -- <pattern>`.

## Single-test guidance
- Not currently applicable; add once a test runner exists.
- Keep future single-test commands explicit and fast.

## Formatting
- Codebase follows ESLint defaults and TypeScript strictness.
- Use 2-space indentation in TS/TSX and CSS.
- Prefer single quotes in TS/TSX strings.
- No semicolons in existing TS/TSX files; keep it consistent.
- Trailing commas are used in objects/arrays when multiline.
- Keep lines readable; wrap JSX props when they grow.

## Imports
- Order: React/JS built-ins, third-party, local modules, styles.
- Keep CSS imports after component imports.
- Use explicit `.tsx` extension only when required (see `src/main.tsx`).
- Avoid unused imports; `noUnusedLocals` is enabled.

## Naming conventions
- Components use PascalCase filenames and identifiers.
- Hooks use `useX` naming and stay at top level.
- Event handlers use `onX` prefix (e.g., `onSubmit`).
- Constants use `UPPER_SNAKE_CASE` when globally scoped.
- Content map keys use lower camel case (`ctaPrimary`, `hero`).
- CSS classes use kebab-case (`hero-grid`, `card-pad`).
- Boolean flags use `is/has/should` prefixes where possible.

## File organization
- App-level UI is centralized in `src/App.tsx`.
- Global styles and CSS variables live in `src/index.css`.
- Component-specific layout styles live in `src/App.css`.
- Vite config is in `vite.config.ts`.
- Keep new utilities in `src/` and import with relative paths.

## Types and TypeScript
- `strict: true` is enabled; avoid `any`.
- Use type aliases for complex shapes (see `FormState`).
- Prefer union literals for fixed variants (see `Lang`).
- Use `satisfies` for structured config objects when helpful.
- `noUnusedParameters` is enabled; name unused args `_` if needed.
- `noUncheckedSideEffectImports` is enabled; avoid side-effect-only imports.
- `moduleResolution: bundler` and `verbatimModuleSyntax` are on.

## React patterns
- Use functional components with hooks.
- Keep side effects localized; `useMemo` for derived constants.
- Prefer early returns for guard clauses.
- Keep event handlers inside the component unless shared.
- Keep strings in the `content` map for ES/EN content.
- Use `aria-*` attributes where appropriate.

## Internationalization
- Copy is stored in the `content` map in `src/App.tsx`.
- When adding text, update both `es` and `en`.
- Keep keys consistent between locales.
- Preserve the language toggle (`ES`/`EN`) behavior.

## State and forms
- Form state is a single object; update via functional `setForm`.
- Keep validation simple: check required fields before submit.
- Preserve the honeypot field for spam reduction.
- Status values are `'idle' | 'loading' | 'success' | 'error'`.

## Error handling
- Prefer explicit guards and `try/catch` for async flows.
- On error, set UI state rather than throwing.
- Avoid silent failures; reflect errors in UI where possible.
- Do not log secrets to the console.

## CSS and styling
- Global variables live in `src/index.css` under `:root`.
- Use existing CSS variables for colors, spacing, and radii.
- Keep new styles in `src/App.css` unless truly global.
- Maintain the dark gradient background aesthetic.
- Use `Space Grotesk` and `Plus Jakarta Sans` as defined.
- Prefer utility-like class names already in use.

## Accessibility
- Use semantic elements (`header`, `nav`, `section`, `footer`).
- Ensure focus states remain visible.
- Provide labels for form inputs.
- Keep contrast consistent with existing theme.

## Assets
- Static assets live in `public/`.
- Import images via `src/` when bundling is needed.

## Environment variables
- EmailJS config is read from Vite env vars:
- `VITE_EMAILJS_SERVICE_ID`
- `VITE_EMAILJS_PUBLIC_KEY`
- `VITE_EMAILJS_TEMPLATE_ID_LEAD`
- `VITE_EMAILJS_TEMPLATE_ID_AUTOREPLY`
- Do not commit real secrets or private keys.

## Tooling notes
- ESLint plugins: react-hooks + react-refresh + typescript-eslint.
- No Prettier configuration present.
- Type checking runs as part of `pnpm build` via `tsc -b`.

## Repo hygiene
- Keep changes focused to the request.
- Avoid modifying `node_modules/` or lockfiles unless needed.
- Run lint before opening a PR if time allows.

## Cursor / Copilot rules
- No `.cursor/rules`, `.cursorrules`, or Copilot instructions found.
- If added later, update this file with their contents.

## Updating this file
- Keep it around 150 lines for quick scanning.
- Prefer concrete commands over general guidance.
- Reflect any new tooling (tests, formatting, CI) promptly.
