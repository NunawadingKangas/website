import { getCollection } from "astro:content";
import type { CollectionEntry } from "astro:content";

export type TeamManagerPageEntry = CollectionEntry<"team-manager">;

export function getTeamManagerPageSlug(entry: TeamManagerPageEntry): string {
  return entry.id.replace(/\.md$/u, "");
}

export function getTeamManagerPageHref(entry: TeamManagerPageEntry): string {
  return `/get-involved/team-manager/${getTeamManagerPageSlug(entry)}`;
}

export async function getTeamManagerPages() {
  const entries = await getCollection("team-manager");

  return entries
    .map((entry) => ({
      slug: getTeamManagerPageSlug(entry),
      href: getTeamManagerPageHref(entry),
      entry
    }))
    .sort((a, b) => a.entry.data.order - b.entry.data.order || a.entry.data.title.localeCompare(b.entry.data.title));
}
