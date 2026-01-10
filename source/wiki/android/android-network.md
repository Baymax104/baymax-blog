---
title: 网络编程
categories: [Android]
tags: [Android]
date: 2025-07-05 21:44
updated: 2026-01-10 21:19
wiki: android
banner: /assets/banner/android.jpg
---

Android 开发中网络编程是实现应用与服务端数据交互的核心能力，随着 Android 生态的发展，网络请求方式从早期的 HttpURLConnection 逐步演进到 OkHttp，再到封装性更强的 Retrofit，数据解析也从 XML 为主转向 JSON 为主

**Android 规定主线程（UI 线程）不能执行耗时操作（网络请求属于耗时操作），否则会触发 `ANR`（应用无响应），因此网络请求需在子线程执行，同时需解决子线程与主线程的通信问题**

## WebView

WebView 是 Android 中用于在应用内展示网页内容的核心控件，相比跳转系统浏览器，使用 WebView 能更好地保持应用体验的一致性。

- 获取 WebView 控件实例后，通过 `setSettings()` 方法配置核心属性：
    
    - `setJavaScriptEnabled(true)`：开启 JavaScript 脚本支持（需注意 Android 11+ 中该配置的安全性限制）
        
    - `setWebViewClient(new WebViewClient())`：让网页在当前 WebView 中加载，而非跳转系统浏览器
        
- 网络权限声明：使用 WebView 访问网络需在 `AndroidManifest.xml` 中添加权限：

    ```XML
    <uses-permission android:name="android.permission.INTERNET" />
    ```

基本示例如下

```xml
<?xml version="1.0" encoding="utf-8"?>
<WebView
    xmlns:android="http://schemas.android.com/apk/res/android"
    android:id="@+id/webView"
    android:layout_width="match_parent"
    android:layout_height="match_parent" />
```

```kotlin
import android.os.Bundle
import android.webkit.WebSettings
import android.webkit.WebView
import android.webkit.WebViewClient
import androidx.appcompat.app.AppCompatActivity

class WebViewActivity : AppCompatActivity() {
    private lateinit var webView: WebView

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        setContentView(R.layout.activity_webview)
        webView = findViewById(R.id.webView)
        initWebView()
        webView.loadUrl("https://github.com") // 加载github.com
    }

    // 核心配置，仅保留必要项
    private fun initWebView() {
        val webSettings = webView.settings
        webSettings.javaScriptEnabled = true // 开启JS以正常渲染github
        // 拦截URL，在应用内加载github
        webView.webViewClient = WebViewClient()
    }

    // 适配返回键，网页可后退时不退出Activity
    override fun onBackPressed() {
        if (webView.canGoBack()) webView.goBack() else super.onBackPressed()
    }

    // 销毁清理，避免内存泄漏
    override fun onDestroy() {
        webView.destroy()
        super.onDestroy()
    }
}
```

## HttpURLConnection

`HttpURLConnection` 是 Android 原生的网络请求 API，虽功能基础但无需依赖第三方库，是理解网络请求原理的基础，该方式现已逐步被 OkHttp 替代

```kotlin
import java.net.HttpURLConnection
import java.net.URL
import java.io.BufferedReader
import java.io.InputStreamReader

// GET请求示例
fun sendGetRequest(urlString: String) {
    Thread { // 网络请求必须在子线程
        var connection: HttpURLConnection? = null
        try {
            val url = URL(urlString)
            // 1. 创建连接实例
            connection = url.openConnection() as HttpURLConnection
            // 2. 配置请求属性
            connection.requestMethod = "GET"
            connection.connectTimeout = 5000 // 连接超时5秒
            connection.readTimeout = 5000    // 读取超时5秒

            // 3. 获取响应输入流并读取数据
            if (connection.responseCode == HttpURLConnection.HTTP_OK) {
                val inputStream = connection.inputStream
                val reader = BufferedReader(InputStreamReader(inputStream))
                val response = StringBuilder()
                var line: String?
                while (reader.readLine().also { line = it } != null) {
                    response.append(line)
                }
                reader.close()
                inputStream.close()
                // 处理响应数据（需切换主线程更新UI）
                val result = response.toString()
            }
        } catch (e: Exception) {
            e.printStackTrace()
        } finally {
            // 5. 关闭连接
            connection?.disconnect()
        }
    }.start()
}
```

## OkHttp

OkHttp 是 Square 公司开发的轻量级网络框架，解决了 `HttpURLConnection` 的诸多痛点（如连接池、自动重试、拦截器等），是当前 Android 网络请求的基础组件

```kotlin
import okhttp3.*
import java.io.IOException

// 异步GET请求（核心逻辑，去除单例，聚焦请求本身）
fun getRequest(url: String) {
    val client = OkHttpClient()
    val request = Request.Builder()
        .url(url)
        .build()
    
    client.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: IOException) { e.printStackTrace() }
        override fun onResponse(call: Call, response: Response) {
            val result = response.body?.string() // 获取响应数据
            // 需切换主线程更新UI（示例省略切换逻辑）
        }
    })
}

// POST请求（核心逻辑，FormBody传参）
fun postRequest(url: String) {
    val client = OkHttpClient()
    // 构造POST请求体
    val requestBody = FormBody.Builder()
        .add("key1", "value1")
        .add("key2", "value2")
        .build()
    
    val request = Request.Builder()
        .url(url)
        .post(requestBody)
        .build()
    
    client.newCall(request).enqueue(object : Callback {
        override fun onFailure(call: Call, e: IOException) { e.printStackTrace() }
        override fun onResponse(call: Call, response: Response) {
            val result = response.body?.string()
        }
    })
}
```

