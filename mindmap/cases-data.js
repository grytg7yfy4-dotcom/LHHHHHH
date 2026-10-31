/* 1-123 集的综合案例 / 实战案例：题目、思路、答案代码 */
window.PY_CASES = [
  {
    p: 31, ch: '3. 判断语句', t: '成年人判断',
    need: '输入年龄，18 岁及以上输出「您已成年，需要买票 10 元」，否则输出「您未成年，可以免费游玩」。',
    steps: ['input 读入年龄，字符串转 int', '用 >= 比较出布尔值', 'if / else 两个分支各自 print'],
    code: String.raw`age = int(input("请输入您的年龄："))

if age >= 18:
    print("您已成年，需要买票 10 元。")
else:
    print("您未成年，可以免费游玩。")`,
    out: '请输入您的年龄：20\n您已成年，需要买票 10 元。'
  },
  {
    p: 33, ch: '3. 判断语句', t: '我要买票吗',
    need: '景区规定身高超过 120cm 需要买票，否则免票。输入身高，输出是否需要买票。',
    steps: ['input 读身高并转 int', 'if 判断 height > 120', '两个分支分别提示买票 / 免票'],
    code: String.raw`height = int(input("请输入你的身高（cm）："))

if height > 120:
    print("身高超过 120cm，需要买票，票价 10 元。")
else:
    print("身高未超过 120cm，可以免费游玩。")`,
    out: '请输入你的身高（cm）：135\n身高超过 120cm，需要买票，票价 10 元。'
  },
  {
    p: 35, ch: '3. 判断语句', t: '猜猜心里数字',
    need: '心里想一个数字 5，让用户猜：猜大了、猜小了、猜对了分别提示。',
    steps: ['把答案写成变量', 'input 读入猜测值并转 int', 'if / elif / else 三路判断'],
    code: String.raw`num = 5
guess = int(input("请输入你心里想的数字："))

if guess == num:
    print("猜对了！")
elif guess > num:
    print("猜大了")
else:
    print("猜小了")`,
    out: '请输入你心里想的数字：8\n猜大了'
  },
  {
    p: 37, ch: '3. 判断语句', t: '判断语句综合案例',
    need: '输入年龄，按区间输出人生阶段：0-17 少年、18-35 青年、36-59 中年、60 及以上老年。',
    steps: ['读年龄（可先校验范围）', 'elif 从上往下匹配', '注意条件顺序：先写小区间'],
    code: String.raw`age = int(input("请输入年龄："))

if age < 0 or age > 150:
    print("年龄不合法")
elif age < 18:
    print("少年")
elif age < 36:
    print("青年")
elif age < 60:
    print("中年")
else:
    print("老年")`,
    out: '请输入年龄：28\n青年',
    note: '视频里这一集的题面以实际为准；这段是同一知识点的等价练习，改 need / code 就能换成你的版本。'
  },
  {
    p: 39, ch: '4. 循环语句', t: '求 1-100 的和',
    need: '用 while 循环计算 1 + 2 + … + 100 的结果。',
    steps: ['准备累加变量 total = 0 和计数器 i = 1', 'while i <= 100 时累加', '每次循环 i += 1，否则死循环'],
    code: String.raw`total = 0
i = 1

while i <= 100:
    total += i
    i += 1

print("1-100 的和是：", total)`,
    out: '1-100 的和是： 5050'
  },
  {
    p: 40, ch: '4. 循环语句', t: 'while 循环猜数字',
    need: '程序随机生成 1-100 的数字，用户反复猜，提示猜大/猜小，猜中后结束并公布次数。',
    steps: ['random.randint 生成答案', 'while True 死循环 + input', '三路判断，猜中 break', 'count 记录次数'],
    code: String.raw`import random

answer = random.randint(1, 100)
count = 0

while True:
    guess = int(input("猜一个 1-100 的数字："))
    count += 1
    if guess > answer:
        print("猜大了")
    elif guess < answer:
        print("猜小了")
    else:
        print(f"猜中了！答案就是 {answer}，你猜了 {count} 次")
        break`,
    out: '猜一个 1-100 的数字：50\n猜小了\n猜一个 1-100 的数字：75\n猜大了\n猜一个 1-100 的数字：62\n猜中了！答案就是 62，你猜了 3 次'
  },
  {
    p: 42, ch: '4. 循环语句', t: 'while 循环案例：九九乘法表',
    need: '用两层 while 打印九九乘法表，第 i 行打印 i 个式子。',
    steps: ['外层 i 控制行 1-9', '内层 j 控制列 1-i', 'end="\\t" 不换行、行末 print() 换行'],
    code: String.raw`i = 1
while i <= 9:
    j = 1
    while j <= i:
        print(f"{j}*{i}={i * j}", end="\t")
        j += 1
    print()
    i += 1`,
    out: '1*1=1\t\n1*2=2\t2*2=4\t\n1*3=3\t2*3=6\t3*3=9\t\n…'
  },
  {
    p: 44, ch: '4. 循环语句', t: '数一数有多少个字母 a',
    need: '输入一段文字，用 for 循环统计字母 a 出现了多少次。',
    steps: ['for ch in text 逐个字符', 'if ch == "a" 就累加', '最后输出计数'],
    code: String.raw`text = input("请输入一段文字：")
count = 0

for ch in text:
    if ch == "a":
        count += 1

print("字母 a 出现了", count, "次")`,
    out: '请输入一段文字：banana\n字母 a 出现了 3 次'
  },
  {
    p: 48, ch: '4. 循环语句', t: 'for 循环打印九九乘法表',
    need: '用两层 for 和 range 打印九九乘法表。',
    steps: ['外层 range(1, 10)', '内层 range(1, i + 1)', '行末 print() 换行'],
    code: String.raw`for i in range(1, 10):
    for j in range(1, i + 1):
        print(f"{j}*{i}={i * j}", end="\t")
    print()`,
    out: '1*1=1\t\n1*2=2\t2*2=4\t\n1*3=3\t2*3=6\t3*3=9\t\n…'
  },
  {
    p: 50, ch: '4. 循环语句', t: '循环综合案例：发工资',
    need: '公司账户余额 10000 元，给 20 名员工发工资，每人 1000 元，从 1 号开始发，余额不足就停止并提示。',
    steps: ['for i in range(1, 21) 遍历员工', '余额够就扣 1000 并输出', '不够就提示并 break'],
    code: String.raw`balance = 10000

for i in range(1, 21):
    if balance >= 1000:
        balance -= 1000
        print(f"向 {i} 号员工发放工资 1000 元，账户余额：{balance} 元")
    else:
        print(f"余额不足，无法给 {i} 号员工发工资，当前余额：{balance} 元")
        break`,
    out: '向 1 号员工发放工资 1000 元，账户余额：9000 元\n…\n向 10 号员工发放工资 1000 元，账户余额：0 元\n余额不足，无法给 11 号员工发工资，当前余额：0 元'
  },
  {
    p: 53, ch: '5. 函数', t: '函数基础定义练习',
    need: '定义一个函数，函数体里打印问候语，然后调用它三次。',
    steps: ['def 定义函数', '函数体缩进写 print', '调用三次'],
    code: String.raw`def say_hello():
    print("Hello World")

say_hello()
say_hello()
say_hello()`,
    out: 'Hello World\nHello World\nHello World'
  },
  {
    p: 55, ch: '5. 函数', t: '函数的参数练习',
    need: '定义函数接收姓名和年龄两个参数，打印一句自我介绍。',
    steps: ['形参写 name、age', '函数体用 f-string 拼接', '调用时按顺序传实参'],
    code: String.raw`def intro(name, age):
    print(f"我叫{name}，今年 {age} 岁，正在学 Python。")

intro("张三", 18)
intro("李四", 20)`,
    out: '我叫张三，今年 18 岁，正在学 Python。\n我叫李四，今年 20 岁，正在学 Python。'
  },
  {
    p: 61, ch: '5. 函数', t: '函数综合案例：ATM',
    need: '用函数实现一个简易 ATM：查询余额、存款、取款、退出，初始余额 10000 元。',
    steps: ['把余额写成全局变量', '查询/存款/取款各封装成函数', 'main 里 while True 循环菜单', '取款要判断余额是否足够'],
    code: String.raw`balance = 10000

def query():
    print(f"当前余额：{balance} 元")

def deposit(money):
    global balance
    balance += money
    print(f"存款 {money} 元成功，余额：{balance} 元")

def withdraw(money):
    global balance
    if money > balance:
        print("余额不足")
    else:
        balance -= money
        print(f"取款 {money} 元成功，余额：{balance} 元")

def main():
    print("========== 欢迎使用 ATM ==========")
    while True:
        print("1. 查询余额  2. 存款  3. 取款  4. 退出")
        choice = input("请选择：")
        if choice == "1":
            query()
        elif choice == "2":
            deposit(int(input("存款金额：")))
        elif choice == "3":
            withdraw(int(input("取款金额：")))
        elif choice == "4":
            print("欢迎下次使用")
            break
        else:
            print("输入有误，请重新选择")

main()`,
    out: '========== 欢迎使用 ATM ==========\n1. 查询余额  2. 存款  3. 取款  4. 退出\n请选择：2\n存款金额：500\n存款 500 元成功，余额：10500 元'
  },
  {
    p: 66, ch: '6. 数据容器', t: '列表常用操作练习',
    need: '定义一个列表，完成追加、插入、删除、修改、排序，并输出长度、最大值、最小值、某元素出现次数。',
    steps: ['append / insert 添加', 'remove 按值删除', '下标赋值修改', 'sort 排序后再统计'],
    code: String.raw`nums = [5, 2, 9, 1]

nums.append(7)
nums.insert(0, 3)
nums.remove(9)
nums[1] = 8
nums.sort()

print("列表：", nums)
print("长度：", len(nums))
print("最大值：", max(nums), "最小值：", min(nums))
print("2 出现的次数：", nums.count(2))`,
    out: '列表： [1, 2, 3, 7, 8]\n长度： 5\n最大值： 8 最小值： 1\n2 出现的次数： 1'
  },
  {
    p: 70, ch: '6. 数据容器', t: '字符串课后练习',
    need: '输入一段文字，完成：去首尾空格、统计长度、统计某字符出现次数、按逗号分割、转大写。',
    steps: ['strip 去首尾空白', 'count 统计字符', 'split 分割成列表', 'upper 转大写'],
    code: String.raw`text = input("请输入一段文字：")

print("去掉首尾空格：", text.strip())
print("长度：", len(text))
print("a 出现的次数：", text.count("a"))
print("按逗号分割：", text.split(","))
print("全部大写：", text.upper())`,
    out: '请输入一段文字：  hello,world,a  \n去掉首尾空格： hello,world,a\n长度： 17\na 出现的次数： 1\n按逗号分割： [\'  hello\', \'world\', \'a  \']\n全部大写：   HELLO,WORLD,A  '
  },
  {
    p: 72, ch: '6. 数据容器', t: '序列的切片练习',
    need: '对字符串 "0123456789" 分别取：前 3 位、后 3 位、每隔一个取一个、整体反转、2 到 8 每隔一个取一个。',
    steps: ['左闭右开，结束位不含', '负下标从右往前', '步长 2 跳着取', '步长 -1 反转'],
    code: String.raw`s = "0123456789"

print(s[:3])        # 012
print(s[-3:])       # 789
print(s[::2])       # 02468
print(s[::-1])      # 9876543210
print(s[2:8:2])     # 246`,
    out: '012\n789\n02468\n9876543210\n246'
  },
  {
    p: 74, ch: '6. 数据容器', t: '集合课后练习',
    need: '两个列表 a、b，分别求去重结果、交集、并集、a 减 b 的差集。',
    steps: ['set() 转集合自动去重', '& 交集、| 并集、- 差集', '需要列表再用 list() 转回'],
    code: String.raw`a = [1, 2, 3, 3, 4]
b = [3, 4, 5]

sa, sb = set(a), set(b)

print("去重后的 a：", sa)
print("交集：", sa & sb)
print("并集：", sa | sb)
print("差集 a-b：", sa - sb)`,
    out: '去重后的 a： {1, 2, 3, 4}\n交集： {3, 4}\n并集： {1, 2, 3, 4, 5}\n差集 a-b： {1, 2}'
  },
  {
    p: 77, ch: '6. 数据容器', t: '字典课后练习',
    need: '用字典存员工姓名、年龄、城市，完成：改年龄、加薪水、用 get 取不存在的字段、遍历、删城市。',
    steps: ['key 赋值就是新增 / 修改', 'get(key, 默认值) 取不到不报错', 'items() 遍历键值对', 'pop 删除'],
    code: String.raw`emp = {"name": "张三", "age": 18, "city": "北京"}

emp["age"] = 19
emp["salary"] = 8000

print(emp.get("name"))
print(emp.get("phone", "没有这个字段"))

for k, v in emp.items():
    print(k, "=", v)

emp.pop("city")
print(emp)`,
    out: '张三\n没有这个字段\nname = 张三\nage = 19\ncity = 北京\nsalary = 8000\n{\'name\': \'张三\', \'age\': 19, \'salary\': 8000}'
  },
  {
    p: 87, ch: '8. 文件操作', t: '文件读取课后练习',
    need: '读取 word.txt，统计单词 itheima 一共出现了多少次。',
    steps: ['with open 按行读', 'line.count("itheima") 累加', '需要忽略大小写就先 lower()'],
    code: String.raw`count = 0

with open("word.txt", "r", encoding="utf-8") as f:
    for line in f:
        count += line.count("itheima")

print("itheima 出现了", count, "次")`,
    out: 'itheima 出现了 7 次'
  },
  {
    p: 90, ch: '8. 文件操作', t: '文件操作综合案例：备份',
    need: '读取 bill.txt 的内容，反转后写入 bill.txt.bak，完成备份。',
    steps: ['以 r 打开原文件读全文', '以 w 打开备份文件', '写入 content[::-1]', '两个 with 分开写'],
    code: String.raw`with open("bill.txt", encoding="utf-8") as f:
    content = f.read()

with open("bill.txt.bak", "w", encoding="utf-8") as f:
    f.write(content[::-1])

print("备份完成：bill.txt.bak")`,
    out: '备份完成：bill.txt.bak'
  },
  {
    p: 98, ch: '9. 异常与模块', t: '异常-模块-包综合案例',
    need: '把字符串处理工具做成包 my_utils，主程序导入调用，并用 try 捕获输入异常。',
    steps: ['建 my_utils 文件夹和 __init__.py', 'str_util.py 里写 reverse / truncate', '主程序 from my_utils import str_util', '外面套 try/except'],
    code: String.raw`# my_utils/__init__.py（空文件）
# my_utils/str_util.py
def reverse(s):
    return s[::-1]

def truncate(s, n):
    return s[:n]

# main.py
from my_utils import str_util

try:
    text = input("输入字符串：")
    print("反转：", str_util.reverse(text))
    print("前 3 位：", str_util.truncate(text, 3))
except Exception as e:
    print("出错了：", e)`,
    out: '输入字符串：abcdef\n反转： fedcba\n前 3 位： abc'
  },
  {
    p: 102, ch: '10. 数据可视化', t: '折线图：中美日 GDP',
    need: '读 gdp.json，画 1960-2019 年中国、美国、日本 GDP 折线图，保存成 html。',
    steps: ['json.load 读数据', 'sorted(data.keys()) 取年份', '每个国家一条 add_yaxis', 'set_global_opts 设标题', 'render 输出 html'],
    code: String.raw`import json
from pyecharts.charts import Line
from pyecharts.options import TitleOpts

with open("gdp.json", encoding="utf-8") as f:
    data = json.load(f)

years = sorted(data.keys())
line = Line()
line.add_xaxis(years)
for country in ("中国", "美国", "日本"):
    line.add_yaxis(country, [data[y][country] for y in years])

line.set_global_opts(title_opts=TitleOpts(title="1960-2019 中美日 GDP"))
line.render("gdp.html")`,
    out: '生成 gdp.html，浏览器打开可见三条折线',
    pre: 'pip install pyecharts'
  },
  {
    p: 106, ch: '11. 地图', t: '疫情地图：全国 / 河南',
    need: '读数据，清洗省份名后用 Map 画全国疫情地图，再把 maptype 换成「河南」画省图。',
    steps: ['数据整理成 [(地名, 数值)]', 'replace 去掉「省/市/自治区」', 'Map.add 第三个参数写地图类型', 'VisualMapOpts 控制颜色'],
    code: String.raw`import json
from pyecharts.charts import Map
from pyecharts.options import TitleOpts, VisualMapOpts

with open("data.json", encoding="utf-8") as f:
    data = json.load(f)

items = [(k.replace("省", "").replace("市", "").replace("自治区", ""), v)
         for k, v in data.items()]

m = Map()
m.add("确诊", items, "china")
m.set_global_opts(
    title_opts=TitleOpts(title="全国疫情地图"),
    visualmap_opts=VisualMapOpts(max_=max(data.values()))
)
m.render("map.html")`,
    out: '生成 map.html；把 "china" 换成 "河南"、数据换成地市即可出省图'
  },
  {
    p: 109, ch: '12. 柱状图', t: '时间线柱状图 / 动态 GDP',
    need: '每年取 GDP 前 8 的国家画横向柱状图，按年份塞进 Timeline，自动播放成动画。',
    steps: ['每年排序取前 8', '每年新建一个 Bar', 'reversal_axis 横向', 'timeline.add(bar, 年份)', 'add_schema 设播放间隔'],
    code: String.raw`import json
from pyecharts.charts import Bar, Timeline
from pyecharts.options import TitleOpts, LabelOpts

with open("gdp.json", encoding="utf-8") as f:
    data = json.load(f)

tl = Timeline()
for year in sorted(data.keys()):
    top8 = sorted(data[year].items(), key=lambda kv: kv[1], reverse=True)[:8]
    bar = Bar()
    bar.add_xaxis([k for k, v in top8])
    bar.add_yaxis(year, [v for k, v in top8], label_opts=LabelOpts(position="right"))
    bar.reversal_axis()
    bar.set_global_opts(title_opts=TitleOpts(title=f"{year} 年 GDP 前 8"))
    tl.add(bar, year)

tl.add_schema(play_interval=600, is_auto_play=True)
tl.render("gdp_timeline.html")`,
    out: '生成 html，点播放键就能看到排名逐年变化'
  },
  {
    p: 117, ch: '13. 面向对象', t: '封装课后练习：手机类',
    need: '设计手机类，品牌和价格私有，提供方法查看、修改价格，修改时校验不能为负数。',
    steps: ['__init__ 里用 __ 声明私有属性', 'get_price 返回价格', 'set_price 里做 < 0 校验'],
    code: String.raw`class Phone:
    def __init__(self, brand, price):
        self.__brand = brand
        self.__price = price

    def get_price(self):
        return self.__price

    def set_price(self, price):
        if price < 0:
            print("价格不能为负数")
            return
        self.__price = price

p = Phone("小米", 1999)
print(p.get_price())    # 1999
p.set_price(-100)       # 价格不能为负数
print(p.get_price())    # 1999`,
    out: '1999\n价格不能为负数\n1999'
  }
];
