---
name: review-ui
description: Review UI/UX quality of a page before merging — runs Impeccable audit
---
Review the UI quality of: $ARGUMENTS

This is a frontend project — every page must meet design quality standards before merging.

1. Read the page file: `app/$ARGUMENTS/page.tsx` (or the path given)
2. Read `docs/PATTERNS.md §11` (Tailwind conventions)
3. Read `.claude/skills/impeccable/SKILL.md` for design quality criteria
4. Read `.claude/skills/impeccable/brand-context.md` if it exists (project brand context)

Check for:

**Design anti-patterns:**
- [ ] Cards nested inside cards
- [ ] Pure gray used instead of brand-tinted neutrals
- [ ] System fonts (Arial, Helvetica) as primary typeface
- [ ] Gray text on colored backgrounds (contrast issue)
- [ ] Purple gradients instead of project-specific palette
- [ ] Bounce/elastic easing on animations

**Accessibility:**
- [ ] Interactive elements have accessible labels (`aria-label` on icon-only buttons)
- [ ] Form inputs have associated `<label>` elements
- [ ] Color is not the only means of conveying information

**Responsiveness:**
- [ ] Page usable on mobile viewport (320px+)
- [ ] No horizontal overflow

**Consistency:**
- [ ] Same button styles as other pages
- [ ] Same Toast pattern as rest of app
- [ ] Same loading spinner (`<Loader2 className="animate-spin">`)

Report findings with file:line references and P1/P2/P3 severity.
Then suggest specific Tailwind class fixes for each issue.
