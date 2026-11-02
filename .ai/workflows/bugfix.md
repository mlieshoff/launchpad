# Bugfix Workflow

- Create or use a Bug Report with `.github/ISSUE_TEMPLATE/bug-report.md`.
- Reproduce the defect and document expected vs actual behavior.
- Create a story-level integration branch if the bug is part of a story; otherwise use a dedicated `fix/<issue-number>-<slug>` branch and one PR for the bug.
- Add a regression test when practical; implement the smallest safe fix.
- Run Maven verification and QA review.
- Create a PR using `.github/PULL_REQUEST_TEMPLATE.md` after QA PASSED.
- Human alone reviews, merges and releases.
