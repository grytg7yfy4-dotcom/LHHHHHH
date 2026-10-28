/* ============================================================================
 *  知识地图数据 —— 唯一需要改的文件
 *
 *  stages : 从左到右的六个阶段（列）
 *  nodes  : 每个节点属于一个阶段；kind 决定圆点颜色
 *  edges  : [父, 子]，箭头从父指向子
 *
 *  加一个知识点：在 nodes 里加一条，再在 edges 里接上它，刷新页面就是新的图。
 * ========================================================================== */

window.MAP_DATA = {
  "meta": {
    "title": "廖恒 · 知识地图",
    "sub": "从 Python 第 80 集，到 11.04 能演示的实例",
    "updated": "2026-10-28"
  },

  "stages": [
    { "id": "now",  "name": "已学完",   "note": "第 1—80 集" },
    { "id": "py",   "name": "本周补齐", "note": "10.29—10.30" },
    { "id": "be",   "name": "后端",     "note": "10.30—11.01" },
    { "id": "how",  "name": "方法",     "note": "贯穿全程" },
    { "id": "app",  "name": "实例",     "note": "11.01—11.04" },
    { "id": "next", "name": "下一步",   "note": "11.05 起" }
  ],

  "nodes": [
    {
      "id": "py80", "stage": "now", "kind": "done", "label": "Python 1—80 集",
      "detail": "基础语法、判断、循环、函数、数据容器，导图从 4 个模块补到 6 个。\n\n这一层解决的是**写语句**，下面所有节点都是在解决**组织代码**。",
      "links": [{ "text": "看笔记", "href": "../blog/" }]
    },
    {
      "id": "func", "stage": "now", "kind": "done", "label": "函数",
      "detail": "def、形参实参、return、None、作用域、global。\n\n真正的收获不是语法，而是「把一段逻辑打包，让调用者只关心输入输出」。后面写接口处理函数就是同一件事。",
      "links": []
    },
    {
      "id": "cont", "stage": "now", "kind": "done", "label": "数据容器",
      "detail": "list / tuple / str / slice / set / dict。\n\n选型口诀：要顺序和修改用 list，只读用 tuple，去重和集合运算用 set，按键取值用 dict。接口返回的 JSON 本质就是 dict + list。",
      "links": []
    },
    {
      "id": "oop", "stage": "py", "kind": "doing", "label": "面向对象",
      "detail": "只补 class、`__init__`、属性与方法，跳过魔法方法。\n\n验收：写一个 `class User`，实例化两个对象存进列表。这是 ORM 的地基——ORM 把一行数据映射成一个对象，靠的就是这套。",
      "links": []
    },
    {
      "id": "env", "stage": "py", "kind": "doing", "label": "环境与 Git",
      "detail": "venv、requirements.txt、`git init` + 每次提交写清做了什么。\n\n标准：10.29 当天能 `uvicorn` 起服务，并且有第一次 commit。环境卡住超过 1 小时就换方案，别硬磕。",
      "links": []
    },
    {
      "id": "fastapi", "stage": "be", "kind": "todo", "label": "FastAPI 路由",
      "detail": "路径参数、查询参数、请求体、状态码。黑马 P1—P14。\n\n当天产出：一个 `/health` 接口，`/docs` 能打开——Swagger 是这个项目最省事的「接口文档」。",
      "links": []
    },
    {
      "id": "sqlalchemy", "stage": "be", "kind": "todo", "label": "SQLAlchemy 建模",
      "detail": "用声明式模型定义表，`create_all` 建表，Session 增删改查。黑马 P17—P19。\n\n先连 SQLite 跑通，再换 MySQL 连接串——顺序反了，第一天就卡在装库上。",
      "links": []
    },
    {
      "id": "mysql", "stage": "be", "kind": "todo", "label": "MySQL 8",
      "detail": "建库建表、字符集 utf8mb4、`DATETIME` 默认值。加分项，不是保命项。\n\n装不上就交 SQLite 版本，MySQL 写进「下一步」。",
      "links": []
    },
    {
      "id": "sync", "stage": "how", "kind": "doing", "label": "当天学当天写",
      "detail": "每天 1 小时视频 + 1 小时代码，当天学的语法当晚必须出现在项目里。\n\n上周的教训：攒 30 集再动手，前面基本忘光。",
      "links": []
    },
    {
      "id": "spec", "stage": "how", "kind": "doing", "label": "软件规范",
      "detail": "README、需求说明、数据库设计、接口文档、测试用例表，5 样齐全；提交 ≥10 次，信息写「根因 / 方案 / 验证」。\n\n这是软件工程专业和信息安全专业最容易被区分开的地方。",
      "links": []
    },
    {
      "id": "ref", "stage": "how", "kind": "doing", "label": "向子杰学",
      "detail": "他已经有：知识点对照表、一键启动 bat、本地可写 / Pages 只读双模式、README 里写明「数据存在哪」。\n\n学的是这些做工，不是 Spring Boot 那套栈。",
      "links": [{ "text": "他的仓库", "href": "https://github.com/castoricelover777/blog", "ext": true }]
    },
    {
      "id": "model", "stage": "app", "kind": "todo", "label": "assets 表",
      "detail": "7 个字段：id / name / ip / type / owner / risk / created_at。一张表就够，别急着做多表关联。\n\n验收：能建出来、能插一条再查出来。",
      "links": []
    },
    {
      "id": "api", "stage": "app", "kind": "todo", "label": "4 个接口",
      "detail": "GET 列表、POST 新增、PUT 修改、DELETE 删除，加 404 / 422 处理。\n\n验收：Swagger 里四个都能调通，并截图留证。",
      "links": []
    },
    {
      "id": "ui", "stage": "app", "kind": "todo", "label": "Jinja2 页面",
      "detail": "列表 + 新增表单 + 删除按钮，用 Bootstrap 现成的样式，不自己写 CSS、不上 Vue。\n\n验收：浏览器里能完成增和删。",
      "links": []
    },
    {
      "id": "docs", "stage": "app", "kind": "todo", "label": "工程文档",
      "detail": "README（三条命令跑起来 + 截图 + 知识点对照表）、需求说明 1 页、数据库设计 1 页、/docs 截图。\n\n这套东西的体积比代码小，但决定别人能不能评判你的工作。",
      "links": []
    },
    {
      "id": "tests", "stage": "app", "kind": "todo", "label": "8 条用例",
      "detail": "4 个接口 × 正常 / 异常，写明输入与预期。\n\n至少要抓到过一个真 bug，并能讲清根因——这是「代码是我自己弄懂的」唯一证据。",
      "links": []
    },
    {
      "id": "demo", "stage": "next", "kind": "todo", "label": "一键演示",
      "detail": "写一个 `启动资产台账.bat`：起 uvicorn + 打开 127.0.0.1:8000。\n\n现场演示不敲命令——双击就能开，比任何自我介绍都有说服力。",
      "links": []
    },
    {
      "id": "deploy", "stage": "next", "kind": "todo", "label": "Pages 只读版",
      "detail": "把只读的前端发到 GitHub Pages，链接发给师兄，手机点开就能看。\n\n本地全栈可写、线上静态只读，是两套模式共用一份前端。",
      "links": [{ "text": "当前站点", "href": "../index.html" }]
    },
    {
      "id": "netsec", "stage": "next", "kind": "todo", "label": "接网安项目",
      "detail": "Asset-Lite 换成组里真实的那张表，加一条真实的业务字段。\n\n从「练习」变成「有人要用」，是下一阶段的分水岭。",
      "links": []
    }
  ],

  "edges": [
    ["py80", "func"], ["py80", "cont"], ["py80", "oop"],
    ["env", "fastapi"], ["oop", "fastapi"],
    ["fastapi", "sqlalchemy"], ["sqlalchemy", "mysql"],
    ["sqlalchemy", "model"], ["model", "api"], ["fastapi", "api"],
    ["api", "ui"], ["api", "tests"], ["model", "docs"], ["api", "docs"],
    ["sync", "api"], ["spec", "docs"], ["spec", "tests"], ["ref", "spec"],
    ["api", "demo"], ["demo", "deploy"], ["api", "netsec"]
  ]
};
