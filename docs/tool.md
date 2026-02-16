# Adding a New Tool

**All new tools must go in a plugin file** (`plugins/toolboxes/*.js`), never in `index.html`. Use `developer-tools.js` as the canonical example:

1. Add CSS rules to the style IIFE (before the closing backtick)
2. Add the tool ID to the toolbox's `tools` array
3. Add `PluginRegistry.registerTool({...})` with `content` (HTML string), `onInit`, `defaultWidth`/`defaultHeight`, `tags`
4. Add all functions after existing functions, before the export IIFE
5. Add all function names to the `functionsToExport` array in the export IIFE
6. Add any constants/state to the export IIFE's state serialization section
7. Update the tool count in `console.log` statements
