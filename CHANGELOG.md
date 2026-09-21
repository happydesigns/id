# Changelog

## Unreleased

- Make native Nuxt UI brand output the recommended application boundary; keep Studio and Docus optional.
- Add typed guide translations, an optional Studio entry link, accessible Coverage overflow and corrected UTF-8 labels.
- Add automated package-consumer and production browser checks.
- Isolate bounded Studio undo/redo state without changing editor behavior.

Existing runtime integrations remain supported. Native migrations require explicit styles.css imports; do not remove consumer hydration workarounds until GUIDE-001 is resolved. The initial registry release has not been published by this work.

## 0.1.0

- Initial identity contracts, Nuxt runtime, templates, playground, and Docus documentation.
