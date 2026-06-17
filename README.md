# 梦与远方

一个记录梦境、游记、小说与日记的暗色文学博客。柔粉胶片质感，宋体排版，用 Jekyll 构建并部署在 GitHub Pages。

🌙 **线上地址**：<https://zhucebuniao.github.io>

## ✨ 特色

- **柔粉胶片视觉** —— 暖灰粉底色、全局胶片颗粒、柔光晕染、柔焦卡片
- **文学排版** —— 思源宋体正文、首字下沉、场景分隔符（✦）、2px 阅读进度条
- **四类内容** —— 梦 / 游记 / 小说 / 日记，各自拥有专属的柔和分类色与发光条
- **首页分类筛选** —— 点一下 chips 即时过滤，无需刷新
- **滚动渐显** —— IntersectionObserver 驱动的轻量入场动效
- **响应式** —— 完美适配手机到桌面
- **无障碍** —— 语义化 HTML、键盘可达、`prefers-reduced-motion` 支持
- **零构建依赖** —— 单文件 CSS + 原生 JS，GitHub Pages 原生运行，无需 SCSS / 框架 / 库

## 🏗️ 技术栈

- **Jekyll** —— 静态站点生成器
- **纯 CSS** —— 单个 `style.css`，按分区注释组织（设计变量 → 基础 → 各组件 → 响应式）
- **原生 JavaScript** —— `main.js`，零依赖，负责筛选 / 渐显 / 进度条
- **Google Fonts** —— Noto Serif SC、Lora、Inter、Ma Shan Zheng、JetBrains Mono

## 📁 项目结构

```
├── _config.yml          # Jekyll 配置（future: true 为承重项，勿动）
├── _layouts/
│   ├── default.html     # 全局布局：颗粒层、顶栏、字体、进度条
│   └── post.html        # 文章布局：阅读进度条
├── _posts/              # 文章（按 category: dream/travel/novel/diary 分类）
├── dreams/              # 梦归档页
├── travels/             # 游记归档页
├── novel/               # 小说归档页
├── diary/               # 日记归档页
├── about/               # 关于页
├── index.html           # 首页：Hero + 筛选 + 列表
└── assets/
    ├── css/style.css    # 全部样式（设计系统）
    ├── js/main.js       # 交互层（筛选 / 渐显 / 进度条）
    └── images/          # 文章配图
```

## 🎨 设计系统

所有视觉变量集中在 `assets/css/style.css` 顶部的 `:root`：

```css
:root{
  --bg:#16131a;          /* 暖灰底色 */
  --accent:#f0a8c0;      /* 柔粉主色 */
  --dream:#c5a0e0;       /* 薰衣草 · 梦 */
  --travel:#8fb8d8;      /* 雾蓝 · 游记 */
  --novel:#e88aa0;       /* 玫瑰 · 小说 */
  --diary:#f0b89a;       /* 蜜桃 · 日记 */
  /* ... 更多变量 */
}
```

修改这里的变量即可全局换肤。

## ✍️ 写新文章

在 `_posts/` 下新建 `YYYY-MM-DD-名称.md`：

```markdown
---
layout: post
title: "文章标题"
date: 2026-06-17 03:00:00 +0800
category: dream          # dream / travel / novel / diary
---

正文内容……
```

文章会自动出现在首页与对应分类的归档页。

## 🚀 本地预览

```bash
bundle exec jekyll serve
# 打开 http://localhost:4000
```

## 📄 许可证

MIT —— 详见 [LICENSE](LICENSE)。
