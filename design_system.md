# Baskit Design System

This document defines the visual, interaction, accessibility, responsive, and naming rules for the Baskit project.

It answers three questions:

- How is this project designed?
- How should new components be built?
- Which rules should every developer follow?

The design system is a project-level source of truth for design decisions. It should evolve with the project, but changes should be deliberate and documented.

---

## 1. Philosophy

Baskit should use a simple, consistent, accessible, and maintainable interface.

The design system exists to prevent every page or component from inventing its own visual rules.

New UI should normally reuse existing:

- design tokens
- layout patterns
- component patterns
- interaction patterns
- accessibility rules
- responsive rules
- naming conventions

A new value or pattern should be introduced only when an existing system rule cannot reasonably satisfy the requirement.

---

## 2. Design Principles

### 2.1 Clarity

Users should be able to understand:

- what a section represents
- what an interactive element does
- where an action leads
- what state the interface is currently in

### 2.2 Consistency

Similar components should look and behave similarly.

Do not create multiple visual treatments for the same interaction without a documented reason.

### 2.3 Accessibility

Accessibility is part of the design, not a later enhancement.

UI should remain usable with:

- keyboard navigation
- visible focus
- reduced motion preferences
- sufficient colour contrast
- semantic HTML
- readable text
- appropriate labels and names

### 2.4 Responsive behaviour

Layouts should adapt to available space rather than being designed only for named devices.

Avoid unnecessary horizontal scrolling and preserve usable controls at smaller widths.

### 2.5 Simplicity

Prefer the simplest implementation that satisfies the requirement.

Do not add JavaScript when CSS or semantic HTML can solve the problem.

Do not introduce a new component pattern when an existing one can be reused.

### 2.6 Maintainability

Design decisions should be understandable by another developer.

Repeated values should become tokens or reusable rules rather than isolated literals.

---

## 3. Design Tokens

Design tokens are the controlled values used throughout the interface.

The current CSS remains the implementation source for the project's actual values. This document defines how those values should be used and governed.

### 3.1 Colour

- Never hardcode colours inside individual components when a project token exists.
- Use semantic colour roles where practical, such as:
  - primary
  - secondary
  - background
  - surface
  - text
  - muted text
  - border
  - success
  - warning
  - error
  - focus
- A component should use a semantic token rather than choosing an unrelated colour.
- Colour must not be the only way to communicate meaning.

### 3.2 Typography

Typography should use a consistent type scale.

Define and reuse tokens for:

- font family
- body text size
- small text
- headings
- line height
- font weight
- text emphasis

Use `rem` as the default unit for scalable typography.

Avoid arbitrary typography values inside individual components.

### 3.3 Spacing

Components never use literal spacing values such as `12px` or `1.2rem` unless there is a documented exception.

All component spacing should use the project's spacing tokens.

Layout containers control the space between sibling components.

Components control their own internal spacing.

New spacing values should be added to the design system only when an existing token cannot satisfy a genuine design need.

### 3.4 Sizing

Use consistent sizing rules for:

- controls
- icons
- images
- cards
- containers
- interactive targets

Use `rem` as the default unit for scalable sizing.

A fixed unit may be appropriate when a value represents a genuinely fixed rendering requirement; such exceptions should be intentional and documented.

### 3.5 Borders

Borders should use shared tokens for:

- colour
- thickness
- style

Avoid creating slightly different border values for individual components without a clear reason.

### 3.6 Radius

Use a small, consistent radius scale.

Components should reuse existing radius tokens rather than defining arbitrary corner radii.

### 3.7 Shadows

Use shared shadow tokens for elevation.

Do not create one-off shadows for individual components unless the visual requirement genuinely differs from the existing system.

### 3.8 Motion

Motion values belong to the design system.

Define reusable tokens for:

- duration
- easing
- distance

Component animations should not define their own unrelated durations.

### 3.9 Breakpoints

Responsive breakpoints should be defined centrally.

Breakpoints should represent meaningful layout changes rather than targeting specific device names.

---

## 4. Motion System

Decorative motion uses Motion Tokens.

- Essential interactions should remain usable when animations are disabled.
- Motion Preferences override decorative animations.
- Motion distances come from the Motion Distance System.
- Component animations should never define their own durations.
- Prefer short, purposeful transitions.
- Do not animate properties that create unnecessary layout work when a more appropriate property can be used.
- Respect `prefers-reduced-motion`.
- Motion must not prevent users from understanding or completing an interaction.

