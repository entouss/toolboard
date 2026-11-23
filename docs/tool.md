# Adding a New Tool

**All new tools must go in a plugin file** (`plugins/toolboxes/*.js`), never in `index.html`. Use `developer-tools.js` as the canonical example:

*This is the path for a tool that ships with the app. Someone who wants a tool of their own on one board writes a [dynamic tool](dynamic-tool.md) instead, and does not touch this repository.*

1. Add CSS rules to the style IIFE (before the closing backtick)
2. Add the tool ID to the toolbox's `tools` array
3. Add `PluginRegistry.registerTool({...})` with `content` (HTML string), `onInit`, `defaultWidth`/`defaultHeight`, `tags`
4. Add all functions after existing functions, before the export IIFE
5. Add all function names to the `functionsToExport` array in the export IIFE
6. Add any constants/state to the export IIFE's state serialization section
7. Update the tool count in `console.log` statements

**Export as PDF** (in every tool's settings) prints the tool through the browser's print
dialog, where Save as PDF keeps it. By default it prints a copy of the tool as it is on
screen (`buildToolPrintHtml` in `index.html`): what is typed in its fields, its canvases
as pictures, anything that scrolls let out in full, embedded pages left out, in the
light theme. A tool whose screen does not suit paper names a function in its
registration, `printHtml: 'myPrintHtml'`, taking the tool's id and returning the HTML of
the page's body; it is printed with plain print styles (headings, lists, tables, links)
instead of the app's. If it throws, the copy of the screen is printed. The Vacation
Planner's (`vacPrintHtml`) prints its bullet list, rendered.
