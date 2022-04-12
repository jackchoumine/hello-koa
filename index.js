/*
 * @Description : koa demo1
 * @Date        : 2022-04-12 00:07:53 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-12 22:58:45 +0800
 * @LastEditors : JackChou
 */
const Koa = require('koa')
const app = new Koa()
const { parsePostData } = require('./src/utils')
// BUG koa 没有路由系统，只有中间件

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
    url: ctx.request.url,
    path: ctx.request.path,
    method: ctx.request.method,
    query: ctx.request.query,
    params: ctx.params, // undefined 没有路径参数
    querystring: ctx.request.querystring,
    header: ctx.request.header,
  }
})

app.listen(3000, () => {
  console.info('server is running at port 3000')
})
