# Changelog

## v0.2.3

> Corrects the prerendered Markdown embed fixture used by the browser verification suite.

### Changelog

[compare changes](https://github.com/happydesigns/id/compare/v0.2.2...v0.2.3)

### 🩹 Fixes

- **test:** Prerender Markdown Studio embed fixture ([601510e](https://github.com/happydesigns/id/commit/601510e))

### ❤️ Contributors

- Jan Fröhlich ([@janfrl](https://github.com/janfrl))

## v0.2.2

> Adds application previews, a DevTools editor and shared brand-portal controls, with improvements to native brand generation and preview isolation.

### Changelog

[compare changes](https://github.com/happydesigns/id/compare/v0.2.1...v0.2.2)

### 🚀 Enhancements

- **studio:** Preview independent Nuxt apps in development ([85bb3f0](https://github.com/happydesigns/id/commit/85bb3f0))
- **studio:** Allow standard palette overrides and reset ([8af768e](https://github.com/happydesigns/id/commit/8af768e))
- **docs:** Add editable appearance menu and Nuxt UI presets ([0c34218](https://github.com/happydesigns/id/commit/0c34218))
- **devtools:** Edit the running application with shared theme controls ([365b0e7](https://github.com/happydesigns/id/commit/365b0e7))
- **preview:** Support explicit published application previews ([da2c64f](https://github.com/happydesigns/id/commit/da2c64f))
- **docs:** Reuse Studio previews and compact theme controls ([263b4b3](https://github.com/happydesigns/id/commit/263b4b3))
- **studio:** Embed editor in brand portals and refresh stale snapshots ([66fa702](https://github.com/happydesigns/id/commit/66fa702))
- **studio:** Separate homepage previews from the editor ([cd0a213](https://github.com/happydesigns/id/commit/cd0a213))
- **studio:** Expand previews without losing state ([da3c623](https://github.com/happydesigns/id/commit/da3c623))
- **studio:** Make expanded previews edge to edge ([d5318a8](https://github.com/happydesigns/id/commit/d5318a8))
- **studio:** Support host palette labels and groups ([4f9914c](https://github.com/happydesigns/id/commit/4f9914c))
- **guide:** Share preview-first starter and anchor navigation ([4a55401](https://github.com/happydesigns/id/commit/4a55401))

### 🔥 Performance

- **studio:** Defer theme editor and initialize previews once ([63739bc](https://github.com/happydesigns/id/commit/63739bc))

### 🩹 Fixes

- **studio:** Preserve project configuration during brand regeneration ([022f620](https://github.com/happydesigns/id/commit/022f620))
- **studio:** Enforce size guards at transfer boundaries ([c8e54a5](https://github.com/happydesigns/id/commit/c8e54a5))
- **preview:** Preserve explicitly owned app overrides ([6943f82](https://github.com/happydesigns/id/commit/6943f82))
- **palettes:** Resolve upstream and brand colors consistently ([97036aa](https://github.com/happydesigns/id/commit/97036aa))
- **docs:** Keep header actions subtle across brand themes ([b1e4930](https://github.com/happydesigns/id/commit/b1e4930))
- **docs:** Share navigation defaults between header and footer ([224a748](https://github.com/happydesigns/id/commit/224a748))
- **docs:** Use native page sections and highlighted code groups ([7676361](https://github.com/happydesigns/id/commit/7676361))
- **docs:** Refine landing composition and responsive spacing ([7063dfd](https://github.com/happydesigns/id/commit/7063dfd))
- **theme:** Restore branding before hydration ([86ce48c](https://github.com/happydesigns/id/commit/86ce48c))
- **docs:** Simplify the preset catalog and share theme icons ([df240aa](https://github.com/happydesigns/id/commit/df240aa))
- **docs:** Simplify header and defer interactive template previews ([48c52ef](https://github.com/happydesigns/id/commit/48c52ef))
- **docs:** Align preview spacing and nested corner radii ([cd0a7e6](https://github.com/happydesigns/id/commit/cd0a7e6))
- **docs:** Keep cached theme styles out of preview frames ([0f0ccea](https://github.com/happydesigns/id/commit/0f0ccea))
- **studio:** Preserve UI defaults during client navigation ([c8f67c3](https://github.com/happydesigns/id/commit/c8f67c3))
- **docs:** Bundle theme and preview icons locally ([c7e42c5](https://github.com/happydesigns/id/commit/c7e42c5))
- **docs:** Theme template thumbnails like Studio ([3d96ad0](https://github.com/happydesigns/id/commit/3d96ad0))
- **docs:** Render theme fonts and native hero code ([b3c1e59](https://github.com/happydesigns/id/commit/b3c1e59))
- **studio:** Scope layout resets to the active editor ([51bd7da](https://github.com/happydesigns/id/commit/51bd7da))
- **studio:** Hide preview until its themed render is ready ([db5e195](https://github.com/happydesigns/id/commit/db5e195))
- **docs:** Align header and simplify footer ([84a3c7f](https://github.com/happydesigns/id/commit/84a3c7f))
- **docs:** Group documentation in the sidebar ([5f12fa4](https://github.com/happydesigns/id/commit/5f12fa4))
- **studio:** Preserve readonly editor props across consumers ([f7bd4e7](https://github.com/happydesigns/id/commit/f7bd4e7))
- **studio:** Use compiled core in source endpoint ([8d3546d](https://github.com/happydesigns/id/commit/8d3546d))
- **studio:** Synchronize embedded color mode before paint ([f2e2382](https://github.com/happydesigns/id/commit/f2e2382))
- **studio:** Inherit host color preference on navigation ([90e9229](https://github.com/happydesigns/id/commit/90e9229))
- **studio:** Handle navigation in homepage template previews ([1920679](https://github.com/happydesigns/id/commit/1920679))
- **studio:** Simplify expanded preview controls ([98c33c5](https://github.com/happydesigns/id/commit/98c33c5))
- **studio:** Keep preview avatars and shortcuts reliable ([6a0e310](https://github.com/happydesigns/id/commit/6a0e310))
- **studio:** Keep embedded previews contained and menus accessible ([997eaee](https://github.com/happydesigns/id/commit/997eaee))
- **guide:** Offset anchor targets below the sticky header ([74f9194](https://github.com/happydesigns/id/commit/74f9194))
- **studio:** Remove redundant authoring link from showcase ([a660740](https://github.com/happydesigns/id/commit/a660740))

### 💅 Refactors

- **studio:** Separate theme editor from project lifecycle ([2b52cfb](https://github.com/happydesigns/id/commit/2b52cfb))
- **templates:** Demonstrate generated brand ownership ([64d9bfb](https://github.com/happydesigns/id/commit/64d9bfb))
- **studio:** Use one native brand asset configuration ([0dbafdc](https://github.com/happydesigns/id/commit/0dbafdc))
- **studio:** Make editor acceptance explicit ([a4a5bde](https://github.com/happydesigns/id/commit/a4a5bde))
- **studio:** Share brand rendering and preview application ([ad57e59](https://github.com/happydesigns/id/commit/ad57e59))
- **studio:** Isolate unsaved draft navigation decisions ([9adffa4](https://github.com/happydesigns/id/commit/9adffa4))
- **studio:** Separate document and export responsibilities ([58303d2](https://github.com/happydesigns/id/commit/58303d2))
- **studio:** Share font and radius presets ([2388d8a](https://github.com/happydesigns/id/commit/2388d8a))

### 📖 Documentation

- Define native branding ownership and roadmap ([f63cf97](https://github.com/happydesigns/id/commit/f63cf97))
- **studio:** Explain development app connections ([c79b381](https://github.com/happydesigns/id/commit/c79b381))
- Record completed native branding workflow proof ([e76ebde](https://github.com/happydesigns/id/commit/e76ebde))
- Assess remaining authoring and compatibility responsibilities ([85c104e](https://github.com/happydesigns/id/commit/85c104e))
- Consolidate development guidance in Docus ([7c28486](https://github.com/happydesigns/id/commit/7c28486))
- **readme:** Focus overview and link to installation guides ([ed8fcd8](https://github.com/happydesigns/id/commit/ed8fcd8))
- Align native onboarding and verify public integration examples ([f617e60](https://github.com/happydesigns/id/commit/f617e60))
- Align identity tooling with Nuxt upstream direction ([16ece47](https://github.com/happydesigns/id/commit/16ece47))
- Define shared theme tooling and preview vision ([d111d93](https://github.com/happydesigns/id/commit/d111d93))
- Plan DevTools and real-app preview proof ([68f54af](https://github.com/happydesigns/id/commit/68f54af))
- Link the real capability verification workflow ([ad5cdff](https://github.com/happydesigns/id/commit/ad5cdff))
- Clarify default portal and embedded preview vision ([080d7e3](https://github.com/happydesigns/id/commit/080d7e3))
- **studio:** Describe shared live template gallery ([767610b](https://github.com/happydesigns/id/commit/767610b))

### ✅ Tests

- **studio:** Verify independent app previews across origins ([3f06f04](https://github.com/happydesigns/id/commit/3f06f04))
- **studio:** Prove two-app native branding workflow ([ac45573](https://github.com/happydesigns/id/commit/ac45573))
- **studio:** Await initial app preview readiness ([182e47d](https://github.com/happydesigns/id/commit/182e47d))
- **studio:** Compare native appearance across app states and widths ([7c5b040](https://github.com/happydesigns/id/commit/7c5b040))
- **preview:** Prove branding with real Course and Booking apps ([85e7d98](https://github.com/happydesigns/id/commit/85e7d98))
- **studio:** Cover embedded editor in Docus Markdown ([e259565](https://github.com/happydesigns/id/commit/e259565))

### 🎨 Styles

- **docs:** Separate preview controls with a horizontal rule ([3cb16fe](https://github.com/happydesigns/id/commit/3cb16fe))
- **studio:** Group preview actions consistently ([2af883b](https://github.com/happydesigns/id/commit/2af883b))

### ❤️ Contributors

- Jan Fröhlich ([@janfrl](https://github.com/janfrl))

## v0.2.1

> Hardens package compatibility, standalone Studio exports and theme switching, and introduces the Changelogen release workflow.

### Changelog

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

## v0.2.0

> Introduces the native Nuxt UI brand authoring workflow, with Studio project exports and optional Docus guides.

### Upgrade notes

Replace the pinned ID archive and regenerate the lockfile. Existing runtime integrations and version-1 Studio documents remain compatible. Existing guide hosts keep their explicit Docus/Guide extensions; code expecting documentation from `createStudioProject` must pass `{ guide: true }`.

Native migrations require explicit `styles.css` imports. Remove targeted form `ClientOnly` workarounds only after the upgraded consumer passes production checks.

### Changelog

[compare changes](https://github.com/happydesigns/id/compare/69b425c9d2d52da019cae8738fdeac8ccbc36bfc...v0.2.0)

### 🚀 Enhancements

- Add identity contracts and theme runtime ([2202be4](https://github.com/happydesigns/id/commit/2202be4))
- Add Nuxt integration and starter templates ([628918d](https://github.com/happydesigns/id/commit/628918d))
- Enrich runtime themes and playground controls ([d40b609](https://github.com/happydesigns/id/commit/d40b609))
- Simplify brand theme contract ([b521d8f](https://github.com/happydesigns/id/commit/b521d8f))
- Demo shipped identity defaults ([ba2ea66](https://github.com/happydesigns/id/commit/ba2ea66))
- Support brand-neutral logo roles ([c97abb1](https://github.com/happydesigns/id/commit/c97abb1))
- Add docs brand theme switcher ([a596f86](https://github.com/happydesigns/id/commit/a596f86))
- Harden package exports and theme runtime ([1df28e5](https://github.com/happydesigns/id/commit/1df28e5))
- Add nuxt ui docs link helper ([dc7b934](https://github.com/happydesigns/id/commit/dc7b934))
- Add brand guide example frame ([14b50b9](https://github.com/happydesigns/id/commit/14b50b9))
- Add layer install surface ([0207dc1](https://github.com/happydesigns/id/commit/0207dc1))
- Add component coverage table ([9b11451](https://github.com/happydesigns/id/commit/9b11451))
- Add guide section helpers ([838a931](https://github.com/happydesigns/id/commit/838a931))
- Document starter logo assets ([f72b964](https://github.com/happydesigns/id/commit/f72b964))
- Add generic brand identity contract ([12ea0da](https://github.com/happydesigns/id/commit/12ea0da))
- Seed brand-layer starters with identity source ([d4a4735](https://github.com/happydesigns/id/commit/d4a4735))
- Map guide assets into runtime assets ([5d3949d](https://github.com/happydesigns/id/commit/5d3949d))
- Carry guide asset metadata into runtime assets ([8db0eab](https://github.com/happydesigns/id/commit/8db0eab))
- Resolve logo media from color mode ([d6f44b2](https://github.com/happydesigns/id/commit/d6f44b2))
- Wire starter logos through id assets ([1fbf3b8](https://github.com/happydesigns/id/commit/1fbf3b8))
- Replace brand demo theme with neutral sample ([f0cc675](https://github.com/happydesigns/id/commit/f0cc675))
- Resolve valid initial brand theme ([41eddd6](https://github.com/happydesigns/id/commit/41eddd6))
- Expose brand guide composable ([966762d](https://github.com/happydesigns/id/commit/966762d))
- Add reusable component examples ([78a94ee](https://github.com/happydesigns/id/commit/78a94ee))
- **component-examples:** Allow branded asset preview surfaces ([e774007](https://github.com/happydesigns/id/commit/e774007))
- Allow component examples to set accent color ([85d29f3](https://github.com/happydesigns/id/commit/85d29f3))
- Add brand adapter contracts ([b501dd4](https://github.com/happydesigns/id/commit/b501dd4))
- Add adapter contract playground ([55e7b08](https://github.com/happydesigns/id/commit/55e7b08))
- Add canonical brand layer template ([66b3df2](https://github.com/happydesigns/id/commit/66b3df2))
- **studio:** Add Nuxt UI brand editing and project export ([19ac56d](https://github.com/happydesigns/id/commit/19ac56d))
- **studio:** Create a compact viewport workspace and richer gallery ([454dfcf](https://github.com/happydesigns/id/commit/454dfcf))
- **studio:** Support capability-owned templates and page navigation ([10ba850](https://github.com/happydesigns/id/commit/10ba850))
- **studio:** Complete local projects and visual brand authoring ([5b563c7](https://github.com/happydesigns/id/commit/5b563c7))
- **studio:** Add native brand workspace and connected source review ([01fc08b](https://github.com/happydesigns/id/commit/01fc08b))
- **studio:** Separate brand library from project actions ([d7be8ac](https://github.com/happydesigns/id/commit/d7be8ac))
- **studio:** Manage browser-saved brands ([ed5150f](https://github.com/happydesigns/id/commit/ed5150f))
- **studio:** Add responsive viewport dimensions and presets ([3a58634](https://github.com/happydesigns/id/commit/3a58634))
- **studio:** Resize previews by dragging and simplify view menu ([10370e6](https://github.com/happydesigns/id/commit/10370e6))
- **studio:** Simplify brand authoring and download workflows ([a9e58a3](https://github.com/happydesigns/id/commit/a9e58a3))
- **studio:** Separate palette creation and management ([eb23558](https://github.com/happydesigns/id/commit/eb23558))
- **studio:** Expand native component gallery into independent examples ([a7cd460](https://github.com/happydesigns/id/commit/a7cd460))
- **studio:** Add visual template gallery with preview images ([8bb700c](https://github.com/happydesigns/id/commit/8bb700c))
- **studio:** Add audited icon packs and reactive icon resolution ([4dfa68c](https://github.com/happydesigns/id/commit/4dfa68c))
- **studio:** Replace the gallery with native Nuxt UI playground examples ([9bbaa00](https://github.com/happydesigns/id/commit/9bbaa00))
- **studio:** Add a native radio picker for icon sets ([40af798](https://github.com/happydesigns/id/commit/40af798))
- **studio:** Reorganize authoring menus and add scoped randomization ([fa29ee5](https://github.com/happydesigns/id/commit/fa29ee5))
- **guide:** Derive brand references from Studio documents ([82cd8c1](https://github.com/happydesigns/id/commit/82cd8c1))
- **studio:** Configure host navigation and protect unsaved exits ([7df7cf0](https://github.com/happydesigns/id/commit/7df7cf0))
- **studio:** Render branded live template thumbnails on demand ([64b76cb](https://github.com/happydesigns/id/commit/64b76cb))
- **guide:** Add typed messages and optional Studio entry point ([9e9719f](https://github.com/happydesigns/id/commit/9e9719f))
- **studio:** Prepare reviewed local packages by checksum ([3a7b4cd](https://github.com/happydesigns/id/commit/3a7b4cd))
- **studio:** Make Docus guides an explicit extension ([7fcc24e](https://github.com/happydesigns/id/commit/7fcc24e))

### 🔥 Performance

- **studio:** Defer component gallery until its scene is selected ([51da3c6](https://github.com/happydesigns/id/commit/51da3c6))

### 🩹 Fixes

- Dedupe merged brand themes ([f0dc551](https://github.com/happydesigns/id/commit/f0dc551))
- Stabilize runtime theme surfaces ([3fd505f](https://github.com/happydesigns/id/commit/3fd505f))
- Align layer type config with nuxt ([37aa5c8](https://github.com/happydesigns/id/commit/37aa5c8))
- Persist runtime theme selection ([ac8f6dc](https://github.com/happydesigns/id/commit/ac8f6dc))
- Align header logo content ([1628fa4](https://github.com/happydesigns/id/commit/1628fa4))
- Import brand theme composable in template ([0aaa1ba](https://github.com/happydesigns/id/commit/0aaa1ba))
- Typecheck themed app auto imports ([a7d620e](https://github.com/happydesigns/id/commit/a7d620e))
- Typecheck starter templates ([831176a](https://github.com/happydesigns/id/commit/831176a))
- Publish consumer-safe nuxt layer ([37202a9](https://github.com/happydesigns/id/commit/37202a9))
- Avoid dom types in theme runtime ([ada8c97](https://github.com/happydesigns/id/commit/ada8c97))
- Generate id docs statically ([327f72c](https://github.com/happydesigns/id/commit/327f72c))
- Render layer install with prose code groups ([d9dcab6](https://github.com/happydesigns/id/commit/d9dcab6))
- Share runtime compatibility defaults ([5266e12](https://github.com/happydesigns/id/commit/5266e12))
- Declare tailwind dependency ([c166ce7](https://github.com/happydesigns/id/commit/c166ce7))
- Declare tailwind peer dependency ([62bc34b](https://github.com/happydesigns/id/commit/62bc34b))
- Add nuxt ui root wrappers to starters ([fc65177](https://github.com/happydesigns/id/commit/fc65177))
- Neutralize theme state key ([b814acc](https://github.com/happydesigns/id/commit/b814acc))
- Validate layer install snippets ([1238999](https://github.com/happydesigns/id/commit/1238999))
- Type runtime app config updates ([04a0536](https://github.com/happydesigns/id/commit/04a0536))
- Adapt nuxt app config updates ([6598662](https://github.com/happydesigns/id/commit/6598662))
- Avoid compact install copy overlap ([98b4e92](https://github.com/happydesigns/id/commit/98b4e92))
- Prefer inverse assets for dark media ([d110641](https://github.com/happydesigns/id/commit/d110641))
- Prefer inverse logo roles for dark fallback ([2c84ecd](https://github.com/happydesigns/id/commit/2c84ecd))
- Keep starter logo label visible ([8dc52d2](https://github.com/happydesigns/id/commit/8dc52d2))
- Harden docs links opened in new tabs ([d2b9c37](https://github.com/happydesigns/id/commit/d2b9c37))
- Exercise starter logo in brand layer ([e3b5823](https://github.com/happydesigns/id/commit/e3b5823))
- Avoid async setup in install renderer ([b19dfd4](https://github.com/happydesigns/id/commit/b19dfd4))
- Restore async install highlighting ([7779a1b](https://github.com/happydesigns/id/commit/7779a1b))
- Name coverage table accessibly ([23b5762](https://github.com/happydesigns/id/commit/23b5762))
- Install nuxt ui from id module ([6fc30ae](https://github.com/happydesigns/id/commit/6fc30ae))
- Harden id docs github link ([11dfd6d](https://github.com/happydesigns/id/commit/11dfd6d))
- Align guide content voice examples ([70fb603](https://github.com/happydesigns/id/commit/70fb603))
- Declare nuxt ui module dependency ([3c61d9f](https://github.com/happydesigns/id/commit/3c61d9f))
- Render static install code streams ([4c22e7f](https://github.com/happydesigns/id/commit/4c22e7f))
- Keep install code visible while highlighting loads ([0e19f04](https://github.com/happydesigns/id/commit/0e19f04))
- Use cached shiki renderer for install code ([b058b55](https://github.com/happydesigns/id/commit/b058b55))
- Rely on prose code rendering ([e44afc8](https://github.com/happydesigns/id/commit/e44afc8))
- Keep asset preview surfaces fixed ([e0e09ee](https://github.com/happydesigns/id/commit/e0e09ee))
- **component-examples:** Isolate preview frames ([c25ab43](https://github.com/happydesigns/id/commit/c25ab43))
- **component-examples:** Refine page shell surface ([eea7c45](https://github.com/happydesigns/id/commit/eea7c45))
- Narrow validated color references ([a44af53](https://github.com/happydesigns/id/commit/a44af53))
- **ci:** Align peer installation policy ([674738a](https://github.com/happydesigns/id/commit/674738a))
- Suppress transitions during theme sync ([9f95aa1](https://github.com/happydesigns/id/commit/9f95aa1))
- Prevent embedded command palette autofocus ([b930f66](https://github.com/happydesigns/id/commit/b930f66))
- **docs:** Improve component example hierarchy ([291fd2a](https://github.com/happydesigns/id/commit/291fd2a))
- **dashboard:** Refine collapsed sidebar behavior ([bd72d72](https://github.com/happydesigns/id/commit/bd72d72))
- **playground:** Use shared studio and serve icons locally ([758477d](https://github.com/happydesigns/id/commit/758477d))
- **studio:** Synchronize shell and preview color modes ([c7d232e](https://github.com/happydesigns/id/commit/c7d232e))
- **studio:** Make main menu visible and group preview selectors ([e021a3e](https://github.com/happydesigns/id/commit/e021a3e))
- **studio:** Require named brands and quiet header selectors ([c09e04d](https://github.com/happydesigns/id/commit/c09e04d))
- **studio:** Keep viewport options readable ([e723f3a](https://github.com/happydesigns/id/commit/e723f3a))
- **studio:** Separate standard and responsive preview modes ([31b9f87](https://github.com/happydesigns/id/commit/31b9f87))
- **studio:** Restore active brands and use native toast feedback ([8e7ad74](https://github.com/happydesigns/id/commit/8e7ad74))
- **studio:** Stabilize loading and export dialog layout ([bf97a5b](https://github.com/happydesigns/id/commit/bf97a5b))
- **studio:** Keep template menu labels readable ([11f8e17](https://github.com/happydesigns/id/commit/11f8e17))
- **studio:** Render reliable palette colors in a visual picker ([bb88851](https://github.com/happydesigns/id/commit/bb88851))
- **studio:** Stabilize header selector geometry ([48160ec](https://github.com/happydesigns/id/commit/48160ec))
- **studio:** Suggest palettes by role and unify preview clipping ([8daafc6](https://github.com/happydesigns/id/commit/8daafc6))
- **studio:** Recover failed previews and isolate dev content cache ([62b5e0f](https://github.com/happydesigns/id/commit/62b5e0f))
- **studio:** Share draft theme and synchronize preview color mode ([e2a30cf](https://github.com/happydesigns/id/commit/e2a30cf))
- **studio:** Keep preview border inside clipped viewport ([9bff41a](https://github.com/happydesigns/id/commit/9bff41a))
- **studio:** Recover failed previews after dev updates ([8cdaf8e](https://github.com/happydesigns/id/commit/8cdaf8e))
- **studio:** Include components in preview menu ([5b7130d](https://github.com/happydesigns/id/commit/5b7130d))
- **studio:** Migrate the invalid Material light mode icon ([f2b59d4](https://github.com/happydesigns/id/commit/f2b59d4))
- **studio:** Synchronize preview preferences and constrain editor radii ([1777bb4](https://github.com/happydesigns/id/commit/1777bb4))
- **studio:** Preserve strict types in consuming Nuxt applications ([795583a](https://github.com/happydesigns/id/commit/795583a))
- **studio:** Label invitation fields and improve command result contrast ([725830e](https://github.com/happydesigns/id/commit/725830e))
- **studio:** Avoid echoing parent-driven preview navigation ([0e13c45](https://github.com/happydesigns/id/commit/0e13c45))
- **studio:** Preserve host wordmarks in product navigation ([c8f123f](https://github.com/happydesigns/id/commit/c8f123f))
- **studio:** Display host wordmarks without appended product text ([8e9fac5](https://github.com/happydesigns/id/commit/8e9fac5))
- **studio:** Name command palette results for assistive technology ([8941718](https://github.com/happydesigns/id/commit/8941718))
- **studio:** Balance header vertical spacing ([30775a3](https://github.com/happydesigns/id/commit/30775a3))
- **studio:** Keep balanced header spacing compact ([0849554](https://github.com/happydesigns/id/commit/0849554))
- **guide:** Register all components in a single directory scan ([784c23d](https://github.com/happydesigns/id/commit/784c23d))
- **guide:** Defer contrast mode label until hydration completes ([1efd6cb](https://github.com/happydesigns/id/commit/1efd6cb))
- **studio:** Only warn about unsaved brand changes ([c1ef459](https://github.com/happydesigns/id/commit/c1ef459))
- **nuxt:** Render color mode logos without hydration mismatch ([2fb1013](https://github.com/happydesigns/id/commit/2fb1013))
- **studio:** Export explicit brand stylesheet fragments ([d8e2f3d](https://github.com/happydesigns/id/commit/d8e2f3d))
- **theme:** Respect neutral palettes and native component defaults ([3387a80](https://github.com/happydesigns/id/commit/3387a80))
- **studio:** Preserve UTF-8 labels and documentation ([6a76644](https://github.com/happydesigns/id/commit/6a76644))
- **guide:** Make coverage overflow keyboard accessible ([b30a252](https://github.com/happydesigns/id/commit/b30a252))
- **deps:** Align editor peers for guide production builds ([85e9b2b](https://github.com/happydesigns/id/commit/85e9b2b))
- **guide:** Preserve Vue hydration ID boundaries ([88aaa71](https://github.com/happydesigns/id/commit/88aaa71))
- **package:** Exclude generated starter build files ([fb5addc](https://github.com/happydesigns/id/commit/fb5addc))

### 💅 Refactors

- Align brand themes with nuxt ui config ([e29edec](https://github.com/happydesigns/id/commit/e29edec))
- Clarify happydesigns demo theme ([ffd49ff](https://github.com/happydesigns/id/commit/ffd49ff))
- Neutralize runtime theme identifiers ([de7f3ee](https://github.com/happydesigns/id/commit/de7f3ee))
- Use neutral app config type filename ([aad5910](https://github.com/happydesigns/id/commit/aad5910))
- Centralize layer install code group source ([da532d2](https://github.com/happydesigns/id/commit/da532d2))
- Remove docus css compatibility hook ([00d857e](https://github.com/happydesigns/id/commit/00d857e))
- Render layer install with prose components ([e73caee](https://github.com/happydesigns/id/commit/e73caee))
- Separate runtime brand contracts ([ecaa6ed](https://github.com/happydesigns/id/commit/ecaa6ed))
- **layer:** Separate runtime and guide surfaces ([005c8ac](https://github.com/happydesigns/id/commit/005c8ac))
- **studio:** Simplify copy and adopt Nuxt UI controls ([24b4916](https://github.com/happydesigns/id/commit/24b4916))
- **studio:** Simplify header identity ([4d9087d](https://github.com/happydesigns/id/commit/4d9087d))
- **studio:** Simplify mobile navigation and secondary actions ([a0065c9](https://github.com/happydesigns/id/commit/a0065c9))
- **studio:** Refine workspace surfaces and gallery hierarchy ([ad4a2e0](https://github.com/happydesigns/id/commit/ad4a2e0))
- **studio:** Standardize popovers and toolbar controls on Nuxt UI ([4fa53d3](https://github.com/happydesigns/id/commit/4fa53d3))
- **studio:** Simplify the local brand manager ([979d5dd](https://github.com/happydesigns/id/commit/979d5dd))
- **studio:** Consolidate export formats in a compact dialog ([ef476ec](https://github.com/happydesigns/id/commit/ef476ec))
- **starter:** Use native brand layer and explicit stylesheet ([b414328](https://github.com/happydesigns/id/commit/b414328))
- **guide:** Use semantic translation message identifiers ([6ab54d4](https://github.com/happydesigns/id/commit/6ab54d4))
- **studio:** Isolate bounded document history ([2a74d2a](https://github.com/happydesigns/id/commit/2a74d2a))

### 📖 Documentation

- Add id product documentation ([ea413b0](https://github.com/happydesigns/id/commit/ea413b0))
- Add branded documentation header ([f22faec](https://github.com/happydesigns/id/commit/f22faec))
- Rename getting started introduction ([3233c85](https://github.com/happydesigns/id/commit/3233c85))
- Simplify landing hero actions ([228263f](https://github.com/happydesigns/id/commit/228263f))
- Clarify id and brand boundaries ([6fad318](https://github.com/happydesigns/id/commit/6fad318))
- Add brand migration guidance ([66a6eca](https://github.com/happydesigns/id/commit/66a6eca))
- Refine starter naming ([b2031ef](https://github.com/happydesigns/id/commit/b2031ef))
- Rename starter guide route ([01d3611](https://github.com/happydesigns/id/commit/01d3611))
- Clarify install code rendering ([47c3fc1](https://github.com/happydesigns/id/commit/47c3fc1))
- Clarify happydesigns demo boundary ([ff7dc7e](https://github.com/happydesigns/id/commit/ff7dc7e))
- Clarify id product scope ([245ff99](https://github.com/happydesigns/id/commit/245ff99))
- Document runtime theme identifiers ([81a9bc2](https://github.com/happydesigns/id/commit/81a9bc2))
- Document brand identity source pattern ([8f16365](https://github.com/happydesigns/id/commit/8f16365))
- Align onboarding with identity source model ([3eef643](https://github.com/happydesigns/id/commit/3eef643))
- Seed starters with guide asset mapping ([8931342](https://github.com/happydesigns/id/commit/8931342))
- Align asset role guidance ([f4dfc17](https://github.com/happydesigns/id/commit/f4dfc17))
- Clarify runtime prose code rendering ([21485fd](https://github.com/happydesigns/id/commit/21485fd))
- Explain coverage array replacement ([9404d2f](https://github.com/happydesigns/id/commit/9404d2f))
- Document runtime composables ([2ab1b07](https://github.com/happydesigns/id/commit/2ab1b07))
- Keep api reference aligned with exports ([f3f03e2](https://github.com/happydesigns/id/commit/f3f03e2))
- Add starter verification command ([5a74307](https://github.com/happydesigns/id/commit/5a74307))
- Clarify layer install highlighting ([83d680c](https://github.com/happydesigns/id/commit/83d680c))
- Document component examples ([d18852f](https://github.com/happydesigns/id/commit/d18852f))
- Document brand adapter workflow ([8ff62b6](https://github.com/happydesigns/id/commit/8ff62b6))
- Introduce the Nuxt UI brand studio workflow ([ee4ad18](https://github.com/happydesigns/id/commit/ee4ad18))
- **studio:** Explain native exports and local source ownership ([23ad7b4](https://github.com/happydesigns/id/commit/23ad7b4))
- **studio:** Document native controls and appearance workflows ([5ae4ebb](https://github.com/happydesigns/id/commit/5ae4ebb))
- **brand:** Clarify native runtime and integration boundaries ([171bb5c](https://github.com/happydesigns/id/commit/171bb5c))
- **id:** Define native brand and release contracts ([6cd0d50](https://github.com/happydesigns/id/commit/6cd0d50))
- **guide:** Record hydration cause and compatibility fix ([453e4fb](https://github.com/happydesigns/id/commit/453e4fb))

### 🏡 Chore

- Add contribution and agent guidance ([dcff373](https://github.com/happydesigns/id/commit/dcff373))
- Expose consumer-safe nuxt layer config ([c2646ff](https://github.com/happydesigns/id/commit/c2646ff))
- Rely on shared runtime compat ([9c19bed](https://github.com/happydesigns/id/commit/9c19bed))
- Make pnpm build approvals explicit ([13316ad](https://github.com/happydesigns/id/commit/13316ad))
- Align nuxt dependency ranges ([4d5f121](https://github.com/happydesigns/id/commit/4d5f121))
- Align starter dependency versions ([3050c9b](https://github.com/happydesigns/id/commit/3050c9b))
- Add project verification command ([b8c6444](https://github.com/happydesigns/id/commit/b8c6444))
- Update package tooling dependencies ([1ebc7a9](https://github.com/happydesigns/id/commit/1ebc7a9))
- **deps:** Update Nuxt to 4.5.2 ([08bacb7](https://github.com/happydesigns/id/commit/08bacb7))
- **deps:** Update compatible dependencies ([69e25e8](https://github.com/happydesigns/id/commit/69e25e8))
- Exclude local tooling caches ([5d89e11](https://github.com/happydesigns/id/commit/5d89e11))
- **starter:** Align authoring dependency lockfile ([24ea217](https://github.com/happydesigns/id/commit/24ea217))
- **release:** Prepare id 0.2.0 ([a2f4ca4](https://github.com/happydesigns/id/commit/a2f4ca4))

### ✅ Tests

- Add identity contract coverage ([76fe03f](https://github.com/happydesigns/id/commit/76fe03f))
- Cover public nuxt layer export ([8a37036](https://github.com/happydesigns/id/commit/8a37036))
- Guard public layer package files ([493427c](https://github.com/happydesigns/id/commit/493427c))
- Guard neutral theme exports ([4a0e42d](https://github.com/happydesigns/id/commit/4a0e42d))
- **guide:** Reproduce Docus hydration and package integration ([e839ebf](https://github.com/happydesigns/id/commit/e839ebf))
- **id:** Verify interchangeable native brands and standalone Studio ([86ec5ba](https://github.com/happydesigns/id/commit/86ec5ba))
- **id:** Distinguish resting brand color from button hover ([6b9d934](https://github.com/happydesigns/id/commit/6b9d934))
- **guide:** Await hydration before fixture interactions ([c48cedf](https://github.com/happydesigns/id/commit/c48cedf))
- **package:** Reject generated files in installed starter ([aa763d6](https://github.com/happydesigns/id/commit/aa763d6))

### 🤖 CI

- **id:** Verify packed consumers and production browser contracts ([0b48417](https://github.com/happydesigns/id/commit/0b48417))

### ❤️ Contributors

- Jan Fröhlich ([@janfrl](https://github.com/janfrl))

## v0.1.0

> Initial workspace scaffold. This historical version has no Git tag; the entry corresponds to the repository's initial commit.

### Changelog

### 🏡 Chore

- Scaffold id workspace ([69b425c](https://github.com/happydesigns/id/commit/69b425c))

### ❤️ Contributors

- Jan Fröhlich ([@janfrl](https://github.com/janfrl))
