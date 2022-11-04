/**
 * Created by jinx on 2019/3/19 0019.
 */
var fs = require('fs');
var express = require('express');
var multer = require('multer');
var router = express.Router();
const sqlhelper = require('./../mysqlhandler');
const mdb = sqlhelper.db;
var path = require('path');

const mytoken = require('jsonwebtoken');

//递归创建目录 异步方法
function mkdirs(dirname, callback) {
  fs.exists(dirname, function (exists) {
    if (exists) {
      callback();
    } else {
      //console.log(path.dirname(dirname));
      mkdirs(path.dirname(dirname), function () {
        fs.mkdir(dirname, callback);
      });
    }
  });
}

//递归创建目录 同步方法
function mkdirsSync(dirname) {
  //console.log(dirname);
  if (fs.existsSync(dirname)) {
    return true;
  } else {
    if (mkdirsSync(path.dirname(dirname))) {
      fs.mkdirSync(dirname);
      return true;
    }
  }
}

var createFolder = function (folder) {
  try {
    fs.accessSync(folder);
  } catch (e) {
    mkdirsSync(folder);
  }
};

var uploadFolder = './upload/img';
var src = '';
createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadFolder); // 保存的路径，备注：需要自己创建
  },
  filename: function (req, file, cb) {
    // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
    cb(null, Math.floor(Date.now() / 1000) + '_' + file.originalname);
    src = '/upload/img/' + Math.floor(Date.now() / 1000) + '_' + file.originalname;
    // console.log(src);
  },
});

//新版提交心情接口
router.post('/new_commitmood', function (req, res) {
  var mood_info = req.body;
  // console.log(mood_info);
  if (req.session.username) {
    var username = req.session.username;
    var myDate = new Date();
    //存入时间
    var time = myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日 ' + myDate.getHours() + ':' + myDate.getMinutes();
    // console.log(time)
    if (mood_info.city == '') {
      mood_info.city = null;
    }
    if (mood_info.imgUrl == '') {
      mood_info.imgUrl = null;
    } else {
    }
    var sql = `insert into mood_info(msg,username,time,city,imgUrl) values("${mood_info.msg}","${username}","${time}","${mood_info.city}","${mood_info.imgUrl}")`;
    mdb.query(sql, function (err, data) {
      if (err) {
        console.log(err);
        res.send({
          status: 'error',
          message: '发表失败',
        });
      } else {
        res.send({
          status: 'ok',
          message: '发表成功',
        });
      }
    });
  } else {
    res.send({
      status: 'error',
      message: '尚未登录，请登录',
    });
  }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage });
//暂时废弃
router.post('/commitmood', upload.single('file'), function (req, res, next) {
  var mood_info = req.body;

  if (req.session.username) {
    var username = req.session.username;
    var myDate = new Date();
    //存入时间
    var time = myDate.getFullYear() + '年' + (myDate.getMonth() + 1) + '月' + myDate.getDate() + '日 ' + myDate.getHours() + ':' + myDate.getMinutes();
    // console.log(time);
    if (mood_info.city == '') {
      mood_info.city = null;
    }
    if (mood_info.imgUrl == '') {
      mood_info.imgUrl = null;
    } else {
      mood_info.imgUrl = src;
    }
    var sql = `insert into mood_info(msg,username,time,city,imgUrl) values("${mood_info.msg}","${username}","${time}","${mood_info.city}","${mood_info.imgUrl}")`;
    mdb.query(sql, function (err, data) {
      if (err) {
        console.log(err);
        res.send({
          status: 'error',
          message: '发表失败',
        });
      } else {
        res.send({
          status: 'ok',
          message: '发表成功',
        });
      }
    });
  } else {
    res.send({
      status: 'error',
      message: '尚未登录，请登录',
    });
  }
});

router.post('/addComments', function (req, res) {
  var data = req.body;
  if (req.session.username) {
    var time = new Date().getTime();
    var sql = `insert into comment_info(user_name,content,time,cid) values("${data.user_name}","${data.content}","${time}","${data.cid}")`;
    mdb.query(sql, function (err, data) {
      if (err) {
        console.log(err);
        res.send({
          status: 'error',
          message: '发表失败',
        });
      } else {
        res.send({
          status: 'ok',
          message: '发表成功',
        });
      }
    });
  } else {
  }
});

router.get('/getMoodList', function (req, res) {
  var param = req.query;
  // var param = req.body;
  // var pagesize = req.query.pagesize;
  // var page = req.query.page;

  //分页实现
  var current_page = 1; //默认为1
  var pagesize = 10; //每页条数
  if (param.page) {
    current_page = parseInt(param.page);
  }
  if (param.pagesize) {
    pagesize = parseInt(param.pagesize);
  }
  //设置最后一页页码
  var last_page = current_page - 1;
  //假如目前仅有一页，则最后一页则为1
  if (current_page <= 1) {
    last_page = 1;
  }
  //如果需要下一页，则开启
  //var next_page = current_page + 1;
  var sql = 'select * FROM mood_info limit ' + pagesize + ' offset ' + (current_page - 1) * pagesize;
  // var sql =
  //   'select * FROM test order by cid desc limit ' +
  //   pagesize +
  //   ' offset ' +
  //   (current_page - 1) * pagesize

  mdb.query(sql, async function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let comment = null;
      for (let i = 0; i < data.length; i++) {
        // comment = getComment(data[i].id);
        let res = await getComment(data[i].id);
        console.log(res);
        if (res) {
          data[i].comment = res;
        }
      }
      res.send({
        status: 'ok',
        data: data.reverse(),
        // data: data,
      });
    }
  });
});

function getComment(id) {
  var comment = `select * FROM comment_info where cid="${id}"`;
  return new Promise((res, rej) => {
    mdb.query(comment, function (err, data) {
      if (err) {
        console.log(err);
        rej(null);
      } else {
        res(data.reverse());
      }
    });
  });
}
module.exports = router;
