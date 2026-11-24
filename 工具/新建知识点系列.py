# -*- coding: utf-8 -*-
"""新建一个「知识点总结」系列：拉取 B 站合集 / 分 P 的目录，生成可构建的站点骨架。

用法（在仓库根目录）：
    python 工具/新建知识点系列.py --bvid BV1M8D7BWEVQ --slug ml-basics --title "机器学习 15 讲"
    python 工具/新建知识点系列.py --url "https://www.bilibili.com/video/BV1owrpYKEtP" --slug ml-ng

生成位置默认在 `series/<slug>/`，包含：
    assets/           复用的样式 / 渲染器 / 图库
    content/meta.json 系列元数据 + 每集标题、时长、B 站章节
    content/epXX.json 每集内容骨架（待填 concepts / quiz）
    _build/build.py   构建脚本（python _build/build.py）

之后：填 content/*.json → 构建 → 本地预览 → 提交推送。
"""
import argparse
import datetime
import json
import os
import re
import shutil
import sys
import time
import urllib.parse
import urllib.request

REPO = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
TEMPLATE = os.path.join(REPO, '规范', '模板')
UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36')
HEADERS = {'User-Agent': UA, 'Referer': 'https://www.bilibili.com/'}


def api(url, retries=3):
    req = urllib.request.Request(url, headers=HEADERS)
    last = None
    for i in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.loads(r.read().decode('utf-8'))
        except Exception as e:  # noqa
            last = e
            time.sleep(1 + i)
    sys.exit('请求失败：%s\n%s' % (url, last))


def parse_bvid(s):
    m = re.search(r'(BV[0-9A-Za-z]{10})', s or '')
    return m.group(1) if m else None


