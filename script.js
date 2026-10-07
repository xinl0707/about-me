/* ============================================================
   滚动叙事（scrollytelling）脚本
   1. 跑马灯内容生成
   2. Hero 大跑马灯 → 顶部细条 的滚动联动（连续过渡）
   3. 渐入动画（IntersectionObserver）
   4. 项目 sticky 配图切换（IntersectionObserver）+ 步骤进度圆点
   5. 顶部滚动进度条
   6. sub-nav 章节高亮（scrollspy）
   7. 数据带大数字 count-up
   ============================================================ */

var REDUCE_MOTION = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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
  var subNav = document.getElementById('subNav');
  if (!hero) return;

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
    if (heroMarquee) {
      heroMarquee.style.transform =
        'translate(-50%, -50%) rotate(-2deg) scale(' + scale + ') translateY(' + ty + 'vh)';
      heroMarquee.style.opacity = clamp(op, 0, 1).toFixed(4);
    }

    // 顶部细条 + sub-nav：随滚动连续滑下 + 淡入（p 0.4 → 0.75 之间完成）
    var tp = clamp((p - 0.4) / 0.35, 0, 1);
    if (topMarquee) {
      topMarquee.style.opacity = tp.toFixed(4);
      topMarquee.style.transform = 'translateY(' + ((1 - tp) * -100) + '%)';
    }
    if (subNav) {
      subNav.style.opacity = tp.toFixed(4);
      subNav.style.transform = 'translateY(' + ((1 - tp) * -100) + '%)';
      subNav.style.pointerEvents = tp > 0.5 ? 'auto' : 'none';
    }

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

/* ---------- 4. 项目 sticky 配图切换 + 步骤进度圆点 ---------- */
(function () {
  var projects = document.querySelectorAll('.project');
  var steps = document.querySelectorAll('.project__step');
  if (!steps.length) return;

  /* 为每个项目的 sticky 配图区生成进度圆点（纯装饰，无 JS 时不存在） */
  projects.forEach(function (p) {
    var count = p.querySelectorAll('.project__step').length;
    var media = p.querySelector('.project__media');
    if (!count || !media) return;
    var rail = document.createElement('div');
    rail.className = 'step-rail';
    rail.setAttribute('aria-hidden', 'true');
    for (var i = 0; i < count; i++) {
      var dot = document.createElement('span');
      dot.className = 'step-dot' + (i === 0 ? ' is-active' : '');
      rail.appendChild(dot);
    }
    media.appendChild(rail);
  });

  function activate(project, index) {
    project.querySelectorAll('.project__img').forEach(function (img, i) {
      img.classList.toggle('is-active', i === index);
    });
    project.querySelectorAll('.step-dot').forEach(function (dot, i) {
      dot.classList.toggle('is-active', i === index);
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

/* ---------- 5. 顶部滚动进度条 ---------- */
(function () {
  var bar = document.getElementById('scrollProgress');
  if (!bar) return;

  var ticking = false;
  function update() {
    var doc = document.documentElement;
    var max = doc.scrollHeight - window.innerHeight;
    var p = max > 0 ? window.scrollY / max : 0;
    bar.style.width = (Math.min(Math.max(p, 0), 1) * 100).toFixed(2) + '%';
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  window.addEventListener('resize', update);   /* 窗口尺寸变化后重算比例 */
  update();
})();

/* ---------- 6. sub-nav 章节高亮（scrollspy） ---------- */
(function () {
  var subNav = document.getElementById('subNav');
  if (!subNav) return;
  var links = subNav.querySelectorAll('a[href^="#"]');
  if (!links.length) return;

  var targets = [];
  links.forEach(function (a) {
    var el = document.getElementById(a.getAttribute('href').slice(1));
    if (el) targets.push({ el: el, link: a });
  });

  var ticking = false;
  function update() {
    var current = null;
    targets.forEach(function (t) {
      if (t.el.getBoundingClientRect().top <= 140) current = t;   // 越靠下越优先
    });
    targets.forEach(function (t) {
      t.link.classList.toggle('is-active', t === current);
    });
    ticking = false;
  }
  window.addEventListener('scroll', function () {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(update);
  }, { passive: true });
  update();
})();

/* ---------- 7. 数据带大数字 count-up ---------- */
(function () {
  var nums = document.querySelectorAll('.stat-num[data-count]');
  if (!nums.length || REDUCE_MOTION) return;
  if (!('IntersectionObserver' in window)) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      var el = e.target;
      var target = parseInt(el.dataset.count, 10) || 0;
      var duration = 900;
      var start = null;
      el.textContent = '0';

      function tick(ts) {
        if (start === null) start = ts;
        var p = Math.min((ts - start) / duration, 1);
        var eased = 1 - Math.pow(1 - p, 3);   // ease-out cubic
        el.textContent = Math.round(eased * target);
        if (p < 1) requestAnimationFrame(tick);
      }
      requestAnimationFrame(tick);
      io.unobserve(el);
    });
  }, { threshold: 0.6 });

  nums.forEach(function (n) { io.observe(n); });
})();
