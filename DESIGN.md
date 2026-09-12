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

Studio is an optional authoring layer. Shared Components and Landing scenes plus real host-owned Docus routes provide the comparison surface for new and existing brands. Keep only useful brand controls, isolated original/draft frames, browser-local recovery, and reviewable source/project exports. The brand guide explains identity decisions; Nuxt UI owns component API documentation.

The Studio is a viewport-sized workspace: its header and dock remain visible, and each isolated preview owns its scrolling surface. Do not introduce a minimum preview height that makes the host page scroll. The shared editor overlays the canvas by default without changing iframe dimensions. Explicit pinning reserves a column on wide screens; narrow screens always overlay. Opening, closing and switching categories must preserve the canvas size, scroll position and iframe instance. Component examples use a responsive, content-sized gallery without a second scrolling wrapper. Keep examples interactive and use Nuxt UI components with the current brand tokens.

Visual acceptance includes desktop, short landscape windows and mobile, plus original/draft comparison. Verify actual scroll ownership, horizontal overflow, reachable controls and the proportion of space available to the preview. Functional tests alone do not establish visual quality. The integration checks in the brand repository exercise these constraints against a real consuming application.
Reference: the Nuxt UI [Studio shell](https://github.com/nuxt/ui/blob/v4/docs/app/pages/theme.vue) and [component playground](https://github.com/nuxt/ui/blob/v4/docs/app/components/playground/Playground.vue) demonstrate the viewport and content-sized gallery patterns. Studio keeps its own brand-document editing and isolated comparison model.

Preview copy should describe a concrete task, object or result. Avoid decorative
slogans, repeated instructions and invented social proof. Keep field labels,
validation messages and information needed to make a choice. Show controls only
where the selected scene implements them.

The component gallery adapts Nuxt UI's original Theme Studio examples in
`studio/components/playground`; its NOTICE.md records the pinned source and local changes.
Preserve the original card composition, spacing and tile order. A viewport-height
`UScrollArea` owns the single scrolling surface inside the Components iframe and
places cards in responsive masonry lanes. All 21 examples remain available at every
preview width. Demo actions use a stable toast ID and explicitly disclose that no
request is sent. Keep the upstream MIT license with the adapted sources.

Use Nuxt UI controls and page components for their intended roles. Keep custom
CSS focused on the Studio viewport and preview layout. The editor uses the host
identity while outside Studio. Within Studio, the shell and its teleported controls
follow the active draft tokens and Nuxt UI defaults. Cap the shell radius token at
Nuxt UI's default `0.25rem`, including teleported menus and dialogs, so large brand
radii cannot crowd editor controls. Smaller radii still apply. Preview frames and
exports always retain the full brand radius. Color-mode messages carry the selected
preference separately from the resolved light/dark appearance. Route previews report
user preference changes only; applying a parent update must not echo it back. System
remains selected as the operating-system appearance changes. Original comparison frames
retain their own brand. Leaving Studio restores the host configuration. Example forms should exercise validation
and local outcomes without implying that data was sent to a real service.

Studio's brand picker uses a searchable `UDropdownMenu`; brand lifecycle actions
are native `children` submenus, including hover and keyboard handling. Keep brand
search separate from the persistent action group. Do not add custom hover timers.
Unpinned editors share `StudioEditorPanel`, using `UPopover` for positioning,
dismissal and nested overlays; pinned editors retain a docked panel. The iframe
pointer bridge closes transient menus because frame events cannot bubble into the
shell. Category buttons deliberately operate the same editor, and explicit close
restores focus to its opener. Icon packs use a native radio group, numeric viewport
dimensions use `UInputNumber`, and toolbar groups share one surface with native
separators. `studio/editor-categories.ts` owns category labels, icons and randomizer
scope membership together.

On narrow screens, keep the Studio dock to Editor, the three direct color-mode buttons and View. On desktop, four category buttons open Colors, Typography, Icons or Styles. Brand settings and lifecycle actions belong to the brand picker. Styles combines radius and component defaults; Colors owns surfaces and contrast. Ask AI and Export remain directly accessible in the header at every screen size. Distinguish the comparison baseline from local persistence and the exported snapshot; exporting does not mean repository changes were applied. Per-project IDs survive renames, while shared URLs contain only preview navigation settings.

The header has a non-interactive happydesigns/id wordmark on the left, two centered, separate pill groups: a brand picker and a Components/Templates switch, and Docs / Ask AI / Export actions on the right. Docs opens separately in a new tab, with an icon and tooltip on narrow screens. On narrow screens the wordmark and actions occupy the first row and the two selectors share a second row. The picker contains configured identities and browser drafts only. Nuxt UI is a protected starting point; customization creates an independent brand after naming it. Creating and duplicating require a distinct name; passive browsing never creates pristine saved copies. Existing duplicate names show package and saved time rather than being deleted. The inspector uses Nuxt UI Accordion, FormField, Select, ColorPicker and FileUpload controls. Place persistence status once below it. Keep the brand document independent from shell app config; project draft UI defaults into it only for the lifetime of Studio. Apply advances the baseline only after a successful source revision check. Docus owns its complete header, search, navigation and page layout; host branding uses its documented config and small slots.

Studio uses Editor as the compact toggle label. Unpinned editors fit their content centered above the dock, with bounded internal scrolling; pinned editors fill their reserved column. Persistence and export details appear in the brand picker; the dock contains only history actions, with no autosave button. History and color-mode controls share the same group surface. Storage failures remain visible as notifications. The heading names the active category. Show the category selector only when the desktop category dock is hidden, and expose all semantic color roles directly. Editor category and pin state are remembered in the URL. View owns comparison, responsive viewport dimensions and preview state; these controls are not duplicated in the main dock. Original denotes the comparison baseline, not a deployment state. Brand picker entries disclose configured, connected and browser-local origins. Technical package metadata and custom font stacks are secondary controls. Downloads explain JSON and ZIP outcomes before exposing source code; review panels share a bounded scroll area.

Randomize applies one undoable appearance edit: Entire look by default (colors, typography, icons and styles), with individual scopes available below a separator. Styles randomizes light/dark radius and the button default variant, preserving other component overrides. Random button variants use solid, outline, soft and subtle; ghost and link remain manual choices. The last selected scope is stored as a browser UI preference across reloads. It preserves brand content and palette definitions. Reset appearance requires confirmation and restores baseline theme UI, typography and CSS variables without replacing the brand document; it is also one undo step.

Template switching reuses the built-in preview iframe and retains up to three visited preview runtimes per comparison side. Keep iframe DOM order stable: moving a live iframe can reload it. Route previews remain isolated and validate their own route prefix. Cached frames receive current brand state on activation; retry recreates frames. Show the loading overlay only after 150 ms to avoid flashing during warm switches.

Export uses Export, Changes and Code tabs. Code contains a format selector for Brand JSON and CSS. Legacy editor links for details/components resolve to Styles. Brand settings stay available through the brand picker, including on mobile.
