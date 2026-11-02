# AI Developing Conduction — Agent Contract

This file is the mandatory entry point for AI-assisted development in this repository.
The current repository root (`git rev-parse --show-toplevel`) is the workspace boundary.
Follow these instructions and read the linked role, workflow and standards files before acting.

## Mandatory Project Standards

All AI roles MUST read and follow these standards
before performing their assigned responsibilities:

- `.ai/standards/architecture.md`
- `.ai/standards/clean-code.md`
- `.ai/standards/java.md`
- `.ai/standards/testing.md`
- `.ai/standards/formatting.md`
- `.ai/standards/git.md`
- `.ai/standards/documentation.md`

These standards are mandatory.

In case of conflicting instructions, the more restrictive
security and workspace rules take precedence.

The QA agent MUST verify compliance with all applicable
standards before approving the implementation for
Pull Request creation.

## Non-negotiable rules

1. **Workspace boundary:** Never intentionally read, list, search, create, modify or delete files outside the repository root, including parent/sibling directories, home files, and symlinks resolving outside the root. Do not run unreviewed scripts that violate this rule. If a tool requires external filesystem access, stop and request a specifically scoped exception. This file is policy, **not** an OS sandbox; configure actual sandbox enforcement separately.
2. **Git safety:** Never commit or push to `main`, force-push, rewrite history, discard user changes, or bypass protection rules. If working tree is dirty, ask before switching branches or modifying existing changes.
3. **Human authority:** AI may create GitHub issues, task branches, commits, pushes and **one pull request per story**. Only a human may approve/merge PRs, tag, release or deploy.
4. **Scope:** Do not modify unrelated files, upgrade dependencies, alter CI/infrastructure or database schemas without explicit approval. Do not introduce new dependencies without approval.
5. **Verification:** Add meaningful unit/regression tests, run Maven verification and report exact results. Never suppress failures or claim success without evidence.
6. **Templates:** Use repository templates in `.github/ISSUE_TEMPLATE/` and `.github/PULL_REQUEST_TEMPLATE.md`. Preserve their sections when composing GitHub issue/PR bodies.
7. **Secrets:** Never print, store or commit credentials, tokens, personal data or secrets. Never access global Git/SSH settings or credentials directly. Use only preconfigured, authorized GitHub tooling.
8. **Ambiguity:** Ask the user before making material product, security, architecture or destructive decisions. Otherwise proceed autonomously within scope.

## Mandatory lifecycle

Follow `.ai/workflows/feature-development.md`:

1. **Product Manager:** Read `.ai/roles/product-manager.md`. Transform feature prompt into a User Story GitHub issue using `user-story.md`; define testable acceptance criteria.
2. **Development:** Read `.ai/roles/developer.md`. Create Task issues using `task.md`. Develop each task on its own branch, starting from the story integration branch (or an agreed base); implement Java and JUnit tests; commit and push.
3. **Integration:** Integrate task branches into one `story/<issue-number>-<slug>` branch, **never main**. Resolve conflicts without losing changes; run verification.
4. **QA:** Read `.ai/roles/qa.md`. Independently validate story acceptance criteria and run tests; record PASSED / FAILED / BLOCKED. On failure return to development; do not create a ready-for-review PR until QA passes.
5. **PR & handover:** Create exactly one PR per story from story branch into `main` using the PR template. Link the story and tasks; include verification evidence and risks. Human reviews and merges. **Stop.**
6. **Release:** Human-only; `.ai/roles/release-manager.md` is guidance for the human, not an AI execution role.

## Coding standards

Read and apply `.ai/standards/java.md`, `.ai/standards/testing.md`, `.ai/standards/formatting.md`, `.ai/standards/clean-code.md`, `.ai/standards/git.md`.
Use Java and Maven. Prefer `./mvnw` when present, otherwise `mvn`. Execute `verify` without skipping tests.

## Execution and reporting

Before work: state planned issue/branch structure and any blocking questions.
At handover: provide story issue, task issues, branch, commit IDs, PR URL, test commands/results, QA status and residual risks.
Do not automatically close issues or mark a release complete. GitHub API/network access requires separately granted credentials and permissions.

## Architecture Standards

All AI roles MUST follow the architectural rules defined in:

`.ai/standards/architecture.md`

The Development Team MUST preserve the existing architecture.

The QA agent MUST verify architectural compliance before
the Pull Request is marked ready for human review.

Significant architectural changes require explicit human approval.

## Code Formatting

All Java source files MUST be formatted using google-java-format.

The mandatory formatting rules are defined in:

`.ai/standards/formatting.md`

The Development Team MUST format all created or modified Java files before committing.

The QA agent MUST verify formatting compliance before Pull Request creation.

Do not reformat unrelated files or modify files outside the project workspace.

## Documentation Standards

All AI roles MUST follow the documentation rules defined in:

`.ai/standards/documentation.md`

### Mandatory Requirements

- GitHub Issues and Pull Requests are the primary documentation sources.
- The Product Manager MUST document requirements and acceptance criteria using the provided GitHub templates.
- The Development Team MUST document relevant technical decisions and implementation results in the corresponding Tasks.
- The QA agent MUST document verification results, identified defects, and the final QA status.
- Every completed Task MUST include a concise implementation summary and test results.
- Every Pull Request MUST reference its related User Story and Tasks.
- All development activities MUST be traceable through:

  Feature Request → User Story → Tasks → Commits → QA → Pull Request

- Documentation MUST accurately reflect the work performed.
- Never invent implementation results, successful tests, or approvals.
- Never include credentials, tokens, or sensitive information in documentation.

### Quality Gate

Before creating a Pull Request, QA MUST verify that all required documentation is complete and traceable.

Missing or incomplete documentation MUST be corrected before the Pull Request is created.