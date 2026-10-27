# 廖恒 · 学习进度

网安所 8 周通关计划的任务勾选、验收物跟踪和学习笔记。纯静态站，没有框架、没有构建步骤，推上 GitHub Pages 就是一个网址。

- 站点：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/>
- 计划：2026-10-26 → 2026-12-26

## 目录

```
.
├─ index.html            页面骨架（进度 / 计划 / 笔记 / 说明 四个标签）
├─ css/style.css         全部样式，改主色只动最上面的 --accent
├─ js/md.js              极简 Markdown 渲染器（无依赖）
├─ js/app.js             渲染逻辑、进度存储、导入导出
├─ data/plan.js          8 周计划：任务、验收物、常见坑、三条线、自测清单
├─ data/notes.js         笔记
├─ data/progress.js      进度存档（跨设备的载体）
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

## 首次部署

Settings → Pages → Source 选 **Deploy from a branch** → Branch `main`、目录 `/ (root)` → Save。

等一分钟，地址是 `https://<用户名>.github.io/LHHHHHH/`。

## 本地预览（可选）

```powershell
python -m http.server 8000
```

然后开 <http://localhost:8000>。手机和电脑连同一个 WiFi 的话，用 `http://电脑IP:8000` 也能看。

## 改内容

| 想改什么 | 改哪个文件 |
| --- | --- |
| 任务、验收物、坑 | `data/plan.js` |
| 笔记 | `data/notes.js` |
| 主色、间距 | `css/style.css` 顶部的变量 |
| 页面结构 | `index.html` |
