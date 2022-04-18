/*
 * @Description :
 * @Date        : 2022-04-18 21:21:13 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 22:00:23 +0800
 * @LastEditors : JackChou
 */
const log4js = require('log4js')

const methods = ['debug', 'info', 'warn', 'error', 'fatal']

module.exports = (options) => {
  const contextLogger = {}

  const defaultInfo = {
    env: 'dev',
    dir: 'logs',
    appLogLevel: 'info',
  }
  const { env, dir, appLogLevel } = defaultInfo

  const appenders = {
    cheese: {
      type: 'dateFile', // 日志类型
      // BUG 如何添加 logs 目录且以日期命名
      filename: `${dir}/task`, // 输出的文件名
      pattern: 'yyyy-MM-dd.log', // 文件名增加后缀
      alwaysIncludePattern: true, // 是否总是有后缀名
    },
  }

  // 根据不同环境输入不同日志级别
  if (['dev', 'local', 'development'].includes(env)) {
    appenders.out = {
      type: 'console',
    }
  }

  const config = {
    appenders,
    categories: {
      default: {
        appenders: Object.keys(appenders),
        level: appLogLevel,
      },
    },
  }

  const logger = log4js.getLogger('cheese')

  return async (ctx, next) => {
    const start = Date.now()
    // NOTE 日志文件产生的位置就是当前启动环境的位置。

    log4js.configure(config)
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
