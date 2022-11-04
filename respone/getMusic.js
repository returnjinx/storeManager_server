var express = require('express');
var router = express.Router();
const sqlhelper = require('./../mysqlhandler');
const mdb = sqlhelper.db;

const mytoken=require('jsonwebtoken');


//检测登录状态
router.post('/getMusic', function (req, res) {

    let userinfo = req.body;
    var sql = `select * from musicList`;
    mdb.query(sql, function (err, data) {
        if (err) {
            console.log(err);
        } else {

            res.send({
                status: 1,
                data: data
            })
        }
    })

})




module.exports = router;