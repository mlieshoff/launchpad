# Development Documentation Standards

## General Principles

The AI agent MUST document significant development activities using the existing GitHub Issues and Pull Requests.

Documentation MUST be concise, accurate, and traceable.

Do not create unnecessary documentation files or duplicate information already available in GitHub.

## Product Management

The Product Manager MUST:

- Document the feature requirements in a GitHub User Story.
- Define measurable acceptance criteria.
- Record relevant assumptions and decisions.
- Link related technical Tasks.

## Development

The Development Team MUST:

- Create a GitHub Task for each independently implementable work item.
- Document important technical decisions in the corresponding Task.
- Reference the Task issue in commit messages.
- Document deviations from the original requirements.
- Record implementation problems that affect the task outcome.

Routine implementation details do not require separate documentation.

## Quality Assurance

The QA agent MUST document:

- Acceptance criteria verification results.
- Unit test and Maven verification results.
- Identified defects and unresolved issues.
- Any limitations of the performed testing.
- The final QA status: PASSED, FAILED, or BLOCKED.

QA MUST NOT claim successful verification without actually executing the relevant checks.

## Pull Request Documentation

The agent MUST use `.github/PULL_REQUEST_TEMPLATE.md`.

Each Pull Request MUST contain:

- Related User Story and Task references.
- Summary of implemented changes.
- Relevant technical decisions.
- Test and QA results.
- Known limitations and risks.
- Information required for human review.

## Traceability

Every implementation MUST be traceable through:

Feature Request → User Story → Tasks → Commits → QA → Pull Request

## Restrictions

- Do not create a separate documentation file for every development step.
- Do not document trivial actions such as opening files or executing routine commands.
- Do not duplicate complete GitHub Issues in Markdown files.
- Never invent completed steps, test results, or approvals.
- Never expose credentials, tokens, or sensitive information in documentation.

## Quality Gate

Before creating the Pull Request, QA MUST verify that the development history is sufficiently documented and traceable.

Missing essential documentation MUST be corrected before handover.