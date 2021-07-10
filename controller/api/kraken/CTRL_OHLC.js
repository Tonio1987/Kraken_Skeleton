// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const DB_AssetPairs = require('../../../persistence/kraken/DB_AssetPairs');
const DB_OHLC = require('../../../persistence/kraken/DB_OHLC');
const API_OHLC = require('../../../api/kraken/API_OHLC');
const async = require('async');
const moment = require('moment/moment');


module.exports = {
    /*
        CONTROLLER DESCRIPTION
        1 - We take in DB all actives pairs 
        2 - We count the number of docs in collection OHLC -> For init first data loading
        3 - For all pairs
            3.1 - We load OHLC via Kraken API
            3.2 - We insert in DB the OHLC
    */
    LoadOHLC_1h: function () {
        let insert_date = moment().format('YYYY-MM-DD HH:mm:ss');
        let timestamp = new Date().getTime();
        async.waterfall([
            STEP_DB_getAllEurPairsName,
            STEP_DB_countOHLC,
            STEP_API_loadOHLC,
            STEP_DB_insertOHLC,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

        function STEP_DB_getAllEurPairsName() {
            DB_AssetPairs.getAllEirPairsName(STEP_DB_countOHLC);
        }

        function STEP_DB_countOHLC(err, allPairs) {
            DB_OHLC.countOHLC(STEP_API_loadOHLC, "1_HOUR" , allPairs);
        }

        function STEP_API_loadOHLC(err, count, allPairs) {
            if(!err){
				// FIRST LOAD
				console.log(count);
				if(count === 0){
					logger.warn("*** CONTROLLER *** -> First OHLC Loading ... ");
				}
				
				logger.warn("*** CONTROLLER *** -> Number of OHLC to load : "+ allPairs.length);
                for(let i=0; i<allPairs.length; i++){
                    if (i+1 == allPairs.length){
                        API_OHLC.kraken_OHLC_1h(STEP_DB_insertOHLC, allPairs[i].APR_NAME, count, true);
                    }else{
                        API_OHLC.kraken_OHLC_1h(STEP_DB_insertOHLC, allPairs[i].APR_NAME, count, false);
                    }
                }
            }else{
                STEP_finish(err);
            }
        }
        function STEP_DB_insertOHLC(err, data, pair, count, iter) {
			let tentative = 2;
            if(!err){
				logger.warn("*** CONTROLLER *** Loading OHLC for pair : "+ pair);
                DB_OHLC.insertOHLC(STEP_finish, data, pair, "1_HOUR", count, insert_date, timestamp, iter);
            }else{
				logger.error("*** CONTROLLER *** Erreur with pair : "+pair);
				if(tentative < 3){
					logger.warn("*** CONTROLLER *** Tentative #"+tentative+" for pair : "+pair);
					tentative++;
					API_OHLC.kraken_OHLC_1h(STEP_DB_insertOHLC, pair, count, iter);
				}else{
					STEP_finish(err);
				}
            }
        }
        function STEP_finish(err, data, iter) {
            if(err){
                logger.error(err);
                logger.error('*** CONTROLLER *** ->  Process Load OHLC 1 HOUR ... [ FAILED ]');
            }
            if(iter === true){
                logger.info('*** CONTROLLER *** ->  Process Load OHLC 1 HOUR ... [ DONE ]');
            }
        }
    },
    LoadOHLC_1d: function () {
        let insert_date = moment().format('L');
        let insert_hour = moment().format('LTS');
        let timestamp = new Date().getTime();
        async.waterfall([
            STEP_DB_getAllPairs,
            STEP_DB_countOHLC,
            STEP_API_loadOHLC,
            STEP_DB_insertOHLC,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

        function STEP_DB_getAllPairs() {
            DB_AssetPairs.getAllPairs(STEP_DB_countOHLC);
        }

        function STEP_DB_countOHLC(err, allPairs) {
            DB_OHLC.countOHLC(STEP_API_loadOHLC, "1_DAY", allPairs);
        }

        function STEP_API_loadOHLC(err, count, allPairs) {
            if (!err) {
                for(let i=0; i<allPairs.length; i++){
                    if (i+1 == allPairs.length){
                        API_OHLC.kraken_OHLC_1d(STEP_DB_insertOHLC, allPairs[i].APR_NAME, count, true);
                    }else{
                        API_OHLC.kraken_OHLC_1d(STEP_DB_insertOHLC, allPairs[i].APR_NAME, count, false);
                    }
                }
            } else {
                STEP_finish(err);
            }
        }

        function STEP_DB_insertOHLC(err, data, pair, count, iter) {
            if (!err) {
                DB_OHLC.insertOHLC(STEP_finish, data, pair, "1_DAY", count, insert_date, insert_hour, timestamp, iter);
            } else {
                console.log('Erreur with pair : ' + pair);
                STEP_finish(err);
            }
        }

        function STEP_finish(err, data, iter) {
            if(err){
                logger.error(err);
                logger.error('*** CONTROLLER *** ->  Process Load OHLC 1 DAY ... [ FAILED ]');
            }
            if(iter){
                logger.info('*** CONTROLLER *** ->  Process Load OHLC 1 DAY ... [ DONE ]');
            }
        }
    }
};