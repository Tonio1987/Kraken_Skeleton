const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, db_pool) {
        new Promise(function (resolve, reject) {
            db_pool.query('SELECT * FROM TR_CRON_TASKS_CTK', function (error, results, fields) {
				if (error){
					reject(error);
				}	
				console.log('The results is: ', results);
				resolve(result);
			});	
        }).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};
