/** Pure helpers used to build the homepage article index. */

/** @typedef {{ id: string, data: { title?: string, pubDate?: Date } }} ArticleEntry */

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
function publishedAt(entry) {
  const pubDate = entry.data.pubDate;
  return pubDate instanceof Date ? pubDate.valueOf() : 0;
}

/**
 * 取文件名开头的编号：blog/basic/07.C语言位操作方法 → 7。没有编号返回 -1。
 * 编号只用于同一天发布时的先后顺序，跟 sidebar.order 无关（那个是分类内序号）。
 * @param {ArticleEntry} entry
 * @returns {number}
 */
function fileNumber(entry) {
  const base = String(entry.id).split("/").pop() ?? "";
  const matched = /^(\d+)/.exec(base);
  return matched ? Number(matched[1]) : -1;
}

/**
 * 同一天发布时，文件编号大的（后写的）排在前面；没有编号的排在最后。
 * @param {ArticleEntry} a
 * @param {ArticleEntry} b
 * @returns {number}
 */
function compareByFileNumberDesc(a, b) {
  return fileNumber(b) - fileNumber(a);
}

/**
 * 取正文开头连续的几段文字，碰到代码块或表格就停 —— 预览只需要开头那段话。
 * 标题行直接丢掉，因为首页已经有页面标题了。
 * @param {string} body
 * @returns {string}
 */
function leadingProse(body) {
  const kept = [];
  let inFence = false;

  for (const line of String(body).split(/\r?\n/)) {
    const trimmed = line.trim();
    const isFence = /^(```|~~~)/.test(trimmed);

    if (inFence) {
      if (isFence) inFence = false;
      continue;
    }

    // 开头就是代码块的话没有正文可取，跳过它继续往后找
    if (isFence) {
      if (kept.length > 0) break;
      inFence = true;
      continue;
    }

    if (!trimmed) continue;
    if (trimmed.startsWith("#")) continue;

    if (trimmed.startsWith("|")) {
      if (kept.length > 0) break;
      continue;
    }

    kept.push(trimmed);
  }

  return kept.join(" ");
}

/**
 * 把一段 Markdown 正文抹成纯文本（去掉行内代码、链接、强调符）。
 * @param {string} body
 * @returns {string}
 */
function stripMarkdown(body) {
  return leadingProse(body)
    .replace(/!\[[^\]]*\]\([^)]*\)/g, "")
    .replace(/\[([^\]]*)\]\([^)]*\)/g, "$1")
    .replace(/`([^`]*)`/g, "$1")
    .replace(/^[>\s]+/, "")
    .replace(/(^|\s)[-*+]\s+/g, "$1")
    .replace(/(^|\s)\d+\.\s+/g, "$1")
    .replace(/\*\*([^*]+)\*\*/g, "$1")
    .replace(/\s+/g, " ")
    // 中文标点两侧的空格去掉，读起来更紧凑
    .replace(/\s+([，。；：！？、）》」』])/g, "$1")
    .replace(/([，。；：！？、])\s+(?=[\u4e00-\u9fff])/g, "$1")
    .trim();
}

/**
 * 结尾卡在「设：」这种没说完的句子时，退回到上一句的句号。
 * @param {string} text
 * @returns {string}
 */
function dropDanglingClause(text) {
  if (!/[：:，,]$/.test(text)) return text;

  const cut = Math.max(text.lastIndexOf("。"), text.lastIndexOf("！"), text.lastIndexOf("？"));
  return cut >= 30 ? text.slice(0, cut + 1) : text;
}

/**
 * 首页摘要：取正文开头的一段纯文本，超长就截断加省略号。
 * @param {string | undefined} body
 * @param {number} [limit]
 * @returns {string}
 */
export function excerptFromBody(body, limit = 120) {
  if (!body) return "";

  const text = stripMarkdown(body);
  if (text.length > limit) return `${text.slice(0, limit).trimEnd()}…`;

  return dropDanglingClause(text);
}

/**
 * Newest articles first, then the larger file number, then id.
 * @template {ArticleEntry} T
 * @param {T[]} entries
 * @returns {T[]}
 */
export function sortArticles(entries) {
  return [...entries].sort((a, b) => {
    const byDate = publishedAt(b) - publishedAt(a);
    if (byDate !== 0) return byDate;

    const byFileNumber = compareByFileNumberDesc(a, b);
    if (byFileNumber !== 0) return byFileNumber;

    return String(a.id).localeCompare(String(b.id), "zh-CN");
  });
}
