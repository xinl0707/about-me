/* ============================================================
   滚动叙事（scrollytelling）脚本
   1. 跑马灯内容生成
   2. Hero 大跑马灯 → 顶部细条 的滚动联动（连续过渡）
   3. 渐入动画（IntersectionObserver）
   4. 项目 sticky 配图切换（IntersectionObserver）
   ============================================================ */

/* 启用 JS 标记（配合 CSS：无 JS 时内容直接可见，避免白屏） */
document.documentElement.classList.add('js');

/* ---------- 1. 跑马灯内容 ---------- */
var KEYWORDS = [
  'AI 辅助开发', 'CLAUDE CODE', '黑客松', '双界校园', '刷机救砖',
  '健身减脂', '广州旅行', '爬虫工具', '组队', '折腾'
];

function marqueeHTML() {
  var group = KEYWORDS.map(function (k) {
    return '<span>' + k + '</span><span class="sep">✦</span>';
  }).join('');
  return '<div class="marquee__group">' + group + '</div>' +
         '<div class="marquee__group" aria-hidden="true">' + group + '</div>';
}

var heroMarquee = document.getElementById('heroMarquee');
var topMarquee = document.getElementById('topMarquee');
if (heroMarquee) heroMarquee.innerHTML = '<div class="marquee__track">' + marqueeHTML() + '</div>';
if (topMarquee)  topMarquee.innerHTML  = '<div class="marquee__track">' + marqueeHTML() + '</div>';

/* ---------- 2. Hero 跑马灯 → 顶部细条 滚动联动 ---------- */
(function () {
  var hero = document.getElementById('hero');
  var heroContent = document.querySelector('.hero-content');
  if (!hero || !heroMarquee || !topMarquee) return;

  function clamp(v, lo, hi) {
    return Math.min(Math.max(v, lo), hi);
  }

  function update() {
    var y = window.scrollY;
    var h = hero.offsetHeight || window.innerHeight;
    var p = clamp(y / h, 0, 1); // 0 → 1（滚过整个 Hero）

    // 大背景跑马灯：缩小 + 上移 + 变淡
    var scale = 1 - 0.85 * p;
    var ty = -35 * p;               // vh，往上收
    var op = 0.09 * (1 - p * 1.4);  // 提前淡出
    heroMarquee.style.transform =
      'translate(-50%, -50%) rotate(-2deg) scale(' + scale + ') translateY(' + ty + 'vh)';
    heroMarquee.style.opacity = clamp(op, 0, 1).toFixed(4);

    // 顶部细条：随滚动连续滑下 + 淡入（p 0.4 → 0.75 之间完成）
    var tp = clamp((p - 0.4) / 0.35, 0, 1);
    topMarquee.style.opacity = tp.toFixed(4);
    topMarquee.style.transform = 'translateY(' + ((1 - tp) * -100) + '%)';

    // Hero 内容：轻微上浮淡出（视差）
    if (heroContent) {
      heroContent.style.opacity = clamp(1 - p * 1.6, 0, 1).toFixed(4);
      heroContent.style.transform = 'translateY(' + (p * -60) + 'px)';
    }
  }

  var ticking = false;
  function onScroll() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      update();
      ticking = false;
    });
  }

  window.addEventListener('scroll', onScroll, { passive: true });
  update();
})();

/* ---------- 3. 渐入动画 ---------- */
(function () {
  var els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (el) { el.classList.add('in'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.15 });
  els.forEach(function (el) { io.observe(el); });
})();

/* ---------- 4. 项目 sticky 配图切换 ---------- */
(function () {
  var steps = document.querySelectorAll('.project__step');
  if (!steps.length) return;

  function activate(project, index) {
    var imgs = project.querySelectorAll('.project__img');
    imgs.forEach(function (img, i) {
      img.classList.toggle('is-active', i === index);
    });
  }

  if (!('IntersectionObserver' in window)) return;

  // 滚动到视口中间区域（上下各留 40%）时，激活对应截图
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (e.isIntersecting) {
        var project = e.target.closest('.project');
        var index = parseInt(e.target.dataset.step, 10);
        if (project) activate(project, index);
      }
    });
  }, { rootMargin: '-40% 0px -40% 0px', threshold: 0 });

  steps.forEach(function (s) { io.observe(s); });
})();