The project's current motion token values should remain defined in the CSS token implementation rather than being duplicated here.

---

## 5. Layout System

### 5.1 General layout

- Layout should be controlled by predictable containers.
- Avoid arbitrary offsets to position major sections.
- Prefer normal document flow.
- Use spacing tokens for gaps and padding.
- Avoid unnecessary absolute positioning.

### 5.2 Flexbox

Use Flexbox for one-dimensional layouts.

Typical uses include:

- navigation rows
- button groups
- horizontal card controls
- icon-and-text alignment
- vertically aligned component content

### 5.3 Grid

Use Grid for two-dimensional layouts.

Typical uses include:

- product grids
- page-level content arrangements
- repeated card collections
- layouts requiring rows and columns

### 5.4 Containers

Page-level containers should control:

- maximum content width
- horizontal padding
- alignment
- responsive margins

Do not make every component independently decide the page's overall width.

### 5.5 Gap

Prefer `gap` for spacing between flex and grid siblings where appropriate.

Avoid adding unnecessary margins to multiple children when the parent layout can control the relationship.

### 5.6 Overflow

Prevent accidental horizontal overflow.

Scrollable areas should be intentional and usable.

### 5.7 Positioning

Use positioning only when the component genuinely requires it.

Prefer normal flow, Flexbox, and Grid before `position: absolute` or `position: fixed`.

### 5.8 Stacking

When elements overlap, use a documented stacking strategy.

Avoid arbitrary `z-index` values scattered throughout the stylesheet.

---

## 6. Component Rules

### 6.1 Component Responsibilities

Each component should have a clear responsibility.

A component should not unnecessarily control unrelated parts of the page.

For example:

- a product card presents product information and product actions
- navigation controls navigation
- a basket component manages basket presentation and basket actions
- a page container controls page-level layout

### 6.2 Component Structure

Components should:

- use semantic HTML where appropriate
- use design tokens
- follow naming conventions
- support responsive behaviour
- provide visible interaction states
- avoid unnecessary hardcoded values
- avoid unnecessary JavaScript
- keep visual and behavioural responsibilities understandable

### 6.3 Component States

Interactive components should account for relevant states, such as:

- default
- hover
- focus
- active
- disabled
- selected
- empty
- error
- loading, where applicable

Not every component requires every state.

### 6.4 Component Composition

Prefer composing small, understandable components over creating large components with unrelated responsibilities.

Reuse an existing component when the behaviour and purpose are substantially the same.

Create a new component when:

- the responsibility is genuinely different
- the existing component cannot reasonably support the requirement
- reuse would make the existing component unnecessarily complex

---

## 7. Accessibility Rules

### 7.1 Semantic HTML

Use the HTML element that represents the intended meaning.

Prefer:

- `button` for actions
- `a` for navigation
- `label` for form controls
- headings for document structure
- lists for lists
- semantic landmarks where appropriate

Avoid using generic `div` elements when a semantic element is available.

### 7.2 Keyboard access

All interactive functionality should be usable with a keyboard.

Do not create custom interactions that can only be operated with a mouse.

### 7.3 Focus

Interactive elements must have a visible focus state.

Do not remove the browser focus indicator without providing an accessible replacement.

### 7.4 Colour

Do not use colour as the only indication of:

- errors
- success
- selection
- state
- required information

### 7.5 Forms

Form controls should have:

- clear labels
- understandable instructions where needed
- useful error messages
- appropriate native input types

### 7.6 Images

Images should have appropriate alternative text.

Decorative images should be treated as decorative rather than receiving unnecessary descriptive text.

### 7.7 Motion

Respect reduced-motion preferences.

Essential functionality must not depend on animation.

### 7.8 Touch and pointer interaction

Interactive controls should have sufficient usable space and should not depend on extremely precise pointer movement.

---

## 8. Responsive Rules

Responsive behaviour should be based on content and layout requirements.

- Do not design only for named devices.
- Avoid horizontal page overflow.
- Allow grids and content to reflow.
- Preserve readable text sizes.
- Keep controls usable at smaller widths.
- Test navigation, product cards, forms, basket controls, and other interactive components at different viewport widths.
- Do not solve a responsive problem by adding arbitrary fixed widths unless there is a documented reason.
- Use the project's breakpoint tokens consistently.

---

## 9. CSS Naming Conventions

