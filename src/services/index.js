/*
 * @Description : service 出口文件
 * @Date        : 2022-04-18 19:55:55 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-18 20:06:45 +0800
 * @LastEditors : JackChou
 */
module.exports = {
  findUser(name, password) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // NOTE 假设从数据库查询到的用户信息
        resolve({ name: name + '1', password })
      })
    })
  },
}
