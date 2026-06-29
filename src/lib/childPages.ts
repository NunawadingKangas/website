import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type ChildPageEntry = CollectionEntry<"child-content">;
export type ChildPageContent = ChildPageEntry["data"];

export function getChildPageSlug(entry: ChildPageEntry): string {
  return entry.data.slug ?? entry.id.replace(/\.md$/u, "");
}

interface ChildPagesForSectionOptions {
  exclude?: string[];
}

export async function getChildPagesForSection(section: ChildPageContent["section"], options: ChildPagesForSectionOptions = {}) {
  const entries = await getCollection("child-content", (entry) => entry.data.section === section);
  const excludedSlugs = new Set(options.exclude ?? []);

  return entries
    .map((entry) => ({
      slug: getChildPageSlug(entry),
      page: entry.data,
      entry
    }))
    .filter(({ slug }) => !excludedSlugs.has(slug))
    .sort((a, b) => (a.page.order ?? 999) - (b.page.order ?? 999) || a.page.title.localeCompare(b.page.title));
}

export async function getChildPage(section: ChildPageContent["section"], slug: string) {
  const pages = await getChildPagesForSection(section);
  return pages.find((page) => page.slug === slug);
}
