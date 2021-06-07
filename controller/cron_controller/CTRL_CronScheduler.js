// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const async = require('async');
const moment = require('moment');

const CRON_scheduler = require('../../cron/CRON_scheduler');
const DB_CronTask = require('../../persistence/cron/DB_CronTask');

module.exports = {
    Init_CronScheduler: function () {
        async.waterfall([
            STEP_DB_getCronTasks,
            STEP_CRON_initTasksScheduler,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

        function STEP_DB_getCronTasks() {
            DB_CronTask.getCronTasks(STEP_CRON_initTasksScheduler);
        }

        function STEP_CRON_initTasksScheduler(result, err_detection) {
            if(err_detection == 0){
                CRON_scheduler.initTasksScheduler(STEP_finish, result);
            }else{
                STEP_finish(result, 1);
            }
        }

        function STEP_finish(result, err_detection) {
            if (err_detection == 1) {
                logger.error(err);
                logger.error('*** CONTROLLER *** ->  Process Load CRON Tasks ... [ FAILED ]');
            }
        }
    },
    Reload_CronScheduler: function () {
        async.waterfall([
            STEP_DB_getCronTasks,
            STEP_CRON_reloadTasksScheduler,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

        function STEP_DB_getCronTasks() {
            DB_CronTask.getCronTasks(STEP_CRON_initTasksScheduler);
        }

        function STEP_CRON_initTasksScheduler(result, err_detection) {
            if(err_detection == 0){
                CRON_scheduler.initTasksScheduler(STEP_finish, result);
            }else{
                STEP_finish(result, 1);
            }
        }

        function STEP_finish(result, err_detection) {
            if (err_detection == 1) {
                logger.error(err);
                logger.error('*** CONTROLLER *** ->  Process Load CRON Tasks ... [ FAILED ]');
            }
        }
    }
};
