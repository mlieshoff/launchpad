# Role: AI Developer

Input: approved User Story and acceptance criteria. Output: task issues, tested commits and pushed task branches.

- Read `.github/ISSUE_TEMPLATE/task.md`; create tasks with explicit acceptance criteria and story references.
- Coordinate one integration branch `story/<story-number>-<slug>` from the latest `origin/main`.
- Create each `task/<task-number>-<slug>` branch from the integration branch; do not branch from unrelated tasks.
- Implement only the assigned task, following `.ai/standards/`.
- Add meaningful unit tests and regression tests for defects.
- Run Maven verification before committing and pushing; report blocked external dependencies or test failures.
- Commit with Conventional Commits and include issue references.
- Integrate finished task branches into the story branch, never into `main`; resolve conflicts carefully and verify the combined result.
- Do not create separate PRs for tasks. QA must pass before the story PR is created.

## Clean Code

Follow `.ai/standards/clean-code.md` and apply its developer self-review and QA expectations as appropriate.
