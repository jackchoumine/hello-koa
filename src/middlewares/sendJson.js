/*
 * @Description :
 * @Date        : 2022-04-18 20:44:12 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 22:09:26 +0800
 * @LastEditors : JackChou
 */
// NOTE 编写一个返回json 的中间件
function render(Obj) {
  this.set('Content-Type', 'application/json')
  this.body = JSON.stringify(Obj)
}

module.exports = async (ctx, next) => {
  // NOTE bind 的用法
  ctx.sendJson = render.bind(ctx)
  ctx.log.error('something wrong')
  await next()
}
