// 构建产物检查：守住"零脚本 + 3.2 结构 + 体积预算 + 链接有效"。
// 失败即退出码 1，CI 里会阻断部署。
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join } from "node:path";

const ROOT = "dist";
const DOCTYPE = '<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 3.2 Final//EN">';
// HTML 3.2 之外的语义标签：出现即说明模板被写回了 HTML5
const FORBIDDEN = [
  "section", "article", "nav", "header", "footer", "aside", "main", "span",
  "iframe", "picture", "source", "template", "svg", "figure", "figcaption",
  "details", "summary", "dialog", "canvas", "video", "audio",
];

const errors = [];
const seenPages = [];

function walk(dir) {
  const out = [];
  for (const name of readdirSync(dir)) {
    const p = join(dir, name);
    if (statSync(p).isDirectory()) out.push(...walk(p));
    else out.push(p);
  }
  return out;
}

const files = walk(ROOT);
const htmlFiles = files.filter((f) => f.endsWith(".html"));

function resolveLink(href) {
  let clean = href.split("#")[0].split("?")[0];
  if (!clean.startsWith("/")) return null; // 外部链接、mailto、相对路径都不查
  if (clean === "/") return "index.html";
  return clean.slice(1);
}

const rel = (p) => p.slice(ROOT.length + 1);
let cssBytes = 0;

for (const file of files) {
  if (file.endsWith(".css")) cssBytes += statSync(file).size;
}

for (const file of htmlFiles) {
  const src = readFileSync(file, "utf8");
  const page = rel(file);
  seenPages.push(page);

  if (!src.startsWith(DOCTYPE)) errors.push(`${page}: DOCTYPE 不是 HTML 3.2`);
  if (!/<title>[^<]+<\/title>/.test(src)) errors.push(`${page}: 缺少 <title>`);
  if (!/charset=utf-8/i.test(src)) errors.push(`${page}: 缺少 charset 声明`);
  if (!/<h1[\s>]/i.test(src)) errors.push(`${page}: 缺少 <h1>`);

  const scripts = (src.match(/<script[\s>]/gi) ?? []).length;
  if (scripts > 0) errors.push(`${page}: 出现 ${scripts} 个 <script>（本项目约定零脚本）`);

  for (const tag of FORBIDDEN) {
    const re = new RegExp(`<${tag}[\\s>]`, "i");
    if (re.test(src)) errors.push(`${page}: 出现 HTML5 标签 <${tag}>`);
  }

  for (const m of src.matchAll(/href="([^"]+)"/g)) {
    const target = resolveLink(m[1]);
    if (!target) continue;
    const abs = join(ROOT, target);
    let ok = true;
    try {
      statSync(abs);
    } catch {
      try {
        statSync(join(abs, "index.html"));
      } catch {
        ok = false;
      }
    }
    if (!ok) errors.push(`${page}: 内部链接指向不存在的文件 -> ${m[1]}`);
  }

  const text = src.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
  if (text.length < 60) errors.push(`${page}: 纯文本内容过少（${text.length} 字符），关掉脚本后可能不可读`);

  const size = statSync(file).size;
  if (size > 80 * 1024) errors.push(`${page}: 页面 ${(size / 1024).toFixed(1)}KB，超过 80KB 预算`);
}

if (cssBytes > 12 * 1024) {
  errors.push(`CSS 合计 ${(cssBytes / 1024).toFixed(1)}KB，超过 12KB 预算`);
}

if (htmlFiles.length === 0) errors.push("dist 里没有生成任何 HTML");

if (errors.length > 0) {
  console.error(`✗ 检查失败（${errors.length} 项）`);
  for (const e of errors) console.error(`  - ${e}`);
  process.exit(1);
}

console.log(`✓ ${seenPages.length} 个页面通过检查（CSS ${(cssBytes / 1024).toFixed(1)}KB，零脚本）`);
