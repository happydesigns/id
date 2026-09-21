# Changelog

## Unreleased

## 0.2.0 (2026-09-21)

### Features

- Make native Nuxt UI brand layers the recommended application boundary, with Studio and Docus as optional authoring tools.
- Make Studio with templates the default project export. Docus documentation is available through the explicit `guide: true` option.
- Add typed guide translations and an optional Studio entry link.

### Fixes

- Preserve Vue hook registration during Nuxt client optimization to fix production Guide hydration IDs.
- Make Coverage overflow keyboard accessible and correct UTF-8 labels.
- Exclude generated starter build files from the package.

### Maintenance

- Verify two interchangeable packed brands against identical application source, including fonts, colors, light/dark assets and interactions.
- Build and exercise the exported Studio without Docus, and require passing production form-label and tab-panel checks.
- Isolate bounded Studio undo/redo state without changing editor behavior.

### Upgrade notes

Replace the pinned ID archive and regenerate the lockfile. Existing runtime integrations and version-1 Studio documents remain compatible. Existing guide hosts keep their explicit Docus/Guide extensions; code expecting documentation from `createStudioProject` must pass `{ guide: true }`.

Native migrations require explicit `styles.css` imports. Remove targeted form `ClientOnly` workarounds only after the upgraded consumer passes production checks.

## 0.1.0

- Initial identity contracts, Nuxt runtime, templates, playground, and Docus documentation.
