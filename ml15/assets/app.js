/* ============================================================================
 *  ML15 渲染器 —— 首页 / 分集页 / 速查表 / 学习记录，全部由 course-data.js 驱动
 * ========================================================================== */
(function () {
  'use strict';

  const C = window.ML15_COURSE || { episodes: [], modules: [] };
  const PKEY = 'ml15.progress.v1';
  const TKEY = 'ml15.theme';
  const MOD = {};
  (C.modules || []).forEach(m => { MOD[m.id] = m; });

  /* ---------------- 工具 ---------------- */
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = s => String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  const fmtSec = s => { s = Math.max(0, Math.round(s)); const h = Math.floor(s / 3600), m = Math.floor(s % 3600 / 60), x = s % 60; return h ? `${h} 小时 ${m} 分` : m ? `${m} 分 ${x} 秒` : `${x} 秒`; };
  const mmss = s => { s = Math.max(0, Math.round(s)); const m = Math.floor(s / 60), x = s % 60; return m + ':' + String(x).padStart(2, '0'); };
  const fmtMin = s => (Math.round(s / 60) + ' 分钟');
  const fmtDate = ts => { const d = new Date(ts); return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; };
  const fmtDT = ts => { const d = new Date(ts); return `${fmtDate(ts)} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`; };
  const COLORS = { intro: '#0ea5e9', regression: '#16a34a', classification: '#d97706', ensemble: '#dc2626', unsupervised: '#7c3aed', summary: '#0d9488' };
  const colOf = no => { const e = epOf(no); return COLORS[(e && e.module) || 'intro'] || '#2563eb'; };
  const epOf = no => C.episodes.find(e => +e.no === +no);

  // 极简行内 Markdown：**粗体**、`代码`、[链接](url)，并放行少量排版标签
  const RICH_TAGS = /&lt;(\/?)(sub|sup|b|i|br|span)&gt;/g;
  function inline(s) {
    let t = esc(s);
    t = t.replace(RICH_TAGS, '<$1$2>');
    t = t.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    t = t.replace(/`([^`]+)`/g, '<code>$1</code>');
    t = t.replace(/\[([^\]]+)\]\((https?:[^)]+)\)/g, (m, a, u) => `<a href="${esc(u)}" target="_blank" rel="noopener">${a}</a>`);
    return t;
  }
  const paras = s => String(s || '').split(/\n{2,}/).map(p => p.trim()).filter(Boolean).map(p => `<p>${inline(p).replace(/\n/g, '<br>')}</p>`).join('');

  /* ---------------- 进度存储 ---------------- */
  let progress = { done: {}, updated: '' };
  try { progress = Object.assign(progress, JSON.parse(localStorage.getItem(PKEY) || '{}')); } catch (e) { }
  if (!progress.done) progress.done = {};
  const LOG = (window.ML15_LOG && window.ML15_LOG.entries) || (C.log && C.log.entries) || [];
  const logByNo = {};
  LOG.forEach(en => { if (en && en.no) logByNo[en.no] = en; });
  const isDone = no => !!progress.done[no] || !!logByNo[no];
  function saveProgress() { progress.updated = new Date().toISOString(); try { localStorage.setItem(PKEY, JSON.stringify(progress)); } catch (e) { } }
  const doneCount = () => C.episodes.filter(e => isDone(e.no)).length;
  const doneSec = () => C.episodes.filter(e => isDone(e.no)).reduce((s, e) => s + e.duration, 0);

  /* ---------------- 主题 ---------------- */
  (function initTheme() {
    let t = null;
    try { t = new URLSearchParams(location.search).get('theme') || localStorage.getItem(TKEY); } catch (e) { }
    if (t !== 'dark' && t !== 'light') t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    document.documentElement.dataset.theme = t;
  })();
  function toggleTheme() {
    const t = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    document.documentElement.dataset.theme = t;
    try { localStorage.setItem(TKEY, t); } catch (e) { }
  }

  /* ---------------- 公共框架 ---------------- */
  function topbar(active) {
    const nav = [
      ['home', '课程首页', './index.html'],
      ['cheat', '速查表', './cheatsheet.html'],
      ['log', '学习记录', './learn-log.html'],
      ['ml', '吴恩达 ML', '../ml/'],
      ['map', '知识地图', '../mindmap/'],
      ['blog', '博客', '../blog/']
    ];
    return `<header class="topbar"><div class="inner">
      <a class="brand" href="./index.html"><span class="logo">ML</span>
        <span>机器学习 15 讲<small> · 图解笔记</small></span></a>
      <nav class="topnav">
        ${nav.map(([k, t, u]) => `<a href="${u}" class="${active === k ? 'on' : ''}${k === 'ml' || k === 'map' || k === 'blog' ? ' hide-m' : ''}">${t}</a>`).join('')}
        <button class="iconbtn" id="themeBtn" title="切换深色 / 浅色" aria-label="切换主题">◐</button>
      </nav></div></header><div class="readbar" id="readbar"></div>`;
  }
  function footer() {
    return `<footer class="site"><div class="inner">
      <span>内容整理自 B 站 <a href="${C.meta.seasonUrl}" target="_blank" rel="noopener">@${esc(C.meta.up)}《机器学习》</a> · 15 集 / ${Math.floor(C.meta.totalSec / 3600)} 小时 ${Math.round(C.meta.totalSec % 3600 / 60)} 分 · 仅供学习交流</span>
      <span>${esc(C.meta.owner)} · <a href="${C.meta.repo}" target="_blank" rel="noopener">GitHub 仓库</a> · 建议配合原视频食用</span>
    </div></footer>`;
  }
  function shell(active, inner) {
    $('#app').innerHTML = topbar(active) + inner + footer() + '<button class="totop" id="toTop" aria-label="回到顶部" title="回到顶部">↑</button>';
    $('#themeBtn').addEventListener('click', toggleTheme);
    // 阅读进度条 + 回到顶部
    const bar = $('#readbar'), toTop = $('#toTop');
    const onScroll = () => {
      const h = document.documentElement.scrollHeight - innerHeight;
      bar.style.width = h > 0 ? Math.min(100, scrollY / h * 100) + '%' : '0';
      toTop.classList.toggle('show', scrollY > 700);
    };
    addEventListener('scroll', onScroll, { passive: true }); onScroll();
    toTop.addEventListener('click', () => scrollTo({ top: 0, behavior: 'smooth' }));
    // 数字键快捷跳转
    document.addEventListener('keydown', e => {
      if (e.target.matches('input,textarea')) return;
      if (e.key === '/') { const q = $('.searchbox input'); if (q) { e.preventDefault(); q.focus(); } }
    });
  }
  function hydrateFigures(root) {
    $$('[data-fig]', root || document).forEach(el => {
      if (el.dataset.rendered) return;
      el.dataset.rendered = '1';
      window.ML15FIG.render(el.dataset.fig, el);
    });
  }

  /* ---------------- 首页 ---------------- */
  function pageHome() {
    const total = C.meta.totalSec;
    const concepts = C.episodes.reduce((s, e) => s + (e.concepts || []).length, 0);
    const pct = Math.round(doneCount() / C.episodes.length * 100);
    const modsHtml = (C.modules || []).map(m => {
      const eps = C.episodes.filter(e => e.module === m.id);
      return `<a class="mchip" href="#mod-${m.id}" style="--mc:${COLORS[m.id]}">
        <span class="dot"></span><b>${esc(m.name)}</b><span>${eps.length} 集 · ${Math.round(eps.reduce((s, e) => s + e.duration, 0) / 60)} 分</span></a>`;
    }).join('');

    const groups = (C.modules || []).map(m => {
      const eps = C.episodes.filter(e => e.module === m.id);
      if (!eps.length) return '';
      return `<div class="modgroup" id="mod-${m.id}" style="--mc:${COLORS[m.id]}">
        <div class="modgroup-head"><h3>${esc(m.name)}<span class="tag">${eps.length} 集 · ${Math.round(eps.reduce((s, e) => s + e.duration, 0) / 60)} 分钟</span></h3><span class="line"></span></div>
        <div class="epgrid">${eps.map(epCard).join('')}</div></div>`;
    }).join('');

    shell('home', `
    <main>
      <section class="hero"><div class="wrap"><div class="hero-grid">
        <div>
          <span class="kicker">B 站 · 谦行AIing · 15 集全</span>
          <h1>会 <span class="grad">if…else</span><br>就能懂的机器学习</h1>
          <p class="lead">从「什么是智能」到「决策树、随机森林、XGBoost、K-Means、PCA」——把 15 集视频拆成 15 页知识笔记、${concepts} 个知识点、20+ 张示意图，配公式、代码、易错点和自测题。看完能讲清楚，也能上手调包。</p>
          <div class="hero-meta">
            <span class="pill">总时长 <b>${fmtSec(total)}</b></span>
            <span class="pill">知识点 <b>${concepts}</b> 个</span>
            <span class="pill">难度 <b>入门 → 进阶</b></span>
            <span class="pill">配套 <b>公式 · 代码 · 自测</b></span>
          </div>
          <div class="hero-actions">
            <a class="btn primary" href="./ep01.html">从第 1 集开始 →</a>
            <a class="btn" href="./cheatsheet.html">📋 速查表</a>
            <a class="btn ghost" href="${C.meta.seasonUrl}" target="_blank" rel="noopener">在 B 站看原片 ↗</a>
          </div>
        </div>
        <div class="hero-art"><div class="frame"><div data-fig="fig-hero" style="color:${COLORS.intro}"></div>
          <div class="cap">同一份数据：左边学出「边界」，右边学出「规则」——这就是机器学习</div></div></div>
      </div>

      <div class="stats">
        <div class="stat"><b>${C.episodes.length}</b><span>集视频</span></div>
        <div class="stat"><b>${Math.round(total / 60)}</b><span>分钟总时长</span></div>
        <div class="stat"><b>${concepts}</b><span>个知识卡</span></div>
        <div class="stat"><b>${pct}%</b><span>我的学习进度</span><div class="bar"><i style="width:${pct}%"></i></div></div>
      </div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="sec-head"><h2><span class="no">MAP</span>课程地图</h2>
        <p>6 个模块、15 集，按依赖顺序排好了，别跳着看</p></div>
      <div class="modrail">${modsHtml}</div>
      <div class="mapcard"><div data-fig="fig-course-map"></div></div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="progress-panel">
        <div class="ring">${ringSvg(pct)}<div class="pct">${pct}%<small>完成</small></div></div>
        <div class="progress-info">
          <h3>我的学习进度</h3>
          <p>进度存在浏览器本地，换设备会丢；学完一集在分集页点「标记已学完」。</p>
          <div class="pbar"><i style="width:${pct}%"></i></div>
          <div class="progress-nums">
            <span>已学 <b>${doneCount()}</b> / ${C.episodes.length} 集</span>
            <span>已投入 <b>${fmtSec(doneSec())}</b></span>
            <span>剩余 <b>${fmtSec(total - doneSec())}</b></span>
            <a href="./learn-log.html">查看学习记录 →</a>
          </div>
        </div>
      </div>
    </div></section>

    <section class="block"><div class="wrap">
      <div class="sec-head"><h2><span class="no">15 集</span>按顺序学</h2>
        <div class="searchbox"><span class="ic">⌕</span><input id="epq" type="search" placeholder="搜分集：决策树 / 正则化 / K-Means …"><kbd>/</kbd><span class="searchhit" id="ephit"></span></div></div>
      ${groups}
      <div class="empty" id="nores" style="display:none">没有匹配的分集，换个关键词试试。</div>
    </div></section>
    </main>`);
    hydrateFigures();
    $('#epq').addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase();
      let hit = 0;
      $$('.epcard').forEach(card => {
        const txt = card.dataset.search;
        const ok = !q || txt.includes(q);
        card.style.display = ok ? '' : 'none'; if (ok) hit++;
      });
      $$('.modgroup').forEach(g => {
        const any = $$('.epcard', g).some(c => c.style.display !== 'none');
        g.style.display = any ? '' : 'none';
      });
      $('#nores').style.display = hit ? 'none' : 'block';
      $('#ephit').textContent = q ? `命中 ${hit} 集` : '';
    });
  }

  function ringSvg(pct) {
    const r = 52, c = 2 * Math.PI * r, off = c * (1 - pct / 100);
    return `<svg width="128" height="128" viewBox="0 0 128 128">
      <circle cx="64" cy="64" r="${r}" fill="none" stroke="var(--line)" stroke-width="9"/>
      <circle cx="64" cy="64" r="${r}" fill="none" stroke="url(#rg)" stroke-width="9" stroke-linecap="round"
        stroke-dasharray="${c}" stroke-dashoffset="${off}"/>
      <defs><linearGradient id="rg" x1="0" y1="0" x2="1" y2="1">
        <stop offset="0" stop-color="#2563eb"/><stop offset="1" stop-color="#7c3aed"/></linearGradient></defs></svg>`;
  }

  function epCard(e) {
    const col = COLORS[e.module];
    const search = [e.title, e.short, (e.tags || []).join(' '), e.oneLiner, (e.concepts || []).map(c => c.h).join(' ')].join(' ').toLowerCase();
    return `<a class="epcard ${isDone(e.no) ? 'is-done' : ''}" href="./ep${String(e.no).padStart(2, '0')}.html"
      style="--mc:${col}" data-search="${esc(search)}">
      <div class="row1"><span class="num">EP ${String(e.no).padStart(2, '0')}</span><span class="dur">${fmtMin(e.duration)}</span></div>
      <h4>${esc(e.short || e.title)}</h4>
      <p>${esc(e.oneLiner)}</p>
      <div class="foot">
        <span class="chip">${(e.concepts || []).length} 个知识点</span>
        ${(e.tags || []).slice(0, 2).map(t => `<span class="chip">${esc(t)}</span>`).join('')}
        <span class="done-dot">✓ 已学</span>
      </div>
    </a>`;
  }

  /* ---------------- 分集页 ---------------- */
  function pageEpisode() {
    const no = +document.body.dataset.ep;
    const e = epOf(no);
    if (!e) { location.replace('./index.html'); return; }
    const col = COLORS[e.module], mod = MOD[e.module] || {};
    const prev = epOf(no - 1), next = epOf(no + 1);
    const chapters = (e.chapters || []).map(ch =>
      `<a class="chap" target="_blank" rel="noopener" href="https://www.bilibili.com/video/${e.bvid}?t=${ch.from}">
        <time>${mmss(ch.from)}</time><span>${esc(ch.title)}</span></a>`).join('');
    const toc = (e.concepts || []).map((c, i) =>
      `<a href="#c-${i}" data-toc="${i}">${i + 1}. ${esc(c.h)}</a>`).join('');

    const concepts = (e.concepts || []).map((c, i) => conceptHtml(c, i, col)).join('');
    const quiz = (e.quiz || []).map((q, i) => `
      <div class="q"><div class="qh"><span class="n">${i + 1}</span><span>${inline(q.q)}</span></div>
        <button class="reveal" type="button">显示答案</button>
        <div class="ans"><b>答：</b>${inline(q.a)}${q.why ? `<span class="why">💡 ${inline(q.why)}</span>` : ''}</div></div>`).join('');

    shell('ep', `
    <main>
      <div class="pagehead" style="--mc:${col}"><div class="wrap">
        <div class="crumbs"><a href="./index.html">机器学习 15 讲</a><span>/</span><span>${esc(mod.name || '')}</span><span>/</span><span>第 ${no} 集</span></div>
        <h1>EP ${String(no).padStart(2, '0')} · ${esc(e.title)}</h1>
        <p class="sub">${esc(e.oneLiner)}</p>
        <div class="meta-row">
          <span class="mchip2 mc">${esc(mod.name || '')}</span>
          <span class="mchip2">⏱ 时长 <b>${fmtSec(e.duration)}</b></span>
          <span class="mchip2">📚 知识点 <b>${(e.concepts || []).length}</b> 个</span>
          <span class="mchip2">🎬 <a href="${C.meta.seasonUrl}" target="_blank" rel="noopener">B 站原片</a> <b>${e.bvid}</b></span>
        </div>
        ${chapters ? `<div class="chaps">${chapters}</div>` : ''}
      </div></div>

      <div class="wrap"><div class="doc" style="--mc:${col}">
        <aside class="toc">
          <div class="t">本集目录</div>
          ${toc}
          <div class="sep"></div>
          <a href="#quiz">📝 自测题</a>
          <a href="./learn-log.html">📈 学习记录</a>
          <div class="sep"></div>
          <div class="mini">章节按钮可直接跳到 B 站对应时间点；键盘 ← / → 切换上下集。</div>
        </aside>

        <article class="content">
          <div class="leadcard">
            <div class="lab">一句话讲透</div>
            <p>${inline(e.core || e.oneLiner)}</p>
            ${(e.takeaways || []).length ? `<ul class="takeaways">${e.takeaways.map(t => `<li>${inline(t)}</li>`).join('')}</ul>` : ''}
          </div>

          ${concepts}

          <div class="quiz" id="quiz"><h3 style="margin:0 0 4px;font-size:19px">📝 本集自测</h3>
            <p style="margin:0 0 6px;color:var(--muted);font-size:12.5px">先别翻答案，能用自己的话讲出来再点开。</p>
            ${quiz || '<div class="empty">本集暂无自测题</div>'}</div>

          <div class="donebar ${isDone(no) ? 'is-done' : ''}" id="donebar">
            <span class="txt">学完这集了？点右边标记，进度会记在这台浏览器里。</span>
            <span class="is-done">✓ 已学完 ${progress.done[no] ? fmtDate(progress.done[no]) : (logByNo[no] ? '（B 站记录 ' + logByNo[no].date + '）' : '')}</span>
            <button class="btn ${progress.done[no] ? '' : 'primary'} sm" id="doneBtn">${progress.done[no] ? '取消标记' : '标记已学完'}</button>
          </div>

          <div class="prevnext">
            ${prev ? `<a href="./ep${String(prev.no).padStart(2, '0')}.html"><div class="dir">← 上一集</div><div class="t">${esc(prev.short)}</div></a>` : '<span></span>'}
            ${next ? `<a class="next" href="./ep${String(next.no).padStart(2, '0')}.html"><div class="dir">下一集 →</div><div class="t">${esc(next.short)}</div></a>` : '<span></span>'}
          </div>
        </article>
      </div></div>
    </main>`);
    hydrateFigures();
    document.title = `EP${String(no).padStart(2, '0')} ${e.title} · 机器学习 15 讲`;

    // 目录高亮
    const links = $$('.toc a[data-toc]');
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          links.forEach(a => a.classList.toggle('on', a.dataset.toc === en.target.id.replace('c-', '')));
        }
      });
    }, { rootMargin: '-15% 0px -70% 0px' });
    $$('.concept', $('.content')).forEach(c => io.observe(c));
    links.forEach(a => a.addEventListener('click', ev => { ev.preventDefault(); $('#' + a.getAttribute('href').slice(1)).scrollIntoView({ behavior: 'smooth' }); }));

    // 自测展开
    $$('.quiz .reveal').forEach(b => b.addEventListener('click', () => b.closest('.q').classList.add('open')));

    // 标记完成
    $('#doneBtn').addEventListener('click', () => {
      if (progress.done[no]) delete progress.done[no];
      else progress.done[no] = Date.now();
      saveProgress();
      location.reload();
    });

    // ← / → 切换上下集
    addEventListener('keydown', e => {
      if (e.target.matches('input,textarea,select')) return;
      if (e.key === 'ArrowLeft' && prev) location.href = `./ep${String(prev.no).padStart(2, '0')}.html`;
      if (e.key === 'ArrowRight' && next) location.href = `./ep${String(next.no).padStart(2, '0')}.html`;
    });
  }

  function conceptHtml(c, i, col) {
    const parts = [];
    if (c.lead) parts.push(`<div class="lead">${inline(c.lead)}</div>`);
    if (c.body) parts.push(paras(c.body));
    if (c.formula) {
      const f = typeof c.formula === 'string' ? { f: c.formula } : c.formula;
      parts.push(`<div class="formula"><div class="f">${inline(f.f)}</div>${f.n ? `<div class="n">${inline(f.n)}</div>` : ''}</div>`);
    }
    if (c.list && c.list.length) parts.push(`<ul>${c.list.map(x => `<li>${inline(x)}</li>`).join('')}</ul>`);
    if (c.table && c.table.head) {
      parts.push(`<div class="tablewrap"><table><thead><tr>${c.table.head.map(h => `<th>${inline(h)}</th>`).join('')}</tr></thead>
        <tbody>${c.table.rows.map(r => `<tr>${r.map(x => `<td>${inline(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>`);
    }
    if (c.code && c.code.src) {
      parts.push(`<div class="codeblock"><div class="hd"><span class="lang">${esc(c.code.lang || 'python')}</span><span>${esc(c.code.title || '')}</span>
        <button class="cp" type="button">复制</button></div><pre><code>${esc(c.code.src)}</code></pre></div>`);
    }
    if (c.fig) parts.push(`<div class="figure" style="color:${col}"><div class="fv" data-fig="${c.fig}"></div>${c.figCap ? `<div class="cap">${inline(c.figCap)}</div>` : ''}</div>`);
    if (c.pitfall) parts.push(`<div class="callout warn"><span class="ic">⚠</span><div><b>易错点：</b>${inline(c.pitfall)}</div></div>`);
    if (c.tip) parts.push(`<div class="callout tip"><span class="ic">💡</span><div><b>记忆技巧：</b>${inline(c.tip)}</div></div>`);
    if (c.note) parts.push(`<div class="callout note"><span class="ic">📌</span><div>${inline(c.note)}</div></div>`);
    return `<section class="concept" id="c-${i}">
      <h3><span class="idx">${String(i + 1).padStart(2, '0')}</span>${esc(c.h)}</h3>
      ${parts.join('\n')}</section>`;
  }

  /* ---------------- 速查表 ---------------- */
  function pageCheat() {
    const items = C.cheatsheet || [];
    shell('cheat', `<main><div class="pagehead"><div class="wrap">
      <div class="crumbs"><a href="./index.html">机器学习 15 讲</a><span>/</span><span>速查表</span></div>
      <h1>一页速查 · 公式、参数、选型</h1>
      <p class="sub">考前 / 面试前翻这一页。每个公式都给了「什么时候用」和「最容易错的地方」。</p>
      <div class="searchbox"><span class="ic">⌕</span><input id="cq" type="search" placeholder="搜：正则化 / 召回率 / 肘部法 …"><kbd>/</kbd></div>
    </div></div>
    <div class="wrap"><div class="cheat-grid" id="cheatGrid">
      ${items.map(g => `<div class="cheat-card ${g.wide ? 'cheat-wide' : ''}" data-search="${esc((g.h + ' ' + (g.bullets || []).join(' ') + (g.formulas || []).join(' ')).toLowerCase())}">
        <h3 style="color:var(--accent)">${esc(g.h)}</h3>
        ${(g.formulas || []).map(f => `<div class="formula"><div class="f">${inline(f)}</div></div>`).join('')}
        ${(g.table && g.table.head) ? `<div class="tablewrap"><table><thead><tr>${g.table.head.map(h => `<th>${inline(h)}</th>`).join('')}</tr></thead><tbody>${g.table.rows.map(r => `<tr>${r.map(x => `<td>${inline(x)}</td>`).join('')}</tr>`).join('')}</tbody></table></div>` : ''}
        ${(g.bullets || []).length ? `<ul>${g.bullets.map(b => `<li>${inline(b)}</li>`).join('')}</ul>` : ''}
      </div>`).join('')}
    </div>
    <div class="empty" id="cnores" style="display:none">没有匹配内容。</div>
    </div></main>`);
    $('#cq').addEventListener('input', e => {
      const q = e.target.value.trim().toLowerCase(); let hit = 0;
      $$('.cheat-card').forEach(c => { const ok = !q || c.dataset.search.includes(q); c.style.display = ok ? '' : 'none'; if (ok) hit++; });
      $('#cnores').style.display = hit ? 'none' : 'block';
    });
  }

  /* ---------------- 学习记录 ---------------- */
  function pageLog() {
    const total = C.meta.totalSec;
    const done = doneCount();
    const pct = Math.round(done / C.episodes.length * 100);
    const doneT = doneSec();
    const entries = (C.log && C.log.entries) || [];
    const timeline = entries.length ? entries.map(en => `<div class="tl" style="--mc:${COLORS[en.module] || '#2563eb'}">
        <div class="when">${esc(en.date)}${en.time ? ' · ' + esc(en.time) : ''}</div>
        <div class="what">${esc(en.title)}</div>
        <div class="detail">${inline(en.detail || '')}</div></div>`).join('')
      : (C.episodes || []).slice().sort((a, b) => (a.publish < b.publish ? 1 : -1)).map(e => `<div class="tl" style="--mc:${COLORS[e.module]}">
        <div class="when">${esc(e.publish || '')} · 课程更新</div>
        <div class="what">EP${String(e.no).padStart(2, '0')} ${esc(e.short)}</div>
        <div class="detail">时长 ${fmtSec(e.duration)} · ${esc((MOD[e.module] || {}).name || '')}</div></div>`).join('')
        + `<div class="mini" style="padding:8px 0 0;color:var(--muted);font-size:11.5px">以上是课程发布时间线；用下方脚本同步 B 站观看记录后，这里会换成你的真实学习时间轴。</div>`;

    const rows = C.episodes.map(e => {
      const d = progress.done[e.no], rec = logByNo[e.no];
      const when = d ? '✓ ' + fmtDate(d) : rec ? '✓ ' + rec.date : '—';
      return `<tr class="${isDone(e.no) ? 'done' : ''}" style="--mc:${COLORS[e.module]}">
        <td>EP${String(e.no).padStart(2, '0')}</td>
        <td><a href="./ep${String(e.no).padStart(2, '0')}.html">${esc(e.short)}</a></td>
        <td><span class="chip" style="font-size:11px;color:${COLORS[e.module]}">${esc((MOD[e.module] || {}).name || '')}</span></td>
        <td class="num">${Math.round(e.duration / 60)} 分</td>
        <td class="num">${when}</td></tr>`;
    }).join('');

    shell('log', `<main><div class="pagehead"><div class="wrap">
      <div class="crumbs"><a href="./index.html">机器学习 15 讲</a><span>/</span><span>学习记录</span></div>
      <h1>学习记录 · 时间与投入</h1>
      <p class="sub">把 B 站合集里的观看时间同步到这里：每集看了多少、什么时候看的、累计投入多少小时。数据保存在仓库的 <code>data/learnlog.js</code> 里，换设备也在。</p>
    </div></div>

    <div class="wrap"><div class="loghero">
      <div class="logsum">
        <div style="font-size:12px;color:var(--muted);letter-spacing:1px;font-weight:700">累计学习时长</div>
        <div class="big">${Math.floor(doneT / 3600)}<small> 小时 </small>${Math.round(doneT % 3600 / 60)}<small> 分</small></div>
        <div class="pbar"><i style="width:${pct}%"></i></div>
        <div class="rows">
          <div><b>${done}/${C.episodes.length}</b><span>完成集数</span></div>
          <div><b>${pct}%</b><span>课程进度</span></div>
          <div><b>${Math.round(total / 60)} 分</b><span>课程总时长</span></div>
        </div>
      </div>
      <div class="logsum">
        <div style="font-size:12px;color:var(--muted);letter-spacing:1px;font-weight:700">学习时间轴</div>
        <div class="timeline" style="max-height:230px;overflow:auto;padding-top:8px">${timeline}</div>
      </div>
    </div>

    <section class="block"><div class="sec-head"><h2><span class="no">SYNC</span>同步 B 站观看记录</h2><p>只读你自己的观看历史，不上传账号</p></div>
      <div class="syncbox">
        <h3>方式一：本地脚本（推荐，真实观看时间）</h3>
        <p>在电脑上运行仓库里的 <code>工具/同步B站学习记录.py</code>（需要 B 站 SESSDATA，只读观看历史、不碰账号），脚本会把这个合集每集的观看时间与进度写入 <code>ml15/data/learnlog.js</code>，提交后本页自动更新。SESSDATA 获取：浏览器登录 B 站 → F12 → Application → Cookies → bilibili.com → SESSDATA。</p>
        <h3 style="margin-top:14px">方式二：手动补录</h3>
        <p>点每集页面的「标记已学完」，这里会记录完成日期；时间轴按完成时间排序。</p>
        <div class="row">
          <button class="btn sm" id="exportLog">导出我的学习记录</button>
          <a class="btn sm ghost" href="https://www.bilibili.com/account/history" target="_blank" rel="noopener">打开 B 站观看历史 ↗</a>
        </div>
        <div class="msg" id="logmsg"></div>
      </div>
    </section>

    <section class="block"><div class="sec-head"><h2><span class="no">TABLE</span>逐集明细</h2><p>按课程顺序</p></div>
      <div class="tablewrap"><table class="logtable"><thead><tr><th>集</th><th>标题</th><th>模块</th><th class="num">时长</th><th class="num">完成时间</th></tr></thead><tbody>${rows}</tbody></table></div>
      <div class="mapcard" style="margin-top:16px"><div data-fig="fig-log-timeline" id="logFig"></div></div>
    </section>
    </div></main>`);
    hydrateFigures();
    const lf = $('#logFig'); if (lf) { lf.__eps = C.episodes; lf.dataset.rendered = ''; ML15FIG.render('fig-log-timeline', lf); }
    $('#exportLog').addEventListener('click', () => {
      const data = { course: C.meta.title, generatedAt: new Date().toISOString(), done: progress.done, updated: progress.updated };
      const a = document.createElement('a');
      a.href = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
      a.download = 'ml15-learnlog.json'; a.click();
      $('#logmsg').textContent = '已导出 ml15-learnlog.json';
      $('#logmsg').className = 'msg ok';
    });
  }

  /* ---------------- 启动 ---------------- */
  const page = document.body.dataset.page;
  if (page === 'home') pageHome();
  else if (page === 'episode') pageEpisode();
  else if (page === 'cheat') pageCheat();
  else if (page === 'log') pageLog();
})();
