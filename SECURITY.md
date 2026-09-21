# Security

`@happydesigns/id` handles public identity data. It must not become a channel for secrets or runtime authority.

## Public Data Rule

Brand guides, theme packs, app config, CSS variables, logos, and public assets are visible to clients. Do not place secrets, credentials, private tokens, internal endpoints, or sensitive customer data in identity configuration.

## Boundary Rule

Identity layers may change presentation. They must not change:

- authorization
- tenant isolation
- billing or financial rules
- audit behavior
- storage policy
- API behavior
- MCP behavior
- webhook behavior
- job execution
- deployment credentials

## Runtime Themes

Only load trusted theme packs. Runtime theme data should be treated as public presentation data, not executable code.

Runtime themes should not carry raw HTML, scripts, remote component code, credentials, or user-specific secrets.

## Dependencies

Avoid adding dependencies unless they are needed for the current implementation. Keep validation and runtime behavior deterministic and inspectable.

## Local Studio writer

The optional Studio module registers `/api/id-studio/source` only in Nuxt development and only when the host provides an absolute `.json` path in private `runtimeConfig.idStudioSource`. Browser input cannot choose a filesystem path. Requests require a loopback host, a matching Origin when supplied, and a per-server nonce in a custom header. The nonce is available to the local application; this is a same-origin development boundary, not remote-user authentication.

The writer accepts validated public brand JSON, preserves unknown safe fields, checks the current source hash and performs a same-directory atomic replacement. It rejects a stale revision and serializes writes within the process. It cannot lock unrelated external editors across the final filesystem replacement. It does not evaluate TypeScript, update arbitrary CSS, commit files or deploy. Production builds do not register the endpoint.

Route previews accept only configured same-origin subtrees. Messages verify the parent window and origin. Draft styling is applied after hydration and cannot replace the editor shell's configuration.

## Reporting a vulnerability

Use [GitHub private vulnerability reporting](https://github.com/happydesigns/id/security/advisories/new). If that channel is unavailable, open an issue asking for a private contact without publishing exploit details or sensitive data. Include the affected version and a minimal reproduction privately.
