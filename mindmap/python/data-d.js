/* 第 10-13 章：数据可视化 / 地图 / 柱状图 / 面向对象 */
(window.PY_CHAPTERS = window.PY_CHAPTERS || []).push(
{
  n: '10. python数据可视化',
  eps: 'P99–P104',
  p: 99, p2: 104,
  intro: '用 JSON + pyecharts 把数据画成折线图。',
  sec: [
    {
      n: '案例介绍',
      d: '用 pyecharts 画 1960–2019 中美日 GDP 折线图。流程：读 JSON → 取年份和三国数据 → add_xaxis / add_yaxis → render 成 html。',
      tips: ['先跑通最小例子，再换真实数据', '生成的 html 用浏览器打开看']
    },
    {
      n: 'JSON数据格式的转换',
      d: 'JSON 是数据交换格式，本质是字符串。dumps 把 Python 数据转成 JSON 字符串，loads 反过来。',
      code: String.raw`import json

s = json.dumps({"name": "张三", "age": 18}, ensure_ascii=False)
print(s)                       # {"name": "张三", "age": 18}

d = json.loads('{"age": 18}')
print(d["age"])                # 18`,
      tips: ['JSON 里只能用双引号', 'ensure_ascii=False 让中文不转义']
    },
    {
      n: 'pyecharts模块简介',
      d: 'pyecharts 是 ECharts 的 Python 封装，几行代码就能出可交互图表；官网 gallery 有现成例子可以抄。',
      tips: ['先 pip install pyecharts', '常用：Line、Bar、Map、Timeline']
    },
    {
      n: 'pyecharts的入门使用',
      d: '建图对象 → add_xaxis → add_yaxis → set_global_opts → render 输出 html。',
      code: String.raw`from pyecharts.charts import Line
from pyecharts.options import TitleOpts

line = Line()
line.add_xaxis(["一月", "二月", "三月"])
line.add_yaxis("销量", [10, 20, 30])
line.set_global_opts(title_opts=TitleOpts(title="示例折线图"))
line.render("line.html")`,
      tips: ['options 里的配置类要单独 import', 'render 会生成一个 html 文件']
    },
    {
      n: '数据准备',
      d: '读 JSON 文件，把年份整理成 x 轴列表，把每个国家的 GDP 整理成 y 轴列表。',
      code: String.raw`import json

with open("gdp.json", encoding="utf-8") as f:
    data = json.load(f)

years = sorted(data.keys())
china = [data[y]["中国"] for y in years]
usa = [data[y]["美国"] for y in years]
print(years[:3], china[:3])`,
      tips: ['年份要排序，否则折线会乱', '缺数据的年份要跳过或补 0']
    },
    {
      n: '生成折线图',
      d: '三条 add_yaxis，设置标题和图例，render 出 html。',
      code: String.raw`line = Line()
line.add_xaxis(years)
line.add_yaxis("中国", china)
line.add_yaxis("美国", usa)
line.add_yaxis("日本", japan)
line.set_global_opts(title_opts=TitleOpts(title="1960-2019 中美日 GDP"))
line.render("gdp.html")`,
      tips: ['图例名重复会互相覆盖', '打开 html 检查数据和图例对不对']
    }
  ]
},
{
  n: '11. python地图可视化',
  eps: 'P105–P107',
  p: 105, p2: 107,
  intro: '用 pyecharts 的 Map 画中国地图和省地图。',
  sec: [
    {
      n: '基础地图使用',
      d: 'Map 的数据格式是 [(地名, 数值), ...]，maptype 决定地图范围，visualmap 控制颜色深浅。',
      code: String.raw`from pyecharts.charts import Map
from pyecharts.options import VisualMapOpts

m = Map()
m.add("确诊人数", [("北京", 100), ("上海", 80), ("广东", 120)], "china")
m.set_global_opts(visualmap_opts=VisualMapOpts(max_=120))
m.render("map.html")`,
      tips: ['地名要和地图里的名字完全一致', 'maptype 可以是 china / 河南 / 广东']
    },
    {
      n: '全国疫情地图构建',
      d: '读数据 → 清洗省份名（去掉「省」「市」「自治区」）→ 组装成 [(省, 数值)] → Map 出图。',
      code: String.raw`data = [("北京市", 100), ("广东省", 120)]
clean = [(n.replace("市", "").replace("省", "").replace("自治区", ""), v) for n, v in data]
m.add("确诊", clean, "china")`,
      tips: ['名字对不上就显示不出来', '先打印清洗后的名字检查一遍']
    },
    {
      n: '河南省疫情地图绘制',
      d: '只改 maptype 为「河南」，数据换成河南各地市，代码结构完全一样。',
      code: String.raw`m = Map()
m.add("确诊", [("郑州", 30), ("洛阳", 12)], "河南")
m.render("henan.html")`,
      tips: ['地市名去掉「市」再匹配', '同一份代码换数据就能复用']
    }
  ]
},
{
  n: '12. python柱状图可视化',
  eps: 'P108–P110',
  p: 108, p2: 110,
  intro: '柱状图、时间线动画和动态 GDP 排名。',
  sec: [
    {
      n: '基础柱状图构建',
      d: 'Bar + add_xaxis + add_yaxis；reversal_axis 变成横向；label_opts 控制数值标签位置。',
      code: String.raw`from pyecharts.charts import Bar
from pyecharts.options import LabelOpts

bar = Bar()
bar.add_xaxis(["A", "B", "C"])
bar.add_yaxis("数量", [3, 7, 5], label_opts=LabelOpts(position="right"))
bar.reversal_axis()
bar.render("bar.html")`,
      tips: ['横向柱状图适合做排名', '数值标签放右边更清楚']
    },
    {
      n: '基础时间线柱状图',
      d: 'Timeline 一个时间点放一张图，自动播放形成动画；add_schema 控制播放间隔。',
      code: String.raw`from pyecharts.charts import Bar, Timeline

tl = Timeline()
for year in (2024, 2025):
    bar = Bar()
    bar.add_xaxis(["A", "B"])
    bar.add_yaxis(str(year), [year % 7, 5])
    tl.add(bar, str(year))

tl.add_schema(play_interval=800, is_auto_play=True)
tl.render("timeline.html")`,
      tips: ['每帧的图要单独建，不能复用同一个 bar', 'play_interval 单位是毫秒']
    },
    {
      n: '动态GDP柱状图',
      d: '每年取 GDP 前 8 的国家，排序后画横向柱状图，按年份顺序塞进 Timeline。',
      code: String.raw`for year in sorted(data.keys()):
    items = sorted(data[year].items(), key=lambda kv: kv[1], reverse=True)[:8]
    names = [k for k, v in items]
    vals = [v for k, v in items]
    bar = Bar()
    bar.add_xaxis(names)
    bar.add_yaxis(year, vals, label_opts=LabelOpts(position="right"))
    bar.reversal_axis()
    bar.set_global_opts(title_opts=TitleOpts(title=year + " 年 GDP 前 8"))
    tl.add(bar, year)`,
      tips: ['横向柱状图默认从下往上，排名方向别弄反', '年份太多渲染慢，先拿几年试']
    }
  ]
},
{
  n: '13. python面向对象',
  eps: 'P111–P123',
  p: 111, p2: 123,
  intro: '类、对象、封装、继承、类型注解和多态 —— 从写脚本到写工程的分水岭。',
  sec: [
    {
      n: '初识对象',
      d: '类像「设计表格」，对象像「填好的一行数据」。类里定义属性和方法，对象是类的实例。',
      code: String.raw`class Student:
    name = ""
    age = 0

s = Student()
s.name = "张三"
s.age = 18
print(s.name, s.age)`,
      tips: ['类名首字母大写', '类只是模板，不占实际数据']
    },
    {
      n: '类的成员方法',
      d: '定义在类里的函数叫方法，第一个参数固定写 self，表示当前对象自己。',
      code: String.raw`class Student:
    def say(self):
        print("我是", self.name)

s = Student()
s.name = "张三"
s.say()`,
      tips: ['self 不用手动传', '方法里访问自己的属性要写 self.属性']
    },
    {
      n: '类和对象',
      d: '用 类名() 创建对象（实例化），一个类可以创建多个互不影响的对象。',
      code: String.raw`class Student:
    name = ""

a = Student()
b = Student()
a.name = "张三"
b.name = "李四"
print(a.name, b.name)`,
      tips: ['每个对象有自己的属性值', '直接写在类里的属性是所有对象共享的']
    },
    {
      n: '构造方法',
      d: '__init__ 在创建对象时自动执行，用来设置初始属性；参数在 类名(...) 时传入。',
      code: String.raw`class Student:
    def __init__(self, name, age=18):
        self.name = name
        self.age = age

s = Student("张三", 20)
print(s.name, s.age)`,
      tips: ['__init__ 不能写 return', '默认值参数照样要放最后']
    },
    {
      n: '魔术方法',
      d: '前后各两个下划线的方法会被自动调用：__str__ 决定 print 的样子，__lt__ / __eq__ 等决定比较结果。',
      code: String.raw`class Student:
    def __init__(self, name, score):
        self.name = name
        self.score = score

    def __str__(self):
        return f"{self.name}:{self.score}"

    def __lt__(self, other):
        return self.score < other.score

a, b = Student("张三", 90), Student("李四", 80)
print(a)          # 张三:90
print(b < a)      # True`,
      tips: ['不写 __str__，print 出来是内存地址', '比较方法要和比较符一一对应']
    },
    {
      n: '封装',
      d: '把数据和方法包在类里，用 __ 开头声明私有成员，类外部不能直接访问，只能通过方法。',
      code: String.raw`class Account:
    def __init__(self):
        self.__balance = 0

    def deposit(self, n):
        if n > 0:
            self.__balance += n

    def get_balance(self):
        return self.__balance

a = Account()
a.deposit(100)
print(a.get_balance())      # 100
# print(a.__balance)        # 报错`,
      tips: ['私有只是改名（_类名__变量），不是绝对安全', '对外提供 get/set 方法，顺便做校验']
    },
    {
      n: '封装的课后练习题讲解',
      d: '设计手机类：品牌、价格私有，提供方法查看和修改价格，修改时校验不能为负。',
      code: String.raw`class Phone:
    def __init__(self, brand, price):
        self.__brand = brand
        self.__price = price

    def get_price(self):
        return self.__price

    def set_price(self, p):
        if p >= 0:
            self.__price = p

p = Phone("小米", 1999)
p.set_price(-1)
print(p.get_price())    # 1999，非法值被拦住`,
      tips: ['校验写在 set 方法里', '只读属性可以只提供 get']
    },
    {
      n: '继承的基础语法',
      d: 'class 子类(父类): 子类自动拥有父类的属性和方法；支持多继承，同名方法按顺序取第一个。',
      code: String.raw`class Person:
    def say(self):
        print("我是人")

class Student(Person):
    pass

s = Student()
s.say()        # 我是人`,
      tips: ['继承表达 is-a 关系（学生是人）', '多继承用逗号隔开，越靠前优先级越高']
    },
    {
      n: '复写父类成员和调用父类成员',
      d: '子类定义同名方法就是复写；想用父类的实现，可以 super().方法() 或 父类名.方法(self)。',
      code: String.raw`class Person:
    def say(self):
        print("我是人")

class Student(Person):
    def say(self):
        super().say()
        print("我是学生")

Student().say()`,
      tips: ['super() 在子类里代表父类', '复写后父类原方法还在，只是被挡住了']
    },
    {
      n: '变量的类型注解',
      d: '变量: 类型 = 值，只是给 IDE 和读代码的人看的提示，不影响运行。',
      code: String.raw`name: str = "张三"
age: int = 18
scores: list[int] = [90, 80]
info: dict[str, int] = {"math": 90}`,
      tips: ['注解写错不会报错', '容器注解用 list[int] 这种写法']
    },
    {
      n: '函数和方法的类型注解',
      d: '形参后面加「: 类型」，返回值用 -> 类型；方法同理，self 不用注解。',
      code: String.raw`def add(a: int, b: int) -> int:
    return a + b

class Calc:
    def add(self, a: int, b: int) -> int:
        return a + b`,
      tips: ['注解只是提示，传错类型运行时才可能出错', '配合 IDE 能提前发现类型问题']
    },
    {
      n: 'Union联合类型注解',
      d: 'Union[int, str] 表示「可以是 int 也可以是 str」；Python 3.10+ 可以简写成 int | str。',
      code: String.raw`from typing import Union

def show(x: Union[int, str]) -> str:
    return str(x)

print(show(1), show("a"))`,
      tips: ['Union 从 typing 导入', '容器里也能用 list[Union[int, str]]']
    },
    {
      n: '多态',
      d: '同一个方法，不同对象有不同表现。前提是继承 + 复写父类方法；好处是加新子类不用改调用方代码。',
      code: String.raw`class Animal:
    def speak(self):
        print("...")

class Dog(Animal):
    def speak(self):
        print("汪")

class Cat(Animal):
    def speak(self):
        print("喵")

for a in (Dog(), Cat()):
    a.speak()`,
      tips: ['多态靠复写实现', '抽象基类 abc.ABC 可以强制子类实现方法']
    }
  ]
}
);
