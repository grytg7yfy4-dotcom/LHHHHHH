/* ============================================================================
 *  学习计划数据 —— 唯一需要你改的数据文件之一
 *  改完保存，刷新页面就生效；提交到 GitHub 后 Pages 会自动重新部署。
 * ========================================================================== */

window.PLAN_DATA = {
  "meta": {
    "owner": "廖恒",
    "title": "网安所 · 8 周通关计划",
    "tagline": "每周日必须有一个能演示的东西",
    "start": "2026-10-26",
    "deadline": "2026-12-26",
    "hoursPerWeek": 22,
    "repo": "https://github.com/grytg7yfy4-dotcom/LHHHHHH",
    "site": "https://grytg7yfy4-dotcom.github.io/LHHHHHH/"
  },

  "lines": [
    {
      "id": "L1",
      "name": "保命线",
      "desc": "缺一条就挂",
      "items": [
        { "id": "L1-1", "text": "公网可访问" },
        { "id": "L1-2", "text": "登录" },
        { "id": "L1-3", "text": "一个实体完整 CRUD" },
        { "id": "L1-4", "text": "数据库真实读写" }
      ]
    },
    {
      "id": "L2",
      "name": "达标线",
      "desc": "良好",
      "items": [
        { "id": "L2-1", "text": "实体关联" },
        { "id": "L2-2", "text": "角色权限" },
        { "id": "L2-3", "text": "分页搜索" },
        { "id": "L2-4", "text": "一个真实图表" }
      ]
    },
    {
      "id": "L3",
      "name": "加分线",
      "desc": "优秀",
      "items": [
        { "id": "L3-1", "text": "文件上传" },
        { "id": "L3-2", "text": "操作日志" },
        { "id": "L3-3", "text": "导入导出" },
        { "id": "L3-4", "text": "安全加固" },
        { "id": "L3-5", "text": "接口测试" },
        { "id": "L3-6", "text": "Docker 部署" }
      ]
    }
  ],

  "weeks": [
    {
      "id": "W1",
      "label": "W1",
      "range": "10/26–11/01",
      "start": "2026-10-26",
      "end": "2026-11-01",
      "title": "定题 + 环境 + 空壳上线",
      "learn": "需求怎么写、ER 图、Docker 基础、Nginx 反代",
      "acceptance": "手机 4G 能打开你的公网地址",
      "tasks": [
        { "id": "W1-1", "text": "写 1 页需求：10 条用户故事" },
        { "id": "W1-2", "text": "画 ER 图（5 张表）+ 3 个页面草图" },
        { "id": "W1-3", "text": "列接口清单（16 个），先写在纸上" },
        { "id": "W1-4", "text": "装环境：Node 20 / Python 3.11 / Docker / Git / VSCode" },
        { "id": "W1-5", "text": "跑通 Vue 模板 + FastAPI hello，axios 调通 /api/ping" },
        { "id": "W1-6", "text": "买服务器（学生机 2C2G），配 SSH 密钥登录" },
        { "id": "W1-7", "text": "Docker 起 MySQL + Nginx 反代，把空壳部署上去" },
        { "id": "W1-8", "text": "建 Git 私有仓库，写 README 骨架" }
      ],
      "pitfalls": [
        "安全组没开 80/443",
        "Nginx proxy_pass 少了尾部斜杠导致 404",
        "MySQL 容器没挂数据卷，重启数据全丢"
      ]
    },
    {
      "id": "W2",
      "label": "W2",
      "range": "11/02–11/08",
      "start": "2026-11-02",
      "end": "2026-11-08",
      "title": "后端骨架 + 登录鉴权",
      "learn": "HTTP 与状态码、RESTful、JWT 三段结构、密码为什么不能明文、CORS",
      "acceptance": "注册登录可用，刷新不掉线，未登录被拦，Swagger 能测所有接口",
      "tasks": [
        { "id": "W2-1", "text": "后端分层：router / service / model / schema / core / deps" },
        { "id": "W2-2", "text": "统一响应体 {code,msg,data} + 全局异常处理" },
        { "id": "W2-3", "text": "SQLAlchemy 建 5 张表" },
        { "id": "W2-4", "text": "注册（bcrypt）/ 登录（JWT）/ get_current_user / 角色校验" },
        { "id": "W2-5", "text": "前端 Router + Pinia 存 token + axios 拦截器 + 登录页与主布局" }
      ],
      "pitfalls": [
        "JWT 密钥写死在代码里并提交到 Git",
        "token 存 localStorage 有 XSS 风险（答辩要能说出这个权衡）",
        "密码用了 MD5（必须换 bcrypt）"
      ]
    },
    {
      "id": "W3",
      "label": "W3",
      "range": "11/09–11/15",
      "start": "2026-11-09",
      "end": "2026-11-15",
      "title": "主模块 CRUD + 前后端联调",
      "learn": "RESTful 资源设计、分页 SQL（LIMIT/OFFSET）、ORM 与 DTO 分离",
      "acceptance": "100 条数据分页搜索流畅，改一条立刻生效，删一条有二次确认",
      "tasks": [
        { "id": "W3-1", "text": "资产模块：列表 / 新增 / 编辑 / 删除 / 详情" },
        { "id": "W3-2", "text": "后端 Pydantic 校验 + 前端表单校验" },
        { "id": "W3-3", "text": "封装通用表格组件 + 分页组件" },
        { "id": "W3-4", "text": "写脚本批量造 100 条测试数据" }
      ],
      "pitfalls": [
        "前端传 page=1，后端按 offset=1 算（off-by-one）",
        "时间字段时区错 8 小时（统一存 UTC，展示转本地）",
        "删资产时外键约束报 500"
      ]
    },
    {
      "id": "W4",
      "label": "W4",
      "range": "11/16–11/22",
      "start": "2026-11-16",
      "end": "2026-11-22",
      "title": "关联业务 + 文件上传 + 权限",
      "learn": "JOIN、外键约束、一对多、文件上传的安全问题",
      "acceptance": "资产下能挂多条漏洞；上传 png 能预览；越权返回 403",
      "tasks": [
        { "id": "W4-1", "text": "漏洞模块 + 资产关联（联表带出资产名）" },
        { "id": "W4-2", "text": "状态流转接口 PUT /api/vulns/{id}/status，服务端校验 + 事务" },
        { "id": "W4-3", "text": "文件上传：白名单 + MIME + 随机重命名 + 5MB 限制 + 非执行目录" },
        { "id": "W4-4", "text": "权限：admin 看全部，user 只看自己创建的，每个写操作校验归属" }
      ],
      "pitfalls": [
        "只在前端隐藏按钮，接口没校验（这就是越权漏洞）",
        "上传用原始文件名，遇到 ../../etc/passwd 类攻击",
        "把上传目录配成可执行"
      ]
    },
    {
      "id": "W5",
      "label": "W5",
      "range": "11/23–11/29",
      "start": "2026-11-23",
      "end": "2026-11-29",
      "title": "仪表盘 + 日志 + 导入导出",
      "learn": "聚合查询、索引与 EXPLAIN、Excel 读写",
      "acceptance": "首页 3 个图表是真实聚合数据；导出的 xlsx 能打开；EXPLAIN 走索引",
      "tasks": [
        { "id": "W5-1", "text": "统计接口：风险等级分布 / 资产类型分布 / 近 7 天趋势" },
        { "id": "W5-2", "text": "ECharts 画 2 个饼柱图 + 1 个折线图，接真实数据" },
        { "id": "W5-3", "text": "操作日志：记录谁在什么时候对什么做了什么" },
        { "id": "W5-4", "text": "导入 CSV/Excel + 导出 openpyxl" },
        { "id": "W5-5", "text": "给 status / created_at 加索引，EXPLAIN 截图对比" }
      ],
      "pitfalls": [
        "图表用假数据（答辩一眼看穿）",
        "统计接口每次都全表扫，没走索引"
      ]
    },
    {
      "id": "W6",
      "label": "W6",
      "range": "11/30–12/06",
      "start": "2026-11-30",
      "end": "2026-12-06",
      "title": "测试 + 排错 + 生产部署",
      "learn": "docker logs、nginx error.log、浏览器 Network、pytest、compose",
      "acceptance": "删掉所有容器，照 README 30 分钟重建",
      "tasks": [
        { "id": "W6-1", "text": "pytest 写 10 个接口测试（正常/参数错/未登录/越权）" },
        { "id": "W6-2", "text": "故意制造 5 个 bug 再修掉，每个写 5 行排查记录" },
        { "id": "W6-3", "text": "Dockerfile + docker-compose（nginx + api + mysql）+ 数据卷" },
        { "id": "W6-4", "text": "HTTPS（有域名就 certbot，没有就讲清为什么要）" },
        { "id": "W6-5", "text": "日志落文件 + 按天切割 + 容器开机自启" }
      ],
      "pitfalls": [
        "compose 里写了 depends_on 就以为顺序有保证",
        "数据卷路径写在容器内被覆盖"
      ]
    },
    {
      "id": "W7",
      "label": "W7",
      "range": "12/07–12/13",
      "start": "2026-12-07",
      "end": "2026-12-13",
      "title": "安全加固 + 文档 + 讲稿",
      "learn": "OWASP Top 10（挑 5 个对照自己项目）",
      "acceptance": "脱稿讲 10 分钟；问「加个字段要改哪几个文件」能立刻答出来",
      "tasks": [
        { "id": "W7-1", "text": "SQL 注入：全 ORM 参数化，全局搜一遍有没有拼 SQL" },
        { "id": "W7-2", "text": "XSS：禁 v-html、富文本过滤、生产开 CSP" },
        { "id": "W7-3", "text": "越权：所有 {id} 接口查归属" },
        { "id": "W7-4", "text": "暴力破解：登录失败 5 次锁 10 分钟" },
        { "id": "W7-5", "text": "敏感信息：.env 不进 Git，数据库账号最小权限" },
        { "id": "W7-6", "text": "文档：README + Swagger 导出 + 数据库设计说明" },
        { "id": "W7-7", "text": "讲稿：5 分钟版 + 15 分钟版" }
      ],
      "pitfalls": [
        "文档写成流水账，没有截图和架构图",
        "讲稿背成念稿"
      ]
    },
    {
      "id": "W8",
      "label": "W8",
      "range": "12/14–12/20",
      "start": "2026-12-14",
      "end": "2026-12-20",
      "title": "模拟答辩 + 现场改需求",
      "learn": "表达与临场",
      "acceptance": "3 次模拟通过，问题清单清零，现场改需求不用查资料",
      "tasks": [
        { "id": "W8-1", "text": "找同学或让 AI 扮演评委，按 30 题问一遍，录音回听" },
        { "id": "W8-2", "text": "现场改需求演练 3 次（15 分钟内完成）" },
        { "id": "W8-3", "text": "性能：给慢查询加索引，压测 100 并发" },
        { "id": "W8-4", "text": "修 UI 细节，录 3 分钟 demo 视频" }
      ],
      "pitfalls": [
        "只在自己电脑上演练，现场网络翻车",
        "没录 demo 视频兜底"
      ]
    },
    {
      "id": "W9",
      "label": "缓冲",
      "range": "12/21–12/26",
      "start": "2026-12-21",
      "end": "2026-12-26",
      "title": "例会汇报 + 彩排 + 兜底",
      "learn": "—",
      "acceptance": "演示视频 + PPT 就绪",
      "tasks": [
        { "id": "W9-1", "text": "最终部署确认" },
        { "id": "W9-2", "text": "例会汇报 + 彩排" },
        { "id": "W9-3", "text": "演示视频与 PPT 收尾" }
      ],
      "pitfalls": ["这一周加新功能"]
    }
  ],

  "checklist": [
    { "id": "C1", "text": "公网可访问，陌生人能注册并完整走一遍业务" },
    { "id": "C2", "text": "能画架构图，讲清一次请求从浏览器到数据库再回来" },
    { "id": "C3", "text": "能说出每张表的作用、字段含义、表间关系" },
    { "id": "C4", "text": "15 分钟内现场加一个字段（DB → model → schema → 接口 → 前端）" },
    { "id": "C5", "text": "能讲 3 个真实 bug 的完整排查过程" },
    { "id": "C6", "text": "能解释 JWT / bcrypt / 索引 / 事务 / CORS，以及在你项目哪个文件里" },
    { "id": "C7", "text": "Git 有连续 8 周提交记录，commit message 能看懂" },
    { "id": "C8", "text": "README 有截图、架构图、一键部署步骤" },
    { "id": "C9", "text": "3 分钟 demo 视频已录制" },
    { "id": "C10", "text": "脱稿讲 10 分钟不卡壳" },
    { "id": "C11", "text": "30 问题库能答上 25 个" }
  ]
};
