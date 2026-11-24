# 模板：知识点系列站点（可复用）

这是 [`知识点总结规范`](../知识点总结规范.md) 的配套脚手架。**不要直接改这里跑**，用生成器复制到 `series/<slug>/`：

```bat
python 工具/新建知识点系列.py --bvid BV1xxxxxxxxx --slug series/<slug> --title "系列名"
```

生成器会拉取 B 站合集 / 分 P 的标题、时长、发布时间、章节，生成 `content/meta.json` 和 `content/epXX.json` 骨架。

## 目录

```
<系列>/
├─ assets/
│  ├─ style.css     设计系统（深浅色 / 响应式 / 对比表 / 补充页样式）
│  ├─ app.js        渲染器：首页 / 分集 / 速查 / 对比 / 补充 / 学习记录
│  ├─ figures.js    起步图库（内联 SVG，可增删）
│  └─ favicon.svg   站点图标
├─ content/
│  ├─ meta.json     系列元数据 + 分集目录（生成器自动填）
│  ├─ epXX.json     每集内容（知识点 / 自测，手动或 AI 填）
│  ├─ cheatsheet.json  速查表（可选）
│  ├─ compare.json     对比表（可选）
│  ├─ supplement.json  知识点补充（可选）
│  └─ learnlog.json    学习记录（同步脚本写）
├─ data/            构建产物：course-data.js / learnlog.js / compare.js / supplement.js
├─ _build/build.py  构建脚本
└─ 生成的 .html      首页 / 分集 / 速查 / 学习记录 / 对比 / 补充
```

## 本地构建

```bat
python _build/build.py
python -m http.server 8787 --directory .
```

打开 <http://127.0.0.1:8787/>。

## 改哪里

| 想改的东西 | 改哪 |
| --- | --- |
| 系列标题、UP 主、B 站链接、首页文案 | `content/meta.json` 的 `meta` / `meta.ui` |
| 模块分组（把 15 集分成 5 个模块） | `content/meta.json` 的 `modules`，并给每集 `module` 赋值 |
| 每集知识点、公式、图、自测 | `content/epXX.json` |
| 速查表 | `content/cheatsheet.json` |
| 和参考课程的对比 | `content/compare.json` |
| 参考课程里的补充知识点 | `content/supplement.json` |
| 图形 | `assets/figures.js`：新增 `F['fig-xxx']`，在 content 里用 `"fig": "fig-xxx"` 引用 |

`meta.ui.heroFigure` 设为 `false` 时首页不显示右侧装饰图；想要自己的主视觉，就换成 `"fig-xxx"`。

## 注意

- `figures.js` 里的 `fig-hero`、`fig-course-map` 是示例：`fig-course-map` 会根据 `course-data` 自动生成，`fig-hero` 是机器学习风格的装饰图，换系列时替换或隐藏。
- 所有颜色、字号、圆角都在 `assets/style.css` 顶部的 `:root` 里。
- 构建会给静态资源加 `?v=时间戳` 版本号，更新后不用手动清缓存。
