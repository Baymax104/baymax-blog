---
title: JavaScript基础
categories: [前端]
tags: [JavaScript, 前端]
date: 2024-04-13 19:19
updated: 2025-07-07 01:21
banner: /images/javascript.jpg
---
## 开始

各个厂商对 JavaScript 都有自己的实现，都遵循 ES 标准

JavaScript 的实现包含三个部分

- ES 标准
- DOM：文档对象模型
- BOM：浏览器对象模型

编写位置

- HTML 文档的 script 标签
- 标签属性
- 通过 scrtip 标签的 src 属性引入.js 文件，引入后标签内的代码无效

注释

```javascript
// 单行注释
/* 多行注释 */
```

使用严格模式：`"use strict";`

属性访问空安全：`obj?.name`

`globalThis`：对全局对象的抽象，始终指向全局对象

## 变量

变量声明

```js
var variable;
let variable;
```

常量声明

```js
const variable;
```

**获取变量类型：`typeof variable`**

数据类型

- String：双引号，单引号都可以

- Number

    Number.MAX_VALUE 获取 JS 表示的最大值，超过最大值表示为字面量 Infinity，类型 Number

    不可计算的结果表示为字面量 NaN，类型 Number

    十六进制以 0x 开头，八进制以 0 开头，二进制表示 0b 开头

    大整数：数字后跟字符 n，通过 `BigInt()` 转换

- Boolean

- Null

    null 值用于表示为空的 Object，null 值的类型是 Object

- Undefined

    undefined 值表示未定义的值，类型为 undefined

- Object：Object 属于引用类型，其他都属于基本类型

类型强转

- String()

- Number()：非法数字转换为 NaN

    字符串解析为数字

    - parseInt()，可以指定进制
    - parseFloat()

- Boolean()

    - 0 和 NaN 为 false，其余都为 true
    - 空字符串为 false，其余都为 true
    - null 和 undefined 为 false
    - Object 都为 true

### Symbol

Symbol 数据类型表示一个唯一不重复的值，不能进行运算

Symbol 创建

```js
let s = Symbol();
let s1 = Symbol("Hello");
let s2 = Symbol.for("Hello");
```

### var 与 let、const 的区别

- 变量的作用域不同

    - var 声明的变量只有全局作用域和函数作用域
    - let 声明的变量具有块作用域，全局作用域和函数作用域
    - const 声明的变量和 let 作用域相同

- const

    const 声明的是常量，必须在声明时进行初始化，此后变量的值不变

    当 const 声明的是对象时，对象为引用类型，变量获取的实际是对象的常量指针，因此变量只能指向该对象，该对象的属性可变

### 解构赋值

- 数组解构赋值

    ```js
    const arr = [1, 2, 3, 4];
    let [i1, i2, i3, i4] = arr;
    ```

- 对象解构赋值

    ```js
    const obj = {
    	name: 'Hello',
        age: 20
    };
    let {name, age} = obj;
    
    // 函数参数解构
    function method({name, age}) {
        // ...
    }
    let obj = {
        name: "Hello",
        age: 20
    }
    method(obj);
    ```

## 函数

函数声明

```javascript
function func(parms) {
    return returnvalue;
}
```

函数可作为函数对象使用，适用于闭包

```javascript
// 构造器生成函数对象
let fun = new Function("console.log('hello');");
fun()

// 函数声明的函数对象
function func() {
    // ...
}
let fun = func;
fun();

// 匿名函数对象
let fun = function () {
    // ...
}
fun();

// 直接调用匿名函数对象
(function func(x) {
    // ...
})(x);

// 函数默认值
function method(a, b, c = 10) {
    // ...
}

// 解构默认值
function method({name, age = 20}) {
    // ...
}
```

函数对象方法：通过函数对象调用，都可以修改函数对象的 this 指向

- call(obj, parms...)：传入对象 obj，执行该函数同时将该函数的 this 指向 obj，parms 为函数参数
- apply(obj, parmsArray)：将函数的 this 指向传入的 obj，函数参数以数组形式传入
- bind(thisArg)：复制一个函数，并设置新函数的 this，设置后不可更改，若第二个参数之后传入参数，则将原函数对应位置参数设为固定值

