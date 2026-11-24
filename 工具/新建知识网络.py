"""一键新建一个知识点系列。

它会：
  1. 从 B 站拉真实分集目录（不会编集数）
  2. 按你给的分章范围生成 content JSON 骨架
  3. 调 规范/模板/build.py 渲染出 index.html
  4. 打印接下来要做的三件事

用法：
    python 工具/新建知识网络.py --name redis --bv BV1xxx ^
        --chapter "01:基础:1-30" --chapter "02:进阶:31-60"

    # 只生成数据，不渲染
    python 工具/新建知识网络.py --name redis --bv BV1xxx --chapter "01:基础:1-10" --no-build

之后编辑 content JSON，把每集的 pts 和 code 填上，再跑一次 --build-only。
"""

import argparse
import io
import json
import os
import re
import subprocess
import sys
import urllib.request

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
SERIES_DIR = os.path.join(ROOT, "mindmap")
BUILD = os.path.join(ROOT, "规范", "知识网络模板", "build.py")

PREFIX = ("基础-", "进阶-", "运维-", "优化-", "实战-")


def fetch(bv):
    req = urllib.request.Request(
        f"https://api.bilibili.com/x/web-interface/view?bvid={bv}",
        headers={
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 "
                          "(KHTML, like Gecko) Chrome/120.0 Safari/537.36",
            "Referer": "https://www.bilibili.com/",
        },
    )
    return json.load(urllib.request.urlopen(req, timeout=25))["data"]


def short(part):
    t = re.sub(r"^\d+[-_.]\s*", "", part).strip()
    for pre in PREFIX:
        if t.startswith(pre):
            t = t[len(pre):].strip(" -_")
    return t or part


def parse_chapter(s):
    """"01:基础篇:1-57" → ("01", "基础篇", 1, 57)"""
    parts = s.split(":")
    if len(parts) != 3:
        raise ValueError(f"分章格式不对：{s}（应为 编号:名称:起-止）")
    no, name, rng = parts
    lo, hi = rng.split("-")
    return no.strip(), name.strip(), int(lo), int(hi)


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--name", required=True, help="目录名，如 redis")
    ap.add_argument("--bv", required=True, help="B 站视频 BV 号")
    ap.add_argument("--chapter", action="append", default=[],
                    help='分章，可多次；如 "01:基础:1-30"')
    ap.add_argument("--title", default="", help="页面标题")
    ap.add_argument("--brand", default="", help="顶部品牌名")
    ap.add_argument("--active-tab", default="", help="导航里高亮哪个 tab")
    ap.add_argument("--no-build", action="store_true", help="只生成 JSON，不渲染")
    ap.add_argument("--build-only", action="store_true", help="只渲染已有 JSON")
    args = ap.parse_args()

    content_path = os.path.join(SERIES_DIR, args.name, "content", "content.json")
    out_path = os.path.join(SERIES_DIR, args.name, "index.html")

    if args.build_only:
        if not os.path.exists(content_path):
            print("没有 content JSON：", content_path)
            return 1
        return run_build(content_path, out_path)

    if not args.chapter:
        print("至少要给一个 --chapter")
        return 1

    data = fetch(args.bv)
    pages = {p["page"]: p["part"] for p in data["pages"]}
    print(f"拉到 {len(pages)} 集：{data['title'][:40]}")

    chapters = []
    for spec in args.chapter:
        no, name, lo, hi = parse_chapter(spec)
        eps = []
        for p in range(lo, hi + 1):
            if p not in pages:
                continue
            eps.append({"p": p, "t": short(pages[p]), "full": pages[p],
                        "pts": [], "code": ""})
        chapters.append({"no": no, "name": name, "eps": eps})
        print(f"  {no} {name}：{len(eps)} 集")

    total = sum(len(c["eps"]) for c in chapters)
    content = {
        "meta": {
            "title": args.title or f"{args.name} · 知识网络（{total} 集）",
            "brand": args.brand or args.name,
            "brand_sub": f"{total} 集 / {len(chapters)} 章",
            "desc": f"{args.name} 知识点网络，共 {total} 集。",
            "bv": args.bv,
            "out": out_path,
            "active_tab": args.active_tab or args.name,
        },
        "learned": [],
        "chapters": chapters,
        "knowledge": [],
    }

    os.makedirs(os.path.dirname(content_path), exist_ok=True)
    io.open(content_path, "w", encoding="utf-8", newline="\n").write(
        json.dumps(content, ensure_ascii=False, indent=2))

    print(f"\n生成骨架：{content_path}（{total} 集）")

    if args.no_build:
        print("没渲染。填完 pts/code 后跑： --build-only")
        return 0

    rc = run_build(content_path, out_path)
    print("\n接下来三件事：")
    print(f"  1. 填知识点：{content_path}")
    print("     pts 每集 5–6 条，写成「要点 —— 解释」；概念集给 code 或者留空")
    print(f"  2. 补全站入口：把 {args.name} 加进其它页面的顶部导航和页脚")
    print("  3. 体检：python 规范/知识网络体检.py --content <content.json> --html <index.html>")
    return rc


def run_build(content_path, out_path):
    cmd = [sys.executable, BUILD, content_path, "-o", out_path]
    return subprocess.call(cmd)


if __name__ == "__main__":
    sys.exit(main())
