/* ============================================================================
 *  Python 案例库 —— 目录、筛选、案例详情、复制代码、截图位
 * ========================================================================== */
(function () {
  'use strict';

  var CASES = (window.PY_CASES || []).slice().sort(function (a, b) { return a.p - b.p; });
  var VIDEO = 'https://www.bilibili.com/video/BV1qW4y1a7fU';
  var VD = '&vd_source=ddb3b70a1e9e07ef07c3c114d79b3768';

  var listEl = document.getElementById('list');
  var mainEl = document.getElementById('main');
  var filterEl = document.getElementById('filter');
  var current = 0;

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function videoUrl(c) { return VIDEO + '?p=' + c.p + VD; }

  /* ------------------------------------------------------------ 目录 */

  function buildList() {
    var html = '';
    var lastCh = '';
    CASES.forEach(function (c, i) {
      if (c.ch !== lastCh) {
        html += '<div class="group-title">' + esc(c.ch) + '</div>';
        lastCh = c.ch;
      }
      html += '<a class="item" href="#p' + c.p + '" data-i="' + i + '">' +
        '<span class="p">P' + c.p + '</span><span class="t">' + esc(c.t) + '</span></a>';
    });
    listEl.innerHTML = html;
  }

  /* ------------------------------------------------------------ 正文 */

  function renderCase(i) {
    if (!CASES.length) return;
    i = (i + CASES.length) % CASES.length;
    current = i;
    var c = CASES[i];

    var steps = (c.steps || []).map(function (s) { return '<li>' + esc(s) + '</li>'; }).join('');

    mainEl.innerHTML =
      '<div class="case-head">' +
        '<span class="pill">P' + c.p + '</span>' +
        '<h1>' + esc(c.t) + '</h1>' +
        '<p class="meta">' + esc(c.ch) + ' · 对应视频第 ' + c.p + ' 集</p>' +
      '</div>' +

      '<section><h3>题目</h3><p>' + esc(c.need) + '</p></section>' +

      (steps ? '<section><h3>思路</h3><ol>' + steps + '</ol></section>' : '') +

      '<section><h3>参考代码<button class="copy" id="copy">复制</button></h3>' +
        '<pre><code id="code">' + esc(c.code) + '</code></pre>' +
        (c.pre ? '<div class="tip">先准备：<code>' + esc(c.pre) + '</code></div>' : '') +
      '</section>' +

      (c.out ? '<section><h3>运行结果</h3><pre class="out">' + esc(c.out) + '</pre></section>' : '') +

      (c.note ? '<div class="tip">' + esc(c.note) + '</div>' : '') +

      '<div class="case-foot">' +
        '<a href="#p' + CASES[(i - 1 + CASES.length) % CASES.length].p + '">← 上一题</a>' +
        '<a href="#p' + CASES[(i + 1) % CASES.length].p + '">下一题 →</a>' +
        '<span class="spacer"></span>' +
        '<a href="' + videoUrl(c) + '" target="_blank" rel="noopener">看视频 P' + c.p + ' ↗</a>' +
      '</div>';

    bindCopy(c);
    markActive(i);
    if (location.hash !== '#p' + c.p) {
      try { history.replaceState(null, '', '#p' + c.p); } catch (e) {}
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function bindCopy(c) {
    var btn = document.getElementById('copy');
    if (!btn) return;
    btn.onclick = function () {
      var text = c.code || '';
      function ok() {
        btn.textContent = '已复制';
        setTimeout(function () { btn.textContent = '复制'; }, 1200);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(ok, function () {});
      } else {
        var ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); ok(); } catch (e) {}
        document.body.removeChild(ta);
      }
    };
  }

  function markActive(i) {
    var items = listEl.querySelectorAll('.item');
    for (var k = 0; k < items.length; k++) {
      items[k].classList.toggle('on', Number(items[k].getAttribute('data-i')) === i);
    }
  }

  /* ------------------------------------------------------------ 交互 */

  listEl.addEventListener('click', function (e) {
    var a = e.target.closest('.item');
    if (!a) return;
    e.preventDefault();
    var i = Number(a.getAttribute('data-i'));
    renderCase(i);
    if (window.innerWidth <= 900) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  });

  filterEl.addEventListener('input', function () {
    var q = filterEl.value.trim().toLowerCase();
    var items = listEl.querySelectorAll('.item');
    var titles = listEl.querySelectorAll('.group-title');
    var shown = [];
    for (var k = 0; k < items.length; k++) {
      var c = CASES[Number(items[k].getAttribute('data-i'))];
      var hay = (c.t + ' ' + c.need + ' ' + c.ch).toLowerCase();
      var hit = !q || hay.indexOf(q) >= 0;
      items[k].classList.toggle('hide', !hit);
      if (hit) shown.push(c.ch);
    }
    for (var j = 0; j < titles.length; j++) {
      var name = titles[j].textContent;
      titles[j].style.display = shown.indexOf(name) >= 0 ? '' : 'none';
    }
  });

  window.addEventListener('hashchange', function () {
    var m = String(location.hash || '').match(/#p(\d+)/);
    if (!m) return;
    var idx = indexOfP(Number(m[1]));
    if (idx >= 0 && idx !== current) renderCase(idx);
  });

  function indexOfP(p) {
    for (var i = 0; i < CASES.length; i++) if (CASES[i].p === p) return i;
    return -1;
  }

  /* ------------------------------------------------------------ 启动 */

  buildList();
  var m = String(location.hash || '').match(/#p(\d+)/);
  renderCase(m && indexOfP(Number(m[1])) >= 0 ? indexOfP(Number(m[1])) : 0);
})();
