/* ============================================================================
 *  博客页逻辑 —— 数据来自 ../data/notes.js（与主页「笔记」同一份）
 *  路由：#p/<id> 打开文章，#cat/<分类> 筛分类，#q/<关键词> 搜
 * ========================================================================== */
(function () {
  'use strict';

  var NOTES = ((window.NOTES_DATA || {}).notes || []).slice();
  NOTES.sort(function (a, b) { return String(b.date || '').localeCompare(String(a.date || '')); });

  var state = { q: '', cat: '', month: '', id: '' };

  var listEl = document.getElementById('list');
  var postEl = document.getElementById('post');
  var qEl = document.getElementById('q');
  var catsEl = document.getElementById('cats');
  var monthsEl = document.getElementById('months');
  var statEl = document.getElementById('stat');

  /* ---------------------------------------------------------------- 工具 */

  function esc(s) {
    if (window.MD && window.MD.esc) return window.MD.esc(s);
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function monthKey(d) { return String(d || '').slice(0, 7); }

  function monthLabel(k) {
    var p = k.split('-');
    return p[0] + ' 年 ' + (parseInt(p[1], 10) || '') + ' 月';
  }

  function charCount(s) { return String(s || '').replace(/\s+/g, '').length; }

  function excerpt(s) {
    var t = String(s || '')
      .replace(/```[\s\S]*?```/g, ' ')
      .replace(/!\[[^\]]*\]\([^)]*\)/g, ' ')
      .replace(/\[([^\]]+)\]\([^)]*\)/g, '$1')
      .replace(/[#>*`_~|-]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
    return t.length > 92 ? t.slice(0, 92) + '…' : t;
  }

  function noteById(id) {
    for (var i = 0; i < NOTES.length; i++) if (NOTES[i].id === id) return NOTES[i];
    return null;
  }

  /* ---------------------------------------------------------------- 路由 */

  function readHash() {
    var h = decodeURIComponent(String(location.hash || '').replace(/^#/, ''));
    state.id = '';
    if (h.indexOf('p/') === 0) { state.id = h.slice(2); }
    else if (h.indexOf('cat/') === 0) { state.cat = h.slice(4); state.month = ''; }
    else if (h.indexOf('q/') === 0) { state.q = h.slice(2); qEl.value = state.q; }
  }

  function go(hash) {
    if (('#' + hash) === location.hash) { render(); return; }
    location.hash = hash;
  }

  // file:// 下 history.replaceState 可能抛 SecurityError，失败就当没这回事
  function clearHash() {
    try { history.replaceState(null, '', location.pathname + location.search); }
    catch (err) { /* ignore */ }
  }

  /* ---------------------------------------------------------------- 左栏 */

  function renderSide() {
    var cats = {}, months = {};
    NOTES.forEach(function (n) {
      var c = n.category || '未分类';
      cats[c] = (cats[c] || 0) + 1;
      var m = monthKey(n.date);
      months[m] = (months[m] || 0) + 1;
    });

    var catNames = Object.keys(cats).sort(function (a, b) { return cats[b] - cats[a]; });
    var html = ['<button class="chip' + (state.cat ? '' : ' on') + '" data-cat="">全部<i>' + NOTES.length + '</i></button>'];
    catNames.forEach(function (c) {
      html.push('<button class="chip' + (state.cat === c ? ' on' : '') + '" data-cat="' + esc(c) + '">' +
        esc(c) + '<i>' + cats[c] + '</i></button>');
    });
    catsEl.innerHTML = html.join('');

    var mKeys = Object.keys(months).filter(Boolean).sort().reverse();
    monthsEl.innerHTML = mKeys.map(function (m) {
      return '<a href="#" data-month="' + esc(m) + '" class="' + (state.month === m ? 'on' : '') + '">' +
        esc(monthLabel(m)) + '<span>' + months[m] + '</span></a>';
    }).join('') || '<p class="hint">还没有笔记。</p>';

    var total = NOTES.reduce(function (s, n) { return s + charCount(n.content); }, 0);
    statEl.textContent = '共 ' + NOTES.length + ' 篇 · ' + (total / 10000).toFixed(1) + ' 万字';
  }

  /* ---------------------------------------------------------------- 列表 */

  function matches(n) {
    if (state.cat && (n.category || '未分类') !== state.cat) return false;
    if (state.month && monthKey(n.date) !== state.month) return false;
    if (state.q) {
      var q = state.q.toLowerCase();
      var hay = ((n.title || '') + ' ' + (n.content || '') + ' ' +
        ((n.tags || []).join(' ')) + ' ' + (n.category || '')).toLowerCase();
      if (hay.indexOf(q) < 0) return false;
    }
    return true;
  }

  function renderList() {
    var list = NOTES.filter(matches);
    if (!list.length) {
      listEl.innerHTML = '<div class="empty">没有匹配的笔记，换个关键词，或点「全部」。</div>';
      return;
    }

    var out = [];
    var lastMonth = '';
    list.forEach(function (n) {
      var m = monthKey(n.date);
      if (m !== lastMonth) {
        out.push('<div class="month-h">' + esc(monthLabel(m)) + '</div>');
        lastMonth = m;
      }
      out.push(
        '<a class="post-item" href="#p/' + encodeURIComponent(n.id) + '">' +
          '<h3>' + esc(n.title || '（无标题）') + '</h3>' +
          '<div class="post-meta">' +
            '<span>' + esc(n.date || '') + '</span>' +
            '<span class="cat">' + esc(n.category || '未分类') + '</span>' +
            '<span>' + charCount(n.content) + ' 字</span>' +
          '</div>' +
          '<p class="post-excerpt">' + esc(excerpt(n.content)) + '</p>' +
        '</a>'
      );
    });
    listEl.innerHTML = out.join('');
  }

  /* ---------------------------------------------------------------- 正文 */

  function renderPost(n) {
    var idx = NOTES.indexOf(n);
    var prev = NOTES[idx + 1];
    var next = NOTES[idx - 1];

    var tags = (n.tags || []).map(function (t) {
      return '<span class="tag">' + esc(t) + '</span>';
    }).join('');

    postEl.innerHTML =
      '<button class="btn-back" id="btn-back">← 返回列表</button>' +
      '<header>' +
        '<h1>' + esc(n.title || '（无标题）') + '</h1>' +
        '<div class="post-meta">' +
          '<span>' + esc(n.date || '') + '</span>' +
          '<span class="cat">' + esc(n.category || '未分类') + '</span>' +
          '<span>' + charCount(n.content) + ' 字</span>' +
        '</div>' +
      '</header>' +
      '<div class="md">' + (window.MD ? window.MD.render(n.content) : esc(n.content)) + '</div>' +
      (tags ? '<div class="post-tags">' + tags + '</div>' : '') +
      '<nav class="pager">' +
        (prev ? '<a class="prev" href="#p/' + encodeURIComponent(prev.id) + '"><small>上一篇</small>' + esc(prev.title) + '</a>' : '<span></span>') +
        (next ? '<a class="next" href="#p/' + encodeURIComponent(next.id) + '"><small>下一篇</small>' + esc(next.title) + '</a>' : '') +
      '</nav>';

    document.getElementById('btn-back').onclick = function () { go(''); };

    listEl.classList.add('hidden');
    postEl.classList.remove('hidden');
    document.title = (n.title || '笔记') + ' · 廖恒 · 笔记博客';
    window.scrollTo(0, 0);
  }

  /* ---------------------------------------------------------------- 总渲染 */

  function render() {
    readHash();
    renderSide();

    var n = state.id ? noteById(state.id) : null;
    if (n) {
      renderPost(n);
    } else {
      postEl.classList.add('hidden');
      listEl.classList.remove('hidden');
      renderList();
      document.title = '廖恒 · 笔记博客';
    }
  }

  /* ---------------------------------------------------------------- 事件 */

  var timer = null;
  qEl.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      state.q = qEl.value.trim();
      state.id = '';
      if (location.hash && location.hash.indexOf('#p/') === 0) clearHash();
      postEl.classList.add('hidden');
      listEl.classList.remove('hidden');
      renderSide();
      renderList();
    }, 120);
  });

  catsEl.addEventListener('click', function (e) {
    var b = e.target.closest('.chip');
    if (!b) return;
    var cat = b.getAttribute('data-cat') || '';
    state.month = '';
    if (cat === state.cat) { go(''); return; }
    go('cat/' + encodeURIComponent(cat));
  });

  monthsEl.addEventListener('click', function (e) {
    var a = e.target.closest('a[data-month]');
    if (!a) return;
    e.preventDefault();
    var m = a.getAttribute('data-month');
    if (m === state.month) { state.month = ''; render(); return; }
    state.month = m;
    state.id = '';
    clearHash();
    postEl.classList.add('hidden');
    listEl.classList.remove('hidden');
    renderSide();
    renderList();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && state.id) go('');
    if (e.key === '/' && document.activeElement !== qEl) { e.preventDefault(); qEl.focus(); }
  });

  window.addEventListener('hashchange', render);

  render();
})();
