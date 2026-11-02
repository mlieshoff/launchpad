# Clean Code Standards — Mandatory

These rules apply to all Java implementation, refactoring, code review, and QA work. Existing repository conventions and explicit requirements take precedence over stylistic preferences. Apply these principles pragmatically; they are not excuses for unrelated changes.

## 1. Simplicity and scope

- Prefer the simplest correct implementation (KISS).
- Do not build speculative capabilities or extension points (YAGNI).
- Remove meaningful duplication when it improves clarity (DRY), but do not abstract merely because two snippets look similar.
- Keep each change focused on its GitHub Task and acceptance criteria.
- Do not refactor unrelated code or introduce frameworks, layers, patterns, or dependencies without approval.
- Favor explicit, understandable code over cleverness, metaprogramming, or premature optimization.

## 2. Names and structure

- Use intention-revealing names consistent with the domain and project conventions.
- Avoid ambiguous abbreviations, misleading names, and unnecessary type prefixes.
- Keep classes cohesive and methods focused on one understandable responsibility.
- Extract methods when it clarifies intent; do not impose arbitrary line-count limits.
- Prefer guard clauses for invalid or terminal conditions; avoid unnecessary nesting.
- Avoid boolean-flag parameters that make calls ambiguous; use clearer APIs when justified.
- Keep package/module boundaries intact and avoid cyclic dependencies.

## 3. Java practices

- Prefer immutable state and `final` where useful; do not add boilerplate without benefit.
- Prefer constructor injection for required dependencies when dependency injection is used.
- Do not return `null` from collection-returning methods when an empty collection correctly expresses the contract.
- Use `Optional` primarily for return values where absence is expected; follow existing conventions.
- Use exceptions for exceptional failures, not ordinary control flow. Preserve causes and provide useful context; never silently swallow exceptions.
- Close resources deterministically, preferably with try-with-resources.
- Avoid global mutable state and hidden side effects.
- Use streams only when they improve readability; loops are perfectly acceptable.
- Use modern Java features only when supported by the project's configured Java version.

## 4. Comments and documentation

- Make code explain **what** it does; use comments for non-obvious **why**, invariants, and trade-offs.
- Delete stale or misleading comments when editing the affected code.
- Document public contracts and surprising behavior when necessary; avoid redundant Javadoc on self-explanatory internals.
- Never leave TODOs, placeholder logic, or unsupported claims presented as completed work.

## 5. Tests and design for testability

- Separate business decisions from I/O and external systems where it materially improves testability.
- Write meaningful JUnit tests for new behavior and regression tests for reproducible defects.
- Test observable outcomes, boundaries, and relevant failure cases, not private implementation details.
- Keep tests independent, deterministic, readable, and fast; avoid sleeps and real network calls in unit tests.
- Do not overmock internal collaborators or change production behavior solely to satisfy a test.
- Follow `.ai/standards/testing.md` for detailed testing requirements.

## 6. Formatting and maintainability

- Follow `.ai/standards/formatting.md` and any existing formatter configuration.
- Avoid wildcard imports, unexplained magic values, dead code, and unused imports.
- Do not introduce broad formatting-only diffs while implementing a task.
- Preserve backward compatibility and existing public contracts unless explicitly authorized to change them.
- Prefer meaningful log messages; never log secrets or sensitive data.

## 7. Mandatory developer self-review

Before committing, check:

- [ ] The code satisfies the Task and its acceptance criteria without unrelated changes.
- [ ] Names, methods, and control flow are easy to understand.
- [ ] No needless abstractions, duplication, hidden side effects, or dead code were introduced.
- [ ] Error handling and resource management are appropriate.
- [ ] New behavior and relevant edge cases have meaningful tests.
- [ ] Existing project style and API contracts are preserved.
- [ ] Maven verification was executed and results are reported accurately.

## 8. QA review expectations

QA must evaluate the above checklist as part of code review. Report concrete findings with file, location, impact, and suggested correction. Do not reject working code solely for subjective style preferences or demand speculative refactoring. Return material violations to Development before marking the story PASSED.
