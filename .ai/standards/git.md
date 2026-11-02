# Git and GitHub Standards

- Protected base: `main`; never commit, push or merge directly into it.
- Story branch: `story/<issue-number>-<slug>` from updated `origin/main`.
- Task branches: `task/<issue-number>-<slug>` from the story branch.
- Integrate task branches into story branch after task verification. Never merge to main.
- One GitHub PR per User Story, from story branch to `main`, only after QA PASSED.
- Use Conventional Commits, e.g. `feat: add cursor pagination (#44)`.
- No force-push, rebase/history rewriting, destructive reset, automatic stash or unapproved branch deletion.
- Inspect `git status` before changing branches; do not overwrite uncommitted user work.
- Use issue templates for issues and PR template for PRs; reference related issue numbers.
- If a task branch conflicts with the story branch, stop if resolution is ambiguous.
- Human alone approves/merges PRs and performs releases.
