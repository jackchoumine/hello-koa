/*
 * @Description :
 * @Date        : 2022-04-18 21:21:13 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 21:39:43 +0800
 * @LastEditors : JackChou
 */
const log4js = require('log4js')

const methods = ['debug', 'info', 'warn', 'error', 'fatal']

module.exports = (options) => {
  return async (ctx, next) => {
    const contextLogger = {}
    const start = Date.now()
    // NOTE 日志文件产生的位置就是当前启动环境的位置。
    log4js.configure({
      appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
      categories: { default: { appenders: ['cheese'], level: 'info' } },
    })

    const logger = log4js.getLogger('cheese')

    methods.forEach((method) => {
      contextLogger[method] = (message) => {
        logger[method](message)
      }
    })
    // NOTE 在 ctx 上挂载日志方法
    ctx.log = contextLogger
    await next()
    const end = Date.now()
    const responseTime = end - start
    logger.info(`响应时间为${responseTime / 1000}s`)
  }
}
