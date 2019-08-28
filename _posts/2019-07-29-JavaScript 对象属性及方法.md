# JavaScript 字符串

> JavaScript 字符串用于存储和处理文本。 

## 字符串可以是对象

- 通常， JavaScript 字符串是原始值，可以使用字符创建： **var firstName = "John"**

- 也可以使用 new 关键字将字符串定义为一个对象： **var firstName = new String("John")**

  ```js
  var x = "John";              
  var y = new String("John");
  (x === y) // 结果为 false，因为 x 是字符串，y 是对象
  ```

## 字符串属性和方法

#### 字符串属性

|    属性     |            描述            |
| :---------: | :------------------------: |
| constructor |  返回创建字符串属性的函数  |
|   length    |      返回字符串的长度      |
|  prototype  | 允许您向对象添加属性和方法 |

## 字符串方法

更多方法实例可以参见：[JavaScript String 对象](https://www.runoob.com/jsref/jsref-obj-string.html)。

|        方法         |                             描述                             |
| :-----------------: | :----------------------------------------------------------: |
|      charAt()       |                    返回指定索引位置的字符                    |
|    charCodeAt()     |              返回指定索引位置字符的 Unicode 值               |
|      concat()       |           连接两个或多个字符串，返回连接后的字符串           |
|   fromCharCode()    |                   将 Unicode 转换为字符串                    |
|      indexOf()      |           返回字符串中检索指定字符第一次出现的位置           |
|    lastIndexOf()    |          返回字符串中检索指定字符最后一次出现的位置          |
|   localeCompare()   |               用本地特定的顺序来比较两个字符串               |
|       match()       |                找到一个或多个正则表达式的匹配                |
|      replace()      |                  替换与正则表达式匹配的子串                  |
|      search()       |                  检索与正则表达式相匹配的值                  |
|       slice()       |      提取字符串的片断，并在新的字符串中返回被提取的部分      |
|       split()       |                  把字符串分割为子字符串数组                  |
|      substr()       |            从起始索引号提取字符串中指定数目的字符            |
|     substring()     |            提取字符串中两个指定的索引号之间的字符            |
| toLocaleLowerCase() | 根据主机的语言环境把字符串转换为小写，只有几种语言（如土耳其语）具有地方特有的大小写映射 |
| toLocaleUpperCase() | 根据主机的语言环境把字符串转换为大写，只有几种语言（如土耳其语）具有地方特有的大小写映射 |
|    toLowerCase()    |                      把字符串转换为小写                      |
|     toString()      |                       返回字符串对象值                       |
|    toUpperCase()    |                      把字符串转换为大写                      |
|       trim()        |                      移除字符串首尾空白                      |
|      valueOf()      |                  返回某个字符串对象的原始值                  |

# JavaScript 正则表达式

## 正则表达式修饰符

#### **修饰符** 

可以在全局搜索中不区分大小写:

| 修饰符 |                           描述                           |
| :----: | :------------------------------------------------------: |
|   i    |                执行对大小写不敏感的匹配。                |
|   g    | 执行全局匹配（查找所有匹配而非在找到第一个匹配后停止）。 |
|   m    |                      执行多行匹配。                      |

#### 方括号

方括号用于查找某个范围内的字符：

|                            表达式                            | 描述                               |
| :----------------------------------------------------------: | :--------------------------------- |
| [[abc\]](https://www.runoob.com/jsref/jsref-regexp-charset.html) | 查找方括号之间的任何字符。         |
| [[^abc\]](https://www.runoob.com/jsref/jsref-regexp-charset-not.html) | 查找任何不在方括号之间的字符。     |
|                            [0-9]                             | 查找任何从 0 至 9 的数字。         |
|                            [a-z]                             | 查找任何从小写 a 到小写 z 的字符。 |
|                            [A-Z]                             | 查找任何从大写 A 到大写 Z 的字符。 |
|                            [A-z]                             | 查找任何从大写 A 到小写 z 的字符。 |
|                            [adgk]                            | 查找给定集合内的任何字符。         |
|                           [^adgk]                            | 查找给定集合外的任何字符。         |
|                      (red\|blue\|green)                      | 查找任何指定的选项。               |

#### 元字符

元字符（Metacharacter）是拥有特殊含义的字符：

|                            元字符                            |                    描述                     |
| :----------------------------------------------------------: | :-----------------------------------------: |
|   [.](https://www.runoob.com/jsref/jsref-regexp-dot.html)    |     查找单个字符，除了换行和行结束符。      |
| [\w](https://www.runoob.com/jsref/jsref-regexp-wordchar.html) |               查找单词字符。                |
| [\W](https://www.runoob.com/jsref/jsref-regexp-wordchar-non.html) |              查找非单词字符。               |
|  [\d](https://www.runoob.com/jsref/jsref-regexp-digit.html)  |                 查找数字。                  |
| [\D](https://www.runoob.com/jsref/jsref-regexp-digit-non.html) |              查找非数字字符。               |
| [\s](https://www.runoob.com/jsref/jsref-regexp-whitespace.html) |               查找空白字符。                |
| [\S](https://www.runoob.com/jsref/jsref-regexp-whitespace-non.html) |              查找非空白字符。               |
|  [\b](https://www.runoob.com/jsref/jsref-regexp-begin.html)  |               匹配单词边界。                |
| [\B](https://www.runoob.com/jsref/jsref-regexp-begin-not.html) |              匹配非单词边界。               |
|                              \0                              |              查找 NULL 字符。               |
| [\n](https://www.runoob.com/jsref/jsref-regexp-newline.html) |                查找换行符。                 |
|                              \f                              |                查找换页符。                 |
|                              \r                              |                查找回车符。                 |
|                              \t                              |                查找制表符。                 |
|                              \v                              |              查找垂直制表符。               |
| [\xxx](https://www.runoob.com/jsref/jsref-regexp-octal.html) |       查找以八进制数 xxx 规定的字符。       |
|  [\xdd](https://www.runoob.com/jsref/jsref-regexp-hex.html)  |      查找以十六进制数 dd 规定的字符。       |
| [\uxxxx](https://www.runoob.com/jsref/jsref-regexp-unicode-hex.html) | 查找以十六进制数 xxxx 规定的 Unicode 字符。 |

#### 量词

|                             量词                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
| [n+](https://www.runoob.com/jsref/jsref-regexp-onemore.html) | 匹配任何包含至少一个 n 的字符串。例如，/a+/ 匹配 "candy" 中的 "a"，"caaaaaaandy" 中所有的 "a"。 |
| [n*](https://www.runoob.com/jsref/jsref-regexp-zeromore.html) | 匹配任何包含零个或多个 n 的字符串。例如，/bo*/ 匹配 "A ghost booooed" 中的 "boooo"，"A bird warbled" 中的 "b"，但是不匹配 "A goat grunted"。 |
| [n?](https://www.runoob.com/jsref/jsref-regexp-zeroone.html) | 匹配任何包含零个或一个 n 的字符串。例如，/e?le?/ 匹配 "angel" 中的 "el"，"angle" 中的 "le"。 |
|  [n{X}](https://www.runoob.com/jsref/jsref-regexp-nx.html)   | 匹配包含 X 个 n 的序列的字符串。例如，/a{2}/ 不匹配 "candy," 中的 "a"，但是匹配 "caandy," 中的两个 "a"，且匹配 "caaandy." 中的前两个 "a"。 |
| [n{X,}](https://www.runoob.com/jsref/jsref-regexp-nxcomma.html) | X 是一个正整数。前面的模式 n 连续出现至少 X 次时匹配。例如，/a{2,}/ 不匹配 "candy" 中的 "a"，但是匹配 "caandy" 和 "caaaaaaandy." 中所有的 "a"。 |
| [n{X,Y}](https://www.runoob.com/jsref/jsref-regexp-nxy.html) | X 和 Y 为正整数。前面的模式 n 连续出现至少 X 次，至多 Y 次时匹配。例如，/a{1,3}/ 不匹配 "cndy"，匹配 "candy," 中的 "a"，"caandy," 中的两个 "a"，匹配 "caaaaaaandy" 中的前面三个 "a"。注意，当匹配 "caaaaaaandy" 时，即使原始字符串拥有更多的 "a"，匹配项也是 "aaa"。 |
| [n$](https://www.runoob.com/jsref/jsref-regexp-ndollar.html) |                 匹配任何结尾为 n 的字符串。                  |
| [^n](https://www.runoob.com/jsref/jsref-regexp-ncaret.html)  |                 匹配任何开头为 n 的字符串。                  |
| [?=n](https://www.runoob.com/jsref/jsref-regexp-nfollow.html) |           匹配任何其后紧接指定字符串 n 的字符串。            |
| [?!n](https://www.runoob.com/jsref/jsref-regexp-nfollow-not.html) |         匹配任何其后没有紧接指定字符串 n 的字符串。          |

#### RegExp 对象方法

|                             方法                             |                        描述                        |
| :----------------------------------------------------------: | :------------------------------------------------: |
| [exec](https://www.runoob.com/jsref/jsref-exec-regexp.html)  | 检索字符串中指定的值。返回找到的值，并确定其位置。 |
| [test](https://www.runoob.com/jsref/jsref-test-regexp.html)  |     检索字符串中指定的值。返回 true 或 false。     |
| [toString](https://www.runoob.com/jsref/jsref-regexp-tostring.html) |              返回正则表达式的字符串。              |

# JavaScript Number 对象

## Number 对象属性

|                             属性                             |                  描述                  |
| :----------------------------------------------------------: | :------------------------------------: |
| [constructor](https://www.runoob.com/jsref/jsref-constructor-number.html) | 返回对创建此对象的 Number 函数的引用。 |
| [MAX_VALUE](https://www.runoob.com/jsref/jsref-max-value.html) |           可表示的最大的数。           |
| [MIN_VALUE](https://www.runoob.com/jsref/jsref-min-value.html) |           可表示的最小的数。           |
| [NEGATIVE_INFINITY](https://www.runoob.com/jsref/jsref-negative-infinity.html) |       负无穷大，溢出时返回该值。       |
|  [NaN](https://www.runoob.com/jsref/jsref-number-nan.html)   |               非数字值。               |
| [POSITIVE_INFINITY](https://www.runoob.com/jsref/jsref-positive-infinity.html) |       正无穷大，溢出时返回该值。       |
| [prototype](https://www.runoob.com/jsref/jsref-prototype-num.html) |       允许向对象添加属性和方法。       |

## Number 对象方法

|                             方法                             |                         描述                         |
| :----------------------------------------------------------: | :--------------------------------------------------: |
| [isFinite](https://www.runoob.com/jsref/jsref-isfinite-number.html) |              检测指定参数是否为无穷大。              |
|                                                              |                                                      |
| [toExponential(x)](https://www.runoob.com/jsref/jsref-toexponential.html) |             把对象的值转换为指数计数法。             |
| [toFixed(x)](https://www.runoob.com/jsref/jsref-tofixed.html) | 把数字转换为字符串，结果的小数点后有指定位数的数字。 |
| [toPrecision(x)](https://www.runoob.com/jsref/jsref-toprecision.html) |              把数字格式化为指定的长度。              |
| [toString()](https://www.runoob.com/jsref/jsref-tostring-number.html) |         把数字转换为字符串，使用指定的基数。         |
| [valueOf()](https://www.runoob.com/jsref/jsref-valueof-number.html) |          返回一个 Number 对象的基本数字值。          |

# JavaScript Math 对象

> Math 对象用于执行数学任务。
>
> Math 对象并不像 Date 和 String 那样是对象的类，因此没有构造函数 Math()。

## Math 对象属性

|                            属性                            |                          描述                           |
| :--------------------------------------------------------: | :-----------------------------------------------------: |
|       [E](https://www.runoob.com/jsref/jsref-e.html)       |    返回算术常量 e，即自然对数的底数（约等于2.718）。    |
|     [LN2](https://www.runoob.com/jsref/jsref-ln2.html)     |           返回 2 的自然对数（约等于0.693）。            |
|    [LN10](https://www.runoob.com/jsref/jsref-ln10.html)    |           返回 10 的自然对数（约等于2.302）。           |
|   [LOG2E](https://www.runoob.com/jsref/jsref-log2e.html)   | 返回以 2 为底的 e 的对数（约等于 1.4426950408889634）。 |
|  [LOG10E](https://www.runoob.com/jsref/jsref-log10e.html)  |       返回以 10 为底的 e 的对数（约等于0.434）。        |
|      [PI](https://www.runoob.com/jsref/jsref-pi.html)      |              返回圆周率（约等于3.14159）。              |
| [SQRT1_2](https://www.runoob.com/jsref/jsref-sqrt1-2.html) |         返回 2 的平方根的倒数（约等于 0.707）。         |
|   [SQRT2](https://www.runoob.com/jsref/jsref-sqrt2.html)   |            返回 2 的平方根（约等于 1.414）。            |

## Math 对象方法

|                             方法                             |                             描述                             |
| :----------------------------------------------------------: | :----------------------------------------------------------: |
|    [abs(x)](https://www.runoob.com/jsref/jsref-abs.html)     |                      返回 x 的绝对值。                       |
|   [acos(x)](https://www.runoob.com/jsref/jsref-acos.html)    |                     返回 x 的反余弦值。                      |
|   [asin(x)](https://www.runoob.com/jsref/jsref-asin.html)    |                     返回 x 的反正弦值。                      |
|   [atan(x)](https://www.runoob.com/jsref/jsref-atan.html)    |   以介于 -PI/2 与 PI/2 弧度之间的数值来返回 x 的反正切值。   |
| [atan2(y,x)](https://www.runoob.com/jsref/jsref-atan2.html)  | 返回从 x 轴到点 (x,y) 的角度（介于 -PI/2 与 PI/2 弧度之间）。 |
|   [ceil(x)](https://www.runoob.com/jsref/jsref-ceil.html)    |                       对数进行上舍入。                       |
|    [cos(x)](https://www.runoob.com/jsref/jsref-cos.html)     |                        返回数的余弦。                        |
|    [exp(x)](https://www.runoob.com/jsref/jsref-exp.html)     |                       返回 Ex 的指数。                       |
|  [floor(x)](https://www.runoob.com/jsref/jsref-floor.html)   |                      对 x 进行下舍入。                       |
|    [log(x)](https://www.runoob.com/jsref/jsref-log.html)     |                 返回数的自然对数（底为e）。                  |
| [max(x,y,z,...,n)](https://www.runoob.com/jsref/jsref-max.html) |                返回 x,y,z,...,n 中的最高值。                 |
| [min(x,y,z,...,n)](https://www.runoob.com/jsref/jsref-min.html) |                 返回 x,y,z,...,n中的最低值。                 |
|   [pow(x,y)](https://www.runoob.com/jsref/jsref-pow.html)    |                      返回 x 的 y 次幂。                      |
|  [random()](https://www.runoob.com/jsref/jsref-random.html)  |                  返回 0 ~ 1 之间的随机数。                   |
|  [round(x)](https://www.runoob.com/jsref/jsref-round.html)   |                          四舍五入。                          |
|    [sin(x)](https://www.runoob.com/jsref/jsref-sin.html)     |                        返回数的正弦。                        |
|   [sqrt(x)](https://www.runoob.com/jsref/jsref-sqrt.html)    |                       返回数的平方根。                       |
|    [tan(x)](https://www.runoob.com/jsref/jsref-tan.html)     |                        返回角的正切。                        |

# JavaScript Array 对象

## 数组属性

|                             属性                             |               描述               |
| :----------------------------------------------------------: | :------------------------------: |
| [constructor](https://www.runoob.com/jsref/jsref-constructor-array.html) |   返回创建数组对象的原型函数。   |
| [length](https://www.runoob.com/jsref/jsref-length-array.html) |    设置或返回数组元素的个数。    |
| [prototype](https://www.runoob.com/jsref/jsref-prototype-array.html) | 允许你向数组对象添加属性或方法。 |

## Array 对象方法

|                             方法                             |                         描述                         |
| :----------------------------------------------------------: | :--------------------------------------------------: |
| [concat()](https://www.runoob.com/jsref/jsref-concat-array.html) |          连接两个或更多的数组，并返回结果。          |
| [copyWithin()](https://www.runoob.com/jsref/jsref-copywithin.html) |  从数组的指定位置拷贝元素到数组的另一个指定位置中。  |
| [entries()](https://www.runoob.com/jsref/jsref-entries.html) |                返回数组的可迭代对象。                |
|   [every()](https://www.runoob.com/jsref/jsref-every.html)   |        检测数值元素的每个元素是否都符合条件。        |
|    [fill()](https://www.runoob.com/jsref/jsref-fill.html)    |              使用一个固定值来填充数组。              |
|  [filter()](https://www.runoob.com/jsref/jsref-filter.html)  |     检测数值元素，并返回符合条件所有元素的数组。     |
|    [find()](https://www.runoob.com/jsref/jsref-find.html)    |       返回符合传入测试（函数）条件的数组元素。       |
|                                                              |                                                      |
| [findIndex()](https://www.runoob.com/jsref/jsref-findindex.html) |     返回符合传入测试（函数）条件的数组元素索引。     |
|                                                              |                                                      |
| [forEach()](https://www.runoob.com/jsref/jsref-foreach.html) |           数组每个元素都执行一次回调函数。           |
|    [from()](https://www.runoob.com/jsref/jsref-from.html)    |            通过给定的对象中创建一个数组。            |
|                                                              |                                                      |
| [includes()](https://www.runoob.com/jsref/jsref-includes.html) |          判断一个数组是否包含一个指定的值。          |
| [indexOf()](https://www.runoob.com/jsref/jsref-indexof-array.html) |        搜索数组中的元素，并返回它所在的位置。        |
| [isArray()](https://www.runoob.com/jsref/jsref-isarray.html) |                 判断对象是否为数组。                 |
|    [join()](https://www.runoob.com/jsref/jsref-join.html)    |           把数组的所有元素放入一个字符串。           |
|    [keys()](https://www.runoob.com/jsref/jsref-keys.html)    |    返回数组的可迭代对象，包含原始数组的键(key)。     |
| [lastIndexOf()](https://www.runoob.com/jsref/jsref-lastindexof-array.html) |      搜索数组中的元素，并返回它最后出现的位置。      |
|     [map()](https://www.runoob.com/jsref/jsref-map.html)     | 通过指定函数处理数组的每个元素，并返回处理后的数组。 |
|     [pop()](https://www.runoob.com/jsref/jsref-pop.html)     |       删除数组的最后一个元素并返回删除的元素。       |
|    [push()](https://www.runoob.com/jsref/jsref-push.html)    |   向数组的末尾添加一个或更多元素，并返回新的长度。   |
|                                                              |                                                      |
|  [reduce()](https://www.runoob.com/jsref/jsref-reduce.html)  |         将数组元素计算为一个值（从左到右）。         |
|                                                              |                                                      |
| [reduceRight()](https://www.runoob.com/jsref/jsref-reduceright.html) |         将数组元素计算为一个值（从右到左）。         |
| [reverse()](https://www.runoob.com/jsref/jsref-reverse.html) |                 反转数组的元素顺序。                 |
|   [shift()](https://www.runoob.com/jsref/jsref-shift.html)   |             删除并返回数组的第一个元素。             |
| [slice()](https://www.runoob.com/jsref/jsref-slice-array.html) |        选取数组的的一部分，并返回一个新数组。        |
|    [some()](https://www.runoob.com/jsref/jsref-some.html)    |        检测数组元素中是否有元素符合指定条件。        |
|    [sort()](https://www.runoob.com/jsref/jsref-sort.html)    |                对数组的元素进行排序。                |
|  [splice()](https://www.runoob.com/jsref/jsref-splice.html)  |               从数组中添加或删除元素。               |
| [toString()](https://www.runoob.com/jsref/jsref-tostring-array.html) |           把数组转换为字符串，并返回结果。           |
| [unshift()](https://www.runoob.com/jsref/jsref-unshift.html) |   向数组的开头添加一个或更多元素，并返回新的长度。   |
| [valueOf()](https://www.runoob.com/jsref/jsref-valueof-array.html) |                返回数组对象的原始值。                |

# JavaScript Date 对象

## 创建 Date 对象：

```js
var d = new Date();
var d = new Date(milliseconds);
var d = new Date(dateString);
var d = new Date(year, month, day, hours, minutes, seconds, milliseconds);
```

## Date 对象属性

|                             属性                             |                 描述                 |
| :----------------------------------------------------------: | :----------------------------------: |
| [constructor](https://www.runoob.com/jsref/jsref-constructor-date.html) | 返回对创建此对象的 Date 函数的引用。 |
| [prototype](https://www.runoob.com/jsref/jsref-prototype-date.html) |   使您有能力向对象添加属性和方法。   |

## Date 对象方法

| 方法                                                         | 描述                                                         |
| :----------------------------------------------------------- | :----------------------------------------------------------- |
| [getDate()](https://www.runoob.com/jsref/jsref-getdate.html) | 从 Date 对象返回一个月中的某一天 (1 ~ 31)。                  |
| [getDay()](https://www.runoob.com/jsref/jsref-getday.html)   | 从 Date 对象返回一周中的某一天 (0 ~ 6)。                     |
| [getFullYear()](https://www.runoob.com/jsref/jsref-getfullyear.html) | 从 Date 对象以四位数字返回年份。                             |
| [getHours()](https://www.runoob.com/jsref/jsref-gethours.html) | 返回 Date 对象的小时 (0 ~ 23)。                              |
| [getMilliseconds()](https://www.runoob.com/jsref/jsref-getmilliseconds.html) | 返回 Date 对象的毫秒(0 ~ 999)。                              |
| [getMinutes()](https://www.runoob.com/jsref/jsref-getminutes.html) | 返回 Date 对象的分钟 (0 ~ 59)。                              |
| [getMonth()](https://www.runoob.com/jsref/jsref-getmonth.html) | 从 Date 对象返回月份 (0 ~ 11)。                              |
| [getSeconds()](https://www.runoob.com/jsref/jsref-getseconds.html) | 返回 Date 对象的秒数 (0 ~ 59)。                              |
| [getTime()](https://www.runoob.com/jsref/jsref-gettime.html) | 返回 1970 年 1 月 1 日至今的毫秒数。                         |
| [getTimezoneOffset()](https://www.runoob.com/jsref/jsref-gettimezoneoffset.html) | 返回本地时间与格林威治标准时间 (GMT) 的分钟差。              |
| [getUTCDate()](https://www.runoob.com/jsref/jsref-getutcdate.html) | 根据世界时从 Date 对象返回月中的一天 (1 ~ 31)。              |
| [getUTCDay()](https://www.runoob.com/jsref/jsref-getutcday.html) | 根据世界时从 Date 对象返回周中的一天 (0 ~ 6)。               |
| [getUTCFullYear()](https://www.runoob.com/jsref/jsref-getutcfullyear.html) | 根据世界时从 Date 对象返回四位数的年份。                     |
| [getUTCHours()](https://www.runoob.com/jsref/jsref-getutchours.html) | 根据世界时返回 Date 对象的小时 (0 ~ 23)。                    |
| [getUTCMilliseconds()](https://www.runoob.com/jsref/jsref-getutcmilliseconds.html) | 根据世界时返回 Date 对象的毫秒(0 ~ 999)。                    |
| [getUTCMinutes()](https://www.runoob.com/jsref/jsref-getutcminutes.html) | 根据世界时返回 Date 对象的分钟 (0 ~ 59)。                    |
| [getUTCMonth()](https://www.runoob.com/jsref/jsref-getutcmonth.html) | 根据世界时从 Date 对象返回月份 (0 ~ 11)。                    |
| [getUTCSeconds()](https://www.runoob.com/jsref/jsref-getutcseconds.html) | 根据世界时返回 Date 对象的秒钟 (0 ~ 59)。                    |
| getYear()                                                    | 已废弃。 请使用 getFullYear() 方法代替。                     |
| [parse()](https://www.runoob.com/jsref/jsref-parse.html)     | 返回1970年1月1日午夜到指定日期（字符串）的毫秒数。           |
| [setDate()](https://www.runoob.com/jsref/jsref-setdate.html) | 设置 Date 对象中月的某一天 (1 ~ 31)。                        |
| [setFullYear()](https://www.runoob.com/jsref/jsref-setfullyear.html) | 设置 Date 对象中的年份（四位数字）。                         |
| [setHours()](https://www.runoob.com/jsref/jsref-sethours.html) | 设置 Date 对象中的小时 (0 ~ 23)。                            |
| [setMilliseconds()](https://www.runoob.com/jsref/jsref-setmilliseconds.html) | 设置 Date 对象中的毫秒 (0 ~ 999)。                           |
| [setMinutes()](https://www.runoob.com/jsref/jsref-setminutes.html) | 设置 Date 对象中的分钟 (0 ~ 59)。                            |
| [setMonth()](https://www.runoob.com/jsref/jsref-setmonth.html) | 设置 Date 对象中月份 (0 ~ 11)。                              |
| [setSeconds()](https://www.runoob.com/jsref/jsref-setseconds.html) | 设置 Date 对象中的秒钟 (0 ~ 59)。                            |
| [setTime()](https://www.runoob.com/jsref/jsref-settime.html) | setTime() 方法以毫秒设置 Date 对象。                         |
| [setUTCDate()](https://www.runoob.com/jsref/jsref-setutcdate.html) | 根据世界时设置 Date 对象中月份的一天 (1 ~ 31)。              |
| [setUTCFullYear()](https://www.runoob.com/jsref/jsref-setutcfullyear.html) | 根据世界时设置 Date 对象中的年份（四位数字）。               |
| [setUTCHours()](https://www.runoob.com/jsref/jsref-setutchours.html) | 根据世界时设置 Date 对象中的小时 (0 ~ 23)。                  |
| [setUTCMilliseconds()](https://www.runoob.com/jsref/jsref-setutcmilliseconds.html) | 根据世界时设置 Date 对象中的毫秒 (0 ~ 999)。                 |
| [setUTCMinutes()](https://www.runoob.com/jsref/jsref-setutcminutes.html) | 根据世界时设置 Date 对象中的分钟 (0 ~ 59)。                  |
| [setUTCMonth()](https://www.runoob.com/jsref/jsref-setutcmonth.html) | 根据世界时设置 Date 对象中的月份 (0 ~ 11)。                  |
| [setUTCSeconds()](https://www.runoob.com/jsref/jsref-setutcseconds.html) | setUTCSeconds() 方法用于根据世界时 (UTC) 设置指定时间的秒字段。 |
| setYear()                                                    | 已废弃。请使用 setFullYear() 方法代替。                      |
| [toDateString()](https://www.runoob.com/jsref/jsref-todatestring.html) | 把 Date 对象的日期部分转换为字符串。                         |
| toGMTString()                                                | 已废弃。请使用 toUTCString() 方法代替。                      |
| [toISOString()](https://www.runoob.com/jsref/jsref-toisostring.html) | 使用 ISO 标准返回字符串的日期格式。                          |
| [toJSON()](https://www.runoob.com/jsref/jsref-tojson.html)   | 以 JSON 数据格式返回日期字符串。                             |
| [toLocaleDateString()](https://www.runoob.com/jsref/jsref-tolocaledatestring.html) | 根据本地时间格式，把 Date 对象的日期部分转换为字符串。       |
| [toLocaleTimeString()](https://www.runoob.com/jsref/jsref-tolocaletimestring.html) | 根据本地时间格式，把 Date 对象的时间部分转换为字符串。       |
| [toLocaleString()](https://www.runoob.com/jsref/jsref-tolocalestring.html) | 据本地时间格式，把 Date 对象转换为字符串。                   |
| [toString()](https://www.runoob.com/jsref/jsref-tostring-date.html) | 把 Date 对象转换为字符串。                                   |
| [toTimeString()](https://www.runoob.com/jsref/jsref-totimestring.html) | 把 Date 对象的时间部分转换为字符串。                         |
| [toUTCString()](https://www.runoob.com/jsref/jsref-toutcstring.html) | 根据世界时，把 Date 对象转换为字符串。                       |
| [UTC()](https://www.runoob.com/jsref/jsref-utc.html)         | 根据世界时返回 1970 年 1 月 1 日 到指定日期的毫秒数。        |
| [valueOf()](https://www.runoob.com/jsref/jsref-valueof-date.html) | 返回 Date 对象的原始值。                                     |