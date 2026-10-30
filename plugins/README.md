# Toolboard Plugin Development Guide

Create custom tools, toolboxes, and board templates to extend Toolboard's functionality.

## Quick Start

Create a JavaScript file that calls `PluginRegistry` methods:

```javascript
// my-tool.js
PluginRegistry.registerTool({
    id: 'my-tool',
    name: 'My Tool',
    description: 'A custom tool',
    icon: '🔧',
    toolbox: 'my-toolbox',
    content: '<div>Hello World</div>'
});
```

Load it via **Settings > Plugins > Add External Plugin**.

---

## Plugin Types

### 1. Tool Plugin

A tool is a single widget that can be added to boards.

```javascript
PluginRegistry.registerTool({
    id: 'my-tool',                    // Required: unique identifier
    name: 'My Tool',                  // Display name
    description: 'What it does',      // Shown in feature list
    icon: '🔧',                       // Emoji icon
    version: '1.0.0',                 // Semantic version
    toolbox: 'my-toolbox',            // Which toolbox to belong to
    tags: ['tag1', 'tag2'],           // Search keywords
    title: 'Tool Title',              // Default window title
    content: '<div>...</div>',        // HTML content
    contentType: 'html',              // 'html' or 'markdown'
    onInit: 'myInitFunction',         // Function name to call on load
    styles: '.my-class { ... }',      // CSS (injected once)
    defaultWidth: 400,                // Default width in pixels
    defaultHeight: 300,               // Default height in pixels
    source: 'external'                // Always 'external' for plugins
});
```

### 2. Toolbox Plugin

A toolbox groups related tools together in the feature list.

```javascript
PluginRegistry.registerToolbox({
    id: 'my-toolbox',                 // Required: unique identifier
    name: 'My Toolbox',               // Display name
    description: 'Collection of tools', // Description
    icon: '📦',                       // Emoji icon
    color: '#3498db',                 // Accent color (hex)
    version: '1.0.0',                 // Semantic version
    tools: ['tool-1', 'tool-2'],      // Array of tool IDs
    source: 'external'                // Always 'external' for plugins
});
```

### 3. Board Template Plugin

A board template creates a pre-configured workspace with tools.

```javascript
PluginRegistry.registerBoard({
    id: 'my-board',                   // Required: unique identifier
    name: 'My Board',                 // Display name
    description: 'A workspace for...', // Description
    icon: '📋',                       // Emoji icon
    version: '1.0.0',                 // Semantic version
    source: 'external',               // Always 'external' for plugins
    settings: {
        title: 'Board Title',         // Board name
        color: '#2c3e50'              // Board accent color
    },
    tools: [
        {
            toolId: 'jwt-decoder',    // Tool to add
            instanceId: 'jwt-1',      // Unique instance ID
            position: {
                x: 20,                // X position
                y: 20,                // Y position
                z: 100,               // Z-index (stacking)
                width: 400,           // Width
                height: 300           // Height
            }
        }
    ]
});
```

---

## API Reference

### PluginRegistry.registerTool(options)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique tool identifier |
| `name` | string | No | Display name (defaults to id) |
| `description` | string | No | Tool description |
| `icon` | string | No | Emoji icon (default: '📝') |
| `version` | string | No | Version (default: '1.0.0') |
| `toolbox` | string | No | Toolbox ID (default: 'uncategorized') |
| `tags` | string[] | No | Search keywords |
| `title` | string | No | Default window title |
| `content` | string | No | HTML or markdown content |
| `contentType` | string | No | 'html' or 'markdown' |
| `onInit` | string | No | Global function name to call after adding |
| `styles` | string | No | CSS to inject |
| `defaultWidth` | number | No | Default width in pixels |
| `defaultHeight` | number | No | Default height in pixels |
| `source` | string | No | 'embedded' or 'external' |