## JSON 解析

### JSONObject

通过 `JSONObject` 的 `getString()`、`getInt()` 等方法手动解析 JSON 字符串，适合简单结构的 JSON 数据

```kotlin
import org.json.JSONObject

fun parseJsonWithJSONObject(jsonStr: String) {
    // 1. 构造JSONObject实例
    val jsonObject = JSONObject(jsonStr)
    // 2. 按需获取对应类型字段
    val id = jsonObject.getInt("id")
    val name = jsonObject.getString("name")
    val type = jsonObject.getString("type")
    val isFree = jsonObject.getBoolean("isFree")
    val readCount = jsonObject.getInt("readCount")
    // 3. 处理解析后的数据
    val result = "ID：$id，名称：$name，类型：$type，是否免费：$isFree，阅读量：$readCount"
}
```

### GSON

Google 推出的 JSON 解析库，通过 `gson.fromJson(jsonStr, TargetClass.class)` 可自动将 JSON 字符串解析为指定实体类对象，支持复杂嵌套结构

```kotlin
import com.google.gson.Gson

data class Course(
    val id: Int,
    val name: String,
    val type: String,
    val isFree: Boolean,
    val readCount: Int
)

fun parseJsonWithGson(jsonStr: String) {
    val gson = Gson()
    val course = gson.fromJson(jsonStr, Course::class.java)
    // 直接使用解析后的实体类字段
    val result = "课程：${course.name}，阅读量：${course.readCount}"
}
```

## Retrofit

Retrofit 是基于 OkHttp 的封装型网络框架，通过注解化配置简化接口定义，支持多种数据解析器和适配器，是当前 Android 网络开发的首选方案

**接口定义**

Retrofit 使用注解配置接口定义

- GET
    - 路径参数：注解中使用 `{page}` 占位符，方法参数添加 `@Path("page")` 注解
    
    - 查询参数：方法参数添加 `@Query("key")` 注解，自动拼接在 URL 的 `?` 后

    ```kotlin
    data class ArticleResponse(
        val code: Int,
        val msg: String,
        val data: List<Article>
    )

    data class Article(
        val id: Int,
        val title: String,
        val content: String
    )

    interface ApiService {
        // 路径参数：@Path("page") 对应URL中的{page}
        // 查询参数：@Query("size") 对应URL中的?size=xxx
        @GET("article/list/{page}")
        suspend fun getArticleList(
            @Path("page") page: Int,  // 动态路径参数（页数）
            @Query("size") pageSize: Int,  // 动态查询参数（每页条数）
            @Query("category") categoryId: Int? = null  // 可选查询参数
        ): Response<ArticleResponse>
    }
    ```

- POST 请求
    使用 `@POST` 注解，方法参数添加 `@Body` 注解，传入实体类对象，对象会被自动序列化为 JSON 请求体

    ```kotlin
    data class User(
        val username: String,
        val password: String,
        val age: Int
    )

    data class BaseResponse(
        val code: Int,
        val msg: String,
        val data: String?
    )

    interface ApiService {
        // @POST指定请求路径，@Body传入实体类（自动序列化为JSON）
        @POST("user/register")
        suspend fun registerUser(@Body user: User): Response<BaseResponse>
    }
    ```

**基本用法**

```kotlin
import com.google.gson.annotations.SerializedName
import retrofit2.Response
import retrofit2.Retrofit
import retrofit2.converter.gson.GsonConverterFactory
import retrofit2.adapter.rxjava3.RxJava3CallAdapterFactory
import retrofit2.http.GET
import retrofit2.http.Path
import retrofit2.http.Query
import kotlinx.coroutines.runBlocking

data class Article(
    val id: Int,
    val title: String
)
data class ArticleResponse(
    val code: Int,
    @SerializedName("data") val articleList: List<Article>
)

interface ApiService {
    @GET("article/list/{page}")
    suspend fun getArticleList(
        @Path("page") page: Int,
        @Query("size") pageSize: Int
    ): Response<ArticleResponse>
}

fun main() = runBlocking {
    val retrofit = Retrofit.Builder()
        .baseUrl("https://api.example.com/") // 根路径（必须以/结尾）
        .addConverterFactory(GsonConverterFactory.create()) // Gson解析
        .addCallAdapterFactory(RxJava3CallAdapterFactory.create()) // 协程支持
        .build()

    // 获取接口代理对象
    val apiService = retrofit.create(ApiService::class.java)

    // 发起请求并处理响应
    val response = apiService.getArticleList(page = 1, pageSize = 10)
    if (response.isSuccessful) {
        val articles = response.body()?.articleList // 解析数据
    }
}
```
