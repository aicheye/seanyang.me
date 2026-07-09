# Project demos

Drop a **GIF** (or a static image) here for each project's play button.

The filename must match the `media` path in `public/data/projects.json`:

| Project                   | File to add                |
| ------------------------- | -------------------------- |
| swarm_ws                  | `swarm_ws.gif`             |
| CRusTTY                   | `crustty.gif`              |
| Wunder RNN Challenge      | `wundernn.gif`             |
| aicheye's Combat Tagging  | `combat-tag.gif`           |
| Bucket                    | `bucket.gif`               |
| ezp2p Arcade              | `ezp2p.gif`                |

Notes:

- A project only shows a play button when it has a `media` entry in
  `public/data/projects.json`. Remove the entry to hide the button.
- Either a GIF or a static image works. To swap in a static image, point
  `media` at e.g. `/assets/portfolio/demos/bucket.png` and drop the `.png`
  here instead.
- For GIFs, set `mediaDuration` (seconds) to one full play-through so the
  modal auto-closes when the GIF finishes. Static images have no duration —
  leave `mediaDuration` off and they stay open until the user closes them.
