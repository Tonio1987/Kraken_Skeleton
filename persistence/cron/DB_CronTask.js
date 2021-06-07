const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback) {
		var getConnection = require('../../config/db_mysql_config');
		getConnection(function (err, con) {
			if(err) { 
				callback(err, null);
			}
			var userQuery = 'SELECT * FROM TR_CRON_TASKS_CTK;';
			con.query(userQuery, function(err, res){
				if(err) {
					console.log("error here: " + err); 
					callback(err, null);
				}
				console.log("RESULT IS : " + res);
				con.release();
				callback(null, res);
			});
		});
	}
};
