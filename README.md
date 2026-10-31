# 廖恒 · 学习进度

网安所 8 周通关计划的任务勾选、验收物跟踪、学习笔记，外加一个博客和一个知识地图。
纯静态站，没有框架、没有构建步骤，推上 GitHub Pages 就是一个网址。

- 站点：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/>
- 博客：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/blog/>
- 知识地图：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/mindmap/>
- Python 导图：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/mindmap/python.html>
- 案例库：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/mindmap/cases.html>
- 计划：2026-10-26 → 2026-12-26

## 五个页面

| 页面 | 入口 | 管什么 | 数据在哪 |
| --- | --- | --- | --- |
| 主页 | `/` | 进度勾选、8 周计划、笔记速览 | `data/plan.js`、`data/notes.js`、`data/progress.js` |
| 博客 | `/blog/` | 把笔记当文章读：按月份归档、分类筛选、全文搜索，每篇有独立链接 | 复用 `data/notes.js` |
| 知识地图 | `/mindmap/` | 阶段 → 节点的依赖图，点节点看说明与验收标准 | `mindmap/data.js` |
| Python 导图 | `/mindmap/python.html` | 黑马 Python 1-123 集，13 章 90 个知识点；点开看解析、语法和示例代码，可搜索、标记已掌握 | `mindmap/python/data-*.js` |
| 案例库 | `/mindmap/cases.html` | 1-123 集的综合案例：题目、思路、答案代码、运行结果 | `mindmap/cases-data.js` |

博客和主页用的是**同一份笔记数据**，不会出现「主页有、博客没有」。加一篇笔记，两边同时多一篇。

## 目录

```
.
├─ index.html            页面骨架（进度 / 计划 / 笔记 / 说明 四个标签）
├─ css/style.css         全部样式，改主色只动最上面的 --accent
├─ js/md.js              极简 Markdown 渲染器（无依赖，三个页面共用）
├─ js/mode.js            只读 / 可编辑判定（线上只读，本地可编辑）
├─ js/app.js             渲染逻辑、进度存储、导入导出
├─ data/plan.js          8 周计划：任务、验收物、常见坑、三条线、自测清单
├─ data/notes.js         笔记（＝博客的文章）
├─ data/progress.js      进度存档（跨设备的载体）
├─ blog/
│  ├─ index.html         博客页骨架
│  ├─ blog.css           博客页样式（复用 css/style.css 的变量）
│  └─ blog.js            归档、筛选、搜索、正文渲染
├─ mindmap/
│  ├─ index.html         知识地图骨架
│  ├─ python.html        Python 1-123 集学习地图页
│  ├─ python.css         导图页样式（复用 css/style.css 的变量）
│  ├─ python.js          树状布局、搜索、详情面板、进度存储
│  ├─ python/            知识点数据：data-a~d.js，共 13 章 90 个知识点
│  ├─ cases.html         综合案例库页（题目 / 思路 / 代码 / 运行结果）
│  ├─ cases.css          案例库样式
│  ├─ cases.js           目录、筛选、复制代码
│  ├─ cases-data.js      25 个案例的题目、思路、答案代码
│  ├─ map.css            画布、节点、详情抽屉的样式
│  ├─ map.js             布局、缩放拖拽、选中高亮
│  └─ data.js            阶段 / 节点 / 连线（唯一要改的数据文件）
├─ .github/workflows/pages.yml   推 main 就自动发布到 Pages
├─ .nojekyll             让 GitHub Pages 跳过 Jekyll 处理
└─ 启动预览.bat          本地起个服务，方便手机连同一个 WiFi 看
```

## 三条使用路径

**只是看看**：双击 `index.html`。数据是 `data/*.js` 直接加载的，`file://` 下也能正常打开，不需要服务器。

**记进度**：在页面上勾任务 → 点「导出进度」→ 下载的 `progress.js` 覆盖 `data/progress.js` → 提交推送。勾选会即时存在浏览器 localStorage 里，但只有写回仓库才算真正存住。

