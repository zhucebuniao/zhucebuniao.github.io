---
layout: page
title: ""
description: ""
permalink: /panorama-viewer/
no_frame: true
---

<section class="tool-page">
  <div class="tool-page__intro tool-page__intro--split">
    <p class="tool-page__note">上传图片后可直接拖拽查看：支持页面内全屏和高度切换，保持浏览上下文。</p>
    <div class="tool-page__controls">
      <button type="button" class="tool-page__action" data-height-target="panorama-viewer-embed">展开高度</button>
      <button type="button" class="tool-page__action" data-fullscreen-target="panorama-viewer-frame">沉浸全屏</button>
    </div>
  </div>

  <div class="tool-embed tool-embed--tall" id="panorama-viewer-embed">
    <iframe
      id="panorama-viewer-frame"
      src="{{ '/panorama-viewer.html' | relative_url }}"
      title="全景 Viewer"
      loading="lazy">
    </iframe>
  </div>
</section>

<script>
  (() => {
    const embed = document.getElementById('panorama-viewer-embed');
    const frame = document.getElementById('panorama-viewer-frame');
    const heightButton = document.querySelector('[data-height-target="panorama-viewer-embed"]');
    const fullscreenButton = document.querySelector('[data-fullscreen-target="panorama-viewer-frame"]');

    if (heightButton && embed) {
      heightButton.addEventListener('click', () => {
        const expanded = embed.classList.toggle('tool-embed--expanded');
        heightButton.textContent = expanded ? '恢复高度' : '展开高度';
      });
    }

    if (fullscreenButton && frame) {
      fullscreenButton.addEventListener('click', async () => {
        try {
          if (document.fullscreenElement) {
            await document.exitFullscreen();
            return;
          }
          await frame.requestFullscreen();
        } catch (error) {
          fullscreenButton.textContent = '当前设备不支持全屏';
          window.setTimeout(() => {
            fullscreenButton.textContent = '沉浸全屏';
          }, 1800);
        }
      });
    }
  })();
</script>
