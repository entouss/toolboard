# Tests

Browser tests, driven by Playwright against a real Chrome. There is no build step
and no test framework: each suite is a script that opens the app, does something,
and prints `PASS` or `FAIL` lines.

```
node tests/run.mjs              # everything
node tests/run.mjs curr-grid    # just the suites whose name contains that
```

The runner serves the repo on port 8777 and starts each suite against it. Set
`PORT` to use another.

## Layout

| | |
|---|---|
| `curr-*.mjs` | the Curriculum Explorer |
| `cdoc-*.mjs` | the Curriculum Doctor |
| `cbld-*.mjs` | the Curriculum Builder |
| `boards-*.mjs` | the board templates in `plugins/boards` |
| `*-check.mjs` | the catalogs in `learn/data`, and the guide pages |
| `curr-lib.mjs`, `cdoc-lib.mjs`, `cbld-lib.mjs`, `boards-lib.mjs` | shared setup: seed localStorage, open a page |
| `cursor.mjs` | a drawn pointer, for recordings |
| `fixtures/` | an invented curriculum the suites plan against |
| `out/` | screenshots and scratch output, not committed |

## Writing one

Suites seed `localStorage` directly rather than clicking through setup, then assert
on what the page does. `ok(label, condition, detail)` prints one line. The label is
a sentence about behaviour — "a dragged course lands in the cell it was dropped on"
— not a function name, so a failure reads as a description of what broke.

Playwright's mouse-level drag is unreliable on short rows in Chromium; the drag
suites dispatch `dragstart`/`dragover`/`drop` with a `DataTransfer` instead.

`cbld-round.mjs` is the builder's acceptance test rather than a feature test: it
opens two of the real catalogs in `learn/data`, changes nothing, and requires the
document written back out to be identical. A structured editor that silently drops
the fields its form has never heard of is not safe to open a curriculum with, so
that one failing means the tool does not ship, whatever else passes.

`video.mjs` is not a test. It records the walkthrough on the guide page, and is run
by hand.
