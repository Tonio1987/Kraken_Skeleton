const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, db) {
		console.log("db is a " + db);
        new Promise(function (resolve, reject) {
			console.log("enter promise");
			db(function (err, con) {
				if(err) {
					console.log("err: " + err); 
				}
				var userQuery = 'select * from TR_CRON_TASKS_CTK';
				console.log("con: " + con); 
				con.query(userQuery,function(err,res){
					console.log(res);
					con.release();
					resolve(res);
				});
			});
        }).then(function(data){
			console.log("then");
            callback(null, data);
        }).catch(function(err) {
			console.log("ERROR");
            callback(err, null);
        });
    }
};
