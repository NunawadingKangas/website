import { defineCollection, z } from "astro:content";

const linkSchema = z.object({
  label: z.string(),
  href: z.string()
});

const logoLinkSchema = z.object({
  name: z.string(),
  logo: z.string(),
  href: z.string()
});

const navigationChildSchema = linkSchema.extend({
  order: z.number().optional()
});

const sectionSchema = z.enum(["play", "club", "get-involved", "contact"]);

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
        childrenFrom: sectionSchema.optional(),
        children: z.array(navigationChildSchema).optional()
      })
    )
  })
});

const footer = defineCollection({
  type: "data",
  schema: z.object({
    partnerHeading: z.string(),
    partners: z.array(logoLinkSchema),
    weSupportHeading: z.string(),
    weSupport: z.array(logoLinkSchema),
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
    legalDetails: z.array(z.string()),
    copyright: z.string(),
    backgroundWord: z.string()
  })
});

const registrationLinkSchema = z.object({
  label: z.string(),
  href: z.string(),
  gameDays: z.string(),
  ageGroups: z.string()
});

const ageGroupSchema = z.object({
  code: z.string(),
  name: z.string(),
  dobFrom: z.string(),
  dobTo: z.string()
});

const seasonRegistrationSchema = z.object({
  id: z.string(),
  status: z.enum(["closed", "soon-to-open", "open"]),
  statusLabel: z.string(),
  title: z.string(),
  summary: z.string(),
  closedCta: linkSchema.optional(),
  links: z.array(registrationLinkSchema),
  ageGroups: z.array(ageGroupSchema)
});

const registration = defineCollection({
  type: "data",
  schema: z.object({
    missedRegistration: z.object({
      title: z.string(),
      summary: z.string(),
      ctaLabel: z.string(),
      ctaHref: z.string()
    }),
    seasons: z.array(seasonRegistrationSchema).min(1)
  })
});

const gameDays = defineCollection({
  type: "data",
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    eyebrow: z.string(),
    summary: z.string(),
    gameDays: z.array(
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

const sections = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    eyebrow: z.string(),
    summary: z.string(),
    section: sectionSchema,
    slug: z.string().optional(),
    navLabel: z.string().optional(),
    navHref: z.string().optional(),
    order: z.number().optional()
  })
});

const teamManager = defineCollection({
  type: "content",
  schema: z.object({
    title: z.string(),
    metaTitle: z.string().optional(),
    metaDescription: z.string(),
    summary: z.string(),
    order: z.number()
  })
});

export const collections = {
  pages,
  news,
  navigation,
  footer,
  registration,
  "game-days": gameDays,
  "sections": sections,
  "team-manager": teamManager
};
