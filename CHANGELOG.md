# Changelog

## v0.2.1

[compare changes](https://github.com/happydesigns/id/compare/v0.2.0...v0.2.1)

### 🚀 Enhancements

- **docs:** Demonstrate branding and share Studio profiles ([b8005a9](https://github.com/happydesigns/id/commit/b8005a9))

### 🩹 Fixes

- **package:** Type Nuxt options and verify supported entrypoints ([598208d](https://github.com/happydesigns/id/commit/598208d))
- **studio:** Enforce a shared UTF-8 document size limit ([2588db1](https://github.com/happydesigns/id/commit/2588db1))
- **studio:** Ship standalone exports and verify the optional guide ([88dd5de](https://github.com/happydesigns/id/commit/88dd5de))
- **theme:** Replace previous component defaults when switching brands ([5046159](https://github.com/happydesigns/id/commit/5046159))
- **package:** Preserve Nuxt and Tailwind compatibility ([2bea2a0](https://github.com/happydesigns/id/commit/2bea2a0))
- **ci:** Prepare Nuxt before compatibility tests ([9fc83de](https://github.com/happydesigns/id/commit/9fc83de))

### 💅 Refactors

- Share layer config and consolidate guide checks ([fa4ea58](https://github.com/happydesigns/id/commit/fa4ea58))
- **studio:** Generate projects from file-based starters ([eb33130](https://github.com/happydesigns/id/commit/eb33130))
- **studio:** Isolate preview storage and export behavior ([02f2240](https://github.com/happydesigns/id/commit/02f2240))
- **build:** Emit native ESM imports without postprocessing ([2feeb41](https://github.com/happydesigns/id/commit/2feeb41))
- **layers:** Adopt Nuxt app directories and file-based Studio routes ([42204c1](https://github.com/happydesigns/id/commit/42204c1))
- **package:** Derive module and scaffold dependency versions ([59d58de](https://github.com/happydesigns/id/commit/59d58de))
- **deps:** Centralize workspace and scaffold versions in pnpm catalog ([3c77879](https://github.com/happydesigns/id/commit/3c77879))
- **release:** Use changelog as the only release notes source ([bf5646e](https://github.com/happydesigns/id/commit/bf5646e))

### 📖 Documentation

- Consolidate identity architecture and usage guidance ([5dcbd5d](https://github.com/happydesigns/id/commit/5dcbd5d))
- Record layer layout and remaining research follow-ups ([08af5cc](https://github.com/happydesigns/id/commit/08af5cc))
- Define compatibility and source-format guarantees ([9c17be0](https://github.com/happydesigns/id/commit/9c17be0))
- Consolidate compatibility sources and CI runtime selection ([e93dd2f](https://github.com/happydesigns/id/commit/e93dd2f))
- **release:** Reconcile 0.2.0 notes with the tagged changes ([5dbb571](https://github.com/happydesigns/id/commit/5dbb571))
- Clarify shared branding across applications ([ce3d42a](https://github.com/happydesigns/id/commit/ce3d42a))

### 📦 Build

- **release:** Automate verified releases with changelogen ([c1c592a](https://github.com/happydesigns/id/commit/c1c592a))
- **release:** Verify automatic pre-1.0 version selection ([5b1a5a2](https://github.com/happydesigns/id/commit/5b1a5a2))

### 🏡 Chore

- **lint:** Enable Nuxt stylistic checks and lint project templates ([184e6b4](https://github.com/happydesigns/id/commit/184e6b4))
- **tests:** Consolidate browser artifacts and relocate fixture server ([8cce9fa](https://github.com/happydesigns/id/commit/8cce9fa))

### ✅ Tests

- **studio:** Verify HTTP access and production writer isolation ([03766a4](https://github.com/happydesigns/id/commit/03766a4))

### 🎨 Styles

- Apply Nuxt formatting and simplify redundant comments ([c1ba403](https://github.com/happydesigns/id/commit/c1ba403))

### 🤖 CI

- Check supported platforms and schedule dependency updates ([767012a](https://github.com/happydesigns/id/commit/767012a))

### ❤️ Contributors

- Jan Fröhlich ([@janfrl](https://github.com/janfrl))

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
