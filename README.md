# 梦与远方 · 星夜极光版 (Astro Edition)

一个记录梦境、游记、小说与日记的沉浸式暗夜极光文学博客。基于 **Astro 5** 构建，采用 Bento 便当盒毛玻璃布局、流光星空粒子背景、跨页共享元素过渡动画（View Transitions）与游记足迹星图，自动部署于 GitHub Pages。

🌙 **线上地址**：<https://zhucebuniao.github.io>

## ✨ 核心特性

- **沉浸式暗夜星空 / 晨曦双主题** —— 动态呼吸极光背景、Canvas 微星尘粒子、毛玻璃 Bento 卡片与鼠标跟随微光（Spotlight Hover），支持一键切换暗色/浅色主题。
- **Bento 便当盒混排首页** —— 顶部站点星群概览 + 最新梦境/最新远行聚光灯卡片 + 交互式中国漫游足迹星图 + 全量流式筛选列表。
- **游记专属「足迹星图 & 城市漫游墙」** —— 自动聚合 16+ 座漫游城市（泉州、大理、凤凰古城、喀什、西塘、景德镇等），点击地图星点或城市标签即可查看对应城市的题记与游记列表。
- **全局即时搜索 (`⌘K` / `Ctrl+K`)** —— 支持按标题、副标题、城市名、分类与正文内容实时检索并高亮匹配片段。
- **跨页丝滑过渡 (Astro View Transitions)** —— 切换页面或点进文章时星空背景不断流，卡片标题平滑过渡为文章大标题。
- **沉浸式阅读增强** —— 顶部阅读进度条、三档正文字号调节（紧凑 / 标准 / 舒展）、自动生成章节目录（TOC 滚动高亮）、同城游记推荐、图片灯箱放大预览（Lightbox）。
- **100% 兼容原有 `_posts/` 目录** —— 使用 Astro 5 Content Layer 直接读取 `_posts/*.md`，无需改动任何历史文章。

## 📁 项目结构

```text
├── .github/workflows/deploy.yml  # GitHub Pages 自动构建与部署工作流
├── _posts/                       # 全部 Markdown 文章（dream / travel / novel / diary）
├── public/
│   ├── .nojekyll                 # 禁用 GitHub 默认 Jekyll 构建
│   └── assets/images/            # 文章配图资源
├── src/
│   ├── components/
│   │   ├── PostCard.astro        # Bento 毛玻璃文章卡片
│   │   ├── SearchModal.astro     # ⌘K 全局即时搜索弹窗
│   │   └── TravelMap.astro       # 交互式游记足迹星图与城市漫游墙
│   ├── layouts/
│   │   └── BaseLayout.astro      # 全局布局：星空 Canvas、极光背景、顶栏、Lightbox
│   ├── pages/
│   │   ├── index.astro           # 首页（Bento Hero + 足迹星图 + 全量筛选）
│   │   ├── dreams.astro          # 梦境时间轴归档页
│   │   ├── travels.astro         # 游记足迹与目的地筛选页
│   │   ├── novel.astro           # 小说连载归档页
│   │   ├── diary.astro           # 日记手记归档页
│   │   ├── about.astro           # 关于页与站点字数统计
│   │   ├── posts/[id].astro      # 沉浸式文章详情页（含 TOC 与阅读控制）
│   │   ├── search.json.ts        # 静态全文搜索索引接口
│   │   └── rss.xml.ts            # RSS 订阅源
│   ├── styles/
│   │   └── global.css            # 星夜极光设计系统与响应式样式
│   ├── utils/
│   │   └── posts.ts              # 文章元数据解析、字数统计与城市坐标映射
│   └── content.config.ts         # Astro Content Layer 集合配置
├── astro.config.mjs              # Astro 配置文件
└── package.json
```

## ✍️ 写新文章

依然在 `_posts/` 下新建 `YYYY-MM-DD-名称.md`：

```markdown
---
title: "文章标题"
date: 2026-07-02 03:00:00 +0800
category: dream          # dream / travel / novel / diary
---

正文内容……
```

## 🚀 本地开发与构建

```bash
# 安装依赖
npm install

# 启动本地开发服务器 (http://localhost:4321)
npm run dev

# 构建静态站点至 dist/
npm run build
```

## 📄 许可证

MIT —— 详见 [LICENSE](LICENSE)。
