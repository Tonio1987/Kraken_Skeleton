const moment = require('moment');
const {v4: uuidv4} = require('uuid');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

moment.locale('fr');

function prepareData(insert_date, timestamp, data){
	let myBalance = [];
	for(let i in data){
		// Si le nombre d'unités data[i] de la currency i est > 0
		if(data[i] > 0){
			let id = uuidv4();
			let balanceAsset = [
				id,
				insert_date,
				timestamp, 
				i, 
				data[i]
			];
			myBalance.push(balanceAsset);
		}
	}
	return myBalance;
}

module.exports = {
    insertBalance: function (callback, insert_date, timestamp, data) {
		var myBalance = prepareData(insert_date, timestamp, data);
        new Promise(function (resolve, reject) {
			var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) {  
					reject(err);
				}
				
				var sql = "INSERT INTO T_BALANCE_BAL (BAL_ID, BAL_INSERT_DATE, BAL_INSERT_TSTP, BAL_CURRENCY, BAL_UNITS) VALUES ?";
				
				con.query(sql, [myBalance], function (err, res) {
					if (err) {
						reject(err);
					}
					con.release();
					resolve(res);
				});
			});
        }).then(function(res){
            callback(null, res);
        }).catch(function(err) {
            callback(err, null);
        });
    },
    getLastBalance: function (callback) {
        new Promise(function (resolve, reject) {
           
        }).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};
