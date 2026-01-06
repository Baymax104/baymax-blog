---
title: CSS入门
categories: [技术相关]
tags: [CSS, 前端]
date: 2025-07-05 21:44
updated: 2026-01-06 18:18
---
## 选择器

选择器是 CSS 的核心基础，正确使用选择器能精准定位页面元素，其中空格的使用直接影响选择器匹配逻辑，需严格区分使用场景。

### 基本选择器

基本选择器是 CSS 最基础的元素匹配方式，覆盖单元素、多元素、全元素等核心场景：

- id 选择器：指定唯一 HTML 元素，使用 `#` 标识

    ```CSS
    #myid {...}
    ```

- class 选择器：可匹配多个元素，使用 `.` 标识

    ```CSS
    .myclass {...}
    ```

- 通配选择器：匹配 HTML 文档中所有元素

    ```CSS
    * {...}
    ```

- 标签选择器：匹配文档中所有指定标签

    ```CSS
    p {...} /*选择所有的p标签*/
    ```

- 并集选择器：同时匹配多个选择器对应的元素

    ```CSS
    div,p {...} /*选择所有的div和p标签*/
    ```

- 交集选择器：匹配同时满足多个条件的元素，首个通常为标签选择器，后续为类/id 选择器

    ```CSS
    div.myclass {...} /*选择class为myclass的div标签*/
    ```

### 关系选择器

关系选择器基于元素间的层级关系匹配，是布局中定位子元素的核心：

- 子元素选择器：匹配直接父元素下的指定子元素（仅一级层级）

    ```CSS
    div>p {...} /*选择所有父级为div标签的p标签*/
    .myclass>p {...} /*选择所有父级class为myclass的p标签*/
    ```

- 后代选择器：匹配父元素下所有层级的指定后代元素

    ```CSS
    div p {...} /*选择div标签下的所有p标签*/
    .myclass p {...} /*选择class为myclass的元素下的所有p标签*/
    ```

- 相邻选择器：匹配目标元素后紧邻的同级元素

    ```CSS
    div+p {...} /*选择所有div标签后紧邻的p标签*/
    ```

### 属性选择器

通过元素的属性及属性值匹配元素，支持精准、模糊、首尾匹配等场景：

- [attribute]：匹配带有指定属性的元素

    ```CSS
    [target] {...} /*选择所有带有target属性的元素*/
    ```

- [attribute="value"]：匹配属性值完全等于指定值的元素

    ```CSS
    [target="_blank"] {...} /*选择所有target="_blank"的元素*/
    ```

- [attribute*="value"]：匹配属性值包含指定字符串的元素

    ```CSS
    [title*="flower"] {...} /*选择所有title属性值包含flower的元素*/
    ```

- [attribute^="value"]：匹配属性值以指定字符串开头的元素

    ```CSS
    [title^="ch"] {...} /*选择所有title属性值以ch开头的元素*/
    ```

- [attribute$="value"]：匹配属性值以指定字符串结尾的元素

    ```CSS
    [title$="ing"] {...} /*选择所有title属性值以ing结尾的元素*/
    ```

### 伪类选择器

匹配元素的特定状态或位置，以 `:` 开头，现代 CSS 新增了更多实用伪类（如 `:focus-visible`）：

- 位置类伪类：基于元素在父容器中的位置匹配

    ```CSS
    p:first-child {...} /*选择父元素第一个子元素且为p的元素*/
    p:first-of-type {...} /*选择父元素下第一个p类型元素*/
    p:last-child {...} /*选择父元素最后一个子元素且为p的元素*/
    p:last-of-type {...} /*选择父元素下最后一个p类型元素*/
    p:nth-child(x) {...} /*选择父元素第x个子元素且为p的元素（x为n/2n/odd等）*/
    p:nth-last-child(x) {...} /*选择父元素倒数第x个子元素且为p的元素*/
    p:nth-of-type(x) {...} /*选择父元素下第x个p类型元素*/
    p:nth-last-of-type(x) {...} /*选择父元素下倒数第x个p类型元素*/
    p:only-child {...} /*选择是父元素唯一子元素的p元素*/
    p:only-of-type {...} /*选择父元素下唯一的p类型元素*/
    ```

