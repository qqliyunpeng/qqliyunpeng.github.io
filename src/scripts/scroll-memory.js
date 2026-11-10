/**
 * 「刷新后保持原位」用的滚动位置记忆。
 *
 * 背景：点过右侧目录后 URL 里会留着 `#锚点`，刷新时 Chromium 会恢复历史滚动位置，
 * 但 Firefox / Safari 会按 hash 重新定位，把用户后来滚到的位置丢掉。
 * 这里按 pathname 记一份离开时的位置，加载后优先恢复它。
 */

/** 记忆键只按路径区分，忽略 `#锚点`，同一次刷新才能共享同一个位置。 */
export function scrollMemoryKey(pathname, search) {
  return `scroll:${pathname}${search}`;
}

/** 取出并消费掉记录的位置；没有记录、值非法或 storage 不可用时返回 null。 */
export function takeScrollPosition(storage, key) {
  let raw;
  try {
    raw = storage.getItem(key);
    if (raw === null) return null;
    storage.removeItem(key);
  } catch {
    return null;
  }

  const value = Number.parseInt(raw, 10);
  return Number.isFinite(value) && value >= 0 ? value : null;
}

/** 记录当前滚动位置；storage 不可用（隐私模式）时静默退化。 */
export function saveScrollPosition(storage, key, scrollY) {
  try {
    storage.setItem(key, String(Math.round(scrollY)));
  } catch {
    return false;
  }
  return true;
}
