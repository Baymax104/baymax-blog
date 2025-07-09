---
title: requests库基础
categories: [Python, 爬虫]
tags: [requests, Python, 爬虫]
date: 2024-05-29 22:53
updated: 2025-07-07 01:55
---
## 开始

requests 库是 Python 中常用的 HTTP 请求库

安装 requests

```shell
pip install requests
```

## 发送请求

requests 中支持多种 HTTP 的请求方法

```python
response = requests.get('https://api.github.com/events')  # get方法
response = requests.post('http://httpbin.org/post', data = {'key':'value'})  # post方法
response = requests.put('http://httpbin.org/put', data = {'key':'value'})  # put方法
response = requests.delete('http://httpbin.org/delete')  # delete方法
response = requests.head('http://httpbin.org/get')  # head方法
response = requests.options('http://httpbin.org/get')  # options方法
```

## 获取响应

requests 请求方法返回一个 `Response` 对象，通过该对象获取响应

| 常用属性/方法        | 描述                                                     |
| -------------------- | -------------------------------------------------------- |
| `text` | 响应文本内容 |
| `content` | 响应内容的二进制形式 |
| `status_code` | 响应状态码 |
| `headers` | 响应头字典 |
| `encoding` | 响应的编码方式，响应头的 `Content-Type` 字段 |
| `cookies` | 响应中包含的 cookie 字典 |
| `reason` | 响应状态码相对应的描述文本 |
| `url` | 最终响应的 url |
| `raw` | 响应的原始 `HTTPResponse` 对象 |
| `history` | 当前请求的响应历史（重定向） |
| `elapsed` | 从发送请求到响应到达的时间 |
| `request` | 响应的请求对象 |
| `json()` | 若响应中的内容是 json 字符串时，将 json 字符串解码为字典类型 |
| `raise_for_status()` | 当状态码为 4XX 或 5XX 时，该方法抛出异常 |

## 请求设置

### 设置请求头

在请求方法的 `headers` 参数传入一个字典，字典中可以设置请求头字段

```python
url = 'https://api.github.com/some/endpoint'
headers = {'user-agent': 'my-app/0.0.1'}
response = requests.get(url, headers=headers)
```

### 参数传递

对于 get 请求，在 get 方法的 `params` 参数传入一个字典，可以传递 url 参数

```python
payload = {'key1': 'value1', 'key2': 'value2'}
response = requests.get('http://httpbin.org/get', params=payload)
# http://httpbin.org/get?key2=value2&key1=value1
```

对于 post 请求，在 post 方法的 `data` 参数传入一个字典，可以传递表单数据

```python
payload = {'key1': 'value1', 'key2': 'value2'}
response = requests.post("http://httpbin.org/post", data=payload)
```

`data` 参数可以接收一个 json 格式的字符串，自动解码为字典，或 `json` 参数可以接收一个字典，自动编码为 json 字符串

```python
import json
url = 'https://api.github.com/some/endpoint'
payload = {'some': 'data'}
r = requests.post(url, data=json.dumps(payload))
r = requests.post(url, json=payload)
```

通过 `files` 参数上传文件

```python
url = 'http://www.example.com/upload'
headers = {'Content-Type': 'multipart/form-data'}
files = {'file': open('example.txt', 'rb')}  # 设置文件数据

response = requests.post(url, files=files, headers=headers)
```

## Cookie

在请求方法的 `cookies` 参数中传入一个字典即可在请求中包含 cookie

```python
url = 'http://httpbin.org/cookies'
cookies = dict(cookies_are='working')
r = requests.get(url, cookies=cookies)
```

`cookies` 参数还可以传入一个 `RequestsCookieJar` 对象，类似一个字典，但包含更多接口

```python
jar = requests.cookies.RequestsCookieJar()
jar.set('tasty_cookie', 'yum', domain='httpbin.org', path='/cookies')
jar.set('gross_cookie', 'blech', domain='httpbin.org', path='/elsewhere')
url = 'http://httpbin.org/cookies'
r = requests.get(url, cookies=jar)
```

通过 response 对象的 `cookies` 属性可以获取响应中的 cookie，`cookies` 属性返回一个字典

```python
url = 'http://example.com/some/cookie/setting/url'
r = requests.get(url)
r.cookies['example_cookie_name']
```

## 超时

在请求方法中设置 `timeout` 参数来设置超时时间，当请求超时，不再等待响应，抛出 `Timeout` 异常

```python
requests.get('http://github.com', timeout=0.001)
```

## 其他异常

requests 中抛出以下常见异常

- 遇到网络问题（如：DNS 查询失败、拒绝连接等）时，requests 会抛出一个 `ConnectionError` 异常
- 如果 HTTP 请求返回了不成功的状态码，`raise_for_status()` 会抛出一个 `HTTPError` 异常
- 若请求超时，则抛出一个 `Timeout` 异常
- 若请求超过了设定的最大重定向次数，则会抛出一个 `TooManyRedirects` 异常
