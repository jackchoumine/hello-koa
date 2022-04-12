/*
 * @Description : koa demo1
 * @Date        : 2022-04-12 00:07:53 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-13 00:26:46 +0800
 * @LastEditors : JackChou
 */
const Koa = require('koa')
const app = new Koa()
const { parsePostData } = require('./src/utils')

const Router = require('@koa/router')
const router = new Router()

router.get('/', (ctx, next) => {
  // ctx.router available
})

app.use(router.routes()).use(router.allowedMethods())

// ctx 是上下文
app.use(async (ctx, next) => {
  // const data = await parsePostData(ctx.req)
  // console.log(data)
  // ctx.type = 'json'
  ctx.body = {}
  await next()
})

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

app.listen(3000, () => {
  console.info('server is running at port 3000')
})
