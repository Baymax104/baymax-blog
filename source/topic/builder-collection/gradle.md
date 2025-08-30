---
title: Gradle
categories: [开发相关]
tags: [Gradle]
date: 2025-08-30 18:58
updated: 2025-08-30 18:58
topic: builder-collection
---
## 开始

### 项目目录

Gradle 目录结构

```
.                              # 项目根目录
├── build                      # 构建输出目录，包含编译后的class文件、打包的jar/war等
├── gradle                     # Gradle构建工具相关文件目录
│   └── wrapper                # Gradle Wrapper相关文件，用于统一项目使用的Gradle版本
│       ├── gradle-wrapper.jar # Gradle Wrapper可执行jar文件
│       └── gradle-wrapper.properties # Gradle Wrapper配置文件，指定Gradle版本和下载地址
├── src
│   ├── main
│   │   ├── java
│   │   ├── resources
│   │   └── webapp
│   │       ├── WEB-INF
│   │       │   └── web.xml
│   │       └── index.jsp
│   └── test
│       ├── java
│       └── resources
├── gradlew                    # Linux/Mac系统下的Gradle执行脚本
├── gradlew.bat                # Windows系统下的Gradle执行脚本
├── build.gradle               # 项目构建脚本，配置项目依赖、插件等
└── settings.gradle            # Gradle项目设置文件，配置项目名称、包含的模块等
```

**settings.gradle**

位于根工程目录下

- `rootProject.name`：指定根工程名称
    
- `include`：指定引入的子模块，使用 `:` 表示路径中的 `.`，`:` 开头表示相对于根工程

**gradle.properties**

配置当前项目的全局配置

- `org.gradle.jvmargs`：配置 jvm 参数
    
- `org.gradle.daemon`：开启守护进程
    
- `org.gradle.configureondemand`：开启按需加载
    
- `org.gradle.parallel`：开启并行编译
    
- `org.gradle.caching`：开启 gradle 缓存

**build.gradle**

`build.gradle` 文件是 gradle 的构建脚本

每个 project 都有一个 `build.gradle` 文件，本质是调用相应的方法设置 Project 对象的属性

组成部分

- buildscript：定义构建时需要的设置，插件的仓库是 buildscript 中的 repositories，通常放在文件开头
    
- repositories：定义当前 project 的仓库
    
- plugins：定义构建时需要的插件，插件的仓库是外部的 repositories
    
- android：Android 的特定配置
    
- denpendencies：定义项目需要的依赖
    
- sourceSets：定义项目的源代码目录和资源文件目录
    
- task：定义任务

对不同层级的 project 进行设置

- allprojects：对所有 project 进行设置
    
- subprojects：对直接子 project 进行设置，不包括当前 project
    
- rootProject：对根 project 进行设置
    
- parent：对当前 project 的父 project 进行设置
    
- gradle：对 gradle 本身进行设置
    
- project：对指定的子 project 进行设置

    ```groovy
    project(':subproject') {  
        // statement  
    }
    ```

### 常用指令

- `gradle clean`：清除 build 目录
    
- `gradle classes`：编译项目
    
- `gradle test`：测试项目
    
- `gradle build`：构建项目

### 修改下载源

修改 `/gradle/wrapper/gradle_wrapper.properties` 中的 distributionUrl 可设置下载源

`https://mirrors.cloud.tencent.com/gradle/`

`distributionPath=wrapper/dists` 中存放下载的项目配置 gradle

修改依赖下载源

在 gradle 安装目录的 init.d 目录中编写初始的 gradle 脚本，gradle 在构建时会先执行这些脚本

```
allprojects {  
    repositories {  
        maven { url "https://maven.aliyun.com/repository/public/" }  
        maven { url "https://maven.aliyun.com/repository/spring/" }  
        maven { url "https://maven.aliyun.com/repository/central/" }  
        maven { url "https://maven.aliyun.com/repository/google" }  
        maven { url "https://maven.aliyun.com/repository/gradle-plugin/" }  
        maven { url "https://maven.aliyun.com/repository/spring-plugin/" }  
        maven { url "https://maven.aliyun.com/nexus/content/groups/public/" }  
        maven { url "https://maven.aliyun.com/nexus/content/repositories/jcenter" }  
      maven { url "https://jitpack.io" }  
      jcenter { url "https://jcenter.bintray.com/" }  
      mavenCentral()  
      mavenLocal()  
      google()  
      jcenter()  
    }  
}
```

