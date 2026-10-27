# Evaluation contract
Export `evaluate(observation)` from evals/assert.mjs, returning `{pass:boolean,violations:string[]}`. observation has:
- `requests`: array of `{customerCode,atMs}` requests, in chronological order.
- `upstreamCalls`: array of `{customerCode,atMs}` observed upstream calls.
- `responses`: array of `{customerCode,status}` responses.
- `logs`: array of strings produced by the service.
- `requirements`: `{maxRequestsPerSecond:50,cacheTtlMs:30000,forbiddenLogFragments:[...]}`.
Evaluate behavior. Fixture names, source layout and implementation labels are not part of the contract. Reject malformed/insufficient evidence explicitly. Check a rolling one-second window, repeated requests within the freshness interval, and forbidden log payloads. A valid refactor can use a different source layout and different harmless log text.
The instructor runs candidate assertions against additional good and bad implementations. Always-pass and always-fail assertions cannot pass the matrix.
