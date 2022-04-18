/*
 * @Description : 路由配置
 * @Date        : 2022-04-18 19:27:15 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 19:47:37 +0800
 * @LastEditors : JackChou
 */
const router = require('koa-router')()
const { HomeController } = require('../controllers')

module.exports = (app) => {
  router.get('/', HomeController.homePage)
  router.post('/register', HomeController.register)
  app.use(router.routes()).use(router.allowedMethods())
}
