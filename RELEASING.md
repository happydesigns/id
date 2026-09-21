# Release and compatibility checks

The Verify workflow runs for pull requests, main, version tags and manual dispatch. It installs the committed pnpm lockfile, runs lint/unit/type checks, packs ID, builds an isolated native consumer and runs production browser checks. Passing runs retain the package and SHA-256 checksum as a versioned artifact.

The native consumer check installs the actual ID tarball into a fresh authoring project outside this workspace, generates and packs two brands, then builds identical application source against each brand archive. Browser checks verify primary colors, fonts, mode-specific assets and behavior. The exported minimal Studio host is also built and exercised without Docus. That application must contain neither ID nor Docus. This checks the published package boundary rather than sibling checkout imports. Fresh consumer dependencies resolve independently of the workspace lockfile, deliberately detecting compatibility failures; the retained temporary fixture includes its lockfile for diagnosis.

## Commands

- pnpm verify
- pnpm pack:studio
- pnpm check:native
- pnpm exec nuxt generate tests/fixtures/guide
- pnpm exec playwright install chromium
- pnpm test:browser

The native check retains its temporary directory and prints its location. Browser failure reports are in `.output/tests/report` and `.output/tests/results`. CI uploads those diagnostics on failure.

## Versioned delivery

1. Use Conventional Commits. Run `pnpm release:preview` to inspect the generated entries without changing files, versions, tags or remote releases. Review public API compatibility and the proposed version.
2. If useful, commit a short `release-notes/VERSION.md` with Highlights and Upgrade notes. It is prepended to the generated changelog in GitHub, not a replacement for it. This file must be ready before release preparation so the worktree stays clean.
3. From a clean worktree run `pnpm release --patch` (or the reviewed `--minor`, `--major`, or `--prerelease` choice). Changelogen generates the version, CHANGELOG.md, `chore(release): vVERSION` commit and annotated tag together. Do not hand-edit the version or manually tag a later test commit. Preparation does not push, publish to GitHub or publish to npm.
4. Review the generated commit and tag, then push the branch and its tag through the approved repository process (`git push --follow-tags` when authorized). Tag CI repeats all checks, verifies version and release-commit agreement, and automatically publishes a GitHub release containing the exact CI-built archive, checksum and that version's generated changelog. Prerelease tags produce prereleases. There is no separate GitHub-generated changelog and no manual draft-publishing step.
5. Registry publication remains a separate explicitly authorized step. This workflow needs no npm credentials and never deploys. A retry fails if a release already exists; do not overwrite its assets or move its tag.

ID has one versioned package; its private documentation and playground workspaces do not require Changesets. The ecosystem default is Changelogen; Changesets is an option when a repository releases multiple packages with independent or linked versions.

The existing `v0.2.0` tag predates this workflow and is intentionally not moved or rewritten. Its original tag workflow may create a draft; migrating that existing release is a separate reviewed operation. Subsequent versions must use the Changelogen flow above.

Until registry publication, consumers may install the reviewed release tarball as an exact file dependency with a committed lockfile. A checksum identifies the archive bytes; package.json identifies the API version. Do not silently replace an existing released archive.

## Integration compatibility

GUIDE-001 is resolved by preserving Vue's onServerPrefetch registration in the Guide production client. See tests/fixtures/guide/README.md for the minimal reproduction and reason. The form-label and tab-panel assertions are now required success tests. Do not restore expected failures to accommodate a dependency update.

Native Tabs demonstrations with labels only still need actual content slots when a host wants meaningful tab-panel content. This is independent of hydration.

## Support checks

Release publication also requires the compatibility job: package types and local source operations on Node 24.0.0/Linux and Node 24/Windows. The production integration job remains on Node 24/Linux. These jobs test the supported range's baseline, not every dependency combination.

Dependency updates arrive as reviewable Dependabot PRs; they are not merged automatically. Keep the Tiptap overrides coordinated. Remove the Guide hydration workaround only when the fixture passes without it on the supported dependency baseline, as described in tests/fixtures/guide/README.md.
