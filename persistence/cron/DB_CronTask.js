const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, db) {
		console.log("db is a " + db);
		db(function (err, con) {
			console.log("con " + con);
			if(err) {
				callback(null, err);
			}
			var userQuery = 'SELECT * FROM TR_CRON_TASKS_CTK;';
			console.log("con: " + con); 
			con.query(userQuery,function(err,res){
				if(err) {
					console.log("err: " + err); 
					callback(null, err);
				}
				console.log(res);
				con.release();
				callback(res, null);
			});
		});

    }
};
