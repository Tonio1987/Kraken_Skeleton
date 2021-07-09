// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const DB_AssetPairs = require('../../../persistence/kraken/DB_AssetPairs');
const DB_Balance = require('../../../persistence/kraken/DB_Balance');
const DB_Ticker = require('../../../persistence/kraken/DB_Ticker');
const API_Ticker = require('../../../api/kraken/API_Ticker');
const async = require('async');
const moment = require('moment/moment');


module.exports = {

    /*
        CONTROLLER DESCRIPTION
        1 - We take in DB all actives pairs name
        2 - For all pairs
            2.1 - We load Ticker via Kraken API
            2.2 - We insert in DB the Ticker
    */


    LoadTicker: function () {
        let insert_date = moment().format('YYYY-MM-DD HH:mm:ss');
        let timestamp = new Date().getTime();
        async.waterfall([
			STEP_DB_getLastInvestedAsset,
            STEP_DB_getEurPairName,
            STEP_API_loadTicker,
            STEP_DB_insertTicker,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

		function STEP_DB_getLastInvestedAsset() {
            DB_Balance.getLastInvestedAsset(STEP_DB_getEurPairName);
        }
		
        function STEP_DB_getEurPairName(err, data) {
			if(!err){
				let ethHandled = false;
				let currency;
				let currencies = [];
				for(let i=0; i<data.length; i++){
					// Gestion du stacking de cryptos hors ETH
					if(data[i].BAL_CURRENCY.slice(-2) == '.S' && data[i].BAL_CURRENCY != 'ETH2.S'){
						currency = data[i].BAL_CURRENCY.slice(0, -2);
						currencies.push(currency);
					} // Gestion du pre-stacking ETH
					else if(data[i].BAL_CURRENCY === 'XETH' || data[i].BAL_CURRENCY === 'ETH2' || data[i].BAL_CURRENCY === 'ETH2.S'){
						currency = 'XETH';
						if(ethHandled === false){
							currencies.push(currency);
						}
						ethHandled = true;	
					}else{
						currency = data[i].BAL_CURRENCY;
						currencies.push(currency);
					}
				}
				
				// Utilisation de l'objet Set pour filtrer les doublons
				const uniqueSetCurrencies = new Set(currencies);
				// Transfor,ation du Set en Array
				const uniqueArrayCurrencies = [...uniqueSetCurrencies];
				
				logger.info('*** CONTROLLER *** -> Number of pairs for which we ask the price  : '+uniqueArrayCurrencies.length);
				for(let i=0; i<uniqueArrayCurrencies.length; i++){
					if (i+1 == uniqueArrayCurrencies.length){
						DB_AssetPairs.getEurPairName(STEP_API_loadTicker, uniqueArrayCurrencies[i], true);
                    }else{
                        DB_AssetPairs.getEurPairName(STEP_API_loadTicker, uniqueArrayCurrencies[i], false);
                    }
				}
			}else{
                STEP_finish(err);
            }
        }
        function STEP_API_loadTicker(err, pair, iter) {
            if(!err){
				API_Ticker.kraken_Ticker(STEP_DB_insertTicker, pair[0].APR_NAME, iter);
            }else{
                STEP_finish(err);
            }
        }
        function STEP_DB_insertTicker(err, data, pair, iter) {
            if(!err){
                DB_Ticker.insertTicker(STEP_finish, data, pair, insert_date, timestamp, iter);
            }else{
                logger.error('*** CONTROLLER *** -> Erreur with pair : '+pair);
                STEP_finish(err);
            }
        }
        function STEP_finish(err, data, iter) {
            if(err){
                logger.error(err);
                logger.error('*** CONTROLLER *** ->  Process Load Ticker... [ FAILED ]');
            }
            if(iter){
                logger.info('*** CONTROLLER *** ->  Process Load Ticker ... [ DONE ]');
            }
        }
    }
};