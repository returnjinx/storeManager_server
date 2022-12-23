const express = require('express');
const routes = require('./router/index');
const bodyParser = require('body-parser');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const jwt = require('jsonwebtoken');
const { expressjwt } = require('express-jwt');
const { secretKey } = require('./plugin/constant');
// 全局验证Token是否合法
const tokens = require('./plugin/token');
const app = express();
app.use(cookieParser('secret'));
app.use(express.static(__dirname));

// 使用 session 中间件
app.use(
  session({
    secret: 'secret', // 对session id 相关的cookie 进行签名
    resave: true,
    saveUninitialized: false, // 是否保存未初始化的会话
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 * 30, // 设置 session 的有效时间，单位毫秒
    },
  })
);

app.use(
  bodyParser.urlencoded({
    extended: false,
  })
);
app.use(bodyParser.json());
//token验证逻辑
app.use(tokens);

// 如果token过期或者 错误的处理
app.use(function (err, req, res, next) {
  console.log(err)
  if (err.name === 'UnauthorizedError') {
    console.log('错误')
    //  这个需要根据自己的业务逻辑来处理（ 具体的err值 请看下面）
    res.status(401).send('非法token');
  }
});

app.all('*', function (req, res, next) {
  if (req.headers.origin == 'http://www.hellojinx.cn' || req.headers.origin == 'http://hellojinx.cn') {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
  } else {
    res.header('Access-Control-Allow-Origin', req.headers.origin); //为了跨域保持session，所以指定地址，不能用*
  }

  res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'xtoken');
  res.header('Access-Control-Allow-Headers', 'X-Requested-With');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  res.header('Access-Control-Allow-Headers', 'Content-Type,xtoken'); //设置token  可以跨域添加请求header---自定义header
  res.header('Access-Control-Allow-Credentials', true);

  next();
});
app.use((err, req, res, next) => {
  console.log(err);
});

routes(app);

app.listen(3000);