### PluginRegistry.registerToolbox(options)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique toolbox identifier |
| `name` | string | No | Display name |
| `description` | string | No | Toolbox description |
| `icon` | string | No | Emoji icon (default: '📦') |
| `color` | string | No | Hex color (default: '#3498db') |
| `version` | string | No | Version (default: '1.0.0') |
| `tools` | string[] | No | Array of tool IDs |
| `source` | string | No | 'embedded' or 'external' |

### PluginRegistry.registerBoard(options)

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | string | Yes | Unique board identifier |
| `name` | string | No | Display name |
| `description` | string | No | Board description |
| `icon` | string | No | Emoji icon (default: '📋') |
| `version` | string | No | Version (default: '1.0.0') |
| `settings` | object | No | Board settings (title, color) |
| `tools` | array | No | Array of tool instances |
| `source` | string | No | 'embedded' or 'external' |

---

## Examples

### Creating a Simple Tool

```javascript
// plugins/tools/counter.js
PluginRegistry.registerTool({
    id: 'counter-tool',
    name: 'Counter',
    description: 'A simple click counter',
    icon: '🔢',
    toolbox: 'productivity',
    tags: ['counter', 'click'],
    title: 'Counter',
    content: `
        <div style="text-align: center; padding: 20px;">
            <div id="counterDisplay" style="font-size: 48px; margin: 20px 0;">0</div>
            <button onclick="counterIncrement()" style="padding: 10px 20px; font-size: 16px;">+1</button>
            <button onclick="counterReset()" style="padding: 10px 20px; font-size: 16px;">Reset</button>
        </div>
    `,
    onInit: 'counterInit',
    source: 'external'
});

// Global functions for the tool
window.counterInit = function() {
    // Called when tool is added to board
};

window.counterIncrement = function() {
    const display = document.getElementById('counterDisplay');
    display.textContent = parseInt(display.textContent) + 1;
};

window.counterReset = function() {
    document.getElementById('counterDisplay').textContent = '0';
};
```

### Creating a Toolbox with Multiple Tools

```javascript
// plugins/toolboxes/utilities.js

// Register the toolbox first
PluginRegistry.registerToolbox({
    id: 'utilities',
    name: 'Utilities',
    description: 'General utility tools',
    icon: '🧰',
    color: '#e67e22',
    tools: ['color-picker', 'unit-converter'],
    source: 'external'
});

// Register tools that belong to this toolbox
PluginRegistry.registerTool({
    id: 'color-picker',
    name: 'Color Picker',
    description: 'Pick and convert colors',
    icon: '🎨',
    toolbox: 'utilities',
    content: `<div class="color-picker">
        <input type="color" value="#3498db" onchange="colorChanged(this)">
        <div class="color-output"></div>
    </div>`,
    source: 'external'
});

PluginRegistry.registerTool({
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between units',
    icon: '📐',
    toolbox: 'utilities',
    content: `<div class="unit-converter">...</div>`,
    source: 'external'
});
```

### Creating a Board Template

```javascript
// plugins/boards/writing-workspace.js
PluginRegistry.registerBoard({
    id: 'writing-workspace',
    name: 'Writing Workspace',
    description: 'A workspace for writers',
    icon: '✍️',
    source: 'external',
    settings: {
        title: 'Writing Workspace',
        color: '#8e44ad'
    },
    tools: [
        {
            toolId: 'checklist',
            instanceId: 'outline-checklist',
            position: { x: 20, y: 20, z: 100, width: 300, height: 400 }
        },
        {
            toolId: 'calendar',
            instanceId: 'deadline-calendar',
            position: { x: 340, y: 20, z: 101, width: 400, height: 400 }
        }
    ]
});
```

---

## Loading Plugins

### Via UI

1. Open **Settings** (gear icon)
2. Click **Plugins**
3. Either:
   - Click **Add** next to an official plugin, or
   - Enter a URL in "Add External Plugin" and click **Add**

### Via URL

Plugins can also be loaded programmatically:

```javascript
await PluginLoader.loadFromUrl('https://example.com/my-plugin.js');
```

### Persistence

Plugin URLs are saved to localStorage and automatically reloaded on page refresh.

