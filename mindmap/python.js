/* ============================================================================
 *  Python 学习地图 —— 树状布局 + 详情面板
 *  数据在 python/data-*.js（window.PY_CHAPTERS），这里只管画和交互
 * ========================================================================== */
(function () {
  'use strict';

  var CHAPTERS = window.PY_CHAPTERS || [];
  var VIDEO = 'https://www.bilibili.com/video/BV1qW4y1a7fU';
  var KEY = 'py-map-mastered-v1';
  var PALETTE = ['#3b6cf6', '#0891b2', '#0d9488', '#059669', '#65a30d', '#ca8a04',
    '#ea580c', '#dc2626', '#db2777', '#7c3aed', '#4f46e5', '#b45309', '#475569'];

  var SZ = {
    rootW: 198, rootH: 50, chW: 214, chH: 42,
    secW: 202, secH: 34, gapX: 66, gapY: 6, chGap: 10, pad: 36
  };

  var stage = document.getElementById('stage');
  var world = document.getElementById('world');
  var edgesEl = document.getElementById('edges');
  var nodesEl = document.getElementById('nodes');
  var panel = document.getElementById('panel');
  var scrim = document.getElementById('scrim');
  var pTag = document.getElementById('p-tag');
  var pTitle = document.getElementById('p-title');
  var pDesc = document.getElementById('p-desc');
  var pSyn = document.getElementById('p-syn');
  var pCode = document.getElementById('p-code');
  var pTips = document.getElementById('p-tips');
  var pVideo = document.getElementById('p-video');
  var pDone = document.getElementById('p-done');
  var bSyn = document.getElementById('b-syn');
  var bCode = document.getElementById('b-code');
  var bTips = document.getElementById('b-tips');
  var bCases = document.getElementById('b-cases');
  var pCases = document.getElementById('p-cases');
  var qEl = document.getElementById('q');
  var zoomEl = document.getElementById('zoom');
  var doneN = document.getElementById('done-n');
  var secN = document.getElementById('sec-n');

  var state = { expanded: {}, selected: '', q: '', mastered: {} };
  var view = { x: 0, y: 0, k: 1 };
  var drag = null;
  var justDragged = false;
  var last = { nodes: [], W: 0, H: 0 };
  var nodeEls = {};

  /* ------------------------------------------------------------ 数据初始化 */

  var TOTAL = 0;
  CHAPTERS.forEach(function (ch, i) {
    ch.id = 'c' + (i + 1);
    ch.num = String(i + 1);
    ch.color = PALETTE[i % PALETTE.length];
    (ch.sec || []).forEach(function (s, j) {
      s.id = ch.id + '-s' + j;
      s.ch = ch;
      TOTAL += 1;
    });
  });
  secN.textContent = String(TOTAL);

  try {
    var saved = JSON.parse(localStorage.getItem(KEY) || '{}');
    Object.keys(saved).forEach(function (k) { if (saved[k]) state.mastered[k] = 1; });
  } catch (e) {}

  /* ------------------------------------------------------------ 工具 */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function shortName(n) { return String(n || '').replace(/^\d+\.\s*/, ''); }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function saveMastered() {
    try { localStorage.setItem(KEY, JSON.stringify(state.mastered)); } catch (e) {}
  }

  function recomputeCount() {
    var n = 0;
    Object.keys(state.mastered).forEach(function (k) { if (state.mastered[k]) n += 1; });
    doneN.textContent = String(n);
  }

  /* ------------------------------------------------------------ 布局 */

  function layout() {
    var nodes = [];
    var blocks = [];
    var totalH = 0;

    CHAPTERS.forEach(function (ch) {
      var open = !!state.expanded[ch.id];
      var secs = open ? (ch.sec || []) : [];
      var h = Math.max(SZ.chH, secs.length ? secs.length * SZ.secH + (secs.length - 1) * SZ.gapY : 0);
      blocks.push({ ch: ch, secs: secs, h: h });
      totalH += h;
    });
    totalH += SZ.chGap * Math.max(0, blocks.length - 1);

    var W = SZ.pad * 2 + SZ.rootW + SZ.gapX + SZ.chW + SZ.gapX + SZ.secW;
    var H = totalH + SZ.pad * 2;
    var cx = SZ.pad + SZ.rootW + SZ.gapX;
    var sx = cx + SZ.chW + SZ.gapX;
    var rootCenter = SZ.pad + totalH / 2;

    nodes.push({
      id: 'root', type: 'root', x: SZ.pad, y: rootCenter - SZ.rootH / 2,
      w: SZ.rootW, h: SZ.rootH, label: 'Python 学习 · 1-123 集', parent: ''
    });

    var top = SZ.pad;
    blocks.forEach(function (b) {
      var cy = top + b.h / 2;
      nodes.push({
        id: b.ch.id, type: 'ch', x: cx, y: cy - SZ.chH / 2, w: SZ.chW, h: SZ.chH,
        data: b.ch, parent: 'root'
      });
      var secsH = b.secs.length ? b.secs.length * SZ.secH + (b.secs.length - 1) * SZ.gapY : 0;
      var sy = cy - secsH / 2;
      b.secs.forEach(function (s, j) {
        nodes.push({
          id: s.id, type: 'sec', x: sx, y: sy + j * (SZ.secH + SZ.gapY),
          w: SZ.secW, h: SZ.secH, data: s, parent: b.ch.id
        });
      });
      top += b.h + SZ.chGap;
    });

    return { nodes: nodes, W: W, H: H };
  }

  /* ------------------------------------------------------------ 渲染 */

  function match(sec, q) {
    if (!q) return true;
    var hay = [sec.n, sec.d, sec.syn, sec.code, (sec.tips || []).join(' ')].join('\n').toLowerCase();
    return hay.indexOf(q) >= 0;
  }

  function render() {
    var L = layout();
    last = L;
    var q = state.q.toLowerCase();

    world.style.width = L.W + 'px';
    world.style.height = L.H + 'px';
    edgesEl.setAttribute('width', L.W);
    edgesEl.setAttribute('height', L.H);
    edgesEl.setAttribute('viewBox', '0 0 ' + L.W + ' ' + L.H);

    nodesEl.innerHTML = '';
    nodeEls = {};
    var byId = {};

    L.nodes.forEach(function (n) { byId[n.id] = n; });

    L.nodes.forEach(function (n) {
      var el = document.createElement('div');
      el.className = 'node ' + n.type;
      el.style.left = n.x + 'px';
      el.style.top = n.y + 'px';
      el.style.width = n.w + 'px';
      el.style.height = n.h + 'px';
      el.setAttribute('data-id', n.id);

      if (n.type === 'root') {
        el.innerHTML = '<span class="t">' + esc(n.label) + '</span>';
      } else if (n.type === 'ch') {
        el.style.background = n.data.color;
        el.innerHTML = '<span class="num">' + esc(n.data.num) + '</span>' +
          '<span class="t">' + esc(shortName(n.data.n)) + '</span>' +
          '<span class="cnt">' + n.data.sec.length + '</span>';
      } else {
        el.style.borderLeftColor = n.data.ch.color;
        el.innerHTML = '<span class="dot"></span><span class="t">' + esc(n.data.n) + '</span>' +
          ((n.data.cases && n.data.cases.length) ? '<span class="cb">案</span>' : '');
        if (state.mastered[n.data.id]) el.classList.add('done');
      }

      if (n.id === state.selected) el.classList.add('on');

      if (q) {
        var hit = n.type === 'sec' ? match(n.data, q)
          : n.type === 'ch' ? (n.data.sec || []).some(function (s) { return match(s, q); })
            : false;
        if (hit) el.classList.add('hit'); else el.classList.add('dim');
      }

      nodesEl.appendChild(el);
      nodeEls[n.id] = el;
    });

    while (edgesEl.firstChild) edgesEl.removeChild(edgesEl.firstChild);
    L.nodes.forEach(function (n) {
      if (!n.parent || !byId[n.parent]) return;
      var p = byId[n.parent];
      var x1 = p.x + p.w, y1 = p.y + p.h / 2;
      var x2 = n.x, y2 = n.y + n.h / 2;
      var mx = x1 + (x2 - x1) * 0.5;
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + mx + ',' + y1 + ' ' + mx + ',' + y2 + ' ' + x2 + ',' + y2);
      path.setAttribute('stroke', n.type === 'ch' ? n.data.color : (n.data.ch ? n.data.ch.color : '#94a3b8'));
      edgesEl.appendChild(path);
    });

    recomputeCount();
  }

  /* ------------------------------------------------------------ 视图 */

  function applyView() {
    world.style.transform = 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.k + ')';
    zoomEl.textContent = Math.round(view.k * 100) + '%';
  }

  function fit() {
    var w = stage.clientWidth, h = stage.clientHeight;
    if (!w || !h || !last.W || !last.H) return;
    var k = Math.min(1, (w - 40) / last.W, (h - 40) / last.H);
    view.k = clamp(k, 0.2, 2.5);
    view.x = (w - last.W * view.k) / 2;
    view.y = (h - last.H * view.k) / 2;
    applyView();
  }

  function centerOn(id) {
    var n = last.nodes.filter(function (x) { return x.id === id; })[0];
    if (!n) return;
    var w = stage.clientWidth, h = stage.clientHeight;
    view.x = w / 2 - (n.x + n.w / 2) * view.k;
    view.y = h / 2 - (n.y + n.h / 2) * view.k;
    applyView();
  }

  function zoomAt(px, py, factor) {
    var k2 = clamp(view.k * factor, 0.2, 2.5);
    view.x = px - (px - view.x) * (k2 / view.k);
    view.y = py - (py - view.y) * (k2 / view.k);
    view.k = k2;
    applyView();
  }

  /* ------------------------------------------------------------ 详情面板 */

  function findSection(id) {
    for (var i = 0; i < CHAPTERS.length; i++) {
      var secs = CHAPTERS[i].sec || [];
      for (var j = 0; j < secs.length; j++) {
        if (secs[j].id === id) return secs[j];
      }
    }
    return null;
  }

  function openSection(id) {
    var s = findSection(id);
    if (!s) return;
    state.selected = id;
    var ch = s.ch;

    showKnowledgeView();

    pTag.textContent = ch.n + ' · ' + ch.eps;
    pTag.style.color = ch.color;
    pTitle.textContent = s.n;
    pDesc.innerHTML = esc(s.d || '').replace(/\n/g, '<br>');

    if (s.syn) { bSyn.style.display = ''; pSyn.textContent = s.syn; } else { bSyn.style.display = 'none'; }
    if (s.code) { bCode.style.display = ''; pCode.textContent = s.code; } else { bCode.style.display = 'none'; }

    var tips = s.tips || [];
    if (tips.length) {
      bTips.style.display = '';
      pTips.innerHTML = tips.map(function (t) { return '<li>' + esc(t) + '</li>'; }).join('');
    } else {
      bTips.style.display = 'none';
    }

    renderCases(s);

    pVideo.href = VIDEO + '?p=' + ch.p + '&vd_source=ddb3b70a1e9e07ef07c3c114d79b3768';
    pVideo.textContent = '看视频 P' + ch.p + '–P' + ch.p2 + ' ↗';

    var done = !!state.mastered[id];
    pDone.classList.toggle('on', done);
    pDone.textContent = done ? '已掌握 ✓' : '标记已掌握';

    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
    if (window.innerWidth <= 820) scrim.classList.add('on');

    Object.keys(nodeEls).forEach(function (nid) {
      nodeEls[nid].classList.toggle('on', nid === id);
    });
  }

  /* ------------------------------------------------------------ 案例 */

  function caseByP(p) {
    var all = window.PY_CASES || [];
    for (var i = 0; i < all.length; i++) if (all[i].p === p) return all[i];
    return null;
  }

  function renderCases(s) {
    var ps = s.cases || [];
    var items = [];
    ps.forEach(function (p) {
      var c = caseByP(p);
      if (c) items.push(c);
    });

    if (!items.length) { bCases.style.display = 'none'; return; }
    bCases.style.display = '';
    pCases.innerHTML = items.map(function (c) {
      return '<button class="case-btn" data-p="' + c.p + '">' +
        '<span class="cp">P' + c.p + '</span>' +
        '<span class="ct">' + esc(c.t) + '</span>' +
        '<span class="ca">→</span></button>';
    }).join('');
  }

  function showKnowledgeView() {
    var kv = document.getElementById('kn-view');
    var cv = document.getElementById('case-view');
    kv.hidden = false;
    cv.hidden = true;
    cv.innerHTML = '';
    document.querySelector('.pfoot').style.display = '';
  }

  function openCase(p) {
    var c = caseByP(p);
    if (!c) return;

    pTag.textContent = '案例 · P' + c.p;
    pTag.style.color = '#f59e0b';
    pTitle.textContent = c.t;

    var steps = (c.steps || []).map(function (x) { return '<li>' + esc(x) + '</li>'; }).join('');

    var cv = document.getElementById('case-view');
    cv.innerHTML =
      '<button class="case-back" id="case-back">← 返回知识点</button>' +
      '<p class="lead">' + esc(c.need) + '</p>' +
      (steps ? '<section class="block"><h4>思路</h4><ol class="case-steps">' + steps + '</ol></section>' : '') +
      '<section class="block"><h4>参考代码</h4><pre><code>' + esc(c.code) + '</code></pre></section>' +
      (c.out ? '<section class="block"><h4>运行结果</h4><pre class="out-pre">' + esc(c.out) + '</pre></section>' : '') +
      (c.note ? '<div class="case-note">' + esc(c.note) + '</div>' : '') +
      '<div class="case-links"><a href="' + VIDEO + '?p=' + c.p + '&vd_source=ddb3b70a1e9e07ef07c3c114d79b3768" target="_blank" rel="noopener">看视频 P' + c.p + ' ↗</a>' +
      '<a href="cases.html#p' + c.p + '">在案例库打开 ↗</a></div>';

    document.getElementById('kn-view').hidden = true;
    cv.hidden = false;
    document.querySelector('.pfoot').style.display = 'none';
    document.getElementById('p-body').scrollTop = 0;
    panel.classList.add('open');
    panel.setAttribute('aria-hidden', 'false');
  }

  function closePanel() {
    state.selected = '';
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden', 'true');
    scrim.classList.remove('on');
    Object.keys(nodeEls).forEach(function (nid) { nodeEls[nid].classList.remove('on'); });
  }

  /* ------------------------------------------------------------ 交互 */

  nodesEl.addEventListener('click', function (e) {
    if (justDragged) { justDragged = false; return; }
    var el = e.target.closest('.node');
    if (!el) return;
    var id = el.getAttribute('data-id');

    if (id === 'root') {
      var anyOpen = CHAPTERS.some(function (c) { return !!state.expanded[c.id]; });
      CHAPTERS.forEach(function (c) { state.expanded[c.id] = anyOpen ? false : true; });
      render(); fit();
      return;
    }

    if (/^c\d+$/.test(id)) {
      state.expanded[id] = !state.expanded[id];
      render();
      if (state.expanded[id]) centerOn(id);
      return;
    }

    openSection(id);
  });

  var start = null;
  stage.addEventListener('pointerdown', function (e) {
    if (e.button !== 0) return;
    if (e.target.closest('.node')) return;
    start = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
    stage.classList.add('dragging');
    try { stage.setPointerCapture(e.pointerId); } catch (err) {}
  });

  stage.addEventListener('pointermove', function (e) {
    if (!start) return;
    var dx = e.clientX - start.x, dy = e.clientY - start.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) start.moved = true;
    view.x = start.vx + dx;
    view.y = start.vy + dy;
    applyView();
  });

  function endDrag(e) {
    if (!start) return;
    justDragged = start.moved;
    start = null;
    stage.classList.remove('dragging');
    try { stage.releasePointerCapture(e.pointerId); } catch (err) {}
  }
  stage.addEventListener('pointerup', endDrag);
  stage.addEventListener('pointercancel', endDrag);

  stage.addEventListener('wheel', function (e) {
    e.preventDefault();
    var rect = stage.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0016));
  }, { passive: false });

  document.getElementById('zoom-in').onclick = function () { zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 1.25); };
  document.getElementById('zoom-out').onclick = function () { zoomAt(stage.clientWidth / 2, stage.clientHeight / 2, 0.8); };
  document.getElementById('fit').onclick = fit;

  document.getElementById('expand').onclick = function () {
    CHAPTERS.forEach(function (c) { state.expanded[c.id] = true; });
    render(); fit();
  };
  document.getElementById('collapse').onclick = function () {
    CHAPTERS.forEach(function (c) { state.expanded[c.id] = false; });
    render();
    centerOn('root');
  };

  qEl.addEventListener('input', function () {
    state.q = qEl.value.trim();
    if (state.q) {
      CHAPTERS.forEach(function (c) {
        if ((c.sec || []).some(function (s) { return match(s, state.q.toLowerCase()); })) {
          state.expanded[c.id] = true;
        }
      });
    }
    render();
  });

  qEl.addEventListener('keydown', function (e) {
    if (e.key !== 'Enter') return;
    var q = state.q.toLowerCase();
    if (!q) return;
    var first = null;
    CHAPTERS.forEach(function (c) {
      (c.sec || []).forEach(function (s) {
        if (!first && match(s, q)) first = s;
      });
    });
    if (first) {
      state.expanded[first.ch.id] = true;
      render();
      centerOn(first.id);
      openSection(first.id);
    }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') closePanel();
    if (e.key === '/' && document.activeElement !== qEl) {
      e.preventDefault();
      qEl.focus();
    }
  });

  pCases.addEventListener('click', function (e) {
    var b = e.target.closest('.case-btn');
    if (b) openCase(Number(b.getAttribute('data-p')));
  });

  document.getElementById('case-view').addEventListener('click', function (e) {
    if (e.target.closest('#case-back')) openSection(state.selected);
  });

  document.getElementById('p-close').onclick = closePanel;
  scrim.onclick = closePanel;

  pDone.onclick = function () {
    var id = state.selected;
    if (!id) return;
    if (state.mastered[id]) { delete state.mastered[id]; } else { state.mastered[id] = 1; }
    saveMastered();
    recomputeCount();
    var el = nodeEls[id];
    if (el) el.classList.toggle('done');
    var done = !!state.mastered[id];
    pDone.classList.toggle('on', done);
    pDone.textContent = done ? '已掌握 ✓' : '标记已掌握';
  };

  document.getElementById('p-copy').onclick = function () {
    var text = pCode.textContent || '';
    function ok() {
      var b = document.getElementById('p-copy');
      b.textContent = '已复制';
      setTimeout(function () { b.textContent = '复制'; }, 1200);
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

  window.addEventListener('resize', function () { fit(); });

  /* ------------------------------------------------------------ 启动 */

  render();
  requestAnimationFrame(fit);
  recomputeCount();

  window.__PY = { layout: layout, state: state, render: render, openSection: openSection, openCase: openCase };
})();
