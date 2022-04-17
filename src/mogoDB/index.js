/*
 * @Description : mongoDB 连接
 * @Date        : 2022-04-14 21:41:05 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-14 23:07:05 +0800
 * @LastEditors : JackChou
 */
const mongoose = require('mongoose')

const { User } = require('./models')
// test 是文档名称，没有会新建
mongoose.connect('mongodb://localhost:27017/test', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

const db = mongoose.connection
db.on('error', (err) => console.error('connection error:', err.message))

db.on('open', () => {
  console.log('connected to mongoDB')
})

// 1. 合法数据验证
// 2. 业务验证，比如用户名重复

// 常见验证库： validator.js
// https://www.npmjs.com/package/validator
// koa-validator
// koa 使用 https://github.com/sideway/joi#readme
// 4. 数据写入前会根据 Schema 验证数据
const user = new User({
  username: 'Jack',
  password: '123456',
  email: 'jackchou@gmail.com',
})

user.save().then((data) => {
  mongoose.disconnect()
  console.log(JSON.stringify(data))
})
// test model
// const Cat = mongoose.model('Cat', { name: String })
// const tomCat = new Cat({ name: 'Tom' })

// tomCat.save().then((res) => {
//   // 关闭数据库连接方法一
//   // mongoose.connection.close()
//   // 关闭数据库连接方法二
//   mongoose.disconnect()
//   console.log(res)
//   console.log('meow')
// })
