/*
 * @Description : koa demo1
 * @Date        : 2022-04-12 00:07:53 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 22:57:31 +0800
 * @LastEditors : JackChou
 */
const Koa = require('koa')
const app = new Koa()

const router = require('./src/routers')
const middlewares = require('./src/middlewares')

// 集中管理中间件
middlewares(app)

router(app)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.info(`server is running at port http://localhost:${PORT}`)
})
