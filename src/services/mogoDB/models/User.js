/*
 * @Description : 数据模型
 * @Date        : 2022-04-14 22:33:50 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-14 22:57:15 +0800
 * @LastEditors : JackChou
 */
const mongoose = require('mongoose')
const Base = require('./Base')
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    default: null,
  },
  ...Base,
})

// NOTE 数据库集合 users
module.exports = mongoose.model('User', userSchema)
