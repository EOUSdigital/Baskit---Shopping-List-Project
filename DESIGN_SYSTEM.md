
### DESIGN_SYSTEM.md answers
- How is this project designed?
- How should new components be built?
- Which rules should every developer follow?

---

DESIGN_SYSTEM.md

1. Philosophy

2. Design Principles

3. Design Tokens

4. Motion System

5. Layout System

6. Component Rules

7. Accessibility Rules

8. Responsive Rules

9. CSS Naming Conventions

10. JavaScript Naming Conventions

11. HTML Conventions

12. Future Improvements

---

### CSS Settings agreements
- CSS classes use kebab-case.
- Use rem instead of px.
- Never hardcode colors.
- Always use design tokens.
- Never animate width.
- Use Grid for two-dimensional layouts.
- Use Flexbox for one-dimensional layouts.

---

### Decorative motion uses Motion Tokens.
- Essential interactions should remain usable when animations are disabled.
- Motion Preferences override decorative animations.
- Motion distances come from the Motion Distance System.
- Component animations should never define their own durations.

---

### Spacing Rules
- Components never use literal spacing values such as 12px or 1.2rem unless there is a documented exception.
- All component spacing should use the project's spacing tokens.
- Layout containers control the space between sibling components.
- Components control their own internal spacing.
- New spacing values should be added to the design system only when an existing token cannot satisfy a genuine design need.

---

### Resources
- https://m3.material.io/
- https://carbondesignsystem.com/
- https://fluent2.microsoft.design/
