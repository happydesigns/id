# {{brandName}}

A native Nuxt UI brand layer. Consumers extend {{packageName}} and import its styles.css after Tailwind and Nuxt UI in their own CSS entry. Consumers need neither ID nor Docus.

Run pnpm install and pnpm dev to open Studio with Components and Landing. Add capability templates explicitly in appConfig.idStudio.templates. The editable source is brand.studio.json; Apply updates it locally after a revision check. Run pnpm generate:brand after external edits. Generated app files are derived output.

Docus documentation is optional: select Include Docus guide when exporting a new project, or add docus and @happydesigns/id/guide to a separate documentation host. Existing guides remain supported.

Regeneration owns only app/brand.config.ts, app/assets/css/brand.css and app/brand.assets.json. Keep those files derived from brand.studio.json. app/app.config.ts imports the generated configuration and is yours to extend; components, pages, other styles and project configuration are scaffolded once and remain yours. Regeneration leaves unchanged output untouched. New project ZIPs are for new directories, not for overlaying an existing project.

{{packageNote}}

Fonts must be available to the consuming build. Custom domain components and capabilities are not included.
