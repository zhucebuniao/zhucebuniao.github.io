---
layout: page
title: ""
description: ""
permalink: /panorama-viewer/
no_frame: true
---

<section class="tool-page">
  <div class="tool-page__intro tool-page__intro--split">
    <p class="tool-page__note">上传图片后可直接拖拽查看；如需更大视图可在新标签页打开。</p>
    <p class="tool-page__note">
      <a href="{{ '/' | relative_url }}">返回首页</a> ·
      <a href="{{ '/panorama-viewer.html' | relative_url }}" target="_blank" rel="noopener">新标签页打开</a>
    </p>
  </div>

  <div class="tool-embed tool-embed--tall">
    <iframe
      src="{{ '/panorama-viewer.html' | relative_url }}"
      title="全景 Viewer"
      loading="lazy">
    </iframe>
  </div>
</section>
