---
name: Astro workflow behavior
description: Astro CLI agent detection can detach the dev server from managed Replit workflows.
---

When Astro detects it is running from an agent, it may start the development server in the background and exit, causing the managed web workflow to appear finished and the preview proxy to return 502. Add `--ignore-lock` to the `astro dev` command to suppress agent-inferred background mode and keep the server in the foreground.

**Why:** The workflow needs its foreground process to stay alive while it serves the configured artifact port.

**How to apply:** Use this for Astro development commands run by managed Replit artifact workflows; keep the injected `PORT` and `BASE_PATH` behavior intact.
