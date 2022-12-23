/**
 * 原材料模块
 */
var express = require('express');
var router = express.Router();
const sqlhelper = require('../../mysqlhandler');
const mdb = sqlhelper.db;

router.post('/saveStaple', function (req, res) {
  var info = req.body;
  console.log(req.auth);
  // if (req.session.userId) {
  if (req.auth) {
    var authorId = req.auth.id;
    info.time = new Date().getTime();
    var sql = `insert into staple_info(authorId,material,supplier,count,unitPrice,total,date,timestamp) values("${authorId}","${info.material}","${info.supplier}","${info.count}","${info.unitPrice}","${info.total}","${info.date}","${info.time}")`;
    mdb.query(sql, function (err, data) {
      if (err) {
        console.log(err);
        res.send({
          status: 0,
          message: '保存失败',
        });
      } else {
        res.send({
          status: 1,
          message: '保存成功',
        });
      }
    });
  } else {
    res.status(401).send({
      status: -1,
      message: '尚未登录，请登录',
    });
  }
});

router.get('/getStapleList', function (req, res) {
  var param = req.query;

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
  var sql = 'select * FROM staple_info limit ' + pagesize + ' offset ' + (current_page - 1) * pagesize;
  // var sql =
  //   'select * FROM test order by cid desc limit ' +
  //   pagesize +
  //   ' offset ' +
  //   (current_page - 1) * pagesize

  mdb.query(sql, async function (err, data) {
    if (err) {
      console.log(err);
    } else {
      res.send({
        status: 'ok',
        data: data.reverse(),
        // data: data,
      });
    }
  });
});

module.exports = router;
