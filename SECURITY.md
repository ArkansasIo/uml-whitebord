# Security Policy

## Reporting a vulnerability
Do not publish exploit details or secrets in public issues. Use GitHub's private vulnerability reporting feature if enabled for this repository, or contact the repository maintainers through a private channel.

## Security expectations
- Use established cryptographic and identity libraries.
- Keep credentials out of source control and logs.
- Apply authentication and object-level authorization at trusted boundaries.
- Use parameterized database operations and bounded input sizes.
- Treat plugin code, imported files, and external service responses as untrusted.
- Pin or lock production dependencies and review security advisories.
- Test backup restoration and recovery procedures.

This repository is a starter framework. Security-sensitive production integrations require a threat model and review appropriate to their deployment.