- CSS classes use `kebab-case`.
- Use meaningful names based on purpose or role rather than purely visual appearance.
- Use design tokens instead of hardcoded colours.
- Use spacing tokens instead of arbitrary spacing values.
- Never animate width unless there is a documented reason and the interaction genuinely requires it.
- Use Grid for two-dimensional layouts.
- Use Flexbox for one-dimensional layouts.
- Custom properties use `--kebab-case`.
- Data attributes use `data-kebab-case`.
- Keep visual classes and JavaScript hooks separate where doing so improves maintainability.
- Avoid overly generic class names such as `.box`, `.thing`, or `.blue`.

---

## 10. JavaScript Naming Conventions

JavaScript naming should communicate intent.

- Variables and functions use `camelCase`.
- Boolean variables should communicate a yes/no state, using names such as `isOpen`, `hasItems`, `shouldRender`, or `canSubmit`.
- Arrays should normally use plural names when appropriate.
- DOM references should describe the element's role, such as `searchInput`, `basketTrigger`, or `resultsGrid`.
- Functions should describe an action, such as `renderProducts()`, `saveRoute()`, or `changeRouteView()`.
- Avoid single-letter names except where their meaning is genuinely obvious from context.
- Avoid names that describe implementation details when the name can describe the responsibility instead.
- Keep naming consistent with the existing project vocabulary.

---

## 11. HTML Conventions

- Use semantic HTML.
- Maintain a logical heading hierarchy.
- Use buttons for actions.
- Use links for navigation.
- Associate form controls with labels.
- Avoid unnecessary `div` nesting.
- Use templates for repeated structures where appropriate.
- Keep document structure understandable without JavaScript.
- Use IDs only when an element genuinely needs unique identification or a specific DOM relationship.
- Use classes for reusable styling.
- Use data attributes for meaningful data or JavaScript hooks where appropriate.
- Keep accessibility information close to the element it describes.

---

## 12. Design System Governance

The design system should be treated as a maintained project document rather than a collection of suggestions.

### 12.1 Adding Tokens

Before adding a new token:

1. Check whether an existing token already satisfies the requirement.
2. Check whether the new value is genuinely different.
3. Add the token to the appropriate category.
4. Use the token consistently.
5. Document the reason if the new value represents an exception.

### 12.2 Adding Components

Before creating a new component:

1. Check whether an existing component can be reused.
2. Identify the component's responsibility.
3. Identify its required states.
4. Apply existing tokens and naming conventions.
5. Check accessibility and responsive behaviour.
6. Document a genuinely new reusable pattern.

### 12.3 Exceptions

Exceptions are allowed when a real requirement cannot be satisfied by the existing system.

An exception should record:

- what rule is being bypassed
- why it is necessary
- where it applies
- whether it should later be converted into a reusable system rule

### 12.4 Design Debt

Known inconsistencies should be documented rather than silently reproduced.

When an existing implementation conflicts with this design system, the team should distinguish between:

- intentional project decisions
- temporary implementation limitations
- genuine design debt

---

## 13. Current Design-System Limitations

The current design-system document defines the project's rules and structure, but the actual numeric token registry is still maintained in the CSS implementation.

The following should be consolidated into explicit token values as the design system matures:

- colour tokens
- typography scale
- spacing scale
- sizing scale
- border values
- radius scale
- shadow scale
- motion durations
- motion distances
- easing values
- responsive breakpoints

These values should be derived from the actual Baskit implementation rather than invented independently in this document.

---

## 14. Future Improvements

Potential future work includes:

- formalising the complete token registry
- documenting reusable UI components
- adding component state examples
- documenting common page-layout patterns
- documenting accessibility testing procedures
- documenting responsive test cases
- adding visual examples where useful
- introducing automated style checks
- aligning future React components with the same design principles
- maintaining design-system decisions as the project architecture evolves

Future technologies should adopt the same design principles without requiring the current design system to predict every implementation detail in advance.

---

## 15. References

These resources are design references and sources of inspiration. They are not project dependencies.

- Material Design — https://m3.material.io/
- Carbon Design System — https://carbondesignsystem.com/

---

## Design System Change Rule

When changing the interface, ask:

1. Does an existing token or pattern already solve this?
2. Does the change preserve semantic HTML?
3. Does it remain keyboard accessible?
4. Does it remain usable with reduced motion?
5. Does it work responsively?
6. Does it follow the project's naming conventions?
7. Does it introduce a new value that should become a token?
8. Is the change a deliberate design decision or temporary design debt?

The goal is not to prevent change.

The goal is to make change consistent, understandable, and maintainable.
