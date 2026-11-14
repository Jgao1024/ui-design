---
name: ui-design
description: Prototype practice for the iOS 27 and macOS 27 native-component pages in design/. Use when drawing a prototype page for a native component, changing how one looks, or working in design/system, before writing any application code for that UI.
---

# UI design (iOS 27 / macOS 27 prototypes)

Apply these guidelines in this repository. Paths are relative to the repository root.

Also apply the repository [general rules](../general-rules/SKILL.md).

## Design first

- When a UI does not exist in the code yet, always design it first. Do not write
  application code for it until the user has reviewed the design.
- Changes to the look of existing UI also start in the design pages, then move to code.

## Native look is the goal

- Every mock-up must look like the real system control: iOS 27 / macOS 27 with
  Liquid Glass, not a generic web widget.
- Geometry, colours, type and glass layers come from `figma/reference/<kit>/specs/`
  and `figma/reference/<kit>/tokens/` (index in `figma/reference/CATALOG.md`).
  Never estimate a number that the Figma data has. Figma's `GLASS` effect has no
  parameters; draw it with the shared Glass component and the fill, rim and shadow
  layers recorded in the specs.
- Read only `figma/` for reference. Do not read or touch `native/` and `apps/`.
- iOS and macOS are separate: never share a mock-up between them. Shared code is
  limited to the build tools and platform-neutral parts such as `Section` and `Glass`.

## Where design work happens

- Pages live in `design/system/<kit>/pages/<group>/<page>.tsx`, where `<kit>` is
  `ios27` or `macos27` and `<group>` is one of the groups in
  [taxonomy.md](taxonomy.md). One page per component family, with all its variants
  and states.
- Prefer normal HTML JSX with Tailwind utilities for layout and styling. Platform-neutral
  parts (`Page`, `Section`, `Row`/`Variant`, `Glass`) live in `design/system/components/`.
  Parts that draw a platform's controls live in `design/system/<kit>/components/`.
  Page-chrome colours and fonts are defined once in `design/system/theme.ts`; mock-up
  colours for a platform in `design/system/<kit>/theme.ts`.
- Work in one kit at a time and edit only that kit's folders. A change to a shared file
  must work for both kits; tell the user when you make one.
- Build with `./design/build.sh <kit>` (or no argument for both kits). It writes each page
  to `design/pages/<kit>/<group>/<page>.html` and an `index.html` that links them all.
  Never edit `design/pages` by hand; it is build output.
- Commit the source only. `design/pages/` and `design/shots/` are ignored generated output.
- Reuse existing components and theme values. When a part repeats, extract it into a
  component instead of copying it. Use the theme's colours instead of literal values.
- Use an existing page as a template for the page structure, title, subtitle and notes.

## The design system is static

- The design system is only static visual demos. It is not the final application and
  does not share code with it.
- The built HTML contains no JavaScript; the build fails if it does. JSX runs only at
  build time.
- Show interaction states (hover, pressed, selected, disabled, focused) as separate
  static mock-ups side by side, not as behaviour.

## Page layout

A design page is a document about the UI, not the UI itself. Its layout should make
the relationships between mock-ups visible at a glance: what is the UI and what is
commentary, which views belong together, and which views are meant to be compared.

- Separate the page from the UI. Pages use the light page background from the build;
  page titles, headings and captions use dark text. Mock-ups sit on their own
  backdrop (wallpaper, window, sheet) so they read as UI on a sheet of paper. Do not
  paint a page-wide dark background.
- Group views by logical unit. Give each unit (for example the states of one
  component) a section with a heading and a one-line description, separated from the
  previous section by a rule. Rows inside a section hold related variants.
- Align what is compared. Views in one row share their tracks: titles on one line,
  captions on one line, and mock-ups starting at the same height, even when one
  caption is longer or missing. Use a shared grid (for example a row grid with
  `grid-rows-subgrid` children), not per-item offsets.
- Show Light and Dark side by side wherever the component differs between them.
- Never let text overlap. A caption that does not fit its column wraps, and the row
  grows to fit it.
- Let content flow. Lay out sections and rows with normal flow and grids rather than
  absolute coordinates, so adding a view or a longer caption never needs manual
  repositioning.

## Page content

- Put notes and comments in the page margin, outside the drawn UI. Text inside a
  mock-up reads as real UI.
- Show each fact once. Do not add hints, labels or buttons the user did not ask for.
- When proposing options, draw them side by side on one page with a short note each,
  and let the user pick.

## Review

- After building, check the rendered page visually (headless Chrome screenshot of the
  HTML, see `design/shot.sh`) before reporting.
- Stop after each design step and let the user review. Report the page with a
  clickable link.
