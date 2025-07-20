---
title: Jetpack Compose
categories: [Android]
tags: [Android, Jetpack Compose]
date: 2024-04-14 15:12
updated: 2025-07-07 01:11
banner: /images/jetpack_compose.png
wiki: android
---
## 开始

Compose 设计原则

- 一切组件都是函数

    Compose 组件通过可组合函数表示，使用 Composable 注解标识函数

- 组合优于继承

    所有组件之间没有继承关系，Composable 函数可以任意嵌套，而不会损失性能

- 单一数据源

    所有组件只能通过一个参数来改变状态，当组件的状态需要改变时，只能通过该参数来改变

    视图树一旦生成不可改变，当视图树中的参数改变时，整个视图树基于新数据刷新，称为重组

    单一数据源决定了数据流的的单向流动，数据总是自上而下流动，事件总是自下而上传递

    ![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/jetpack-compose%2Fjetpack-compose-1751821659870.png)

Compose 与 View 的关系：Compose 树中的视图节点是 LayoutNode，Compose 树可以通过一个挂载点挂载到 View 树中，挂载点通过 AbstractComposeView 实现，AbstractComposeView 有三个子类，分别用于适配 Activity、Dialog 和 PopupWindow，它的子节点 AndroidComposeView 持有 Compose 树，同时它也是一个 ViewGroup，实现了 Compose 树和 View 树的连接

## UI 组件

Compose 提供了基本 UI 组件以及 Row、Column、Box 三种布局，父组件默认适应子组件大小

### Modifier

#### 基本 Modifier

每个组件都有一个 modifier 参数，可以传入一个 Modifier 对象，Modifier 对象可以设置组件的基本样式，如边距、大小、背景等

- size：设置组件大小，可分别设置 width 和 height 参数，也可调用 width 和 height 函数分别设置

- background：设置组件背景颜色、形状，通过 Color 对象设置纯色，通过 Brush 对象设置渐变色

- fillMaxSize：使组件充满父组件

    - fillMaxWidth
    - fillMaxHeight

- border：设置组件边框，可设置粗细、颜色等

- padding：设置组件的边距，在 Compose 中没有 margin，与 background 共同作用来实现内边距，在 background 之前调用 padding 表示外边距

- offset：设置组件的偏移量，需要注意该函数的调用顺序

Modifier 中包含了许多关于手势的修饰符

- clickable：使组件变为可点击，也可通过状态控制 enable 参数
- CombinedClickable：复合点击，可设置单击、长按、双击等
- Draggable：拖动，可对水平和垂直方向的拖动偏移进行监听
- Swipeable：滑动，需要设置锚点，可对水平和垂直方向的拖动偏移进行监听
- Scrollable：滚动，支持水平和垂直滚动，需要 scrollState 参数，使用 rememberScrollState 创建
- NestedScroll：嵌套滚动，需要 NestedScrollConnection 参数，其中包含父组件使用子组件的滚动事件回调

#### 作用域 Modifier

使用作用域 Modifier 可以使得 modifier 函数被安全调用，减少不必要的调用

Compose 中的作用域不允许跨层调用，若需要跨层调用，需要显示指明 Receiver

- BoxScope
    - matchParentSize：使内部组件与 Box 大小相同
- RowScope、ColumnScope
    - weight：通过百分比设置内部组件大小

#### Modifier 原理

Modifier 是一个接口，每个修饰符函数实现了 `Modifier.Element` 接口，Modifier 包含一个伴生对象，在起始位置通过 Modifier 伴生对象调用第一个修饰符函数后，会创建相应修饰符的 Modifier 实例对象，修饰符函数之间通过 then 函数连接，Modifier 对象在其中传递

then 函数返回一个 CombinedModifier

``` kotlin
class CombinedModifier(
    private val outer: Modifier,
    private val inner: Modifier
) : Modifier
```

outer 指向当前修饰符的前一个 Modifier 对象，inner 指向当前修饰符的 Modifier 对象

![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/jetpack-compose%2Fjetpack-compose-1751821705932.png)

Compose 在绘制 UI 时，会遍历 Modifier 链，使用 foldIn 和 foldOut 函数进行遍历

foldIn 进行正向遍历，foldOut 进行反向遍历

``` kotlin
fun <R> foldIn(initial: R, operation: (R, Element) -> R): R
fun <R> foldOut(initial: R, operation: (Element, R) -> R): R
```

