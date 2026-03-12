# AGENTS

This file guides agentic coding tools in this repo.

## Project facts
- Vite + React 19 + TypeScript + Tailwind CSS v4.
- Animations powered by `framer-motion` for page transitions and interactive reveals.
- Main marketing site in `src/App.tsx` and CRM Specialized page in `src/pages/Services.tsx`.
- Localization handled by `react-i18next` with JSON files in `src/locales/`.
- Forms use a dual submission strategy: Formspree (email) + Google Sheets Webhook (data backup).
- No server code; purely client-side build with third-party API integrations.

## Install
- Preferred package manager: npm (package-lock.json present).
- `npm install`

## Run locally
- `npm run dev`.
- Vite dev server binds with `--host` for LAN testing.

## Build
- `npm run build` runs TypeScript build + Vite build.
- Output goes to `dist/`.

## Preview production build
- `npm run preview`.

## Lint
- `npm run lint` runs ESLint over the repo.
- ESLint uses flat config in `eslint.config.js`.
- Targeted files: `**/*.{ts,tsx}`.

## Test
- No test runner configured in `package.json`.

## Formatting
- Codebase follows ESLint defaults and TypeScript strictness.
- Use 2-space indentation in TS/TSX and CSS.
- Semicolons are used in `App.tsx` but omitted in some newer components; prefer consistency with the file being edited.
- Tailwind classes: Prefer shorthand opacity (e.g., `bg-white/5` instead of `bg-white/[0.05]`).

## Imports
- Order: React/JS built-ins, third-party, local components, pages, assets, styles.
- Avoid unused imports to satisfy `noUnusedLocals`.

## Naming conventions
- Components: PascalCase for filenames and identifiers.
- Pages: Located in `src/pages/`.
- Translation keys: snake_case (e.g., `crm_promo.title`).
- Styles: Kebab-case for custom CSS classes.

## File organization
- `src/App.tsx`: Main landing page and routing.
- `src/pages/`: specialized feature pages (e.g., `Services.tsx`).
- `src/locales/`: i18n translation bundles (`es/`, `en/`).
- `src/index.css`: Global styles, Tailwind directives, and root variables.

## Types and TypeScript
- Strict mode enabled; avoid `any`.
- Define interfaces for form state and API responses.

## Internationalization
- Always update `src/locales/es/translation.json` and `src/locales/en/translation.json` in tandem.
- Use the `useTranslation` hook from `react-i18next`.

## State and forms
- `onSubmit` in `App.tsx` handles asynchronous dual submission to Formspree and Google Sheets.
- Maintain honeypot fields and validation status (`idle`, `loading`, `success`, `error`).

## Tooling
- Tailwind CSS v4 with `@theme` blocks in `index.css`.
- `framer-motion` for complex UI choreography (transitions, reveals).
- `lucide-react` and `material-symbols` for iconography.
- Google Search Console and Analytics snippets in `index.html`.

## Repo hygiene
- Keep changes focused and verify with `npm run build`.
- Avoid modifying lockfiles unnecessarily.

## Updating this file
- Reflect significant changes in tech stack or routing promptly.
- Keep it concise for agent context efficiency.
