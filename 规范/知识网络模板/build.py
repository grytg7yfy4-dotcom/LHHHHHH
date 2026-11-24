"""把 content JSON + template.html 渲染成一个知识页。

用法：
    python build.py content/示例.json -o ../../mindmap/xxx/index.html
    python build.py content/示例.json            # 输出路径取 JSON 里的 meta.out

JSON 结构见 规范/知识网络规范.md。
"""

import argparse
import io
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
TEMPLATE = os.path.join(HERE, "template.html")

# 全站导航：(文字, 相对知识页的链接)
TABS = [
    ("主页", "../../index.html"),
    ("博客", "../../blog/"),
    ("知识地图", "../index.html"),
    ("前端基础", "../web/index.html"),
    ("Vue3 导图", "../vue3/index.html"),
    ("Python 导图", "../python.html"),
    ("Python 后端", "../fastapi/index.html"),
    ("数据库", "../database/index.html"),
    ("机器学习导图", "../../ml/index.html"),
]


def render(content, template_path=TEMPLATE):
    tpl = io.open(template_path, encoding="utf-8").read()
    meta = content.get("meta", {})

    board = content.get("chapters", [])
    active = meta.get("active_tab", "")

    tabs = meta.get("tabs")
    if tabs:
        tabs_html = "".join(
            '<a href="%s"%s>%s</a>' % (t["href"], ' class="on"' if t.get("on") else "", t["label"])
            for t in tabs
        )
    else:
        tabs_html = "".join(
            '<a href="%s"%s>%s</a>' % (href, ' class="on"' if label == active else "", label)
            for label, href in TABS
        )

    html = (tpl
            .replace("__TABS__", tabs_html)
            .replace("__TITLE__", meta.get("title", "知识网络"))
            .replace("__BRAND__", meta.get("brand", "知识网络"))
            .replace("__BRAND_SUB__", meta.get("brand_sub", ""))
            .replace("__DESC__", meta.get("desc", ""))
            .replace("__BOARD__", json.dumps(board, ensure_ascii=False, separators=(",", ":")))
            .replace("__LEARNED__", json.dumps(sorted(content.get("learned", []))))
            .replace("__KNOWLEDGE__", json.dumps(content.get("knowledge", []),
                                                 ensure_ascii=False, separators=(",", ":")))
            .replace("__BV__", meta.get("bv", "")))
    return html


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("content", help="content JSON 路径")
    ap.add_argument("-o", "--out", help="输出 HTML 路径（默认用 meta.out）")
    args = ap.parse_args()

    content = json.load(io.open(args.content, encoding="utf-8"))
    out = args.out or content.get("meta", {}).get("out")
    if not out:
        print("没给 -o，JSON 里也没有 meta.out")
        return 1

    html = render(content)
    left = [k for k in ("__TABS__", "__TITLE__", "__BRAND__", "__DESC__",
                        "__BOARD__", "__LEARNED__", "__KNOWLEDGE__", "__BV__") if k in html]
    if left:
        print("还有占位符没替换：", left)
        return 1

    os.makedirs(os.path.dirname(os.path.abspath(out)), exist_ok=True)
    io.open(out, "w", encoding="utf-8", newline="\n").write(html)

    total = sum(len(c.get("eps", [])) for c in content.get("chapters", []))
    nopts = [e["p"] for c in content.get("chapters", []) for e in c.get("eps", []) if not e.get("pts")]
    ncode = sum(1 for c in content.get("chapters", []) for e in c.get("eps", []) if e.get("code"))

    print(f"写出 {out}")
    print(f"  {total} 集 / {len(content.get('chapters', []))} 章 / {len(html)/1024:.0f} KB")
    print(f"  带代码 {ncode} 集（{ncode*100//max(total,1)}%）")
    if nopts:
        print(f"  缺知识点：{nopts}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
