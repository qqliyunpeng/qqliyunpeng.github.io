import { defineCollection } from "astro:content";
import { z } from "astro/zod";
import { docsLoader } from "@astrojs/starlight/loaders";
import { docsSchema } from "@astrojs/starlight/schema";

const docs = defineCollection({
  loader: docsLoader(),
  schema: docsSchema({
    extend: z.object({
      pubDate: z.coerce.date().optional(),
      tags: z.array(z.string()).default([])
    })
  })
});

export const collections = { docs };
