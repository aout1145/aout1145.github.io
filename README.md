# aout.top

a_out 的个人主页与博客。纯静态站点，用 Astro 构建，部署在 GitHub Pages。

## 开发

```bash
npm install
npm run dev      # http://localhost:8123
npm run build    # 输出到 dist/
npm run check    # 检查 dist/ 产物
npm run ci       # build + check
```

## 发文章

```bash
npm run new -- "文章标题" why-this-site
```

会在 `src/content/posts/` 生成 `YYYY-MM-DD-slug.md`，改完提交推送即可。
URL 由日期和 slug 决定：`/posts/2026/11/why-this-site.html`。

front matter 字段：

```yaml
title: 标题
date: 2026-11-24
tags: [标签]
summary: 列表页摘要（可选）
draft: true   # 加了就不发布（可选）
```

## 目录

```
astro.config.mjs        # 站点配置（静态导出、.html 结尾的 URL、sitemap）
src/layouts/Base.astro  # 页面骨架（head、标题、导航、页脚）
src/pages/              # 首页、归档、关于、链接、404、feed.xml
src/content/posts/      # 文章 Markdown
src/lib/posts.ts        # URL 与日期工具
src/data/site.ts        # 站点标题、导航、链接
public/                 # 原样复制到产物根目录：site.css、CNAME、robots.txt
tools/check.mjs         # 产物检查
tools/fixup.mjs         # 把 DOCTYPE 改回 HTML 3.2
```

## 部署

仓库 Settings → Pages → Build and deployment → Source 选 **GitHub Actions**。
推送到 `main` 触发 `.github/workflows/deploy.yml`，构建、检查、发布。

自定义域名 `aout.top` 由 `public/CNAME` 带进产物，DNS 与证书在 Pages 设置里维持不变。

## 一些约定

- 产物零脚本：内容全部在 HTML 里，`tools/check.mjs` 会拦下任何 `<script>`。
- 只有一个样式表，预算 12KB。
- 模板里不用 HTML5 语义标签（`section`/`nav`/`footer` 等），检查脚本会报错；结构靠标题、段落、表格和水平线。
- DOCTYPE 声明为 HTML 3.2，构建后由 `tools/fixup.mjs` 改写。
- 站内文案只陈述事实，不做风格上的自我说明；技术细节集中在这份 README。
