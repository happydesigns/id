# {{brandName}}

A native Nuxt UI brand layer. Consumers extend {{packageName}} and import its styles.css after Tailwind and Nuxt UI in their own CSS entry. Consumers need neither ID nor Docus.

Run pnpm install and pnpm dev to open Studio with Components and Landing. Add capability templates explicitly in appConfig.idStudio.templates. The editable source is brand.studio.json; Apply updates it locally after a revision check. Run pnpm generate:brand after external edits. Generated app files are derived output.

Docus documentation is optional: select Include Docus guide when exporting a new project, or add docus and @happydesigns/id/guide to a separate documentation host. Existing guides remain supported.

{{packageNote}}

Fonts must be available to the consuming build. Custom domain components and capabilities are not included.