kts版本的写法如下

```kotlin
repositories {  
    maven("https://maven.aliyun.com/repository/public/")  
    maven("https://maven.aliyun.com/repository/spring/")  
    maven("https://maven.aliyun.com/repository/central/")  
    maven("https://maven.aliyun.com/repository/google")  
    maven("https://maven.aliyun.com/repository/gradle-plugin/")  
    maven("https://maven.aliyun.com/repository/spring-plugin/")  
    maven("https://maven.aliyun.com/nexus/content/groups/public/")  
    maven("https://maven.aliyun.com/nexus/content/repositories/jcenter")  
    maven("https://jitpack.io")  
    jcenter("https://jcenter.bintray.com/")  
    mavenCentral()  
    mavenLocal()  
    google()  
    jcenter()  
}
```

## Wrapper 包装器

Gradle Wrapper 是 Gradle 的一层封装，使得配置好的 gradle 可以共享

wrapper 位于 `project/gradle/wrapper/gradle-wrapper.jar`，通过 `gradle-wrapper.properties` 来配置 wrapper

wrapper 通过 gradlew、gradlew.cmd 脚本来执行 gradle 命令，此时使用的 gradle 是 wrapper 指定的 gradle 版本

## Groovy

Groovy 是基于 java 的脚本语言，可以与 java 完美融合

- 支持动态语言特性，支持函数式编程
    
- 默认作用域为 public
    
- 基本类型也是对象
    
- 支持 DSL

groovy 文件后缀为 `.groovy`，可以兼容 java 语法

### 变量与函数

groovy 可以使用 def 定义一个变量和函数，不需要声明类型

```groovy
def a = 3  
// 参数类型、返回值类型和return可以省略，默认使用最后一条表达式的结果作为返回值  
def method() {  
    // statment  
}
```

函数调用：`method(param)`，在不引起歧义时，可以省略括号，以空格分隔，`method param`

### 类与对象

当 groovy 文件中不存在脚本语句时，作为静态文件编译

当 groovy 文件中存在脚本语句时，作为脚本编译，可混合静态类型，此时不能创建与文件名同名的类

> 脚本文件本身是一个类名与文件名相同的类

对象属性操作

- 赋值
    
    - `obj.attr`
        
    - `obj.setAttr()`
        
    - 具名参数
        
        - `new Obj()`
            
        - `new Obj(attr1: value1, attr2: value2)`
            
- 获取
    
    - `obj.attr`
        
    - `obj["attr"]`
        
    - `obj.getAttr()`

### 数据类型

groovy 支持以下数据类型

- byte
- short
- int
- long
- float
- double
- char
- boolean
- string

字符串

- `'字面量'`
    
- `“字符串模板${expression}”`，expression 为单个变量时简写为 `“$value”`
    
- `'''多行字符串'''`

范围运算符：运算符 `a..b`，表示 `[a,b]`

### 闭包

与 java 的 lambda 表达式类似，groovy 闭包是 `groovy.lang.Closure` 的实例对象

定义闭包

- `{statement}`，单参数，隐式传参
    
- `{ -> statement}`，无参，显式使用 ->表明不带参数
    
- `{println(it)}`，单参数，直接使用 it 标识符
    
- `{it -> println(it)}`，显式声明单参数
    
- `{name -> println(name)}`，单参数命名
    
- `{String name, int y -> println(name)}`，参数声明类型
    
- `{name = value -> println(name)}`，参数赋默认值

闭包调用

- `closure()`
    
- `closure.call()`

当闭包作为函数的最后一个参数时，可以写在括号外面

```groovy
def method(param, closure) {  
    // statement  
}  
// 常规写法  
method(param, {statement})  
// 可将闭包写在参数外面  
method(param) {  
    statement  
}
```

