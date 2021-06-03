const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, db) {
        new Promise(function (resolve, reject) {
			db.getConnection((err, conn) => {
				if (error){
					reject(error);
				}
				conn.query('SELECT * from users LIMIT 1', (error, results, fields) => {
					if (error){
						reject(error);
					}
					console.log(results);
					conn.release();
				});
			});
        }).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};
