/*
 * @Description : 数据模型
 * @Date        : 2022-04-14 22:33:50 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-14 22:41:13 +0800
 * @LastEditors : JackChou
 */
const mongoose = require('mongoose')

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
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
})

// NOTE 数据库集合 users
module.exports = mongoose.model('User', userSchema)
