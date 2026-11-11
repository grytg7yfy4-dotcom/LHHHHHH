/* 知识点迷你示意图：全部内联 SVG，颜色跟随主题（currentColor = 章节主色） */
(function () {
  const V = 'var(--muted)', K = 'var(--ink)', L = 'var(--line)';
  const S = (inner, h) => `<svg viewBox="0 0 360 ${h || 140}" preserveAspectRatio="xMidYMid meet" role="img">${inner}</svg>`;
  const t = (x, y, s, size, fill, anchor, weight) =>
    `<text x="${x}" y="${y}" font-size="${size || 9}" fill="${fill || V}" text-anchor="${anchor || 'start'}" font-weight="${weight || 400}">${s}</text>`;
  const l = (x1, y1, x2, y2, c, o, w, dash) =>
    `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${c || 'currentColor'}" stroke-opacity="${o == null ? 0.4 : o}" stroke-width="${w || 1.4}" ${dash ? `stroke-dasharray="${dash}"` : ''}/>`;
  const r = (x, y, w, h, rad, fill, stroke) =>
    `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad || 6}" fill="${fill || 'none'}" ${stroke ? `stroke="${stroke}" stroke-width="1.2"` : ''}/>`;
  const c = (cx, cy, rr, fill, o) =>
    `<circle cx="${cx}" cy="${cy}" r="${rr}" fill="${fill || 'currentColor'}" fill-opacity="${o == null ? 1 : o}"/>`;
  const p = (d, stroke, w, fill) =>
    `<path d="${d}" fill="${fill || 'none'}" stroke="${stroke || 'currentColor'}" stroke-width="${w || 1.8}" stroke-linecap="round" stroke-linejoin="round"/>`;
  const ax = (x, y, w, h) => l(x, y + h, x + w, y + h, V, 0.7, 1) + l(x, y, x, y + h, V, 0.7, 1);

  window.MLFIG = {
    /* 0 三大范式 */
    paradigm() {
      const items = [['监督', '有 (x, y)', 0], ['无监督', '只有 x', 1], ['强化', '只有奖励', 2]];
      let s = '';
      items.forEach(([a, b, i]) => {
        const x = 10 + i * 116;
        s += r(x, 18, 108, 102, 9, 'none', L);
        s += c(x + 22, 40, 5, 'currentColor', 0.85);
        s += c(x + 34, 40, 5, 'currentColor', 0.25);
        s += t(x + 12, 66, a, 12, K, 'start', 700);
        s += t(x + 12, 84, b, 9, V);
        s += t(x + 12, 104, i === 0 ? '学 x→y 映射' : i === 1 ? '找结构 / 分组' : '试错学策略', 8.5, V);
      });
      return S(s);
    },
    /* 1 课程地图 */
    roadmap() {
      const rows = [['课程一', 'P1–P37', 0.28], ['课程二', 'P38–P100', 0.48], ['课程三', 'P101–P146', 0.24]];
      let s = '';
      rows.forEach(([a, b, wv], i) => {
        const y = 26 + i * 36;
        s += t(8, y + 14, a, 10, K, 'start', 700);
        s += t(60, y + 14, b, 9, V);
        s += r(150, y, 190, 20, 10, 'none', L);
        s += r(150, y, 190 * wv, 20, 10, 'currentColor', null);
      });
      s += t(8, 134, '146 集 · 约 23 小时 · 12 章', 9, V);
      return S(s);
    },
    /* 2 数据表 */
    table() {
      let s = '';
      ['面积 x', '价格 y'].forEach((h, i) => {
        s += r(70 + i * 100, 20, 98, 22, 4, 'currentColor');
        s += `<text x="${70 + i * 100 + 49}" y="35" font-size="9" fill="#fff" text-anchor="middle">${h}</text>`;
      });
      [['50', '150'], ['80', '230'], ['110', '310'], ['150', '420']].forEach((row, j) => {
        row.forEach((v, i) => {
          s += r(70 + i * 100, 44 + j * 22, 98, 20, 3, 'none', L);
          s += t(70 + i * 100 + 49, 58 + j * 22, v, 9, K, 'middle');
        });
      });
      s += t(8, 60, '训练集', 9, V);
      s += t(8, 76, '(x, y)', 9, V);
      return S(s);
    },
    /* 3 拟合直线 */
    linefit() {
      let s = ax(40, 20, 290, 95);
      const pts = [[80, 92], [120, 78], [165, 82], [205, 58], [250, 52], [295, 36]];
      s += l(60, 104, 320, 30, 'currentColor', 0.85, 2);
      pts.forEach(([x, y]) => s += c(x, y, 3.5, 'currentColor'));
      s += t(230, 26, 'f(x)=wx+b', 9, K, 'start', 700);
      return S(s);
    },
    /* 4 残差 */
    residual() {
      let s = ax(40, 20, 290, 95);
      const pts = [[80, 88], [125, 70], [170, 80], [215, 56], [260, 48]];
      s += l(60, 104, 320, 30, 'currentColor', 0.5, 1.8);
      pts.forEach(([x, y]) => {
        const hy = 104 - (x - 60) * (74 / 260);
        s += l(x, y, x, hy, '#f59e0b', 0.9, 1.6, '3 2');
        s += c(x, y, 3.4, 'currentColor');
      });
      s += t(215, 118, '竖线 = 残差 ŷ−y', 9, V);
      return S(s);
    },
    /* 5 碗形代价 */
    bowl() {
      let s = p('M40 24 Q180 190 320 24', 'currentColor', 2);
      s += l(180, 24, 180, 112, V, 0.5, 1, '4 3');
      s += c(180, 107, 5, 'currentColor');
      s += t(186, 118, '全局最优 w', 9, K);
      s += t(44, 20, 'J(w)', 9, V);
      s += t(310, 40, 'w', 9, V);
      return S(s);
    },
    /* 6 等高线 + 下降 */
    contour() {
      let s = '';
      [[92, 58], [64, 40], [38, 24]].forEach(([rx, ry], i) => {
        s += `<ellipse cx="240" cy="72" rx="${rx}" ry="${ry}" fill="none" stroke="currentColor" stroke-opacity="${0.6 - i * 0.13}" stroke-width="1.5"/>`;
      });
      const pts = [[70, 30], [100, 44], [130, 56], [160, 66], [190, 70], [215, 71]];
      s += p('M' + pts.map(q => q.join(',')).join(' L'), '#dc2626', 2);
      pts.forEach(q => s += c(q[0], q[1], 2.6, '#dc2626'));
      s += c(240, 72, 4, K);
      s += t(246, 90, '最优', 9, K);
      s += t(56, 128, '等高线 = 同样误差；红点 = 梯度下降每一步', 8.5, V);
      return S(s);
    },
    /* 7 切线 / 梯度 */
    gradient() {
      let s = ax(40, 20, 290, 95);
      s += p('M50 96 Q140 26 320 88', 'currentColor', 2);
      s += l(150, 78, 235, 44, '#dc2626', 0.95, 2);
      s += c(192, 59, 4, '#dc2626');
      s += t(210, 40, '斜率 = 梯度', 9, '#dc2626');
      s += t(56, 126, '沿负梯度走，J 下降最快', 8.5, V);
      return S(s);
    },
    /* 8 学习率三态 */
    lrcurve() {
      let s = ax(40, 20, 290, 95);
      const curve = (fn, col, o) => {
        let d = 'M';
        for (let i = 0; i <= 40; i++) {
          const x = 40 + i * 7.25, y = 20 + 95 - fn(i);
          d += (i ? ' L' : '') + x.toFixed(1) + ',' + y.toFixed(1);
        }
        return p(d, col, 2, 'none') + `<path d="${d}" fill="none" stroke-opacity="${o}"/>`;
      };
      s += curve(i => 78 * Math.exp(-i / 5) + 6, 'currentColor', 1);
      s += curve(i => 76 - 2 * i * 0.9, '#f59e0b', 0.9);
      s += curve(i => 40 + 26 * Math.cos(i / 2.2) * (1 + i / 22), '#dc2626', 0.7);
      s += t(200, 40, '太小：慢', 8.5, '#f59e0b');
      s += t(96, 112, '合适', 8.5, 'currentColor');
      s += t(236, 30, '太大：震荡', 8.5, '#dc2626');
      return S(s);
    },
    /* 9 向量 / 点积 */
    vector() {
      let s = '';
      ['x₁', 'x₂', 'x₃'].forEach((v, i) => {
        s += r(24, 34 + i * 26, 44, 22, 5, 'none', L);
        s += t(46, 49 + i * 26, v, 9, K, 'middle');
        s += l(68, 45 + i * 26, 148, 68, V, 0.5, 1);
        s += t(96, 56 + i * 26, ['w₁', 'w₂', 'w₃'][i], 8, V);
      });
      s += t(148, 74, 'Σ + b', 11, K, 'middle', 700);
      s += l(176, 68, 214, 68, V, 0.6);
      s += r(214, 52, 66, 32, 6, 'none', 'currentColor');
      s += t(247, 72, 'f = w·x+b', 9, 'currentColor', 'middle', 700);
      s += t(24, 128, '每个输入乘一个权重，再加起来', 8.5, V);
      return S(s);
    },
    /* 10 矩阵乘法 */
    matmul() {
      let s = '';
      s += r(24, 32, 60, 76, 5, 'none', L) + t(54, 26, 'X (m×n)', 8, V, 'middle');
      s += r(96, 32, 10, 76, 3, 'currentColor', null) + t(101, 26, '×', 10, V, 'middle');
      s += r(118, 32, 46, 76, 5, 'none', L) + t(141, 26, 'W (n×1)', 8, V, 'middle');
      s += t(176, 74, '=', 12, V, 'middle');
      s += r(192, 32, 58, 76, 5, 'none', 'currentColor') + t(221, 26, 'z (m×1)', 8, V, 'middle');
      for (let i = 0; i < 4; i++) {
        s += l(28, 44 + i * 16, 80, 44 + i * 16, V, 0.35, 1);
        s += l(196, 44 + i * 16, 246, 44 + i * 16, 'currentColor', 0.35, 1);
      }
      s += t(262, 74, '一次算完 m 个样本', 8.5, V);
      return S(s);
    },
    /* 11 特征缩放 */
    scaling() {
      let s = '';
      s += r(24, 24, 130, 92, 8, 'none', L);
      s += `<ellipse cx="89" cy="70" rx="18" ry="40" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
      s += `<ellipse cx="89" cy="70" rx="8" ry="20" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1.4"/>`;
      s += t(89, 130, '缩放前：长条碗', 8.5, V, 'middle');
      s += r(206, 24, 130, 92, 8, 'none', L);
      s += `<circle cx="271" cy="70" r="34" fill="none" stroke="currentColor" stroke-width="1.6"/>`;
      s += `<circle cx="271" cy="70" r="17" fill="none" stroke="currentColor" stroke-opacity=".5" stroke-width="1.4"/>`;
      s += t(271, 130, '缩放后：圆碗', 8.5, V, 'middle');
      s += t(180, 20, '→', 12, V, 'middle');
      return S(s);
    },
    /* 12 收敛曲线 */
    gdcurve() {
      let s = ax(40, 20, 290, 95);
      let d = 'M';
      for (let i = 0; i <= 40; i++) d += (i ? ' L' : '') + (40 + i * 7.25) + ',' + (105 - 74 * Math.exp(-i / 7) - 8).toFixed(1);
      s += p(d, 'currentColor', 2);
      s += l(40, 96, 330, 96, V, 0.35, 1, '4 3');
      s += t(250, 88, '收敛 → 几乎不动', 8.5, V);
      s += t(44, 16, 'J', 9, V);
      s += t(300, 130, '迭代次数', 8.5, V);
      return S(s);
    },
    /* 13 多项式 */
    polyfit() {
      let s = ax(40, 20, 290, 95);
      const pts = [[70, 96], [105, 70], [140, 56], [175, 44], [210, 46], [245, 60], [280, 84]];
      s += p('M64 102 Q180 -10 286 92', 'currentColor', 2);
      pts.forEach(([x, y]) => s += c(x, y, 3.2, K, 0.75));
      s += t(196, 26, '高次项让曲线弯曲', 8.5, V);
      return S(s);
    },
    /* 14 sigmoid */
    sigmoid() {
      let s = ax(40, 20, 290, 95);
      s += p('M52 112 C110 112 130 30 190 30 L320 30', 'currentColor', 2.4);
      s += l(40, 63, 330, 63, V, 0.4, 1, '4 3');
      s += c(150, 63, 4, '#dc2626');
      s += t(154, 56, 'z=0 → 0.5', 8.5, '#dc2626');
      s += t(44, 16, 'g(z)', 9, V);
      s += t(300, 130, 'z', 9, V);
      return S(s);
    },
    /* 15 决策边界 */
    boundary() {
      let s = ax(40, 20, 290, 95);
      s += l(52, 108, 320, 26, K, 0.8, 2);
      [[80, 40], [110, 34], [95, 56], [140, 44], [160, 30], [70, 70]].forEach(([x, y]) => s += c(x, y, 3.4, '#2563eb'));
      [[180, 92], [220, 80], [250, 96], [280, 72], [300, 90], [200, 60]].forEach(([x, y]) => s += c(x, y, 3.4, '#dc2626'));
      s += t(250, 40, 'z>0 → 1', 8.5, '#dc2626');
      s += t(66, 96, 'z<0 → 0', 8.5, '#2563eb');
      return S(s);
    },
    /* 16 交叉熵 */
    logloss() {
      let s = ax(40, 20, 290, 95);
      let d1 = 'M', d0 = 'M';
      for (let i = 1; i <= 40; i++) {
        const x = 40 + i * 7.25, f = i / 40;
        d1 += (i === 1 ? '' : ' L') + x.toFixed(1) + ',' + Math.max(20, 115 - 95 * Math.log(1 / f) / 3).toFixed(1);
        d0 += (i === 1 ? '' : ' L') + x.toFixed(1) + ',' + Math.max(20, 115 - 95 * Math.log(1 / (1 - f)) / 3).toFixed(1);
      }
      s += p(d1, '#dc2626', 2) + p(d0, '#2563eb', 2);
      s += t(56, 36, 'y=1, f→0 罚→∞', 8.5, '#dc2626');
      s += t(206, 36, 'y=0, f→1', 8.5, '#2563eb');
      s += t(300, 130, 'f', 9, V);
      return S(s);
    },
    /* 17 非凸 */
    nonconvex() {
      let s = ax(40, 20, 290, 95);
      s += p('M48 40 C90 120 120 120 155 70 C185 28 205 60 235 96 C265 130 295 60 320 40', 'currentColor', 2);
      s += c(155, 70, 3.6, '#dc2626');
      s += c(262, 112, 3.6, K);
      s += t(120, 40, '局部极小', 8.5, '#dc2626');
      s += t(268, 104, '全局', 8.5, K);
      return S(s);
    },
    /* 18 三种拟合 */
    fit3() {
      let s = '';
      [['欠拟合', 0.0], ['刚好', 1 / 3], ['过拟合', 2 / 3]].forEach(([name, k], i) => {
        const x = 10 + i * 118;
        s += r(x, 20, 110, 92, 7, 'none', L);
        s += l(x + 8, 100, x + 102, 24, 'none', 0); // placeholder
        s += t(x + 55, 128, name, 9, i === 2 ? '#dc2626' : i === 0 ? '#f59e0b' : '#059669', 'middle', 700);
        const pts = [[x + 20, 88], [x + 45, 60], [x + 70, 70], [x + 92, 40]];
        if (i === 0) s += l(x + 12, 96, x + 98, 34, '#f59e0b', 0.9, 1.8);
        if (i === 1) s += p(`M${x + 12} 96 Q${x + 55} 20 ${x + 98} 36`, '#059669', 1.8);
        if (i === 2) s += p(`M${x + 12} 94 L${x + 30} 40 L${x + 46} 66 L${x + 62} 30 L${x + 78} 80 L${x + 98} 34`, '#dc2626', 1.6);
        pts.forEach(([a, b]) => s += c(a, b, 2.6, K, 0.7));
      });
      return S(s);
    },
    /* 19 偏差方差 */
    biasvar() {
      let s = ax(40, 20, 290, 95);
      let tr = 'M', cv = 'M';
      for (let i = 0; i <= 40; i++) {
        const x = 40 + i * 7.25, v = i / 40;
        tr += (i ? ' L' : '') + x.toFixed(1) + ',' + (104 - 78 * Math.exp(-v * 3) - 5).toFixed(1);
        cv += (i ? ' L' : '') + x.toFixed(1) + ',' + (96 - 62 * Math.exp(-v * 4) + 8 * Math.pow(v, 2.2)).toFixed(1);
      }
      s += p(tr, '#2563eb', 2) + p(cv, '#dc2626', 2);
      s += t(52, 34, 'J_train', 8.5, '#2563eb');
      s += t(272, 30, 'J_cv', 8.5, '#dc2626');
      s += t(40, 130, '模型复杂度 →', 8.5, V);
      return S(s);
    },
    /* 20 学习曲线 */
    learncurve() {
      let s = '';
      [[0, '高偏差'], [1, '高方差']].forEach(([k, name]) => {
        const x = 10 + k * 178;
        s += r(x, 20, 166, 92, 7, 'none', L);
        s += l(x + 12, 104, x + 154, 104, V, 0.6, 1) + l(x + 12, 104, x + 12, 30, V, 0.6, 1);
        let a = 'M', b = 'M';
        for (let i = 1; i <= 20; i++) {
          const px = x + 12 + i * 7.1;
          a += (i === 1 ? '' : ' L') + px + ',' + (96 - 26 * (1 - Math.exp(-i / 4))).toFixed(1);
          b += (i === 1 ? '' : ' L') + px + ',' + (96 - 26 * (1 - Math.exp(-i / 4)) - (k ? 22 : 2)).toFixed(1);
        }
        s += p(a, '#2563eb', 1.8) + p(b, k ? '#dc2626' : '#f59e0b', 1.8);
        s += t(x + 83, 130, name, 8.5, V, 'middle');
      });
      return S(s);
    },
    /* 21 PR 曲线 */
    pr() {
      let s = ax(40, 20, 290, 95);
      s += p('M44 34 C110 42 170 74 320 110', 'currentColor', 2);
      s += c(130, 58, 3.6, '#dc2626') + t(136, 56, '高阈值', 8.5, '#dc2626');
      s += c(250, 94, 3.6, '#dc2626') + t(210, 108, '低阈值', 8.5, '#dc2626');
      s += t(44, 16, '精确率', 9, V);
      s += t(280, 130, '召回率', 8.5, V);
      return S(s);
    },
    /* 22 单个神经元 */
    neuron() {
      let s = '';
      ['x₁', 'x₂', 'x₃'].forEach((v, i) => {
        s += c(40, 38 + i * 30, 12, 'none') + c(40, 38 + i * 30, 12, 'currentColor', 0.12);
        s += t(40, 42 + i * 30, v, 8.5, K, 'middle');
        s += l(52, 38 + i * 30, 118, 70, V, 0.5, 1.1);
      });
      s += c(132, 70, 22, 'none') + `<circle cx="132" cy="70" r="22" fill="none" stroke="currentColor" stroke-width="1.8"/>`;
      s += t(132, 75, 'Σ', 13, 'currentColor', 'middle', 700);
      s += l(154, 70, 196, 70, V, 0.6, 1.4);
      s += r(196, 52, 60, 36, 7, 'none', 'currentColor');
      s += t(226, 68, 'g(z)', 10, 'currentColor', 'middle', 700);
      s += t(226, 82, 'sigmoid', 7.5, V, 'middle');
      s += l(256, 70, 288, 70, V, 0.6, 1.4);
      s += t(294, 74, 'ŷ', 11, K, 'middle', 700);
      s += t(24, 128, 'z = w·x + b，a = g(z)', 8.5, V);
      return S(s);
    },
    /* 23 网络 */
    network() {
      let s = '';
      const ly = [[70, [50, 70, 90]], [170, [38, 60, 82, 104]], [270, [38, 60, 82, 104]], [326, [70]]];
      for (let i = 0; i < ly.length - 1; i++) {
        ly[i][1].forEach(y1 => ly[i + 1][1].forEach(y2 => s += l(ly[i][0], y1, ly[i + 1][0], y2, V, 0.18, 0.8)));
      }
      ly.forEach(([x, ys], i) => ys.forEach(y => s += `<circle cx="${x}" cy="${y}" r="6" fill="none" stroke="${i === 3 ? '#dc2626' : 'currentColor'}" stroke-width="1.4"/>`));
      s += t(70, 122, '输入', 8, V, 'middle') + t(170, 122, '隐藏层', 8, V, 'middle') + t(326, 122, '输出', 8, V, 'middle');
      return S(s);
    },
    /* 24 激活函数 */
    activations() {
      let s = '';
      [['sigmoid', 0, 'M12 92 C40 92 48 20 74 20 L86 20'], ['ReLU', 1, 'M12 92 L48 92 L86 20'], ['tanh', 2, 'M12 86 C40 86 46 26 74 26 L86 26']].forEach(([name, i, d]) => {
        const x = 10 + i * 116;
        s += r(x, 20, 108, 88, 7, 'none', L);
        s += l(x + 12, 92, x + 96, 92, V, 0.4, 1);
        s += `<g transform="translate(${x + 10} 0)"><path d="${d}" fill="none" stroke="currentColor" stroke-width="2"/></g>`;
        s += t(x + 54, 124, name, 8.5, V, 'middle');
      });
      return S(s);
    },
    /* 25 softmax */
    softmax() {
      let s = ax(40, 30, 290, 80);
      const vals = [0.67, 0.2, 0.09, 0.03];
      const names = ['猫', '狗', '鸟', '鱼'];
      vals.forEach((v, i) => {
        const x = 56 + i * 70, h = v * 190;
        s += r(x, 110 - h, 42, h, 4, 'currentColor');
        s += t(x + 21, 104 - h, v.toFixed(2), 8, K, 'middle', 700);
        s += t(x + 21, 126, names[i], 8.5, V, 'middle');
      });
      return S(s);
    },
    /* 26 计算图 */
    graph() {
      let s = '';
      const xs = [14, 100, 186, 272];
      const labels = ['x,w,b', 'z=wx+b', 'a=g(z)', 'L(a,y)'];
      xs.forEach((x, i) => {
        s += r(x, 44, 74, 30, 6, 'none', i === 3 ? '#dc2626' : 'currentColor');
        s += t(x + 37, 64, labels[i], 8.5, i === 3 ? '#dc2626' : 'currentColor', 'middle', 700);
        if (i < 3) s += l(x + 74, 59, xs[i + 1], 59, V, 0.7, 1.2);
      });
      s += l(250, 96, 190, 96, '#dc2626', 0.8, 1.4, '4 3');
      s += t(196, 112, '反向：链式法则', 8.5, '#dc2626');
      return S(s);
    },
    /* 27 决策树 */
    tree() {
      let s = '';
      s += r(128, 12, 104, 26, 6, 'currentColor');
      s += `<text x="180" y="29" font-size="9" fill="#fff" text-anchor="middle">年龄 &lt; 30 ?</text>`;
      s += l(180, 38, 96, 64, V, 0.6, 1.2) + l(180, 38, 264, 64, V, 0.6, 1.2);
      [[64, '是'], [232, '否']].forEach(([x, lab]) => {
        s += r(x, 64, 64, 24, 5, 'none', 'currentColor');
        s += t(x + 32, 80, lab, 8.5, 'currentColor', 'middle');
      });
      s += t(150, 58, '是', 7.5, V) + t(210, 58, '否', 7.5, V);
      [[40, '买'], [96, '不买'], [208, '买'], [264, '买']].forEach(([x, lab]) => {
        s += r(x, 104, 56, 22, 5, 'none', L);
        s += t(x + 28, 119, lab, 8, V, 'middle');
        s += l(x + 28, 88, x + 28, 104, V, 0.45, 1);
      });
      return S(s);
    },
    /* 28 熵 */
    entropy() {
      let s = ax(40, 20, 290, 95);
      s += p('M44 112 C110 20 150 20 180 20 C210 20 250 20 316 112', 'currentColor', 2);
      s += c(180, 20, 3.6, '#dc2626');
      s += t(186, 16, '50/50 最乱', 8.5, '#dc2626');
      s += t(44, 130, '正类比例 p', 8.5, V);
      return S(s);
    },
    /* 29 随机森林 */
    forest() {
      let s = '';
      for (let k = 0; k < 3; k++) {
        const x = 16 + k * 92;
        s += r(x, 34, 76, 66, 7, 'none', L);
        s += l(x + 38, 46, x + 22, 64, 'currentColor', 0.7, 1.2);
        s += l(x + 38, 46, x + 54, 64, 'currentColor', 0.7, 1.2);
        s += l(x + 22, 64, x + 14, 84, 'currentColor', 0.6, 1);
        s += l(x + 22, 64, x + 32, 84, 'currentColor', 0.6, 1);
        s += l(x + 54, 64, x + 46, 84, 'currentColor', 0.6, 1);
        s += l(x + 54, 64, x + 64, 84, 'currentColor', 0.6, 1);
        s += t(x + 38, 112, '树 ' + (k + 1), 8, V, 'middle');
        s += l(x + 76, 66, 292, 66, V, 0.3, 1);
      }
      s += r(292, 52, 58, 30, 6, 'currentColor');
      s += `<text x="321" y="71" font-size="8.5" fill="#fff" text-anchor="middle">投票</text>`;
      return S(s);
    },
    /* 30 kmeans 三步 */
    kmeans() {
      let s = '';
      const pts = [[0.2, 0.7], [0.3, 0.55], [0.15, 0.4], [0.72, 0.3], [0.8, 0.5], [0.65, 0.2], [0.5, 0.8], [0.55, 0.6]];
      for (let k = 0; k < 3; k++) {
        const x = 8 + k * 118;
        s += r(x, 20, 110, 90, 7, 'none', L);
        pts.forEach(([a, b], i) => {
          const px = x + 12 + a * 86, py = 100 - b * 68;
          const col = k === 0 ? V : (a < 0.45 ? '#dc2626' : '#2563eb');
          s += c(px, py, 2.8, col, k === 0 ? 0.6 : 1);
        });
        if (k === 0) {
          s += `<circle cx="${x + 12 + 0.2 * 86}" cy="${100 - 0.7 * 68}" r="5" fill="none" stroke="#dc2626" stroke-width="1.6"/>`;
          s += `<circle cx="${x + 12 + 0.72 * 86}" cy="${100 - 0.3 * 68}" r="5" fill="none" stroke="#2563eb" stroke-width="1.6"/>`;
        }
        s += t(x + 55, 126, ['① 初始化', '② 分配', '③ 更新中心'][k], 8.5, V, 'middle');
      }
      return S(s);
    },
    /* 31 高斯异常 */
    gauss() {
      let s = ax(40, 20, 290, 95);
      s += p('M48 112 C110 112 130 22 180 22 C230 22 250 112 312 112', 'currentColor', 2);
      s += l(70, 112, 70, 40, V, 0.5, 1, '4 3') + l(290, 112, 290, 40, V, 0.5, 1, '4 3');
      s += c(56, 108, 3.4, '#dc2626') + c(304, 106, 3.4, '#dc2626');
      s += t(74, 34, 'ε', 9, '#dc2626');
      s += t(180, 130, '正常样本学 μ、σ；尾巴上的是异常', 8.5, V, 'middle');
      return S(s);
    },
    /* 32 评分矩阵 */
    matrix() {
      let s = '';
      const vals = [['5', '4', '?', '1'], ['4', '?', '3', '1'], ['?', '5', '4', '?'], ['1', '2', '?', '5']];
      vals.forEach((row, i) => row.forEach((v, j) => {
        const x = 60 + j * 64, y = 22 + i * 27;
        if (v === '?') {
          s += r(x, y, 58, 23, 4, 'none', L) + `<rect x="${x}" y="${y}" width="58" height="23" rx="4" fill="none" stroke="${V}" stroke-dasharray="3 3"/>`;
          s += t(x + 29, y + 16, '?', 9, V, 'middle');
        } else {
          s += r(x, y, 58, 23, 4, 'currentColor', null) + `<rect x="${x}" y="${y}" width="58" height="23" rx="4" fill="currentColor" fill-opacity="${0.08 + (+v) * 0.05}"/>`;
          s += t(x + 29, y + 16, v, 10, K, 'middle', 700);
        }
      }));
      s += t(30, 40, 'A', 9, V) + t(30, 67, 'B', 9, V) + t(30, 94, 'C', 9, V) + t(30, 121, 'D', 9, V);
      s += t(60, 16, '电影 1    电影 2    电影 3    电影 4', 8, V);
      return S(s);
    },
    /* 33 双塔 */
    twotower() {
      let s = '';
      s += r(26, 24, 92, 26, 5, 'none', L) + t(72, 41, '用户特征', 8, V, 'middle');
      s += l(72, 50, 72, 62, V, 0.6) + r(34, 62, 76, 30, 5, 'none', 'currentColor') + t(72, 81, 'NN', 9, 'currentColor', 'middle', 700);
      s += l(72, 92, 72, 104, V, 0.6) + t(72, 118, 'v_u', 9, K, 'middle', 700);
      s += r(242, 24, 92, 26, 5, 'none', L) + t(288, 41, '物品特征', 8, V, 'middle');
      s += l(288, 50, 288, 62, V, 0.6) + r(250, 62, 76, 30, 5, 'none', 'currentColor') + t(288, 81, 'NN', 9, 'currentColor', 'middle', 700);
      s += l(288, 92, 288, 104, V, 0.6) + t(288, 118, 'v_i', 9, K, 'middle', 700);
      s += `<circle cx="180" cy="86" r="18" fill="none" stroke="#f59e0b" stroke-width="1.6"/>`;
      s += t(180, 92, '·', 18, '#f59e0b', 'middle', 700);
      s += l(84, 110, 164, 92, V, 0.5, 1.1) + l(276, 110, 196, 92, V, 0.5, 1.1);
      s += t(180, 56, '点积 = 预测评分', 8.5, K, 'middle', 700);
      return S(s);
    },
    /* 34 PCA */
    pca() {
      let s = '';
      s += l(30, 116, 330, 52, '#dc2626', 0.9, 2);
      const pts = [[80, 96], [110, 88], [140, 84], [170, 74], [200, 66], [230, 60], [260, 54], [290, 44]];
      pts.forEach(([x, y]) => {
        s += l(x, y, x + (116 - y) * 0.18, y - (x - 30) * 0.18, '#f59e0b', 0.6, 1, '3 2');
        s += c(x, y, 3.2, 'currentColor');
      });
      s += t(238, 30, '第一主成分', 8.5, '#dc2626');
      s += l(120, 34, 96, 110, V, 0.5, 1.2, '5 4');
      s += t(54, 34, '短轴（丢弃）', 8.5, V);
      return S(s);
    },
    /* 35 火星车 */
    rover() {
      let s = '';
      const R = [100, 0, 0, 0, 0, 40], Q = [100, 90, 81, 73, 66, 40];
      for (let i = 0; i < 6; i++) {
        const x = 18 + i * 55;
        s += r(x, 34, 50, 56, 6, i === 0 ? '#dcfce7' : i === 5 ? '#fef3c7' : 'none', L);
        s += t(x + 25, 50, 'R', 7, V, 'middle');
        s += t(x + 25, 66, R[i], 10, i === 0 ? '#059669' : i === 5 ? '#d97706' : K, 'middle', 700);
        s += t(x + 25, 82, 'Q=' + Q[i], 7.5, V, 'middle');
      }
      s += l(18, 108, 330, 108, 'currentColor', 0.6, 1.4);
      s += t(18, 124, '策略：每格选 Q 更大的方向（γ=0.9 折扣）', 8.5, V);
      return S(s);
    },
    /* 36 贝尔曼 */
    bellman() {
      let s = '';
      s += `<circle cx="50" cy="66" r="20" fill="none" stroke="currentColor" stroke-width="1.6"/>` + t(50, 71, 's', 12, 'currentColor', 'middle', 700);
      s += l(72, 66, 112, 66, V, 0.7, 1.4);
      s += r(112, 46, 96, 40, 7, 'none', 'currentColor') + t(160, 62, '动作 a', 9, 'currentColor', 'middle', 700) + t(160, 77, 'R(s)', 8, V, 'middle');
      s += l(210, 66, 250, 66, V, 0.7, 1.4);
      s += `<circle cx="272" cy="66" r="20" fill="none" stroke="#059669" stroke-width="1.6"/>` + t(272, 71, "s′", 12, '#059669', 'middle', 700);
      s += t(302, 60, 'γ·max Q', 9, '#059669', 'start', 700);
      s += t(18, 116, 'Q(s,a) = R + γ · max Q(s′,a′)', 9.5, K, 'start', 700);
      return S(s);
    },
    /* 37 数据划分 */
    split() {
      let s = '';
      const seg = [['训练 60%', 0.6, 'currentColor'], ['验证 20%', 0.2, '#f59e0b'], ['测试 20%', 0.2, '#dc2626']];
      let x = 20;
      seg.forEach(([lab, wv, col]) => {
        const w = 320 * wv;
        s += r(x, 46, w - 4, 36, 6, col);
        s += `<text x="${x + w / 2 - 2}" y="69" font-size="9" fill="#fff" text-anchor="middle">${lab}</text>`;
        x += w;
      });
      s += t(20, 104, '训练学参数 · 验证选模型 · 测试只评一次', 8.5, V);
      return S(s);
    },
    /* 38 K 折 */
    kfold() {
      let s = '';
      for (let k = 0; k < 4; k++) {
        for (let j = 0; j < 5; j++) {
          const x = 66 + j * 54, y = 26 + k * 24;
          s += r(x, y, 50, 18, 4, j === k ? '#f59e0b' : 'none', L);
          s += t(x + 25, y + 13, j === k ? '验证' : '训练', 7.5, j === k ? '#fff' : V, 'middle');
        }
        s += t(24, 40 + k * 24, '第 ' + (k + 1) + ' 折', 8, V);
      }
      return S(s);
    },
    /* 39 独热 */
    onehot() {
      let s = '';
      [['猫', [1, 0, 0]], ['狗', [0, 1, 0]], ['兔', [0, 0, 1]]].forEach(([lab, v], i) => {
        const y = 28 + i * 34;
        s += t(24, y + 18, lab, 9, V);
        v.forEach((b, j) => {
          const x = 64 + j * 48;
          s += r(x, y, 42, 26, 5, b ? 'currentColor' : 'none', b ? null : L);
          s += t(x + 21, y + 18, b, 10, b ? '#fff' : V, 'middle', 700);
        });
      });
      s += t(212, 46, '类别之间没有大小关系', 8.5, V);
      return S(s);
    },
    /* 40 权重收缩 */
    shrink() {
      let s = '';
      const a = [0.9, 0.62, 0.4], b = [0.45, 0.3, 0.14];
      a.forEach((v, i) => {
        const x = 50 + i * 96;
        s += r(x, 100 - v * 80, 30, v * 80, 4, '#94a3b8');
        s += r(x + 34, 100 - b[i] * 80, 30, b[i] * 80, 4, 'currentColor');
        s += t(x + 32, 120, 'w' + (i + 1), 8.5, V, 'middle');
      });
      s += t(50, 22, '灰：λ=0', 8.5, V) + t(112, 22, '彩：λ>0 被压小', 8.5, 'currentColor');
      return S(s);
    },
    /* 41 训练循环 */
    loop() {
      let s = '';
      const items = [['前向', 26], ['损失', 104], ['反向', 182], ['更新', 260]];
      items.forEach(([lab, x], i) => {
        s += r(x, 44, 66, 34, 7, 'none', i === 3 ? '#059669' : 'currentColor');
        s += t(x + 33, 66, lab, 9, i === 3 ? '#059669' : 'currentColor', 'middle', 700);
        if (i < 3) s += l(x + 66, 61, x + 76, 61, V, 0.7, 1.3);
      });
      s += p('M293 80 C293 108 40 108 40 80', V, 1.2, 'none');
      s += `<path d="M293 80 C293 108 40 108 40 80" fill="none" stroke="${V}" stroke-width="1.2" stroke-dasharray="4 3"/>`;
      s += t(160, 122, '每个 epoch 重复一遍', 8.5, V, 'middle');
      return S(s);
    },
    /* 42 Jupyter 单元格 */
    cells() {
      let s = '';
      for (let i = 0; i < 3; i++) {
        const y = 18 + i * 34;
        s += r(40, y, 220, 28, 5, 'none', L);
        s += t(50, y + 18, i === 0 ? 'import numpy as np' : i === 1 ? 'X = np.array(...)' : 'model.fit(X, y)', 8, i === 0 ? V : K);
        s += t(274, y + 18, 'In [' + (i + 1) + ']', 7.5, V);
        if (i < 2) s += t(318, y + 18, '✓', 10, '#059669');
      }
      s += t(40, 130, '单元格逐个运行，变量留在内存里', 8.5, V);
      return S(s);
    },
    /* 43 特征组合爆炸 */
    explode() {
      let s = '';
      s += r(16, 40, 46, 46, 6, 'none', 'currentColor');
      s += t(39, 66, 'n', 12, 'currentColor', 'middle', 700);
      s += t(39, 100, '个特征', 8, V, 'middle');
      s += l(66, 63, 96, 63, V, 0.7, 1.4);
      s += t(110, 66, '平方 →', 9, V);
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++) {
        s += r(150 + j * 42, 26 + i * 22, 38, 18, 4, 'none', i === j ? 'currentColor' : L);
      }
      s += t(150, 126, 'n × n 个组合，手工造特征不现实', 8.5, V);
      return S(s);
    },
    /* 44 折扣回报 */
    discount() {
      let s = '';
      const v = [1, 0.9, 0.81, 0.73, 0.66];
      v.forEach((k, i) => {
        const x = 30 + i * 60, h = k * 62;
        s += r(x, 104 - h, 40, h, 4, 'currentColor', null);
        s += t(x + 20, 96 - h, k.toFixed(2), 8, K, 'middle', 700);
        s += t(x + 20, 122, 'r' + (i + 1), 8.5, V, 'middle');
      });
      s += t(30, 16, 'Return = r₁ + γr₂ + γ²r₃ + …  (γ = 0.9)', 9, K, 'start', 700);
      return S(s);
    },
  };
})();
