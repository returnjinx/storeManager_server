const { expressjwt } = require('express-jwt');
const { secretKey } = require('./constant');
const jwtAuth = expressjwt({ secret: secretKey, algorithms: ['HS256'] }).unless({
  // path: [/^\/login\//],
  path: ['/api/login'],
});
//unless 为排除那些接口

module.exports = jwtAuth;
