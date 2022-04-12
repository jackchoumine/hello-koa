/*
 * @Description : koa demo1
 * @Date        : 2022-04-12 00:07:53 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-12 22:49:27 +0800
 * @LastEditors : JackChou
 */
const Koa = require('koa')
const app = new Koa()
const { parsePostData } = require('./src/utils')
// BUG koa 没有路由系统，只有中间件

// ctx 是上下文
app.use(async (ctx) => {
  const data = await parsePostData(ctx.req)
  ctx.type = 'json'
  ctx.body = data
})

app.listen(3000, () => {
  console.info('server is running at port 3000')
})
