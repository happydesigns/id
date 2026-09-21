# Release and compatibility checks

The Verify workflow runs for pull requests, main, version tags and manual dispatch. It installs the committed pnpm lockfile, runs lint/unit/type checks, packs ID, builds an isolated native consumer and runs production browser checks. Passing runs retain the package and SHA-256 checksum as a versioned artifact.

The native consumer check installs the actual ID tarball into a fresh authoring project outside this workspace, generates and packs a brand, then builds a second application from that brand archive. That application must contain neither ID nor Docus. This checks the published package boundary rather than sibling checkout imports. Fresh consumer dependencies resolve independently of the workspace lockfile, deliberately detecting compatibility failures; the retained temporary fixture includes its lockfile for diagnosis.

## Commands

- pnpm verify
- pnpm pack:studio
- pnpm check:native
- pnpm exec nuxt build tests/fixtures/guide
- pnpm exec playwright install chromium
- pnpm test:browser

The native check retains its temporary directory and prints its location. Browser failure reports are in playwright-report and test-results. CI uploads those diagnostics on failure.

## Versioned delivery

1. Review the public API and generated output changes. Update package.json with an appropriate version and record upgrade instructions in CHANGELOG.md. Existing source documents must remain importable unless an explicit migration accompanies the change.
2. Run the checks above. Merge the reviewed release commit.
3. Push a vVERSION tag matching package.json. The workflow rejects mismatched tags, repeats verification and prepares a draft GitHub release with the exact package and checksum.
4. Review the draft and its upgrade instructions before publication. npm publication remains a separate explicitly authorized step; this workflow requires no npm credentials.

Until registry publication, consumers may install the reviewed release tarball as an exact file dependency with a committed lockfile. A checksum identifies the archive bytes; package.json identifies the API version. Do not silently replace an existing released archive.

## Integration limitations

GUIDE-001 is the Docus/MDC server/client ID mismatch documented in tests/fixtures/guide/README.md. Its browser assertion is marked as an expected failure, not ignored: if it starts passing, CI reports an unexpected pass and requires reviewing/removing the expectation and consumer workarounds. New unrelated failures are not exempted.

The release gate checks a direct Vue guide page separately from the MDC rendering path. Native Tabs demonstrations currently expose labels without complete example content; hosts that need tab panels supply native content slots. Neither limitation is a reason to duplicate Nuxt UI components or replace the Docus shell.
