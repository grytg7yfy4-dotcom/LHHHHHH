/* ============================================================================
 *  ML15 图解库 —— 全部是内联 SVG，颜色跟随 module 主色（currentColor / --mc）
 *  用法：ML15FIG.render('fig-key', element)
 *  静态图：返回 <svg>；交互图：图 + .figctl 控件，事件在 render 时绑定。
 * ========================================================================== */
(function () {
  'use strict';

  const INK = 'var(--ink)', SUB = 'var(--sub)', MUT = 'var(--muted)', LINE = 'var(--line)', PANEL = 'var(--panel)';
  const C1 = '#2563eb', C2 = '#0ea66b', C3 = '#f59e0b', C4 = '#ef4444', C5 = '#8b5cf6';
  let uid = 0;

  /* ---------- 基础绘制 ---------- */
  const esc = s => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const T = (x, y, s, o = {}) =>
    `<text x="${x}" y="${y}" font-size="${o.size || 11}" fill="${o.fill || SUB}" text-anchor="${o.anchor || 'start'}"` +
    ` font-weight="${o.weight || 400}"${o.opacity != null ? ` opacity="${o.opacity}"` : ''}` +
    `${o.mono ? ' font-family="ui-monospace,Consolas,monospace"' : ''}${o.italic ? ' font-style="italic"' : ''}>${esc(s)}</text>`;
  const R = (x, y, w, h, o = {}) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${o.rx == null ? 8 : o.rx}" fill="${o.fill || 'none'}"` +
    `${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1.2}"` : ''}` +
    `${o.opacity != null ? ` opacity="${o.opacity}"` : ''}${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}/>`;
  const C = (cx, cy, r, o = {}) =>
    `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${o.fill || 'currentColor'}"${o.stroke ? ` stroke="${o.stroke}" stroke-width="${o.sw || 1.2}"` : ''}` +
    `${o.opacity != null ? ` opacity="${o.opacity}"` : ''}/>`;
  const L = (x1, y1, x2, y2, o = {}) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${o.stroke || LINE}" stroke-width="${o.sw || 1.4}"` +
    ` stroke-opacity="${o.opacity == null ? 1 : o.opacity}"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''} stroke-linecap="round"/>`;
  const P = (d, o = {}) =>
    `<path d="${d}" fill="${o.fill || 'none'}" stroke="${o.stroke || 'currentColor'}" stroke-width="${o.sw || 2}"` +
    ` stroke-linecap="round" stroke-linejoin="round"${o.dash ? ` stroke-dasharray="${o.dash}"` : ''}` +
    `${o.opacity != null ? ` opacity="${o.opacity}"` : ''}/>`;
  const G = (x, y, s) => `<g transform="translate(${x},${y}) scale(${s})">`;
  const GE = '</g>';
  // 箭头（无 marker，避免 id 冲突）
  const ARR = (x1, y1, x2, y2, o = {}) => {
    const ang = Math.atan2(y2 - y1, x2 - x1), len = o.len || 7;
    const ax = x2 - Math.cos(ang) * len, ay = y2 - Math.sin(ang) * len;
    const px = Math.cos(ang + Math.PI / 2) * (o.w || 4), py = Math.sin(ang + Math.PI / 2) * (o.w || 4);
    return L(x1, y1, x2, y2, o) +
      `<polygon points="${x2},${y2} ${ax + px},${ay + py} ${ax - px},${ay - py}" fill="${o.stroke || 'currentColor'}" opacity="${o.opacity == null ? 1 : o.opacity}"/>`;
  };
  const S = (inner, h, w = 640) =>
    `<svg viewBox="0 0 ${w} ${h}" preserveAspectRatio="xMidYMid meet" role="img">${inner}</svg>`;
  const AX = (x, y, w, h, xt, yt) =>
    L(x, y + h, x + w, y + h, { stroke: MUT, opacity: .55, sw: 1 }) +
    L(x, y, x, y + h, { stroke: MUT, opacity: .55, sw: 1 }) +
    (xt ? T(x + w, y + h + 16, xt, { size: 10, fill: MUT, anchor: 'end' }) : '') +
    (yt ? T(x - 6, y + 8, yt, { size: 10, fill: MUT, anchor: 'end' }) : '');

  const pct = v => Math.round(v * 100) + '%';

  /* ---------- 图函数 ---------- */
  const F = {};

  /* 首页 hero：散点 → 决策边界 → 树 */
  F['fig-hero'] = () => {
    let s = '';
    // 左：散点 + 分类边界
    s += R(16, 18, 286, 292, { rx: 14, fill: PANEL, stroke: LINE });
    s += T(32, 42, '训练数据', { size: 11, weight: 700, fill: INK });
    const pts = [[60, 92], [78, 118], [96, 88], [114, 132], [130, 100], [88, 160], [146, 150],
      [168, 182], [190, 152], [210, 196], [242, 200], [168, 118], [224, 232], [116, 216], [254, 160],
      [74, 236], [198, 122], [142, 262], [64, 176], [232, 118], [108, 66]];
    pts.forEach(([x, y], i) => {
      const up = y < 300 - (x - 20) * 0.72;
      if (up) s += C(x, y, 4.6, { fill: C1, opacity: .85 });
      else s += `<polygon points="${x},${y - 4.6} ${x + 4.6},${y + 3.6} ${x - 4.6},${y + 3.6}" fill="${C3}" opacity=".9"/>`;
    });
    s += P('M 30 288 L 278 76', { stroke: C5, sw: 2, dash: '5 4', opacity: .8 });
    s += T(150, 300, '模型学到的边界', { size: 10, fill: C5, anchor: 'middle' });
    // 右：决策树
    s += T(340, 42, '学到的 if…else 规则', { size: 11, weight: 700, fill: INK });
    const N = (x, y, txt, cls) => R(x - 42, y - 15, 84, 30, { rx: 9, fill: cls === 'leaf' ? 'var(--panel-2)' : PANEL, stroke: cls === 'leaf' ? C3 : C1, sw: 1.5 }) + T(x, y + 4, txt, { size: 10, anchor: 'middle', fill: INK, weight: 700 });
    s += N(500, 80, '面积 > 90 ?');
    s += N(424, 158, '房龄 < 5 ?');
    s += N(576, 158, '地铁近 ?');
    s += N(378, 238, '买', 'leaf') + N(468, 238, '不买', 'leaf') + N(530, 238, '买', 'leaf') + N(618, 238, '犹豫', 'leaf');
    s += P('M 488 95 C 460 120, 440 135, 424 143', { stroke: C1, sw: 1.6 });
    s += P('M 512 95 C 540 120, 560 135, 576 143', { stroke: C1, sw: 1.6 });
    s += P('M 410 173 C 396 195, 388 210, 380 223', { stroke: C3, sw: 1.4 });
    s += P('M 438 173 C 450 195, 458 210, 466 223', { stroke: C3, sw: 1.4 });
    s += P('M 562 173 C 548 195, 540 210, 532 223', { stroke: C3, sw: 1.4 });
    s += P('M 590 173 C 602 195, 610 210, 616 223', { stroke: C3, sw: 1.4 });
    s += T(408, 132, '是', { size: 9, fill: C1 }) + T(552, 132, '否', { size: 9, fill: C1 });
    return S(s, 330);
  };

  /* 课程地图：15 集 × 6 模块 */
  F['fig-course-map'] = () => {
    const eps = [
      ['01', '通识', C1], ['02', '是什么', C1], ['03', '类型', C1],
      ['04', '线性回归', C2], ['05', '梯度下降', C2], ['06', '预处理', C2], ['07', '评估', C2], ['08', '过拟合', C2],
      ['09', '逻辑回归', C3], ['10', '决策树', C3],
      ['11', '随机森林', C4], ['12', 'Boosting', C4],
      ['13', 'K-Means', C5], ['14', 'PCA', C5],
      ['15', '总结', '#0d9488']
    ];
    const mods = [['通识', C1, 0, 2], ['回归', C2, 3, 7], ['分类', C3, 8, 9], ['集成', C4, 10, 11], ['无监督', C5, 12, 13], ['总结', '#0d9488', 14, 14]];
    const x0 = 48, step = 38, y = 172;
    let s = '';
    mods.forEach(([name, col, a, b]) => {
      const xa = x0 + a * step - 21, xb = x0 + b * step + 21;
      s += R(xa, 108, xb - xa, 142, { rx: 12, fill: col, opacity: .07 });
      s += T((xa + xb) / 2, 130, name, { size: 11.5, weight: 700, fill: col, anchor: 'middle' });
    });
    s += L(x0 - 24, y, x0 + 14 * step + 26, y, { stroke: LINE, sw: 3 });
    eps.forEach(([no, name, col], i) => {
      const x = x0 + i * step;
      s += C(x, y, 12.5, { fill: PANEL, stroke: col, sw: 2 });
      s += T(x, y + 3.6, no, { size: 9.5, weight: 700, fill: col, anchor: 'middle', mono: true });
      s += T(x, y + 34, name, { size: 8.2, fill: SUB, anchor: 'middle' });
    });
    s += T(320, 62, '15 集 · 6 个模块 · 5 小时 20 分', { size: 13, fill: INK, weight: 700, anchor: 'middle' });
    s += T(320, 82, '先建立直觉，再回填公式，最后用一张决策表选模型', { size: 10.5, fill: MUT, anchor: 'middle' });
    s += T(320, 274, '模块之间是递进关系：不懂回归就学不动梯度下降，不懂树就学不动随机森林', { size: 9.5, fill: MUT, anchor: 'middle' });
    return S(s, 292);
  };

  /* EP01 三阶段 */
  F['fig-ep01-stages'] = () => {
    const st = [['① 规则时代', '人把规则写死', 'if…else / 专家系统'], ['② 学习时代', '让模型从数据里找规则', '统计学习 / 决策树 / SVM'], ['③ 大模型时代', '用海量数据预训练', 'Transformer / LLM']];
    let s = '';
    st.forEach(([a, b, c], i) => {
      const x = 24 + i * 204;
      s += R(x, 40, 180, 118, { rx: 13, fill: PANEL, stroke: LINE });
      s += R(x, 40, 180, 4, { rx: 2, fill: [C1, C2, C5][i] });
      s += T(x + 16, 72, a, { size: 13, weight: 700, fill: INK });
      s += T(x + 16, 98, b, { size: 11, fill: SUB });
      s += T(x + 16, 122, c, { size: 10.5, fill: MUT });
      s += T(x + 16, 144, ['数据少', '数据变多', '数据 + 算力爆发'][i], { size: 9.5, fill: [C1, C2, C5][i] });
      if (i < 2) s += ARR(x + 184, 99, x + 202, 99, { stroke: MUT, opacity: .7 });
    });
    s += T(24, 200, '机器学习的出现，本质是「规则写不完」时的一种替代方案：把找规则这件事也交给数据。', { size: 11, fill: SUB });
    return S(s, 220);
  };

  /* EP01 数据 → 模型 → 预测闭环 */
  F['fig-ep01-loop'] = () => {
    let s = '';
    const nodes = [[140, 60, '数据 (x, y)'], [420, 60, '模型 f(x)'], [470, 190, '预测 ŷ'], [200, 190, '误差 L(ŷ, y)']];
    nodes.forEach(([x, y, t], i) => {
      s += R(x - 68, y - 22, 136, 44, { rx: 11, fill: PANEL, stroke: [C1, C2, C3, C4][i], sw: 1.6 });
      s += T(x, y + 4, t, { size: 11.5, weight: 700, fill: INK, anchor: 'middle' });
    });
    s += ARR(208, 60, 348, 60, { stroke: C2 });
    s += ARR(430, 82, 452, 166, { stroke: C3 });
    s += ARR(404, 190, 270, 190, { stroke: C4 });
    s += ARR(196, 168, 160, 84, { stroke: C5 });
    s += T(278, 50, '训练', { size: 10, fill: C2 }) + T(462, 128, '推理', { size: 10, fill: C3 }) +
      T(336, 182, '算损失', { size: 10, fill: C4 }) + T(162, 128, '更新参数', { size: 10, fill: C5 });
    s += T(320, 250, '机器学习 = 用误差当老师，反复调整 f(x) 的参数', { size: 11, fill: SUB, anchor: 'middle' });
    return S(s, 270);
  };

  /* EP02 从散点到函数 */
  F['fig-ep02-fit'] = () => {
    let s = AX(46, 24, 540, 200, 'x（特征）', 'y（标签）');
    const pts = [[90, 180], [130, 168], [168, 172], [206, 148], [246, 156], [286, 128], [326, 134], [366, 106], [406, 112], [446, 86], [492, 78], [526, 62]];
    pts.forEach(([x, y]) => { s += C(x, y, 4.5, { fill: C1, opacity: .8 }); });
    s += P('M 70 196 C 180 172, 360 120, 540 62', { stroke: C2, sw: 2.4 });
    s += T(300, 84, '拟合出的 f(x)', { size: 10.5, fill: C2, weight: 700 });
    s += T(120, 120, '真实的规律（未知）', { size: 10, fill: MUT });
    s += P('M 90 186 L 90 174', { stroke: MUT, sw: 1, dash: '2 3' });
    s += T(46, 252, '训练 = 在假设空间里挑一个与数据最贴合的 f；泛化 = 它对没见过的 x 也准。', { size: 11, fill: SUB });
    return S(s, 268);
  };

  /* EP03 三大范式 */
  F['fig-ep03-types'] = () => {
    const items = [
      ['监督学习', '有标签 (x, y)', '回归 / 分类', C1, '学映射'],
      ['无监督学习', '只有 x', '聚类 / 降维 / 异常', C5, '找结构'],
      ['强化学习', '只有奖励 r', '策略 / 规划', C3, '试错学决策']
    ];
    let s = '';
    items.forEach(([a, b, c, col, d], i) => {
      const x = 22 + i * 202;
      s += R(x, 34, 188, 172, { rx: 14, fill: PANEL, stroke: LINE });
      s += R(x, 34, 188, 4, { rx: 2, fill: col });
      s += T(x + 16, 68, a, { size: 14, weight: 800, fill: col });
      s += T(x + 16, 94, b, { size: 11, fill: SUB });
      s += T(x + 16, 118, c, { size: 10.5, fill: MUT });
      s += R(x + 16, 134, 156, 1, { fill: LINE });
      s += T(x + 16, 160, d, { size: 12, weight: 700, fill: INK });
      if (i < 2) s += T(x + 194, 126, 'vs', { size: 10, fill: MUT });
    });
    s += T(22, 240, '判断口诀：先问「有没有标签 y」，没有 y 再问「有没有奖励 r」。', { size: 11, fill: SUB });
    return S(s, 258);
  };

  /* EP04 线性回归：可交互 w / b */
  F['fig-ep04-linear'] = (el) => {
    const data = [[1, 3.2], [2, 5.6], [3, 6.1], [4, 9.5], [5, 10.2], [6, 12.8], [7, 13.1], [8, 16.4], [9, 17.2], [10, 19.8]];
    const id = 'f' + (++uid);
    el.innerHTML =
      `<div class="figctl">
         <label>斜率 w <input type="range" min="0" max="2.6" step="0.05" value="1.2" data-k="w"><span class="val" data-v="w">1.20</span></label>
         <label>截距 b <input type="range" min="-2" max="6" step="0.1" value="0.5" data-k="b"><span class="val" data-v="b">0.50</span></label>
         <button type="button" data-act="best">直接找最优</button>
         <span class="val" data-v="mse" style="color:var(--bad)">MSE 0.00</span>
       </div>
       <div class="fv" data-svg></div>`;
    const svgBox = el.querySelector('[data-svg]');
    const X = v => 60 + (v / 11) * 520, Y = v => 240 - (v / 24) * 200;
    function draw() {
      const w = +el.querySelector('[data-k=w]').value, b = +el.querySelector('[data-k=b]').value;
      el.querySelector('[data-v=w]').textContent = w.toFixed(2);
      el.querySelector('[data-v=b]').textContent = b.toFixed(2);
      let s = AX(60, 40, 520, 200, 'x', 'y');
      let mse = 0;
      data.forEach(([x, y]) => {
        const yh = w * x + b, err = y - yh;
        mse += err * err;
        s += L(X(x), Y(y), X(x), Y(Math.min(Math.max(yh, -2), 23)), { stroke: C4, sw: 1, opacity: .55, dash: '3 3' });
        s += C(X(x), Y(y), 4.2, { fill: C1, opacity: .85 });
        s += C(X(x), Y(yh), 2.6, { fill: C4 });
      });
      mse /= data.length;
      el.querySelector('[data-v=mse]').textContent = 'MSE ' + mse.toFixed(2);
      s += P(`M ${X(0)} ${Y(b)} L ${X(11)} ${Y(w * 11 + b)}`, { stroke: C2, sw: 2.4 });
      s += T(X(9.4), Y(w * 9.4 + b) - 12, 'ŷ = wx + b', { size: 10.5, fill: C2, weight: 700 });
      s += T(60, 268, '红线 = 残差（预测减真实）；MSE = 残差平方的平均。拖动滑块，观察 MSE 怎么变。', { size: 10.5, fill: MUT });
      svgBox.innerHTML = S(s, 286);
    }
    el.querySelectorAll('input[type=range]').forEach(r => r.addEventListener('input', draw));
    el.querySelector('[data-act=best]').addEventListener('click', () => {
      el.querySelector('[data-k=w]').value = 1.62; el.querySelector('[data-k=b]').value = 2.0; draw();
    });
    draw();
  };

  /* EP05 梯度下降：抛物线上的步进 */
  F['fig-ep05-gd'] = (el) => {
    const id = 'g' + (++uid);
    const f = w => (w - 3) ** 2 + 1, grad = w => 2 * (w - 3);
    let w = 9.4, lr = 0.18, steps = 0, timer = null;
    el.innerHTML =
      `<div class="figctl">
         <label>学习率 η <input type="range" min="0.02" max="1.1" step="0.02" value="0.18"><span class="val" data-v="lr">0.18</span></label>
         <button type="button" data-act="step">走一步</button>
         <button type="button" data-act="run">自动</button>
         <button type="button" data-act="reset">重置</button>
         <span class="val" data-v="info">w=9.40 f=43.0</span>
       </div><div class="fv" data-svg></div>`;
    const box = el.querySelector('[data-svg]');
    const X = v => 54 + (v / 10) * 540, Y = v => 240 - (v / 48) * 195;
    function draw() {
      let s = AX(54, 36, 540, 200, 'w（参数）', 'L(w)（损失）');
      let d = '';
      for (let i = 0; i <= 200; i++) { const x = 10 * i / 200; d += (i ? 'L' : 'M') + X(x) + ' ' + Y(f(x)); }
      s += P(d, { stroke: C1, sw: 2.2 });
      // 轨迹
      let cur = 9.4;
      for (let i = 0; i < steps; i++) {
        const nxt = cur - lr * grad(cur);
        s += ARR(X(cur), Y(f(cur)) - 8, X(nxt), Y(f(nxt)) - 8, { stroke: C3, sw: 1.4, opacity: .9, len: 5 });
        cur = nxt;
      }
      s += C(X(w), Y(f(w)), 5.5, { fill: C4 });
      s += T(X(w) + 10, Y(f(w)) + 4, 'w=' + w.toFixed(2), { size: 10, fill: C4, weight: 700 });
      s += C(X(3), Y(f(3)), 4, { fill: C2 }); s += T(X(3) + 8, Y(f(3)) - 8, '最优 w*=3', { size: 10, fill: C2 });
      s += T(54, 268, '每一步：w ← w − η · L′(w)。学习率太大来回震荡，太小半天走不动。', { size: 10.5, fill: MUT });
      box.innerHTML = S(s, 286);
      el.querySelector('[data-v=info]').textContent = 'w=' + w.toFixed(2) + ' f=' + f(w).toFixed(1);
    }
    function step() { w = w - lr * grad(w); steps++; draw(); }
    el.querySelector('input').addEventListener('input', e => { lr = +e.target.value; el.querySelector('[data-v=lr]').textContent = lr.toFixed(2); });
    el.querySelector('[data-act=step]').onclick = step;
    el.querySelector('[data-act=reset]').onclick = () => { w = 9.4; steps = 0; if (timer) { clearInterval(timer); timer = null; } draw(); };
    el.querySelector('[data-act=run]').onclick = e => {
      if (timer) { clearInterval(timer); timer = null; e.target.textContent = '自动'; return; }
      e.target.textContent = '暂停';
      timer = setInterval(() => { if (steps > 40) { clearInterval(timer); timer = null; e.target.textContent = '自动'; return; } step(); }, 260);
    };
    draw();
  };

  /* EP05 学习率对比 */
  F['fig-ep05-lr'] = () => {
    let s = AX(52, 30, 540, 190, 'w', 'L(w)');
    const f = w => (w - 3) ** 2 + 1, X = v => 52 + (v / 10) * 540, Y = v => 220 - (v / 60) * 180;
    let d = ''; for (let i = 0; i <= 200; i++) { const x = 10 * i / 200; d += (i ? 'L' : 'M') + X(x) + ' ' + Y(f(x)); }
    s += P(d, { stroke: C1, sw: 2 });
    const path = (lr, col, label, y) => {
      let w = 9.4; let out = C(X(w), Y(f(w)), 4, { fill: col });
      for (let i = 0; i < 7; i++) { const n = w - lr * 2 * (w - 3); out += ARR(X(w), Y(f(w)), X(n), Y(f(n)), { stroke: col, sw: 1.2, opacity: .75, len: 4 }); w = n; }
      out += T(X(0.2) + 4, y, label, { size: 10, fill: col, weight: 700 });
      return out;
    };
    s += path(0.1, C2, 'η=0.1：稳步下降', 40);
    s += path(0.9, C3, 'η=0.9：来回横跳', 60);
    s += path(1.05, C4, 'η=1.05：直接发散', 80);
    s += T(52, 258, '同一个损失函数，学习率决定「能不能收敛」和「多快收敛」。', { size: 11, fill: SUB });
    return S(s, 274);
  };

  /* EP06 数据预处理流水线 */
  F['fig-ep06-pipeline'] = () => {
    const steps = [['原始数据', '缺失 / 异常 / 重复'], ['清洗', '填补、去重、截断'], ['编码', 'One-Hot / 序号'], ['缩放', '标准化 / 归一化'], ['划分', '训练 / 验证 / 测试']];
    let s = '';
    steps.forEach(([a, b], i) => {
      const x = 18 + i * 126;
      s += R(x, 48, 108, 118, { rx: 12, fill: PANEL, stroke: i === 4 ? C3 : LINE, sw: i === 4 ? 1.6 : 1.2 });
      s += T(x + 54, 78, a, { size: 12, weight: 700, fill: INK, anchor: 'middle' });
      s += T(x + 54, 104, b.split(' / ')[0], { size: 9.5, fill: MUT, anchor: 'middle' });
      if (b.split(' / ')[1]) s += T(x + 54, 120, b.split(' / ')[1], { size: 9.5, fill: MUT, anchor: 'middle' });
      if (b.split(' / ')[2]) s += T(x + 54, 136, b.split(' / ')[2], { size: 9.5, fill: MUT, anchor: 'middle' });
      if (i < 4) s += ARR(x + 110, 107, x + 124, 107, { stroke: MUT, opacity: .7, len: 5 });
    });
    s += T(18, 204, '铁律：先划分再缩放，验证集 / 测试集的信息绝不能泄漏进训练。', { size: 11, fill: SUB });
    s += T(18, 226, '缩放只用训练集的均值方差，再套到验证集和测试集上。', { size: 11, fill: MUT });
    return S(s, 244);
  };

  /* EP07 模型评估：残差 + R² */
  F['fig-ep07-eval'] = () => {
    let s = AX(46, 26, 320, 190, 'x', 'y');
    const data = [[70, 176], [110, 158], [150, 166], [192, 134], [232, 142], [272, 108], [312, 116], [346, 84]];
    const line = x => 196 - 0.33 * x;
    data.forEach(([x, y]) => { s += L(x, y, x, line(x), { stroke: C4, dash: '3 3', sw: 1.1, opacity: .7 }); s += C(x, y, 3.6, { fill: C1 }); });
    s += P(`M 50 ${line(50)} L 366 ${line(366)}`, { stroke: C2, sw: 2 });
    s += T(46, 248, '残差 e = y − ŷ', { size: 10.5, fill: C4 });
    // 右侧指标
    const x0 = 400;
    s += R(x0, 26, 220, 190, { rx: 12, fill: PANEL, stroke: LINE });
    s += T(x0 + 16, 52, '三个评估量', { size: 12, weight: 700, fill: INK });
    const rows = [['MSE', '残差平方的平均', C1], ['RMSE', '量纲和 y 一致', C2], ['R²', '解释了百分之多少', C3]];
    rows.forEach(([a, b, c], i) => {
      const y = 84 + i * 40;
      s += T(x0 + 16, y, a, { size: 13, weight: 800, fill: c, mono: true });
      s += T(x0 + 66, y, b, { size: 10.5, fill: SUB });
      s += R(x0 + 16, y + 8, 188 * [0.62, 0.74, 0.86][i], 5, { rx: 3, fill: c, opacity: .55 });
    });
    s += T(46, 270, '训练集分数高不代表好，关键看验证集 / 测试集。', { size: 11, fill: SUB });
    return S(s, 286);
  };

  /* EP08 欠拟合 / 合适 / 过拟合 */
  F['fig-ep08-overunder'] = () => {
    const panels = [
      ['欠拟合', '模型太简单，训练集都拟合不好', C1, x => 210 - 0.35 * x],
      ['合适', '抓到了主趋势，也不死记噪声', C2, x => 214 - 0.5 * x + 18 * Math.sin(x / 55)],
      ['过拟合', '把噪声也背下来了，换个数据集就崩', C4, x => 130 + 70 * Math.sin(x / 18) + 0.2 * x]
    ];
    let s = '';
    const pts = [[60, 176], [95, 168], [130, 160], [165, 172], [200, 140], [235, 150], [270, 120], [305, 128], [340, 96]];
    panels.forEach(([title, desc, col, fn], i) => {
      const ox = 14 + i * 208;
      s += R(ox, 20, 196, 210, { rx: 12, fill: PANEL, stroke: LINE });
      s += T(ox + 14, 44, title, { size: 12.5, weight: 800, fill: col });
      s += L(ox + 14, 208, ox + 178, 208, { stroke: LINE });
      s += L(ox + 14, 60, ox + 14, 208, { stroke: LINE });
      pts.forEach(([px, py]) => { s += C(ox + px * 0.5, py - 20, 3.2, { fill: MUT, opacity: .8 }); });
      let d = '';
      for (let k = 0; k <= 60; k++) { const x = 30 + k * 3.4; const y = fn(x) - 20; d += (k ? 'L' : 'M') + (ox + x * 0.5) + ' ' + y; }
      s += P(d, { stroke: col, sw: 2.2 });
      s += T(ox + 14, 246, desc, { size: 9.5, fill: MUT });
    });
    return S(s, 262);
  };

  /* EP08 L1 / L2 约束 */
  F['fig-ep08-reg'] = () => {
    let s = '';
    [[0, 'L2（岭）', 'w₁² + w₂² ≤ t', 'circle', C2], [320, 'L1（Lasso）', '|w₁| + |w₂| ≤ t', 'diamond', C3]].forEach(([ox, name, f, shape, col]) => {
      s += R(ox + 14, 20, 292, 214, { rx: 12, fill: PANEL, stroke: LINE });
      s += T(ox + 30, 44, name, { size: 12.5, weight: 800, fill: col });
      s += T(ox + 30, 64, f, { size: 11, fill: SUB });
      const cx = ox + 160, cy = 150, r = 62;
      s += L(cx - 96, cy, cx + 96, cy, { stroke: MUT, opacity: .5 }) + L(cx, cy + 82, cx, cy - 82, { stroke: MUT, opacity: .5 });
      // 等高线（椭圆）
      for (let k = 1; k <= 3; k++) {
        s += `<ellipse cx="${cx + 26}" cy="${cy - 26}" rx="${18 + k * 15}" ry="${11 + k * 10}" fill="none" stroke="${C1}" stroke-opacity=".35" stroke-width="1.2" transform="rotate(-30 ${cx + 26} ${cy - 26})"/>`;
      }
      if (shape === 'circle') s += C(cx, cy, r, { fill: 'none', stroke: col, sw: 2.2 });
      else s += `<polygon points="${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}" fill="none" stroke="${col}" stroke-width="2.2"/>`;
      const tx = shape === 'circle' ? cx + r * 0.72 : cx + r * 0.52, ty = shape === 'circle' ? cy - r * 0.72 : cy - r * 0.52;
      s += C(tx, ty, 4.4, { fill: col });
      s += T(ox + 30, 190, shape === 'circle' ? '切点通常不在坐标轴上：参数被整体压小' : '切点常落在坐标轴上：部分参数直接变 0', { size: 9.8, fill: SUB });
      s += T(ox + 30, 212, shape === 'circle' ? '→ 缓解过拟合，但不做特征选择' : '→ 稀疏解，可当特征选择用', { size: 9.8, fill: MUT });
    });
    return S(s, 250);
  };

  /* EP09 sigmoid */
  F['fig-ep09-sigmoid'] = () => {
    let s = AX(64, 30, 500, 190, 'z = wx + b', 'σ(z)');
    const X = z => 64 + ((z + 6) / 12) * 500, Y = p => 220 - p * 180;
    let d = ''; for (let i = 0; i <= 240; i++) { const z = -6 + 12 * i / 240; d += (i ? 'L' : 'M') + X(z) + ' ' + Y(1 / (1 + Math.exp(-z))); }
    s += P(d, { stroke: C1, sw: 2.6 });
    s += L(64, Y(0.5), 564, Y(0.5), { stroke: C3, dash: '5 4', sw: 1.2 });
    s += T(510, Y(0.5) - 8, '阈值 0.5', { size: 10, fill: C3 });
    s += L(X(0), Y(0), X(0), Y(1), { stroke: MUT, dash: '3 3', opacity: .5 });
    s += C(X(0), Y(0.5), 4.5, { fill: C3 }); s += T(X(0) + 8, Y(0.5) + 16, 'z=0 处概率=0.5', { size: 10, fill: C3 });
    s += T(64, 250, '输出被压进 (0,1)，可解释成「属于正类的概率」；z 越大越接近 1。', { size: 11, fill: SUB });
    return S(s, 266);
  };

  /* EP09 混淆矩阵 + 指标 */
  F['fig-ep09-confusion'] = () => {
    let s = '';
    const x0 = 40, y0 = 46, cw = 116, ch = 58;
    s += T(x0 + cw + 8, 34, '预测：正', { size: 10.5, fill: MUT, anchor: 'middle' });
    s += T(x0 + cw * 2 + 8, 34, '预测：负', { size: 10.5, fill: MUT, anchor: 'middle' });
    s += T(x0 - 8, y0 + 20, '真实：正', { size: 10.5, fill: MUT, anchor: 'end' });
    s += T(x0 - 8, y0 + ch + 26, '真实：负', { size: 10.5, fill: MUT, anchor: 'end' });
    const cells = [['TP', '真阳性', C2], ['FN', '漏报', C4], ['FP', '误报', C3], ['TN', '真阴性', C2]];
    cells.forEach(([a, b, col], i) => {
      const x = x0 + (i % 2) * cw, y = y0 + Math.floor(i / 2) * ch;
      s += R(x, y, cw - 4, ch - 4, { rx: 9, fill: col, opacity: .1, stroke: col, sw: 1.3 });
      s += T(x + 12, y + 24, a, { size: 14, weight: 800, fill: col, mono: true });
      s += T(x + 12, y + 44, b, { size: 10, fill: SUB });
    });
    // 右侧公式
    const rx = 320;
    s += R(rx, 30, 296, 200, { rx: 12, fill: PANEL, stroke: LINE });
    s += T(rx + 16, 54, '由矩阵派生的指标', { size: 12, weight: 700, fill: INK });
    const rows = [['准确率', 'TP+TN / 全部', '类别不平衡时会骗人'], ['精确率', 'TP / (TP+FP)', '报出来的有多少是真的'], ['召回率', 'TP / (TP+FN)', '该报的漏了多少'], ['F1', '精确率与召回率的调和平均', '两者都要时看它']];
    rows.forEach(([a, b, c], i) => {
      const y = 84 + i * 38;
      s += T(rx + 16, y, a, { size: 11.5, weight: 700, fill: C1 });
      s += T(rx + 82, y, b, { size: 10.5, fill: SUB, mono: true });
      s += T(rx + 16, y + 15, c, { size: 9.5, fill: MUT });
    });
    return S(s, 246);
  };

  /* EP10 决策树结构 */
  F['fig-ep10-tree'] = () => {
    let s = '';
    const N = (x, y, t, o = {}) => R(x - 54, y - 16, 108, 32, { rx: 9, fill: o.fill || PANEL, stroke: o.stroke || LINE, sw: o.sw || 1.3 }) + T(x, y + 4, t, { size: 10.5, anchor: 'middle', fill: o.tc || INK, weight: 700 });
    const line = (x1, y1, x2, y2, col, label) => P(`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1 + 24}, ${(x1 + x2) / 2} ${y2 - 24}, ${x2} ${y2}`, { stroke: col, sw: 2 }) + (label ? T((x1 + x2) / 2 + (x2 > x1 ? -8 : 8), (y1 + y2) / 2, label, { size: 10, fill: col, anchor: 'middle' }) : '');
    s += N(320, 50, '天气?', { stroke: C1 });
    s += N(160, 140, '湿度?', { stroke: C1 });
    s += N(480, 140, '风力?', { stroke: C1 });
    s += N(90, 228, '不玩', { stroke: C4, tc: C4, fill: 'var(--panel-2)' });
    s += N(230, 228, '玩', { stroke: C2, tc: C2, fill: 'var(--panel-2)' });
    s += N(400, 228, '玩', { stroke: C2, tc: C2, fill: 'var(--panel-2)' });
    s += N(560, 228, '不玩', { stroke: C4, tc: C4, fill: 'var(--panel-2)' });
    s += line(300, 66, 190, 124, C1, '晴');
    s += line(340, 66, 460, 124, C1, '雨');
    s += line(140, 156, 104, 212, C4, '高');
    s += line(182, 156, 220, 212, C2, '低');
    s += line(460, 156, 414, 212, C2, '小');
    s += line(500, 156, 548, 212, C4, '大');
    s += R(14, 282, 612, 1, { fill: LINE });
    s += T(24, 312, '根节点：第一个分裂问题', { size: 10, fill: C1 }) +
      T(190, 312, '内部节点：继续分裂', { size: 10, fill: C1 }) +
      T(360, 312, '叶节点：最终类别', { size: 10, fill: C2 }) +
      T(500, 312, '分支：某个取值', { size: 10, fill: C4 });
    return S(s, 330);
  };

  /* EP10 熵 / 基尼：交互 */
  F['fig-ep10-entropy'] = (el) => {
    el.innerHTML =
      `<div class="figctl">
         <label>正类比例 p <input type="range" min="0.01" max="0.99" step="0.01" value="0.5"><span class="val" data-v="p">0.50</span></label>
         <span class="val" data-v="h">H=1.000</span>
         <span class="val" data-v="g" style="color:var(--bad)">Gini=0.500</span>
       </div><div class="fv" data-svg></div>`;
    const box = el.querySelector('[data-svg]');
    const P = v => 60 + v * 500, Y = h => 226 - (h / 1.05) * 180;
    function draw() {
      const p = +el.querySelector('input').value;
      const H = -(p * Math.log2(p) + (1 - p) * Math.log2(1 - p));
      const Gi = 2 * p * (1 - p);
      el.querySelector('[data-v=p]').textContent = p.toFixed(2);
      el.querySelector('[data-v=h]').textContent = 'H=' + H.toFixed(3);
      el.querySelector('[data-v=g]').textContent = 'Gini=' + Gi.toFixed(3);
      let s = AX(60, 36, 500, 190, 'p（正类比例）', '不纯度');
      let d = '', e = '';
      for (let i = 1; i < 120; i++) {
        const pp = i / 120, h = -(pp * Math.log2(pp) + (1 - pp) * Math.log2(1 - pp));
        d += (i === 1 ? 'M' : 'L') + P(pp) + ' ' + Y(h);
        e += (i === 1 ? 'M' : 'L') + P(pp) + ' ' + Y(2 * pp * (1 - pp));
      }
      s += P(d, { stroke: C1, sw: 2.4 });
      s += P(e, { stroke: C4, sw: 1.8, dash: '5 4' });
      s += C(P(p), Y(H), 5.5, { fill: C1 });
      s += L(P(p), Y(0), P(p), Y(H), { stroke: C1, dash: '2 3', opacity: .6 });
      s += T(84, 58, '熵 H(p)', { size: 10.5, fill: C1, weight: 700 });
      s += T(84, 78, '基尼 Gini(p)', { size: 10.5, fill: C4 });
      s += T(60, 258, '纯节点（p=0 或 1）不纯度最低；对半分时最乱。信息增益 = 分裂前 − 分裂后加权。', { size: 10.5, fill: MUT });
      box.innerHTML = S(s, 276);
    }
    el.querySelector('input').addEventListener('input', draw);
    draw();
  };

  /* EP11 随机森林 bagging */
  F['fig-ep11-forest'] = () => {
    let s = '';
    s += R(20, 92, 96, 96, { rx: 10, fill: C1, opacity: .09, stroke: C1 });
    s += T(68, 128, '训练集', { size: 11, weight: 700, fill: C1, anchor: 'middle' });
    s += T(68, 148, 'N 条样本', { size: 9.5, fill: MUT, anchor: 'middle' });
    for (let i = 0; i < 3; i++) {
      const y = 30 + i * 76;
      s += R(158, y, 96, 58, { rx: 9, fill: PANEL, stroke: LINE });
      s += T(206, y + 22, '有放回抽样', { size: 9.5, fill: SUB, anchor: 'middle' });
      s += T(206, y + 40, '样本 ' + (i + 1), { size: 9.5, fill: MUT, anchor: 'middle' });
      s += ARR(116, 140, 152, y + 28, { stroke: MUT, opacity: .6, len: 5 });
      s += ARR(258, y + 28, 306, 140, { stroke: MUT, opacity: .6, len: 5 });
    }
    for (let i = 0; i < 3; i++) {
      const y = 34 + i * 70;
      s += R(312, y, 120, 54, { rx: 9, fill: 'var(--panel-2)', stroke: C2, sw: 1.3 });
      s += T(372, y + 32, '决策树 ' + (i + 1), { size: 10.5, fill: C2, weight: 700, anchor: 'middle' });
      s += ARR(436, y + 27, 476, 132, { stroke: MUT, opacity: .6, len: 5 });
    }
    s += R(480, 100, 136, 80, { rx: 12, fill: C3, opacity: .1, stroke: C3, sw: 1.4 });
    s += T(548, 132, '投票 / 平均', { size: 11.5, weight: 800, fill: C3, anchor: 'middle' });
    s += T(548, 154, '方差 ↓ 更稳', { size: 9.5, fill: MUT, anchor: 'middle' });
    s += T(20, 240, '每棵树只看一部分样本、一部分特征，彼此不一样；合起来「三个臭皮匠」。', { size: 11, fill: SUB });
    return S(s, 256);
  };

  /* EP12 Boosting 残差拟合 */
  F['fig-ep12-boosting'] = () => {
    const pts = [[60, 190], [100, 156], [140, 170], [180, 120], [220, 140], [260, 96], [300, 110], [340, 70], [380, 86], [420, 56]];
    let s = '';
    const panel = (ox, title, fn) => {
      s += R(ox, 20, 190, 216, { rx: 12, fill: PANEL, stroke: LINE });
      s += T(ox + 14, 44, title, { size: 11.5, weight: 800, fill: INK });
      s += L(ox + 14, 214, ox + 176, 214, { stroke: LINE }) + L(ox + 14, 56, ox + 14, 214, { stroke: LINE });
      pts.forEach(([x, y]) => { s += C(ox + x * 0.42, y, 3.4, { fill: MUT, opacity: .8 }); });
      let d = '';
      for (let k = 0; k <= 40; k++) { const x = 60 + k * 9; d += (k ? 'L' : 'M') + (ox + x * 0.42) + ' ' + fn(x); }
      s += P(d, { stroke: [C1, C2, C4][Math.floor(ox / 320)], sw: 2.2 });
    };
    panel(14, '① 第一棵：欠拟合', x => 196 - 0.42 * x + 20);
    panel(224, '② 拟合残差', x => 196 - 0.42 * x + 20 - 10 * Math.sin(x / 40));
    panel(434, '③ 累加：强学习器', x => 196 - 0.42 * x + 4);
    s += T(14, 268, 'Boosting：一棵接一棵，每棵专门修正前面所有树的残差；误差被「接力」压下去。', { size: 11, fill: SUB });
    s += T(14, 290, 'XGBoost / LightGBM / CatBoost 都是在 GBDT 上把「正则化」「并行」「类别特征」做得更好。', { size: 10.5, fill: MUT });
    return S(s, 306);
  };

  /* EP13 K-Means：交互 */
  F['fig-ep13-kmeans'] = (el) => {
    const truth = [[120, 140], [330, 110], [300, 260], [150, 300], [480, 190], [420, 320]];
    const pts = [];
    const centers = [[110, 120], [330, 120], [310, 260], [160, 310], [500, 200], [430, 330]];
    for (let c = 0; c < 6; c++) for (let i = 0; i < 5; i++) {
      pts.push([centers[c][0] + (Math.sin(i * 7 + c) * 26), centers[c][1] + (Math.cos(i * 5 + c * 2) * 26)]);
    }
    let k = 3, cents = [[140, 150], [360, 140], [300, 300]], iter = 0, inertia = 0, autoT = null;
    const id = 'k' + (++uid);
    el.innerHTML =
      `<div class="figctl">
         <button type="button" data-act="step">迭代一步</button>
         <button type="button" data-act="auto">自动</button>
         <button type="button" data-act="reset">重置</button>
         <span class="val" data-v="it">第 0 轮</span>
         <span class="val" data-v="in">SSE 0</span>
       </div><div class="fv" data-svg></div>`;
    const box = el.querySelector('[data-svg]');
    const cols = [C1, C3, C5];
    function assign() {
      const asg = pts.map(p => {
        let best = 0, bd = Infinity;
        cents.forEach((c, i) => { const d = (p[0] - c[0]) ** 2 + (p[1] - c[1]) ** 2; if (d < bd) { bd = d; best = i; } });
        return { p, best, bd };
      });
      inertia = asg.reduce((s, a) => s + a.bd, 0);
      return asg;
    }
    function step() {
      const asg = assign();
      cents = cents.map((c, i) => {
        const grp = asg.filter(a => a.best === i).map(a => a.p);
        if (!grp.length) return c;
        return [grp.reduce((s, p) => s + p[0], 0) / grp.length, grp.reduce((s, p) => s + p[1], 0) / grp.length];
      });
      iter++;
      draw();
    }
    function draw() {
      const asg = assign();
      let s = R(10, 16, 620, 330, { rx: 14, fill: 'var(--panel-2)', stroke: LINE });
      asg.forEach(a => { s += C(a.p[0], a.p[1] + 16, 4.2, { fill: cols[a.best], opacity: .8 }); });
      cents.forEach((c, i) => {
        s += `<path d="M ${c[0] - 8} ${c[1] + 16} L ${c[0] + 8} ${c[1] + 16} M ${c[0]} ${c[1] + 8} L ${c[0]} ${c[1] + 24}" stroke="${cols[i]}" stroke-width="2.6"/>`;
        s += C(c[0], c[1] + 16, 12, { fill: cols[i], opacity: .12 });
      });
      s += T(24, 336, '十字 = 簇中心；颜色 = 当前归属。点不再换颜色时，K-Means 就收敛了。', { size: 10, fill: MUT });
      box.innerHTML = S(s, 350);
      el.querySelector('[data-v=it]').textContent = '第 ' + iter + ' 轮';
      el.querySelector('[data-v=in]').textContent = 'SSE ' + Math.round(inertia).toLocaleString();
    }
    el.querySelector('[data-act=step]').onclick = () => { if (iter < 12) step(); };
    el.querySelector('[data-act=reset]').onclick = () => {
      if (autoT) { clearInterval(autoT); autoT = null; }
      cents = [[140, 150], [360, 140], [300, 300]]; iter = 0; draw();
    };
    el.querySelector('[data-act=auto]').onclick = e => {
      if (autoT) { clearInterval(autoT); autoT = null; e.target.textContent = '自动'; return; }
      e.target.textContent = '暂停';
      autoT = setInterval(() => {
        if (iter >= 10) { clearInterval(autoT); autoT = null; e.target.textContent = '自动'; return; }
        step();
      }, 620);
    };
    draw();
  };

  /* EP14 PCA：交互投影 */
  F['fig-ep14-pca'] = (el) => {
    const pts = [];
    for (let i = 0; i < 34; i++) {
      const t = i * 2.4, x = 320 + Math.cos(t) * (55 + (i % 7) * 12) + Math.sin(i) * 8;
      const y = 180 + Math.sin(t) * (20 + (i % 5) * 7) + Math.cos(i * 1.7) * 6;
      pts.push([x, y]);
    }
    let ang = 0.42, autoT = null;
    el.innerHTML =
      `<div class="figctl">
         <label>投影方向 <input type="range" min="0" max="3.14" step="0.01" value="0.42"><span class="val" data-v="a">24°</span></label>
         <button type="button" data-act="best">→ 主成分方向</button>
         <span class="val" data-v="v">解释 0%</span>
       </div><div class="fv" data-svg></div>`;
    const box = el.querySelector('[data-svg]');
    function draw() {
      const dx = Math.cos(ang), dy = Math.sin(ang);
      let s = R(10, 14, 620, 320, { rx: 14, fill: 'var(--panel-2)', stroke: LINE });
      // 投影轴
      s += L(320 - dx * 280, 180 - dy * 280, 320 + dx * 280, 180 + dy * 280, { stroke: C2, sw: 2, dash: '6 4' });
      let vsum = 0, proj = [];
      const mean = pts.reduce((a, p) => [a[0] + p[0] / pts.length, a[1] + p[1] / pts.length], [0, 0]);
      const centered = pts.map(p => [p[0] - mean[0], p[1] - mean[1]]);
      centered.forEach(c => { const t = c[0] * dx + c[1] * dy; proj.push(t); vsum += t * t; });
      const total = centered.reduce((a, c) => a + c[0] ** 2 + c[1] ** 2, 0);
      centered.forEach((c, i) => {
        const px = mean[0] + proj[i] * dx, py = mean[1] + proj[i] * dy;
        s += L(mean[0] + c[0], mean[1] + c[1], px, py, { stroke: MUT, sw: .8, opacity: .5 });
        s += C(mean[0] + c[0], mean[1] + c[1], 3.4, { fill: C1, opacity: .75 });
        s += C(px, py, 2.4, { fill: C3 });
      });
      s += C(mean[0], mean[1], 4, { fill: INK });
      s += T(24, 330, '橙色点 = 原始样本在主轴上的投影；方差越大，这个方向保留的信息越多。', { size: 10, fill: MUT });
      box.innerHTML = S(s, 344);
      el.querySelector('[data-v=a]').textContent = Math.round(ang * 180 / Math.PI) + '°';
      el.querySelector('[data-v=v]').textContent = '解释 ' + Math.round(vsum / total * 100) + '%';
    }
    el.querySelector('input').addEventListener('input', e => { ang = +e.target.value; draw(); });
    el.querySelector('[data-act=best]').onclick = () => {
      // 用协方差矩阵主特征向量求最优角
      const mx = pts.reduce((a, p) => a + p[0], 0) / pts.length, my = pts.reduce((a, p) => a + p[1], 0) / pts.length;
      let sxx = 0, syy = 0, sxy = 0;
      pts.forEach(p => { const x = p[0] - mx, y = p[1] - my; sxx += x * x; syy += y * y; sxy += x * y; });
      const th = 0.5 * Math.atan2(2 * sxy, sxx - syy);
      ang = th; el.querySelector('input').value = th; draw();
    };
    draw();
  };

  /* EP14 碎石图 */
  F['fig-ep14-scree'] = () => {
    const vals = [42, 24, 14, 9, 6, 5], cum = [];
    let acc = 0; vals.forEach(v => { acc += v; cum.push(acc); });
    let s = AX(64, 34, 500, 180, '主成分', '解释方差 %');
    vals.forEach((v, i) => {
      const x = 84 + i * 78, h = v / 50 * 180;
      s += R(x, 214 - h, 44, h, { rx: 5, fill: C1, opacity: .55 + i * .03 });
      s += T(x + 22, 214 - h - 7, v + '%', { size: 9.5, fill: SUB, anchor: 'middle' });
      s += T(x + 22, 232, 'PC' + (i + 1), { size: 9.5, fill: MUT, anchor: 'middle' });
    });
    let d = ''; cum.forEach((v, i) => { d += (i ? 'L' : 'M') + (106 + i * 78) + ' ' + (214 - v / 100 * 180); });
    s += P(d, { stroke: C3, sw: 2 });
    cum.forEach((v, i) => { s += C(106 + i * 78, 214 - v / 100 * 180, 3.4, { fill: C3 }); });
    s += T(64, 258, '选前 2 个主成分 ≈ 保留 66% 方差，这就是「降维」的取舍：用更少维度换更少信息损失。', { size: 10.5, fill: MUT });
    return S(s, 272);
  };

  /* EP15 算法全景 */
  F['fig-ep15-map'] = () => {
    let s = '';
    const root = (x, y, t, col) => R(x - 52, y - 15, 104, 30, { rx: 8, fill: col, opacity: .12, stroke: col, sw: 1.4 }) + T(x, y + 4, t, { size: 10.5, weight: 800, fill: col, anchor: 'middle' });
    const leaf = (x, y, t, col) => R(x - 46, y - 12, 92, 24, { rx: 7, fill: PANEL, stroke: LINE }) + T(x, y + 4, t, { size: 9.6, fill: INK, anchor: 'middle' });
    const E = (x1, y1, x2, y2, col) => P(`M ${x1} ${y1} C ${(x1 + x2) / 2} ${y1 + 18}, ${(x1 + x2) / 2} ${y2 - 18}, ${x2} ${y2}`, { stroke: col, sw: 1.5, opacity: .6 });
    s += root(320, 42, '机器学习', C1);
    s += E(320, 57, 140, 108, C2) + E(320, 57, 320, 108, C3) + E(320, 57, 510, 108, C5);
    s += root(140, 124, '监督学习', C2) + root(320, 124, '集成学习', C3) + root(510, 124, '无监督学习', C5);
    const leaves = [
      [46, 200, '线性回归', C2], [132, 200, '逻辑回归', C2], [218, 200, '决策树', C2],
      [276, 200, '随机森林', C3], [360, 200, 'XGBoost', C3],
      [452, 200, 'K-Means', C5], [540, 200, 'PCA', C5], [612, 200, '异常检测', C5]
    ];
    leaves.forEach(([x, y, t, c]) => { s += E(c === C2 ? 140 : c === C3 ? 320 : 510, 139, x, y - 12, c) + leaf(x, y, t, c); });
    s += T(320, 248, '监督 = 有 y；集成 = 多模型投票 / 接力；无监督 = 没 y，自己找结构', { size: 10.5, fill: SUB, anchor: 'middle' });
    s += T(320, 268, '本课程：回归 → 分类 → 集成 → 聚类 / 降维 → 深度学习展望', { size: 10, fill: MUT, anchor: 'middle' });
    return S(s, 284);
  };

  /* 学习记录时间轴 */
  F['fig-log-timeline'] = (el) => {
    const eps = (el && el.__eps) || [];
    const mods = [C1, C1, C1, C2, C2, C2, C2, C2, C3, C3, C4, C4, C5, C5, '#0d9488'];
    let s = '';
    if (!eps.length) { s = T(20, 40, '暂无数据', { size: 11, fill: MUT }); return S(s, 80); }
    const max = Math.max(...eps.map(e => e.duration));
    s += L(40, 210, 616, 210, { stroke: LINE });
    let acc = 0;
    eps.forEach((e, i) => {
      const x = 44 + i * 38, h = e.duration / max * 140;
      const c = mods[i] || C1;
      s += R(x - 10, 210 - h, 20, h, { rx: 4, fill: c, opacity: .55 });
      s += T(x, 210 - h - 6, Math.round(e.duration / 60) + '', { size: 8.5, fill: MUT, anchor: 'middle' });
      acc += e.duration;
    });
    s += T(40, 238, '每集时长（分钟）；总和 5 小时 20 分。柱越高，这一集越「重」。', { size: 10, fill: MUT });
    return S(s, 256);
  };

  /* 补充：神经网络结构 */
  F['fig-nn'] = () => {
    let s = '';
    const LY = [[80, [72, 150, 228], '输入层'], [300, [54, 122, 190, 258], '隐藏层 (ReLU)'], [520, [156], '输出层']];
    // 连线
    for (let i = 0; i < 3; i++) for (let j = 0; j < 4; j++) {
      s += L(LY[0][0], LY[0][1][i], LY[1][0], LY[1][1][j], { stroke: LINE, opacity: .9, sw: 1 });
    }
    for (let j = 0; j < 4; j++) s += L(LY[1][0], LY[1][1][j], LY[2][0], LY[2][1][0], { stroke: LINE, opacity: .9, sw: 1 });
    // 节点
    LY[0][1].forEach((y, i) => { s += C(LY[0][0], y, 15, { fill: PANEL, stroke: C1, sw: 2 }) + T(LY[0][0], y + 4, 'x' + (i + 1), { size: 10, anchor: 'middle', fill: INK, weight: 700 }); });
    LY[1][1].forEach((y, j) => { s += C(LY[1][0], y, 15, { fill: C1, opacity: .12 }) + C(LY[1][0], y, 15, { fill: 'none', stroke: C1, sw: 1.8 }) + T(LY[1][0], y + 4, 'a' + (j + 1), { size: 9.5, anchor: 'middle', fill: C1, weight: 700 }); });
    LY[2][1].forEach(y => { s += C(LY[2][0], y, 17, { fill: C5, opacity: .14 }) + C(LY[2][0], y, 17, { fill: 'none', stroke: C5, sw: 2 }) + T(LY[2][0], y + 4, 'ŷ', { size: 12, anchor: 'middle', fill: C5, weight: 700 }); });
    // 层标注
    [[80, '输入层', '3 维特征'], [300, '隐藏层', '4 个神经元 + ReLU'], [520, '输出层', 'Sigmoid']].forEach(([x, a, b]) => {
      s += T(x, 300, a, { size: 11, anchor: 'middle', fill: INK, weight: 700 });
      s += T(x, 318, b, { size: 9.5, anchor: 'middle', fill: MUT });
    });
    s += T(300, 26, '前向传播：z = Wx + b，a = g(z)', { size: 11, anchor: 'middle', fill: C1, weight: 700 });
    return S(s, 332);
  };

  /* 补充：异常检测高斯密度 */
  F['fig-anomaly'] = () => {
    let s = R(10, 16, 620, 246, { rx: 14, fill: 'var(--panel-2)', stroke: LINE });
    const cx = 300, cy = 140;
    // 等高椭圆
    [[76, 44], [120, 70], [164, 96]].forEach(([rx, ry], i) => {
      s += `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C2}" stroke-opacity="${0.5 - i * 0.12}" stroke-width="1.5" stroke-dasharray="5 4" transform="rotate(-18 ${cx} ${cy})"/>`;
    });
    // 正常点
    const pts = [[250, 120], [270, 150], [300, 128], [320, 156], [340, 130], [280, 100], [330, 108],
      [260, 170], [310, 176], [350, 160], [230, 140], [360, 140], [290, 150], [340, 170], [255, 108],
      [375, 120], [240, 158]];
    pts.forEach(([x, y]) => { s += C(x, y, 3.6, { fill: C1, opacity: .75 }); });
    // 异常点
    [[420, 60], [470, 200], [180, 200], [500, 220]].forEach(([x, y]) => {
      s += C(x, y, 5, { fill: C4, opacity: .9 });
      s += C(x, y, 10, { fill: 'none', stroke: C4, sw: 1.2, opacity: .5 });
    });
    s += T(cx, 34, '正常样本：p(x) 大', { size: 11, fill: C2, anchor: 'middle', weight: 700 });
    s += T(468, 84, 'p(x) < ε', { size: 10.5, fill: C4, weight: 700 });
    s += T(22, 250, '每个特征估 μ、σ，连乘得到 p(x)；阈值 ε 用验证集选，p(x) 低于 ε 判异常。', { size: 10, fill: MUT });
    return S(s, 272);
  };

  /* 补充：推荐系统矩阵分解 */
  F['fig-reco'] = () => {
    let s = '';
    const cell = (x, y, w, h, fill, stroke) => R(x, y, w, h, { rx: 3, fill: fill, stroke: stroke || LINE, sw: 1 });
    // R 矩阵
    s += T(70, 28, '评分矩阵 R', { size: 11, anchor: 'middle', fill: INK, weight: 700 });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 5; c++) {
      const has = (r * 5 + c) % 3 !== 0;
      s += cell(20 + c * 22, 42 + r * 22, 20, 20, has ? C1 : 'none', has ? C1 : LINE);
      if (has) s += T(30 + c * 22, 56 + r * 22, '5', { size: 8, fill: '#fff', anchor: 'middle', weight: 700 });
    }
    s += T(70, 178, '稀疏：大部分格子未知', { size: 9.5, anchor: 'middle', fill: MUT });
    // 箭头
    s += ARR(150, 92, 190, 92, { stroke: MUT, opacity: .7, len: 7 });
    s += T(170, 78, '分解', { size: 9.5, anchor: 'middle', fill: MUT });
    // X
    s += T(252, 28, '用户矩阵 X', { size: 11, anchor: 'middle', fill: INK, weight: 700 });
    for (let r = 0; r < 5; r++) for (let c = 0; c < 3; c++) s += cell(212 + c * 22, 42 + r * 22, 20, 20, C1, 0.12);
    s += T(252, 178, '5 用户 × k 维', { size: 9.5, anchor: 'middle', fill: MUT });
    // ×
    s += T(340, 108, '×', { size: 18, fill: MUT, anchor: 'middle' });
    // Θ^T
    s += T(420, 28, '物品矩阵 Θᵀ', { size: 11, anchor: 'middle', fill: INK, weight: 700 });
    for (let r = 0; r < 3; r++) for (let c = 0; c < 5; c++) s += cell(376 + c * 22, 42 + r * 22, 20, 20, C5, 0.12);
    s += T(420, 126, 'k × 5 物品', { size: 9.5, anchor: 'middle', fill: MUT });
    // 预测
    s += ARR(486, 92, 526, 92, { stroke: MUT, opacity: .7, len: 7 });
    s += R(530, 64, 86, 56, { rx: 10, fill: PANEL, stroke: C2, sw: 1.5 });
    s += T(573, 88, 'r̂ = xᵀθ', { size: 11, anchor: 'middle', fill: C2, weight: 700 });
    s += T(573, 106, '预测评分', { size: 9, anchor: 'middle', fill: MUT });
    s += T(20, 214, '只对已知评分算损失；学出的隐向量点积就是缺失格子的预测值。', { size: 10, fill: MUT });
    return S(s, 236);
  };

  /* 补充：强化学习循环 */
  F['fig-rl'] = () => {
    let s = '';
    s += R(90, 70, 130, 66, { rx: 14, fill: C1, opacity: .12 });
    s += T(155, 100, '智能体', { size: 14, anchor: 'middle', fill: C1, weight: 800 });
    s += T(155, 120, 'Agent', { size: 9.5, anchor: 'middle', fill: MUT });
    s += R(390, 70, 130, 66, { rx: 14, fill: C5, opacity: .12 });
    s += T(455, 100, '环境', { size: 14, anchor: 'middle', fill: C5, weight: 800 });
    s += T(455, 120, 'Environment', { size: 9.5, anchor: 'middle', fill: MUT });
    s += ARR(225, 92, 385, 92, { stroke: C1, sw: 2 });
    s += T(305, 82, '动作 a', { size: 10.5, anchor: 'middle', fill: C1, weight: 700 });
    s += ARR(385, 118, 225, 118, { stroke: C3, sw: 2 });
    s += T(305, 136, '状态 s′ + 奖励 r', { size: 10.5, anchor: 'middle', fill: C3, weight: 700 });
    // 循环
    s += P('M 130 160 C 120 200, 210 214, 300 206', { stroke: C2, sw: 1.6, dash: '5 4' });
    s += P('M 480 160 C 490 200, 400 214, 310 206', { stroke: C2, sw: 1.6, dash: '5 4' });
    s += T(305, 222, '策略 π 根据回报不断调整', { size: 10, anchor: 'middle', fill: C2 });
    s += T(305, 258, '目标：max E[ r₀ + γr₁ + γ²r₂ + … ]', { size: 11, anchor: 'middle', fill: INK, weight: 700 });
    return S(s, 276);
  };

  /* ---------- 导出 ---------- */
  function render(key, el) {
    const fn = F[key];
    if (!fn) { el.innerHTML = ''; return; }
    try {
      const out = fn(el);
      if (typeof out === 'string' && out) el.innerHTML = out;
    } catch (err) { el.innerHTML = '<div class="empty">示意图加载失败</div>'; }
  }
  window.ML15FIG = { render, has: k => !!F[k], keys: Object.keys(F) };
})();