### this、arguments

JavaScript 的 this 以函数为导向，每个函数**调用时**包含两个隐含参数 this 和 arguments，与原型对象不同，原型对象 prototype 在函数创建时生成，this 和 arguments 在函数调用时传入

this 的值为函数调用的上下文对象 (object context)，可理解为指向调用函数的对象

- 对象调用时，this 指向该对象

- 全局函数调用时，this 指向 window 对象

- 函数中调用函数时，this 指向 window 对象

    在全局作用域中声明的变量和函数，本质是声明 Window 对象的动态属性

    对于变量，使用 var 声明会声明到 Window 对象中，使用 let 声明不会声明到 Window 对象中

arguments 是封装函数参数的对象，是一个伪数组，可以通过下标访问

### rest 参数

rest 参数用于代替 arguments，在参数列表中将多余参数包装成伪数组在函数中使用，rest 参数必须在参数列表末尾

```js
function method(...args) {
    // ...
}
```

扩展运算符 `...`：将数组转换为一个参数序列（在 ES8 中支持对象的扩展运算符）

``` js
let arr = [1, 2, 3, 4];
// ...arr => 1, 2, 3, 4
```

扩展运算符的应用

- 数组合并

    ```js
    let a = [1, 2];
    let b = [3, 4];
    let c = [...a, ...b];  // c = [1, 2, 3, 4]
    ```

- 数组复制：浅拷贝

    ```js
    let a = [1, 2, 3, 4];
    let b = [...a];
    ```

- 将伪数组转换为真数组

    ```js
    const divs = document.querySelectorAll("div");
    const divArr = [...divs];
    ```

### 箭头函数

类似于 lambda 表达式

```javascript
let hello = function (a, b) {
    return a + b;
}
let hello = (a, b) => {
    return a + b;
}
let hello = (a, b) => a + b; // 单行返回
```

箭头函数 this 的指向：function 函数有自己的 this 值，指向调用该函数的对象 (object context)，箭头函数没有自己的 this 值，其 this 值通过继承函数作用域链上最近的函数获取

箭头函数不能使用 call、apply、bind 函数改变 this 指向

```javascript
let circle = {
    radius: 10,
    outer:function () {
        let inter = function () {
            console.log(this == window);
            console.log(this.value);
        };
        inter();
        console.log(this == circle)
    }
}
circle.outer() // true undefined true
// inter由函数调用，它的this指向浏览器对象window，window里没有radius属性，返回undefined
let circle = {
    radius: 10,
    outer:function () {
        let inter = () => {
            console.log(this == window);
            console.log(this.value);
        };
        inter();
        console.log(this == circle)
    }
}
circle.outer() // false 10 true
// inter是箭头函数，根据函数作用域链向上寻找并继承其他函数的this值，inter继承outer的this值，指向circle
```

## 数组

JavaScript 数组可以动态扩容，且可以同时存放任意类型，length 属性返回数组长度

```javascript
// new创建
let arr = new Array();
arr[0] = 1;
// 字面量创建
let arr = [1, 2, 3];
let [a, b, c] = arr  // 解构赋值
let [d, e, f, g = 10] = arr  // 解构默认值
let [h, ...i] = arr // 解构剩余值数组，可将可迭代对象转换为数组
```

数组遍历

- for 三段式
- for-in：获取可迭代对象的键，可遍历数组和对象属性，最好用于遍历对象属性
- for-of：获取可迭代对象的值，可遍历数组和对象属性，最好用于遍历数组

数组方法

- push()：在尾部添加任意个数元素，返回新的长度
- pop()：删除最后一个元素，返回该元素
- unshift()：在开头添加任意个数元素，返回新的长度
- shift()：删除第一个元素，返回该元素
- forEach()：传入一个函数对象，对数组元素执行该函数，函数对象中的参数分别为数组元素，下标，整个数组
- slice(start, end)：[start, end)，数组切片并返回，支持负数倒数索引
- splice(start, n, obj...)：删除指定索引开头的 n 个元素并已数组形式返回，在 start 处插入多个 obj
- concat()：连接多个数组并返回新数组
- join()：将数组以字符串返回，可以传入字符串指定分隔符
- reverse()：反转数组
- sort()：排序，默认按照字典序排序，传入一个函数对象指定 Comparator

