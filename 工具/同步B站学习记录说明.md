# 同步 B 站学习记录

把 B 站「机器学习」合集（BV1M8D7BWEVQ）的真实观看时间同步到 `ml15/learn-log.html`。

## 一次性准备：拿到 SESSDATA

1. 浏览器登录 <https://www.bilibili.com>。
2. 按 `F12` 打开开发者工具 → **Application / 应用** → **Cookies** → `https://www.bilibili.com`。
3. 找到名为 `SESSDATA` 的一行，复制它的 **值**（一长串字符）。
4. 在本目录新建 `bili_cookie.txt`，写入一行：

```
SESSDATA=粘贴刚才复制的值
```

> 这个文件只在本机使用，`SESSDATA` 等同于登录态，**不要**提交到 GitHub。

## 运行

```bat
cd /d 仓库根目录
python 工具\同步B站学习记录.py
```

或者不建文件，直接：

```bat
python 工具\同步B站学习记录.py --cookie "SESSDATA=你的值"
```

脚本会：

1. 读取「观看历史」接口（只读）；
2. 找出属于这个合集的 15 个 BV 号；
3. 把每集的观看日期、时间、进度写入 `ml15/data/learnlog.js`；
4. 打印同步结果。

## 提交

```bat
git add ml15/data/learnlog.js
git commit -m "feat(ml15): 同步 B 站学习记录"
git push
```

半分钟后 <https://grytg7yfy4-dotcom.github.io/LHHHHHH/ml15/learn-log.html> 就会显示真实观看时间线。
