// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const DB_Balance = require('../../../persistence/kraken/DB_Balance');
const API_Balance = require('../../../api/kraken/API_Balance');
const async = require('async');
const moment = require('moment/moment');


module.exports = {
	/*
		CONTROLLER DESCRIPTION
		1 - We load Last Balance via Kraken API
		2 - We insert in DB the new balance
	*/

    LoadBalance: function () {
        let insert_date = moment().format('YYYY-MM-DD HH:mm:ss');
        let timestamp = new Date().getTime();
        async.waterfall([
            STEP_API_loadBalance,
            STEP_DB_insertBalance,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

        function STEP_API_loadBalance() {
            API_Balance.kraken_Balance(STEP_DB_insertBalance);
        }
        function STEP_DB_insertBalance(err, data) {
            if(!err){
				DB_Balance.insertBalance(STEP_finish, insert_date, timestamp, data);
            }else{
                STEP_finish(err);
            }
        }
        function STEP_finish(err, data) {
            if(err){
                logger.error(err);
                logger.error('*** CONTROLLER *** ->  Process Load Balance ... [ FAILED ]');
            }
            logger.info('*** CONTROLLER *** ->  Process Load Balance ... [ DONE ]');
        }
    }
};