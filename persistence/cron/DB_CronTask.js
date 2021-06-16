const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback) {
		new Promise(function (resolve, reject) {
			var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) { 
					reject(err);
				}
				var userQuery = 'SELECT * FROM TR_CRON_TASK_CTK';
				
				con.query(userQuery, function(err, res){
					if(err) { 
						reject(err);
					}
					con.release();
					resolve(res);
				});
			});
		}).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
	}
}
