# 廖恒 · 学习进度

网安所 8 周通关计划的任务勾选、验收物跟踪、学习笔记，外加一个博客、一个知识地图和一个导图库。
纯静态站，没有框架、没有构建步骤，推上 GitHub Pages 就是一个网址。

- 站点：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/>
- 博客：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/blog/>
- 知识地图：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/mindmap/>
- 导图库：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/mindmap/trees/>
- 计划：2026-10-26 → 2026-12-26

## 四个页面

| 页面 | 入口 | 管什么 | 数据在哪 |
| --- | --- | --- | --- |
| 主页 | `/` | 进度勾选、8 周计划、笔记速览 | `data/plan.js`、`data/notes.js`、`data/progress.js` |
| 博客 | `/blog/` | 把笔记当文章读：按月份归档、分类筛选、全文搜索，每篇有独立链接 | `data/notes.js` + `data/notes-xmind.js` |
| 知识地图 | `/mindmap/` | 阶段 → 节点的依赖图，点节点看说明与验收标准 | `mindmap/data.js` |
| 导图库 | `/mindmap/trees/` | 5 份 XMind 的完整树，可展开、可搜索 | `mindmap/trees/data.js` |

主页和博客都用 `data/notes.js`；博客额外合并 `data/notes-xmind.js`（导图转出来的长文），
所以主页保持轻，导图文章只在博客里出现。

## 目录

```
.
├─ index.html            页面骨架（进度 / 计划 / 笔记 / 说明 四个标签）
├─ css/style.css         全部样式，改主色只动最上面的 --accent
├─ js/md.js              极简 Markdown 渲染器（无依赖，支持多层嵌套列表）
├─ js/app.js             渲染逻辑、进度存储、导入导出
├─ data/plan.js          8 周计划：任务、验收物、常见坑、三条线、自测清单
├─ data/notes.js         笔记（＝博客的文章）
├─ data/notes-xmind.js   5 份 XMind 转出来的文章（自动生成，勿手改格式）
├─ data/progress.js      进度存档（跨设备的载体）
├─ blog/
│  ├─ index.html         博客页骨架
│  ├─ blog.css           博客页样式（复用 css/style.css 的变量）
│  └─ blog.js            归档、筛选、搜索、正文渲染
├─ mindmap/
│  ├─ index.html         知识地图骨架
│  ├─ map.css            画布、节点、详情抽屉的样式
│  ├─ map.js             布局、缩放拖拽、选中高亮
│  ├─ data.js            阶段 / 节点 / 连线（唯一要改的数据文件）
│  └─ trees/             导图库
│     ├─ index.html      导图库骨架
│     ├─ trees.css       树的缩进与连线样式
│     ├─ trees.js        展开/收起、搜索剪枝、标黄
│     └─ data.js         5 份导图的完整树（由 xmind 转出）
├─ .github/workflows/pages.yml   备用：手动触发的 Actions 发布
├─ .nojekyll             让 GitHub Pages 跳过 Jekyll 处理
└─ 启动预览.bat          本地起个服务，方便手机连同一个 WiFi 看
```

## 三条使用路径

**只是看看**：双击 `index.html`。数据是 `data/*.js` 直接加载的，`file://` 下也能正常打开，不需要服务器。

**记进度**：在页面上勾任务 → 点「导出进度」→ 下载的 `progress.js` 覆盖 `data/progress.js` → 提交推送。勾选会即时存在浏览器 localStorage 里，但只有写回仓库才算真正存住。

**写笔记**：在 `data/notes.js` 里加一段，或在 GitHub 网页上编辑这个文件，提交后一分钟自动部署。

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

## 把 XMind 导图放进来

`data/notes-xmind.js` 和 `mindmap/trees/data.js` 都是从 `.xmind` 的 `content.xml` 转出来的：
同一份树，一边排成博客文章，一边留成可折叠的树。

再导一份新导图，用同样的结构往两个文件里各加一条就行：

```js
// data/notes-xmind.js → notes 数组里加一条
{ "id": "x-xxxxxx", "date": "2026-10-28", "category": "Python",
  "title": "Python 学习导图：……（312 个节点）", "tags": ["导图"],
  "content": "> 来源：……\n\n## 1. 一级主题\n\n- 二级\n  - 三级" }

// mindmap/trees/data.js → maps 数组里加一条
{ "id": "t-xxxxxx", "title": "Python 学习导图", "file": "python学习.xmind",
  "date": "2026-10-28", "count": 312, "depth": 8,
  "root": { "t": "根主题", "c": [ { "t": "一级", "c": [] } ] } }
```

节点结构就三个字段：`t`（标题）、`c`（子节点数组），深层继续套 `c`。
文章正文用 Markdown：`##` 分节、两个空格一级的 `-` 列表，渲染器支持任意层嵌套。

## 部署（设置一次，之后每次 push 自动重建）

1. 仓库 → **Settings** → 左侧 **Pages**
2. **Build and deployment** 的 Source 选 **Deploy from a branch**
3. Branch 选 `main`，目录选 `/ (root)`，Save
4. 等一分钟，打开 <https://grytg7yfy4-dotcom.github.io/LHHHHHH/> 就是最新版

以后 `git push` 到 `main`，Pages 会自己重新构建，不用再管设置。

> 想改用 Actions 发布也行：Source 改成 **GitHub Actions**，再去 Actions 页面手动 Run 一次 `pages`。
> 那个 workflow 平时不自动跑，避免在 Pages 还没开的时候每次 push 都报红。

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
| 博客的排版 | `blog/blog.css` |
| 主色、间距 | `css/style.css` 顶部的变量 |
| 页面结构 | `index.html` / `blog/index.html` / `mindmap/index.html` |
