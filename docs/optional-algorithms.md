# Optional Algorithm Specifications

Implement only when the product requires the capability.

- **Pagination:** require bounded page size, stable sort keys, and cursor validation; avoid exposing unrestricted scans.
- **Retry:** retry only transient errors, with capped exponential backoff, jitter, attempt limits, and deadlines.
- **Circuit breaker:** track closed/open/half-open states; bound probes and avoid synchronized retry storms.
- **Concurrency:** define ownership, locks/atomics, cancellation, queue limits, and deadlock avoidance.
- **Job queue:** atomically claim jobs, lease them, record attempts, use idempotent handlers, and dead-letter exhausted jobs.
- **File storage:** enforce size/type limits, generate server-side names, store outside executable web roots, and apply access controls.
- **Search:** validate filters, apply authorization before returning results, bound complexity, and paginate.
- **Notifications:** use durable delivery queues, retry policy, deduplication, and delivery status.
- **Plugins:** validate metadata, capabilities, dependency versions, trust level, and lifecycle; do not load untrusted code in-process.
- **Feature flags:** define stable targeting rules, defaults, audit changes, and avoid using flags as authorization.
- **Telemetry:** redact sensitive data, sample traces, bound cardinality, and define retention.
- **Import/export:** validate schema, size, encoding, permissions, staging, and atomic commit behavior.
- **Localization:** resolve locale using explicit precedence and documented fallback; never concatenate translated fragments for security-sensitive messages.
- **Accessibility:** test keyboard navigation, focus order, labels, contrast, semantic structure, and applicable platform guidelines.
