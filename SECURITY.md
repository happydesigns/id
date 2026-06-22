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
