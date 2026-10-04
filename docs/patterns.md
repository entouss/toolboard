# Key Patterns

- **Instance isolation**: tools use `element.closest('.tool').getAttribute('data-tool')` to get the tool instance ID, then scope all DOM queries and data access to that instance
- **Rendering**: full re-render on every data change — read state, rebuild innerHTML, save state
- **Inline event handlers**: `onclick="functionName(this)"` in HTML strings, with functions accessing the widget via `btn.closest('.widget-class')`
- **Drag & drop**: module-level state object (e.g., `checklistDragState`), `dragstart`/`dragover`/`dragleave`/`drop` handlers, same-level reorder only
- **Markdown toggle**: textarea overlay that converts to/from structured data, toggled by a button that switches between "Markdown" and "Apply" labels
- **Saving state**: write through `saveToolCustomizations(toolCustomizations)` and nothing else. That is the door board-level undo listens at, so state saved this way is undoable for free, and state written straight to `localStorage` is not — see [Storage](storage.md#undo-and-redo)
- **CSS theming**: use `var(--bg-primary)`, `var(--text-primary)`, `var(--border-color)`, etc. for light/dark mode support
