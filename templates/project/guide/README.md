# {{brandName}}

A native Nuxt UI brand layer. Consumers extend this directory for app config and BrandLogo, and import the public styles.css export after Tailwind and Nuxt UI in their application CSS entry. The layer does not register CSS automatically. They do not need the id runtime or Docus. See playground/content/docs/1.introduction.md for the two-file installation example. Docus owns its framework entry; the playground imports the brand fragment through app/app.css.

The editable source is brand.studio.json. Run pnpm install and pnpm dev to use the optional Studio and Docus playground. In local development, Apply changes updates the connected source after a revision check. Run pnpm generate:brand after external source edits. Generated app files are not a second editable source.

{{packageNote}}

Fonts must be available to the consuming build. Custom domain components and capabilities are not included in the brand.
