const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, pool) {
        new Promise(function (resolve, reject) {
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
        }).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};
