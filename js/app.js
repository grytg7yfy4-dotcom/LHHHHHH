/* ============================================================================
 *  页面逻辑：读取 data/*.js 的数据 → 渲染 → 勾选进度存在浏览器 → 可导出进仓库
 * ========================================================================== */
(function () {
  'use strict';

  var PLAN = window.PLAN_DATA || { meta: {}, lines: [], weeks: [], checklist: [] };
  var NOTES = (window.NOTES_DATA || { notes: [] }).notes || [];
  var BASELINE = window.PROGRESS_DATA || {};
  var KEY = 'lh-study-progress-v1';
  var state = { tasks: {}, checklist: {}, lines: {}, updated: '' };

  var $ = function (sel) { return document.querySelector(sel); };
  var esc = function (s) { return MD.esc(s); };

  /* ------------------------------------------------------------ 存储 */

  function load() {
    var local = null;
    try { local = JSON.parse(localStorage.getItem(KEY) || 'null'); } catch (e) { local = null; }
    var base = {
      tasks: BASELINE.tasks || {},
      checklist: BASELINE.checklist || {},
      lines: BASELINE.lines || {}
    };
    var merged = { updated: (local && local.updated) || '' };
    ['tasks', 'checklist', 'lines'].forEach(function (k) {
      merged[k] = Object.assign({}, base[k], (local && local[k]) || {});
    });
    state = merged;
  }

  function save() {
    // 用本地时间，别用 UTC，否则晚上 8 点后显示的日期会跳到"明天"
    var d = new Date();
    var p2 = function (n) { return (n < 10 ? '0' : '') + n; };
    state.updated = d.getFullYear() + '-' + p2(d.getMonth() + 1) + '-' + p2(d.getDate()) +
      ' ' + p2(d.getHours()) + ':' + p2(d.getMinutes());
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* 隐身模式忽略 */ }
    var el = document.getElementById('saved-at');
    if (el) el.textContent = '上次保存 ' + state.updated;
  }

  function toggle(kind, id, on) {
    if (!state[kind]) state[kind] = {};
    if (on) state[kind][id] = true;
    else delete state[kind][id];
    save();
    syncCounters();
  }

  /* ------------------------------------------------------------ 计算 */

  function parseDate(s) {
    var p = String(s).split('-');
    return new Date(+p[0], +p[1] - 1, +p[2]);
  }

  function today0() {
    var n = new Date();
    return new Date(n.getFullYear(), n.getMonth(), n.getDate());
  }

  function allTasks() {
    var a = [];
    PLAN.weeks.forEach(function (w) {
      w.tasks.forEach(function (t) { a.push({ id: t.id, week: w.id }); });
    });
    return a;
  }

  function allLineItems() {
    var a = [];
    PLAN.lines.forEach(function (l) {
      l.items.forEach(function (it) { a.push({ id: it.id, line: l.id }); });
    });
    return a;
  }

  function pct(done, total) { return total ? Math.round(done / total * 100) : 0; }

  function weekDone(w) {
    return w.tasks.filter(function (t) { return state.tasks[t.id]; }).length;
  }

  function currentWeek() {
    var t = today0();
    for (var i = 0; i < PLAN.weeks.length; i++) {
      var w = PLAN.weeks[i];
      if (t >= parseDate(w.start) && t <= parseDate(w.end)) return i;
    }
    if (PLAN.weeks.length && t < parseDate(PLAN.weeks[0].start)) return 0;
    return Math.max(0, PLAN.weeks.length - 1);
  }

  function daysLeft() {
    if (!PLAN.meta.deadline) return 0;
    return Math.ceil((parseDate(PLAN.meta.deadline) - today0()) / 86400000);
  }

  /* ------------------------------------------------------------ 渲染：总览 */

  var R = 76, C = 2 * Math.PI * R;

  function renderHero() {
    var tasks = allTasks();
    var done = tasks.filter(function (t) { return state.tasks[t.id]; }).length;
    var p = pct(done, tasks.length);
    var wi = currentWeek();
    var wk = PLAN.weeks[wi] || { label: '-', title: '-' };
    var dl = daysLeft();

    $('#hero').innerHTML =
      '<div class="ring">' +
        '<svg width="168" height="168" viewBox="0 0 168 168">' +
          '<circle class="track" cx="84" cy="84" r="' + R + '" fill="none" stroke-width="12"></circle>' +
          '<circle class="bar" id="ring-bar" cx="84" cy="84" r="' + R + '" fill="none" stroke-width="12" ' +
            'stroke-dasharray="' + C.toFixed(1) + '" stroke-dashoffset="' + (C * (1 - p / 100)).toFixed(1) + '"></circle>' +
        '</svg>' +
        '<div class="num"><b id="ring-pct">' + p + '%</b><small>总进度</small></div>' +
      '</div>' +
      '<div class="hero-txt">' +
        '<h1>' + esc(PLAN.meta.title || '') + '</h1>' +
        '<p>' + esc(PLAN.meta.tagline || '') + '　起点 ' + esc(PLAN.meta.start || '-') +
          '　交付 ' + esc(PLAN.meta.deadline || '-') + '</p>' +
        '<div class="stats">' +
          '<div class="stat"><b id="stat-done">' + done + '/' + tasks.length + '</b><span>任务完成</span></div>' +
          '<div class="stat"><b id="stat-week">' + esc(wk.label) + '</b><span>当前周</span></div>' +
          '<div class="stat"><b id="stat-days">' + (dl >= 0 ? dl : 0) + '</b><span>距交付（天）</span></div>' +
        '</div>' +
      '</div>';
  }

  function renderLines() {
    var html = '';
    PLAN.lines.forEach(function (l) {
      var done = l.items.filter(function (i) { return state.lines[i.id]; }).length;
      var p = pct(done, l.items.length);
      html += '<div class="line-card">' +
        '<div class="head"><b>' + esc(l.name) + '</b><span>' + esc(l.desc) + '</span>' +
          '<em data-linepct="' + l.id + '">' + done + '/' + l.items.length + '</em></div>' +
        '<div class="bar-mini"><i data-linebar="' + l.id + '" style="width:' + p + '%"></i></div>' +
        l.items.map(function (it) {
          return '<label class="task"><input type="checkbox" data-kind="lines" data-id="' + it.id + '"' +
            (state.lines[it.id] ? ' checked' : '') + '><span>' + esc(it.text) + '</span></label>';
        }).join('') +
        '</div>';
    });
    $('#lines').innerHTML = html;
  }

  function renderThisWeek() {
    var wi = currentWeek();
    var w = PLAN.weeks[wi];
    if (!w) { $('#thisweek').innerHTML = ''; return; }
    $('#thisweek').innerHTML =
      '<div class="week open card" data-week="' + w.id + '">' + weekHead(w) + weekBody(w) + '</div>';
  }

  function weekHead(w) {
    var d = weekDone(w);
    return '<div class="whead">' +
      '<span class="badge">' + esc(w.label) + '</span>' +
      '<span class="wtitle">' + esc(w.title) + '</span>' +
      '<span class="wrange">' + esc(w.range) + '</span>' +
      '<span class="wprog" data-weekprog="' + w.id + '">' + d + '/' + w.tasks.length +
        ' · ' + pct(d, w.tasks.length) + '%</span>' +
      '<span class="caret">▶</span>' +
    '</div>';
  }

  function weekBody(w) {
    return '<div class="wbody">' +
      (w.learn && w.learn !== '—' ? '<div class="pit">要学：' + esc(w.learn) + '</div>' : '') +
      '<div class="accept"><b>验收</b><div>' + esc(w.acceptance) + '</div></div>' +
      w.tasks.map(function (t) {
        return '<label class="task"><input type="checkbox" data-kind="tasks" data-id="' + t.id + '"' +
          (state.tasks[t.id] ? ' checked' : '') + '><span>' + esc(t.text) + '</span></label>';
      }).join('') +
      (w.pitfalls && w.pitfalls.length
        ? '<div class="pit">常见坑：<ul>' + w.pitfalls.map(function (p) {
            return '<li>' + esc(p) + '</li>';
          }).join('') + '</ul></div>'
        : '') +
    '</div>';
  }

  function renderWeeks() {
    $('#weeks').innerHTML = PLAN.weeks.map(function (w) {
      return '<div class="week card" data-week="' + w.id + '">' + weekHead(w) + weekBody(w) + '</div>';
    }).join('');
  }

  function renderChecklist() {
    var done = PLAN.checklist.filter(function (c) { return state.checklist[c.id]; }).length;
    $('#checklist-pct').textContent = done + '/' + PLAN.checklist.length +
      '（' + pct(done, PLAN.checklist.length) + '%）';
    $('#checklist').innerHTML = PLAN.checklist.map(function (c) {
      return '<label class="task"><input type="checkbox" data-kind="checklist" data-id="' + c.id + '"' +
        (state.checklist[c.id] ? ' checked' : '') + '><span>' + esc(c.text) + '</span></label>';
    }).join('');
  }

  /* ------------------------------------------------------------ 计数同步 */

  function syncCounters() {
    var tasks = allTasks();
    var done = tasks.filter(function (t) { return state.tasks[t.id]; }).length;
    var p = pct(done, tasks.length);
    var bar = $('#ring-bar');
    if (bar) {
      bar.setAttribute('stroke-dashoffset', (C * (1 - p / 100)).toFixed(1));
      $('#ring-pct').textContent = p + '%';
      $('#stat-done').textContent = done + '/' + tasks.length;
    }
    document.querySelectorAll('[data-weekprog]').forEach(function (el) {
      var id = el.getAttribute('data-weekprog');
      var w = PLAN.weeks.filter(function (x) { return x.id === id; })[0];
      if (!w) return;
      var d = weekDone(w);
      el.textContent = d + '/' + w.tasks.length + ' · ' + pct(d, w.tasks.length) + '%';
    });
    PLAN.lines.forEach(function (l) {
      var d = l.items.filter(function (i) { return state.lines[i.id]; }).length;
      var em = document.querySelector('[data-linepct="' + l.id + '"]');
      var b = document.querySelector('[data-linebar="' + l.id + '"]');
      if (em) em.textContent = d + '/' + l.items.length;
      if (b) b.style.width = pct(d, l.items.length) + '%';
    });
    var cdone = PLAN.checklist.filter(function (c) { return state.checklist[c.id]; }).length;
    var cp = $('#checklist-pct');
    if (cp) cp.textContent = cdone + '/' + PLAN.checklist.length + '（' + pct(cdone, PLAN.checklist.length) + '%）';
  }

  /* ------------------------------------------------------------ 笔记 */

  var noteQuery = '';
  var noteCat = '';

  function renderNoteFilters() {
    var cats = [];
    NOTES.forEach(function (n) { if (cats.indexOf(n.category) < 0) cats.push(n.category); });
    $('#note-cat').innerHTML = '<option value="">全部分类</option>' +
      cats.map(function (c) { return '<option value="' + esc(c) + '">' + esc(c) + '</option>'; }).join('');
  }

  function renderNotes() {
    var q = noteQuery.trim().toLowerCase();
    var list = NOTES.filter(function (n) {
      if (noteCat && n.category !== noteCat) return false;
      if (!q) return true;
      return (n.title + ' ' + n.content + ' ' + (n.tags || []).join(' ')).toLowerCase().indexOf(q) > -1;
    }).sort(function (a, b) { return a.date < b.date ? 1 : -1; });

    if (!list.length) {
      $('#notes').innerHTML = '<p class="hint">没有匹配的笔记。</p>';
      return;
    }

    var html = '';
    var month = '';
    list.forEach(function (n) {
      var m = String(n.date).slice(0, 7);
      if (m !== month) {
        month = m;
        html += '<div class="month">' + esc(m.replace('-', ' 年 ')) + ' 月</div>';
      }
      html += '<div class="note card tight" data-note="' + esc(n.id) + '">' +
        '<div class="nhead">' +
          '<h3>' + esc(n.title) + '</h3>' +
          '<span class="date">' + esc(n.date) + '</span>' +
          '<span class="cat">' + esc(n.category) + '</span>' +
        '</div>' +
        '<button class="more">展开阅读</button>' +
        '<div class="body md">' + MD.render(n.content) + '</div>' +
        (n.tags && n.tags.length
          ? '<div class="tags">' + n.tags.map(function (t) {
              return '<span class="tag">#' + esc(t) + '</span>';
            }).join('') + '</div>'
          : '') +
      '</div>';
    });
    $('#notes').innerHTML = html;
    $('#note-count').textContent = '共 ' + list.length + ' 篇';
  }

  /* ------------------------------------------------------------ 导入导出 */

  function toast(msg) {
    var t = $('#toast');
    t.textContent = msg;
    t.classList.add('show');
    clearTimeout(toast._t);
    toast._t = setTimeout(function () { t.classList.remove('show'); }, 2600);
  }

  function download(name, text) {
    var blob = new Blob([text], { type: 'text/javascript;charset=utf-8' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 1500);
  }

  function exportProgress() {
    var stamp = new Date().toISOString().slice(0, 16).replace('T', ' ');
    var head = '/* 导出于 ' + stamp + ' —— 覆盖仓库里的 data/progress.js 然后提交，进度就存住了。 */\n';
    download('progress.js', head + 'window.PROGRESS_DATA = ' + JSON.stringify(state, null, 2) + ';\n');
    toast('已下载 progress.js，覆盖 data/progress.js 后提交');
  }

  function importProgress(file) {
    var fr = new FileReader();
    fr.onload = function () {
      try {
        var t = String(fr.result)
          .replace(/\/\*[\s\S]*?\*\//g, '')
          .replace(/^\s*\/\/.*$/gm, '')
          .replace(/window\.PROGRESS_DATA\s*=\s*/, '')
          .replace(/;\s*$/, '');
        var obj = JSON.parse(t);
        ['tasks', 'checklist', 'lines'].forEach(function (k) {
          state[k] = Object.assign({}, state[k], obj[k] || {});
        });
        save();
        syncCounters();
        ['tasks', 'checklist', 'lines'].forEach(function (k) {
          document.querySelectorAll('[data-kind="' + k + '"]').forEach(function (el) {
            el.checked = !!state[k][el.getAttribute('data-id')];
          });
        });
        toast('进度已导入');
      } catch (e) {
        toast('导入失败：文件格式不对');
      }
    };
    fr.readAsText(file);
  }

  /* ------------------------------------------------------------ 路由 */

  var VIEWS = ['progress', 'plan', 'notes', 'about'];

  function route() {
    var h = (location.hash || '#/').replace('#/', '').replace('#', '') || 'progress';
    if (VIEWS.indexOf(h) < 0) h = 'progress';
    VIEWS.forEach(function (v) {
      var el = document.getElementById('view-' + v);
      if (el) el.classList.toggle('hidden', v !== h);
    });
    document.querySelectorAll('nav.tabs a').forEach(function (a) {
      a.classList.toggle('on', a.getAttribute('data-view') === h);
    });
    window.scrollTo(0, 0);
  }

  /* ------------------------------------------------------------ 事件 */

  document.addEventListener('change', function (e) {
    var el = e.target;
    if (el.matches && el.matches('input[type=checkbox][data-kind]')) {
      toggle(el.getAttribute('data-kind'), el.getAttribute('data-id'), el.checked);
    }
  });

  document.addEventListener('click', function (e) {
    var head = e.target.closest('.whead');
    if (head) {
      head.parentElement.classList.toggle('open');
      return;
    }
    var more = e.target.closest('.note .more');
    if (more) {
      var note = more.parentElement;
      note.classList.toggle('open');
      more.textContent = note.classList.contains('open') ? '收起' : '展开阅读';
    }
  });

  window.addEventListener('hashchange', route);

  document.addEventListener('DOMContentLoaded', function () {
    load();
    renderHero();
    renderLines();
    renderThisWeek();
    renderWeeks();
    renderChecklist();
    renderNoteFilters();
    renderNotes();
    syncCounters();
    route();

    $('#btn-export').addEventListener('click', exportProgress);
    $('#btn-export2').addEventListener('click', exportProgress);
    $('#btn-import').addEventListener('click', function () { $('#file-import').click(); });
    $('#file-import').addEventListener('change', function (e) {
      if (e.target.files && e.target.files[0]) importProgress(e.target.files[0]);
    });
    $('#btn-reset').addEventListener('click', function () {
      if (!confirm('清空所有勾选（不影响已导出的 progress.js）？')) return;
      state = { tasks: {}, checklist: {}, lines: {}, updated: '' };
      save();
      location.reload();
    });
    $('#note-q').addEventListener('input', function (e) {
      noteQuery = e.target.value;
      renderNotes();
    });
    $('#note-cat').addEventListener('change', function (e) {
      noteCat = e.target.value;
      renderNotes();
    });

    var u = state.updated || BASELINE.updated;
    $('#saved-at').textContent = u ? '上次保存 ' + u : '还没有保存过进度';
  });
})();
