import { defineCollection, z } from "astro:content";
import { glob, file } from "astro/loaders";

const tours = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/tours" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      summary: z.string(),
      featured_image: image().optional(),
      gallery: z.array(image()).optional(),
      video_url: z.string().optional(),
      price_from: z.number().optional(),
      duration_hours: z.number().optional(),
      difficulty: z.enum(["Easy", "Moderate", "Strenuous"]).optional(),
      highlights: z.array(z.string()).optional(),
      fareharbor_item_id: z.string().optional(),
      available_for_private_13pax: z.boolean().default(false),
      draft: z.boolean().default(false),
      order: z.number().default(100),
    }),
});

const posts = defineCollection({
  loader: glob({ pattern: "**/*.{md,mdx}", base: "src/content/posts" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      pubDate: z.coerce.date(),
      updatedDate: z.coerce.date().optional(),
      cover: image().optional(),
      author: z.string().default("Skagway Tours"),
      draft: z.boolean().default(false),
    }),
});

const pages = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/pages" }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      description: z.string().optional(),
      cover: image().optional(),
    }),
});

const faqs = defineCollection({
  loader: glob({ pattern: "**/*.md", base: "src/content/faqs" }),
  schema: z.object({
    question: z.string(),
    category: z.string().default("General"),
    order: z.number().default(100),
  }),
});

const navChild = z.object({ label: z.string(), href: z.string() });
const navItem = z.object({
  label: z.string(),
  href: z.string().optional(),
  children: z.array(navChild).optional(),
});

const footerLink = z.object({ label: z.string(), href: z.string() });
const footerGroup = z.object({
  heading: z.string(),
  links: z.array(footerLink),
});

const site = defineCollection({
  loader: file("src/content/site/settings.yml"),
  schema: z.object({
    id: z.string(),
    site_name: z.string(),
    tagline: z.string(),
    phone: z.string().optional(),
    phone_label: z.string().default("Call"),
    email: z.string().optional(),
    fareharbor_shortname: z.string().optional(),
    booking_url: z.string().optional(),
    hero: z
      .object({
        video_src: z.string().optional(),
        video_poster: z.string().optional(),
        review_stat: z.string().optional(),
        primary_cta_label: z.string().default("Book a Tour"),
        primary_cta_href: z.string().default("#tours"),
      })
      .optional(),
    promo_banner: z
      .object({
        enabled: z.boolean().default(false),
        text: z.string().default(""),
        href: z.string().default("#tours"),
      })
      .optional(),
    passport_note: z.string().optional(),
    social: z
      .object({
        facebook: z.string().optional(),
        instagram: z.string().optional(),
        tripadvisor: z.string().optional(),
      })
      .optional(),
    nav: z.array(navItem),
    footer_groups: z.array(footerGroup).default([]),
  }),
});

export const collections = { tours, posts, pages, faqs, site };
