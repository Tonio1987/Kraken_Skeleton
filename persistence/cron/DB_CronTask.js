const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, pool) {
        new Promise(function (resolve, reject) {
			
			pool.getConnection(function(err, conn){
				conn.query("SELECT * FROM TR_CRON_TASKS_CTK", function(error, rows) {
					if (error){
						reject(error);
					}
					
					console.log(rows); 
					console.log('The results is: ', fields);
					conn.release();
					resolve(rows);
				});
			});
        }).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};
