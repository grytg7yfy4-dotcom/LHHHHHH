/* 第 1-3 章：基础操作 / 基础语法 / 判断语句 */
(window.PY_CHAPTERS = window.PY_CHAPTERS || []).push(
{
  n: '1. python基础操作',
  eps: 'P1–P13',
  p: 1, p2: 13,
  intro: '装环境、用 PyCharm、把写代码的工具先弄顺手。这一章不难，但坑最多。',
  sec: [
    {
      n: '常见问题',
      d: '新手最先卡住的往往不是语法，而是输入法、缩进和保存：中文引号或括号会让解释器直接报 SyntaxError；空格和 Tab 混用会报 IndentationError；改完没保存，跑的还是旧代码。',
      code: String.raw`print("你好")          # 正确：英文引号
# print（"你好"）      # 错误：中文括号
# 报错先看最后一行，它会告诉你错在第几行`,
      tips: ['写代码时把输入法切到英文', '缩进统一 4 个空格，别和 Tab 混用', '改完按 Ctrl+S，再运行']
    },
    {
      n: 'python解释器（python环境）',
      d: '计算机只认识二进制，解释器负责把 .py 一行行翻译成机器能执行的东西。装 Python 就是装解释器；装完在命令行敲 python 能进交互模式，适合做小实验。',
      code: String.raw`python --version
# Python 3.12.0

python
>>> print("hi")
hi`,
      tips: ['Windows 安装时勾选 Add Python to PATH', '一个电脑可以装多个版本，用 py -3.12 指定']
    },
    {
      n: '在左上角的三条杠',
      d: 'PyCharm 左上角的 ≡ 就是主菜单：新建项目、打开最近项目、Settings（设置）、切换主题都在里面。项目建议建在一个空文件夹里，PyCharm 会生成 .idea 配置目录。',
      tips: ['项目路径别带中文和空格', '整个项目文件夹拷走，换电脑能直接继续']
    },
    {
      n: '插件',
      d: 'Settings → Plugins 里装插件。新手最常用的是翻译插件（选中单词右键翻译）和中文语言包；装完要重启 IDE 才生效。',
      tips: ['插件装太多会拖慢启动', '翻译插件需要联网']
    },
    {
      n: '快捷键使用',
      d: '记住几个就够用：Ctrl+/ 注释或取消注释、Ctrl+D 复制当前行、Ctrl+Z 撤销、Shift+F10 运行、Ctrl+Shift+F10 运行当前文件。',
      code: String.raw`# 选中下面两行，按 Ctrl + /
print("第一行")
print("第二行")`,
      tips: ['Ctrl+/ 是注释和取消注释来回切', 'Ctrl+Alt+L 可以一键格式化代码']
    },
    {
      n: '制表符',
      d: '\\t 是一个转义字符，输出时占一个制表位，用来让多行文本对齐。它不是四个空格，只是显示宽度接近。',
      code: String.raw`print("姓名\t年龄\t城市")
print("张三\t18\t北京")
print("李四\t20\t上海")`,
      tips: ['对齐效果和字体、终端宽度有关', '要精确对齐可以用 ljust/rjust 或 f-string 的宽度控制']
    }
  ]
},
{
  n: '2. python基础知识语法',
  eps: 'P14–P28',
  p: 14, p2: 28,
  intro: '变量、类型、运算符、字符串和输入输出，是整个 Python 的地基。',
  sec: [
    {
      n: 'print 打印输出内容',
      d: 'print 把括号里的内容输出到控制台。字符串要加引号；多个内容用逗号隔开，默认用空格分隔；end 参数控制结尾（默认换行）。',
      code: String.raw`print("hello")
print("a", "b", "c")        # a b c
print("不换行", end="")
print("接着输出")`,
      tips: ['括号、引号都必须是英文半角', 'end 默认是换行符，改成空串就不换行']
    },
    {
      n: '字面量',
      d: '代码里直接写死的值叫字面量：整数 666、浮点数 13.14、字符串 "黑马"。写什么就是什么，不需要计算。',
      code: String.raw`print(666)
print(13.14)
print("黑马程序员")`,
      tips: ['字符串必须带引号，数字不用', 'True / False 也是字面量（布尔）']
    },
    {
      n: '注释',
      d: '注释是给人看的，解释器会跳过。单行用 #，多行用三引号。注释写「为什么这么做」，别写「这行是什么」。',
      code: String.raw`# 单价 × 数量
total = 99 * 3

"""
下面输出总价
"""
print(total)`,
      tips: ['# 后面习惯空一格', '三引号注释常写在文件或函数开头做说明']
    },
    {
      n: '变量',
      d: '变量是给数据起的名字。= 是赋值：把右边的值塞给左边的变量，不是数学里的相等。',
      code: String.raw`name = "张三"
age = 18
age = age + 1        # 19
print(name, age)`,
      tips: ['变量要先赋值再使用，否则 NameError', '同一个变量可以重新赋值，类型也能变']
    },
    {
      n: '数据类型',
      d: '最常用三种：int 整数、float 小数、str 字符串；type() 可以查看一个数据的类型。',
      code: String.raw`print(type(666))      # <class 'int'>
print(type(13.14))    # <class 'float'>
print(type("hi"))     # <class 'str'>`,
      tips: ['变量本身没有类型，变量里存的数据有类型', '布尔 bool 只有 True / False 两个值']
    },
    {
      n: '数据类型转换',
      d: 'int()、float()、str() 把数据转成对应类型。字符串转数字时，字符串内容必须真的是数字，否则直接报错。',
      code: String.raw`n = int("11") + 1        # 12
pi = float("3.14")
s = str(100)
print(int(13.99))        # 13，小数转整数直接截断`,
      tips: ['int("abc") 会抛 ValueError', '任何类型都能 str()，反过来不一定']
    },
    {
      n: '标识符（名字）',
      d: '变量、函数、类的名字统称标识符。规则：只能由字母、数字、下划线组成（中文也行但不建议），数字不能开头，区分大小写，不能用关键字。',
      code: String.raw`first_name = "张"
user_age = 18
# 1name = "x"    # 报错：数字不能开头`,
      tips: ['见名知意，多个单词用下划线连接', '别用 if / for / class / True 这些关键字']
    },
    {
      n: '运算符',
      d: '算术运算符 + - * / // % **：/ 结果一定是小数，// 是整除，% 取余，** 是幂。还有比较运算符和逻辑运算符。',
      code: String.raw`print(9 / 2)     # 4.5
print(9 // 2)    # 4
print(9 % 2)     # 1
print(2 ** 3)    # 8`,
      tips: ['字符串的 + 是拼接，* 是重复', '优先级不确定就加括号']
    },
    {
      n: '字符串扩展',
      d: '字符串有三种定义方式（单引号、双引号、三引号）；拼接用 +；格式化推荐 f-string，能直接把变量和表达式塞进字符串。',
      code: String.raw`name = "张三"
print("我叫" + name)
print("我叫%s，今年%d岁" % (name, 18))
print(f"我叫{name}，今年{18}岁")
print("%.2f" % 3.14159)     # 3.14`,
      tips: ['+ 只能拼字符串，数字要先 str()', 'f-string 最直观，还能写表达式 {a + b}']
    },
    {
      n: '数据输入',
      d: 'input() 从键盘读一行，返回值永远是字符串；要数字得自己 int() / float() 转。',
      code: String.raw`age = input("请输入年龄：")
age = int(age)
print(f"明年你 {age + 1} 岁")`,
      tips: ['input 的结果一定是 str', '提示语会原样打印出来，不会自动换行']
    }
  ]
},
{
  n: '3. python判断语句',
  eps: 'P29–P37',
  p: 29, p2: 37,
  intro: '让程序会「看情况」：if / else / elif / 嵌套。',
  sec: [
    {
      n: '布尔类型和比较运算符',
      d: '布尔只有 True / False；比较运算的结果就是布尔值。== 判断相等，= 是赋值，别写混。',
      code: String.raw`print(10 > 5)        # True
print("a" == "a")    # True
print(10 != 10)      # False`,
      tips: ['比较结果可以直接放进 if', '浮点数尽量别用 == 比较']
    },
    {
      n: 'if语句的基本格式',
      d: '条件成立才执行缩进的代码块。if 后面必须写冒号，缩进决定哪些代码属于这个 if。',
      code: String.raw`age = 18
if age >= 18:
    print("成年了")`,
      tips: ['冒号不能少', '缩进统一 4 个空格，同一层要对齐']
    },
    {
      n: 'if else语句',
      d: '二选一：条件成立走 if 分支，否则走 else 分支。else 后面不写条件。',
      code: String.raw`score = 59
if score >= 60:
    print("及格")
else:
    print("不及格")`,
      tips: ['else 的缩进要和 if 对齐', '两个分支只会走一个']
    },
    {
      n: 'if elif else 语句',
      d: '多条件判断，从上往下依次匹配，命中一个就不再往下走，所以条件的顺序很重要。',
      code: String.raw`score = 85
if score >= 90:
    print("优秀")
elif score >= 60:
    print("及格")
else:
    print("不及格")`,
      tips: ['elif 可以有任意多个', '先写严格的条件，再写宽松的']
    },
    {
      n: '判断语句的嵌套',
      d: 'if 里面再写 if，靠缩进区分层级。嵌套超过三层就该考虑拆函数或提前 return 了。',
      code: String.raw`has_ticket = True
height = 1.1

if has_ticket:
    if height < 1.2:
        print("免票")
    else:
        print("半价")
else:
    print("先买票")`,
      tips: ['每进一层就多 4 个空格', '嵌套太深可读性差，尽量写扁平']
    }
  ]
}
);
