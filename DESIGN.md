# Design direction

ID separates application behavior from brand appearance. Nuxt UI is the supported component system; individual brands own visual decisions, assets, voice and artistic quality.

## Brand contracts

- Keep one editable brand source. Derive runtime config, CSS and optional reference documentation from it.
- Map named palettes to semantic Nuxt UI roles. Applications use those roles and stable asset roles instead of hardcoded brand values.
- Use Nuxt UI component defaults and CSS variables before introducing custom component styling.
- Follow normal Nuxt UI color-mode behavior. Dark overrides are explicit brand choices, not automatically inferred identities.
- Keep layout, business behavior and unavailable fonts or components outside the token contract.

## Studio interaction

Use native Nuxt UI controls, including their focus, keyboard and selection behavior. An open menu is not a selected template. Keep appearance controls separate from project lifecycle actions.

The host controls the logo, product name and home destination. The upper-left link returns to that host; the Docs action is optional. Studio must not impose a customer's logo or name on another brand.

Keep previews isolated from the editor. Original means the comparison baseline. Draft means the current edit. A browser save, download and successful repository update are different states and must remain distinguishable.

Only the Nuxt UI baseline is read-only. Customization creates a named independent brand. Browsing does not create saved copies. Replacing an unsaved draft requires a choice; storage failures stay visible. Randomization and reset are single undoable appearance edits and preserve brand content.

Keep editor controls usable on narrow screens. Use the existing category catalog for labels and icons. Avoid duplicating settings between the header, editor and viewport controls. Product usage and exact controls are documented in the [Studio guide](docs/content/3.guides/6.brand-studio.md), not repeated here.

## Verification

Check action hierarchy, forms, dense data, navigation, overlays and prose across light/dark modes and mobile/desktop widths. Preserve form labels, tab associations and keyboard behavior after production hydration. Tests cover mechanics; a brand owner still reviews visual quality.
