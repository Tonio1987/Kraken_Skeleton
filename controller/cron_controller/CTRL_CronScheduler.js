// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const async = require('async');
const moment = require('moment');

const CRON_scheduler = require('../../cron/CRON_scheduler');
const DB_CronTask = require('../../persistence/cron/DB_CronTask');

module.exports = {
    Init_CronScheduler: function (db) {
        async.waterfall([
            STEP_DB_getCronTasks,
            STEP_CRON_initTasksScheduler,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

        function STEP_DB_getCronTasks(db) {
            DB_CronTask.getCronTasks(STEP_CRON_initTasksScheduler, db);
        }

        function STEP_CRON_initTasksScheduler(err, tasks) {
            if(!err){
                CRON_scheduler.initTasksScheduler(STEP_finish, tasks);
            }else{
                STEP_finish(err, null);
            }
        }

        function STEP_finish(err, data) {
            if (err) {
                logger.error(err);
                logger.error('*** CONTROLLER *** ->  Process Load CRON Tasks ... [ FAILED ]');
            }
        }
    },
    Reload_CronScheduler: function (db) {
        async.waterfall([
            STEP_DB_getCronTasks,
            STEP_CRON_reloadTasksScheduler,
            STEP_finish
        ], function (err, result) {
            // Nothing to do here
        });

        function STEP_DB_getCronTasks(db) {
            DB_CronTask.getCronTasks(STEP_CRON_reloadTasksScheduler, db);
        }

        function STEP_CRON_reloadTasksScheduler(err, tasks) {
            if(!err){
                CRON_scheduler.reloadTasksScheduler(STEP_finish, tasks);
            }else{
                STEP_finish(err, null);
            }
        }

        function STEP_finish(err, data) {
            if (err) {
                logger.error(err);
                logger.error('*** CONTROLLER *** ->  Process Load CRON Tasks ... [ FAILED ]');
            }
        }
    }
};
