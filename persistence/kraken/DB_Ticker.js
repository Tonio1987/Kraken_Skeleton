const moment = require('moment');
const {v4: uuidv4} = require('uuid');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

moment.locale('fr');

module.exports = {
    insertTicker: function (callback, data, pair, insert_date, timestamp, param_fw1) {
        new Promise(function (resolve, reject) {
			var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) {  
					reject(err);
				}
				let id = uuidv4();
				let ticker = [[
					id,
					insert_date,
					timestamp, 
					data[pair].a[0],
					data[pair].b[0],
					data[pair].c[0],
					data[pair].v[0],
					data[pair].v[1],
					data[pair].p[0],
					data[pair].p[1],
					data[pair].t[0],
					data[pair].t[1],
					data[pair].l[0],
					data[pair].l[1],
					data[pair].h[0],
					data[pair].h[1],
					data[pair].o
				]];
				
				var sql = "INSERT INTO T_TICKER_TIC (TIC_ID, TIC_INSERT_DATE, TIC_INSERT_TSTP,  TIC_PAIR, TIC_ASK_PRICE, TIC_BID_PRICE, TIC_LAST_TRADE_CLOSED_PRICE, TIC_VOL_TODAY, TIC_VOL_LAST24, TIC_VOL_WGHTED_AVG_PRICE_TODAY, TIC_VOL_WGHTED_AVG_PRICE_LAST24, TIC_NBR_TRADES_TODAY, TIC_NBR_TRADES_LAST24, TIC_LOW_TODAY, TIC_LOW_LAST24, TIC_HIGH_TODAY, TIC_HIGH_LAST24, TIC_OPENINIG_PRICE) VALUES ?";
				
				con.query(sql, [ticker], function (err, res) {
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
    getLastTicker: function (callback, pair, param_fw1,  param_fw2, param_fw3) {
        new Promise(function (resolve, reject) {
           
        }).then(function(data){
            callback(null, data, pair, param_fw1,  param_fw2, param_fw3);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};

