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
    "toolboardSettings": { "title": "...", "color": "#hex" }
  }]
}
```
