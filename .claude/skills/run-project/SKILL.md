---
name: run-project
description: Launch the GWC Website (Next.js) dev server locally and verify it's up. Use when the user asks to "run the project", "start the app", "start the dev server", or wants to preview/screenshot a change in the browser.
---

# Run GWC Website

This is a Next.js 15 (App Router) project using `pnpm`. The dev server runs on a fixed port, not the Next.js default.

## Steps

1. **Check dependencies are installed.** If `node_modules/` is missing, run `pnpm install` first.

2. **Start the dev server in the background.**

   ```
   pnpm dev
   ```

   This runs `next dev --port=3005` (see `package.json` scripts). Always launch with `run_in_background: true` — it's a long-running process, never run it synchronously.

3. **Wait for readiness.** Poll or watch the background output until you see the "Ready" / "compiled" message from Next.js, then confirm the app responds, e.g.:

   ```
   curl -s -o /dev/null -w "%{http_code}" http://localhost:3005
   ```

   Expect a `200` (or `3xx`) response.

4. **Report the URL** to the user: `http://localhost:3005`. If they asked for a visual check, use Playwright (`browser_navigate`) or a screenshot tool to open that URL.

5. **Stopping.** The dev server keeps running in the background for the rest of the session — leave it running unless the user asks to stop it, or stop/restart it if it needs to pick up config changes (e.g. `next.config.ts`, `.env`).

## Notes

- Port is hardcoded to **3005** — don't assume 3000.
- `NODE_OPTIONS=--max-old-space-size=4096` is already baked into the `dev` script; no need to set it manually.
- Other useful scripts: `pnpm build` (production build), `pnpm start` (serve production build, also needs `build` first), `pnpm lint`, `pnpm check:content` (validates `app/_data/pages/*.json`, e.g. metaDescription rules from AGENTS.md).
- This project has custom Next.js conventions — see `AGENTS.md` at the repo root before touching routing/data files.
