# Design Direction

`@happydesigns/id` is not one visual identity. It is the Nuxt UI foundation that makes brand-guide decisions durable, inspectable, documented, and usable as Nuxt layers.

## Nuxt UI Only

Nuxt UI is the supported component and theme system. Neutral named data and the existing CSS adapter remain useful contracts; they do not imply another editor or renderer.

- Map raw brand palettes to Nuxt UI semantic roles.
- Keep palette names and optional brand-owned roles independent from Nuxt UI; map them explicitly through the Nuxt UI adapter.
- Configure shared component behavior in `app.config.ts`.
- Use CSS variables for surfaces, text, borders, radius, container width, and typography.
- Keep local component styling small and semantic.
- Prefer real Nuxt UI examples in documentation and playground surfaces.
- Keep `id` runtime components globally prefixed. The default prefix is `Id`; apps can choose another prefix through the module when needed.

## Brand Guide First

A brand layer should be generated from a clear brand guide, not from scattered styling fixes.

The brand guide should describe:

- identity metadata
- logo and asset roles
- color palettes and semantic mappings
- light and dark CSS variables
- typography roles
- Nuxt UI component defaults
- voice and copy rules
- component coverage status
- usage limits

Store reusable brand data in a normal source file such as `brand.ts` when a brand repository needs to export, test, or reuse it. Use `app.config.ts` to expose the public Nuxt runtime contract.

Concrete brand packages own their doctrine. For example, `@happydesigns/brand` owns final happydesigns copy, logo rules, palette meaning, asset choices, and voice. `id` may ship neutral demonstration themes, but those examples should teach the foundation rather than smuggle a real brand source of truth into the reusable layer.

## Runtime Theme Discipline

Runtime switching should feel instant and predictable. Keep runtime themes limited to stable values:

- CSS custom properties
- semantic color names
- `app.config.ts` defaults
- precompiled class strings

Do not make runtime themes responsible for arbitrary layouts, unbundled components, or product behavior.

Nuxt UI owns its normal color-mode behavior. Dark CSS-variable values are optional, targeted overrides. Do not force light mode or generate dark values when a brand omits them.

## Visual QA

Every theme should be checked across:

- action hierarchy
- forms and validation states
- tables and dense data
- navigation
- overlays
- docs prose
- light and dark color modes
- mobile and desktop layouts

## Brand Studio

Studio is an optional authoring layer. Shared Components, Landing and Docs scenes provide the comparison surface for new and existing brands. Keep only useful brand controls, isolated original/draft frames, browser-local recovery, and reviewable source/project exports. The brand guide explains identity decisions; Nuxt UI owns component API documentation.

The Studio is a viewport-sized workspace: its header and dock remain visible, and each isolated preview owns its document scroll. Do not introduce a minimum preview height that makes the host page scroll. Settings have their own bounded inspector, which can be closed to restore the full canvas; on narrow screens it overlays the preview. Component examples use a responsive, content-sized gallery without a second scrolling wrapper. Keep examples interactive and use Nuxt UI components with the current brand tokens.

Visual acceptance includes desktop, short landscape windows and mobile, plus original/draft comparison. Verify actual scroll ownership, horizontal overflow, reachable controls and the proportion of space available to the preview. Functional tests alone do not establish visual quality. The integration checks in the brand repository exercise these constraints against a real consuming application.
Reference: the Nuxt UI [Studio shell](https://github.com/nuxt/ui/blob/v4/docs/app/pages/theme.vue) and [component playground](https://github.com/nuxt/ui/blob/v4/docs/app/components/playground/Playground.vue) demonstrate the viewport and content-sized gallery patterns. Studio keeps its own brand-document editing and isolated comparison model.

Preview copy should describe a concrete task, object or result. Avoid decorative
slogans, repeated instructions and invented social proof. Keep field labels,
validation messages and information needed to make a choice. Show controls only
where the selected scene implements them.

Use Nuxt UI controls and page components for their intended roles. Keep custom
CSS focused on the Studio viewport and preview layout. The editor uses the host
identity; draft changes apply inside the isolated preview, so editing the brand
cannot make its own controls unusable. Example forms should exercise validation
and local outcomes without implying that data was sent to a real service.

On narrow screens, keep the Studio dock to Customize and Preview. Project actions live in the header menu. Distinguish the comparison baseline from local persistence and the exported snapshot; exporting does not mean repository changes were applied. Per-project IDs survive renames, while shared URLs contain only preview navigation settings.