- 逻辑伪类：匹配不符合指定选择器的元素

    ```CSS
    :not(p) {...} /*选择所有非p的元素*/
    ```

- 交互类伪类：匹配元素的交互状态（现代浏览器推荐 `:focus-visible` 替代 `:focus` 优化键盘导航体验）

    ```CSS
    a:link {...} /*选择所有未访问的链接*/
    a:active {...} /*选择活动状态的链接（鼠标按下时）*/
    a:hover {...} /*选择鼠标悬停的链接*/
    a:visited {...} /*选择所有访问过的链接*/
    input:focus {...} /*选择获取焦点的input元素*/
    input:focus-visible {...} /*仅在键盘导航聚焦时触发*/
    ```

- 其他实用伪类

    ```CSS
    input:default {...} /*选择默认选中的input元素*/
    :root {...} /*选择文档根元素（HTML文档中为<html>）*/
    p:empty {...} /*选择内容为空的p元素*/
    ```

### 伪元素选择器

匹配元素的特定位置（如首行、首字母）或生成虚拟元素，现代规范推荐使用 `::` 区分伪元素与伪类：

```CSS
p::before {
    content:"前缀";
} /*在p元素内容前插入虚拟内容*/
p::after {
    content:"后缀";
} /*在p元素内容后插入虚拟内容*/
::selection {...} /*选择鼠标选中的文本区域*/
p::first-letter {...} /*选择p元素的首字母*/
p::first-line {...} /*选择p元素的首行文本*/
```

### 选择器继承与优先级

继承规则：内部标签默认继承外部标签的部分样式（背景、边框等属性不继承），可通过 `inherit` 强制继承父元素属性，`initial` 重置为属性初始值。

优先级规则（从高到低）：`!important` > 内联样式 > id 选择器 > 类/伪类/属性选择器 > 标签选择器 > 通配选择器/选择符/逻辑伪类（`:not()`/`:is()`）

优先级可通过“数值累加”辅助判断（id=100、类=10、标签=1）

## 盒模型

CSS 中所有 HTML 元素均可视为“盒子”，包含内容区、边框、内边距、外边距四部分，是布局的核心基础。

盒模型核心组成：

- 内容区：元素实际显示内容的区域，由 width/height 定义
    
- 内边距（padding）：内容区与边框之间的空间
    
- 边框（border）：包裹内边距和内容区的线条
    
- 外边距（margin）：元素与其他元素之间的空间

![](css-1767694727180.png)

### 宽度与高度

通过 width/height 设置内容区尺寸，支持多种取值类型：

- 取值类型：固定像素（px）、百分比（%）、auto（浏览器自动计算）、initial（默认值）、inherit（继承父元素）
    
- 元素显示类型影响：行内元素的 width/height 默认无效，可通过 display 修改：

    ```CSS
    span {
      display: inline-block; /*转换为行内块元素，宽高生效*/
    }
    ```

- 显示与隐藏：
    
    - display：none（隐藏元素，不占空间）、block（块元素）、inline（行内元素）、inline-block（行内块）
        
    - visibility：visible（默认显示）、hidden（隐藏元素，保留空间）（注：原内容中“visibility: none”为错误写法，已删减）。

### 内边距与外边距

- 内边距（padding）：可单独设置四个方向（padding-top/right/bottom/left），增加内边距会扩大元素总宽度，可通过 box-sizing 固定总宽度：

    ```CSS
    div {
        width:300px;
        padding:25px;
        box-sizing:border-box; /*总宽度=width，包含内边距和边框*/
    }
    ```

- 外边距（margin）：可单独设置四个方向，存在“外边距合并”特性（仅垂直方向、普通文档流中）：
    
    - 相邻元素：两个垂直外边距相遇时，合并为较大值
        
    - 父子元素：子元素垂直外边距会传递给父元素（可通过 BFC 解决）
        
- 布局溢出处理：父元素高度固定时，子元素高度超出会溢出，可通过 overflow 控制：

    ```CSS
    .parent {
      height: 200px;
      overflow: auto; /*溢出时显示滚动条*/
    }
    ```

### 盒子大小计算

盒子大小计算决定元素总尺寸的核算方式，不影响页面核心布局，主要分为两种模式，具体说明及示例如下：

