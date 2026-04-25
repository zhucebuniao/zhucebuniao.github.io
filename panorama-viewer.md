---
layout: page
title: "全景 Viewer"
description: "上传 2:1 equirectangular 全景图，在浏览器中进行 360° 查看。"
permalink: /panorama-viewer/
no_frame: true
---

<section class="tool-page">
  <div class="tool-page__intro tool-page__intro--split">
    <p class="tool-page__note">
      使用说明：点击下方按钮进入全屏查看器，或直接在本页嵌入窗口中上传全景图（建议 2:1 比例）。
    </p>

    <a href="{{ '/panorama-viewer.html' | relative_url }}" target="_blank" rel="noopener" class="btn">
      打开全屏全景 Viewer
    </a>
  </div>

  <div class="tool-embed tool-embed--tall">
    <iframe
      src="{{ '/panorama-viewer.html' | relative_url }}"
      title="全景 Viewer"
      loading="lazy">
    </iframe>
  </div>
</section>
