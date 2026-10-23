# Board Export Format

```json
{
  "type": "boards",
  "exportedAt": "ISO-8601",
  "boards": [{
    "id": "board-id",
    "name": "Board Name",
    "positions": { "toolId": { "x": 0, "y": 0, "z": 100, "width": 290, "height": 280 } },
    "toolCustomizations": { "toolId": { "title": "...", "customContent": "..." } },
    "customTools": [],
    "hiddenTools": [],
    "toolboardSettings": {
      "title": "...", "color": "#hex",
      "grid": { "on": false, "size": 20 },
      "pageGuide": { "on": false, "orientation": "portrait" }
    }
  }]
}
```

`grid` and `pageGuide` are the placement guides — see [Storage](storage.md). A board
exported before they existed simply arrives without them, and reads as both off.

A board kept in a workshop also carries `"workshop": ["Home", "Garage"]` — the
workshops it is in, by name from the top. Ids would mean nothing in another browser;
names are what a person filed it under. An import puts the board back in a workshop
of that path, reusing one already there with that name and making the rest. A board
without the field — every export from before workshops — lands at the top.

## Board Template Plugins

A board template is a plugin that registers a ready-made workspace. Users install it
from the plugin manager, then press **Use This Template** to get a new board with the
tools already placed and filled in. See `plugins/boards/` for examples.

```js
PluginRegistry.registerBoard({
  id: 'my-board',
  name: 'My Board',
  description: '…',
  icon: '🧮',
  version: '1.0.0',
  source: 'external',
  settings: { title: 'My Board', color: '#2980b9' },
  tools: [ /* one entry per tool on the board */ ]
});
```

### A tool entry

| Field | Meaning |
| --- | --- |
| `toolId` | The tool to place — a plugin tool id, or `blank` for a markdown note |
| `instanceId` | Stable id for this instance; must be unique within the board |
| `title` | The window header. Do not repeat it as a heading in the content |
| `customContent` | For `blank`: markdown, including fenced code blocks and tables |
| `position` | `{ x, y, z, width, height }` |
| `state` | Extra keys merged into `toolCustomizations[instanceId]` — see below |
| `color`, `fontFamily`, `fontSize`, `padding`, `textAlign` | Optional per-tool styling |

### Filling a tool in with `state`

Tools keep their own data under keys only they know about. `state` is copied verbatim
into that tool's customizations, so a template can arrive with real content rather
than an empty widget:

```js
{ toolId: 'mermaid-diagram', instanceId: 'my-diagram', title: '…',
  position: { … },
  state: { mermaidCode: 'flowchart LR\n  A --> B' } }

{ toolId: 'checklist', instanceId: 'my-topics', title: '…',
  position: { … },
  state: { checklistItems: [ { text: 'First item', status: 'pending', children: [] } ] } }
```

The key to use is whatever that tool reads — `mermaidCode`, `checklistItems`,
`sqlExplainData`, and so on. Find it in the tool's own `*GetData` function.

A template may place a dynamic tool the same way, giving `customContent`,
`toolScript` and `toolData` in `state`. The script arrives inert and runs only once
whoever opened the board has read it and said so; a `scriptApproved` in `state` is
dropped on the way in, since a template does not get to approve its own code. See
[Dynamic Tools](dynamic-tool.md).

### Tools from plugins that are not installed

A template may name any tool. `instantiateBoardTemplate` resolves each id through
`ensureToolPlugin`, which loads and installs the plugin providing it — the same path a
`#tool/<id>` link takes. Nothing needs declaring; a board carrying a Mermaid diagram
works for someone who has only ever installed that board.

### Registering it

Add the file to the **Board Templates** group in `OFFICIAL_PLUGINS` (`index.html`), or
users can add its URL by hand as an external plugin.
