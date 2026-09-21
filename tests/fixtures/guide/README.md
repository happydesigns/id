# Docus integration fixture

Run `pnpm exec nuxt dev tests/fixtures/guide --host 127.0.0.1 --port 3430` from the ID root. This renders 17 examples through MDC without ClientOnly, including Select and Tabs. Check the browser console for hydration mismatches, label associations, translated select values and reactive language switching. The optional Studio link uses the native router and button. Test both modes and 320/390/834/1440 px. This fixture intentionally has no customer styling or theme overrides.

Use `node scripts/check-guide.cjs http://127.0.0.1:3430` in a test environment providing Playwright and Chromium (`NODE_PATH` can point at an existing test-tool installation). No browser dependency is shipped to runtime consumers.

## Confirmed integration limitation

The production Docus/MDC fixture reproduces different server/client ID prefixes (`v-0-3-...` versus `v-0-0-...`). After hydration, some form labels have no matching input and Tabs aria-controls can miss their panel. The standalone Select now has an explicit translated accessible name and keeps its value during language changes, but that does not fix the wider ID lifecycle. The browser script deliberately detects the remaining mismatch and is not part of `pnpm verify`. Keep the consumer's targeted ClientOnly and tab-content slots until an integration fix passes this reproduction. Do not suppress hydration warnings or replace native controls to hide it.

The workspace also reproduced a production build failure with Tiptap core 3.27.1 and extensions 3.30.1. Its editor peer graph is aligned to 3.30.1 in pnpm-workspace.yaml; a fresh consumer must validate its own lockfile. Build with `pnpm exec nuxt build tests/fixtures/guide`; serve the resulting .output with Nitro or its prerendered public directory for browser checks.

## Automated release checks

Build this fixture, then run pnpm test:browser. The direct /smoke Vue route checks shared controls without MDC. Both / (MDC) and /smoke (direct Vue in Docus) reproduce GUIDE-001. Both label-association checks are expected failures that must be reviewed if they unexpectedly pass. The direct Vue reproduction means the root cause is not established as MDC-specific. Production Studio startup is checked in both color modes. This limited smoke suite is not a full visual regression matrix.
