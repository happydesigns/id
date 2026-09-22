# Architecture

ID is optional authoring and verification for native Nuxt UI brands. The supported flow is **brand source → Studio and app previews → generated Nuxt layer → consuming apps**. Consumers retain their own behavior and adopt brand updates deliberately; they do not require ID or Docus at runtime.

## Ownership

- Nuxt UI owns components and semantic styling; Nuxt owns layer composition.
- Studio owns brand documents, validation, history, persistence and export. Theme controls are replaceable.
- Pure generation owns native config and CSS; generated files remain separate from user code.
- Applications own routes, content and behavior. Development previews apply temporary drafts.
- Guide/Docus is optional. Renderer details must not enter public brand contracts.
- Existing identity-runtime entrypoints remain supported compatibility surfaces.

## Repository boundaries

`src/` holds Nuxt UI brand contracts and side-effect-free generation. Public Nuxt and Nuxt UI types are welcome; generation must not require an active Nuxt app, Vue component state, Docus or concrete applications. `app/` is the compatibility Nuxt runtime, not the repository's documentation app. `studio/` and `guide/` are optional Nuxt layers. `docs/` and `playground/` consume the package; runtime code must not import them or the templates.

The repository's `nuxt.config.ts` is development tooling. Published layer entrypoints own consumer configuration. Keep one versioned package until independently useful usage justifies a split.

## Detailed documentation

- [Product vision](docs/content/2.concepts/4.product-vision.md): intended DevTools and brand-portal workflows, reusable previews and upstream ownership.

- [Architecture](docs/content/5.development/1.architecture.md): directory responsibilities, package entrypoints, editor contracts and generated-file ownership.
- [Verification](docs/content/5.development/2.verification.md): native workflow proof and framework constraints.
- [Roadmap](docs/content/5.development/4.roadmap.md): the six-step plan, current assessment and remaining work.
- [Studio guide](docs/content/3.guides/6.brand-studio.md): configuration and authoring workflows.
- [API](API.md) and [Security](SECURITY.md): compatibility commitments and trust boundaries.

Source and tests own exact behavior. These overview rules orient contributors; the linked Docs pages own detailed explanations and status. Update those pages instead of appending implementation reports here.
