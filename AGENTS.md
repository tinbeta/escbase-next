# Escbase Agent Notes

Project root: `/Users/friday/Desktop/escbase-next`

This file is the short operating note for agents. Detailed blog-writing rules live in `BLOG_WRITING_GUIDE.md`; read that file before creating or editing articles.

## Default Commands

- Run local dev server: `npm run dev`
- Build and regenerate sitemap/RSS: `npm run build`
- Web app workspace: `apps/web`
- Published static files: `apps/web/public`
- Public domain: `https://news.escbase.xyz`

## Content Workflow

When the task is to create a new Escbase article, follow `BLOG_WRITING_GUIDE.md` exactly. In particular:

- Create the article at `apps/web/public/blog/{slug}/index.html`.
- Add the metadata entry to the top of `apps/web/public/blog.json`.
- Keep article URLs with trailing slash, for example `/blog/{slug}/`.
- Use `https://news.escbase.xyz` for canonical, Open Graph, RSS, and sitemap URLs.
- Run `npm run build` before finishing.

## X/Twitter Thread Articles

When writing from an X/Twitter thread, use the source collection workflow in `BLOG_WRITING_GUIDE.md` before drafting. Do not write from a partial thread.

Minimum expectations:

- Read the full thread with `bird thread <url>`.
- Save the full thread, source links, images, and videos from the thread owner.
- Use only the thread owner's images/links as primary source material.
- Include all relevant source-owner images/videos in the article, unless a video is long enough that it should be summarized instead.
- Treat community replies as optional secondary context, not primary source material.

## Editing Discipline

- Keep edits scoped to the requested article or documentation.
- Do not rewrite unrelated pages or generated assets unless the task requires it.
- Do not hardcode secrets/API keys in public files.
- If changing content conventions, update `BLOG_WRITING_GUIDE.md` so future agents follow the same rule.
