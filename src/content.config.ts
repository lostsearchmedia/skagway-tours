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
    z.discriminatedUnion("_schema", [
      z.object({
        _schema: z.literal("home"),
        title: z.string(),
        description: z.string().optional(),
        cover: image().optional(),
        tours_section: z
          .object({
            eyebrow: z.string().default("Our tours"),
            title: z.string().default("A story you'll tell forever."),
            empty_message: z
              .string()
              .default("Tours will appear here once content is added in CloudCannon."),
          })
          .default({}),
        callouts: z
          .array(
            z.object({
              variant: z.enum(["primary", "default"]).default("default"),
              eyebrow: z.string().optional(),
              title: z.string(),
              body: z.string().optional(),
              cta_label: z.string().optional(),
              cta_href: z.string().optional(),
            })
          )
          .default([]),
        reviews_cta: z
          .object({
            eyebrow: z.string().optional(),
            title: z.string(),
            lead: z.string().optional(),
            cta_label: z.string().default("Read our reviews"),
            cta_href: z.string().default("/reviews/"),
          })
          .optional(),
      }),
      z.object({
        _schema: z.literal("page").default("page"),
        title: z.string(),
        description: z.string().optional(),
        cover: image().optional(),
        hero_eyebrow: z.string().optional(),
        hero_title: z.string().optional(),
        hero_lead: z.string().optional(),
        // Contact
        reach_heading: z.string().optional(),
        response_note: z.string().optional(),
        newsletter_heading: z.string().optional(),
        // Find us
        pickup_heading: z.string().optional(),
        pickup_details_heading: z.string().optional(),
        pickup_details_note: z.string().optional(),
        map_embed_url: z.string().optional(),
        // Private group
        book_button_label: z.string().optional(),
        // Reviews
        placeholder_text: z.string().optional(),
      }),
    ]),
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
