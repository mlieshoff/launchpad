# Code Formatting Standards

## General Rules

All Java source code MUST be formatted using **google-java-format**.

- Google Java Format is the mandatory formatter for Java source files.
- Use the standard Google Java Style (not AOSP).
- Do not use IntelliJ IDEA's built-in Java formatter as a substitute.
- Do not introduce alternative Java formatting conventions.
- Do not manually override formatting produced by google-java-format.
- Preserve existing formatting in unrelated files.
- Never reformat the entire project unless explicitly requested.

## Maven Integration

Prefer using google-java-format through the existing Maven configuration.

If the project already provides a formatting plugin, use it.

Do not introduce or change Maven plugins without approval.

## Formatting Workflow

Before committing changes:

1. Identify all Java files created or modified by the task.
2. Format these files using google-java-format.
3. Verify that the formatting is correct.
4. Review the Git diff for unrelated formatting changes.
5. Run Maven verification.
6. Commit and push the changes.

Formatting MUST be completed before Quality Assurance.

## Scope Restrictions

- Format only Java files belonging to the current task.
- Never format files outside the project workspace.
- Never modify unrelated files solely for formatting purposes.
- Never change application behavior while applying formatting.
- Never download formatter binaries without explicit approval.

## Quality Assurance

The QA agent MUST verify that:

- All newly created or modified Java files follow google-java-format.
- No unrelated files were reformatted.
- Formatting changes do not introduce unintended modifications.
- The required Maven formatting checks pass, when configured.

Formatting violations MUST be corrected before the Pull Request is created.