# Design Direction

`@happydesigns/id` is not one visual identity. It is the Nuxt UI foundation that makes brand-guide decisions durable, inspectable, documented, and usable as Nuxt layers.

## Nuxt UI First

Use Nuxt UI as the default component and theme system.

- Map raw brand palettes to Nuxt UI semantic roles.
- Configure shared component behavior in `app.config.ts`.
- Use CSS variables for surfaces, text, borders, radius, container width, and typography.
- Keep local component styling small and semantic.
- Prefer real Nuxt UI examples in documentation and playground surfaces.
- Keep `id` runtime components globally prefixed. The default prefix is `Id`; apps can choose another prefix through the module when needed.

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

Store reusable brand data in a normal source file such as `brand.ts` when a brand repository needs to export, test, or reuse it. Use `app.config.ts` to expose the public Nuxt runtime contract.

Concrete brand packages own their doctrine. For example, `@happydesigns/brand` owns final happydesigns copy, logo rules, palette meaning, asset choices, and voice. `id` may ship neutral demonstration themes, but those examples should teach the foundation rather than smuggle a real brand source of truth into the reusable layer.

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
