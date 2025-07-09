---
title: Android基础——Activity
categories: [Android]
tags: [Android]
date: 2024-04-18 03:03
updated: 2025-07-06 15:35
topic: android
banner: /images/android.jpg
---
## 开始

Activity 是四大组件之一，是一个包含用户界面的组件，用于和用户进行交互

一个程序可以存在多个 Activity，每个 Activity 必须重写 `onCreate` 方法，在 `onCreate` 方法中设置布局文件，`setContentView(R.layout.l)`

Activity 需要在 `AndroidManifest.xml` 中注册才能生效

在 AndroidManifest 中在 activity 标签中注册，`android:name` 属性指明注册的 Activity

activity 标签中的 `intent-filter` 标签中指定该标签为主 Activity

```xml
<intent-filter>
	<action android:name="android.intent.action.MAIN"/>
    <category android:name="android.intent.category.LAUNCHER"/>
</intent-filter>
```

Activity 销毁：销毁 Activity 表示退出当前界面，调用 `finish()` 销毁当前 Activity

## Activity 交互

Intent 是各个组件交互的方式，通过 Intent 在不同 Activity 间进行跳转，它指明了改组件想要执行的动作或者在组件间传递数据

> 注意多个 Activity 都需要在 AndroidManifest 中进行注册

### 显式 Intent

通过构造函数构造一个 Intent 对象，传入启动 Activity 的上下文和想要启动的目标 `Activity.class`，在调用 `startActivity(intent)` 启动 Activity

```java
Intent intent = new Intent(context, Activity.class);
context.startActivity(intent);
```

### 隐式 Intent

在 `AndroidManifest.xml` 指定 `action` 和 `category` 等信息，由系统去分析信息，启动能够响应这些信息的 Activity，通过隐式 Intent 可以也启动其他程序的 Activity

基本步骤

- 通过 intent-filter 标签下的 action 和 category 标签指定信息

    ```xml
    <!--设置Activity能够响应的action和category-->
    <activity android:name=".Activity">
    	<intent-filter>
    		<action android:name="com.example.activitytest.ACTION_START"/>
            <category android:name="android.intent.category.DEFAULT"/>
        </intent-filter>
    </activity>
    ```

- 构造 Intent 对象时传入相应的信息字符串，即可启动相应的 Activity

    ```java
    Intent intent = new Intent("com.example.activitytest.ACTION_START");
    context.startActivity(intent);
    ```

- 每个 Intent 对象只能指定一个 action 信息，但可以指定多个 category 信息，通过 `addCategory()` 添加

data 标签：在 `intent-filter` 标签中设置 data 标签，可以指明该 Activity 可以响应什么类型的数据

data 标签属性

- scheme: 指定协议部分，https 协议，geo 地理位置，tel 拨打电话
- host: 指定数据的主机名
- port: 指定数据的端口
- path: 指定数据域名后的路径
- mimeType: 指定可以处理的数据类型

启动系统浏览器

```java
Intent intent = new Intent();
intent.setAction("android.intent.action.VIEW");
Uri url = Uri.parse("https://www.baidu.com/");
intent.setData(url);
startActivity(intent);
```

### 启动 Activity 的最佳实践

当启动一个 Activity 时，可能需要向 Activity 传递参数，但可能并不知道参数是什么

在该 Activity 中定义一个静态方法 `actionStart()`，传入启动该 Activity 的上下文和需要的参数，在该方法中构造 Intent 对象完成数据传递，同时简化了启动代码

```java
public static void actionStart(Context context,String data1,String data2){
	Intent intent = new Intent(context,SecondActivity.class);
	intent.putExtra("param1","data1");
	intent.putExtra("param2","data2");
	context.startActivity(intent);
}

// 使用时，参数直接在参数列表中体现
SecondActivity.actionStart(FirstActivity.this,"data1","data2");
```

### 向 Activity 传递数据

将数据存储在 Intent 中，在下一个 Activity 中将数据中 Intent 中取出

调用 `Intent.putExtra(key, value)` 将数据存储到 Intent 中，采用键值对存储

在下一个 Activity 中调用 `getIntent()` 获取 Intent 对象

调用 `intent.getStringExtra(key)` 获取 value，根据 value 的类型来调用 getStringExtra()、getIntExtra() 等

### 返回数据给 Activity

> `startActivityForResult` 方法已弃用，仅记录最新方法

在新版 Android 中，将两个 Activity 的数据交互作了对象封装，使用一个 `ActivityResultLauncher` 对象封装返回数据的回调操作，同时通过它来启动 Activity

```java
// 调用registerForActivityResult注册一个launcher
// 传入Activity返回结果的协定，即StartActivityForResult
// 传入返回数据回调
ActivityResultLauncher<Intent> intentActivityResultLauncher = registerForActivityResult(
        new ActivityResultContracts.StartActivityForResult(),
        result -> {
            if (result.getResultCode() == RESULT_OK) {
                //获取返回的结果
                String data = result.getData().getStringExtra("data");
            }
        });
 
// 通过launcher启动Activity
Intent intent = new Intent(context, Activity.class);
intent.putExtra("data", "xxx");
intentActivityResultLauncher.launch(intent);
```

### Activity 的生命周期

Activity 的层叠结构为栈

Activity 的四种状态

- 运行状态：当前正在操作的 Activity 处于运行状态
- 暂停状态：Activity 不再处于栈顶，但仍然可见 (栈顶 Activity 大小没有占满屏幕)
- 停止状态：Activity 不处于栈顶也不可见
- 销毁状态：Activity 从栈移除后处于销毁状态，系统会回收该 Activity

