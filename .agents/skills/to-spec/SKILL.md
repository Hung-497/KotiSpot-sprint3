---
name: to-spec
description: "Turn settled requirements and repository context into one implementation-ready local specification under .scratch; synthesize rather than restarting the interview."
---

# To Spec

Turn the current conversation, especially decisions established by
`grill-with-docs`, into one implementation-ready local specification.

Do NOT restart the requirements interview. Reuse settled decisions and
already-discovered repository facts.

## Process

### 1. Gather settled context

Read the relevant conversation or supplied planning artifact. Use the project's
domain glossary vocabulary and respect applicable ADRs.

Treat explicit decisions as settled unless they conflict with the current
request or repository.

### 2. Fill only concrete gaps

Do not rescan the whole repository after grilling. When a specific fact needed
by the specification is missing, inspect only the directly relevant files,
tests, or configuration.

If a material product decision is still unresolved and cannot be cheaply
verified, stop and identify that gap instead of guessing or restarting a broad
interview.

### 3. Choose testing seams

Record testing seams that verify externally observable behavior. Prefer an
existing high-level seam over several new seams. Include only decisions useful
to later ticket decomposition and implementation.

### 4. Write the local specification

Infer a concise feature slug from the request. If the intended feature
directory is genuinely ambiguous, ask the user before writing.

Write exactly one specification to:

```text
.scratch/<feature-slug>/spec.md
```

Create the feature directory when needed. Do not publish the specification to
GitHub or any other external issue tracker.

Use this structure:

<spec-template>

# Problem

What needs to change and why.

# Solution

Expected behavior and the high-level approach.

# User Stories / Acceptance Behavior

Distinct, externally observable requirements. Use user stories where they add
clarity; do not manufacture repetitive stories to make the section longer.

# Implementation Decisions

Important implementation constraints and settled decisions, including
relevant boundaries, contracts, persistence choices, and compatibility needs.

Avoid brittle file paths and code snippets unless a small decision-rich shape
communicates a settled contract more precisely than prose.

# Testing Decisions

Important testing seams and expectations. Focus on observable behavior rather
than implementation details.

# Out of Scope

Important boundaries and explicit exclusions.

# Notes

Only information useful to later decomposition or implementation.

</spec-template>

Keep each decision in the most relevant section instead of duplicating it
throughout the document. Make the specification complete enough for
`to-tickets` without unnecessary expansion.
