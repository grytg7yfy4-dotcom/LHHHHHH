/* ============================================================================
 *  知识地图 —— 数据在 data.js，这里只负责布局、缩放、选中
 *  布局：阶段 = 列，节点在列内按顺序排列，连线 = 三次贝塞尔
 * ========================================================================== */
(function () {
  'use strict';

  var DATA = window.MAP_DATA || { stages: [], nodes: [], edges: [] };
  var STAGES = DATA.stages || [];
  var NODES = DATA.nodes || [];
  var EDGES = DATA.edges || [];

  var NODE_W = 196;     // 与 CSS .node 的宽度一致
  var COL_W = 236;
  var COL_GAP = 46;
  var TOP = 78;
  var SLOT = 88;
  var PAD = 26;
  var STAGE_TINT = ['#3b6cf6', '#7c5cff', '#0ea5a5', '#f79009', '#12b76a', '#94a3b8'];

  var stageEl = document.getElementById('stage');
  var worldEl = document.getElementById('world');
  var bandsEl = document.getElementById('bands');
  var edgesEl = document.getElementById('edges');
  var nodesEl = document.getElementById('nodes');
  var legendEl = document.getElementById('legend');
  var listEl = document.getElementById('stageList');
  var zoomEl = document.getElementById('zoom');
  var segEl = document.getElementById('seg');
  var panelEl = document.getElementById('panel');
  var scrimEl = document.getElementById('scrim');
  var pStage = document.getElementById('p-stage');
  var pTitle = document.getElementById('p-title');
  var pBody = document.getElementById('p-body');
  var pLinks = document.getElementById('p-links');

  var pos = {};        // id -> {x, y}
  var paths = [];      // {a, b, el}
  var nodeEls = {};    // id -> element
  var view = { x: 0, y: 0, k: 1 };
  var selected = '';
  var W = 0, H = 0;

  /* ---------------------------------------------------------------- 工具 */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function rgba(hex, a) {
    var h = hex.replace('#', '');
    var r = parseInt(h.slice(0, 2), 16), g = parseInt(h.slice(2, 4), 16), b = parseInt(h.slice(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + a + ')';
  }

  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }

  function stageOf(id) {
    for (var i = 0; i < STAGES.length; i++) if (STAGES[i].id === id) return { s: STAGES[i], i: i };
    return null;
  }

  function nodeOf(id) {
    for (var i = 0; i < NODES.length; i++) if (NODES[i].id === id) return NODES[i];
    return null;
  }

  function firstLine(s) { return String(s || '').split('\n')[0].replace(/[*`]/g, ''); }

  /* ---------------------------------------------------------------- 布局 */

  function layout() {
    var byStage = {};
    STAGES.forEach(function (s) { byStage[s.id] = []; });
    NODES.forEach(function (n) {
      if (!byStage[n.stage]) byStage[n.stage] = [];
      byStage[n.stage].push(n);
    });

    var maxRows = 1;
    STAGES.forEach(function (s) { maxRows = Math.max(maxRows, byStage[s.id].length); });

    W = PAD * 2 + STAGES.length * COL_W + (STAGES.length - 1) * COL_GAP;
    H = TOP + maxRows * SLOT + PAD - 20;

    worldEl.style.width = W + 'px';
    worldEl.style.height = H + 'px';
    edgesEl.setAttribute('width', W);
    edgesEl.setAttribute('height', H);

    // 阶段底纹
    bandsEl.innerHTML = '';
    STAGES.forEach(function (s, i) {
      var x = PAD + i * (COL_W + COL_GAP);
      var band = document.createElement('div');
      band.className = 'band';
      band.style.cssText = 'left:' + (x - 14) + 'px;top:8px;width:' + (COL_W + 28) +
        'px;height:' + (H - 16) + 'px;color:' + STAGE_TINT[i % STAGE_TINT.length] +
        ';background:' + rgba(STAGE_TINT[i % STAGE_TINT.length], 0.05);
      band.innerHTML = '<b>' + esc(s.name) + '</b><i>' + esc(s.note || '') + '</i>';
      bandsEl.appendChild(band);

      byStage[s.id].forEach(function (n, r) {
        pos[n.id] = { x: x, y: TOP + r * SLOT };
      });
    });

    // 节点
    nodesEl.innerHTML = '';
    nodeEls = {};
    NODES.forEach(function (n) {
      var p = pos[n.id];
      if (!p) return;
      var el = document.createElement('div');
      el.className = 'node';
      el.style.left = p.x + 'px';
      el.style.top = p.y + 'px';
      el.setAttribute('data-id', n.id);
      var dot = n.kind === 'done' ? 'var(--ok)' : n.kind === 'doing' ? 'var(--warn)' : 'var(--faint)';
      el.innerHTML =
        '<div class="label"><i class="dot" style="background:' + dot + '"></i>' + esc(n.label) + '</div>' +
        '<div class="desc">' + esc(firstLine(n.detail)) + '</div>';
      nodesEl.appendChild(el);
      nodeEls[n.id] = el;
    });

    // 连线
    while (edgesEl.firstChild) edgesEl.removeChild(edgesEl.firstChild);
    paths = [];
    EDGES.forEach(function (pair) {
      var a = pos[pair[0]], b = pos[pair[1]];
      if (!a || !b) return;
      var x1 = a.x + NODE_W, y1 = a.y + 26;
      var x2 = b.x, y2 = b.y + 26;
      var dx = Math.max(38, (x2 - x1) / 2);
      var path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
      path.setAttribute('d', 'M' + x1 + ',' + y1 + ' C' + (x1 + dx) + ',' + y1 + ' ' + (x2 - dx) + ',' + y2 + ' ' + x2 + ',' + y2);
      path.setAttribute('data-a', pair[0]);
      path.setAttribute('data-b', pair[1]);
      edgesEl.appendChild(path);
      paths.push({ a: pair[0], b: pair[1], el: path });
    });
  }

  /* ---------------------------------------------------------------- 视图 */

  function applyView() {
    worldEl.style.transform = 'translate(' + view.x + 'px,' + view.y + 'px) scale(' + view.k + ')';
    zoomEl.textContent = Math.round(view.k * 100) + '%';
  }

  function fit() {
    var w = stageEl.clientWidth, h = stageEl.clientHeight;
    if (!w || !h) return;
    var k = Math.min(1, (w - 36) / W, (h - 36) / H);
    view.k = Math.max(0.32, k);
    view.x = (w - W * view.k) / 2;
    view.y = (h - H * view.k) / 2;
    applyView();
  }

  function zoomAt(px, py, factor) {
    var k2 = clamp(view.k * factor, 0.32, 2.2);
    view.x = px - (px - view.x) * (k2 / view.k);
    view.y = py - (py - view.y) * (k2 / view.k);
    view.k = k2;
    applyView();
  }

  /* ---------------------------------------------------------------- 选中 */

  function neighbours(id) {
    var set = {};
    EDGES.forEach(function (p) {
      if (p[0] === id) set[p[1]] = 1;
      if (p[1] === id) set[p[0]] = 1;
    });
    return set;
  }

  function select(id) {
    selected = id || '';
    var near = selected ? neighbours(selected) : {};

    Object.keys(nodeEls).forEach(function (nid) {
      var el = nodeEls[nid];
      el.classList.toggle('on', nid === selected);
      el.classList.toggle('dim', !!selected && nid !== selected && !near[nid]);
    });

    paths.forEach(function (p) {
      var on = selected && (p.a === selected || p.b === selected);
      p.el.classList.toggle('on', !!on);
      p.el.classList.toggle('dim', !!selected && !on);
    });

    if (!selected) { closePanel(); return; }
    openPanel(nodeOf(selected));
  }

  function openPanel(n) {
    if (!n) return;
    var st = stageOf(n.stage);
    var tint = st ? STAGE_TINT[st.i % STAGE_TINT.length] : 'var(--accent)';
    pStage.textContent = st ? st.s.name : '';
    pStage.style.color = tint;
    pStage.style.background = rgba(tint, 0.12);
    pTitle.textContent = n.label;
    pBody.innerHTML = window.MD ? window.MD.render(n.detail) : esc(n.detail);
    pLinks.innerHTML = (n.links || []).map(function (l) {
      return '<a href="' + esc(l.href) + '"' + (l.ext ? ' target="_blank" rel="noopener"' : '') + '>' +
        esc(l.text) + '</a>';
    }).join('');
    panelEl.classList.add('open');
    panelEl.setAttribute('aria-hidden', 'false');
    if (window.innerWidth <= 760) scrimEl.classList.add('on');
  }

  function closePanel() {
    panelEl.classList.remove('open');
    panelEl.setAttribute('aria-hidden', 'true');
    scrimEl.classList.remove('on');
  }

  /* ---------------------------------------------------------------- 按阶段 */

  function renderList() {
    listEl.innerHTML = STAGES.map(function (s, i) {
      var nodes = NODES.filter(function (n) { return n.stage === s.id; });
      if (!nodes.length) return '';
      var tint = STAGE_TINT[i % STAGE_TINT.length];
      return '<section class="stage-block">' +
        '<h3><i style="width:8px;height:8px;border-radius:99px;background:' + tint + '"></i>' +
        esc(s.name) + '<em>' + esc(s.note || '') + ' · ' + nodes.length + ' 个节点</em></h3>' +
        '<div class="grid">' + nodes.map(function (n) {
          return '<div class="cell" data-id="' + esc(n.id) + '"><b>' + esc(n.label) + '</b>' +
            '<p>' + esc(firstLine(n.detail)) + '</p></div>';
        }).join('') + '</div>' +
        '</section>';
    }).join('');
  }

  /* ---------------------------------------------------------------- 事件 */

  stageEl.addEventListener('click', function (e) {
    if (justDragged) { justDragged = false; return; }
    var node = e.target.closest('.node');
    if (node) { select(node.getAttribute('data-id')); return; }
    if (!e.target.closest('.legend')) { select(''); }
  });

  var drag = null;
  var justDragged = false;
  stageEl.addEventListener('pointerdown', function (e) {
    if (e.target.closest('.node') || e.target.closest('.legend') || e.button !== 0) return;
    drag = { x: e.clientX, y: e.clientY, vx: view.x, vy: view.y, moved: false };
    stageEl.classList.add('dragging');
    stageEl.setPointerCapture(e.pointerId);
  });

  stageEl.addEventListener('pointermove', function (e) {
    if (!drag) return;
    var dx = e.clientX - drag.x, dy = e.clientY - drag.y;
    if (Math.abs(dx) + Math.abs(dy) > 4) drag.moved = true;
    view.x = drag.vx + dx;
    view.y = drag.vy + dy;
    applyView();
  });

  stageEl.addEventListener('pointerup', function (e) {
    if (!drag) return;
    justDragged = !!drag.moved;
    drag = null;
    stageEl.classList.remove('dragging');
    try { stageEl.releasePointerCapture(e.pointerId); } catch (err) {}
  });

  stageEl.addEventListener('wheel', function (e) {
    e.preventDefault();
    var rect = stageEl.getBoundingClientRect();
    zoomAt(e.clientX - rect.left, e.clientY - rect.top, Math.exp(-e.deltaY * 0.0016));
  }, { passive: false });

  document.getElementById('zoom-in').onclick = function () {
    zoomAt(stageEl.clientWidth / 2, stageEl.clientHeight / 2, 1.2);
  };
  document.getElementById('zoom-out').onclick = function () {
    zoomAt(stageEl.clientWidth / 2, stageEl.clientHeight / 2, 1 / 1.2);
  };
  document.getElementById('fit').onclick = fit;

  document.getElementById('p-close').onclick = function () { select(''); };
  scrimEl.onclick = function () { select(''); };

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') select('');
  });

  listEl.addEventListener('click', function (e) {
    var cell = e.target.closest('.cell');
    if (!cell) return;
    select(cell.getAttribute('data-id'));
  });

  segEl.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-view]');
    if (!b) return;
    setView(b.getAttribute('data-view'));
  });

  function setView(v) {
    var graph = v === 'graph';
    Array.prototype.forEach.call(segEl.children, function (x) {
      x.classList.toggle('on', x.getAttribute('data-view') === v);
    });
    stageEl.classList.toggle('hidden', !graph);
    listEl.classList.toggle('hidden', graph);
    document.querySelector('.map-bar .tools').style.visibility = graph ? 'visible' : 'hidden';
    if (graph) requestAnimationFrame(fit);
  }

  window.addEventListener('resize', function () {
    if (!stageEl.classList.contains('hidden')) fit();
  });

  /* ---------------------------------------------------------------- 启动 */

  function boot() {
    var meta = DATA.meta || {};
    document.getElementById('sub').textContent = meta.sub || '';
    document.getElementById('foot-updated').textContent = meta.updated ? '更新于 ' + meta.updated : '';
    document.title = (meta.title || '知识地图') + ' · 廖恒';

    legendEl.innerHTML =
      '<span><i style="background:var(--ok)"></i>已学完</span>' +
      '<span><i style="background:var(--warn)"></i>进行中</span>' +
      '<span><i style="background:var(--faint)"></i>待开始</span>';

    layout();
    renderList();

    if (window.innerWidth <= 760) {
      // 手机上先给列表，图可以点开
      setView('list');
    } else {
      applyView();
      requestAnimationFrame(fit);
    }

    var h = decodeURIComponent(String(location.hash || ''));
    var m = h.match(/#?n\/(.+)$/);
    if (m) {
      setView('graph');
      select(m[1]);
    }
  }

  boot();
})();
