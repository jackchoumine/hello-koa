/*
 * @Description :
 * @Date        : 2022-04-18 21:16:14 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 21:16:14 +0800
 * @LastEditors : JackChou
 */
const log4js = require('log4js')
log4js.configure({
  appenders: { cheese: { type: 'file', filename: 'cheese.log' } },
  categories: { default: { appenders: ['cheese'], level: 'error' } },
})

const logger = log4js.getLogger('cheese')
logger.trace('Entering cheese testing')
logger.debug('Got cheese.')
logger.info('Cheese is Gouda.')
logger.warn('Cheese is quite smelly.')
logger.error('Cheese is too ripe!')
logger.fatal('Cheese was breeding ground for listeria.')
