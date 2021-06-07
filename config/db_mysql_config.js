const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 25,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_DATABASE
});


var getConnection = function (callback) {
    pool.getConnection(function (err, connection) {
        if(err) {
          return callback(err);
        }
        callback(null, connection);
    });
};

module.exports = getConnection;