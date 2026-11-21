# 机器学习 15 讲 · 图解笔记

B 站合集 [《机器学习》](https://www.bilibili.com/video/BV1M8D7BWEVQ)（UP 主：谦行AIing，15 集，总时长 5 小时 20 分）的图解学习笔记。

线上地址：<https://grytg7yfy4-dotcom.github.io/LHHHHHH/ml15/>

## 目录结构

```
ml15/
├── index.html          课程首页：地图、进度、15 集卡片
├── ep01.html … ep15.html   每集一页：知识点、图、公式、代码、自测
├── cheatsheet.html     一页速查：公式 / 指标 / 选型
├── learn-log.html      学习记录：B 站观看时间 + 投入统计
├── assets/
│   ├── course-data.js  全部内容数据（由 content/*.json 合并生成）
│   ├── figures.js      24 个内联 SVG 示意图（含 6 个可交互图）
│   ├── app.js          渲染器：首页 / 分集 / 速查 / 学习记录
│   └── style.css       设计系统（含深色模式）
└── data/learnlog.js    学习记录数据（同步脚本只改这个文件）
```

## 内容规模

- 15 集 × 8~9 个知识点 = **124 个知识卡**
- **74 道自测题**（点击展开答案 + 解析）
- 24 个示意图，其中线性回归、梯度下降、熵、K-Means、PCA 等可交互
- 每个知识点尽量覆盖：一句话结论 → 直觉 → 公式 → 例子 → 易错点 → 记忆技巧

## 怎么更新

内容源在仓库外的工作目录（`content/*.json`），由构建脚本合并生成 `assets/course-data.js`。
如果你直接改线上站点：编辑 `assets/course-data.js` 里对应集的对象即可（结构见第 1 集）。

## 学习记录同步

见 [`工具/同步B站学习记录说明.md`](../工具/同步B站学习记录说明.md)：用 B 站 SESSDATA 只读拉取观看历史，
写入 `ml15/data/learnlog.js` 后提交即可。
