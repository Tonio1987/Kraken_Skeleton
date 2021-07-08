// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const DB_AssetPairs = require('../../../persistence/kraken/DB_AssetPairs');
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
            STEP_DB_getAllPairsName,
            STEP_API_loadTicker,
            STEP_DB_insertTicker,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

        function STEP_DB_getAllPairsName() {
            DB_AssetPairs.getAllPairsName(STEP_API_loadTicker);
        }
        function STEP_API_loadTicker(err, allPairs) {
            if(!err){
				logger.info('*** CONTROLLER *** -> Number of pairs for which we ask the price  : '+allPairs.length);
                for(let i=0; i<allPairs.length; i++){
                    if (i+1 == allPairs.length){
                        API_Ticker.kraken_Ticker(STEP_DB_insertTicker, allPairs[i].APR_NAME, true);
                    }else{
                        API_Ticker.kraken_Ticker(STEP_DB_insertTicker, allPairs[i].APR_NAME, false);
                    }
                }
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