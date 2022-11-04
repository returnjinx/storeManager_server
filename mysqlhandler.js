const mysql = require('mysql');
const HOST = '127.0.0.1';
const USER = 'root';
// const PASS = '';
const PASS = '';
// const PASS = '555xingjinxing'
const DATABASE = 'user_info';
const PORT = 3306;
const db = mysql.createPool({
  // const db = mysql.createConnection({
  host: HOST,
  user: USER,
  password: PASS,
  database: DATABASE,
  port: PORT,
  multipleStatements: true,
  charset: 'utf8mb4',
});
if (db) {
  let createUserInfo = `create table if not exists user_info(
                          id int primary key auto_increment,
                          username varchar(255)not null,
                          password varchar(255)not null,
                          nickname varchar(255)not null
                      )`;

  db.query(createUserInfo, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });

  let createMood = `create table if not exists mood_info(
    id int primary key auto_increment,
    msg varchar(255)not null,
    username varchar(255)not null,
    time int(50)not null,
    city varchar(255)not null,
    imgUrl varchar(255)not null
)`;

  db.query(createMood, function (err, results, fields) {
    if (err) {
      console.log(err.message);
    }
  });
}

module.exports = {
  db: db,
};
