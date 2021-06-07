const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback) {
		var getConnection = require('../../config/db_mysql_config');
		getConnection(function (err, con) {
			if(err) { 
				console.log("error on con: " + err); 
				callback(err, null);
			}
			var userQuery = 'SELECT * FROM TR_CRON_TASKS_CTK';
			console.log(userQuery);
			
			con.query(userQuery, function(err, res){
				if(err) {
					console.log("error on query: " + err); 
					callback(err, null);
				}
				console.log("RESULT IS : " + res);
				con.release();
				
				callback(err, res);
			});
		});
	}
};
