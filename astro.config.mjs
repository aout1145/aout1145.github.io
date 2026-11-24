import { defineConfig } from "astro/config";
import sitemap from "@astrojs/sitemap";

// 全站静态导出。build.format: "file" 让每页以 .html 结尾（带 .html 后缀，GitHub Pages 零配置）。
export default defineConfig({
  site: "https://aout.top",
  build: {
    format: "file",
  },
  compressHTML: false,
  integrations: [sitemap()],
});