## 对象

对象的分类

- ES 标准对象：String、Object 等
- 浏览器对象：console、document 等
- 自定义对象

### 对象创建

判断对象中是否存在某个属性:`attr in obj`，attr 类型为 String，以属性名匹配变量

```javascript
let person = {
    name: "nnn",
    age: 20
}
console.log("name" in person)  // true
let {name, age} = person  // 对象解构赋值，名称必须与属性名相同
let {name:n1, age:n2} = person // 解构赋值别名
let {name:n1, age:n2 = 30} = person  // 解构赋值默认值
```

声明一个 Object 类型对象

```javascript
let obj = new Object();
// 字面量创建
let obj = {
    name:"obj",
    age:18
};
```

可以在声明对象后，在外部动态赋值属性

```javascript
let obj = {}; // Object类型
obj.name = "obj";
// 字典型赋值
// 若key不符合命名规范，则自动转换为String类型
obj[18] = 999; // {'18': 999}
// 若key符合命名规范，则声明该变量
obj["n1"] = 1000; // {n1: 1000}
```

使用计算属性（动态属性名）

```js
let a = "Hello";
let method = "myMethod";
let obj = {
    // 中括号中可以使用复杂表达式
    [a]: 20,
    [method]() {
        // ...
    }
}
// obj[a]或obj['Hello']
```

可以声明其他类型的对象，动态赋值属性

```javascript
let obj = new String();
obj.age = 100;
console.log(obj); // [String: ''] { age: 100 }
```

### 对象使用

属性访问和下标访问

```javascript
obj.n // 属性访问将输入的属性名作为变量与对象属性变量进行匹配，若没有该属性则返回undefined
obj[n] // 下标访问将输入的属性名作为值与对象属性名进行匹配

let obj = {
    name:"abc"
}
let n = "name";
obj.n // undefined
obj[n] // "abc"
```

for/in 遍历对象字段

```javascript
for (let n in obj) {
    // typeof n = String
    obj[n]; // 访问对象变量值
}
```

对象方法

```javascript
let obj = {
    fun:function (x) {
        // ...
    },
    fun1() {
        // ...
    }
}
obj.fun(x);
```

### 对象简化写法

对象字面量声明对象时，传入变量时简化属性名

```js
let name = "Hello";
let age = 20;
const obj = {
    name,
    age,
    // 匿名函数简写
    method() {
        // ...
    }
}
```

## 类

### 模拟类

早期 JavaScript 不支持类，可以通过一些方法模拟类

#### 构造函数

经典方法

```javascript
function Person(name, age) {
    this.name = name; // 实例字段
    this.age = age;
    this.fun = function (x) {
        // ...
    } // 实例方法
}
let p = new Person(name, age);
```

模拟类方法 (极简方法)

使用对象模拟一个类，其中定义构造函数

