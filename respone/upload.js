/**
 * Created by Administrator on 2019/4/15 0015.
 */
var fs = require('fs');
var express = require('express');
var multer  = require('multer');
var router = express.Router();
const sqlhelper = require('./../mysqlhandler');
const mdb = sqlhelper.db;
var path = require("path");

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


const mytoken=require('jsonwebtoken');


var createFolder = function(folder){
    try{
        fs.accessSync(folder);
    }catch(e){
        mkdirsSync(folder);
    }
};

var uploadFolder = './upload/img';
var src='';
createFolder(uploadFolder);

// 通过 filename 属性定制
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadFolder);    // 保存的路径，备注：需要自己创建
    },
    filename: function (req, file, cb) {
        // 将保存文件名设置为 字段名 + 时间戳，比如 logo-1478521468943
        cb(null, Math.floor(Date.now()/1000)+'_'+file.originalname);
        src = '/upload/img/'+Math.floor(Date.now()/1000)+'_'+file.originalname;
        // console.log(src)
    }
});

// 通过 storage 选项来对 上传行为 进行定制化
var upload = multer({ storage: storage })

// 单图上传
router.post('/upload', upload.single('file'), function(req, res, next){
    var result ={
        status: 'ok',
        message:'上传成功',
        url:src,
    }
    res.send(result);
});


module.exports = router;