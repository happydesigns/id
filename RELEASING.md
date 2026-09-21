# Release and compatibility checks

The Verify workflow runs for pull requests, main, version tags and manual dispatch. It installs the committed pnpm lockfile, runs lint/unit/type checks, packs ID, builds an isolated native consumer and runs production browser checks. Passing runs retain the package and SHA-256 checksum as a versioned artifact.

The native consumer check installs the actual ID tarball into a fresh authoring project outside this workspace, generates and packs a brand, then builds a second application from that brand archive. That application must contain neither ID nor Docus. This checks the published package boundary rather than sibling checkout imports. Fresh consumer dependencies resolve independently of the workspace lockfile, deliberately detecting compatibility failures; the retained temporary fixture includes its lockfile for diagnosis.

## Commands

- pnpm verify
- pnpm pack:studio
- pnpm check:native
- pnpm exec nuxt generate tests/fixtures/guide
- pnpm exec playwright install chromium
- pnpm test:browser

The native check retains its temporary directory and prints its location. Browser failure reports are in playwright-report and test-results. CI uploads those diagnostics on failure.

## Versioned delivery

1. Review the public API and generated output changes. Update package.json with an appropriate version and record upgrade instructions in CHANGELOG.md. Existing source documents must remain importable unless an explicit migration accompanies the change.
2. Run the checks above. Merge the reviewed release commit.
3. Push a vVERSION tag matching package.json. The workflow rejects mismatched tags, repeats verification and prepares a draft GitHub release with the exact package and checksum.
4. Review the draft and its upgrade instructions before publication. npm publication remains a separate explicitly authorized step; this workflow requires no npm credentials.

Until registry publication, consumers may install the reviewed release tarball as an exact file dependency with a committed lockfile. A checksum identifies the archive bytes; package.json identifies the API version. Do not silently replace an existing released archive.

## Integration compatibility

GUIDE-001 is resolved by preserving Vue's onServerPrefetch registration in the Guide production client. See tests/fixtures/guide/README.md for the minimal reproduction and reason. The form-label and tab-panel assertions are now required success tests. Do not restore expected failures to accommodate a dependency update.

Native Tabs demonstrations with labels only still need actual content slots when a host wants meaningful tab-panel content. This is independent of hydration.
