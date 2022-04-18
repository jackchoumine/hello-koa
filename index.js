/*
 * @Description : koa demo1
 * @Date        : 2022-04-12 00:07:53 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 20:19:33 +0800
 * @LastEditors : JackChou
 */
const path = require('path')
const Koa = require('koa')
const app = new Koa()
const bodyParer = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
const router = require('./src/routers')
const middlewares = require('./src/middlewares')
// const { parsePostData } = require('./src/utils')
// const koaStatic = require('koa-static')

// app.use(koaStatic('./dist')) //NOTE 静态资源都放在 dist 文件夹下
// 在 html 中这样引入 <link rel="stylesheet" href="/main.css" />

// NOTE nunjucks 配置
app.use(
  nunjucks({
    ext: 'html',
    path: path.join(__dirname, './src/views'), // 指定视图目录
    nunjucksConfig: {
      trimBlocks: true, // 开启转义 防Xss
    },
  }),
)

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
