/** Pure helpers used to build the homepage article index. */

/** @typedef {{ id: string, data: { title?: string, pubDate?: Date, sidebar?: { order?: number } } }} ArticleEntry */

/**
 * Keep only entries living under the `blog/` content directory.
 * @param {ArticleEntry} entry
 * @returns {boolean}
 */
export function isArticleEntry(entry) {
  return entry.id.startsWith("blog/");
}

/**
 * @param {ArticleEntry} entry
 * @returns {number}
 */
function sidebarOrder(entry) {
  const order = entry.data.sidebar?.order;
  return typeof order === "number" ? order : Number.POSITIVE_INFINITY;
}

/**
 * @param {ArticleEntry} entry
 * @returns {number}
 */
function publishedAt(entry) {
  const pubDate = entry.data.pubDate;
  return pubDate instanceof Date ? pubDate.valueOf() : 0;
}

/**
 * Newest articles first, then sidebar order, then title.
 * @template {ArticleEntry} T
 * @param {T[]} entries
 * @returns {T[]}
 */
export function sortArticles(entries) {
  return [...entries].sort((a, b) => {
    const byDate = publishedAt(b) - publishedAt(a);
    if (byDate !== 0) return byDate;

    const orderA = sidebarOrder(a);
    const orderB = sidebarOrder(b);
    if (orderA !== orderB) return orderA < orderB ? -1 : 1;

    return String(a.data.title ?? "").localeCompare(String(b.data.title ?? ""), "zh-CN");
  });
}
