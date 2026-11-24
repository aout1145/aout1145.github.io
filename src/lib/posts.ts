import type { CollectionEntry } from "astro:content";

const pad = (n: number) => String(n).padStart(2, "0");

/** 文章 slug：去掉文件名里的日期前缀 */
export function slugOf(entry: CollectionEntry<"posts">): string {
  return entry.id.replace(/^\d{4}-\d{2}-\d{2}-/, "");
}

/** 文章路径：/posts/YYYY/MM/slug.html（按 UTC 取年月，构建机时区无关） */
export function postPath(entry: CollectionEntry<"posts">): string {
  const d = entry.data.date;
  return `/posts/${d.getUTCFullYear()}/${pad(d.getUTCMonth() + 1)}/${slugOf(entry)}.html`;
}

export function formatDate(date: Date): string {
  return `${date.getUTCFullYear()}-${pad(date.getUTCMonth() + 1)}-${pad(date.getUTCDate())}`;
}

export function sortPosts(
  a: CollectionEntry<"posts">,
  b: CollectionEntry<"posts">,
): number {
  return b.data.date.valueOf() - a.data.date.valueOf();
}