```CSS

/* 盒子大小计算模式 */
.content-box-demo {
  box-sizing: content-box; /* 默认模式，宽度和高度仅包含内容区 */
  width: 200px;
  padding: 20px;
  border: 1px solid #000; /* 元素总宽度 = 200px + 20px*2 + 1px*2 = 242px */
}
.border-box-demo {
  box-sizing: border-box; /* 主流推荐模式，宽度和高度包含内容区、内边距、边框 */
  width: 200px;
  padding: 20px;
  border: 1px solid #000; /* 元素总宽度固定为200px，内容区自动压缩 */
}
```

### 默认样式重置

浏览器会为元素添加默认样式（如 body 的 margin、ul 的 padding），导致不同浏览器显示不一致，需重置默认样式：

- 方案 1：手动重置核心样式

    ```CSS
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }
    ```

- 方案 2：引入成熟重置样式表（如 normalize.css，保留有用默认样式，比 reset.css 更友好）。

### CSS 变量

原生 CSS 支持变量定义与使用，提升样式复用性和可维护性：

```CSS
/* 定义变量（全局作用域） */
:root {
  --primary-color: #1890ff;
  --font-size: 16px;
}
/* 使用变量 */
div {
  background-color: var(--primary-color);
  font-size: var(--font-size);
  /* 计算函数配合变量 */
  width: calc(100% - var(--padding, 20px)); /*第二个参数为默认值*/
}
```

## 布局相关

### 浮动

float 属性使元素脱离普通文档流，现代布局中 Flex/Grid 已替代浮动成为主流，浮动仅用于文字环绕等场景：

- 浮动属性：none（默认）、left（左浮动）、right（右浮动）
    
- 高度塌陷问题：父元素高度自适应时，子元素浮动会导致父元素高度为 0，解决方案：
    
    - BFC 触发：为父元素设置 overflow: hidden/auto、display: flow-root 等（现代推荐 display: flow-root，无副作用）
        
    - 清除浮动：使用::after 伪元素（经典方案）：

        ```CSS
        .clearfix::after {
            content:"";
            display:block;
            clear:both;
        }
        ```

    - 通用方案（解决高度塌陷 + 外边距重叠）：

        ```CSS
        .clearfix::before,
        .clearfix::after {
            content:'';
            display:table;
            clear:both;
        }
        ```

### 定位

通过 position 属性精准控制元素位置，配合 top/bottom/left/right 偏移量使用：

- 相对定位（relative）：元素相对自身原位置偏移，不脱离文档流，保留原空间
    
- 绝对定位（absolute）：脱离文档流，相对最近的已定位祖先元素（非 static）偏移，无则相对视口
    
- 固定定位（fixed）：脱离文档流，相对浏览器视口固定，不随页面滚动
    
- 粘滞定位（sticky）：结合 relative 和 fixed，滚动到指定位置后固定
    
- 层级控制：z-index 属性设置元素堆叠层级（仅对定位元素生效），祖先元素层级不会覆盖子元素。

### Flex 弹性布局

现代主流布局方案，通过弹性容器和弹性元素实现灵活的一维布局：

- 弹性容器：设置 `display: flex/inline-flex`，容器属性：

    ```CSS
    .container {
      display: flex;
      flex-direction: row; /*主轴方向：row/column/row-reverse/column-reverse*/
      flex-wrap: wrap; /*是否换行：nowrap/wrap/wrap-reverse*/
      justify-content: center; /*主轴对齐：flex-start/center/flex-end/space-between/space-around/space-evenly*/
      align-items: center; /*副轴对齐：stretch/flex-start/center/flex-end/baseline*/
      align-content: center; /*多行副轴对齐（仅换行时生效）*/
    }
    ```

- 弹性元素：容器的直接子元素，核心属性：

    ```CSS
    .item {
      flex-grow: 1; /*剩余空间分配比例，默认0*/
      flex-shrink: 1; /*空间不足时收缩比例，默认1*/
      flex-basis: auto; /*主轴基础尺寸，默认auto*/
      flex: 1; /*简写：flex-grow flex-shrink flex-basis*/
      align-self: center; /*单独设置当前元素副轴对齐*/
      order: 0; /*排序优先级，数值越小越靠前*/
    }
    ```

