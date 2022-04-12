/*
 * @Description : koa demo1
 * @Date        : 2022-04-12 00:07:53 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-13 01:52:32 +0800
 * @LastEditors : JackChou
 */
const Koa = require('koa')
const app = new Koa()
const { parsePostData } = require('./src/utils')
const koaStatic = require('koa-static')
const Router = require('@koa/router')
const router = new Router()

// app.use(koaStatic('./dist')) //NOTE 静态资源都放在 dist 文件夹下
// 在 html 中这样引入 <link rel="stylesheet" href="/main.css" />

// router.get('/:page', (ctx, next) => {
//   // ctx.router available
//   ctx.body = 'hello koa ' + ctx.params.page
// })

router.get('/test', (ctx) => {
  ctx.redirect('/login')
})

app.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    console.log(error.message)
    ctx.status = 500
    ctx.body = { path: ctx.path, info: error.message, method: ctx.method }
  }
})

// app.on('error', (err) => {
//   console.log(err)
// })

// router.get('/error', (ctx) => {
//   const data = JSON.parse('')
//   ctx.body = data
// })

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

app.use(router.routes())
//.use(router.allowedMethods())

// ctx 是上下文

// app.use((ctx) => {
//   ctx.type = 'json'
//   ctx.body = {
//     method: ctx.request.method,
//     path: ctx.request.path,
//     query: ctx.request.query,
//     querystring: ctx.request.querystring,
//     search: ctx.search,
//     params: ctx.params, // undefined 没有路径参数
//     header: ctx.request.header,
//     host: ctx.host,
//     hostname: ctx.hostname,
//     type: ctx.type,
//     charset: ctx.charset,
//     ip: ctx.ip,
//     url: ctx.request.url,
//     href: ctx.href,
//     // 协商
//     fresh: ctx.fresh,
//     //也就是内容没有改变。此方法用于 If-None-Match / ETag, 和 If-Modified-Since 和 Last-Modified 之间的缓存协商。 在设置一个或多个这些响应头后应该引用它。
//     stale: ctx.stale,
//     isJson: ctx.is('application/json'),
//     field: ctx.get('content-type'),
//   }
// })

app.listen(3000, () => {
  console.info('server is running at port 3000')
})
