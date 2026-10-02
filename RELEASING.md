# Releasing

ID uses Changelogen for its single versioned package. Conventional Commits determine the version: during v0, compatible changes increment patch and breaking changes increment minor. Review actual compatibility, not just commit labels.

## Release overview

1. Complete the setup described in [Verification](docs/content/5.development/2.verification.md), including Playwright's Chromium browser.
2. Run `pnpm release:preview` to review proposed entries and version without changing files.
3. When publication is authorized, run `nr release` (or `pnpm release`) from a clean worktree. It checks npm authentication, opens `npm login` if needed, runs full verification and Changelogen, publishes with pnpm, then pushes the branch and annotated tags. Each step must succeed before the next starts.
4. Tag CI verifies the release and publishes the GitHub release with its built archive, checksum and changelog entries. To prepare and review a version without authentication, publication or pushing, use `pnpm release:prepare` instead.

Do not manually rewrite released tags or replace released archive bytes. Keep release history in `CHANGELOG.md`, not parallel notes.

The [release guide](docs/content/5.development/3.releasing.md) owns detailed delivery, prerelease and retry rules. The [verification guide](docs/content/5.development/2.verification.md) owns command order, compatibility jobs and framework constraints.
