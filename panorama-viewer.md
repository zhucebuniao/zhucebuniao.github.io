---
layout: page
title: "全景 Viewer"
description: "上传 2:1 equirectangular 全景图，在浏览器中进行 360° 查看。"
permalink: /panorama-viewer/
no_frame: true
---

<section class="tool-page">
  <div class="tool-page__intro">
    <p class="tool-page__note">上传图片后可直接拖拽查看；如需独立窗口，可在<a href="{{ '/panorama-viewer.html' | relative_url }}" target="_blank" rel="noopener">新标签页打开</a>。</p>
  </div>

  <div class="tool-embed tool-embed--tall">
    <iframe
      src="{{ '/panorama-viewer.html' | relative_url }}"
      title="全景 Viewer"
      loading="lazy">
    </iframe>
  </div>
</section>
