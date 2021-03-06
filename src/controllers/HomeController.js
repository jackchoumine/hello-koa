/*
 * @Description :
 * @Date        : 2022-04-18 19:43:18 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 23:22:44 +0800
 * @LastEditors : JackChou
 */

const { findUser } = require('../services')
async function homePage(ctx) {
  // ctx.log.info('homePage')
  // 需要读取文件，使用 await
  await ctx.render('home', { buttonText: '提交' })
}

async function register(ctx) {
  const { name: inputName, password: inputPassword } = ctx.request.body
  // 数据验证
  // 1.  基本验证 -- 必填项 -- 名字、密码
  // 2.  数据库验证
  const { name } = await findUser(inputName, inputPassword)
  if (Math.random() > 0.7) {
    // 用户名不存在
    ctx.type = 'html'
    ctx.body = /*html*/ `<h1>注册成功</h1>`
  } else {
    // 用户名存在
    ctx.sendJson({ message: '用户名已存在' })
  }
}

module.exports = { homePage, register }
