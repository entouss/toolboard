# Architecture

## Core (`index.html`)

Contains the application framework only: CSS variables/theming, header/board UI, tool window manager (drag/resize/z-index), storage layer, board switching, plugin loader, import/export, and the two templates a user writes in rather than installs — `blank`, the note, and `script`, the [dynamic tool](dynamic-tool.md). **Do NOT add tool-specific code (CSS, functions, or NOTE_TEMPLATES entries) to index.html.** All tool implementations belong in their respective plugin files under `plugins/toolboxes/`.

Board-level undo and redo live here too, in the storage layer rather than in any
tool: every board write goes through `trackedSave()`, so a plugin gets undo by
storing its state the ordinary way. See [Storage](storage.md#undo-and-redo).

### A note, made by something other than a person

`createNoteWithText(text, title)` puts a note on the board already holding
something. A tool that has worked out something worth keeping — a summary, a
report, a list — should be able to leave it on the board without knowing how a note
is built, where it goes or how it is saved, and without each one reinventing the id,
the position and the save. The content is written after the tool exists, so the
panes already on screen are brought into step by hand: the same two lines the big
editor runs when it saves.

It **leaves fullscreen first**. A maximized tool covers the whole board, so a note
made from inside one would land behind it and read as nothing having happened —
whatever asked for a note wants to see the note.

### Copying a note

A note is written in Markdown and read as a document, which are two different things
to copy, so it offers both. **Copy Markdown** is the source, for a ticket or a
README. **Copy formatted** is what it looks like, for a document, an email or a chat
message — paste the source into one of those and you get hashes and asterisks where
the headings were.

`copyRichTextToClipboard(html, plain, message)` puts **both** on the clipboard, the
markup and the words, and lets the target take whichever it understands; the plain
half is what the note looks like rather than how it is written. `ClipboardItem` is
the way that states what it is doing, and where it is missing or refused — it needs
a secure context, and Safari has been particular about when — a hidden editable copy
of the markup is selected and copied, which is the old way and still the one that
works everywhere. If even that fails the words go on their own: something on the
clipboard beats a button that did nothing. The reader's own selection is put back
afterwards.

## Plugin System

Three plugin types registered via global `PluginRegistry`:

- **Tools** — individual widgets (`PluginRegistry.registerTool({...})`)
- **Toolboxes** — tool groupings (`PluginRegistry.registerToolbox({...})`)
- **Boards** — pre-configured workspaces (`PluginRegistry.registerBoard({...})`)

Plugin files live in `plugins/toolboxes/` and `plugins/boards/`. They're loaded via `<script>` tags (either from the official plugins list or user-added URLs saved in localStorage).

Plugins can also be installed on demand: opening a `#tool/<toolId>` link resolves the tool to the plugin that provides it, installs that plugin, and opens the tool maximized — see [URL Hashes](urls.md).
