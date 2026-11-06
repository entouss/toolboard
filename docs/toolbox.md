# Toolbox Plugins

## Plugin Structure (e.g., `developer-tools.js`)

Each toolbox file follows this pattern in order:

1. **CSS IIFE** — injects a `<style>` element with all tool styles, guarded by an ID check to prevent duplicate injection
2. **Toolbox registration** — `PluginRegistry.registerToolbox()` with a `tools` array listing all tool IDs
3. **Tool registrations** — one `PluginRegistry.registerTool()` per tool, with inline HTML `content` and `onInit` function name
4. **Functions** — all tool logic as top-level functions (must be global for `onclick` handlers)
5. **Export IIFE** — collects all function references into `functionsToExport` array, serializes them into a `<script>` tag for HTML export support

## Existing Toolbox Plugins

- `plugins/toolboxes/core-tools.js` — Checklist (✨ breaks a goal into steps, says what next), Simple Calculator
- `plugins/toolboxes/productivity-tools.js` — Agenda Timer (✨ drafts a plan, writes up a run), Kanban Board (✨ drafts cards, writes a status update), Pomodoro Timer, Unit Converter, Playback Speed Calc, Calendar, Random Picker, Dice Roller, Stopwatch, YouTube Embed
- `plugins/toolboxes/developer-tools.js` — Diff Viewer (edited in place, side by side or inline, with no Edit/Both/View; says when the two are identical or only look it; a change stripe down the side, as in IntelliJ, with ↑/↓, Alt+↑/↓ and F7/Shift+F7 to step through the changes; invisible characters drawn and tidied), Sequence Diagram, JWT Decoder, Code Formatter, Cron Expression, Regex Tester, Epoch Converter, IP Address Info, and others
- `plugins/lib/codemirror-merge.js` — CodeMirror 6 and its merge view, bundled into one pinned file by `plugins/lib/build-codemirror.sh` (loaded from a CDN module by module, its packages come at several versions and CodeMirror refuses to mix them). The Diff Viewer loads it when shown, from beside its toolbox; where it cannot, the difference is shown to read.
- `plugins/toolboxes/diagram-tools.js` — Mermaid Diagram (✨ draws one from a description, changes it, fixes a syntax error, explains it), Sequence Diagram, Family Tree, Diagram
- `plugins/toolboxes/finance-tools.js` — Finance Planning (accounts, income and expenses rolled up into net worth and projected month by month, through retirement: pay stopping, savings drawn on in order with pre-tax money taxed and minimum withdrawals, whether the money lasts and the most that could be spent; for each year, the savings needed to stop working then, and those that would last forever, with the earliest year each is reached; Social Security estimated from pay when no statement amount is given; ages beside every year and month; its guide is `learn/tools/finance-planning.html`, opened from the ? on the planner and on Tax & Retirement Rules; ✨ checks and explains the plan, drafts it from a description and sorts expenses into sections, on the device and from the plan's own figures; loan and investment accounts and the income open their calculator in a popup), Investment Calculator, Tax Calculator (by year, from Tax & Retirement Rules), Tax & Retirement Rules (id `tax-brackets`: federal brackets and standard deductions, capital-gains brackets, payroll tax, Social Security taxation, contribution limits, and the withdrawal and Social Security rules, by year, kept once for the app; Finance Planning taxes Social Security by the IRS worksheet, gains at their own rates, pay with payroll tax, and says when contributions are over the limit), Loan Calculator (a new loan, or one under way: from its current balance, the time and interest left and where it sits on the original schedule; with a closing date, ahead or behind it and in calendar years; every field kept)
- `plugins/toolboxes/creative-tools.js` — Color Picker, Drawing Canvas, Emoticon Picker, Family Tree, Image Viewer
- `plugins/toolboxes/educational-tools.js` — Analog Clock, Money Counter, World Map
- `plugins/toolboxes/project-tools.js` — Project Table (T-shirt sizing, deadlines, and the Gantt chart they imply; sub-tasks fold away under their task; ✨ drafts rows and breaks a row down, for the table to schedule, and writes a status update and the risks; in Both, a timeline of this quarter and the next three and this half and the next, with their dates, and under the quarters their timeboxes, sprints and planning week, between the table and the chart, and the chart can match its span so the dates line up — it is also the divider that shares the height between them)
- `plugins/toolboxes/school-tools.js` — Curriculum Builder, Curriculum Doctor, Curriculum Explorer
