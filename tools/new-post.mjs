// 用法：npm run new -- "标题" [slug]
// 生成 src/content/posts/YYYY-MM-DD-slug.md
import { existsSync, writeFileSync } from "node:fs";

const [title, slugArg] = process.argv.slice(2);

if (!title) {
  console.error('用法: npm run new -- "标题" [slug]');
  process.exit(1);
}

if (!/^[a-z0-9-]+$/.test(slugArg ?? "post")) {
  console.error("slug 只能用小写字母、数字和连字符");
  process.exit(1);
}

const now = new Date();
const pad = (n) => String(n).padStart(2, "0");
const date = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
const slug = slugArg ?? "post";
const file = `src/content/posts/${date}-${slug}.md`;

if (existsSync(file)) {
  console.error(`文件已存在: ${file}`);
  process.exit(1);
}

writeFileSync(
  file,
  `---\ntitle: ${title}\ndate: ${date}\ntags: []\nsummary: \n---\n\n`,
  "utf8",
);

console.log(`已创建 ${file}`);
