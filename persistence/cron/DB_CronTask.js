const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback) {
		var getConnection = require('../../config/db_mysql_config');

		console.log("getConnection is a " + getConnection);

		getConnection(function (err, con) {
			if(err) { 
				callback(null, err);
			}
			var userQuery = 'SELECT * FROM TR_CRON_TASKS_CTK;';
			console.log("con: " + con); 
			con.query(userQuery, function(err,user){
				if(err) {
					console.log("err: " + err); 
					callback(null, err);
				}
				console.log(res);
				callback(res, null);
				con.release();
		});
    });
}
