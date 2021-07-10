// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const moment = require('moment');
const {v4: uuidv4} = require('uuid');
moment.locale('fr');

function prepareData(data, pair, interval, count, insert_date, insert_hour, timestamp){
    let ohlcs = [];
    let time = 0;
    let time_date = 0;
    let time_hour = 0;
    if(count > 0){
        let i = data[pair].length-1;
        if(interval === "1_HOUR"){
            time = data[pair][i][0];
            time_date = moment(time).format('L');
            time_hour = moment(time).format('LTS');
        }else{
            var len = Math.ceil(Math.log(data[pair][i][0] + 1) / Math.LN10);
            if(len === 13){
                time = data[pair][i][0];
            }else{
                time = data[pair][i][0]*1000;
            }
            time_date = moment(time).format('L');
            time_hour = moment(time).format('LTS');
        }
		
		let id = uuidv4();
		
        var ohlc = {
			id,
            insert_date: insert_date,
            insert_timestamp: timestamp,
            pair: pair,
            interval: interval,
            ime: time,
            time_date: time_date,
            time_hour: time_hour,
            open: data[pair][i][1],
            high: data[pair][i][2],
            low: data[pair][i][3],
            close: data[pair][i][4],
            swap: data[pair][i][5],
            volume: data[pair][i][6],
            count: data[pair][i][7]
        }
        ohlcs.push(ohlc);
    }else{
        // FIRST LOAD
		logger.warn("*** CONTROLLER *** -> First OHLC Loading ... ");
        for(let i=0; i<data[pair].length; i++){
            if(interval === "1_HOUR"){
                time = data[pair][i][0];
				time_date = moment(time).format('L');
				time_hour = moment(time).format('LTS');
            }else{
                var len = Math.ceil(Math.log(data[pair][i][0] + 1) / Math.LN10);
                if(len === 13){
                    time = data[pair][i][0];
                }else{
                    time = data[pair][i][0]*1000;
                }
                time_date = moment(time).format('L');
				time_hour = moment(time).format('LTS');
            }
			
			let id = uuidv4();
			
            var ohlc = {
				id,
                insert_date: insert_date,
                insert_timestamp: timestamp,
                pair: pair,
                interval: interval,
                ime: time,
				time_date: time_date,
				time_hour: time_hour,
                open: data[pair][i][1],
                high: data[pair][i][2],
                low: data[pair][i][3],
                close: data[pair][i][4],
                swap: data[pair][i][5],
                volume: data[pair][i][6],
                count: data[pair][i][7]
            }
            ohlcs.push(ohlc);
        }
    }
    return ohlcs;
}

module.exports = {
    insertOHLC: function (callback, data, pair, interval, count, insert_date, timestamp, param_fw1) {
        var ohlcs = prepareData(data, pair, interval, count, insert_date, insert_hour, timestamp);
        new Promise(function (resolve, reject) {
            if(myAssetPairs.length > 0){
				var getConnection = require('../../config/db_mysql_config');
				getConnection(function (err, con) {
					if(err) {  
						reject(err);
					}
					var sql = "INSERT INTO T_OHLC_OHL_APR (OHL_ID, OHL_INSERT_DATE, OHL_INSERT_TSTP, OHL_PAIR, OHL_INTERVAL, OHL_TIME, OHL_TIME_DATE, OHL_TIME_HOUR, OHL_OPEN, OHL_HIGH, IHL_LOW, OHL_CLOSE, OHL_SWAP, OHL_VOLUME, OHL_COUNT) VALUES ?";
					con.query(sql, [ohlcs], function (err, res) {
						if (err) {
							reject(err);
						}
						logger.warn('*** DB *** ->  Number of records in T_OHLC_OHL inserted: '+ res.affectedRows);
						resolve(true);
					});
				});
            }else{
                resolve(true);
            }
        }).then(function(res){
            callback(null, res, param_fw1);
        }).catch(function(err) {
            callback(err, null);
        });
    },
	countOHLC: function (callback, interval, param_fw1) {
        new Promise(function (resolve, reject) {
            var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) {  
					reject(err);
				}
				var sql = "SELECT COUNT(*) FROM T_OHLC_OHL WHERE OHL_INTERVAL = '"+interval+"";
				con.query(sql, function (err, res, fields) {
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
    getLast14OHLC_1h: function (callback, pair, param_fw1, param_fw2) {
        new Promise(function (resolve, reject) {
           
        }).then(function(data){
            callback(null, data, pair, param_fw1, param_fw2);
        }).catch(function(err) {
            callback(err, null);
        });
    },
    getLast14OHLC_1d: function (callback, pair, param_fw1, param_fw2) {
        new Promise(function (resolve, reject) {
            
        }).then(function(data){
            callback(null, data, pair, param_fw1, param_fw2);
        }).catch(function(err) {
            callback(err, null);
        });
    }

};