---

## CSS Variables

Use these CSS variables for consistent theming:

```css
/* Colors */
var(--bg-primary)        /* Main background */
var(--bg-secondary)      /* Card/modal background */
var(--bg-tertiary)       /* Input/nested background */
var(--text-primary)      /* Main text */
var(--text-secondary)    /* Secondary text */
var(--text-muted)        /* Subtle text */
var(--text-heading)      /* Headings */
var(--border-color)      /* Primary borders */
var(--border-light)      /* Subtle borders */
var(--accent-color)      /* Accent/brand color */

/* Inputs */
var(--input-bg)          /* Input background */
var(--input-border)      /* Input border */

/* Overlays */
var(--overlay-bg)        /* Modal overlay */
```

### Example Usage

```javascript
PluginRegistry.registerTool({
    id: 'themed-tool',
    // ...
    content: `
        <div style="background: var(--bg-tertiary); padding: 15px; border-radius: 8px;">
            <h3 style="color: var(--text-heading); margin: 0 0 10px;">Title</h3>
            <p style="color: var(--text-secondary);">Content</p>
            <input type="text" style="
                background: var(--input-bg);
                border: 1px solid var(--border-color);
                color: var(--text-primary);
                padding: 8px;
                border-radius: 4px;
            ">
        </div>
    `
});
```

---

## Best Practices

### 1. Use Unique IDs

Prefix your tool/toolbox IDs with your namespace:

```javascript
// Good
id: 'mycompany-analytics-tool'

// Risky - may conflict
id: 'analytics'
```

### 2. Always Set source: 'external'

This helps distinguish your plugins from built-in tools:

```javascript
source: 'external'
```

### 3. Use Global Functions Carefully

Tool `onInit` and event handlers must be global functions. Use unique names:

```javascript
// Good
window.myPluginCounterInit = function() { ... };

// Risky - may conflict
window.init = function() { ... };
```

### 4. Inject Styles Once

Use the `styles` field instead of inline `<style>` tags to avoid duplicate injection:

