/*
 * @Description : 中间件出口文件
 * @Date        : 2022-04-18 19:49:30 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 23:59:00 +0800
 * @LastEditors : JackChou
 */
const path = require('path')
const ip = require('ip')
const bodyParer = require('koa-bodyparser')
const nunjucks = require('koa-nunjucks-2')
// const { parsePostData } = require('./src/utils')
const koaStatic = require('koa-static')
//NOTE dist 目录下有 index.html，访问 /  会渲染这个文件
// 在 html 中这样引入 <link rel="stylesheet" href="/main.css" />

const sendJson = require('./sendJson')
const logger = require('./mid-log')
const httpError = require('./mi-http-error')

const serverTime = require('./serverTime')

async function handleError(ctx, next) {
  try {
    await next()
  } catch (error) {
    ctx.status = 500
    ctx.body = { path: ctx.path, info: error.message, method: ctx.method }
    ctx.app.emit('error', error, ctx)
  }
}

module.exports = (app) => {
  // app.use(httpError())
  app.use(serverTime())
  app.use(handleError)

  app.on('error', (err, ctx) => {
    console.log(err.stack)
    ctx.log.error(err.message)
  })

  app.use(
    logger({
      env: app.env,
      dir: 'logs',
      level: 'info',
      projectName: 'hello-world',
      serverIp: ip.address(),
    }),
  )

  app.use(bodyParer())
  app.use(sendJson)

  app.use(koaStatic('./dist')) //NOTE 静态资源都放在 dist 文件夹下

  // NOTE nunjucks 配置
  app.use(
    nunjucks({
      ext: 'html',
      path: path.resolve(__dirname, '../views'), // 指定视图目录
      nunjucksConfig: {
        trimBlocks: true, // 开启转义 防Xss
      },
    }),
  )
}
