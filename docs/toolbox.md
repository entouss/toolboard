# Toolbox Plugins

## Plugin Structure (e.g., `developer-tools.js`)

Each toolbox file follows this pattern in order:

1. **CSS IIFE** — injects a `<style>` element with all tool styles, guarded by an ID check to prevent duplicate injection
2. **Toolbox registration** — `PluginRegistry.registerToolbox()` with a `tools` array listing all tool IDs
3. **Tool registrations** — one `PluginRegistry.registerTool()` per tool, with inline HTML `content` and `onInit` function name
4. **Functions** — all tool logic as top-level functions (must be global for `onclick` handlers)
5. **Export IIFE** — collects all function references into `functionsToExport` array, serializes them into a `<script>` tag for HTML export support

## Existing Toolbox Plugins

- `plugins/toolboxes/core-tools.js` — Checklist, Simple Calculator
- `plugins/toolboxes/productivity-tools.js` — Pomodoro Timer, Unit Converter, Playback Speed Calc, Calendar, Random Picker, Dice Roller, Stopwatch, YouTube Embed
- `plugins/toolboxes/developer-tools.js` — Diff Viewer, Sequence Diagram, JWT Decoder, Code Formatter, Cron Expression, Regex Tester, Epoch Converter, IP Address Info, and others
- `plugins/toolboxes/finance-tools.js` — Investment Calculator, Tax Calculator, Loan Calculator
- `plugins/toolboxes/creative-tools.js` — Color Picker, Drawing Canvas, Emoticon Picker, Family Tree, Image Viewer
- `plugins/toolboxes/educational-tools.js` — Analog Clock, Money Counter
