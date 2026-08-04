import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { getCollection } from "astro:content";
import { site } from "../lib/site";

export async function GET(context: APIContext) {
  const posts = (await getCollection(
    "docs",
    ({ id, data }) => id.startsWith("blog/") && !data.draft && Boolean(data.pubDate)
  )).sort((a, b) => (b.data.pubDate?.valueOf() ?? 0) - (a.data.pubDate?.valueOf() ?? 0));

  return rss({
    title: site.title,
    description: site.description,
    site: context.site ?? site.url,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate!,
      link: `/${post.id}/`
    }))
  });
}
