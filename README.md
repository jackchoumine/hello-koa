# koa 学习

## context 上下文对象

koa 将 node 的`Request`和`Response`对象封装到`Context`中，Context 是一次会话的上下文，通过加工这个对象，可控制返回给用户
的内容，代码中常写作`ctx`。

ctx 提供了常用别名，方便快速操作原生的属性。

常用的属性和方法：

> 获取请求 `ctx.request` -- 是 node request 的抽象

get 参数的获取

```js
app.use((ctx) => {
  ctx.type = 'json'
  ctx.body = {
    url: ctx.request.url,
    path: ctx.request.path,
    method: ctx.request.method,
    query: ctx.request.query,
    params: ctx.params, // undefined 没有路径参数
    querystring: ctx.request.querystring,
    header: ctx.request.header,
  }
})
```

```bash
ctx.header # 请求头
ctx.method # 请求方法
ctx.path # 请求路径
ctx.query # 路径查询参数，对象
ctx.querystring # 路径查询参数，字符串
ctx.url  # 请求 url

ctx.origin
ctx.href # 获取完整的请求 URL
ctx.host
ctx.hostname

ctx.ip
ctx.ips

ctx.subdomains

ctx.fresh
ctx.stale

ctx.is()
ctx.accepts()
ctx.acceptsEncodings()
ctx.acceptsCharsets()
ctx.acceptsLanguages()
ctx.get()

ctx.socket
ctx.protocol
ctx.secure
```

post 参数的获取

koa 没有获取 post 请求体的直接方法，可使用中间件或者解析原生的 req。

```js
function parsePostData(req) {
  return new Promise((resolve, reject) => {
    let postData = ''
    req.on('data', (chunk) => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      resolve(JSON.parse(postData))
    })
  })
}
// 使用
app.use(async (ctx) => {
  const data = await parsePostData(ctx.req)
  ctx.type = 'json'
  ctx.body = data
})
```

> 获取请求 `ctx.response` -- 是 node response 的抽象

`ctx.type` 设置响应格式。

`ctx.body` 设置响应数据。

`ctx.status`、`ctx.message` 设置响应状态。

`ctx.redirect()`重定向。

`ctx.state`、`ctx.app`、`ctx.cookies`、`ctx.throw`

> `ctx.req`、`ctx.res`、`ctx.originalUrl` 是 node 中原色的请求、响应和路径，对原生的属性操作，无效。

绕过 Koa 的 response 处理是 不被支持的. 应避免使用以下 node 属性：

`res.statusCode `、`res.writeHead()`、 `res.write()`、 `res.end()`

## 中间件

`koa.use(middleware)`

`next`

> 异步中间件

### 官方常用中间件

重定向

`ctx.redirect` -- 只能处理同步请求。

#### 路由中间件

#### 静态资源

`koa-static`、`koa-mount`

#### 中间件原理

#### 中间件组合

`koa-compose`

### 中间异常处理

## 参考

[]()

[bilibili 视频](https://www.bilibili.com/video/BV1W64y1h7qi)
