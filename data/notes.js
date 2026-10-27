/* ============================================================================
 *  笔记数据 —— 你的学习内容都存在这里
 *
 *  加一篇笔记：复制下面任意一个 { ... } 块，改 id / date / category / title /
 *  content 即可。id 别重复，date 用 YYYY-MM-DD（按月归档靠它）。
 *  content 支持 Markdown：标题、列表、表格、代码块、引用、- [ ] 待办。
 * ========================================================================== */

window.NOTES_DATA = {
  "notes": [
    {
      "id": "n-c-1",
      "date": "2026-10-24",
      "category": "C语言",
      "title": "day12：指针与数组不是一回事",
      "tags": ["指针", "数组", "易错点"],
      "content": "## 一句话结论\n\n数组名在大多数表达式里会**退化成指向首元素的指针**，但它本身不是指针：`sizeof` 和 `&` 对两者的行为完全不同。\n\n```c\nint a[5] = {1, 2, 3, 4, 5};\nint *p = a;\n\nprintf(\"%zu\\n\", sizeof(a));   // 20：整个数组\nprintf(\"%zu\\n\", sizeof(p));   // 8 ：一个指针\n```\n\n## 三个必须记住的点\n\n1. `a[i]` 等价于 `*(a + i)`，也等价于 `*(p + i)`；\n2. `&a` 的类型是 `int (*)[5]`，`&a + 1` 会跳 **20** 字节，而 `a + 1` 只跳 4 字节；\n3. 数组作函数参数时会退化成指针，所以函数里 `sizeof(arr)` 永远是 8，必须在外面把长度传进来。\n\n> 踩坑记录：写 `void f(int arr[5])` 以为能保住长度，结果 `sizeof` 还是 8。\n\n## 待复习\n\n- [ ] 指针数组与数组指针的声明读法\n- [ ] 二级指针在 `char **argv` 里的作用\n- [x] 数组名不是指针这件事能讲清楚"
    },
    {
      "id": "n-ds-1",
      "date": "2026-10-23",
      "category": "数据结构",
      "title": "day8：单链表头插法与尾插法",
      "tags": ["链表", "指针"],
      "content": "## 两种建表方式\n\n**尾插法**（保持输入顺序，日常建表都用它）：\n\n```c\nNode *tail = head;\nfor (int i = 0; i < n; i++) {\n    Node *s = malloc(sizeof(Node));\n    s->data = a[i];\n    s->next = NULL;\n    tail->next = s;\n    tail = s;\n}\n```\n\n**头插法**（结果与输入相反，常用来做链表逆置）：\n\n```c\nfor (int i = 0; i < n; i++) {\n    Node *s = malloc(sizeof(Node));\n    s->data = a[i];\n    s->next = head->next;\n    head->next = s;\n}\n```\n\n## 复杂度\n\n| 操作 | 数组 | 单链表 |\n| --- | --- | --- |\n| 按下标访问 | O(1) | O(n) |\n| 头部插入 | O(n) | O(1) |\n| 删除已知结点 | O(n) | O(1) |\n\n> 易错：头插法建完表后指针顺序是反的，别拿它去和数组逐位比对。\n\n## 今日练习\n\n- 用尾插法建表并正序打印\n- 用头插法把同一组数据逆序打印（不许用数组）"
    },
    {
      "id": "n-javaweb-1",
      "date": "2026-10-22",
      "category": "JavaWeb",
      "title": "day10：三层架构第一次跑通",
      "tags": ["三层架构", "Servlet", "JDBC"],
      "content": "## 分层职责\n\n```\n浏览器 → Controller(Servlet) → Service → Mapper(DAO) → MySQL\n```\n\n- **Controller**：只负责收参数、调 Service、返回 JSON；\n- **Service**：业务规则、事务边界；\n- **Mapper/DAO**：只写 SQL，不写业务判断。\n\n## 一个最小的查询链路\n\n```java\n@WebServlet(\"/depts\")\npublic class DeptServlet extends HttpServlet {\n    private final DeptService service = new DeptServiceImpl();\n\n    @Override\n    protected void doGet(HttpServletRequest req, HttpServletResponse resp)\n            throws IOException {\n        List<Dept> list = service.listAll();\n        resp.setContentType(\"application/json;charset=utf-8\");\n        resp.getWriter().write(JSON.toJSONString(list));\n    }\n}\n```\n\n## 今天卡住的地方\n\n1. `ClassNotFoundException: com.mysql.cj.jdbc.Driver` —— 驱动 jar 没放进 `WEB-INF/lib`；\n2. 中文乱码 —— `resp.setContentType` 的 charset 写掉了，补上就好；\n3. 404 —— `@WebServlet` 路径前少写了一个 `/`。\n\n> 心得：三层架构的价值不在「多写几个类」，而在每一层都能单独换掉。"
    },
    {
      "id": "n-start-1",
      "date": "2026-10-26",
      "category": "使用说明",
      "title": "这个站怎么用",
      "tags": ["上手"],
      "content": "## 三件事\n\n1. **进度**页：每周任务打勾，百分比自动算。勾选先存在浏览器里，点「导出进度」会下载 `progress.js`，拖回仓库的 `data/` 目录覆盖，进度就真正存进仓库了 —— 换电脑、换浏览器都能接着来。\n2. **计划**页：8 周的任务、每周验收物、常见坑。验收物没达成就不算这周过。\n3. **笔记**页：按分类和月份筛，也能搜。\n\n## 每天的最小动作\n\n- 做掉一个任务 → 打勾\n- 写一篇笔记 → `data/notes.js` 里加一段\n- 提交一次 Git\n\n> 铁律：每天必须有一个「能演示的进展」，哪怕只是接口在 Swagger 里跑通。"
    }
  ]
};
