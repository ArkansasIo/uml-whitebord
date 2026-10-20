# Release and Deployment Checklist

- [ ] Review changes and update CHANGELOG.md.
- [ ] Verify the intended commit and dependency versions.
- [ ] Run type checks, unit tests, C++ build, and CTest.
- [ ] Review static analysis and dependency advisories.
- [ ] Verify configuration schema and required secret references.
- [ ] Validate database migrations and backward compatibility.
- [ ] Restore a backup in an isolated environment.
- [ ] Exercise rollback and health checks.
- [ ] Build and checksum release artifacts.
- [ ] Publish release notes and known limitations.
- [ ] Monitor health, errors, latency, and resource usage after deployment.

Do not check an item off solely because a workflow exists; require evidence of the actual run.
