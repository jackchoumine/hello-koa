/*
 * @Description :
 * @Date        : 2022-04-18 21:14:35 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 21:14:35 +0800
 * @LastEditors : JackChou
 */
var log4js = require('log4js')
var logger = log4js.getLogger()
logger.level = 'debug' // 日志级别
logger.debug('Some debug messages')
