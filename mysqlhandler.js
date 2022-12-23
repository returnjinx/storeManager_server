const tableConfig = require('./config/createTable')
const mysql = require('mysql');
const HOST = '127.0.0.1';
const USER = 'root';
const PASS = '';
const DATABASE = 'storeManager';
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
  tableConfig.createTables(db);
}

module.exports = {
  db: db,
};