[Javascript定义类（class）的三种方法 - 阮一峰的网络日志 (ruanyifeng.com)](https://www.ruanyifeng.com/blog/2012/07/three_ways_to_define_a_javascript_class.html#:~:text=Javascri,，模拟出"类"。)

```javascript
var Person = { // 建议const
    create:function (name) {
        var p = {}; // 建议const
        p.name = name;
      	p.speak = function() {console.log("Hello");};
        return p;
    }
}
// 简化写法
/*
const Person = {
    create:function(name) {
        return {
            name:name,
            speak:function() {
                console.log("Hello");
            }
        };
    }
}
*/
let p = Person.create(name);
p.name;
p.speak();
```

使用该方法创建的对象总是 Object 类型 ({}类型)

```javascript
let p = Person.create(name);
p instanceof Person // TypeError
p instanceof Person.create // false
p instanceof Object // true
```

该方法使用简单，便于理解，在不需要类型判断时可以使用

#### 继承

使用极简方法可以很容易地实现继承的效果

```javascript
const Animal = {
    create: function () {
        return {
            name:"动物"
        };
    }
}

const Cat = {
    create: function () {
        const cat = Animal.create();
        cat.age = 2;
        return cat;
    }
}
```

#### 访问限制

使用极简方法来模拟私有字段/方法和公有字段/方法

```javascript
const Cat = {
    create: function () {
        const cat = {};
        // 相当于在构造时动态设置访问级
        let name = "nn"; // private
        cat.age = 2; // public
        cat.getName = function() {return name;};
        return cat;
    }
}
```

#### 类字段和类方法

使用极简方法来模拟类字段和类方法

```javascript
const Cat = {
    create: function () {
        const cat = Animal.create();
        cat.age = 2;
        return cat;
    },
    // 在Cat中定义的字段和方法可以看做类字段和类方法，通过Cat调用
    value: "nnn";
    speak: function () {
        console.log("Hello");
    }
}
Cat.speak();
Cat.value;
```

将类字段/方法与对象关联，使得对象可以操作类字段/方法

```javascript
const Cat = {
    create: function () {
        const cat = {};
        cat.age = 2; // 实例字段
        cat.speak = this.speak; // 类方法，该方法调用者为Cat，this指向Cat，或者赋值Cat.speak
        // 类字段共享只能使用方法来对类字段进行操作，若直接赋值，其实是动态添加了实例属性，无法做到共享
        // 操作时使用Cat类调用，该方法的调用者为cat对象，this指向cat对象，使用this调用无效
        cat.setValue = function (value) {
            Cat.value = value;
        }
        cat.getValue = function () {
            return Cat.value;
        }
        return cat;
    },
    // 在Cat中定义的字段和方法可以看做类字段和类方法，通过Cat调用
    value: "nnn",
    speak: function () {
        console.log("Hello");
    }
}
```

### class 类

在 ES6 中，js 添加了类功能，可以使用 class 声明一个类

``` js
class Person {
    // 属性
    name  // 声明属性
    age = 20  // 初始化属性
	static attr  // 静态属性，无法通过实例访问，只能通过类访问
    // 方法
    fun() {
        // ...
        // 实例方法中的this指向实例对象
    }
    static fun1() {
        // ...
        // 静态方法中的this指向类
    }
    // 构造器
    constructor(name) {
        this.name = name
    }
}
let person = new Person()  // 构造函数
person instanceof Person  // 类型判断
// 声明动态属性
person.name = "Hello"
```

#### 封装

私有属性使用 `#` 前缀

``` js
class Person {
    #name  // 私有属性必须先声明
    constructor(name) {
        this.#name = name
    }
    // 可提供getter和setter
    getName() {
        return this.#name
    }
    setName(name) {
        this.#name = name
    }
    // 简化语法糖，可简化为属性访问形式
    get name() {
        return this.#name
    }
    set name(name) {
        this.#name = name
    }
}
```

#### 继承与多态

js 使用 extends 实现继承，支持方法重写

``` js
class Animal {
    // ...
}
class Dog extends Animal {
    // 重写构造器时，调用父类构造，同Java
    constructor() {
        super()
    }
    // ...
}
```

多态：js 是动态语言，它的多态并不依赖于继承，在使用一个未知类型对象时，只关心该对象内部是否有相应的属性或方法

### 原型对象

每个函数、对象都自动存在一个原型对象，隐含的 prototype 属性指向原型对象，而原型对象中的 constructor 属性指向该函数对象

![](javascript基础-1751822372793.png)

当函数以**构造函数**的形式调用时 (类实例化)，该构造函数创建的对象中会包含一个隐含属性\_\_proto\_\_，该属性指向原型对象

若函数是构造函数，则类中声明的方法会存储在原型对象中

```javascript
fun.prototype  // 函数访问自己的原型对象，通常使用该方式访问原型对象
obj.__proto__  // 对象访问自己的原型对象
fun.prototype == obj.__proto__  // true
fun.prototype.constructor == fun  // prototype和constructor属性是对应的
Object.getPrototypeOf(obj)  // 通过Object安全访问原型对象
```

原型对象可看做一个类对象 (静态)，其中定义的属性和方法可作为各个对象实例的类字段和类方法

创建出对象或构造函数后，可以向原型对象里动态定义字段和方法

```javascript
function Person(name) {
    this.name = name;
}
let p = new Person(name);
Person.prototype.age = 20;
console.log(p.age) // 20
```

#### instanceof

instanceof 用于判断对象实例类型，判断实例是否是某个构造函数创建的，不能用于判断原型对象

`TypeException:Right-hand side of 'instanceof' is not callable`，**instanceof 的右值必须是可调用的**

instanceof 实际是判断实例对象的\_\_proto\_\_ 和构造函数的 prototype 是否相同

```javascript
function Person(name) {
    this.name = name;
}
let p = new Person(name);
console.log(p instanceof Person) // true
console.log(p instanceof Person.prototype) // error
```

#### 原型链

构造函数与对象的原型关系

![](javascript基础-1751822383858.png)

两种构造方法的原型链

经典方法 (对应类实例化)：真正的创建了 Person 构造函数，生成了 Person 的原型对象

![](javascript基础-1751822391948.png)

极简方法或字面量方法：本质上 person 是个 Object 对象，没有创建新的原型对象

![](javascript基础-1751822399666.png)

原型继承：js 继承通过原型链实现，子类的原型对象就是父类的实例对象

#### 对象方法

- `hasOwnProperty`：判断对象实例自身的字段

    使用 `obj.hasOwnProperty("attr")` 判断对象实例自身的字段，不包含原型对象的字段

    ```js
    function Person(name) {
        this.name = name;
    }
    let p = new Person(name);
    Person.prototype.age = 20;
    "age" in p // true
    p.hasOwnProperty("age") // false
    ```

- `Object.is`：判断两个对象是否完全相等

- `Object.assign`：对象合并，将后一参数对象合并到前一参数对象，若出现重名成员，则覆盖

- `Object.setPrototypeOf`：设置对象原型对象

- `Object.getPrototypeOf`：获取对象原型对象

- `Object.fromEntries`：通过二维数组或 Map 来创建对象

- `Object.entries`：将对象转换为二维数组

## 常用工具对象

### Date

创建 Date 对象自动以当前时间创建

```javascript
Date date = new Date();
// 传入指定时间字符串创建，格式:mm/dd/yyyy hh:MM:ss
Date date = new Date("10/5/2022 16:17:00");
```

方法

- getDate()：返回日期
- getDay()：返回日期是周几，周日返回 0
- getMonth()：返回月份，从 0 开始
- getFullYear()：返回年份
- getTime()：返回时间戳 (自 1970 年 1 月 1 日到至今的毫秒数)
- Date.now()：获取当前时间戳

### 字符串

字符串支持下表访问，length 获取字符串长度

- charCodeAt()：返回指定位置字符的 Unicode 编码
- String.fromCharCode()：返回 Unicode 编码对应的字符
- concat()：连接多个字符串
- indexOf(char, start)：获取字符串中字符的索引，不存在则返回 -1，start 指定开始查找的位置
- lastIndexOf()：从尾部查找字符的索引
- slice()：获取子串
- substring()：获取子串，不支持负数索引
- split()：字符串分割为数组，传入字符串分隔符，传入空串，则以每个字符分割
- search()：搜索字符串中的子串，返回第一次出现的索引，不存在则返回 -1
- replace()：将字符串中的第一个指定子串替换为新内容
- trimStart()：去除字符串起始空白
- trimEnd()：去除字符串末尾空白
- trim()：去除字符串起始和末尾空白

### 正则表达式

JavaScript 正则表达式使用 RegExp 对象封装

```javascript
let reg = new RegExp("expression", "pattern");
// 字面量创建
let reg = /expression/pattern;
```

pattern

- "i": 忽略大小写
- "g": 全局匹配

相关方法

- test(str)：测试 str 是否符合正则表达式
- 与字符串相关，由字符串调用
    - split()：传入正则表达式，根据正则表达式的匹配结果分割字符串，默认全局匹配
    - search()：传入正则表达式，返回第一个匹配结果的索引，不支持全局匹配
    - match()：传入正则表达式，返回第一个匹配结果，正则设置为全局匹配 g，返回所有匹配结果的数组
    - replace()：传入正则表达式，将第一个匹配结果替换为新内容，正则设置为全局匹配 g，将所有匹配结果替换

### JSON

- `JSON.parse(jsonString)`：将 json 字符串转换为 json 对象
- `JSON.stringify(obj)`：将 js 对象转换为 json 字符串

### Map

Map 的键值支持任意对象

``` js
let map = new Map()
map.size
map.keys()
map.values()
map.entries()
map.set(key, value)
map.get(key)  // 不存在返回undefined
map.delete(key)  // 删除key
map.has(key)  // 是否包含key
map.clear()
let arr = Array.from(map)  // 将map转换为k-v数组
let map = new Map([[k1, v1], [k2, v2], [k3, v3]])  // 数组转换为map
// 遍历map
for (let entry of map) {
    // entry = [k, v]
    // ...
}
for (let [k, v] of map) {
    // ...
}
```

### Set

``` js
let set = new Set()
set.size
set.add(value)
set.delete(value)
set.has(value)
for (let item of set) {
    // ...
}
let set = new Set([v1, v2, v3])  // 数组转换为Set
```

## 迭代器

迭代器用于 for...of 访问，实际通过 `Symbol.iterator` 方法获取迭代器 Iterator，调用 Iterator 的 next 方法遍历，next 方法返回一个包含 `value` 和 `done` 两个属性的对象，value 为遍历值，done 表示遍历是否完成

自定义迭代器

```js
class MyArray {

    #array = ["a", "b", "c"];

    [Symbol.iterator]() {
        let i = 0;
        let _this = this;
        // 返回一个Iterator对象，带有next方法
        return {
            next() {
                // next方法返回一个带有value和done两个属性的对象
                if (i < _this.#array.length) {
                    return {
                        value: _this.#array[i++],
                        done: false
                    }
                } else {
                    return {
                        value: undefined,
                        done: true
                    }
                }
            }
        }
    }
}

const myArray = new MyArray();
for (let v of myArray) {
    console.log(v);
}
```

## 生成器

生成器是一个函数，可以实现代码逻辑的迭代执行

```js
function* generate() {
    // 生成器中可以使用yield，中断执行，返回输出
    yield 1
    yield 2
    yield 3
}
for (let v of generate()) {
    console.log(v);
}
```

生成器传参

```js
function* generate(arg) {
    // 调用传参
    console.log(arg)
    // next方法传参
    let res1 = yield
    console.log(res1)  // A
    let res2 = yield
    console.log(res2)  // B
    let res3 = yield
    console.log(res3)  // C
}

let generator = generate("Hello")
generator.next()  // 执行console.log(arg)
generator.next("A")  // 赋值res1，执行console.log(res1)
generator.next("B")  // 赋值res2，执行console.log(res2)
generator.next("C")  // 赋值res3，执行console.log(res3)
```

## 模块化

在 ES6 之前有许多模块化规范

- CommonJS：NodeJS
- AMD：requireJS
- CMD：SeaJS

模块化语法

导出：`export`

```js
// 导出变量
export let variable = 20;

// 导出函数
export function method() {
    // ...
}

// 统一导出
export {
    variable,
    function1
}

// 默认导出，通过default属性获取
export default {
    name: variable,
    age: 20,
    method: function() {
        // ...
    }
}
```

导出：`import`

```js
// 导入所有成员
import * as my_module from 'filepath'

// 解构导入，使用别名
import {variable as other, function1} from 'filepath'

// 默认导出解构
import {default as m} from 'filepath'

// 默认导出语法糖
import m from 'filepath'

// 动态导入
import("./hello.js").then(module => {
    // ...
})
```