**写笔记**：在 `data/notes.js` 里加一段，或在 GitHub 网页上编辑这个文件，提交后一分钟自动部署。

## 别人看到的是只读版

线上（`*.github.io`）打开时自动进**只读模式**：勾选框点不动，导出 / 导入 / 清空三个按钮不显示，
顶部有一条黄色提示，进度只显示仓库里 `data/progress.js` 的那份存档。

判断规则在 `js/mode.js`，四条：

| 打开方式 | 模式 |
| --- | --- |
| `https://……github.io/……` | 只读 |
| `http://localhost:8000`、`127.0.0.1` | 可编辑 |
| 双击 `index.html`（`file://`） | 可编辑 |
| 任意地址加 `?edit=1` / `?ro=1` | 强制可编辑 / 强制只读 |

所以：**在线上勾选不会保存，也不会影响仓库**；想更新别人看到的进度，只能本地勾完 → 导出 `progress.js`
→ 覆盖 `data/progress.js` → push。手机上想看只读效果，用 `…/index.html?ro=1` 就行；
想在线上临时勾一下（比如手机），用 `…/index.html?edit=1`，那只写进你自己浏览器，不进仓库。

## 加一篇笔记

```js
{
  "id": "n-20261027-1",     // 唯一
  "date": "2026-10-27",     // 决定归到哪个月
  "category": "FastAPI",
  "title": "day1：第一个接口",
  "tags": ["路由", "Pydantic"],
  "content": "正文，支持 Markdown：标题、列表、表格、代码块、引用、- [ ] 待办"
}
```

加完刷新博客页就多一篇；点开某篇，地址栏是 `blog/#p/n-20261027-1`，可以直接发给别人。

## 加一个知识节点

打开 `mindmap/data.js`：在 `nodes` 里加一条（`stage` 选已有的阶段），再在 `edges` 里接上它：

```js
{ "id": "pydantic", "stage": "be", "kind": "todo", "label": "Pydantic 校验",
  "detail": "请求体校验、字段约束、422 错误的含义。", "links": [] }

// edges 里加：
["fastapi", "pydantic"]
```

`kind` 只有三种：`done`（绿）、`doing`（黄）、`todo`（灰）。

## 部署（设置一次，之后每次 push 自动重建）

1. 仓库 → **Settings** → 左侧 **Pages**
2. **Build and deployment** 的 Source 选 **Deploy from a branch**
3. Branch 选 `main`，目录选 `/ (root)`，Save
4. 等一分钟，打开 <https://grytg7yfy4-dotcom.github.io/LHHHHHH/> 就是最新版

以后 `git push` 到 `main`，Pages 会自己重新构建，不用再管设置。

> 想改用 Actions 发布也行：Source 改成 **GitHub Actions**，再去 Actions 页面手动 Run 一次 `pages`。
> 那个 workflow 平时不自动跑，避免在 Pages 还没开的时候每次 push 都报红。

等 Actions 出现绿色对勾，打开 <https://grytg7yfy4-dotcom.github.io/LHHHHHH/> 就是最新版。

## 本地预览（可选）

```powershell
python -m http.server 8000
```

然后开 <http://localhost:8000>。手机和电脑连同一个 WiFi 的话，用 `http://电脑IP:8000` 也能看。

## 改内容

| 想改什么 | 改哪个文件 |
| --- | --- |
| 任务、验收物、坑 | `data/plan.js` |
| 笔记（＝博客文章） | `data/notes.js` |
| 知识地图的节点与依赖 | `mindmap/data.js` |
| Python 导图的知识点、解析和代码 | `mindmap/python/data-*.js` |
| 案例库的题目和答案代码 | `mindmap/cases-data.js` |
| 博客的排版 | `blog/blog.css` |
| 主色、间距 | `css/style.css` 顶部的变量 |
| 页面结构 | `index.html` / `blog/index.html` / `mindmap/index.html` / `mindmap/python.html` |
