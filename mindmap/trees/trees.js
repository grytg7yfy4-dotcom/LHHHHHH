/* ============================================================================
 *  导图库 —— 数据在 data.js（由 .xmind 的 content.xml 转出来）
 *  一棵树 = 嵌套 <ul>，每个节点可展开/收起；搜索时剪枝 + 标黄
 * ========================================================================== */
(function () {
  'use strict';

  var DATA = window.TREE_DATA || { maps: [] };
  var MAPS = DATA.maps || [];

  var pickerEl = document.getElementById('picker');
  var treeEl = document.getElementById('tree');
  var rootEl = document.getElementById('rootline');
  var metaEl = document.getElementById('meta');
  var subEl = document.getElementById('sub');
  var qEl = document.getElementById('q');

  var curId = MAPS.length ? MAPS[0].id : '';
  var query = '';

  /* ---------------------------------------------------------------- 工具 */

  function esc(s) {
    return String(s == null ? '' : s).replace(/[&<>"]/g, function (c) {
      return ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c];
    });
  }

  function count(node) {
    var n = 1;
    (node.c || []).forEach(function (k) { n += count(k); });
    return n;
  }

  function byId(id) {
    for (var i = 0; i < MAPS.length; i++) if (MAPS[i].id === id) return MAPS[i];
    return null;
  }

  /* ---------------------------------------------------------------- 构建 */

  // 有搜索词时剪枝：自己命中，或子孙里有命中，才保留
  function build(node, depth) {
    var q = query;
    var kids = [];
    var hit = false;

    if (q) {
      hit = String(node.t || '').toLowerCase().indexOf(q) >= 0;
      (node.c || []).forEach(function (k) {
        var child = build(k, depth + 1);
        if (child) kids.push(child);
      });
      if (!hit && !kids.length) return null;
    } else {
      kids = (node.c || []).map(function (k) { return build(k, depth + 1); });
    }

    var li = document.createElement('li');
    li.setAttribute('data-depth', depth);

    var row = document.createElement('div');
    row.className = 'row';

    var tw = document.createElement('button');
    tw.className = 'tw' + (kids.length ? '' : ' leaf');
    tw.type = 'button';
    tw.textContent = kids.length ? '▸' : '';
    if (kids.length) {
      tw.addEventListener('click', function (e) {
        e.stopPropagation();
        li.classList.toggle('open');
      });
    }

    var t = document.createElement('span');
    t.className = 't';
    if (hit) {
      t.innerHTML = mark(String(node.t), q);
    } else {
      t.textContent = node.t || '(空)';
    }

    row.appendChild(tw);
    row.appendChild(t);
    if (kids.length) {
      var cnt = document.createElement('span');
      cnt.className = 'cnt';
      cnt.textContent = kids.length;
      row.appendChild(cnt);
    }
    li.appendChild(row);

    if (kids.length) {
      var ul = document.createElement('ul');
      kids.forEach(function (k) { ul.appendChild(k); });
      li.appendChild(ul);
    }
    return li;
  }

  function mark(text, q) {
    var low = text.toLowerCase();
    var i = low.indexOf(q);
    if (i < 0) return esc(text);
    return esc(text.slice(0, i)) + '<mark>' + esc(text.slice(i, i + q.length)) + '</mark>' +
      esc(text.slice(i + q.length));
  }

  /* ---------------------------------------------------------------- 渲染 */

  function openByDepth(limit) {
    var all = treeEl.querySelectorAll('li');
    for (var i = 0; i < all.length; i++) {
      var d = +all[i].getAttribute('data-depth');
      all[i].classList.toggle('open', d < limit);
    }
  }

  function render() {
    var map = byId(curId) || MAPS[0];
    if (!map) { treeEl.innerHTML = '<p class="empty">还没有导图数据。</p>'; return; }

    curId = map.id;

    // 顶部选择器
    pickerEl.innerHTML = MAPS.map(function (m) {
      return '<button type="button" data-id="' + esc(m.id) + '" class="' + (m.id === curId ? 'on' : '') + '">' +
        '<b>' + esc(m.title) + '</b>' +
        '<span>' + m.count + ' 节点 · ' + m.depth + ' 层 · ' + esc(m.date) + '</span>' +
        '</button>';
    }).join('');

    // 标题行
    rootEl.innerHTML = esc(map.root.t || map.title) +
      '<small>' + esc(map.file) + ' · ' + map.count + ' 个节点 · 最深 ' + map.depth + ' 层</small>';

    // 树
    var ul = document.createElement('ul');
    (map.root.c || []).forEach(function (k) {
      var li = build(k, 1);
      if (li) ul.appendChild(li);
    });

    if (!ul.children.length) {
      treeEl.innerHTML = '<p class="empty">没搜到「' + esc(query) + '」。</p>';
    } else {
      treeEl.innerHTML = '';
      treeEl.appendChild(ul);
      openByDepth(query ? 99 : 2);
    }

    // 统计
    if (query) {
      var shown = treeEl.querySelectorAll('.row').length;
      metaEl.textContent = '匹配 ' + shown + ' / ' + map.count + ' 个节点';
    } else {
      metaEl.textContent = map.count + ' 个节点 · ' + map.depth + ' 层 · ' + map.date;
    }

    subEl.textContent = MAPS.length + ' 份导图 · 共 ' +
      MAPS.reduce(function (s, m) { return s + m.count; }, 0) + ' 个节点';
    document.title = map.title + ' · 廖恒 · 导图库';

    if (location.hash !== '#t/' + map.id) {
      try { history.replaceState(null, '', '#t/' + map.id); } catch (err) { /* ignore */ }
    }
  }

  /* ---------------------------------------------------------------- 事件 */

  pickerEl.addEventListener('click', function (e) {
    var b = e.target.closest('button[data-id]');
    if (!b) return;
    curId = b.getAttribute('data-id');
    render();
  });

  var timer = null;
  qEl.addEventListener('input', function () {
    clearTimeout(timer);
    timer = setTimeout(function () {
      query = qEl.value.trim().toLowerCase();
      render();
    }, 140);
  });

  document.getElementById('expand').addEventListener('click', function () {
    var all = treeEl.querySelectorAll('li');
    for (var i = 0; i < all.length; i++) all[i].classList.add('open');
  });

  document.getElementById('collapse').addEventListener('click', function () {
    openByDepth(2);
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === '/' && document.activeElement !== qEl) {
      e.preventDefault();
      qEl.focus();
    }
    if (e.key === 'Escape' && document.activeElement === qEl) {
      qEl.value = '';
      query = '';
      render();
    }
  });

  /* ---------------------------------------------------------------- 启动 */

  var m = decodeURIComponent(String(location.hash || '')).match(/#?t\/(.+)$/);
  if (m && byId(m[1])) curId = m[1];

  render();
})();
