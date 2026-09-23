import { builtinPalettes } from '../src/palettes'

// Nuxt UI 4 defaults, reapplied outside layers so a host brand cannot leak
// into a new identity. The edited document overrides these defaults afterward.
const palettes = Object.entries(builtinPalettes)
const declarations = palettes.flatMap(([name, shades]) => Object.entries(shades).map(([shade, value]) => `--color-${name === 'neutral' ? 'old-neutral' : name}-${shade}: ${value};`))
const roles = ['primary', 'secondary', 'success', 'info', 'warning', 'error']
export function createPreviewDefaultsCss(selector: string) {
  return `
${selector} {
  ${declarations.join('\n')}
  --font-sans: system-ui, sans-serif; --font-mono: ui-monospace, monospace; --font-display: var(--font-sans);
  --ui-radius: 0.25rem; --ui-container: 80rem;
  ${roles.map(role => `--ui-${role}: var(--ui-color-${role}-500);`).join('\n')}
  --ui-text-dimmed: var(--ui-color-neutral-400); --ui-text-muted: var(--ui-color-neutral-500);
  --ui-text-toned: var(--ui-color-neutral-600); --ui-text: var(--ui-color-neutral-700);
  --ui-text-highlighted: var(--ui-color-neutral-900); --ui-text-inverted: #fff;
  --ui-bg: #fff; --ui-bg-muted: var(--ui-color-neutral-50); --ui-bg-elevated: var(--ui-color-neutral-100);
  --ui-bg-accented: var(--ui-color-neutral-200); --ui-bg-inverted: var(--ui-color-neutral-900);
  --ui-border: var(--ui-color-neutral-200); --ui-border-muted: var(--ui-color-neutral-200);
  --ui-border-accented: var(--ui-color-neutral-300); --ui-border-inverted: var(--ui-color-neutral-900);
}
${selector}.dark {
  ${roles.map(role => `--ui-${role}: var(--ui-color-${role}-400);`).join('\n')}
  --ui-text-dimmed: var(--ui-color-neutral-500); --ui-text-muted: var(--ui-color-neutral-400);
  --ui-text-toned: var(--ui-color-neutral-300); --ui-text: var(--ui-color-neutral-200);
  --ui-text-highlighted: #fff; --ui-text-inverted: var(--ui-color-neutral-900);
  --ui-bg: var(--ui-color-neutral-900); --ui-bg-muted: var(--ui-color-neutral-800); --ui-bg-elevated: var(--ui-color-neutral-800);
  --ui-bg-accented: var(--ui-color-neutral-700); --ui-bg-inverted: #fff;
  --ui-border: var(--ui-color-neutral-800); --ui-border-muted: var(--ui-color-neutral-700);
  --ui-border-accented: var(--ui-color-neutral-700); --ui-border-inverted: #fff;
}
`
}
