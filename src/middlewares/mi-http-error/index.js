/*
 * @Description : 处理 http 错误
 * @Date        : 2022-04-18 22:32:36 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 22:36:32 +0800
 * @LastEditors : JackChou
 */
module.exports = () => {
  let fileName = 'other'
  return async (ctx, next) => {
    try {
      await next()
      /**
       * NOTE 如果没有更改过 response 的 status，则 koa 默认的 status 是 404
       */
      if (ctx.response.status === 404 && !ctx.response.body) ctx.throw(404)
    } catch (e) {
      // NOTE 如果是自定义的错误，则直接抛出
      let status = +e.status
      // 默认错误信息为 error 对象上携带的 message
      const message = e.message

      // 对 status 进行处理，指定错误页面文件名
      if (status >= 400) {
        switch (status) {
          case 400:
          case 404:
          case 500:
            fileName = status
            break
          // 其它错误 指定渲染 other 文件
          default:
            fileName = 'other'
        }
      }
    }
  }
}
