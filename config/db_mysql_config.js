const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit : 25,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_DATABASE
});

module.exports = {
	getConnection : function (callback) {
		pool.getConnection(function (err, connection) {
			if(err) {
				callback(err);
			}
			callback(null, connection);
		});
	};
}