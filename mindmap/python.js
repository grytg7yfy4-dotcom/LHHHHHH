/* ============================================================================
 *  Python 1-123 集导图 —— 章节切换 + 拖动 / 缩放
 *  图是 SVG，缩放不失真；数据在 CHAPTERS 里，改图只要换文件
 * ========================================================================== */
(function () {
  'use strict';

  var CHAPTERS = [
    { f: 'python/00-overview.svg', n: '总览 · 13 章' },
    { f: 'python/01-basics.svg', n: '1. python基础操作 · P1–P13' },
    { f: 'python/02-syntax.svg', n: '2. python基础知识语法 · P14–P28' },
    { f: 'python/03-if.svg', n: '3. python判断语句 · P29–P37' },
    { f: 'python/04-loop.svg', n: '4. python循环语句 · P38–P50' },
    { f: 'python/05-function.svg', n: '5. python函数 · P51–P61' },
    { f: 'python/06-containers.svg', n: '6. python数据容器 · P62–P80' },
    { f: 'python/07-function-plus.svg', n: '7. python函数进阶 · P81–P84' },
    { f: 'python/08-file.svg', n: '8. python文件操作 · P85–P90' },
    { f: 'python/09-exception.svg', n: '9. python异常模块与包 · P91–P98' },
    { f: 'python/10-charts.svg', n: '10. python数据可视化 · P99–P104' },
    { f: 'python/11-map.svg', n: '11. python地图可视化 · P105–P107' },
    { f: 'python/12-bar.svg', n: '12. python柱状图可视化 · P108–P110' },
    { f: 'python/13-oop.svg', n: '13. python面向对象 · P111–P123' }
  ];

  var stage = document.getElementById('stage');
  var world = document.getElementById('world');
  var img = document.getElementById('img');
  var sel = document.getElementById('chapter');
  var zoomEl = document.getElementById('zoom');
  var raw = document.getElementById('raw');

  var view = { x: 0, y: 0, k: 1 };
  var W = 0, H = 0, idx = 0, drag = null, req = 0;

  CHAPTERS.forEach(function (c, i) {
    var o = document.createElement('option');
    o.value = String(i);
    o.textContent = c.n;
    sel.appendChild(o);
  });

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function apply() {
    world.style.transform = 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.k + ')';
    zoomEl.textContent = Math.round(view.k * 100) + '%';
  }

  function fit() {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h || !W || !H) return;
    var k = Math.min(1, (w - 44) / W, (h - 44) / H);
    view.k = clamp(k, 0.25, 3);
    view.x = (w - W * view.k) / 2;
    view.y = (h - H * view.k) / 2;
    apply();
  }

  function show(i, keepView) {
    idx = (i + CHAPTERS.length) % CHAPTERS.length;
    sel.value = String(idx);
    var c = CHAPTERS[idx];
    raw.href = c.f;
    img.alt = c.n;
    req += 1;
    var token = req;

    function paint() {
      if (token !== req) return;
      W = img.naturalWidth;
      H = img.naturalHeight;
      if (!W || !H) return;
      world.style.width = W + 'px';
      world.style.height = H + 'px';
      if (keepView) { apply(); } else { fit(); }
      if (location.hash !== '#' + idx) {
        try { history.replaceState(null, '', '#' + idx); } catch (err) {}
      }
    }

    img.onload = paint;
    img.onerror = function () {
      if (token === req) { W = 0; H = 0; }
    };
    img.src = c.f;
    if (img.complete && img.naturalWidth) paint();
  }

  function zoomAt(px, py, factor) {
    var k2 = clamp(view.k * factor, 0.25, 3);
    view.x = px - (px - view.x) * (k2 / view.k);
    view.y = py - (py - view.y) * (k2 / view.k);
    view.k = k2;
    apply();
  }

  /* ------------------------------------------------------------ 拖动 */
  stage.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    if (e.target.closest('.hint')) return;
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y };
    stage.classList.add('dragging');
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
  });

  stage.addEventListener('pointermove', function (e) {
    if (!drag) return;
    view.x = drag.vx + (e.clientX - drag.x);
    view.y = drag.vy + (e.clientY - drag.y);
    apply();
  });

  function endDrag(e) {
    if (!drag) return;
    drag = null;
    stage.classList.remove('dragging');
    try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  /* ------------------------------------------------------------ 缩放 */
  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    var rect = stage.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0016));
  }, { passive: false });

  document.getElementById('zoom-in').onclick = function () {
    zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 1.25);
  };
  document.getElementById('zoom-out').onclick = function () {
    zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 0.8);
  };
  document.getElementById('fit').onclick = fit;

  /* ------------------------------------------------------------ 切换 */
  sel.onchange = function () { show(parseInt(sel.value, 10), false); };
  document.getElementById('prev').onclick = function () { show(idx - 1, false); };
  document.getElementById('next').onclick = function () { show(idx + 1, false); };

  window.addEventListener('resize', function () {
    if (!drag) fit();
  });

  var m = String(location.hash || '').match(/^#(\d+)$/);
  show(m ? parseInt(m[1], 10) : 0, false);
})();
