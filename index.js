/*
 * @Description : koa demo1
 * @Date        : 2022-04-12 00:07:53 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-12 00:12:29 +0800
 * @LastEditors : JackChou
 */
const Koa = require('koa')
const app = new Koa()

// BUG koa 没有路由系统，只有中间件

// ctx 是上下文
app.use((ctx) => {
  ctx.body = 'hello world'
})

app.listen(3000, () => {
  console.info('server is running at port 3000')
})
