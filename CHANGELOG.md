# Changelog

## Unreleased

## 0.2.0

- Make Studio with templates the default authoring host; Docus documentation is an explicit export option (`guide: true`). Existing guide integrations remain supported.
- Verify identical application source with two independent native brands, including fonts, colors, light/dark assets and interactions.
- Build and exercise the exported Studio without Docus.

Upgrade: replace the pinned ID archive and regenerate the lockfile. Existing guide hosts keep their explicit Docus/Guide extensions. Code expecting documentation from `createStudioProject` must now pass `{ guide: true }`; native runtime output and version-1 source documents remain compatible. Remove targeted form ClientOnly workarounds only after the upgraded consumer passes production checks.


- Fix production Guide hydration IDs by preserving Vue hook registration during Nuxt client optimization; require passing form-label and tab-panel regression checks.

- Make native Nuxt UI brand output the recommended application boundary; keep Studio and Docus optional.
- Add typed guide translations, an optional Studio entry link, accessible Coverage overflow and corrected UTF-8 labels.
- Add automated package-consumer and production browser checks.
- Isolate bounded Studio undo/redo state without changing editor behavior.

Existing runtime integrations remain supported. Native migrations require explicit styles.css imports; targeted form hydration workarounds can be removed after upgrading the Guide and verifying the consuming application. The initial registry release has not been published by this work.

## 0.1.0

- Initial identity contracts, Nuxt runtime, templates, playground, and Docus documentation.
