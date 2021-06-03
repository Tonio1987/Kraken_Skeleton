const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, pool) {
        new Promise(function (resolve, reject) {
			
			pool.query('SELECT * FROM TR_CRON_TASKS_CTK', function(error, rows, fields) {
				if (error){
					reject(error);
				}
				console.log(rows[0].example); 
				console.log('The results is: ', fields);
				pool.release();
				resolve(rows);
			});
		
        }).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};
