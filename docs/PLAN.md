# aout.top 技术说明

a_out 的个人主页与博客。纯静态站点，Astro 构建，部署在 GitHub Pages。

## 目标

- 内容全部写在 HTML 里：关掉脚本和样式也能读完
- 每页只有 HTML 和一个小样式表，没有外部字体、图标、统计
- 结构用标题、段落、列表、表格、水平线表达，兼容 HTML 3.2 的元素集
- 构建侧用现代工具链：Astro、TypeScript、GitHub Actions

不追求严格的形式校验：DOCTYPE 写 HTML 3.2，模板里避开 HTML5 语义标签，
其余交给 `tools/check.mjs` 做实际检查。

## 技术栈

| 位置 | 选型 |
|---|---|
| 构建 | Astro 7（静态输出） |
| 内容 | Markdown + content collections |
| 样式 | 手写单个 CSS 文件（预算 12KB） |
| 检查 | 自写 Node 脚本：DOCTYPE、零脚本、语义标签、内链、体积 |
| 部署 | GitHub Actions → Pages，自定义域名 aout.top |

## 目录

```
astro.config.mjs        # site、build.format: "file"、sitemap
src/layouts/Base.astro  # 页面骨架
src/pages/              # 首页、归档、关于、404、feed.xml
src/content/posts/      # 文章 Markdown
src/content.config.ts   # front matter schema
src/lib/posts.ts        # URL 与日期工具
src/data/site.ts        # 站点标题、导航、外部链接
public/                 # 原样复制：site.css、CNAME、robots.txt
tools/check.mjs         # 产物检查
tools/fixup.mjs         # DOCTYPE 改写
tools/new-post.mjs      # 发文章脚手架
.github/workflows/      # 构建、检查、发布
```

## URL 规则

`/posts/YYYY/MM/slug.html`，由 front matter 的 `date` 与文件名推出，
`build.format: "file"` 让每页以 `.html` 结尾。

## 检查项

1. DOCTYPE 必须是 HTML 3.2
2. 不出现 `<script>`
3. 不出现 `section`/`nav`/`footer`/`span` 等 HTML5 语义标签
4. 每页有 `<title>`、charset、`<h1>`
5. 站内链接必须指向存在的文件
6. 去掉标签后正文不少于 100 字符
7. 单页 ≤ 80KB，CSS ≤ 12KB

## 约定

- 站内文案只陈述事实，不做风格上的自我说明。
- 技术细节集中在这份说明与 README 里，不写进页面。
- 加交互脚本前先想清楚无脚本时的可用性，并同步放宽 `check.mjs` 的零脚本断言。

## 已知取舍

- 没有语义化标签，可访问性靠标题层级和 `ALT` 补
- 表格列表在窄屏不重排，靠 CSS 控制宽度
- 中文编码用 UTF-8，不做老式编码转码
