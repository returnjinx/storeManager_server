/**
 * 登录模块
 */
var express = require('express');
var router = express.Router();
const sqlhelper = require('../../mysqlhandler');
const mdb = sqlhelper.db;

const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const { secretKey } = require('../../plugin/constant');

//处理登录的逻辑
router.post('/login', function (req, res) {
  let userinfo = req.body;
  var sql = `select * from user_info where phonenum="${userinfo.phonenum}"`;
  //需要验证用户名和密码
  mdb.query(sql, async function (err, data) {
    if (err) {
      console.log(err);
    } else {
      if (data.length > 0) {
        if (userinfo.phonenum == data[0].phonenum && userinfo.password == data[0].password) {
          let result = await validata(userinfo, data[0]);
          if (result.status == 1) {
            req.session.phonenum = data[0].phonenum;
            req.session.userId = data[0].id;
          }
          res.send(result);
        } else {
          let result = {};
          result.status = 0;
          result.Msg = '用户名密码不符';
          res.send(result);
        }
      } else {
        let result = {
          status: 0,
          Msg: '该用户不存在',
        };
        res.send(result);
      }
    }
  });
});

//检测登录状态
router.get('/checkLogin', function (req, res) {
  // jwt.verify(req.headers.authorization, secretKey, (err, decoded) => {
  //   if (err) {
  //     console.log('JWT:error');
  //     // return res.status(401).send('token 错误');
  //   }
  //   req.user = decoded;

  // });
  console.log(req.auth);
  
  // let result = {
  //   status: 1,
  //   Msg: '登录成功',
  // };
  // res.send(result);
});
//退出登录状态
router.get('/logout', function (req, res, next) {
  // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
  // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
  // 然后去查找对应的 session 文件，报错
  // session-file-store 本身的bug
  delete req.session.phonenum;
  req.session.save(function (err) {
    if (err) {
      let result = {
        status: 0,
        Msg: '退出登录失败',
      };
      res.send(result);
    } else {
      let result = {
        status: 1,
        Msg: '已退出登录',
      };
      res.send(result);
    }
  });
  // req.session.destroy(function(err) {
  //     if(err){
  //         res.sed({ret_code: 2, ret_msg: '退出登录失败'});
  //         return;
  //     }
  //     // req.session.phonenum = null;
  //
  // });
});
//处理注册的逻辑
router.post('/register', function (req, res) {
  let userinfo = req.body;
  //第一步 首先查看存在该用户
  var sql = `select * from user_info where phonenum="${userinfo.phonenum}"`;
  mdb.query(sql, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      if (data.length > 0) {
        let result = {
          status: 0,
          Msg: '该用户已被注册',
        };
        res.send(result);
      } else {
        registerInfo(userinfo, res);
      }
    }
  });
});

function registerInfo(userinfo, res) {
  var sql = `insert into user_info(phonenum,password,nickname) values("${userinfo.phonenum}","${userinfo.password}","${userinfo.nickname}")`;
  mdb.query(sql, function (err, data) {
    if (err) {
      console.log(err);
    } else {
      let result = {
        status: 1,
      };
      res.send(result);
    }
  });
}

async function validata(userInfo, dbuser) {
  //格式这里不做验证
  let result = {};
  if (userInfo.password !== dbuser.password) {
    result.status = 0;
    result.Msg = '用户名密码不符';
  } else {
    let res = await getUserInfo(userInfo.phonenum);
    // console.log(res[0].id)
    let info = res[0];
    delete info.password;
    const token = jwt.sign({ ...info }, secretKey, {
      expiresIn: 86400 * 30,
    });
    result.Msg = '登录成功';
    result.status = 1;
    result.phonenum = dbuser.phonenum;
    result.token = token;
  }
  return result;
}

function getUserInfo(phonenum) {
  var comment = `select * FROM user_info where phonenum="${phonenum}"`;
  return new Promise((res, rej) => {
    mdb.query(comment, function (err, data) {
      if (err) {
        console.log(err);
        rej(null);
      } else {
        res(data);
      }
    });
  });
}
module.exports = router;
