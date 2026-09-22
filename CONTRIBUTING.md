# Contributing

Read [README](README.md) and the relevant [architecture](ARCHITECTURE.md), [design](DESIGN.md), [API](API.md) and [security](SECURITY.md) overviews before changing ID.

## Working locally

Run `pnpm install` and `pnpm prepare`. Use `pnpm dev` for the playground and `pnpm docs` for documentation. `pnpm lint:fix` applies the Nuxt ESLint configuration; `pnpm verify` runs lint, unit tests and type checks.

The [verification guide](docs/content/5.development/2.verification.md) owns the ordered package, authoring and browser checks, their scope and failure diagnostics. Run checks appropriate to the change and report any relevant checks skipped.

## Contribution standards

Keep changes focused and reviewable. Preserve existing behavior unless a change explicitly modifies it. Prefer precise types, explicit data, validation at boundaries, meaningful errors, Nuxt UI semantics and CSS variables. Keep portable contracts framework-independent and domain behavior outside branding.

Add meaningful regression coverage for changed logic. Avoid speculative packages, unnecessary dependencies, silently swallowed failures and brand-specific coupling. Comments should explain non-obvious constraints, compatibility decisions or safety boundaries, rather than narrate statements. Public identity data must never contain secrets or sensitive customer data.

## Documentation ownership

- Source owns exact API behavior; tests express behavioral expectations.
- Root Markdown files provide durable topic overviews and essential policies, with links to details.
- `docs/content/` owns detailed product usage, architecture, verification and release guidance. The [roadmap](docs/content/5.development/4.roadmap.md) is the single plan/status record.
- `package.json` owns package version and dependency contracts; the pnpm catalog owns shared ranges and the lockfile owns tested resolutions. Link rather than repeat version lists.
- File-based project scaffolds own new-project boilerplate. Their bundled READMEs must remain usable outside this repository.

Update the canonical page when behavior changes. Explain concepts, usage and tradeoffs; derive exact tables from source where supported. Link to an existing explanation instead of copying it. Keep task logs and temporary planning in tasks, issues or PRs. Preserve generated changelog history, fixture reproduction notes and license notices in their appropriate locations.

## Commits and review

Use granular Conventional Commits, such as `fix(studio): preserve draft assets` or `docs: clarify native consumption`. Mark incompatible public API, source-format or dependency-requirement changes with `!` and explain the migration in a `BREAKING CHANGE:` footer. During v0, compatible changes increment patch and breaking changes increment minor.

Before finishing, review scope, dependency direction, security, documentation and relevant checks. Summarize changes and limitations clearly. Follow [Releasing](RELEASING.md) for versioned delivery; implementation work is not permission to publish.