## 生命周期

- Initialization

    执行 `init.gradle` 和 `settings.gradle`

    `settings.gradle` 记录了项目中的 module 和 project 信息

- Configuration

    从根工程开始执行 `build.gradle` 构建脚本，然后执行子工程的 `build.gradle`

    在执行 `build.gradle` 后，gradle 将整个项目拆分为 task，task 之间相互依赖

- Execution

    依次执行各个 task

生命周期钩子函数

![](https://cos.baymaxam.top/blog/gradle/gradle-1756554250449.png)

## 任务

定义一段执行流，在 Configuration 和 Execution 阶段执行

### 定义

task 的定义方式

- `task()`：使用 task 函数
    
- `task.create()`
    
- `task.register()`：调用 register 方法，懒加载

### 属性

- `type`：task 类型，默认为 DefaultTask

    gradle 提供了预定义的 task 类型，指定类型后可以调用类型提供的函数

- `overwrite`：是否替换存在的 task，默认值为 false
    
- `dependsOn`：指定 task 的依赖列表，默认值为 []
    
- `action`：指定任务行为
    
- `description`
    
- `group`：task 分组

### task 闭包

执行流以闭包形式传入 task 函数中

- `doFirst`：是一个函数，传入一个闭包
    
- `doLast`：同上
    
- task 中的函数调用在 Configuration 阶段执行，行为在 Execution 阶段执行
    
- 外部定义

    ```groovy
    taskName.doFirst {  
        // statement  
    }
    ```

task 添加一系列行为：task 函数中传入一个 map，value 为闭包

task 的行为都被添加到 task 中的一个 list 中，但 doFirst 总是被添加到 list 的最前面，doLast 总是被添加到 list 的最后面，可以定义多个 doFirst 和 doLast

### 任务依赖

当一个 task 依赖其他的多个 task 时，通过设置 Task 对象中的 dependsOn 属性添加依赖列表，列表中包含 task 对象的名称

```groovy
// 调用的是task(String)方法，返回一个Task对象，通过具名参数设置task的dependsOn属性  
// 具名参数被封装到Map中  
ask 'task1'(dependsOn: ['task2', 'task3']) {  
    // statement  
}
```

先依次执行依赖的任务，再执行当前任务，被重复依赖的 task 只会执行一次

### 常见任务

- `gradle build`
    
- `gradle run`：启动一个项目，需要 application 插件并设置 mainClassName
    
- `gradle clean`
    
- `gradle init`

    `--type pom`：以当前 maven 项目初始化 gradle 项目

- `gradle wrapper`：生成 gradle wrapper
    
- `gradle projects`：查看项目中的所有 module
    
- `gradle tasks`：查看已分组的 task，在 task 闭包中调用 group 函数指定分组名

    `-all`：查看所有 task

- `gradle dependencies`：查看依赖信息

## 文件操作

获取文件

- 直接获取

    通过 file 函数，传入路径直接创建 File 对象，相对路径相对于根工程目录

- 文件集合方式

    gradle 中定义一个文件集合类型 (FileCollection 接口)，本质是一个文件列表

    通过 files 函数，传入多个路径创建文件集合

- 文件树

    gradle 中定义了一个具有层级的文件集合 (FileTree 接口)

    调用 fileTree 函数，传入根目录路径创建文件树

    - include：指定包含的文件，支持 `*` 通配符
        
    - exclude：指定排除的文件，支持 `*` 通配符

    具名参数形式：fileTree(Map)

    ```groovy
    fileTree(dir: '...', includes:[])  
    fileTree(dir: '...', include: '...')
    ```

文件操作

通过设置 task 为相应的类型，调用提供的方法进行文件操作

## 依赖

gradle 中的依赖分为三种

- 本地依赖：依赖本地 jar 包，通过直接获取、文件集合、文件树方式
    
- 项目依赖：依赖其他 project
    
- 直接依赖：使用依赖信息

调用 dependenciess 函数，传入一个闭包配置依赖

其中调用 implementation 等方法，传入依赖

```groovy
dependencies {  
    // 本地依赖  
    implementation file()  
    implementation files()  
    implementation fileTree(dir: '...', includes: [])  
      
    // 项目依赖  
    // 项目必须在settings.gradle中引入  
    implementation project(":subProject")  
      
    // 直接依赖  
    // 使用具名参数  
    implementaiton group: "group", name: "module", version: "version"  
    // 具名参数简写  
    implementation "group:module:version"  
    // 自动查找最新版本  
    implementation "group:module:+"  
}
```

### 依赖的范围

类似于 maven 的 scope

- `compileOnly`：只在编译期需要，运行时不需要
    
- `runtimeOnly`：只在运行期需要，编译期不需要
    
- `implementation`：在编译时运行时都有效
    
- `testCompileOnly`：测试依赖只在编译期需要，运行时不需要
    
- `testRuntimeOnly`：类比同上
    
- `testImplementation`：类比同上
    
- `api`：由 java-library 插件提供，在编译时和运行时有效，支持依赖传递
    
- `compileOnlyApi`：由 java-library 插件提供，在编译时有效，支持依赖传递

### 依赖冲突

gradle 默认优先使用最新版本的 jar 包

在 implementation 等函数中传入一个闭包，闭包中调用相关函数进行配置

```groovy
dependencies {  
    implementation ('group:module:version') {  
        // statement  
    }  
}
```

排除依赖

调用 exclude 函数

```groovy
dependencies {  
    implementation ('group:module:version') {  
        exclude group: 'group' // 排除一个组  
        exclude module: 'module' // 排除一个模块  
        exclude group: 'group', module: 'module' // 排除指定包的指定模块  
    }  
}
```

禁止依赖传递

调用 transitive，设为 false

```groovy
dependencies {  
    implementation ('group:module:version') {  
        transitive false  
    }  
}
```

强制使用指定版本

```groovy
dependencies {  
    // 第一种写法  
    implementation 'group:module:version!!'  
      
    // 第二种写法  
    implementation ('group:module:version') {  
        version {  
            strictly "version"  
        }  
    }  
}
```

## 插件

gradle 插件分为脚本插件和对象插件

### 脚本插件

脚本插件是一个脚本文件，通过 `apply from: <filename>|<url>` 引入

插件定义在闭包内，传入 ext 函数

插件中可以定义键值对，引入后可直接使用

### 对象插件

对象插件就是实现了 `org.gradle.api.Plugin` 接口的插件，每个 gradle 插件都有一个 plugin id

对象插件分为三类

- 内部插件
    
    - plugin DSL
        
    - apply
        
        - apply(Map) 具名参数

            ```groovy
            apply plugin: 'id'|'allClassName'|'ClassName'
            ```

        - apply 闭包

            ```groovy
            apply {  
                plugin 'id'|'allClassName'|'ClassName'  
            }
            ```

- 第三方插件
    
    - plugin DSL
        
    - apply：需要引入仓库依赖，使用与上述方法相同，不需要引入版本号
        
- 自定义插件

    定义类，实现 Plugin 接口的 apply 方法，apply 方法的参数是当前项目的 Project 对象

    通过 Project 对象，可以定义任务等

自定义全局插件

buildSrc 目录：gradle 的默认插件目录，自动将其中的代码编译为插件

1. 创建 buildSrc 模块，不需要在 `settings.gradle` 中引入
    
2. 修改 `build.gradle`

    ```groovy
    apply plugin: 'groovy'  
    apply plugin: 'maven-publish'  
      
    dependencies {  
        implementation gradleApi()  
        implementation localGroovy()  
    }  
      
    repositories {  
        mavenCentral()  
    }  
      
    sourceSets {  
        main {  
            groovy {  
                srcDir 'src/main/groovy'  
            }  
        }  
    }
    ```

3. 在 `main/groovy` 中创建 groovy 脚本，编写自定义插件 MyPlugin 类
    
4. 在 main 文件夹中创建 `main/resources/META-INF/gradle-plugins`，创建 `<plugin-id>.properties`
    
5. properties 中写入 `implementation-class=<MyPlugin.allClassName>`
    
