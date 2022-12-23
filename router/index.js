module.exports = function (app) {
  //登录模块
  var login = require('../respone/api/login');
  app.use('/api/', login);
  //原料模块
  var staple = require('../respone/api/staple');
  app.use('/api/', staple);
  //人员模块
  var member = require('../respone/api/member');
  app.use('/api/', member);

  //获取音乐
  var music = require('../respone/getMusic.js');
  app.use('/api/', music);

  //评论模块
  var mood = require('../respone/mood.js');
  app.use('/api/', mood);

  //评论模块
  var comment = require('../respone/Comment.js');
  app.use('/api/', comment);

  //上传模块
  var upload = require('../respone/upload.js');
  app.use('/api/', upload);

  //七牛上传
  var qiniu_upload = require('../respone/qiniuUpLoad.js');
  app.use('/api/', qiniu_upload);
};
