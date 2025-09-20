# 极简博客

一个专注于内容和可读性的极简风格个人博客，使用Jekyll构建，部署在GitHub Pages。

## ✨ 特色功能

- **🎨 极简设计**：清爽简洁的界面，让读者专注于内容
- **🌙 自动暗色模式**：根据系统设置自动切换明暗主题
- **📱 响应式布局**：完美适配各种设备尺寸
- **♿ 无障碍友好**：遵循WCAG指导原则，支持屏幕阅读器
- **⚡ 快速加载**：优化的代码和资源，确保快速访问
- **🔧 易于扩展**：模块化的SCSS架构，便于定制和维护
- **🤖 AI提示词管理**：结构化存储和管理AI提示词，提升创作效率

## 🏗️ 技术架构

### 前端技术栈
- **Jekyll** - 静态站点生成器
- **Sass (SCSS)** - CSS预处理器
- **CSS Grid & Flexbox** - 现代布局系统
- **系统字体栈** - 优化的字体配置

### 项目结构
```
├── _config.yml          # Jekyll配置
├── _layouts/            # 页面布局模板
├── _includes/           # 可复用组件
├── _sass/               # SCSS样式文件
│   ├── base/           # 基础样式
│   ├── components/     # 组件样式
│   └── layout/         # 布局样式
├── _posts/             # 博客文章
├── _data/              # 数据文件
│   └── prompts.yml     # AI提示词数据
├── assets/             # 静态资源
├── prompts.md          # 提示词管理页面
└── index.html          # 首页
```

## 🎨 设计原则

### 极简主义
- **内容优先**：设计服务于内容，不喧宾夺主
- **留白运用**：适当的留白提升阅读体验
- **色彩克制**：使用有限的颜色，营造统一感

### 用户体验
- **可读性**：优化的字体大小和行间距
- **导航直观**：清晰的信息架构和导航结构
- **加载快速**：精简的代码确保快速访问

### 可访问性
- **语义化HTML**：正确的HTML标签和结构
- **键盘导航**：支持键盘操作
- **对比度**：确保文字和背景有足够对比度

## 🚀 快速开始

### 本地开发

1. **克隆仓库**
   ```bash
   git clone https://github.com/zhucebuniao/zhucebuniao.github.io.git
   cd zhucebuniao.github.io
   ```

2. **安装依赖**
   ```bash
   bundle install
   ```

3. **启动开发服务器**
   ```bash
   bundle exec jekyll serve
   ```

4. **访问网站**
   打开浏览器访问 `http://localhost:4000`

### 内容管理

#### 写作新文章
在 `_posts/` 目录下创建新的Markdown文件：

```markdown
---
layout: post
title: "文章标题"
date: 2024-01-01
categories: [分类]
tags: [标签1, 标签2]
description: "文章简介"
---

文章内容...
```

#### 管理AI提示词
在 `_data/prompts.yml` 中添加新的提示词：

```yaml
- title: "提示词标题"
  category: "分类名称"
  prompt: "具体的提示词内容..."
  public: true  # true为公开分享，false为私有
```

访问 `/prompts/` 页面可以搜索、筛选和复制提示词。

## 🎨 定制指南

### 颜色主题
在 `_sass/base/_variables.scss` 中修改CSS变量：

```scss
:root {
    --primary-color: #333333;    // 主色调
    --accent-color: #0066cc;     // 强调色
    --background-color: #ffffff; // 背景色
    // ... 更多变量
}
```

### 字体配置
在 `_sass/base/_typography.scss` 中修改字体栈：

```scss
$base-font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
```

### 布局调整
组件样式位于 `_sass/components/` 目录：
- `_buttons.scss` - 按钮样式
- `_cards.scss` - 卡片样式
- `_navigation.scss` - 导航样式

## 📦 部署

### GitHub Pages
1. Fork这个仓库
2. 在仓库设置中启用GitHub Pages
3. 选择源分支（通常是`main`）
4. 等待部署完成

### 自定义域名
1. 在仓库根目录添加 `CNAME` 文件
2. 文件内容为你的域名（如：`example.com`）
3. 在域名提供商处配置DNS记录

## 🤝 贡献指南

欢迎提交Issue和Pull Request！

1. **Fork项目**
2. **创建特性分支** (`git checkout -b feature/AmazingFeature`)
3. **提交更改** (`git commit -m 'Add some AmazingFeature'`)
4. **推送分支** (`git push origin feature/AmazingFeature`)
5. **创建Pull Request**

## 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

## 📞 联系方式

- **GitHub**: [@zhucebuniao](https://github.com/zhucebuniao)
- **Website**: [https://zhucebuniao.github.io](https://zhucebuniao.github.io)
- **Email**: blog@example.com

---

**感谢使用极简博客模板！** 🙏

---

## 🎯 已完成任务

- [x] **设计极简界面**
- [x] **实现响应式布局** 
- [x] **添加暗色模式支持**
- [x] **优化页面性能**
- [x] **创建AI提示词管理功能**
- [x] **部署到 GitHub Pages**
- [x] **支持中文界面**

---

## 🏆 解锁成就

📝 **内容创作者** - 创建了优秀的博客平台  
🎨 **设计师** - 实现了简洁美观的界面  
🤖 **AI助手** - 添加了实用的提示词管理功能  
⚡ **性能优化专家** - 实现了快速加载体验  
🚀 **部署专家** - 成功部署到 GitHub Pages  
📱 **移动适配专家** - 完美适配移动设备  
🌏 **本地化专家** - 添加了中文支持