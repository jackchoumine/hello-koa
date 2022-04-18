/*
 * @Description :
 * @Date        : 2022-04-18 19:43:18 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 20:05:42 +0800
 * @LastEditors : JackChou
 */

const { findUser } = require('../services')
function homePage(ctx) {
  ctx.type = 'html'
  ctx.body = /*html*/ `
    <form action="/register" method="post">
        <input name="name" type="text" placeholder="请输入用户名"/> 
        <br/>
        <input name="password" type="text" placeholder="请输入密码"/>
        <br/>
        <button>GoGoGo</button>
    </form>`
}

async function register(ctx) {
  const { name: inputName, password: inputPassword } = ctx.request.body
  const { name } = await findUser(inputName, inputPassword)
  if (name !== inputName) {
    // 用户名不存在
    ctx.type = 'html'
    ctx.body = /*html*/ `<h1>注册成功</h1>`
  } else {
    // 用户名存在
  }
}

module.exports = { homePage, register }
