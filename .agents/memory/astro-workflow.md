---
name: Astro workflow behavior
description: Astro agent detection and host checks can block Replit artifact previews.
---

When Astro detects it is running from an agent, it may start the development server in the background and exit, causing the managed web workflow to appear finished and the preview proxy to return 502. Add `--ignore-lock` to the `astro dev` command to suppress agent-inferred background mode and keep the server in the foreground.

Astro also uses Vite's host checks. Replit's browser-tab host may be rejected even while the internal preview works; set `server.allowedHosts: true` in `astro.config.mjs` so the proxied browser-tab URL can load.

**Why:** The workflow needs its foreground process to stay alive while it serves the configured artifact port.

**How to apply:** For Astro artifacts, keep the injected `PORT` and `BASE_PATH` behavior intact, use `--ignore-lock` in the foreground workflow command, and allow the Replit proxy host.
