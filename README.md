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

常见的状态

```bash
200 OK # 请求成功
201 Created # 新建成功 常用 rest api post 新建资源
204 No Content #请求成功，无内容方，常用 rest api delete 删除资源
# NOTE 实际开发中，每次请求都会给前端返回信息 200 201 已经够用
```

```bash
304 "not modified" # 资源没更新
303 "see other" # 通常作为 PUT 或 POST 操作的返回结果，它表示重定向链接指向的不是新上传的资源，而是另外一个页面，比如消息确认页面或上传进度页面。 重定向请求使用 GET
307 "temporary redirect" # 临时重定向 原始请求中的请求方法和消息主体会在重定向请求中被重用。
308 "permanent redirect" # 永久重定向，浏览器会跳转 请求方法和消息主体不会发生改变
```

4xx

```bash
400 Bad Request # 错误请求，往往参数验证不通过
404 Not Found # 资源或者路径不存在
405 Method Not Allowed # 请求方法错误
401 Unauthorized # 需要认证身份
403 Forbidden # 禁止访问，可能权限不够
402 Payment Required # 要求付款
```

5xx

```bash
500 Internal Server error # 服务器错误
502 Bad Gateway # 上游服务器出错
503 Service Unavailable # 服务无法提供
504 gateway Timeout # 网关错误
```

`ctx.redirect()`重定向。

`ctx.state`、`ctx.app`、`ctx.cookies`、`ctx.throw`

> `ctx.req`、`ctx.res`、`ctx.originalUrl` 是 node 中原色的请求、响应和路径，对原生的属性操作，无效。

绕过 Koa 的 response 处理是 不被支持的. 应避免使用以下 node 属性：

`res.statusCode `、`res.writeHead()`、 `res.write()`、 `res.end()`

> <!-- BUG --> 缓存管理

## 中间件

`koa.use(middleware)`

`next`

> 异步中间件

> 中间件合并

`koa-compose`

### 官方常用中间件

`ctx.redirect` -- 只能处理同步请求。

```js
router.get('/test', (ctx) => {
  ctx.redirect('/login')
})
```

#### 路由中间件

> 基本使用

`npm i @koa/router`

```js
const Router = require('@koa/router')
const router = new Router()

router.get('/:page', (ctx, next) => {
  // ctx.router available
  ctx.body = 'hello koa ' + ctx.params.page
})

app.use(router.routes())
```

#### 静态资源

`koa-static`、`koa-mount`

```js
const koaStatic = require('koa-static')
app.use(koaStatic('./dist')) //NOTE 静态资源都放在 dist 文件夹下
// 在 html 中这样引入 <link rel="stylesheet" href="/main.css" />
```

#### 中间件原理

#### 中间件组合

`koa-compose`

### 中间异常处理

```js
router.get('/error', (ctx) => {
  try {
    const data = JSON.parse('')
    ctx.body = 'hello koa'
  } catch (error) {
    console.log(error)
    ctx.status = 500
    ctx.body = 'error'
  }
})
```

利用中间件模型捕获所有异常

```js
app.use(async (ctx, next) => {
  try {
    await next() // NOTE 不使用 await 不能捕获异步异常
  } catch (error) {
    console.log(error)
    ctx.status = 500
  }
})
router.get('/error', (ctx) => {
  const data = JSON.parse('')
  ctx.body = data
})
```

中间件的顺序非常重要：

```js
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(error)
    ctx.status = 500
  }
})

app.use(async (ctx, next) => {
  JSON.parse(1)
  // next() //BUG 同步中间件，不能转交异步中间件的执行权
  // return next()
  await next()
})

app.use(async (ctx, next) => {
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${r}`) // NOTE 未定义变量 r
})
```

可自定义错误处理中间件

```js
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(error.message)
    ctx.status = 500
    // NOTE 课件错误信息报错在数据库中，定期分析原因
    ctx.body = { path: ctx.path, info: error.message, method: ctx.method }
  }
})
```

> 最佳实践

同步中间件`return next()` 异步中间件`await next()`

> 使用`app.on(error)` 捕获异常

```js
app.on('error', (err) => {
  console.log(err)
})

app.use(async (ctx, next) => {
  JSON.parse(1)
  // next() //BUG 同步中间件，不能转交异步中间件的执行权
  return next()
  // await next()
})

app.use(async (ctx, next) => {
  console.log(age) //undefined
  await next()
  const rt = ctx.response.get('X-Response-Time')
  console.log(`${ctx.method} ${ctx.url} - ${r}`) // NOTE 未定义变量 r
})
```

> 同样要注意中间的 next 用法。

> 两者结合使用

```js
app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    ctx.status = 500
    ctx.body = { path: ctx.path, info: error.message, method: ctx.method }
    // 捕获错误时触发 error 事件
    ctx.app.emit('error', error, ctx)
  }
})

app.on('error', (err, ctx) => {
  console.log({ path: ctx.path, method: ctx.method, info: err.message })
})
```

> 社区的错误处理中间件。

[koa-better-error-handler](https://www.npmjs.com/package/koa-better-error-handler）

## 数据库操作

## 用户认证

## 日志管理

## 部署

## 参考

[bilibili 视频](https://www.bilibili.com/video/BV1W64y1h7qi)
