# -*- coding: utf-8 -*-
"""知识点系列内容体检（不需要浏览器）。

用法：
    python 规范/内容体检.py --series series/ml-basics

检查项：
- 每集 concepts 6~9 个、quiz 4~5 道、takeaways 5 条
- 知识卡字段白名单、body 字数、重复标题
- HTML 只允许 <sub>/<sup>/<b>/<i>/<br>，禁止 LaTeX
- fig key 必须存在于 assets/figures.js
- 输出问题清单，有问题是 exit code 1
"""
import argparse
import glob
import json
import os
import re
import sys

TAGS = {'sub', 'sup', 'b', 'i', 'br'}
KEYS = {'h', 'lead', 'body', 'formula', 'list', 'table', 'code', 'fig', 'figCap', 'pitfall', 'tip', 'note'}
LATEX = re.compile(r'\$[^$]{1,80}\$|\\frac|\\sum|\\sigma|\\theta|\\beta|\\lambda')


def strings(o):
    if isinstance(o, str):
        yield o
    elif isinstance(o, dict):
        for v in o.values():
            yield from strings(v)
    elif isinstance(o, list):
        for v in o:
            yield from strings(v)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--series', required=True)
    args = ap.parse_args()
    series = os.path.abspath(args.series)
    content = os.path.join(series, 'content')
    figjs = os.path.join(series, 'assets', 'figures.js')
    if not os.path.isdir(content):
        sys.exit('找不到 content 目录：' + content)
    fig_keys = set()
    if os.path.exists(figjs):
        fig_keys = set(re.findall(r"F\['([^']+)'\]", open(figjs, encoding='utf-8').read()))

    meta = json.load(open(os.path.join(content, 'meta.json'), encoding='utf-8-sig'))
    eps = {e['no']: e for e in meta.get('episodes', [])}
    for p in glob.glob(os.path.join(content, 'ep*.json')):
        over = json.load(open(p, encoding='utf-8-sig'))
        eps[over['no']] = {**eps.get(over['no'], {}), **over}

    issues, warns = [], []
    total_c = total_q = 0
    for no in sorted(eps):
        e = eps[no]
        cs = e.get('concepts', [])
        qs = e.get('quiz', [])
        total_c += len(cs)
        total_q += len(qs)
        if not (6 <= len(cs) <= 9):
            warns.append('EP%02d concepts=%d（建议 6~9）' % (no, len(cs)))
        if not (4 <= len(qs) <= 5):
            warns.append('EP%02d quiz=%d（建议 4~5）' % (no, len(qs)))
        if len(e.get('takeaways', [])) != 5:
            warns.append('EP%02d takeaways=%d（建议 5 条）' % (no, len(e.get('takeaways', []))))
        titles = [c.get('h', '') for c in cs]
        if len(titles) != len(set(titles)):
            issues.append('EP%02d 知识点标题重复' % no)
        for c in cs:
            bad = set(c) - KEYS
            if bad:
                issues.append('EP%02d [%s] 未知字段 %s' % (no, c.get('h', '?'), bad))
            body = c.get('body') or ''
            if len(body) < 120:
                warns.append('EP%02d [%s] body 偏短 %d 字' % (no, c.get('h', '?'), len(body)))
            if c.get('fig') and fig_keys and c['fig'] not in fig_keys:
                issues.append('EP%02d 图 key 不存在：%s' % (no, c['fig']))
            if c.get('fig') and not c.get('figCap'):
                warns.append('EP%02d [%s] 有图但没有 figCap' % (no, c.get('h', '?')))
        for s in strings(e):
            for tag in re.findall(r'<([a-zA-Z]+)', s):
                if tag.lower() not in TAGS:
                    issues.append('EP%02d 未知 HTML 标签 <%s>' % (no, tag))
            if LATEX.search(s):
                issues.append('EP%02d 疑似 LaTeX：%s' % (no, s[:40]))

    print('系列：%s' % meta.get('meta', {}).get('short', ''))
    print('集数：%d，知识点：%d，自测：%d' % (len(eps), total_c, total_q))
    for w in warns:
        print('  [提醒]', w)
    for i in issues:
        print('  [问题]', i)
    print('内容体检：%d 个问题，%d 个提醒' % (len(issues), len(warns)))
    sys.exit(1 if issues else 0)


if __name__ == '__main__':
    main()