### Grid 网格布局

现代主流二维布局方案，可同时控制行与列的布局，比 Flex 布局更适合复杂网格结构，通过网格容器和网格项目实现灵活排版。

- 网格容器：设置 display: grid/inline-grid，核心容器属性：
    
- 网格项目：容器的直接子元素，核心项目属性：
    
- 核心说明：Grid 布局适合二维排版（如卡片网格、页面框架），Flex 适合一维排版（如导航栏、列表），二者可嵌套使用，覆盖绝大多数布局场景。

```CSS

/* 基础Grid布局示例：3列2行网格，包含跨列跨行效果 */
/* 网格容器 */
.grid-container {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr; /* 3列，每列占比相同 */
  grid-template-rows: 100px 100px; /* 2行，每行高度100px */
  gap: 10px; /* 行列间距10px */
  width: 100%;
  height: 300px;
  padding: 10px;
  box-sizing: border-box;
}
/* 网格项目 */
.grid-item {
  background-color: #1890ff;
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
}
/* 项目1跨2列 */
.item1 {
  grid-column: 1 / span 2; /* 从第1列开始，跨2列 */
}
/* 项目4跨2行 */
.item4 {
  grid-row: 1 / span 2; /* 从第1行开始，跨2行 */
  grid-column: 3; /* 固定在第3列 */
}
```

## 样式美化

### 盒子样式

盒子样式用于优化元素外观表现，不影响页面布局，常用效果包括轮廓、阴影、圆角三类，具体示例如下：

```CSS

/* 盒子视觉样式效果 */
.outline-demo:focus {
  outline: 2px solid #1890ff; /* 轮廓，不占用布局空间，常用于聚焦状态提示 */
}
.shadow-demo {
  box-shadow: 2px 2px 4px 1px rgba(0, 0, 0, 0.2); /* 参数：水平偏移、垂直偏移、模糊半径、扩散半径、颜色 */
}
.border-radius-demo {
  border-radius: 10px; /* 统一圆角 */
  /* 椭圆圆角，参数：水平方向圆角半径 / 垂直方向圆角半径 */
  border-radius: 10px 20px / 20px 10px;
}
```

### 背景样式

背景属性支持多背景图、渐变、雪碧图等高级用法，现代 CSS 新增更多灵活配置：

- 基础属性：

    ```CSS
    div {
      background-color: #fff; /*背景颜色，支持RGBA透明*/
      background-image: url("url"); /*背景图片，可同时设置多张（逗号分隔）*/
      background-repeat: no-repeat; /*重复方式：repeat-x/repeat-y/no-repeat*/
      background-position: center; /*图片位置，支持像素/百分比/关键字*/
      background-attachment: fixed; /*是否随滚动移动：scroll/fixed/local*/
    }
    ```

- 高级属性：

    ```CSS
    div {
      background-clip: content-box; /*背景范围：border-box/padding-box/content-box*/
      background-origin: padding-box; /*图片原点：border-box/padding-box/content-box*/
      background-size: cover; /*图片尺寸：cover/contain/数值/百分比*/
    }
    ```

- 雪碧图（Sprite）：将多张小图合并为一张，通过 background-position 切换显示区域，减少 HTTP 请求（现代主流方案为 iconfont/svg 图标，雪碧图仍用于特殊场景）
    
- 渐变（本质为背景图片）：

    ```CSS
    /*线性渐变*/
    background: linear-gradient(45deg, #ff0000, #00ff00 50%, #0000ff);
    /*径向渐变*/
    background: radial-gradient(circle, #ff0000, #0000ff);
    /*重复渐变*/
    background: repeating-linear-gradient(0deg, #ff0000, #00ff00 10px);
    ```

### 边框样式

边框支持多种样式和圆角，可单独设置四个方向：

- 边框样式（border-style）：dotted（点线）、dashed（虚线）、solid（实线）、double（双线）等
    
- 边框简写：border: 1px solid #000（顺序：宽度 样式 颜色）
    
- 边框圆角：border-radius，支持单值、多值、椭圆圆角：

    ```CSS
    p {
        border-radius:5px; /*统一圆角*/
        border-radius:5px 4px 3px 2px; /*四个角分别设置*/
        border-radius: 50%; /*圆形（元素宽高相等时）*/
    }
    ```

