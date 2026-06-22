# Design Direction

`@happydesigns/id` is not one visual identity. It is the system that makes visual identities durable, inspectable, and usable in Nuxt projects.

## Nuxt UI First

Use Nuxt UI as the default component and theme system.

- Map raw brand palettes to Nuxt UI semantic roles.
- Configure shared component behavior in `app.config.ts`.
- Use CSS variables for surfaces, text, borders, radius, container width, and typography.
- Keep local component styling small and semantic.
- Prefer real Nuxt UI examples in documentation and playground surfaces.

## Brand Guide First

A brand layer should be generated from a clear brand guide, not from scattered styling fixes.

The brand guide should describe:

- identity metadata
- logo and asset roles
- color palettes and semantic mappings
- light and dark CSS variables
- typography roles
- Nuxt UI component defaults
- voice and copy rules
- component coverage status
- usage limits

## Runtime Theme Discipline

Runtime switching should feel instant and predictable. Keep runtime themes limited to stable values:

- CSS custom properties
- semantic color names
- `app.config.ts` defaults
- precompiled class strings

Do not make runtime themes responsible for arbitrary layouts, unbundled components, or product behavior.

## Visual QA

Every theme should be checked across:

- action hierarchy
- forms and validation states
- tables and dense data
- navigation
- overlays
- docs prose
- light and dark color modes
- mobile and desktop layouts
