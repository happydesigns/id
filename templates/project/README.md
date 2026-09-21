# Studio project templates

These files own the exported project scaffold. Edit ordinary Vue, Nuxt config and Markdown files here; do not put project source strings into the generator.

- `native/`: the standard brand layer and minimal Studio host.
- `guide/`: optional Docus files and extra development dependencies. Docus supplies the host app.
- `legacy/`: compatibility scaffold for existing identity-runtime consumers.

`pnpm build:package` bundles these files into an ignored TypeScript asset map for browser and Node consumers. The public generator adds validated brand data, derives runtime files, sets package metadata and fills the three Markdown placeholders. It never downloads templates or executes their contents.

Run `pnpm build:package` after template edits. `pnpm check:native` and the production browser suite validate generated projects from the packed package. This follows the file-based approach of [Nuxt starters](https://github.com/nuxt/starter); Giget is a CLI transport, not a dependency of the browser ZIP export.

Shared dependencies use `catalog:`: the package build resolves them to exact installed versions from the root workspace. `workspace:^` references the current ID release. Exported projects contain normal installable versions, with no catalog or workspace references. Dependencies specific to an optional scaffold remain declared in that scaffold. Update shared versions in the pnpm catalog and lockfile, then rebuild.
