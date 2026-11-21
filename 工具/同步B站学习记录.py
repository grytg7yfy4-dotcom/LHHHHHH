# -*- coding: utf-8 -*-
"""
同步 B 站「机器学习」合集的观看记录到博客学习记录页。

用法（在仓库根目录或任意目录运行都行）：
    python 工具/同步B站学习记录.py                # 读取 工具/bili_cookie.txt
    python 工具/同步B站学习记录.py --cookie "SESSDATA=xxx"   # 直接传
    set BILI_SESSDATA=xxx & python 工具/同步B站学习记录.py   # 环境变量

SESSDATA 怎么拿：
    浏览器登录 bilibili.com → F12 → Application / 应用 → Cookies → https://www.bilibili.com
    → 找到 SESSDATA，复制它的值（一长串，不要带引号）。只用于读取你自己的观看历史。

脚本只读历史，不会发弹幕 / 点赞 / 投币，也不会把 Cookie 写到任何地方（除非你自己建 cookie 文件）。
"""
import argparse
import datetime
import json
import os
import sys
import time
import urllib.parse
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
COOKIE_FILE = os.path.join(ROOT, '工具', 'bili_cookie.txt')
OUT_FILE = os.path.join(ROOT, 'ml15', 'data', 'learnlog.js')

UA = ('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 '
      '(KHTML, like Gecko) Chrome/120.0 Safari/537.36')
HEADERS = {
    'User-Agent': UA,
    'Referer': 'https://www.bilibili.com/',
    'Accept': 'application/json, text/plain, */*',
}

# 合集信息（和 ml15/assets/course-data.js 保持一致）
SEASON_URL = 'https://www.bilibili.com/video/BV1M8D7BWEVQ'
EPISODES = [
    (1, 'BV13bZYBREgr', 1015, 'intro'), (2, 'BV1BnZZBTEcL', 1134, 'intro'),
    (3, 'BV1n3fzBsEu6', 1009, 'intro'), (4, 'BV1xrNGzrEJx', 1236, 'regression'),
    (5, 'BV1cpwuz7EgF', 1770, 'regression'), (6, 'BV1cGA3zREMA', 2157, 'regression'),
    (7, 'BV1nRXVBBEc4', 864, 'regression'), (8, 'BV1Hb9EB9ESo', 1322, 'regression'),
    (9, 'BV1gZDVBUEqC', 1762, 'classification'), (10, 'BV1M8D7BWEVQ', 1024, 'classification'),
    (11, 'BV1NgQuBFEVY', 777, 'ensemble'), (12, 'BV1QdQJBTEGV', 1430, 'ensemble'),
    (13, 'BV17Nd5BrEQS', 1046, 'unsupervised'), (14, 'BV1YMoDBuEm2', 1339, 'unsupervised'),
    (15, 'BV1GsofB8Eej', 1354, 'summary'),
]
TITLES = {
    1: '人工智能通识：什么是智能、智能从何而来', 2: '机器学习是什么：通过数据学习规律，对未来预测',
    3: '机器学习类型：监督学习、非监督学习、强化学习', 4: '线性回归——机器学习的第一个模型',
    5: '梯度下降——模型如何自己学会找最优参数', 6: '数据预处理全攻略',
    7: '拟合前提——线性回归模型评估', 8: '欠拟合与过拟合问题诊断与解决',
    9: '逻辑回归', 10: '决策树——会 if...else 就能懂的机器学习算法',
    11: '随机森林——决策树模型升级版', 12: '集成学习之 Boosting 模型——XGBoost、LightGBM、CatBoost',
    13: 'K-Means 聚类', 14: 'PCA 主成分分析，机器学习最后一个模型',
    15: '机器学习课程总结与深度学习展望',
}
BV2NO = {bv: no for no, bv, _, _ in EPISODES}
META = {no: (dur, mod) for no, _, dur, mod in EPISODES}
FIRST_PUB = 1771472753  # 2026-02-19，合集第一集发布时间


