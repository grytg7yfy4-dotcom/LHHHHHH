/* 第 7-9 章：函数进阶 / 文件操作 / 异常模块与包 */
(window.PY_CHAPTERS = window.PY_CHAPTERS || []).push(
{
  n: '7. python函数进阶',
  eps: 'P81–P84',
  p: 81, p2: 84,
  intro: '多返回值、四种传参、函数当参数、lambda，函数开始变得灵活。',
  sec: [
    {
      n: '函数多返回值',
      d: 'return a, b 实际返回的是一个元组；调用处用 x, y = f() 拆包接收。',
      code: String.raw`def calc(a, b):
    return a + b, a * b

s, p = calc(3, 4)
print(s, p)      # 7 12`,
      tips: ['返回几个就接几个，数量要对上', '不想要的值可以用 _ 占位']
    },
    {
      n: '函数多种传参方式',
      d: '位置参数按顺序传；关键字参数写「名=值」；缺省参数有默认值；不定长参数 *args 收元组、**kwargs 收字典。',
      code: String.raw`def f(a, b=2, *args, **kwargs):
    print(a, b, args, kwargs)

f(1)                       # 1 2 () {}
f(1, 3)                    # 1 3 () {}
f(1, 3, 4, 5, name="x")    # 1 3 (4, 5) {'name': 'x'}`,
      tips: ['缺省参数要放在参数列表最后', '*args / **kwargs 一般也放最后']
    },
    {
      n: '函数作为参数传递',
      d: '函数名本身是一个对象，可以当参数传给别的函数，这叫高阶函数或回调。传的是「逻辑」，不是「结果」。',
      code: String.raw`def add(x, y):
    return x + y

def calc(func, x, y):
    return func(x, y)

print(calc(add, 3, 4))     # 7`,
      tips: ['传 add 而不是 add()', 'sorted(key=...)、map 都是这个套路']
    },
    {
      n: '匿名函数',
      d: 'lambda 形参: 表达式，只能写一行，表达式的结果就是返回值，一般直接当参数用。',
      code: String.raw`f = lambda x: x * 2
print(f(3))          # 6

students = [{"n": "a", "age": 18}, {"n": "b", "age": 16}]
students.sort(key=lambda s: s["age"])
print(students)`,
      tips: ['lambda 里只能写表达式，不能写语句', '逻辑复杂还是用 def，可读性更好']
    }
  ]
},
{
  n: '8. python文件操作',
  eps: 'P85–P90',
  p: 85, p2: 90,
  intro: '读写本地文件：编码、读、写、追加和备份案例。',
  sec: [
    {
      n: '文件编码概念',
      d: '编码是把文字翻译成二进制的规则，解码是反过来；UTF-8 最通用。读写两端编码不一致就会乱码。',
      tips: ['新建文件统一用 UTF-8', 'Windows 记事本另存为时注意编码选项']
    },
    {
      n: '文件的读取操作',
      cases: [87],
      d: 'open(路径, "r", encoding="utf-8") 打开；read 读全部或指定字节，readlines 读所有行，readline 读一行；用完 close，推荐 with。',
      code: String.raw`with open("data.txt", "r", encoding="utf-8") as f:
    print(f.read())

with open("data.txt", encoding="utf-8") as f:
    for line in f:
        print(line.strip())`,
      tips: ['read 是接着上次位置继续读', '每行末尾自带换行符，用 strip() 去掉']
    },
    {
      n: '文件读取的课后练习',
      d: '统计某个单词出现次数：读全文用 count，或者逐行累加。重点是「打开 → 读取 → 关闭」这个流程。',
      code: String.raw`count = 0
with open("word.txt", encoding="utf-8") as f:
    for line in f:
        count += line.count("itheima")
print(count)`,
      tips: ['大小写不同要先 lower() 统一', '文件不存在会抛 FileNotFoundError']
    },
    {
      n: '文件的写出操作',
      d: '模式 w：文件不存在就创建，存在就清空重写；write 先写缓冲区，flush 或 close 才真正落盘。',
      code: String.raw`with open("out.txt", "w", encoding="utf-8") as f:
    f.write("第一行\n")
    f.write("第二行\n")`,
      tips: ['w 会清空原文件，别拿它做追加', '写多行要自己加换行符']
    },
    {
      n: '文件的追加写入',
      d: '模式 a：文件不存在就创建，存在就在末尾接着写，不覆盖原内容。',
      code: String.raw`with open("log.txt", "a", encoding="utf-8") as f:
    f.write("2026-10-29 学习打卡\n")`,
      tips: ['a 不会清空文件', '写日志最常用这个模式']
    },
    {
      n: '文件操作综合案例',
      cases: [90],
      d: '读原文件 → 处理（这里做反转）→ 写到备份文件；读写用两个文件对象，with 自动关闭。',
      code: String.raw`with open("bill.txt", encoding="utf-8") as f:
    content = f.read()

with open("bill.txt.bak", "w", encoding="utf-8") as f:
    f.write(content[::-1])`,
      tips: ['读和写不要同时打开同一个文件', '备份文件名加 .bak 便于区分']
    }
  ]
},
{
  n: '9. python异常、模块与包',
  eps: 'P91–P98',
  p: 91, p2: 98,
  intro: '程序出错怎么办、代码怎么拆成模块和包、怎么装第三方库。',
  sec: [
    {
      n: '了解异常',
      d: '程序运行出错就是异常，不处理程序会中断。常见：NameError、TypeError、ZeroDivisionError、IndexError、KeyError。',
      tips: ['异常不可怕，可怕的是不知道为什么', '看报错的最后一行和行号']
    },
    {
      n: '异常的捕获',
      cases: [98],
      d: 'try 包住可能出错的代码，except 接住；可以捕获指定类型、多个类型，或用 Exception 兜底；else 无异常时执行，finally 一定执行。',
      code: String.raw`try:
    num = int(input("数字："))
    print(10 / num)
except ZeroDivisionError:
    print("不能除以 0")
except Exception as e:
    print("出错了：", e)
else:
    print("没有异常")
finally:
    print("结束")`,
      tips: ['try 里的代码越少越好', 'finally 常用来关文件、释放资源']
    },
    {
      n: '异常的传递性',
      d: '异常会沿着调用链往上抛，谁都不处理程序就崩；可以在最外层统一 try 捕获。',
      code: String.raw`def a():
    return 1 / 0

def b():
    a()

try:
    b()
except ZeroDivisionError:
    print("在最外层接住了")`,
      tips: ['底层函数可以不处理，交给上层', '别忘了记录日志，不然问题会被吞掉']
    },
    {
      n: '模块的概念和导入',
      d: '一个 .py 文件就是一个模块；用 import 导入，from ... import 导入具体功能，as 起别名。',
      code: String.raw`import math
print(math.sqrt(9))       # 3.0

from random import randint
print(randint(1, 10))

import json as js
print(js.dumps({"a": 1}))`,
      tips: ['模块名不要和内置模块重名', '标准库不用装，直接 import']
    },
    {
      n: '自定义模块并导入',
      d: '自己写 my_module.py，里面放函数；另一个文件 import 它。__name__ == "__main__" 让测试代码只在直接运行时执行，__all__ 控制 * 导出。',
      code: String.raw`# my_module.py
def add(a, b):
    return a + b

if __name__ == "__main__":
    print(add(1, 2))      # 只有直接运行才执行

# main.py
import my_module
print(my_module.add(3, 4))`,
      tips: ['被导入时 __name__ 是模块名', '__all__ 只影响 from x import *']
    },
    {
      n: '自定义Python包',
      cases: [98],
      d: '包就是一个文件夹，里面放多个模块，并且必须有 __init__.py；导入时用「包名.模块名」。',
      code: String.raw`# 目录结构
# my_pkg/
#   __init__.py
#   tools.py

from my_pkg import tools
print(tools.hello())

import my_pkg.tools as t
print(t.hello())`,
      tips: ['__init__.py 可以是空文件，但不能没有', '包名同样别和标准库重名']
    },
    {
      n: '安装第三方包',
      d: '用 pip 安装，国内加镜像快很多；PyCharm 的设置里也能装。',
      code: String.raw`pip install pyecharts
pip install -i https://pypi.tuna.tsinghua.edu.cn/simple pyecharts
pip list`,
      tips: ['装完 import 一下验证', '网络慢就换镜像源']
    },
    {
      n: '异常-模块-包综合案例',
      d: '把字符串工具做成包，主程序导入并调用，外面套 try 捕获输入异常。',
      code: String.raw`from my_utils import str_util

try:
    text = input("输入字符串：")
    print(str_util.reverse(text))
except Exception as e:
    print("输入有误：", e)`,
      tips: ['工具函数和业务代码分开放', '异常提示要给用户看得懂的话']
    }
  ]
}
);