def chapters_of(aid, cid):
    j = api('https://api.bilibili.com/x/player/v2?aid=%s&cid=%s' % (aid, cid))
    pts = ((j.get('data') or {}).get('view_points') or [])
    return [{'from': int(p.get('from', 0)), 'to': int(p.get('to', 0)), 'title': p.get('content', '')} for p in pts]


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--bvid', help='BV 号，或直接用 --url')
    ap.add_argument('--url', help='B 站视频链接')
    ap.add_argument('--slug', default='', help='目录名，默认 series/<BV号小写>')
    ap.add_argument('--title', default='', help='系列标题，默认取 B 站合集标题')
    ap.add_argument('--up', default='', help='UP 主名字，默认取接口')
    ap.add_argument('--module', default='全部', help='默认模块名')
    args = ap.parse_args()

    bvid = parse_bvid(args.url or args.bvid or '')
    if not bvid:
        sys.exit('需要 --bvid BVxxxx 或 --url 链接')
    view = api('https://api.bilibili.com/x/web-interface/view?bvid=' + bvid)
    if view.get('code') != 0:
        sys.exit('B 站接口返回：%s %s' % (view.get('code'), view.get('message')))
    d = view['data']
    up = args.up or (d.get('owner') or {}).get('name', '')
    season = d.get('ugc_season')
    title = args.title or (season or {}).get('title') or d.get('title') or bvid
    slug = args.slug or ('series/' + bvid.lower())

    eps = []
    if season:
        episodes = season['sections'][0]['episodes']
        for i, e in enumerate(episodes, 1):
            dur = int(e.get('page', {}).get('duration') or (e.get('arc') or {}).get('duration') or 0)
            pub = int((e.get('arc') or {}).get('pubdate') or 0)
            eps.append({
                'no': i, 'bvid': e['bvid'], 'aid': e['aid'], 'cid': e['cid'],
                'title': e['title'], 'duration': dur,
                'publish': datetime.datetime.fromtimestamp(pub).strftime('%Y-%m-%d') if pub else '',
            })
    elif d.get('pages'):
        pub = int(d.get('pubdate') or 0)
        for i, p in enumerate(d['pages'], 1):
            eps.append({
                'no': i, 'bvid': bvid, 'aid': d['aid'], 'cid': p['cid'],
                'title': p.get('part') or ('P%d' % i), 'duration': int(p.get('duration') or 0),
                'publish': datetime.datetime.fromtimestamp(pub).strftime('%Y-%m-%d') if pub else '',
            })
    else:
        eps.append({'no': 1, 'bvid': bvid, 'aid': d['aid'], 'cid': d['cid'],
                    'title': d.get('title', ''), 'duration': int(d.get('duration') or 0),
                    'publish': datetime.datetime.fromtimestamp(int(d.get('pubdate') or 0)).strftime('%Y-%m-%d')})

    target = os.path.join(REPO, slug)
    if os.path.exists(target) and os.listdir(target):
        sys.exit('目标目录已存在且非空：%s\n换一个 --slug，或先手动清空。' % target)
    os.makedirs(os.path.dirname(target), exist_ok=True)
    shutil.copytree(TEMPLATE, target, dirs_exist_ok=True)
    # 清掉模板示例内容
    for name in os.listdir(os.path.join(target, 'content')):
        if re.match(r'ep\d+\.json$', name):
            os.remove(os.path.join(target, 'content', name))

    total = 0
    for e in eps:
        print('拉取章节 EP%02d %s ...' % (e['no'], e['title'][:30]))
        try:
            e['chapters'] = chapters_of(e['aid'], e['cid'])
        except Exception:
            e['chapters'] = []
        total += e['duration']
        time.sleep(0.25)

    meta = {
        'meta': {
            'title': title + ' · 图解笔记',
            'short': title,
            'up': up,
            'owner': '廖恒',
            'bvid': bvid,
            'seasonUrl': 'https://www.bilibili.com/video/' + bvid,
            'repo': 'https://github.com/grytg7yfy4-dotcom/LHHHHHH',
            'site': '',
            'totalSec': total,
            'builtAt': datetime.date.today().isoformat(),
            'ui': {
                'kicker': 'B 站 · %s · %d 集' % (up, len(eps)),
                'heroTitle': '',
                'heroLead': '把 %d 集视频拆成 %d 页知识笔记、{concepts} 个知识点，配公式、图、代码、易错点和自测题。' % (len(eps), len(eps)),
                'heroCaption': '',
                'cta': '从第 1 集开始 →',
                'footerSeries': title,
                'compareLabel': '对比参考课程',
                'compareTitle': '本课程 vs 参考课程',
                'compareSub': '逐知识点对比：哪些讲透了、哪些只讲一半、哪些没讲。',
                'suppTitle': '知识点补充',
                'heroFigure': False,
                'qxName': title,
                'refName': '参考课程',
                'navExtra': [],
            },
        },
        'modules': [{'id': 'all', 'name': args.module, 'desc': ''}],
        'episodes': [{
            'no': e['no'], 'bvid': e['bvid'], 'aid': e['aid'], 'cid': e['cid'],
            'title': e['title'], 'short': e['title'][:18], 'module': 'all',
            'duration': e['duration'], 'publish': e['publish'], 'tags': [],
            'oneLiner': '', 'core': '', 'takeaways': [], 'chapters': e['chapters'],
        } for e in eps],
        'cheatsheet': [],
    }
    with open(os.path.join(target, 'content', 'meta.json'), 'w', encoding='utf-8') as f:
        json.dump(meta, f, ensure_ascii=False, indent=1)
    for e in eps:
        stub = {'no': e['no'], 'short': e['title'][:18], 'oneLiner': '', 'core': '',
                'takeaways': [], 'concepts': [], 'quiz': []}
        with open(os.path.join(target, 'content', 'ep%02d.json' % e['no']), 'w', encoding='utf-8') as f:
            json.dump(stub, f, ensure_ascii=False, indent=1)

    print('\n完成：%s' % target)
    print('共 %d 集，总时长 %d 分 %d 秒' % (len(eps), total // 60, total % 60))
    print('\n下一步：')
    print('  1) 写内容：content/ep01.json … ep%02d.json（每个 6~9 个 concepts + 4~5 道 quiz）' % len(eps))
    print('  2) 补 content/cheatsheet.json（公式 / 指标 / 选型）')
    print('  3) 构建：python "%s\\_build\\build.py"' % target)
    print('  4) 预览：python -m http.server 8787 --directory "%s"' % target)
    print('  5) 提交：git add "%s" && git commit -m "feat(%s): 新增知识点系列" && git push' % (slug, slug))


if __name__ == '__main__':
    main()
