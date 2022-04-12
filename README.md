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
  ctx.body = JSON.stringify({
    url: ctx.request.url,
    method: ctx.request.method,
    query: ctx.request.query,
    params: ctx.params, // undefined 没有路径参数
    querystring: ctx.request.querystring,
    header: ctx.request.header,
  })
})
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

`ctx.state`、`ctx.app`、`ctx.cookies`、`ctx.throw`

> `ctx.req`、`ctx.res`、`ctx.originalUrl` 是 node 中原色的请求、响应和路径，对原生的属性操作，无效。

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
