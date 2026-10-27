# Write an eval that catches regression

A change to project guidance removes caching from a live-status feature. Happy-path tests pass, but the old claims system exceeds its rate limit. Build a repeatable evaluation that catches the regression without rejecting valid refactors.

The live-status feature answers each customer's status `requests` by calling the old claims system, claims-core, which allows at most 50 calls per second. A 30-second cache per customer kept those upstream calls low; without it, every request becomes a call to claims-core. `references/good.mjs` (cache kept) and `references/broken.mjs` (cache removed) simulate the two versions: each `observe(requests)` returns an observation. The review and incident labs tell the same incident from other angles.

Terms used below:

- **Observation:** one recorded run of the service: the `requests` it received, the `upstreamCalls` it made to claims-core, its `responses`, its `logs`, and the `requirements` it must meet. `contract.md` lists the fields.
- **Requirement IDs** (in `evals/definition.json`): `CACHE-1`, repeat requests for one customer within `cacheTtlMs` (30000 ms) are served from the cache, not claims-core; `RATE-1`, at most `maxRequestsPerSecond` (50) upstream calls in any one-second window; `PRIVACY-1`, no log line contains one of the `forbiddenLogFragments` (clinical payload).

**What you'll practise:** writing an eval with Claude Code. Turn each requirement into a check on observed behaviour, then test the eval itself against good and bad variants so it catches the regression without rejecting a valid refactor.

**In the course slides:** Chapter 2, Lesson 2 (Continuous evals in CI). In the slides an eval is a real task prompt plus shell checks (tests pass, lint, no test lines removed, a policy script), run in CI whenever CLAUDE.md, skills or hooks change. Here you write that policy check: `evaluate()` decides whether one recorded run broke the cache, the rate limit or log privacy.

## Task

1. Read the observation contract (`contract.md`) and the incident requirements (the `requirements` field of each observation and the IDs above).
2. Write an eval definition in `evals/definition.json` and implement the assertions in `evaluate` in `evals/assert.mjs`.
3. Run the good and broken references on `fixtures/workload.json` (60 requests from `CUS-000123`, 10 ms apart). The good one must pass and the broken one must fail:
   ```sh
   node --input-type=module -e "import {readFileSync} from 'node:fs'; import {evaluate} from './evals/assert.mjs'; import {observe as good} from './references/good.mjs'; import {observe as broken} from './references/broken.mjs'; const requests=JSON.parse(readFileSync('fixtures/workload.json','utf8')); console.log('good:', evaluate(good(requests))); console.log('broken:', evaluate(broken(requests)));"
   ```
4. Add valid refactors and failure variants to your tests in `tests/eval/` (files ending in `.test.mjs`): for example a good observation with different harmless log text, and observations with no cache, too many upstream calls in one second, or a clinical payload in a log. Run them with `node --test tests/eval/*.test.mjs`.
5. Explain which observable condition each assertion establishes: add one entry per assertion to `checks` in `evals/definition.json`, naming its requirement ID and the condition it checks.

A good way to work: ask Claude to restate each requirement as a condition on the observation fields before it writes any code, then have it run the references and your tests after every change. There is no `package.json`; use the `node` commands above.

## Working rules

Only `evals/**` and `tests/eval/**` may change. References are immutable.

The grader imports `evals/assert.mjs` in an offline sandbox and calls `evaluate` on 13 recorded observations of good and bad runs; your code never reports its own score. The sandbox rules are under **Graded format** below. Use Node 22.

## Acceptance targets

- The good reference and equivalent valid refactor pass.
- Missing cache, rate-limit breach and payload logging are detected.
- Assertions inspect behavior rather than file names or fixture IDs.
- The eval includes repeatable input, requirement references and documented checks.

## Done when

- The step 3 command prints `pass: true` for good and `pass: false` with at least one violation for broken.
- `node --test tests/eval/*.test.mjs` passes, with at least one valid-refactor variant that passes and failure variants for a missing cache, a rate-limit breach and clinical payload logging.
- `evals/definition.json` has no TODO: `inputDescription` describes the workload and the revision it starts from, and `checks` documents each assertion with its requirement ID.
- Only files under `evals/` and `tests/eval/` changed.

## Graded format

The grader checks these rules; a correct answer must follow them:

- `evaluate(observation)` returns exactly `{pass, violations}`: `pass` is a boolean and `violations` an array of strings. `violations` is empty when `pass` is true and holds at least one non-empty message when it is false. No other keys.
- `RATE-1` counts `upstreamCalls` (calls that reach claims-core), not incoming `requests`. 60 requests answered with one upstream call pass. 50 upstream calls within one second pass; 51 fail.
- `CACHE-1` is per customer. A second upstream call for the same customer less than 30000 ms after that customer's previous upstream call fails. A refresh exactly 30000 ms later is valid (`references/good.mjs` uses `>= 30000`). Different customers have separate cache entries.
- `PRIVACY-1` looks for each forbidden fragment inside every log line. Other log text, such as `all requests completed successfully with version 2`, must pass.
- An empty or malformed observation, or one without `requirements`, fails with a violation.
- The grader imports `evals/assert.mjs` (and other `evals/*.mjs` files it imports with relative paths) in an offline sandbox: plain JavaScript only, with no `node:` modules, packages, `console` or `structuredClone`. Do not sort or otherwise change the observation you are given.
- `evals/definition.json` and your tests are reviewed by your facilitator; they are not scored automatically.

## How to submit

1. Fork this repository to your personal GitHub account. Use fictional information
   only, keep the fork public, and keep `main` as its default branch. In your fork's
   **Actions** tab, click **I understand my workflows, go ahead and enable them** if shown.
2. On the lab page, use **Connect GitHub for scoring** to install the read-only grading
   App on your fork, then **Recheck connection**.
3. Download the TensorLearn connector from the lab page and extract it outside your fork.
   From your fork folder, run the page's `--code` connection command and paste your token
   only into the hidden terminal prompt. This opens a Claude Code session connected to the lab.
4. In that session, run `/load`. Run `/load` again after your instructor launches the round.
5. Create a branch such as `evals/first-draft` and complete the task above. Change only the
   files the task allows: any other change, including `CLAUDE.md`, `.claude/` settings or
   agents, or notes files, makes the submission invalid.
6. Commit and push your branch. Open a PR **inside your own fork**, targeting its `main`
   branch (GitHub may suggest the upstream repository: select your fork instead). Check
   that **Check evals submission** starts in the PR's checks. Keep the PR open; no merge
   is required.
7. Run **`/submit`** in the connected Claude Code session, then `/check` (or refresh the
   lab page) to read your saved score. The Actions run is useful feedback, but it does not
   submit your work.

A change to your answer needs a new commit, push and `/submit`. Keep `main` unchanged:
the grader compares your PR with the released starter.

## What is graded

The pinned grader in `.github/workflows/grade.yml` reads your files as data and runs your
code only in an isolated, offline container. Every check is a fixed rule; no AI model
judges your work. Your score is out of 100. Your facilitator separately reviews
clarity and reasoning.

- 13 recorded observations checked by running your evaluator: cache, rate limit and log privacy.
- Failing a core case caps the score at 25/100.
- `evals/definition.json` and your tests are reviewed by your facilitator, not scored.
