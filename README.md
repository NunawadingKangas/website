# Kangas Community Basketball Club

An Astro boilerplate for a community basketball club website with:

- a Markdown-driven homepage
- a Markdown news/blog collection
- Astro content collections for type-safe content
- Pages CMS configuration in `.pages.yml`

## Getting started

1. Install dependencies:

```bash
npm install
```

2. Start the dev server:

```bash
npm run dev
```

3. Open the site locally:

```text
http://localhost:4321
```

## Content structure

- `src/content/pages/home.md` powers the homepage hero and body content.
- `src/content/news/*.md` powers the club news listing and article pages.
- `src/content.config.ts` defines the Astro collection schemas.

## Pages CMS

Pages CMS reads the repository root `.pages.yml` file. This boilerplate configures:

- the homepage Markdown entry as an editable page collection
- the news Markdown files as an editable collection
- uploaded media in `public/uploads`

Once the repo is on GitHub, connect it in [Pages CMS](https://pagescms.org/) and it will use the configuration automatically.
