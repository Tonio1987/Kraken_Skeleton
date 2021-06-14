const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback) {
		new Promise(function (resolve, reject) {
			var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) { 
					console.log("error on con: " + err); 
					reject(err);
				}
				var userQuery = 'SELECT * FROM TR_CRON_TASKS_CTK';
				console.log(userQuery);
				
				con.query(userQuery, function(err, res){
					if(err) {
						console.log("error on query: " + err); 
						reject(err);
					}
					con.release();
					console.log("Connection released");
					console.log(res);
					resolve(res);
				});	
			});
		}).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
	}
};
