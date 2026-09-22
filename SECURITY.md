# Security

ID handles public presentation data, never runtime authority. Brand sources, app config, CSS, logos and other public assets are visible to clients. Do not include credentials, private endpoints or sensitive customer data.

Branding must not control authorization, tenant isolation, billing, audit, storage policy, APIs, MCP, webhooks, jobs or deployment credentials. Only load trusted themes; configuration must not carry executable code or remote components. Keep dependencies necessary and behavior inspectable.

## Development integrations

The optional source writer targets a host-configured JSON file and exists only in development. Preview connections require explicit origins and bounded routes. Neither mechanism is remote-user authentication. Validation, revision checks and transport limits are part of these boundaries, not optional UI checks.

The [security reference](docs/content/4.reference/4.security.md) documents the exact writer, message, storage and size constraints. [Application boundaries](docs/content/2.concepts/3.boundaries.md) explains the separation between branding and domain behavior.

## Reporting a vulnerability

Use [GitHub private vulnerability reporting](https://github.com/happydesigns/id/security/advisories/new). If unavailable, open an issue asking for a private contact without publishing exploit details or sensitive data. Include the affected version and a minimal reproduction privately.
