const { queryObject } = require('./tableList');
const createTables = function (db) {
  for (let key in queryObject) {
    db.query(queryObject[key], function (err, results, fields) {
      if (err) {
        console.log(err.message);
      } else {
      }
    });
  }
};

module.exports = {
  createTables: createTables,
};
