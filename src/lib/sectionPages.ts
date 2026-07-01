import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type SectionPageEntry = CollectionEntry<"sections">;
export type SectionPageContent = SectionPageEntry["data"];

export interface SectionPageNavigationItem {
  label: string;
  href: string;
  order?: number;
}

export function getSectionPageSlug(entry: SectionPageEntry): string {
  const filename = entry.id.split("/").pop() ?? entry.id;
  return entry.data.slug ?? filename.replace(/\.md$/u, "");
}

export function getSectionPageHref(entry: SectionPageEntry): string {
  return entry.data.navHref ?? `/${entry.data.section}/${getSectionPageSlug(entry)}`;
}

export function getSectionPageNavLabel(entry: SectionPageEntry): string {
  return entry.data.navLabel ?? entry.data.title;
}

interface SectionPagesForSectionOptions {
  exclude?: string[];
}

export async function getSectionPagesForSection(section: SectionPageContent["section"], options: SectionPagesForSectionOptions = {}) {
  const entries = await getCollection("sections", (entry) => entry.data.section === section);
  const excludedSlugs = new Set(options.exclude ?? []);

  return entries
    .map((entry) => ({
      slug: getSectionPageSlug(entry),
      page: entry.data,
      entry
    }))
    .filter(({ slug }) => !excludedSlugs.has(slug))
    .sort((a, b) => (a.page.order ?? 999) - (b.page.order ?? 999) || a.page.title.localeCompare(b.page.title));
}

export async function getSectionPage(section: SectionPageContent["section"], slug: string) {
  const pages = await getSectionPagesForSection(section);
  return pages.find((page) => page.slug === slug);
}

export async function getSectionNavigationItems(section: SectionPageContent["section"]): Promise<SectionPageNavigationItem[]> {
  const pages = await getSectionPagesForSection(section);

  return pages.map(({ entry }) => ({
    label: getSectionPageNavLabel(entry),
    href: getSectionPageHref(entry),
    order: entry.data.order
  }));
}
