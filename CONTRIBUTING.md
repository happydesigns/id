# Contributing

Read `README.md` before making changes.

This document defines contribution standards for human contributors and AI coding assistants working on `@happydesigns/id`.

## Contribution Mindset

`id` is a reusable identity system. Contributions should preserve the separation between reusable identity mechanics and concrete brand expression.

Keep the project:

- Nuxt UI first
- token-driven
- brand-neutral by default
- explicit about runtime limits
- conservative about dependencies
- useful as a source of truth for future brand guides

Prefer focused, reviewable changes over broad rewrites.

## Source of Truth

Use the right source for the information being changed.

- Source files own exact API behavior.
- Tests own behavioral expectations.
- Root guides own durable architecture, design, API, security, and contribution rules.
- Docus docs own product usage guidance.
- Templates own recommended starting shapes.
- `package.json` owns dependency contracts and the ID version; the pnpm catalog owns shared version ranges, and the lockfile owns the tested resolutions. Link to these instead of copying version lists into documentation.

When implementation changes how `id` is understood, update the documentation. When docs describe behavior that no longer exists, update them with the code change.

## Documentation Standards

Documentation is part of the product.

Product documentation should describe the intended identity system clearly. Avoid temporary wording such as "maybe", "for now", or "eventually" unless a page is explicitly about roadmap or implementation strategy.

Use source-derived documentation for exact public API tables when generation exists. Hand-written docs should explain concepts, usage, tradeoffs, and architecture.

## Scope and Change Size

Keep changes focused on the agreed scope.

Avoid mixing unrelated refactors, docs rewrites, dependency updates, and product behavior changes in one commit.

Preserve existing behavior unless the change intentionally modifies it.

## Implementation Standards

Follow the existing project structure, naming conventions, and coding style.

Prefer:

- precise types
- explicit data shapes
- validation at system boundaries
- meaningful errors
- Nuxt UI semantic utilities
- CSS variables over hardcoded colors
- straightforward implementation

Avoid:

- hidden coupling to a concrete brand
- framework imports in portable contract code
- domain behavior in identity layers
- silently swallowed validation errors
- broad local styling fixes that belong in tokens

## Security and Privacy

Never hardcode secrets, tokens, credentials, private endpoints, or sensitive customer data.

Identity config is client-visible. Treat it as public data.

Brand layers must not own authorization, tenant isolation, API behavior, storage policy, audit behavior, or deployment credentials.

## Dependencies

Do not add new dependencies unless they are necessary for the current change.

Prefer well-maintained packages that fit Nuxt, TypeScript, and package publishing.

If a dependency is added, justify it through implementation and update the lockfile.

## Code style

Nuxt ESLint checks code and formatting, including the file-based project templates. Run `pnpm lint:fix` to format and `pnpm lint` to verify. Generated output is excluded.

Comments explain non-obvious constraints, compatibility decisions and safety boundaries. Avoid narrating the next statement. Keep public API contracts and upstream-workaround explanations.

## Testing

Add or update tests when changing logic.

Prioritize tests for:

- validation
- CSS variable generation
- Nuxt UI app-config generation
- runtime theme application
- public contract behavior
- data transformation

If tests are not practical for a change, note the reason in the final summary.

Browser reports and failure artifacts are generated under `.output/tests/`. The static fixture server lives in `tests/helpers/`; these files are test infrastructure, not package runtime.

### Native branding workflow

The browser authoring pass must precede the isolated native builds. It edits and exports two brands, exercises both application previews and records their appearance. The consumer check generates and packs those exact documents, builds the catalog and dashboard with each brand, and rejects ID/Docus runtime dependencies. The final browser pass compares the built applications with their previews and exercises app behavior again.

After `pnpm prepare` and installing Playwright Chromium, run:

```sh
pnpm pack:studio
pnpm exec nuxt generate tests/fixtures/guide
pnpm docs:build
pnpm test:authoring
pnpm check:native
pnpm test:browser
```

Keep the stages in this order; do not reuse old exports after changing the fixtures. Generated documents and measurements live in `.output/workflow/`. App source is copied unchanged into each native consumer; only its brand dependency and CSS import differ from development. These small fixtures prove the integration contract, not every customer application's visual quality.

## Commits

Use Conventional Commits.

Examples:

- `chore: scaffold id workspace`
- `feat: add identity contract validation`
- `feat: add runtime theme switching`
- `docs: add brand-layer guide`
- `test: add theme css generation cases`

Mark incompatible public API, source-format or dependency-requirement changes with `!` and explain the migration in a `BREAKING CHANGE:` footer. Changelogen derives releases from these commits: on v0, compatible changes increment patch and breaking changes increment minor.

Avoid vague commit messages such as `update`, `fix stuff`, `changes`, or `wip`.

## AI Assistant Guidelines

AI assistants should:

- read relevant docs before changing files
- keep changes scoped and reviewable
- preserve the brand-neutral boundary
- update docs with public behavior changes
- avoid creating speculative packages
- run relevant checks before finishing
- summarize changes and checks clearly

## Review Checklist

Before finishing a change, verify that it:

- matches the agreed scope
- preserves identity and domain boundaries
- keeps portable contracts independent from Nuxt runtime code
- uses Nuxt UI and CSS variables where appropriate
- avoids unrelated changes
- avoids unnecessary dependencies
- updates documentation when relevant
- includes relevant tests or explains why not
- avoids leaking secrets, private data, generated local data, or environment-specific values
