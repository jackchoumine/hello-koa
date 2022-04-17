const Koa = require('koa')
const app = new Koa()

const Router = require('koa-router')
const router = new Router()

// 命名路由
router.get('users', '/user/:id', (ctx, next) => {
  ctx.body = 'name router'
})

// 链式写法
router
  .get(
    '/users',
    (ctx, next) => {
      // NOTE 如果不调用 next()，则后续的中间件不会执行
      // 直接返回当前中间件的内容
      // ctx.body = 'this is a users response'
      const user = { name: 'jack' } // 从数据库中找到的用户信息
      ctx.user = user
      next()
    },
    (ctx, next) => {
      // NOTE
      // 多个中间件路由常用于拦截器
      // 多步数据库操作等：先找到数据，在更新数据
      // 当路由函数中有异步操作时，可读性更高，好维护
      ctx.body = ctx.user
    },
  )
  // .get('/users/:id', (ctx) => {
  //   ctx.body = 'get'
  // })
  .post('/users', (ctx) => {})
  .put('/users', (ctx) => {})
  .delete('/users/:id', (ctx) => {})

// 使用命名路由
// BUG 似乎匹配不到
const user2 = router.url('users', '123')
console.log(user2) // /user/123

// 嵌套路由
const post = new Router()
post.get('/', (ctx) => {
  ctx.body = 'router2'
})
post.get('/:id', (ctx) => {
  console.log(ctx.params)
  ctx.body = 'router2 ' + ctx.params.id
})
post.use('/page/:info', post.routes())

// 路由前缀：能简化路由写法
const prefix = new Router({ prefix: '/api' })
prefix.get('/users', (ctx) => {
  ctx.body = { name: 'jack' }
})

// router.allowedMethods 没有看到使用场景
// const Boom = require('@hapi/boom')

// app.use(
//   router.allowedMethods({
//     throw: true,
//     notFound: () => new Boom.notFound(),
//   }),
// )
// 单独写法
// NOTE 高版本的的不能使用 *
//  使用 (.*) 可以匹配任意字符 当然也可以使用正则
// NOTE 当没有路径匹配时，会匹配个路径
router.all('/(.*)', (ctx) => {
  ctx.status = 404
  ctx.body = '404'
})

// NOTE 如果不使用 router.routes()，则不能使用 router.allowedMethods()
// 顺序很重要
app.use(post.routes())
app.use(prefix.routes())
// 统一处理404的路由放在最后
app.use(router.routes())

// 重定向
// router.redirect('/login', 'sign-in')

// router.all('/login', (ctx) => {
//   ctx.redirect('/sign-in')
//   ctx.status = 301
// })

app.listen(3004, () => {
  console.log('server is running at http://localhost:3004')
})
