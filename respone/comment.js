/**
 * Created by Administrator on 2019/4/18 0018.
 */
var express = require('express');
var router = express.Router();
const sqlhelper = require('./../mysqlhandler');
const mdb = sqlhelper.db;

const mytoken=require('jsonwebtoken');

router.post('/commitComment',function(req,res,next){
    var body = req.body;
    var sql = `insert into comment_info(mood_id,msg,username,time) values ("${body.mood_id}","${body.msg}","${body.username}","${body.time}")`;
    mdb.query(sql, function (err, data) {
        if (err) {
            console.log(err);
            res.send({
                status: 'error',
                message:'error',
            })
        } else {
            res.send({
                status: 'ok',
                message:'ok',
            })
        }
    })
})


router.get('/like',function (req,res,next) {
    var body = req.query;




})


module.exports = router;