> Modifier 的详细介绍参考：[图解 Modifier](https://jetpackcompose.cn/docs/principle/modifierStructure)

### 基本 UI 组件

#### 文本组件

- Text：基于 Material Design 规范设计，使用 BasicText 则脱离 Material Design 规范

    ![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/jetpack-compose%2Fjetpack-compose-1751821724900.png)

    > 关于资源：Compose 提供了获取不同类型资源的函数
    > 
    >   - stringResource：获取文本资源
    >   - colorResource：获取颜色资源
    >   - integerResource：通过资源 id 获取
    >   - painterResource：获取 Drawable 资源

- TextStyle：文字样式，使用 TextStyle 构造器构造，传入相应样式属性

    若重复设置 Text 与 TextStyle，则 Text 属性会覆盖 TextStyle 属性

- AnnotatedString：多样式文字

    使用 buildAnnotatedString 函数构造 AnnotatedString

    其中可调用 withStyle 函数传入一个 SpanStyle 对象或 ParagraphStyle 对象和子串 DSL，SpanStyle 表示子串的样式，ParagraphStyle 表示段落样式，子串 DSL 中调用 append 添加子串文本

- SelectionContainer：使组件可被选中

- TextField：输入框，BasicTextField 不使用 Material Design 规范

    BasicTextField 比 TextField 多一个 decorationBox 属性，通过该属性可设置更多样式

    两种风格：filled(无边框填充)，Outlined(有边框无填充)

    ![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/jetpack-compose%2Fjetpack-compose-1751821912296.png)

#### 图像组件

- Icon：图标组件，支持矢量图对象、位图对象和 Canvas 画笔对象，矢量图通过 ImageVector 加载，位图通过 ImageBitmap 加载

    Icons 包预置了一些图标，它们拥有 5 种风格：Outlined、Filled、Rounded、Sharp、Two Tone

    更多图标 `implementation("androidx.compose.material:material-icons-extended:$compose_version")`

- Image：图像组件，contentScale 参数指定图片的伸缩样式，类似 ScaleType

#### 点击组件

- Button：按钮，Button 只是响应点击的容器，content 参数传入 ComposableDSL，使用其他组件填充内容，作用域为 RowScope

    interactionSource 参数传入一个 MutableInteractionSource 状态

    - collectPressedAsState：判断是否是按下状态
    - collectFocusedAsState：判断是否获取焦点
    - collectDraggedAsState：判断是否拖动

    调用以上函数可获取对应的状态对象，其 value 属性为判断的 boolean 值

    其他组件可通过调用 `Modifier.clickable` 变为可点击组件，响应事件

- IconButton：一个图标按钮，内部需要提供 Icon 组件

- FloatingActionButton：悬浮按钮，内部提供 Icon 组件

- ExtendedFloatingActionButton：可带文字的悬浮按钮

#### 选择组件

- CheckBox：复选框
- TriStateCheckBox：三态选择框
- Switch：单选框
- Slider：滑竿组件

#### 对话框

- Dialog：传入三个属性，onDismissRequest(关闭回调)、DialogProperties(设置其他特殊属性)、content(CompossableDSL)，对话框的显示和隐藏通过设置状态实现，当状态为 true 则渲染 Dialog
- AlertDialog：基于 Dialog 封装，添加了 title、text、confirmButton、dismissButton

### 布局组件

#### 基本布局

Compose 只有三种布局，Row、Column、Box

对齐：verticalArrangement、horizontalAlignment，只有在设置了 Column 的大小时才能使用对齐

子组件对齐：布局内的组件可以通过 `Modifier.align` 设置自己的对齐，Column 中只能设置子组件水平对齐，Row 中只能设置子组件垂直对齐

![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/jetpack-compose%2Fjetpack-compose-1751821779468.gif)

- Column：垂直线性布局
- Row：水平线性布局

#### 帧布局

- Box：子组件可堆叠，类似 FrameLayout
- Surface：一个组件容器，可设置边框、圆角、颜色等，当需要设置布局总体样式时，可使用 Surface
- Spacer：空白，在布局中占位
- ConstraintLayout

#### Scaffold 脚手架

Scaffold 组件实现了一个基于 Material Design 的基本 UI 布局

包含多个特定位置参数和 content，设置组件，组件自动位于相应的位置，content 为 ComposableDSL

- topBar
- bottomBar
- drawerContent

Scaffold 拥有一个状态，包含了特定位置组件的相关状态，如侧边栏是否打开等，通过 rememberScaffoldState() 获取变量，设置到 Scaffold 的 scaffoldState 参数

> BackHandler：监听返回键组件，设置 enable 参数和 onBack 回调

### 列表

调用 `Modifier.horizontalScroll()` 或 `Modifier.verticalScroll()` 可以实现滚动，但对于长列表，不需要将全部数据加载到内存中，可以使用 LazyRow 或 LazyColumn 组件实现列表

LazyComposables 内是 LazyListScope 作用域，调用 item 或 items 函数创建一个子项，这两个函数需要传入子项的 ComposableDSL

items 还可接收 List 参数，调用 itemsIndexed 可同时获取索引

- contentPadding：设置子项**内容**外边距
- verticalArrangement=Arrangement.spacedBy：设置子项布局外边距

## 主题

### 基本主题

项目的 `ui/theme` 目录下存放项目主题配置

- Color.kt：颜色配置
- Shape.kt：形状配置
- Theme.kt：主题配置
- Type.kt：字体配置

Material Design 颜色字段

![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/jetpack-compose%2Fjetpack-compose-1751821814421.png)

### CompositionLocal

CompositionLocal 用于在视图树中共享数据，CompositionLocal 可被定义在任何一棵子树中，数据在该子树中共享，若子树的子树重新定义 CompositionLocal，则会覆盖原定义

创建 CompositionLocal

- compositionLocalOf

    若提供给 CompositionLocal 的值是一个状态，当状态发生变化时，CompositionLocal 子树中读取了 `CompositionLocal.current` 值的 Composable 层级会发生重组

- staticCompositionLocalOf

    若提供给 CompositionLocal 的值是一个状态，当状态发生变化时，整个 CompositionLocal 子树发生重组

CompositionLocalProvider 方法可以为 compositionLocal 提供一个值，该值在当前子树内覆盖 compositionLocal 的原值

``` kotlin
val localString = staticCompositionLocalOf { "Hello in level1" }
Column {
    Text(localString.current)  // Hello in level1
    CompositionLocalProvider(
    	localString provides "Hello in level2"
    ) {
        Text(localString.current)  // Hello in level2
    }
}
```

## 状态管理

Compose 通过重组来进行 UI 刷新

- Stateless：一个 Composable 中不包含自己的状态，所有状态通过函数参数传递
- Stateful：一个 Composable 中包含自己的状态，也包含函数参数传递的状态

### 状态定义

- State：不可变状态
- MutableState：可变状态

创建 MutableState

``` kotlin
val state: MutableState<Int> = mutableStateOf(0)  // 调用value属性进行读写
val (state, setter) = mutableStateOf(0)  // state为属性值，调用setter设置属性值
val state by mutableStateOf(0)  // 属性代理
```

状态缓存：使用 `remember { state }`，在 Composable 中记录状态

### 状态提升

将 Stateful 改造为 Stateless，将 Composable 内部数据通过函数参数传入，将响应事件也作为函数对象参数传入

状态提升的作用域最好提升到使用的 Composable 的最小共同父 Composable

### 状态持久化

remember 无法实现在 Activity 等重建或跨进程中缓存状态，需要使用 rememberSavable，rememberSavable 仅支持 Bundle 中的数据类型，对于类，需要添加 `@Parcelize` 注解，实现 Parcelable 接口

> 使用 `@Parcelize` 注解需要添加 gradle 插件 `kotlin-parcelize`，`@Parcelize` 自动添加了一套 Parcelable 接口的实现

对于需要自定义序列化时，可定义 Saver 实现序列化和反序列化，在调用 rememberSavable 时传入自定义 Saver

自定义 Saver 实现 Saver 接口

``` kotlin
object PersonSaver : Saver<Person, Bundle> {
    override fun restore(value: Bundle): Person? {
        // ...
    }
    override fun SaverScope.save(value: Person): Bundle? {
        // ...
    }
}
```

Compose 提供了 MapSaver 和 ListSaver

- MapSaver：将对象转换为 `Map<String, Any>`
- ListSaver：将对象转换为 `List<Any>`

> 若只需要状态可以在因配置改变导致 Activity 等重建时保存，只需要在 AndroidManifest.xml 中设置 android:configChanges，使用 remember 即可

### 状态管理

有三种方式可以管理状态

#### Stateful

使用一个 Stateful Composable 统一存储 Stateless 的状态，适用于简单的 UI 逻辑

#### StateHolder

定义一个 StateHolder 类统一管理 Stateless 状态，定义相应的 remember 函数，在 Composable 中通过 remember 函数获取 StateHolder，适用于复杂的 UI 逻辑

#### ViewModel

将 Stateless 的状态放到 ViewModel 中进行管理，在 Composable 中可直接调用 viewModel() 获取，该函数从最近的 ViewModelStore 中获取 ViewModel 实例

ViewModel 方式可以支持 Hilt 依赖注入，适用于长期的业务逻辑

> viewModel 函数需要添加依赖
>
> `androidx.lifecycle:lifecycle-viewmodel-compose:$lifecycle_version`

#### 状态分层策略

![](https://baymaxam-1309988842.cos.ap-beijing.myqcloud.com/blog/jetpack-compose%2Fjetpack-compose-1751821894352.png)

### 状态重组

- 只有状态发生更新的 Composable 才发生重组

- Composable 会以任意顺序执行

    根据各个组件的渲染顺序执行而不是代码的顺序

- Composable 是并发执行的

    Composable 之间使用同一个变量时，会产生线程安全问题

- Composable 的执行是不可预期的

    除了重组造成 Composable 的执行外，动画中每一帧的变化也会引起 Composable 的执行，因此 Composable 的执行次数是不可预期的，应该避免在 Composable 中执行耗时操作或数据操作

- Composable 的执行是乐观的

    Composable 总是使用最新的状态完成重组，可能会丢弃中间状态

#### 重组原理

- 经过 Compose 编译器处理后的 Composable 代码在对 State 进行读取的同时，能够自动建立关联，在运行过程中当 State 变化时，Compose 会找到关联的代码块标记为 Invalid

- 在下一渲染帧到来之前，Compose 会触发重组并执行 invalid 代码块，Invalid 代码块即下一次重组的范围，能够被标记为 Invalid 的代码必须是非 inline 且无返回值的 Composable 函数或 lambda

    - inline 函数会在调用处展开，会与调用方共享重组范围

        Column 是 inline 的高阶函数，因此 Column 内部组件会在 Column 中展开，Column 内部组件重组时，Column 也处于重组范围内，也会发生重组

        若是其他非 inline 的 Composable 函数，内部组件重组时，外部不处于重组范围内

    - 由于返回值的变化会影响调用方，所以必须连同调用方一同参与重组，因此 Composable 函数不应该有返回值

#### 列表重组

Compose 视图树中每个节点 (LayoutNode) 都具有一个索引，当发生重组时，根据索引在 SlotTable 中查找，若节点不存在则创建节点，节点存在则更新等

**节点的比较依赖于编译期建立的索引，在运行时进行比较会发生错误**，编译期索引由代码编写的位置决定

对于列表数据，其数据项在运行时确定，无法在编译时确定数据项，因此需要为每个数据项手动建立索引

若不手动建立索引，当在 list[0] 添加数据时，新数据会与 [0] 上的原数据进行比较，从而导致整个列表进行节点更新，手动建立索引后，重组时只会对新数据创建节点

``` kotlin
Column {
    for (e in list) {
        key(e.id) {
            MovieItem(e)
        }
    }
}
```

### Composition 生命周期

Compose 视图树称为 Composition

生命周期

- onActive：Composable 首次执行，创建 Composition
- onUpdate：Composable 由于重组不断执行，更新 Composition 节点
- onDispose：Composable 不再执行，Composition 节点销毁

### Composable 副作用

Composable 中影响外界的操作称为副作用，Compose 提供了一系列副作用 API，保证这些操作在特定的阶段执行

- DisposableEffect：可以感知 Composable 的 onActive 和 onDispose

    ``` kotlin
    DisposableEffect(key) {
        // 当key改变(onUpdate)或onActive时执行这部分代码
        // 当key为常量时，只在onActive执行一次
        onDispose {
            // 当Composable进入onDispose时执行
        }
    }
    ```

- SideEffect：在每次重组**成功**时执行

- LaunchedEffect：在副作用中执行异步操作

    当 Composable 进行 onActive 时，LaunchedEffect 中开启一个协程，同时也可以为该副作用指定 key，当 key 改变时，原协程结束，新协程开启，Composable 进入 onDiapose 时，协程自动结束

    rememberCoroutineScope：获取一个与 Composable 同生命周期的协程作用域

- rememberUpdatedState

    每次状态改变会发生重组，导致副作用也进行重组，如 LaunchedEffect 会开启一个新协程

    若副作用的重组开销大，则应该使副作用在多次重组之间持续存在，当副作用内部引用了 Composable 中保存的状态时 (状态使用 remember 保存)，状态改变只会使得 Composable 重组，但同时副作用内部无法获取状态的最新值，即无法使副作用内部响应

    此时应该使用 rememberUpdatedState 来保存状态，当状态改变时，Composable 重组，同时通知副作用内部

- snapshotFlow：在副作用内部使用 FLow 处理 State，同时使持续存在的副作用内部可以实时感知 State 的变化

> Best Practice：当副作用依赖的状态频繁变化时，应该使用状态对象本身作为副作用的 Key，而在副作用内部使用 snapshotFlow 感知状态值的变化
