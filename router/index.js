module.exports = function (app) {
  //登录模块
  var login = require('../respone/login')
  app.use('/', login)

  //获取音乐
  var music = require('../respone/getMusic.js')
  app.use('/', music)

  //评论模块
  var mood = require('../respone/mood.js')
  app.use('/', mood)

  //评论模块
  var comment = require('../respone/Comment.js')
  app.use('/', comment)

  //上传模块
  var upload = require('../respone/upload.js')
  app.use('/', upload)

  //七牛上传
  var qiniu_upload = require('../respone/qiniuUpLoad.js')
  app.use('/', qiniu_upload)
}