Activity 的状态缓存：Activity 被回收后重建，保存输入的临时数据

Activity 在被回收前会调用 `onSaveInstanceState()` 方法，可以重写该方法添加自定义的临时数据，以便在 Activity 重建时，通过 `onCreate` 的 bundle 参数获取临时数据

`onSaveInstanceState()` 方法传入一个 Bundle 类型的参数，其中包含了当前 Activity 的临时数据，调用 `putString()`、`putInt()` 等方法通过键值对保存数据

在 `OnCreate()` 中判断 Bundle 参数是否为 null，调用 `getString()`、`getInt()` 等方法获取保存的数据

```java
public class MainActivity extends AppCompatActivity {
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        setContentView(R.layout.activity_main);
        String myString = "";
        // 获取状态缓存
        if (savedInstanceState != null) {
            myString = savedInstanceState.getString("MyString");
        }
    }
    
    @Override
    public void onSaveInstanceState(Bundle savedInstanceState) {
        // 缓存状态
        savedInstanceState.putString("MyString", "Welcome back to Android");
        super.onSaveInstanceState(savedInstanceState);
    }
}
```

> 在手机屏幕旋转时会重新创建 Activity，调用 onCreate()，可以使用 `onSaveInstanceState()` 保存临时数据或通过 ViewModel 保存

### Activity 的启动模式

Activity 的启动模式有四种：standard, singleTop, singleTask, singleInstance，通过 activity 标签的 launchMode 属性指定启动模式

- standard：在 Activity 处于栈顶时依然会创建该 Activity 的新的实例
- singleTop：在 Activity 处于栈顶时不会重复创建实例，直接使用栈顶 Activity，处于其他位置时会重复创建
- singleTask：当启动某个 Activity 时会检查整个栈，若已存在相同实例，则直接使用该实例并将在其之上的其他实例出栈，使其成为栈顶，若没有，则创建新的实例
- singleInstance：使用一个新的栈来管理启动的 Activity，该返回栈独立于当前程序的返回栈，当其他程序访问该 Activity 时，会共用这个返回栈，当程序处理返回栈时，优先处理程序本身的返回栈，最后处理独立的返回栈

## Activity 相关工具

### Toast 弹出提示

调用 Toast 的静态方法 makeText，返回一个 Toast 对象，再调用 show() 显示提示

```java
Toast.makeText(this, "Tip", Toast.LENGTH_SHORT).show();
```

makeText() 传入三个参数

- Toast 所处的上下文，传入 this 即可
- Toast 显示的内容
- Toast 显示的时长，可选 `Toast.LENGTH_SHORT`,`Toast.LENGTH_LONG`

### Log 日志工具

使用 Log 类进行日志记录

打印日志方法

- `Log.v()`：对应级别 verbose，打印级别最低的日志
- `Log.d()`：对应级别 debug，打印调试信息
- `Log.i()`：对应级别 info，打印一般信息
- `Log.w()`：对应级别 warn，打印警告信息
- `Log.e()`：对应级别 error，打印错误信息

方法传入两个参数，tag 和 msg，tag 用于对日志信息进行过滤，msg 为打印的日志内容

添加自定义过滤器，tag 参数输入过滤器的日志标签，可打印对应标签的的日志

## Fragment

Fragment 是一种可以嵌入在 Activity 中的 UI 片段，可以充分利用大屏幕空间，用于在一个 Activity 中显示不同布局，当切换布局时只需引入 fragment

静态添加 Fragment

- 编写 Fragment 的布局
- 自定义 Fragment 类继承 AndroidX 的 Fragment 类
- 重写 onCreateView，动态加载 Fragment 的布局
- 在 Activity 布局中添加 fragment 控件，name 属性指定要在该控件处实例化的 Fragment 类

动态添加 Fragment

- 在 Activity 布局中添加一个布局容器，不添加内容
- 创建要添加的 Fragment 实例
- 调用 `getSupportFragmentManager()` 获取 `FragmentManager` 对象
- 开启一个事务，调用 `manger.beginTransaction()`，返回一个 `FragmentTransaction` 对象
- 调用 `transaction.replace()`，传入布局容器的 id 和要添加的 Fragment 实例
- 若要返回时不退出 Activity 而返回上一个 Fragment，调用 `transaction.addToBackStack(null)`
- 调用 `transaction.commit()` 提交事务

### Fragment 与 Activity 交互

-   Activity 中调用 Fragment

    使用 FragmentManager 中的 findFragmentById(R.id.frag) 获取该布局的 Fragment 类实例

-   Fragment 中调用 Activity

    调用 getActivity() 获取与该类实例相关联的 Activity，Activity 是 Context 类型，可供 Fragment 使用

Fragment 的生命周期与 Activity 类似，被回收时也可通过 onSaveInstanceState() 保存数据

### 动态加载布局

根据设备的不同属性来自动选择资源中的布局

资源中的子文件夹命名使用限定符可以指定该资源提供给哪一类设备

屏幕特征对应的设备

- 大小
    - small：小设备
    - normal：中等设备
    - latge：大设备
    - xlarge：超大设备
- 分辨率
    - ldpi：低分辨率
    - mdpi：中分辨率
    - hdpi：高分辨率
    - xhdpi：超高分辨率
    - xxhdpi：超超高分辨率
- 方向
    - land：横屏
    - port：竖屏

最小宽度限定符：对屏幕宽度设定一个最小值 (单位 dp)，大于该值加载一个布局，小于该值加载另一个布局

文件夹命名后缀：\_sw600dp，最小宽度为 600dp
