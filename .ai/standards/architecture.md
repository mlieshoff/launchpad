# Architecture Standards

## Purpose and Scope

These rules apply to all AI-assisted changes in this Java/Maven project. The goal is a coherent, maintainable, testable architecture without unnecessary complexity. The existing project architecture is authoritative unless the human explicitly approves a change.

## 1. Understand Before Changing

- Inspect relevant modules, packages, interfaces, dependencies, and tests before implementation.
- Identify the existing architectural style and follow it; do not impose Clean Architecture, Hexagonal Architecture, DDD, CQRS, or microservices by default.
- Check existing Architecture Decision Records (ADRs) and project documentation when present.
- If the architecture is unclear, make the smallest compatible change and explain assumptions. Ask before decisions that materially affect public APIs, persistence, module boundaries, security, or deployment.
- Never scan or modify files outside the current project workspace. This rule also applies when following references, links, scripts, or symlinks. Toolchain access outside the workspace requires explicit authorization and appropriate sandbox configuration.

## 2. Structure and Responsibilities

- Organize code around existing project modules and package conventions.
- Keep domain rules and business decisions separate from transport, persistence, and infrastructure concerns where practical.
- Controllers or API adapters should handle protocol-level concerns, validation, and mapping; avoid embedding substantial business logic.
- Services or use cases should coordinate business operations and transactions, not become miscellaneous utility containers.
- Repositories or persistence adapters should encapsulate data access, not decide business policy.
- Avoid circular dependencies between packages or Maven modules.
- Keep each class focused on a coherent responsibility; do not split classes merely to satisfy arbitrary size limits.

## 3. Dependencies and Abstractions

- Prefer existing libraries, components, and established patterns.
- Prefer standard Java APIs where sufficient.
- Introduce an interface when it represents a meaningful contract, supports multiple implementations, or establishes a useful architectural boundary—not automatically for every class.
- Favor composition over inheritance when it reduces coupling.
- Use dependency injection consistently with the existing project; avoid service locators and hidden global mutable state.
- Do not introduce new frameworks, Maven modules, architectural layers, or dependencies without human approval.
- Avoid speculative extensibility, generic frameworks, and unnecessary indirection (KISS and YAGNI).

## 4. Data and API Contracts

- Preserve existing public APIs and observable behavior unless a change is explicitly requested.
- Treat request/response DTOs, serialization formats, database schemas, event formats, and message contracts as compatibility-sensitive.
- Validate input at appropriate boundaries and provide actionable errors without exposing secrets.
- Keep mapping responsibilities explicit and consistent; do not leak persistence-specific objects across boundaries unless established project conventions require it.
- Define transaction boundaries deliberately and avoid hidden network or database calls inside mapping and presentation code.
- Require human approval before schema migrations, breaking API changes, event contract changes, or destructive data operations.

## 5. Concurrency, Reliability, and Security

- Prefer stateless components where practical; make shared mutable state and synchronization explicit.
- Account for retries, duplicate messages, timeouts, and partial failures when relevant to the feature.
- Make idempotency explicit for operations that may be retried.
- Do not silently swallow exceptions or hide failed operations.
- Do not log credentials, tokens, personal data, or other sensitive payloads unnecessarily.
- Follow existing authorization, authentication, tenant isolation, and audit conventions; never bypass them to simplify implementation.
- Do not introduce network calls, background processes, or deployment actions outside the requested scope.

## 6. Testing and Observability

- Design components so core behavior can be tested without live external systems where practical.
- Follow `.ai/standards/testing.md` for JUnit 5, AssertJ, test naming, exactly one top-level assertion call, and recursive comparisons.
- Test behavior and contracts rather than implementation details.
- Add integration tests when behavior crosses real component boundaries and unit tests alone are insufficient.
- Use the project's existing logging and metrics conventions; avoid noisy or sensitive logs.
- Run `./mvnw verify` if the wrapper exists, otherwise `mvn verify`, and report any failures honestly.

## 7. Change Scope and Architecture Decisions

The agent MAY independently:

- Add or modify code within existing architectural boundaries to satisfy an approved task.
- Extract small, local helpers when necessary for readability or testability.
- Add tests and update directly relevant documentation.

The agent MUST request human approval before:

- Introducing a new architectural style, module, framework, or dependency.
- Moving significant responsibilities between layers or modules.
- Changing public APIs, persistent schemas, event formats, or security boundaries.
- Performing broad refactoring unrelated to the requested issue.
- Making infrastructure, CI/CD, or deployment architecture changes.

For significant approved decisions, record an ADR in `docs/adr/` if that convention exists or is explicitly adopted. An ADR should state context, decision, alternatives, consequences, and approval.

## 8. Role-Specific Responsibilities

### AI Product Manager

- Express functional needs and testable acceptance criteria using the supplied GitHub User Story template.
- Do not prescribe architectural solutions unless they are explicit user requirements.
- Flag requirements that imply breaking contracts or structural changes.

### AI Development Team

- Create technical tasks using the supplied GitHub Task template.
- Respect the existing architecture and these standards.
- Implement tasks in dedicated branches; integrate into the story branch without changing `main`.
- Follow clean-code, formatting, and testing standards.
- Explain necessary architectural tradeoffs in the Pull Request description.

### AI Quality Assurance

- Check compliance with existing architectural boundaries and approved decisions.
- Verify API compatibility, meaningful tests, and absence of unrelated structural changes.
- Report concrete architectural violations with evidence; do not block solely on subjective style preferences.
- Return defects to Development; never merge to `main`.

### Human

- Approves major architectural changes and reviews the AI-created Pull Request.
- Alone merges to `main`, tags versions, builds official releases, and deploys.

## 9. Architecture Quality Gate

Before marking a story ready for human review, verify:

- [ ] The change follows existing modules, packages, and architectural conventions.
- [ ] Responsibilities and dependency direction remain coherent.
- [ ] No unapproved dependencies, frameworks, modules, or architectural patterns were added.
- [ ] Public contracts and persistence schemas are preserved or approved changes are documented.
- [ ] Security and tenant boundaries remain intact where applicable.
- [ ] Relevant unit/integration tests exist and Maven verification results are reported.
- [ ] No unrelated refactoring or changes outside the project workspace occurred.
- [ ] Architectural tradeoffs and any remaining risks are documented in the Pull Request.

**When in doubt, preserve the current architecture and ask the human before making a significant structural decision.**
