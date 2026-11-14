---
name: general-rules
description: General project rules. Use when planning, implementing, reviewing, documenting, building, or validating work in this repository, including workflow, review, build and validation expectations.
---

Apply these guidelines in this repository. Paths are relative to the repository root.

For new UI or visual changes, also apply [UI design](../ui-design/SKILL.md).

## Workflow and review

- Start planning and design at the highest level of abstraction:
  - Define the intended behavior, public interfaces, and caller control flow before lower-level
  details.
  - When implementing, establish the high-level control flow and data
  structures first.
  - Early increments may contain empty or unimplemented constructs
  and do not have to compile.
  - Gradually fill in the lower-level details until the
  complete implementation works, then run the required validation.
- Do not create a plan file unless the user explicitly asks for one, even in
  Plan mode or for large or complex tasks. Otherwise, keep planning brief and
  in the conversation. When requested, keep the plan proportional to the task;
  do not write a large plan unless the user asks for that level of detail.
- Always make each step as small and focused as practical, with one clear outcome
  that can be reviewed independently. Split large steps before starting them;
  do not bundle unrelated changes merely to reduce the number of checkpoints.
- When a plan file is requested, describe each step: its intended changes, prerequisites, and the
  checks or evidence required to consider it complete. Give steps stable IDs and
  Markdown checkboxes (`[ ]` pending, `[x]` complete). List steps in topological
  order, with prerequisites before dependent steps. Explicitly identify steps
  that have no dependencies on each other and can run in parallel or any order.
- Whenever you mention a code location (a function, type, field, or specific
  lines) in a reply, include a clickable reference with the file path and line
  number so the user can jump there in the editor, for example
  [`compile`](design/system/build.ts#L33) or a line range such as
  [build.ts#L33-L76](design/system/build.ts#L33-L76). Use paths
  relative to the repository root. Look up the actual line numbers first;
  never guess them.
- When referencing any file to the user, always use a clickable Markdown file
  link. For code locations, include the relevant line number in the link.

## Build and validation

- Do not write new tests unless the user explicitly requests them.
- Do not change existing tests.
- Never write absolute paths in files; use paths relative to the repository root.
