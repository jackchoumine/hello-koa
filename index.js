/*
 * @Description : koa demo1
 * @Date        : 2022-04-12 00:07:53 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 20:05:08 +0800
 * @LastEditors : JackChou
 */
const Koa = require('koa')
const app = new Koa()
const bodyParer = require('koa-bodyparser')
const router = require('./src/routers')
const middlewares = require('./src/middlewares')
// const { parsePostData } = require('./src/utils')
// const koaStatic = require('koa-static')

// app.use(koaStatic('./dist')) //NOTE 静态资源都放在 dist 文件夹下
// 在 html 中这样引入 <link rel="stylesheet" href="/main.css" />

app.use(bodyParer())
app.use(middlewares.handleError)

app.on('error', (err, ctx) => {
  console.log({ path: ctx.path, method: ctx.method, info: err.message })
})

router(app)

const PORT = process.env.PORT || 3000

app.listen(PORT, () => {
  console.info(`server is running at port http://localhost:${PORT}`)
})
