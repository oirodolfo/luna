# Luna design tokens

The design system is defined from `/tmp/workspace/oirodolfo/luna/src/share/theme.js` and exposed in `/tmp/workspace/oirodolfo/luna/src/share/design-system/tokens.ts`.

## Adding tokens

1. Update `/tmp/workspace/oirodolfo/luna/src/share/theme.json` and regenerate theme outputs if needed.
2. Keep token names semantic so generated CSS variables stay stable.
3. Prefer consuming `var(--luna-...)` variables in component CSS and UnoCSS shortcuts instead of hardcoded values.

## Adding component styles

1. Import `../share/design-system/theme.css` and `../share/design-system/reset.css` from component styles when the package ships standalone CSS.
2. Reuse semantic CSS variables such as `--luna-color-text`, `--luna-color-bg-container`, and `--luna-border-radius`.
3. Add new UnoCSS shortcuts or theme entries in `/tmp/workspace/oirodolfo/luna/uno.config.ts` when a pattern is shared across components.
