window.ML15_COMPARE = {
 "meta": {
  "qx": {
   "name": "谦行AIing《机器学习》",
   "episodes": 15,
   "minutes": 321,
   "site": "../ml15/"
  },
  "ng": {
   "name": "吴恩达《机器学习》",
   "chapters": 12,
   "parts": 144,
   "minutes": 1298,
   "site": "../ml/"
  }
 },
 "summary": {
  "total": 33,
  "full": 18,
  "partial": 8,
  "missing": 7
 },
 "legend": {
  "full": "谦行讲清楚了，能直接用来做题 / 面试",
  "partial": "讲了主干，但细节点或工程流程缺失",
  "missing": "15 讲里没有，本页给出吴恩达对应的补充"
 },
 "rows": [
  {
   "cat": "入门与范式",
   "topic": "监督 / 无监督 / 强化学习三范式",
   "ng": "第 1 章",
   "qx": "EP03",
   "status": "full",
   "note": "标签 y 与奖励 r 的区分讲得很清楚"
  },
  {
   "cat": "入门与范式",
   "topic": "回归 vs 分类",
   "ng": "第 1 章",
   "qx": "EP03",
   "status": "full",
   "note": "连续值 / 离散类别的判断口诀"
  },
  {
   "cat": "入门与范式",
   "topic": "Jupyter 与工具链",
   "ng": "第 1 章",
   "qx": "EP01 / EP15",
   "status": "partial",
   "note": "只提了工具名，没有 Jupyter 实操流程",
   "suppl": "suppl-detail"
  },
  {
   "cat": "线性回归",
   "topic": "单变量线性回归：模型与平方误差",
   "ng": "第 2 章",
   "qx": "EP04",
   "status": "full",
   "note": "w / b、残差、MSE 有可交互图"
  },
  {
   "cat": "线性回归",
   "topic": "梯度下降与学习率 α",
   "ng": "第 2 章",
   "qx": "EP05",
   "status": "full",
   "note": "偏导推导、三种学习率对比都讲了"
  },
  {
   "cat": "线性回归",
   "topic": "多变量表示与向量化",
   "ng": "第 3 章",
   "qx": "EP04",
   "status": "full",
   "note": "向量化代码与矩阵写法"
  },
  {
   "cat": "线性回归",
   "topic": "特征缩放 / 均值归一化",
   "ng": "第 3 章",
   "qx": "EP06",
   "status": "full",
   "note": "标准化 / 归一化 / 何时用哪种"
  },
  {
   "cat": "线性回归",
   "topic": "收敛判断与 α 选择",
   "ng": "第 3 章",
   "qx": "EP05",
   "status": "partial",
   "note": "讲了震荡 / 发散现象，没给「画损失曲线 + 自动调 α」的完整流程",
   "suppl": "suppl-detail"
  },
  {
   "cat": "线性回归",
   "topic": "多项式回归与特征构造",
   "ng": "第 3 章",
   "qx": "EP04",
   "status": "full",
   "note": "「对参数线性」的辨析很关键"
  },
  {
   "cat": "分类",
   "topic": "逻辑回归 / Sigmoid / 决策边界",
   "ng": "第 4 章",
   "qx": "EP09",
   "status": "full",
   "note": "几率 odds 与 logit 也补了"
  },
  {
   "cat": "分类",
   "topic": "交叉熵与梯度推导",
   "ng": "第 4 章",
   "qx": "EP09",
   "status": "full",
   "note": "从极大似然推出交叉熵"
  },
  {
   "cat": "分类",
   "topic": "多分类：Softmax / one-vs-all",
   "ng": "第 4 章",
   "qx": "EP09 / EP12",
   "status": "partial",
   "note": "只顺带提到 softmax，没有系统讲 one-vs-all 与多分类代码",
   "suppl": "suppl-detail"
  },
  {
   "cat": "分类",
   "topic": "高级优化器（共轭梯度 / L-BFGS）",
   "ng": "第 4 章",
   "qx": "EP05",
   "status": "partial",
   "note": "讲了动量 / Adam，传统二阶优化没展开",
   "suppl": "suppl-detail"
  },
  {
   "cat": "过拟合与正则化",
   "topic": "欠拟合 / 过拟合与偏差-方差",
   "ng": "第 5 章",
   "qx": "EP08",
   "status": "full",
   "note": "学习曲线诊断"
  },
  {
   "cat": "过拟合与正则化",
   "topic": "L2 正则化与权重衰减",
   "ng": "第 5 章",
   "qx": "EP08",
   "status": "full",
   "note": "L1/L2 几何直觉都有"
  },
  {
   "cat": "过拟合与正则化",
   "topic": "正则化逻辑回归的实现细节",
   "ng": "第 5 章",
   "qx": "EP08",
   "status": "partial",
   "note": "有公式，没有正则化逻辑回归的完整梯度与代码示例",
   "suppl": "suppl-detail"
  },
  {
   "cat": "神经网络",
   "topic": "神经网络表示 / 前向传播",
   "ng": "第 6 章",
   "qx": "—",
   "status": "missing",
   "note": "只在 EP15 展望里提了一句，15 讲没有展开",
   "suppl": "suppl-nn"
  },
  {
   "cat": "神经网络",
   "topic": "激活函数 / 训练循环 / 反向传播",
   "ng": "第 7 章",
   "qx": "—",
   "status": "missing",
   "note": "反向传播、梯度检验、随机初始化都没讲",
   "suppl": "suppl-nn"
  },
  {
   "cat": "神经网络",
   "topic": "多标签 / 多输出 / Softmax 输出层",
   "ng": "第 7 章",
   "qx": "—",
   "status": "missing",
   "note": "多标签与多分类的区别没涉及",
   "suppl": "suppl-nn"
  },
  {
   "cat": "项目诊断",
   "topic": "数据集划分 / 交叉验证 / 学习曲线",
   "ng": "第 8 章",
   "qx": "EP06–EP08",
   "status": "full",
   "note": "含时间序列切分与防泄漏"
  },
  {
   "cat": "项目诊断",
   "topic": "误差分析 / 上限分析 / 数据策略",
   "ng": "第 8 章",
   "qx": "—",
   "status": "missing",
   "note": "模型不达标时「先查哪儿」的系统方法缺失",
   "suppl": "suppl-advice"
  },
  {
   "cat": "项目诊断",
   "topic": "偏斜类 / 精确率 / 召回率 / F1",
   "ng": "第 8 章",
   "qx": "EP09",
   "status": "full",
   "note": "含 ROC / AUC 与阈值选择"
  },
  {
   "cat": "决策树与集成",
   "topic": "决策树 / 熵 / 信息增益 / CART",
   "ng": "第 9 章",
   "qx": "EP10",
   "status": "full",
   "note": "天气实例逐步算信息增益"
  },
  {
   "cat": "决策树与集成",
   "topic": "连续值分裂 / 独热编码 / 回归树",
   "ng": "第 9 章",
   "qx": "EP10",
   "status": "partial",
   "note": "按类别分裂讲了，连续值与回归树没展开",
   "suppl": "suppl-detail"
  },
  {
   "cat": "决策树与集成",
   "topic": "随机森林 / Bagging / OOB",
   "ng": "第 9 章",
   "qx": "EP11",
   "status": "full",
   "note": "双随机性与特征重要性"
  },
  {
   "cat": "决策树与集成",
   "topic": "XGBoost / LightGBM / CatBoost",
   "ng": "第 9 章",
   "qx": "EP12",
   "status": "full",
   "note": "GBDT → XGBoost 演进与选型"
  },
  {
   "cat": "无监督学习",
   "topic": "K-Means / 目标函数 / K 选择",
   "ng": "第 10 章",
   "qx": "EP13",
   "status": "full",
   "note": "肘部法与轮廓系数"
  },
  {
   "cat": "无监督学习",
   "topic": "异常检测（高斯密度估计）",
   "ng": "第 10 章",
   "qx": "—",
   "status": "missing",
   "note": "15 讲完全没有异常检测",
   "suppl": "suppl-anomaly"
  },
  {
   "cat": "无监督学习",
   "topic": "PCA 原理 / 步骤 / 方差解释率",
   "ng": "第 11 章",
   "qx": "EP14",
   "status": "full",
   "note": "特征值分解与碎石图"
  },
  {
   "cat": "推荐系统",
   "topic": "协同过滤 / 冷启动 / 基于内容",
   "ng": "第 11 章",
   "qx": "—",
   "status": "missing",
   "note": "15 讲没有推荐系统",
   "suppl": "suppl-reco"
  },
  {
   "cat": "强化学习",
   "topic": "MDP / 回报 / Q-learning / 神经网络近似",
   "ng": "第 12 章",
   "qx": "EP03 简介",
   "status": "missing",
   "note": "EP03 只介绍概念，没有算法与 Q-learning",
   "suppl": "suppl-rl"
  },
  {
   "cat": "工程与规模",
   "topic": "项目流程 / 模型选型 / 工业工具",
   "ng": "第 8–9 章",
   "qx": "EP15",
   "status": "partial",
   "note": "有选型决策表，缺部署、监控、A/B 测试",
   "suppl": "suppl-advice"
  },
  {
   "cat": "工程与规模",
   "topic": "大规模机器学习（在线学习 / MapReduce）",
   "ng": "第 8 章",
   "qx": "EP05",
   "status": "partial",
   "note": "小批量讲了，在线学习与并行/MapReduce 没讲",
   "suppl": "suppl-detail"
  }
 ]
};
