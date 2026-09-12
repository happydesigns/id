# Nuxt UI component playground

These examples are adapted from Nuxt UI's MIT-licensed Theme Studio:
https://github.com/nuxt/ui/tree/2b29c33f45cdfe6e9d2ca0bafba6a6d49d299ff4/docs/app/components/playground

The original license is preserved in LICENSE.md. The standard Lucide icon map
in ../../playground-icons.ts comes from the same revision's docs/app/utils/theme/icons.ts.

Keep the upstream card composition, spacing, controls and tile order. Local changes:

- Explicit local imports and reactive icon mappings from the Studio icon-set selection (see ../../ICON-NOTICE.md).
- Demo toast IDs and explicit local-only feedback for actions.
- All 21 examples remain accessible at narrow widths.
- Native ResizeObserver measures the iframe container; UScrollArea owns its single scroll area.
- The input example supports Studio's error state.

Names, figures and avatars are demonstration content from Nuxt UI, not id product data.
Compare this pinned source before refreshing the examples; do not overwrite local integration changes.
