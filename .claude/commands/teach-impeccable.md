---
name: teach-impeccable
description: One-time setup — gather design context for this project
---
I need to learn about this project's design language so all future /audit, /polish, /critique, /review-ui commands are project-aware. Interview me with these questions one at a time using AskUserQuestion:

1. What are your brand colors? (primary, secondary, accent — hex codes if you have them)
2. What fonts does this project use? (the codebase uses Geist Sans + Built Titling — are these intentional brand choices or placeholders?)
3. What is the overall design tone? (minimal, bold, corporate, playful, luxury, editorial, brutalist?)
4. Who is the target audience? (age range, technical level, context of use — mobile fitness users?)
5. Are there any existing design references, competitor apps, or mood boards to follow?
6. Light mode, dark mode, or both? (globals.css currently supports both via prefers-color-scheme)

After gathering answers, save them to .claude/skills/impeccable/brand-context.md in this format:

# Brand Context for ShiftFrontend
## Colors
(answers — note: brand accent currently lime-green #a3e635 from dashboard walking icon)
## Typography
(answers — note: Geist Sans body, Built Titling for headings currently in use)
## Design Tone
(answers)
## Target Audience
(answers)
## References
(answers)
## Theme
(answers)

This file will be read automatically by all Impeccable commands going forward.
