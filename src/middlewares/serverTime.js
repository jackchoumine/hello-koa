/*
 * @Description : 记录服务器时间
 * @Date        : 2022-04-18 23:56:39 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-19 00:19:44 +0800
 * @LastEditors : JackChou
 */
module.exports = () => {
  return async (ctx, next) => {
    await next()
    ctx.set('Server-Time', 1200)
  }
}
