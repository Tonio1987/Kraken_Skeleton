const moment = require('moment/moment');

moment.locale('fr');

module.exports = {
    getCronTasks: function (callback, db) {
        new Promise(function (resolve, reject) {
			db(function (err, con) {
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
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};
