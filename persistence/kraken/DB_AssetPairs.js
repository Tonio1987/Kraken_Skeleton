const moment = require('moment');
const {v4: uuidv4} = require('uuid');

var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

moment.locale('fr');
function prepareData(data){
    var date = moment().format('YYYY-MM-DD HH:mm:ss');
    var timestamp = new Date().getTime();
    var myAssetPairs = [];
    let i = 0;
    let darkpool = false;
	
	
    for (let asset in data) {
        let lastTwo = asset.substr(asset.length - 2);
        if(lastTwo === ".d"){darkpool = true;}else{darkpool = false;}
		let id = uuidv4();
        if (data.hasOwnProperty(asset)) {
			var ass = [
				id,
				date, 
				timestamp,
				darkpool,
				asset,
				data[asset].altname,
				data[asset].wsname,
				data[asset].aclass_base,
				data[asset].base,
				data[asset].aclass_quote,
				data[asset].quote,
				data[asset].lot,
				data[asset].pair_decimals,
				data[asset].lot_decimals,
				data[asset].lot_multiplier,
				data[asset].fee_volume_currency,
				data[asset].margin_call,
				data[asset].margin_stop,
				1
			];
			myAssetPairs.push(ass);
			i++;
		}
	}
	return myAssetPairs;
}

module.exports = {
    dropAssetPairs: function(callback){
        new Promise(function (resolve, reject) {
			var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) {  
					reject(err);
				}
				var sql = "DELETE FROM TR_ASSET_PAIR_APR";
				con.query(sql, function (err, res) {
					if (err) {
						reject(err);
					}
					logger.warn('*** DB *** ->  Number of records in TR_ASSET_PAIR_APR deleted: '+ res.affectedRows);
					con.release();
					resolve(res);
				});
			});
        }).then(function(res){
            callback(res);
        }).catch(function(err) {
            callback(err);
        });
    },
    insertAssetPairs: function (callback, data) {
        var myAssetPairs = prepareData(data);
        new Promise(function (resolve, reject) {
            if(myAssetPairs.length > 0){
				var getConnection = require('../../config/db_mysql_config');
				getConnection(function (err, con) {
					if(err) {  
						reject(err);
					}
					var sql = "INSERT INTO TR_ASSET_PAIR_APR (APR_ID, APR_INSERT_DATE, APR_INSERT_TSTP, APR_DARKPOOL, APR_NAME, APR_ALTNAME, APR_WSNAME, APR_ACLASS_BASE, APR_BASE, APR_ACLASS_QUOTE, APR_QUOTE, APR_LOT, APR_PAIR_DECIMALS, APR_LOT_DECIMALS, APR_LOT_MULTIPLIER, APR_FEE_VOLUME_CURRENCY, APR_MARGIN_CALL, APR_MARGIN_STOP, APR_ACTIVE) VALUES ?";
					con.query(sql, [myAssetPairs], function (err, res) {
						if (err) {
							reject(err);
						}
						logger.warn('*** DB *** ->  Number of records in TR_ASSET_PAIR_APR inserted: '+ res.affectedRows);
						resolve(true);
					});
				});
            }else{
                resolve(true);
            }
        }).then(function(res){
            callback(null, res);
        }).catch(function(err) {
            callback(err, null);
        });
    },
    getAllPairsName: function (callback) {
        new Promise(function (resolve, reject) {
            var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) {  
					reject(err);
				}
				var sql = "SELECT APR_NAME FROM TR_ASSET_PAIR_APR WHERE APR_ACTIVE = 1";
				con.query(sql, function (err, res, fields) {
					if (err) {
						reject(err);
					}
					con.release();
					resolve(res);
				});
			});
        }).then(function(data){
            callback(null, data);
        }).catch(function(err) {
            callback(err, null);
        });
    },
    getEurPairName: function (callback, currency, param_fw1) {
        new Promise(function (resolve, reject) {
            var getConnection = require('../../config/db_mysql_config');
			getConnection(function (err, con) {
				if(err) {  
					reject(err);
				}
				
				// Gestion du stacking de cryptos
				if(currency.slice(-2) == '.S'){
					currency = currency.slice(0, -2);
				}
				
				// Gestion du pre-stacking ETH2
				if(currency === 'ETH2'){
					currency = 'XETH';
				}
				
				var sql = "SELECT APR_NAME FROM TR_ASSET_PAIR_APR WHERE APR_BASE = '"+currency+"' AND APR_QUOTE IN('ZEUR', 'EUR')";
				con.query(sql, function (err, res, fields) {
					if (err) {
						reject(err);
					}
					con.release();
					resolve(res);
				});
			});
        }).then(function(data){
            callback(null, data, param_fw1);
        }).catch(function(err) {
            callback(err, null);
        });
    }
};


/*
Query to disable useless pairs
UPDATE kraken_robot.TR_ASSET_PAIR_APR SET APR_ACTIVE = 0
WHERE APR_QUOTE IN('ZAUD', 'ZGBP', 'ZJPY', 'ZCAD', 'CHF', 'DOT', 'DAI', 'USDT', 'USDC', 'ZUSD');

*/
