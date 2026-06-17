/* ============================================================
   梦与远方 · 交互层（零依赖 vanilla JS）
   - 首页分类筛选
   - 列表滚动渐显
   - 文章页阅读进度条
   渐进增强：脚本失效时内容仍可正常浏览
   ============================================================ */
(function () {
  'use strict';

  /* ---------- 首页分类筛选 ---------- */
  var chips = document.querySelectorAll('.chip[data-filter]');
  var entries = document.querySelectorAll('.entry-list .entry');
  if (chips.length && entries.length) {
    chips.forEach(function (chip) {
      chip.addEventListener('click', function () {
        var filter = chip.getAttribute('data-filter');
        chips.forEach(function (c) { c.classList.remove('active'); });
        chip.classList.add('active');
        entries.forEach(function (entry) {
          var cat = entry.getAttribute('data-category');
          if (filter === 'all' || cat === filter) {
            entry.classList.remove('hide');
          } else {
            entry.classList.add('hide');
          }
        });
      });
    });
  }

  /* ---------- 滚动渐显（IntersectionObserver） ---------- */
  var reveals = document.querySelectorAll('.reveal');
  if (reveals.length && 'IntersectionObserver' in window) {
    var io = new IntersectionObserver(function (items, obs) {
      items.forEach(function (item) {
        if (item.isIntersecting) {
          item.target.classList.add('in');
          obs.unobserve(item.target);
        }
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    // 回退：直接全部显示
    reveals.forEach(function (el) { el.classList.add('in'); });
  }

  /* ---------- 文章页阅读进度条 ---------- */
  var bar = document.querySelector('.progress');
  if (bar) {
    var article = document.querySelector('.post-body') || document.body;
    var ticking = false;
    function update() {
      var sh = article.scrollHeight;
      var ch = document.documentElement.clientHeight;
      var max = sh - ch;
      var scrolled = window.scrollY || document.documentElement.scrollTop;
      var pct = max > 0 ? (scrolled / max) * 100 : 0;
      pct = Math.max(0, Math.min(100, pct));
      bar.style.width = pct + '%';
      ticking = false;
    }
    window.addEventListener('scroll', function () {
      if (!ticking) {
        window.requestAnimationFrame(update);
        ticking = true;
      }
    }, { passive: true });
    window.addEventListener('resize', update, { passive: true });
    update();
  }
})();
