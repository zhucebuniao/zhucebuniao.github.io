---
layout: page
title: "全景 Viewer"
description: "上传 2:1 equirectangular 全景图，在浏览器中进行 360° 查看。"
permalink: /panorama-viewer/
---

<p style="margin-bottom: 1rem; color: var(--text-secondary);">
  使用说明：点击下方按钮进入全屏查看器，或直接在本页嵌入窗口中上传全景图（建议 2:1 比例）。
</p>

<p style="margin-bottom: 1rem;">
  <a href="{{ '/panorama-viewer.html' | relative_url }}" target="_blank" rel="noopener" class="btn btn-primary">
    打开全屏全景 Viewer
  </a>
</p>

<div style="border: 1px solid var(--border-color); border-radius: 8px; overflow: hidden; background: #0a0a0a;">
  <iframe
    src="{{ '/panorama-viewer.html' | relative_url }}"
    title="全景 Viewer"
    style="width: 100%; min-height: 760px; border: 0; display: block;"
    loading="lazy">
  </iframe>
</div>
