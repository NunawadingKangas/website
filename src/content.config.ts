import { defineCollection, z } from "astro:content";

const linkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const pages = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    hero: z.object({
      eyebrow: z.string(),
      headline: z.string(),
      subheadline: z.string(),
      primaryCtaLabel: z.string(),
      primaryCtaHref: z.string(),
      asideLabel: z.string().optional(),
      backgroundWord: z.string().optional()
    }),
    newsSection: z.object({
      title: z.string(),
      kicker: z.string(),
      limit: z.number().default(3)
    })
  })
});

const news = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    publishDate: z.coerce.date(),
    author: z.string(),
    category: z.enum(["Club News", "Game Report", "Community", "Registration", "Club Announcement", "Game Day", "Workshop"]),
    featured: z.boolean().default(false)
  })
});

const navigation = defineCollection({
  type: "data",
  schema: z.object({
    brand: linkSchema,
    items: z.array(
      z.object({
        label: z.string(),
        href: z.string().optional(),
        kicker: z.string().optional(),
        children: z.array(linkSchema).optional()
      })
    )
  })
});

const footer = defineCollection({
  type: "data",
  schema: z.object({
    partnerHeading: z.string(),
    partners: z.array(
      z.object({
        name: z.string(),
        logo: z.string()
      })
    ),
    clubName: z.string(),
    tagline: z.string(),
    socialLinks: z.array(
      linkSchema.extend({
        icon: z.enum(["facebook", "instagram", "email"]),
        ariaLabel: z.string()
      })
    ),
    linkGroups: z.array(
      z.object({
        title: z.string(),
        links: z.array(linkSchema)
      })
    ),
    copyright: z.string(),
    backgroundWord: z.string()
  })
});

const ageGroups = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    seasonLabel: z.string(),
    ctaLabel: z.string(),
    ctaHref: z.string(),
    groups: z.array(
      z.object({
        code: z.string(),
        name: z.string(),
        dobFrom: z.string(),
        dobTo: z.string()
      })
    )
  })
});

const schedules = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    eyebrow: z.string(),
    summary: z.string(),
    schedules: z.array(
      z.object({
        kicker: z.string(),
        title: z.string(),
        ariaLabel: z.string(),
        items: z.array(
          z.object({
            label: z.string(),
            date: z.string().optional(),
            type: z.enum(["round", "break"]).default("round")
          })
        )
      })
    )
  })
});

const childContent = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    eyebrow: z.string(),
    summary: z.string(),
    section: z.enum(["play", "club", "get-involved", "contact"]),
    slug: z.string().optional(),
    order: z.number().optional()
  })
});

export const collections = {
  pages,
  news,
  navigation,
  footer,
  "age-groups": ageGroups,
  schedules,
  "child-content": childContent
};