def die(msg):
    print('\n[失败] ' + msg)
    sys.exit(1)


def read_sessdata(cli):
    if cli:
        s = cli.strip()
        return s.split('=', 1)[1].strip() if s.upper().startswith('SESSDATA=') else s
    env = os.environ.get('BILI_SESSDATA', '').strip()
    if env:
        return env
    if os.path.exists(COOKIE_FILE):
        for line in open(COOKIE_FILE, encoding='utf-8-sig'):
            line = line.strip()
            if not line or line.startswith('#'):
                continue
            if line.upper().startswith('SESSDATA='):
                line = line.split('=', 1)[1].strip()
            return line.strip('"').strip("'")
    # 交互式运行（双击 .bat）时直接粘贴
    try:
        if sys.stdin and sys.stdin.isatty():
            print('没有找到 工具/bili_cookie.txt。')
            print('SESSDATA 获取：浏览器登录 B 站 → F12 → Application → Cookies → bilibili.com → SESSDATA')
            s = input('直接粘贴 SESSDATA（回车退出）：').strip().strip('"').strip("'")
            if s:
                return s.split('=', 1)[1].strip() if s.upper().startswith('SESSDATA=') else s
    except (EOFError, OSError):
        pass
    die('没有找到 SESSDATA。\n'
        '  方式一：新建 工具/bili_cookie.txt，里面写一行 SESSDATA=你的值\n'
        '  方式二：python 工具/同步B站学习记录.py --cookie "SESSDATA=你的值"\n'
        '  SESSDATA 获取：浏览器登录 B 站 → F12 → Application → Cookies → bilibili.com → SESSDATA')


def api_get(url, sessdata, retries=3):
    req = urllib.request.Request(url, headers=dict(HEADERS, Cookie='SESSDATA=' + sessdata))
    last = None
    for i in range(retries):
        try:
            with urllib.request.urlopen(req, timeout=20) as r:
                return json.loads(r.read().decode('utf-8'))
        except Exception as e:  # noqa
            last = e
            time.sleep(1.2 + i)
    die('请求失败：%s\n  （校园网 / 代理环境下可稍后重试，或检查网络）' % last)


def fetch_history(sessdata, max_pages=12):
    items, cursor = [], {'max': 0, 'view_at': 0, 'business': ''}
    for page in range(max_pages):
        q = urllib.parse.urlencode({'max': cursor.get('max', 0), 'view_at': cursor.get('view_at', 0),
                                    'business': cursor.get('business', ''), 'ps': 30})
        j = api_get('https://api.bilibili.com/x/web-interface/history/cursor?' + q, sessdata)
        if j.get('code') != 0:
            if j.get('code') in (-101, -400):
                die('SESSDATA 无效 / 已过期 / 被风控（%s）。请重新登录 B 站，'
                    'F12 → Application → Cookies → bilibili.com → 复制新的 SESSDATA 再试。' % j.get('code'))
            die('B 站接口返回：%s %s' % (j.get('code'), j.get('message')))
        data = j.get('data') or {}
        lst = data.get('list') or []
        items.extend(lst)
        cursor = data.get('cursor') or {}
        oldest = min([it.get('view_at', 0) for it in lst] or [0])
        print('  第 %d 页：%d 条（最早 %s）' % (page + 1, len(lst),
              datetime.datetime.fromtimestamp(oldest).strftime('%Y-%m-%d') if oldest else '-'))
        if not lst or oldest < FIRST_PUB or not cursor.get('view_at'):
            break
        time.sleep(0.4)
    return items


