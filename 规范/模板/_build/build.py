# -*- coding: utf-8 -*-
"""知识点系列站点构建脚本（模板版，自包含）。

用法（在系列目录下）：
    python _build/build.py            # 全量构建
    python _build/build.py --no-cheat # 暂不发布速查表

目录约定：
    <系列根>/
      assets/            style.css / app.js / figures.js（模板自带）
      content/           meta.json + epXX.json + cheatsheet.json + learnlog.json
      data/              构建产物：course-data.js / learnlog.js / compare.js / supplement.js
      _build/build.py    本脚本
      生成的 .html       直接放在系列根目录
"""
import argparse
import glob
import json
import os
import sys
import time

SERIES = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
CONTENT = os.path.join(SERIES, 'content')
ASSETS = os.path.join(SERIES, 'assets')
DATA = os.path.join(SERIES, 'data')
VER = time.strftime('%Y%m%d%H%M')


def load(name, default=None):
    p = os.path.join(CONTENT, name)
    if not os.path.exists(p):
        return default
    with open(p, encoding='utf-8-sig') as f:
        return json.load(f)


def merge(base, over):
    out = dict(base)
    for k, v in over.items():
        if k == 'no':
            continue
        out[k] = v
    return out


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--no-cheat', action='store_true')
    args = ap.parse_args()

    meta = load('meta.json')
    if not meta:
        sys.exit('缺少 content/meta.json')

    eps, missing = [], []
    known = {e['no'] for e in meta.get('episodes', [])}
    for ep in meta.get('episodes', []):
        over = load('ep%02d.json' % ep['no'])
        eps.append(merge(ep, over) if over else ep)
        if not over:
            missing.append(ep['no'])
    for path in sorted(glob.glob(os.path.join(CONTENT, 'ep*.json'))):
        over = load(os.path.basename(path))
        if over and over.get('no') not in known:
            eps.append(over)
    eps.sort(key=lambda e: e['no'])

    data = {
        'meta': meta['meta'],
        'modules': meta.get('modules', []),
        'episodes': eps,
        'cheatsheet': [] if args.no_cheat else (load('cheatsheet.json') or []),
        'log': load('learnlog.json') or {'entries': []},
    }

    os.makedirs(DATA, exist_ok=True)
    os.makedirs(ASSETS, exist_ok=True)
    with open(os.path.join(DATA, 'course-data.js'), 'w', encoding='utf-8') as f:
        f.write('/* 自动生成，勿手改 */\nwindow.ML15_COURSE = ' + json.dumps(data, ensure_ascii=False, indent=1) + ';\n')
    with open(os.path.join(DATA, 'learnlog.js'), 'w', encoding='utf-8') as f:
        f.write('window.ML15_LOG = ' + json.dumps(load('learnlog.json') or {'entries': []}, ensure_ascii=False, indent=1) + ';\n')

    cmpdata = load('compare.json')
    with open(os.path.join(DATA, 'compare.js'), 'w', encoding='utf-8') as f:
        f.write('window.ML15_COMPARE = ' + (json.dumps(cmpdata, ensure_ascii=False, indent=1) if cmpdata else 'null') + ';\n')
    supdata = load('supplement.json')
    with open(os.path.join(DATA, 'supplement.js'), 'w', encoding='utf-8') as f:
        f.write('window.ML15_SUPPLEMENT = ' + (json.dumps(supdata, ensure_ascii=False, indent=1) if supdata else 'null') + ';\n')

    concepts = sum(len(e.get('concepts', [])) for e in eps)
    quiz = sum(len(e.get('quiz', [])) for e in eps)
    print('系列：%s' % meta['meta'].get('short', ''))
    print('集数：%d，知识点：%d，自测：%d，速查表：%d 组' % (len(eps), concepts, quiz, len(data['cheatsheet'])))
    for e in eps:
        print('  EP%02d %-24s concepts=%-2d %s' % (
            e['no'], (e.get('short') or '')[:22], len(e.get('concepts', [])),
            '' if e.get('concepts') else '<< 待补内容'))

    # 清掉多余的分集页面
    for p in glob.glob(os.path.join(SERIES, 'ep*.html')):
        base = os.path.basename(p)
        try:
            no = int(base[2:4])
        except ValueError:
            continue
        if no not in {e['no'] for e in eps}:
            os.remove(p)

    has_cmp = bool(cmpdata)
    has_sup = bool(supdata)

    tpl = '''<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>{title}</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta name="ml15-version" content="{ver}">
<link rel="icon" href="assets/favicon.svg" type="image/svg+xml">
<link rel="stylesheet" href="assets/style.css?v={ver}">
{brand}
</head>
<body data-page="{page}"{extra}>
<div id="app"></div>
<script src="data/course-data.js?v={ver}"></script>
<script src="data/learnlog.js?v={ver}"></script>
<script src="data/compare.js?v={ver}"></script>
<script src="data/supplement.js?v={ver}"></script>
<script src="assets/figures.js?v={ver}"></script>
<script src="assets/app.js?v={ver}"></script>
</body>
</html>
'''
    pages = [('index.html', 'home', meta['meta'].get('title', '知识笔记'),
              meta['meta'].get('short', '') + ' · 图解笔记', '')]
    for e in eps:
        pages.append(('ep%02d.html' % e['no'], 'episode',
                      'EP%02d %s · %s' % (e['no'], e.get('title', ''), meta['meta'].get('short', '')),
                      e.get('oneLiner', ''), ' data-ep="%d"' % e['no']))
    pages.append(('cheatsheet.html', 'cheat', '一页速查 · ' + meta['meta'].get('short', ''), '公式 / 指标 / 选型速查表。', ''))
    pages.append(('learn-log.html', 'log', '学习记录 · ' + meta['meta'].get('short', ''), '课程观看时间与学习进度记录。', ''))
    if has_cmp:
        pages.append(('compare.html', 'compare', '对比参考课程 · ' + meta['meta'].get('short', ''),
                      '逐知识点对比：已覆盖 / 部分 / 未覆盖。', ''))
    if has_sup:
        pages.append(('supplement.html', 'supplement', '知识点补充 · ' + meta['meta'].get('short', ''),
                      '参考课程里本课程没讲到、或只讲一半的知识点。', ''))

    for fn, page, title, desc, extra in pages:
        with open(os.path.join(SERIES, fn), 'w', encoding='utf-8') as f:
            f.write(tpl.format(title=title, desc=desc, page=page, extra=extra, ver=VER, brand=''))
    print('生成 %d 个页面（v%s）' % (len(pages), VER))


if __name__ == '__main__':
    main()
