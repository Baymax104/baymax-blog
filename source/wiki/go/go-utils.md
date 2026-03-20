---
title: 常用库
categories: [Go, Golang]
tags: [Go, Golang]
date: 2026-01-16 01:54
updated: 2026-01-16 02:32
wiki: go
---
## 字符串

go 默认使用 UTF-8 编码的字符串，类型为 string，值类型且不可变，本质是字节的定长数组，零值为空字符串 `""`

双引号字符串中的 `\n`、`\t` 等转义字符会被转义，反引号字符串中的转义字符不会被转义

基础操作：

- 比较：`==`/`!=`/`<` 等运算符按字节比较
    
- 长度：`len(str)` 获取字节长度
    
- 索引：`str[i]` 获取单个字节（仅对纯 ASCII 有效），禁止取字节地址（`&str[i]` 非法）
    
- 拼接：`+` 号拼接（行尾需保留 `+` 避免编译器补分号），`+=` 为简写，循环拼接推荐使用 `strings.Join()` 或 `bytes.Buffer`

strings 包封装了字符串处理的核心函数

| 函数签名                                          | 功能说明                          |
| --------------------------------------------- | ----------------------------- |
| `HasPrefix(s, prefix string) bool`            | 判断字符串 s 是否以 prefix 开头             |
| `HasSuffix(s, suffix string) bool`            | 判断字符串 s 是否以 suffix 结尾             |
| `Contains(s, substr string) bool`             | 判断字符串 s 是否包含子串 substr            |
| `Index(s, str string) int`                    | 返回 str 在 s 中首次出现的索引，不存在则返回 -1      |
| `LastIndex(s, str string) int`                | 返回 str 在 s 中最后出现的索引，不存在则返回 -1      |
| `IndexRune(s string, r rune) int`             | 定位非 ASCII 字符，参数支持 rune 或 int 类型     |
| `Replace(str, old, new string, n int) string` | 将 str 中前 n 个 old 子串替换为 new，n=-1 时替换所有 |
| `Count(s, str string) int`                    | 计算 str 在 s 中非重叠出现的次数              |
| `Repeat(s, count int) string`                 | 重复 count 次字符串 s，返回新字符串           |
| `ToLower(s string) string`                    | 将字符串 s 中所有字符转为小写                |
| `ToUpper(s string) string`                    | 将字符串 s 中所有字符转为大写                |
| `TrimSpace(s string) string`                  | 剔除字符串 s 首尾的空白符号                 |
| `Trim(s, cut string) string`                  | 剔除字符串 s 首尾的指定字符（cut 字符集）         |
| `TrimLeft(s, cut string) string`              | 仅剔除字符串 s 开头的指定字符（cut 字符集）        |
| `TrimRight(s, cut string) string`             | 仅剔除字符串 s 结尾的指定字符（cut 字符集）        |
| `Fields(s string) []string`                   | 以 1 个及以上空白为分隔符分割 s，返回字符串切片       |
| `Split(s, sep string) []string`               | 以自定义分隔符 sep 分割 s，返回字符串切片         |
| `Join(sl []string, sep string) string`        | 用分隔符 sep 拼接字符串切片 sl，返回新字符串       |

strconv 包实现字符串与数字的双向转换

| 函数签名                                                             | 功能说明                                                                 |
| ---------------------------------------------------------------- | -------------------------------------------------------------------- |
| `Itoa(i int) string`                                             | 将 int 类型数字转为十进制字符串                                                     |
| `FormatFloat(f float64, fmt byte, prec int, bitSize int) string` | 将 float64 类型数字转为字符串，fmt 指定格式（b/e/f/g），prec 表示精度，bitSize 区分 float32/float64 |
| `Atoi(s string) (i int, err error)`                              | 将字符串转为 int 类型，返回转换结果及可能出现的错误                                           |
| `ParseFloat(s string, bitSize int) (f float64, err error)`       | 将字符串转为 float64 类型，返回转换结果及可能出现的错误，bitSize 区分 float32/float64              |

## 时间与日期

time 包中提供了时间与日期的函数，其中提供了一个数据类型 `time.Time`，可以作为一个值类型使用

|函数签名|功能说明|
|---|---|
|`time.Now() time.Time`|获取当前系统的本地时间，返回 `time.Time` 类型的时间实例|
|`(t time.Time) UTC() time.Time`|将 `time.Time` 类型的时间 `t` 转换为 UTC 时区的时间，返回新的时间实例|
|`(t time.Time) Add(d time.Duration) time.Time`|为时间 `t` 叠加一个时长 `d`（单位为纳秒），返回叠加后的新时间实例|
|`(t time.Time) Format(layout string) string`|按照指定的格式字符串 `layout` 格式化时间 `t`，返回格式化后的字符串|
|`(t time.Time) Day() int`|获取时间 `t` 对应的「当月日期」（取值范围 1-31），返回整数|
|`(t time.Time) Month() time.Month`|获取时间 `t` 对应的「月份」，返回 `time.Month` 类型（底层为 int，1-12）|
|`(t time.Time) Year() int`|获取时间 `t` 对应的「年份」（4 位数字，如 2011），返回整数|