- 表格边框：border-collapse（合并相邻边框）、border-spacing（设置边框间距）。

### 文字样式

涵盖字体、对齐、间距、溢出处理等，是页面文字排版的核心：

- 基础字体样式：

    ```CSS
    p {
      font-size: 16px; /*字体大小*/
      font-weight: 400; /*字体粗细：normal/bold/100-900*/
      font-style: normal; /*字体样式：normal/italic/oblique*/
      font-family: "Microsoft Yahei", sans-serif; /*字体族，优先使用前者*/
      line-height: 1.5; /*行高，推荐使用无单位数值（基于字体大小）*/
    }
    ```

- 文本排版：

    ```CSS
    p {
      text-indent: 2em; /*首行缩进（em为当前字体大小）*/
      word-spacing: 2px; /*单词间距（中文无效）*/
      letter-spacing: 1px; /*字符间距（中文生效）*/
      text-align: center; /*水平对齐：left/center/right/justify*/
      vertical-align: middle; /*垂直对齐：baseline/top/middle/bottom（行内/表格元素生效）*/
      white-space: nowrap; /*空白处理：normal/nowrap/pre*/
      text-overflow: ellipsis; /*溢出处理：ellipsis（省略号），需配合white-space: nowrap和overflow: hidden使用*/
      text-decoration: none; /*文字装饰：none/underline/line-through*/
    }
    ```

- 图标文字：使用 Font Awesome 图标库：

    ```HTML
    <link href="https://cdn.bootcdn.net/ajax/libs/font-awesome/6.2.0/css/all.css" rel="stylesheet">
    <i class="fa fa-car"></i>
    ```

    参考手册：[Font Awesome 参考手册 | 菜鸟教程 (runoob.com)](https://www.runoob.com/font-awesome/fontawesome-reference.html)

## 动态效果

### 过渡效果

通过 transition 实现元素属性的平滑过渡，仅对“确定值到确定值”的变化生效（auto 无效）：

```CSS
div {
  transition: all 0.3s ease; /*简写：属性 时长 时间函数 延迟*/
  /* 拆分写法 */
  transition-property: background-color; /*指定过渡属性*/
  transition-duration: 0.3s; /*过渡时长（必填）*/
  transition-timing-function: ease; /*时间函数：linear/ease-in/ease-out/cubic-bezier()*/
  transition-delay: 0.1s; /*延迟执行*/
}
div:hover {
  background-color: #ff0000; /*触发过渡*/
}
```

### 动画与变形

通过@keyframes 定义关键帧，实现更复杂的自定义动画：

```CSS
/* 定义关键帧 */
@keyframes fadeIn {
  0% {
    opacity: 0;
    transform: translateY(20px);
  }
  100% {
    opacity: 1;
    transform: translateY(0);
  }
}
/* 应用动画 */
div {
  animation-name: fadeIn; /*关键帧名称*/
  animation-duration: 0.5s; /*动画时长*/
  animation-delay: 0.1s; /*延迟执行*/
  animation-timing-function: ease; /*时间函数*/
  animation-iteration-count: infinite; /*执行次数：数值/infinite*/
  animation-direction: alternate; /*执行方向：normal/reverse/alternate*/
  animation-fill-mode: forwards; /*填充模式：none/forwards/backwards*/
  animation-play-state: running; /*播放状态：running/paused*/
  /* 简写 */
  animation: fadeIn 0.5s ease 0.1s infinite alternate forwards;
}
```

通过 transform 实现元素的平移、旋转、缩放等变形，不影响页面布局：

```CSS
div {
  transform-origin: center; /*变形原点，默认中心*/
  transform-style: preserve-3d; /*开启3D效果*/
  /* 平移 */
  transform: translateX(20px) translateY(10px) translateZ(5px);
  /* 旋转（3D） */
  transform: rotateX(30deg) rotateY(45deg) rotateZ(60deg);
  /* 缩放 */
  transform: scaleX(1.2) scaleY(0.8) scale(1.5);
}
/* 3D效果需设置视距 */
body {
  perspective: 800px; /*视距，数值越小3D效果越明显*/
}
```
