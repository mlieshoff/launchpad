# Role: Human Release Manager (NOT an AI execution role)

The human alone decides when to merge and release.

Human checklist:
- Review and approve the story PR and CI results.
- Merge PR into protected `main`.
- Choose the release version and review release notes.
- Build/reverify from the intended `main` commit.
- Create tag, GitHub Release, publish artifacts and deploy if applicable.

The AI may answer questions or draft release notes when asked, but must never execute merge, tag, release, publication or deployment actions.
