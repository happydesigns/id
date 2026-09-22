# Releasing

ID uses Changelogen for its single versioned package. Conventional Commits determine the version: during v0, compatible changes increment patch and breaking changes increment minor. Review actual compatibility, not just commit labels.

## Release overview

1. Complete the [verification pipeline](docs/content/5.development/2.verification.md).
2. Run `pnpm release:preview` to review proposed entries and version without changing files.
3. From a clean worktree, run `pnpm release`. It verifies the package and creates the version, generated `CHANGELOG.md`, release commit and annotated tag together. It does not push or publish.
4. Review the result. An authorized tag push triggers CI verification and GitHub release publication with the exact built archive, checksum and changelog entries. Registry publication requires separate authorization.

Do not manually rewrite released tags or replace released archive bytes. Keep release history in `CHANGELOG.md`, not parallel notes.

The [release guide](docs/content/5.development/3.releasing.md) owns detailed delivery, prerelease and retry rules. The [verification guide](docs/content/5.development/2.verification.md) owns command order, compatibility jobs and framework constraints.