```javascript
PluginRegistry.registerTool({
    id: 'styled-tool',
    styles: `
        .my-tool-widget { padding: 10px; }
        .my-tool-button { background: #3498db; }
    `,
    content: `<div class="my-tool-widget">...</div>`
});
```

### 5. Handle Multiple Instances

If users can add multiple instances of your tool, use relative selectors:

```javascript
// In event handlers, find elements relative to the clicked element
function myToolAction(btn) {
    const widget = btn.closest('.my-tool-widget');
    const display = widget.querySelector('.display');
    // ...
}
```

### 6. Test Light and Dark Themes

Use CSS variables to ensure your tool looks good in both themes.

---

## Troubleshooting

### Plugin doesn't load

- Check browser console for errors
- Verify the URL is accessible (no CORS issues for remote files)
- Ensure `PluginRegistry` calls are at the top level (not in functions)

### Tool doesn't appear in feature list

- Check that the tool's `toolbox` matches an existing toolbox ID
- Verify the toolbox includes the tool ID in its `tools` array

### Styles not applying

- Use the `styles` field instead of `<style>` tags
- Check for CSS specificity issues
- Use CSS variables for theme compatibility

### onInit not called

- Ensure the function is globally accessible (`window.myFunction = ...`)
- Check the function name matches exactly (case-sensitive)

### Tool content not persisting

- Tool content auto-saves. If using custom state, store it in the tool's data:
  ```javascript
  // Get the tool element
  const tool = document.querySelector('.tool-window[data-instance-id="..."]');
  // State is saved automatically when content changes
  ```

---

## File Structure

Recommended plugin organization:

```
plugins/
├── tools/
│   ├── example-tool.js
│   └── my-custom-tool.js
├── toolboxes/
│   ├── developer-tools.js
│   ├── finance-tools.js
│   └── my-toolbox.js
├── boards/
│   ├── developer-dashboard.js
│   └── my-workspace.js
└── README.md
```

---

## Official Plugins

These plugins are maintained as part of Toolboard:

| Plugin | Path | Description |
|--------|------|-------------|
| Developer Tools | `plugins/toolboxes/developer-tools.js` | JWT, Regex, Code Formatter, Cron, Epoch, Diff, Sequence Diagram |
| Finance Tools | `plugins/toolboxes/finance-tools.js` | Investment, Tax, Loan calculators |
| Developer Dashboard | `plugins/boards/developer-dashboard.js` | Pre-configured developer workspace |

Load them via **Settings > Plugins > Official Plugins**.

---

## Plugins added by URL

Some plugins live here but are not offered in the official list; they are added
through **Settings > Plugins > Add External Plugin** with their path.

### Class Grades — `plugins/tools/class-grades.js`

A student's classes, grades, and missing, late and upcoming work from a school's
learning platform (Canvas LMS), written out as a short report — one line per class
with its overall grade, one per task, and a summary of what is missing, late and due
this week and how the grade moved since the last check. Works with a student's
personal access token, or a parent's, which shows the students it is linked to.

- **The token stays in the browser.** It is never in the tool's settings, so it is not
  in exports, share links, copies or undo history. It is held in memory unless
  "Remember token" is ticked, which keeps it in a browser-only key; Forget removes it.
  The grades fetched are kept the same way, so an exported board carries only the
  school's address.
- **Direct, else through the board's proxy.** The platform does not usually allow
  another site to read its API, so a request blocked that way is made again through
  the board's CORS proxy (`functions/ics-proxy`), with the token in the
  `Authorization` header — never in an address. The proxy answers the published
  board for any public host. A board opened from disk sends its origin as `null`,
  which any sandboxed frame can also send, so for `null` the proxy reaches only
  `*.instructure.com` over https: from disk, use the school's instructure.com address.
  Requests go one at a time. One the proxy drops (no answer the page can read, as
  when an instance runs out of memory) is tried twice more, 1.5 s and then 4 s later;
  a 5xx from the school itself is tried once more and then said to be the school's.
- **Squares:** 🟩 from 90%, 🟧 from 70%, 🟥 below (adjustable); ⬜ for no grade yet.
- **Letter grades:** each class's grade comes with its letter — the course's own when it
  has a grading scheme, otherwise from a scale in the connection settings (the common
  A 93, A- 90, B+ 87 … F one to begin with, editable). Hovering over a class says which.
  **Status:** ✅ handed in, ⚠️ late, 🚫 missing, ⏳ not yet due.
- **Classes fold**, closed to begin with, each saying how many tasks it has; Expand all
  and Collapse all, and which are open is kept per student. Tasks are listed newest due
  first (or oldest first, chosen with the filters), undated work last.
- **Filters** — status, grade colour or a % range, due date (past or next 7/30 days, this
  week, or a range), the date it was handed in (today, the past 7/30 days, this week,
  or a range; late work by when it came, and work not handed in kept unless left out),
  and name — narrow what each class lists, not what its summary
  counts. Classes with nothing that matches are left out, and the rest open. Filters
  are kept with the tool; Copy copies what they show.
- **Saved filters:** the current filters and sort order can be saved under a name
  (Save as…, Rename, Delete — replacing or deleting asks twice) and picked again from
  the Saved menu, which says "Unsaved" while what is shown matches none of them.
- **Class order** (Filters ▸ Classes): name, lowest grade first, most missing first, or
  one's own — Arrange… moves classes up and down, ★ pins some to the top whatever the
  order, and ⊘ hides some (a club, a department page) with a "Show them" to see them
  for now. Per student, by class id; a class that arrives later goes to the end.
- **↻ on a class** reads that class alone again — its grade and its tasks.
- **Sections** (Show ▸ Sections): saved filters shown one after another in a chosen
  order — say Missing, then Upcoming — each with its own filters and order, only the
  classes that match, and "Nothing here" when nothing does. Class summaries are left
  out unless asked for. Renaming or deleting a saved filter carries its section along;
  Copy copies the sections in order.
