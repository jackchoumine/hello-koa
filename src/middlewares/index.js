/*
 * @Description : 中间件出口文件
 * @Date        : 2022-04-18 19:49:30 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 20:47:27 +0800
 * @LastEditors : JackChou
 */
const sendJson = require('./sendJson')
module.exports = {
  async handleError(ctx, next) {
    try {
      await next()
    } catch (error) {
      ctx.status = 500
      ctx.body = { path: ctx.path, info: error.message, method: ctx.method }
      ctx.app.emit('error', error, ctx)
    }
  },
  sendJson,
}
