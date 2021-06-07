const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, db) {
		console.log("db is a " + db);
        new Promise(function (resolve, reject) {
			console.log("enter promise");
			db(function (err, con) {
				console.log("enter db");
				if(err) { 
					reject(err);
				}
				var userQuery = 'select * from user';
				console.log("con: " + con); //displays undefined
				con.query(userQuery,function(err, res){
					if(err) { 
						reject(err);
					}
					resolve(res);
					con.release();
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
