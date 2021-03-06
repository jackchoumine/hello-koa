# koa 学习

## context 上下文对象

koa 将 node 的`Request`和`Response`对象封装到`Context`中，Context 是一次会话的上下文，通过加工这个对象，可控制返回给用户
的内容，代码中常写作`ctx`。

ctx 提供了常用别名，方便快速操作原生的属性。

常用的属性和方法：

> 获取请求 `ctx.request` -- 是 node request 的抽象

get 参数的获取

```js
// ctx 是上下文
app.use((ctx) => {
  ctx.type = 'json'
  ctx.body = {
    method: ctx.request.method,
    path: ctx.request.path,
    query: ctx.request.query,
    querystring: ctx.request.querystring,
    search: ctx.search,
    params: ctx.params, // undefined 没有路径参数
    header: ctx.request.header,
    host: ctx.host,
    hostname: ctx.hostname,
    type: ctx.type,
    charset: ctx.charset,
    ip: ctx.ip,
    url: ctx.request.url,
    href: ctx.href,
    // 协商
    fresh: ctx.fresh,
    //也就是内容没有改变。此方法用于 If-None-Match / ETag, 和 If-Modified-Since 和 Last-Modified 之间的缓存协商。 在设置一个或多个这些响应头后应该引用它。
    stale: ctx.stale,
    isJson: ctx.is('application/json'),
    field: ctx.get('content-type'),
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
// 重定向
router.get('/test', (ctx) => {
  ctx.redirect('/login')
})
```

#### 路由中间件

> 安装依赖

`npm i koa-router`

> 基础使用

```js
const Router = require('koa-router')
const router = new Router()

router.get('/:page', (ctx, next) => {
  // ctx.router available
  ctx.body = 'hello koa ' + ctx.params.page
})

app.use(router.routes())
```

> 获取 post 请求提交的数据

使用 `koa-bodyparser` 中间件：`npm i koa-bodyparser`

```js
const bodyParer = require('koa-bodyparser')
app.use(bodyParer())

// ……
post.post('/register', (ctx) => {
  console.log(ctx.request.body)
  ctx.type = 'html'
  ctx.body = /*html*/ `<h1>注册成功</h1>`
})
```

#### 静态资源

`koa-static`、`koa-mount`

```js
const koaStatic = require('koa-static')
app.use(koaStatic('./dist')) //NOTE 静态资源都放在 dist 文件夹下
// 在 html 中这样引入 <link rel="stylesheet" href="/main.css" />
```

### 使用模板引擎

安装：`npm i koa-nunjucks-2`

```js
const nunjucks = require('koa-nunjucks-2')

app.use(
  nunjucks({
    ext: 'html',
    path: path.join(__dirname, './src/views'), // 指定视图目录
    nunjucksConfig: {
      trimBlocks: true, // 开启转义 防Xss
    },
  }),
)
```

> 希望压缩模板引擎？

<!-- BUG -->

#### 中间件原理

> 一个返回 json 的中间

```js
// NOTE 编写一个返回json 的中间件
function render(Obj) {
  this.set('Content-Type', 'application/json')
  this.body = JSON.stringify(Obj)
}

module.exports = async (ctx, next) => {
  // NOTE bind 的用法
  ctx.sendJson = render.bind(ctx)
  await next()
}
// 使用
ctx.sendJson({ message: '用户名已存在' })
```

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
    ctx.status = 500
    ctx.body = { path: ctx.path, info: error.message, method: ctx.method }
    ctx.app.emit('error', error, ctx)
  }
})

app.on('error', (err, ctx) => {
  console.log({ path: ctx.path, method: ctx.method, info: err.message })
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
  // NOTE 开发环境，使用红色在控制台输出错误信息
  // 生产环境，错误信息错误数据库
  console.error({ path: ctx.path, method: ctx.method, info: err.message })
})
```

> 社区的错误处理中间件。

[koa-better-error-handler](https://www.npmjs.com/package/koa-better-error-handler）

[处理错误请求](https://github.com/ikcamp/koa2-tutorial/tree/9-mi-http-error)

## 数据库操作

## 用户认证

[用户信息加密传输](https://jueee.github.io/2020/12/2020-12-18-%E4%BD%BF%E7%94%A8RSA%E5%9C%A8Web%E5%89%8D%E7%AB%AF%E5%8A%A0%E5%AF%86%E4%BC%A0%E8%BE%93%E8%87%B3%E5%90%8E%E5%8F%B0%E8%A7%A3%E5%AF%86/)

[如何传输和存储用户密码](https://juejin.cn/post/6844903604944371726)

## 日志管理

挂载到 ctx:

```js
/*
 * @Description :
 * @Date        : 2022-04-18 21:21:13 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 21:38:21 +0800
 * @LastEditors : JackChou
 */
