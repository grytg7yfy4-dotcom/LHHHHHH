/* 第 4-6 章：循环 / 函数 / 数据容器 */
(window.PY_CHAPTERS = window.PY_CHAPTERS || []).push(
{
  n: '4. python循环语句',
  eps: 'P38–P50',
  p: 38, p2: 50,
  intro: 'while、for 和循环控制，让程序重复干活。',
  sec: [
    {
      n: 'while循环的基础语法',
      cases: [39, 40],
      d: '条件为 True 就反复执行；循环体里一定要有让条件趋向 False 的语句，否则死循环。',
      code: String.raw`i = 1
while i <= 5:
    print(i)
    i += 1`,
      tips: ['忘了 i += 1 就是死循环，Ctrl+C 可以中断', '条件既可以是比较运算，也可以是布尔变量']
    },
    {
      n: 'while循环的嵌套使用',
      cases: [42],
      d: '外层执行一次，内层要完整跑一轮；内层循环的初始化必须写在外层循环体里面。',
      code: String.raw`i = 1
while i <= 3:
    j = 1
    while j <= 3:
        print(i, j)
        j += 1
    i += 1`,
      tips: ['内层变量 j 每次都要重新初始化', '九九乘法表就是典型的两层循环']
    },
    {
      n: 'for循环的基础语法',
      cases: [44],
      d: '遍历一个序列（字符串、列表、range），把每个元素依次取出来处理。for 不能自定义条件，也不能无限循环。',
      code: String.raw`for ch in "abc":
    print(ch)

for i in range(3):      # 0 1 2
    print(i)`,
      tips: ['range(n) 是 0 到 n-1', 'range(1, 5) 是 1 到 4，左闭右开']
    },
    {
      n: 'for循环的嵌套使用',
      cases: [48],
      d: '外层取一个值，内层完整跑一遍，适合处理「行 × 列」的问题。',
      code: String.raw`for i in range(1, 4):
    for j in range(1, 4):
        print(i, j)`,
      tips: ['总执行次数 = 外层次数 × 内层次数', 'print 里加 end="" 可以不换行']
    },
    {
      n: '循环中断',
      cases: [50],
      d: 'break 立刻结束整个循环；continue 跳过本次剩余代码，直接进入下一次。',
      code: String.raw`for i in range(1, 6):
    if i == 3:
        break
    print(i)          # 1 2

for i in range(1, 4):
    if i == 2:
        continue
    print(i)          # 1 3`,
      tips: ['break 只跳出当前这一层循环', 'continue 后面的代码这次不执行']
    }
  ]
},
{
  n: '5. python函数',
  eps: 'P51–P61',
  p: 51, p2: 61,
  intro: '把代码打包复用：定义、参数、返回值、作用域。',
  sec: [
    {
      n: '函数的介绍',
      d: '函数是把一段可复用的代码打包起来、起个名字，用的时候调用名字就行。好处是少写重复代码、逻辑清晰、好维护。',
      tips: ['一个函数只做一件事', '函数名用动词，比如 get_sum、print_menu']
    },
    {
      n: '定义函数',
      cases: [53],
      d: 'def 函数名(参数): 下面是缩进的函数体。定义时不会执行，调用时才执行。',
      code: String.raw`def say_hi():
    print("hi")

say_hi()`,
      tips: ['先定义后调用', '函数名后面的括号不能省']
    },
    {
      n: '函数的参数',
      cases: [55],
      d: '调用时把数据传进去，函数内部用形参接收。多个参数用逗号隔开，按顺序对应。',
      code: String.raw`def add(a, b):
    print(a + b)

add(3, 5)      # 8`,
      tips: ['形参和实参个数要一致（除非有默认值）', '参数名要有意义，别写 a1、a2']
    },
    {
      n: '函数的返回值',
      d: 'return 把结果交回给调用者，函数执行到 return 就结束；没写 return 时返回 None。',
      code: String.raw`def add(a, b):
    return a + b

result = add(2, 3)
print(result * 2)     # 10`,
      tips: ['return 后面的代码不会执行', '没有返回值时结果就是 None']
    },
    {
      n: '函数说明文档',
      d: '在函数体第一行写三引号字符串，说明作用、参数、返回值；鼠标悬停或 help() 就能看到。',
      code: String.raw`def add(a, b):
    """
    求两个数的和
    :param a: 第一个数
    :param b: 第二个数
    :return: 两个数的和
    """
    return a + b`,
      tips: ['文档写在 def 下面第一行', '养成写参数和返回值的习惯']
    },
    {
      n: '函数的嵌套调用',
      d: '函数 A 里调用函数 B：A 暂停，等 B 执行完拿到结果再继续。',
      code: String.raw`def b():
    print("执行 b")

def a():
    b()
    print("执行 a")

a()`,
      tips: ['调用链越深越难调试', '返回值可以一层层往上传递']
    },
    {
      n: '变量作用域',
      cases: [61],
      d: '函数内部定义的变量是局部变量，外面用不了；外面的全局变量函数里能读；要在函数里改全局变量得用 global。',
      code: String.raw`num = 10

def f():
    num = 20        # 局部变量，不影响外面

def g():
    global num
    num = 30

f(); print(num)     # 10
g(); print(num)     # 30`,
      tips: ['尽量少用 global', '局部变量出了函数就销毁']
    }
  ]
},
{
  n: '6. python数据容器',
  eps: 'P62–P80',
  p: 62, p2: 80,
  intro: 'list、tuple、str、set、dict 五大容器，是后面所有代码的基础。',
  sec: [
    {
      n: '入门 介绍',
      d: '数据容器就是能一次装多个数据的东西。Python 有 5 类：list 列表、tuple 元组、str 字符串、set 集合、dict 字典。',
      tips: ['选容器看三点：要不要改、要不要去重、要不要有序', '容器里可以再套容器']
    },
    {
      n: '数据容器：list（列表）',
      d: '用 [] 定义，有序、可重复、可修改，元素类型可以不同，还能嵌套。',
      code: String.raw`names = ["张三", "李四", 18, [1, 2]]
print(names)`,
      tips: ['列表用中括号', '元素之间用逗号隔开']
    },
    {
      n: '列表的下标（索引）',
      d: '从左往右从 0 开始；从右往左从 -1 开始；嵌套列表要取两次下标。',
      code: String.raw`lst = ["a", "b", "c"]
print(lst[0])       # a
print(lst[-1])      # c
print([[1, 2], [3, 4]][1][0])   # 3`,
      tips: ['下标越界会 IndexError', '-1 是最后一个元素']
    },
    {
      n: '列表的常用操作（方法）',
      cases: [66],
      d: '查：index、count、len；增：append、insert、extend；删：del、pop、remove、clear；改：直接赋值；排：sort、reverse。',
      code: String.raw`lst = [3, 1, 2]
lst.append(4)          # [3, 1, 2, 4]
lst.insert(0, 9)       # [9, 3, 1, 2, 4]
lst.sort()             # [1, 2, 3, 4, 9]
lst.reverse()          # [9, 4, 3, 2, 1]
print(lst.index(3), lst.count(3), len(lst))
print(lst.pop())       # 9`,
      tips: ['append 加一个，extend 加一批', 'remove 按值删，pop 按下标删']
    },
    {
      n: '列表的特点',
      d: '有序（有下标）、可修改、可重复、能存任意类型 —— 最常用的容器。',
      tips: ['增删改查多就用列表', '元素特别多、频繁在头部插入时性能一般']
    },
    {
      n: 'list（列表）的遍历',
      d: 'while 靠下标遍历，for 直接取元素；只读元素时用 for 更省事。',
      code: String.raw`lst = ["a", "b", "c"]
i = 0
while i < len(lst):
    print(lst[i])
    i += 1

for x in lst:
    print(x)`,
      tips: ['for 遍历时别一边遍历一边删元素', '需要下标就用 enumerate']
    },
    {
      n: '数据容器：tuple（元组）',
      d: '用小括号定义，一旦创建不能修改；单元素元组必须加逗号；元组里的列表可以改。',
      code: String.raw`t = (1, 2, 3)
print(t[0])
# t[0] = 9        # 报错

one = (1,)        # 单元素要带逗号
print(type(one))  # tuple`,
      tips: ['元组不可变，但里面的列表可变', '适合存放不该被改的数据，比如坐标']
    },
    {
      n: '数据容器：str（字符串）',
      cases: [70],
      d: '字符串不可变，支持下标；常用方法 replace、split、strip、find、count、upper/lower。',
      code: String.raw`s = "  hello world  "
print(s.strip())                      # hello world
print(s.replace("world", "python"))
print(s.split(" "))
print("abc".find("c"))                # 2`,
      tips: ['这些方法返回新字符串，原串不变', 'split 的结果是列表']
    },
    {
      n: '数据容器的切片',
      cases: [72],
      d: '序列[开始:结束:步长]，左闭右开；步长为负表示从后往前取。',
      code: String.raw`s = "0123456789"
print(s[2:5])     # 234
print(s[:3])      # 012
print(s[::2])     # 02468
print(s[::-1])    # 9876543210`,
      tips: ['开始和结束都可以省略', '步长 -1 就是反转']
    },
    {
      n: '数据容器：set（集合）',
      cases: [74],
      d: '用 {} 或 set() 定义，无序、自动去重、不支持下标；适合做去重和集合运算。',
      code: String.raw`s = {1, 2, 2, 3}
print(s)            # {1, 2, 3}
s.add(4)
s.remove(1)
print(s & {2, 3})   # 交集
print(s | {9})      # 并集
print(s - {2})      # 差集`,
      tips: ['空集合只能写 set()，{} 是空字典', '集合元素必须可哈希（不能是列表）']
    },
    {
      n: '数据容器：dict（字典、映射）',
      cases: [77],
      d: '键值对集合，key 唯一且不可变，用 key 取 value；适合存「有名字」的数据。',
      code: String.raw`stu = {"name": "张三", "age": 18}
print(stu["name"])
stu["age"] = 19
stu["city"] = "北京"
stu.pop("city")
for k, v in stu.items():
    print(k, v)`,
      tips: ['取不存在的 key 会 KeyError，用 get 更安全', '3.7+ 字典保持插入顺序']
    },
    {
      n: '总结分类',
      d: '按「是否有序、是否可改、是否去重、能否下标」四个维度对比 5 类容器，选型就不纠结了。',
      tips: ['列表：有序、可改、可重复', '元组：有序、不可改', '字符串：有序、不可改', '集合：无序、去重', '字典：键值对，key 去重']
    },
    {
      n: '数据容器的通用操作',
      d: 'len、max、min、sorted、reversed 对多数容器都适用；list()、tuple()、set()、str() 可以互相转换。',
      code: String.raw`data = [3, 1, 2]
print(len(data), max(data), min(data))
print(sorted(data))         # [1, 2, 3]
print(list("abc"))          # ['a', 'b', 'c']
print(set([1, 1, 2]))       # {1, 2}`,
      tips: ['sorted 返回新列表，sort 是原地排序', 'dict 转 list 得到的是 key 列表']
    },
    {
      n: '字符串大小比较',
      d: '按字符编码逐位比较：先比第一个字符，相同再比下一个；短字符串是长字符串前缀时，短的更小。',
      code: String.raw`print("a" < "b")        # True
print("abc" < "abd")    # True
print("ab" < "abc")     # True`,
      tips: ['数字字符串也是按字符比，"10" < "9"', '比较前先统一大小写']
    }
  ]
}
);
