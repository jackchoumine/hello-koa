/*
 * @Description :
 * @Date        : 2022-04-18 21:19:31 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 22:14:19 +0800
 * @LastEditors : JackChou
 */
const logger = require('./logger')

module.exports = (options) => {
  const loggerMiddleware = logger(options)

  // 日志错误处理
  return (ctx, next) => {
    return loggerMiddleware(ctx, next).catch((e) => {
      if (ctx.status < 500) {
        ctx.status = 500
      }
      ctx.log.error(e.stack)
      ctx.state.logged = true
      ctx.throw(e)
    })
  }
}
