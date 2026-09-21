# {{brandName}}

A Nuxt UI brand layer. Edit brand.studio.json directly or open /studio in the playground, import the document, and export the reviewed source back to that file. Nuxt regenerates the CSS at startup.

Install the dependencies with pnpm install, then run pnpm dev. {{packageNote}}

Consumers extend this directory in nuxt.config.ts. The playground and Studio are optional authoring tools, never a runtime requirement.

Custom class overrides must be compiled by Tailwind; the source document is scanned. Fonts need to be installed or loaded by the consuming application. Public assets are included when exported from a host that can serve them. Brand primitives and custom layouts remain owned by their original project; a theme archive does not reproduce arbitrary Vue components.
