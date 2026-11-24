"""内容体检：生成的知识页合不合格。

四道门禁：
  1. 内容 —— 每集有点知识点、条数够、没有空章
  2. 代码 —— 代码图覆盖率（低于 40% 提醒，不是报错）
  3. 渲染 —— 占位符有没有替换干净、JS 语法能不能过
  4. 链接 —— 分集链接是否成形

用法：
    python 规范/知识网络体检.py --content mindmap/xxx/content/content.json
    python 规范/知识网络体检.py --html mindmap/xxx/index.html
    python 规范/知识网络体检.py --content ... --html ...     # 两样都查

退出码：0 全部通过；1 有 FAIL。
"""

import argparse
import io
import json
import os
import re
import shutil
import subprocess
import sys
import tempfile

OK, WARN, FAIL = "PASS", "WARN", "FAIL"
rows = []


def add(level, item, detail=""):
    rows.append((level, item, detail))


def check_content(path):
    try:
        c = json.load(io.open(path, encoding="utf-8"))
    except Exception as e:
        add(FAIL, "读 content JSON", str(e))
        return None

    chapters = c.get("chapters", [])
    if not chapters:
        add(FAIL, "章节", "一章都没有")
        return c

    total = sum(len(ch.get("eps", [])) for ch in chapters)
    add(OK, "章节数", f"{len(chapters)} 章 / {total} 集")

    empty_ch = [ch.get("no", "?") for ch in chapters if not ch.get("eps")]
    add(FAIL if empty_ch else OK, "空章节", str(empty_ch) if empty_ch else "无")

    ps = [e["p"] for ch in chapters for e in ch["eps"]]
    dup = sorted({p for p in ps if ps.count(p) > 1})
    add(FAIL if dup else OK, "集号重复", str(dup) if dup else "无")

    no_pts = [e["p"] for ch in chapters for e in ch["eps"] if not e.get("pts")]
    add(FAIL if no_pts else OK, "缺知识点", str(no_pts[:20]) + ("…" if len(no_pts) > 20 else "") if no_pts else "0 集")

    thin = [e["p"] for ch in chapters for e in ch["eps"] if 0 < len(e.get("pts", [])) < 3]
    add(WARN if thin else OK, "知识点少于 3 条", str(thin[:20]) if thin else "无")

    bullets = sum(len(e.get("pts", [])) for ch in chapters for e in ch["eps"])
    avg = bullets / total if total else 0
    add(OK if avg >= 3 else WARN, "平均条数", f"{avg:.1f} 条/集（共 {bullets} 条）")

    flat = [e["p"] for ch in chapters for e in ch["eps"]
            if e.get("pts") and not any(" —— " in p for p in e["pts"])]
    add(WARN if flat else OK, "写法不合规", f"{len(flat)} 集没有用「 —— 」分隔" if flat else "全部合规")

    ncode = sum(1 for ch in chapters for e in ch["eps"] if e.get("code"))
    pct = ncode * 100 // total if total else 0
    add(WARN if pct < 40 else OK, "代码图覆盖", f"{ncode}/{total} 集（{pct}%）")

    keys = [k.get("key") for k in c.get("knowledge", [])]
    add(WARN if not keys else OK, "知识块", f"{len(keys)} 块" if keys else "没有知识块（可选）")

    known = set(ps)
    bad = [p for k in c.get("knowledge", []) for p in k.get("eps", []) if p not in known]
    add(FAIL if bad else OK, "知识块引用了不存在的集", str(bad) if bad else "无")

    meta = c.get("meta", {})
    add(FAIL if not meta.get("bv") else OK, "BV 号", meta.get("bv", "缺"))
    return c


def check_html(path):
    if not os.path.exists(path):
        add(FAIL, "HTML 文件", "不存在: " + path)
        return
    html = io.open(path, encoding="utf-8").read()
    add(OK, "HTML 大小", f"{len(html)/1024:.0f} KB")

    for k in ("__TABS__", "__TITLE__", "__BRAND__", "__BOARD__", "__LEARNED__",
              "__KNOWLEDGE__", "__BV__", "__DESC__"):
        if k in html:
            add(FAIL, "占位符未替换", k)
            break
    else:
        add(OK, "占位符", "已全部替换")

    need = {
        "三视图": "VIEW_ORDER",
        "详情抽屉": "dwTitle",
        "代码高亮": "function hl",
        "数据看板": "dashHTML",
        "执行顺序图": "flowHTML",
    }
    for name, key in need.items():
        add(OK if key in html else FAIL, name, "在" if key in html else "缺")

    bv = re.search(r'const BV = "([^"]+)"', html)
    add(OK if bv and bv.group(1) else FAIL, "BV 号",
        bv.group(1) if bv else "页面里没有 const BV")
    # 分集链接是 JS 里拼的，检查拼装函数 + 数据里的集号
    has_ep = "function epUrl" in html and "?p=" in html
    n_eps = len(re.findall(r'"p":\d+', html))
    add(OK if has_ep and n_eps else FAIL, "分集链接",
        f"epUrl() 在，数据里 {n_eps} 集" if has_ep and n_eps else "拼装函数或集号缺失")

    m = re.search(r"(?s)<script>(.*?)</script>", html)
    if not m:
        add(FAIL, "内联脚本", "没找到")
        return
    node = shutil.which("node")
    if not node:
        add(WARN, "JS 语法", "没装 node，跳过")
        return
    tmp = os.path.join(tempfile.gettempdir(), "_jhs_check.js")
    io.open(tmp, "w", encoding="utf-8").write(m.group(1))
    r = subprocess.run([node, "--check", tmp], capture_output=True, text=True)
    add(OK if r.returncode == 0 else FAIL, "JS 语法",
        "通过" if r.returncode == 0 else (r.stderr or "")[:160])


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--content", help="content JSON")
    ap.add_argument("--html", help="生成的 index.html")
    args = ap.parse_args()

    if not args.content and not args.html:
        ap.print_help()
        return 1

    if args.content:
        check_content(args.content)
    if args.html:
        check_html(args.html)

    w = max(len(r[1]) for r in rows)
    for level, item, detail in rows:
        mark = {OK: "  √", WARN: "  !", FAIL: "  ×"}[level]
        print(f"{mark} {item.ljust(w)}  {detail}")

    fails = sum(1 for r in rows if r[0] == FAIL)
    warns = sum(1 for r in rows if r[0] == WARN)
    print(f"\n{len(rows)} 项：通过 {len(rows)-fails-warns} / 提醒 {warns} / 失败 {fails}")
    return 1 if fails else 0


if __name__ == "__main__":
    sys.exit(main())
