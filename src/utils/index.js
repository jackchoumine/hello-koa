/*
 * @Description :
 * @Date        : 2022-04-12 22:47:20 +0800
 * @Author      : JackChou
 * @LastEditTime: 2022-04-12 22:57:28 +0800
 * @LastEditors : JackChou
 */

function parsePostData(req) {
  return new Promise((resolve, reject) => {
    let postData = ''
    req.on('data', (chunk) => {
      postData += chunk.toString()
    })
    req.on('end', () => {
      try {
        const data = JSON.parse(postData ? postData : '{}')
        resolve(data)
      } catch (error) {
        reject(error)
      }
    })
  })
}
module.exports = { parsePostData }
