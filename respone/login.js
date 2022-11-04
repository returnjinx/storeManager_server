var express = require('express');
var router = express.Router();
const sqlhelper = require('./../mysqlhandler');
const mdb = sqlhelper.db;

const mytoken=require('jsonwebtoken');

//处理登录的逻辑
router.post('/login', function (req, res) {
    let userinfo = req.body;
    var sql = `select * from user_info where username="${userinfo.username}"`;
    //需要验证用户名和密码
    mdb.query(sql, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data.length > 0) {
                if(userinfo.username==data[0].username && userinfo.password==data[0].password){
                    let result = validata(userinfo, data[0]);
                    if(result.status==1){
                        req.session.username=data[0].username;
                        req.session.user_id=data[0].id;
                    }
                    res.send(result);
                }else{
                    let result ={};
                    result.status = 0;
                    result.Msg = '用户名密码不符';
                    res.send(result);
                }
               
            }else{
                let result = {
                    status: 0,
                    Msg: '该用户不存在'
                }
                res.send(result);
            }


        }
    })
})


//检测登录状态
router.get('/checkLogin', function (req, res) {
    if(req.session.username){
        let result = {
            status: 1,
            username:req.session.username,
            user_id:req.session.user_id,
            Msg: '已登录'
        }
        res.send(result);
    }else{
        let result = {
            status: 0,
            Msg: '未登录'
        }
        res.send(result);
    }

})
//退出登录状态
router.get('/logout', function(req, res, next){
    // 备注：这里用的 session-file-store 在destroy 方法里，并没有销毁cookie
    // 所以客户端的 cookie 还是存在，导致的问题 --> 退出登陆后，服务端检测到cookie
    // 然后去查找对应的 session 文件，报错
    // session-file-store 本身的bug
    delete req.session.username;
    req.session.save(function (err) {
        if(err){
            let result = {
                status: 0,
                Msg: '退出登录失败'
            }
            res.send(result);
        }else{
            let result = {
                status: 1,
                Msg: '已退出登录'
            }
            res.send(result)
        }

    })
    // req.session.destroy(function(err) {
    //     if(err){
    //         res.sed({ret_code: 2, ret_msg: '退出登录失败'});
    //         return;
    //     }
    //     // req.session.username = null;
    //
    // });

});
//处理注册的逻辑
router.post('/register', function (req, res) {
    let userinfo = req.body;
    //第一步 首先查看存在该用户
    var sql = `select * from user_info where username="${userinfo.username}"`;
    mdb.query(sql, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            if (data.length > 0) {
                let result = {
                    status: 0,
                    Msg: '该用户已被注册'
                }
                res.send(result);
            } else {
                registerInfo(userinfo, res);
            }
        }
    })
})

function registerInfo(userinfo, res) {
    var sql = `insert into user_info(username,password,nickname) values("${userinfo.username}","${userinfo.password}","${userinfo.nickname}")`;
    mdb.query(sql, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            let result = {
                status: 1
            }
            res.send(result);
        }
    })
}


function validata(postuser, dbuser) {
    //格式这里不做验证
    let result = {};
    if (postuser.password !== dbuser.password) {
        result.status = 0;
        result.Msg = '用户名密码不符';
    } else {
        const token=mytoken.sign(postuser,'iloveyou');
        result.Msg = '登录成功';
        result.status = 1;
        result.username = dbuser.username;
        
        result.token=token;
    }
    return result;
}

module.exports = router;