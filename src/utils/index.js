/*
 * @Description :
 * @Date        : 2022-04-12 22:47:20 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-12 22:48:55 +0800
 * @LastEditors : JackChou
 */

function parsePostData(req) {
  return new Promise((resolve, reject) => {
    let postData = ''
    req.on('data', (chunk) => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      resolve(JSON.parse(postData))
    })
  })
}
module.exports = { parsePostData }
