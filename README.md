# Write an eval that catches regression

A change to project guidance removes caching from a live-status feature. Happy-path tests pass, but the old claims system exceeds its rate limit. Build a repeatable evaluation that catches the regression without rejecting valid refactors.

## Task

1. Read the observation contract and incident requirements.
2. Write an eval definition and implement assertions.
3. Run the good and broken references.
4. Add valid refactors and failure variants to your practice tests.
5. Explain which observable condition each assertion establishes.

## Working rules

Only `evals/**` and `tests/eval/**` may change. References are immutable. Candidate assertions have no provider, network or grading credentials and cannot emit an official aggregate score. The fixed test operation supplies bounded observations from instructor-controlled runs.

## Acceptance targets

- The good reference and equivalent valid refactor pass.
- Missing cache, rate-limit breach and payload logging are detected.
- Assertions inspect behavior rather than file names or fixture IDs.
- The eval includes repeatable input, requirement references and documented checks.

## How to submit

1. Fork this repository to your personal GitHub account. Use fictional information
   only, keep the fork public, and keep `main` as its default branch.
2. Clone your fork and enable GitHub Actions in its **Actions** tab. Use **Connect
   GitHub for scoring** on the lab page to install the read-only grading App on your
   fork. Return to the lab and use **Recheck connection** if needed.
3. Download the TensorLearn client from the lab page and extract it outside your fork.
   Follow the page's connection command from your fork folder. Paste your learner
   token only into the hidden terminal prompt. Run `/load` from your fork folder to
   connect the repository. Run `/load` again after the facilitator launches the round.
4. Create a branch such as `evals/first-draft` and complete the task above. Change
   only the files the task allows; any other change makes the submission invalid.
5. Commit and push your branch. Open a PR **inside your own fork**, targeting its
   `main` branch. GitHub may suggest the upstream repository: select your fork instead.
   Opening or updating this PR starts the checks automatically.
6. Keep the PR open. When ready, run **`/submit`** in the connected Claude Code session
   to submit that exact pushed revision for the current round. **No merge is required.**
7. Use `/check` or refresh the lab page to read the saved result. The Actions run and
   `lab-score/score.json` are useful feedback, but an Actions check alone does not
   submit your work or prove that the server saved a score.

A change to your answer requires a new commit, push, and explicit `/submit`. Keep
`main` unchanged: the grader compares your PR with the released starter.

## What is graded

The pinned grader in `.github/workflows/grade.yml` reads your files as data and runs
your code only in an isolated, offline container. Every check is a fixed rule; no AI
model judges your work. Your facilitator separately reviews clarity and reasoning.

- 13 recorded observations checked by running your evaluator: cache, rate limit and log privacy.
- Failing a core case caps the score at 25/100.
