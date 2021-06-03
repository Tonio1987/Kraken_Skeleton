var mysql = require('mysql');
var pool  = mysql.createPool({
  connectionLimit : 25,
  host            : process.env.DB_HOST,
  user            : process.env.DB_USER,
  password        : process.env.DB_PASSWORD,
  database        : process.env.DB_DATABASE
});


pool.getConnection((err, connection) => {
	if (error){
		reject(error);
	}
	console.log('connected as id ' + connection.threadId);
	connection.query('SELECT * from users LIMIT 1', (err, rows) => {
		connection.release(); // return the connection to pool
		if (error){
			reject(error);
		}
		console.log('The data from users table are: \n', rows);
	});
});
			
			
			
module.exports.pool = pool;