const log4js = require('log4js')

const methods = ['debug', 'info', 'warn', 'error', 'fatal']

module.exports = (options) => {
  return async (ctx, next) => {
    const contextLogger = {}
    const start = Date.now()
    // NOTE 日志文件产生的位置就是当前启动环境的位置。
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'info' } },
    })

    // 不同级别的日志函数
    const logger = log4js.getLogger('cheese')

    methods.forEach((method) => {
      contextLogger[method] = (message) => {
        logger[method](message)
      }
    })
    // NOTE 在 ctx 上挂载日志方法
    ctx.log = contextLogger
    await next()
    const end = Date.now()
    const responseTime = end - start
    logger.info(`响应时间为${responseTime / 1000}s`)
  }
}
```

这样使用：

```js
module.exports = async (ctx, next) => {
  // NOTE bind 的用法
  ctx.sendJson = render.bind(ctx)
  ctx.log.error('something wrong')
  await next()
}
// 或者在 controller 中
ctx.log.info('homePage')
```

> 日志切割

按照日期切割日志文件。

```js
const log4js = require('log4js')

const methods = ['debug', 'info', 'warn', 'error', 'fatal']

module.exports = (options) => {
  const contextLogger = {}

  const defaultInfo = {
    env: 'dev',
    dir: 'logs',
    appLogLevel: 'info',
  }
  const { env, dir, appLogLevel } = defaultInfo

  const appenders = {
    cheese: {
      type: 'dateFile', // 日志类型
      // BUG 如何添加 logs 目录且以日期命名
      filename: `${dir}/task`, // 输出的文件名
      pattern: 'yyyy-MM-dd.log', // 文件名增加后缀
      alwaysIncludePattern: true, // 是否总是有后缀名
    },
  }

  // 根据不同环境输入不同日志级别
  // 开发环境打印日志到终端
  if (['dev', 'local', 'development'].includes(env)) {
    appenders.out = {
      type: 'console',
    }
  }

  const config = {
    appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: appLogLevel,
      },
    },
  }

  const logger = log4js.getLogger('cheese')

  return async (ctx, next) => {
    const start = Date.now()
    // NOTE 日志文件产生的位置就是当前启动环境的位置。

    log4js.configure(config)
    methods.forEach((method) => {
      contextLogger[method] = (message) => {
        logger[method](message)
      }
    })
    // NOTE 在 ctx 上挂载日志方法
    ctx.log = contextLogger
    await next()
    const end = Date.now()
    const responseTime = end - start
    logger.info(`响应时间为${responseTime / 1000}s`)
  }
}
```

日志错误处理:

```js
const logger = require('./logger')

module.exports = (options) => {
  const loggerMiddleware = logger(options)

  // 日志错误处理
  return (ctx, next) => {
    return loggerMiddleware(ctx, next).catch((e) => {
      if (ctx.status < 500) {
        ctx.status = 500
      }
      ctx.log.error(e.stack)
      ctx.state.logged = true
      ctx.throw(e)
    })
  }
}
```

[log 日志中间件](https://github.com/ikcamp/koa2-tutorial/tree/8-mi-log)

[log4js](https://github.com/log4js-node/log4js-node)

## 测试

## 部署

[规范和部署](https://github.com/ikcamp/koa2-tutorial/tree/10-mi-rule)

## 如何组织一个项目

看社区好的脚手架。

## 参考

[bilibili 视频](https://www.bilibili.com/video/BV1W64y1h7qi)

[Node+Koa2 从零搭建通用 API 服务](https://www.bilibili.com/video/BV13A411w79h/?p=3&spm_id_from=pageDriver)

[ikcamp 视频](https://www.bilibili.com/video/BV1fx411L7iv?p=4)
