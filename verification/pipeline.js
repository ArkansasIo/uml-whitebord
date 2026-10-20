export class VerificationPipeline {
  constructor({ contracts = [], invariants = [], tests = [] } = {}) { this.contracts = contracts; this.invariants = invariants; this.tests = tests; }
  async run(input, output, context = {}) {
    const checks = [];
    for (const check of [...this.contracts, ...this.invariants, ...this.tests]) {
      try { checks.push({ name: check.name ?? 'anonymous', ok: await check({ input, output, context }) !== false }); }
      catch (error) { checks.push({ name: check.name ?? 'anonymous', ok: false, error: error.message }); }
    }
    return { ok: checks.every(c => c.ok), checks };
  }
}

export async function boundedRecover(task, verify, { retries = 2, onRetry } = {}) {
  let attempt = 0;
  while (attempt <= retries) {
    const result = await task(attempt);
    const check = await verify(result, attempt);
    if (check?.ok) return { result, verification: check, attempts: attempt + 1 };
    if (attempt === retries) return { result, verification: check, attempts: attempt + 1, recovered: false };
    attempt += 1; await onRetry?.(attempt, check);
  }
}