def build_log(items):
    best = {}
    for it in items:
        h = it.get('history') or {}
        bv = h.get('bvid') or it.get('bvid') or ''
        no = BV2NO.get(bv)
        if not no:
            continue
        view_at = int(it.get('view_at') or 0)
        raw = int(it.get('progress') or 0)
        duration = int(it.get('duration') or META[no][0])
        # B 站历史里 progress = -1 表示「已看完」（player 接口对应 last_play_time=-1000ms）
        finished = raw < 0
        progress = duration if finished else raw
        cur = best.get(no)
        if (not cur) or view_at > cur['view_at'] or (view_at == cur['view_at'] and progress > cur['progress']):
            best[no] = {'view_at': view_at, 'progress': progress, 'duration': duration, 'finished': finished}
    entries = []
    for no, r in sorted(best.items(), key=lambda kv: kv[1]['view_at'], reverse=True):
        dt = datetime.datetime.fromtimestamp(r['view_at'])
        pct = 100 if r['finished'] else min(100, round(r['progress'] / max(1, r['duration']) * 100))
        watched = pct >= 85
        if r['finished']:
            detail = '已看完（B 站进度标记为完整观看）'
        elif pct >= 85:
            detail = '观看 %s / %s，进度 %d%%（接近看完）' % (mmss(r['progress']), mmss(r['duration']), pct)
        else:
            detail = '观看 %s / %s，进度 %d%%' % (mmss(r['progress']), mmss(r['duration']), pct)
        entries.append({
            'no': no,
            'date': dt.strftime('%Y-%m-%d'),
            'time': dt.strftime('%H:%M'),
            'title': 'EP%02d %s' % (no, TITLES[no]),
            'detail': detail,
            'module': META[no][1],
            'watched': watched,
            'viewAt': r['view_at'],
            'progress': r['progress'],
            'duration': r['duration'],
        })
    return entries


def mmss(s):
    s = max(0, int(s))
    return '%d:%02d' % (s // 60, s % 60)


def write_log(entries):
    total = sum(e['duration'] for e in entries if e['watched'])
    payload = {
        'syncedAt': datetime.datetime.now().strftime('%Y-%m-%d %H:%M'),
        'source': 'bilibili',
        'season': SEASON_URL,
        'entries': entries,
        'summary': {'episodes': len(entries), 'watched': sum(1 for e in entries if e['watched']),
                    'watchedSeconds': total},
    }
    os.makedirs(os.path.dirname(OUT_FILE), exist_ok=True)
    with open(OUT_FILE, 'w', encoding='utf-8') as f:
        f.write('window.ML15_LOG = ' + json.dumps(payload, ensure_ascii=False, indent=1) + ';\n')
    return payload


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--cookie', help='SESSDATA 的值，或 "SESSDATA=..."')
    ap.add_argument('--dry-run', action='store_true', help='只打印，不写文件')
    args = ap.parse_args()
    sess = read_sessdata(args.cookie)
    print('正在读取 B 站观看历史 ...')
    items = fetch_history(sess)
    print('共拿到 %d 条历史记录' % len(items))
    entries = build_log(items)
    if not entries:
        print('\n[提示] 历史里没有找到这个合集的记录。可能原因：')
        print('  - 没在这个账号看过（或看的时候没登录）')
        print('  - 观看记录被清理了')
        print('  - 只看过合集以外的分 P / 搬运版本（BVID 对不上）')
        return
    print('\n匹配到 %d 集：' % len(entries))
    for e in entries:
        print('  EP%02d %s %s %s' % (e['no'], e['date'], e['time'], e['detail']))
    payload = {'entries': entries}
    if args.dry_run:
        print('\n[dry-run] 未写入文件')
        print(json.dumps(payload, ensure_ascii=False, indent=1)[:1200])
        return
    payload = write_log(entries)
    print('\n已写入：%s' % OUT_FILE)
    print('同步时间：%s；已看 %d 集，累计 %d 分钟' % (
        payload['syncedAt'], payload['summary']['watched'],
        round(payload['summary']['watchedSeconds'] / 60)))
    print('\n下一步：')
    print('  git add ml15/data/learnlog.js')
    print('  git commit -m "feat(ml15): 同步 B 站学习记录"')
    print('  git push')


if __name__ == '__main__':
    main()
