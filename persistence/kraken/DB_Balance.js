const moment = require('moment');
const {v4: uuidv4} = require('uuid');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

moment.locale('fr');

module.exports = {
    insertBalance: function (callback, insert_date, timestamp, data) {
        new Promise(function (resolve, reject) {
			var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) {  
					reject(err);
				}
				let id = uuidv4();
				let balance = [[
					id,
					insert_date,
					timestamp, 
					
				]];
				
				var sql = "INSERT INTO T_BALANCE_BAL (BAL_ID, BAL_INSERT_DATE, BAL_INSERT_TSTP) VALUES ?";
				
				con.query(sql, [balance], function (err, res) {
					if (err) {
						reject(err);
					}
					con.release();
					resolve(res);
				});
			});
        }).then(function(res){
            callback(null, res, param_fw1);
        }).catch(function(err) {
            callback(err, null);
        });
    },
    getLastBalance: function (callback) {
        new Promise(function (resolve, reject) {
           
        }).then(function(data){
            callback(null, data, pair, param_fw1,  param_fw2, param_fw3);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};
