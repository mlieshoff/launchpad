# Feature Development Workflow

## 0. Preconditions

- Locate project root from current repository only; confirm a clean working tree.
- Confirm remote GitHub access and permissions through approved tooling; do not read credential files.
- Read `AGENTS.md`, relevant roles/standards and GitHub templates.
- Do not operate outside workspace. Ask for clarification on blocking uncertainty.

## 1. Product Management

- Transform chat feature request into a template-compliant User Story.
- Write verifiable acceptance criteria and explicit exclusions.
- Create GitHub issue and record its number.

## 2. Plan and tasks

- Create `story/<story-number>-<slug>` from updated `origin/main`.
- Split work into small Task issues using the task template and link the story.
- For each task, create `task/<task-number>-<slug>` from story branch.

## 3. Implement

- Implement Java changes with JUnit 5 tests, within scope.
- Verify task branch with Maven; commit and push.
- Integrate task branches into story branch only (merge or cherry-pick with explicit traceability).
- Resolve conflicts and rerun full Maven verification on story branch.

## 4. QA gate

- Independently check each acceptance criterion, changes and test evidence.
- Verdict PASSED / FAILED / BLOCKED; record evidence.
- FAILED → create/link defect, return to Development, rerun QA.
- BLOCKED → stop and ask human to resolve blocker.
- Limit to 3 automatic repair/QA cycles; after that stop and ask human.

## 5. PR and handover

- After QA PASSED, push story branch.
- Create **exactly one** PR targeting `main` using `.github/PULL_REQUEST_TEMPLATE.md`.
- Link story and tasks, provide QA results, test commands, limitations and risks.
- Do not create duplicate PRs; update existing story PR if one already exists.
- Report PR URL and stop for human review and merge.

## 6. Human release

- Human reviews/merges PR and decides release/version/deployment.
- AI must never perform these actions.

## Failure handling

- Missing permissions, inaccessible GitHub, unavailable Maven/JDK, dirty working tree, failed tests or unsafe out-of-workspace requests are BLOCKED, not permission to bypass policy.
