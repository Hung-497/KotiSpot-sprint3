---
name: to-tickets
description: Break a local specification into small, independently implementable Markdown tickets with explicit dependencies and acceptance criteria.
disable-model-invocation: true
---

# To Tickets

Break a local specification into **tickets**: tracer-bullet vertical slices, each
declaring the tickets that block it.

## Process

### 1. Gather context

Work from decisions already available in the conversation and read the complete
local specification, normally `.scratch/<feature-slug>/spec.md`.

Do not restart the requirements interview or duplicate the specification.

### 2. Explore the codebase (optional)

If a concrete decomposition decision needs repository context that is not
already known, inspect only directly relevant code, tests, or configuration.
Do not automatically rescan the repository after `grill-with-docs` and
`to-spec`.

Ticket titles and descriptions should use the project's domain glossary
vocabulary and respect ADRs in the area being changed.

Look for opportunities to prefactor the code to make the implementation easier. "Make the change easy, then make the easy change."

### 3. Draft vertical slices

Break the work into **tracer bullet** tickets.

<vertical-slice-rules>

- Repository scope rules take precedence over generic layer examples. Each slice cuts a narrow but COMPLETE path only through the layers in scope for its workstream.
- A backend slice may be complete across backend layers without frontend work. A frontend slice may be complete across frontend and mock-data layers without backend integration.
- Do not create cross-frontend/backend integration work when repository instructions defer integration, unless the governing project documentation or an explicit user decision changes that scope.
- A completed slice is demoable or verifiable on its own
- Each slice is sized to fit in a single fresh context window
- Any prefactoring should be done first

</vertical-slice-rules>

Give each ticket its **blocking edges**: the other tickets that must complete before it can start. A ticket with no blockers can start immediately.

**Wide refactors are the exception to vertical slicing.** A **wide refactor** is one mechanical change (rename a column, retype a shared symbol) whose **blast radius** fans across the whole codebase, so a single edit breaks thousands of call sites at once and no vertical slice can land green. Don't force it into a tracer bullet; sequence it as **expand–contract**. First expand: add the new form beside the old so nothing breaks. Then migrate the call sites over in batches sized by blast radius (per package, per directory), each batch its own ticket blocked by the expand, keeping CI green batch to batch because the old form still exists. Finally contract: delete the old form once no caller remains, in a ticket blocked by every migrate batch. When even the batches can't stay green alone, keep the sequence but let them share an integration branch that all block a final integrate-and-verify ticket; green is promised only there.

### 4. Quiz the user

Present the proposed breakdown as a numbered list. For each ticket, show:

- **Title**: short descriptive name
- **Blocked by**: which other tickets (if any) must complete first
- **What it delivers**: the end-to-end behaviour this ticket makes work

Ask the user:

- Does the granularity feel right? (too coarse / too fine)
- Are the blocking edges correct: does each ticket only depend on tickets that genuinely gate it?
- Should any tickets be merged or split further?

Iterate until the user approves the breakdown.

### 5. Write the approved local tickets

Write one file per approved ticket under:

```text
.scratch/<feature-slug>/tickets/<NN>-<slug>.md
```

Number tickets from `01` in dependency order, blockers first. Dependencies must
reference local ticket filenames. Never combine all tickets into one file.

Each ticket should contain only the context needed to implement that ticket
independently. Reference `../spec.md` when useful, but do not copy the whole
specification into every ticket.

Do not publish tickets to GitHub or any other external issue tracker.

<local-ticket-template>

# <Ticket title>

## Goal

The coherent behavior or enabling change this ticket delivers.

## Context

Only the relevant decisions and surrounding context needed to implement this
ticket. Reference `../spec.md` when useful.

## Acceptance Criteria

- [ ] Externally observable or concretely verifiable criterion 1
- [ ] Externally observable or concretely verifiable criterion 2

## Implementation Notes

Settled constraints, likely seams, or narrow guidance that reduces
rediscovery. Omit speculative detail.

## Depends On

- `<NN>-<slug>.md`

Use "None" or omit this section when there are no dependencies.

## Verification

Focused tests, checks, or manual verification needed for this ticket.

</local-ticket-template>

Avoid brittle application file paths or code snippets unless a prototype
produced a small decision-rich shape that communicates a settled contract more
precisely than prose.
