var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 25,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_DATABASE
});

function getConnection(callback) {
	pool.getConnection(function(err, connection) {
		if (err) {
			console.error('error connecting: ' + err.stack);
			return;
		}
		callback(err, connection);
	});
}
module.exports = { getConnection };