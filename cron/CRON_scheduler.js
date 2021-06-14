var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const cron = require('node-cron');
const moment = require('moment');

let server_start_time = moment();

// HANDLER DYNAMIC FUNCTION
let Handler={};

// CONTROLLER CALL
// KRAKEN API
// const CTRL_AssetPairs = require('../controller/api/kraken/CTRL_AssetPairs');

// INIT TASKS ATTRIBUTES
// SERVER CHECK TASKS
let task_ServerOk = null;
let task_KrakenServerOnline = null;

// LOAD DATA TASKS
let task_LoadAssetPairs = null;



// NODE SERVER IS ALIVE
Handler.init_task_ServerOk = function (cron_expression){
    task_ServerOk = cron.schedule(cron_expression, () =>  {
        logger.info('*** CRON SCHEDULER *** -> Node server up since '+ moment(server_start_time).locale('en').fromNow());
    }, {
        scheduled: false
    });
};

// KRAKEN SERVER IS ALIVE
Handler.init_task_KrakenServerOnline = function (cron_expression){
    task_KrakenServerOnline = cron.schedule(cron_expression, () =>  {
        logger.info('*** CRON SCHEDULER *** -> Check Kraken Server Time ... [ RUNNING ]');
        CTRL_Time.LoadTime();
    }, {
        scheduled: false
    });
};

// LOAD ASSET PAIRS
/*
Handler.init_task_LoadAssetPairs = function(cron_expression){
    task_LoadAssetPairs = cron.schedule(cron_expression, () =>  {
        logger.info('*** CRON SCHEDULER *** -> Load Asset Pairs ... [ RUNNING ]');
        CTRL_AssetPairs.LoadAssetPairs();
    }, {
        scheduled: false
    });
};
*/
// KRAKEN
Handler.start_task_ServerOk = function(){task_ServerOk.start();};
Handler.stop_task_ServerOk = function(){task_ServerOk.stop();};

Handler.start_task_KrakenServerOnline = function(){task_KrakenServerOnline.start();};
Handler.stop_task_KrakenServerOnline = function(){task_KrakenServerOnline.stop();};
/*
Handler.start_task_LoadAssetPairs = function(){task_LoadAssetPairs.start();};
Handler.stop_task_LoadAssetPairs = function(){task_LoadAssetPairs.stop();};
*/

module.exports = {
   initTasksScheduler: function (callback, tasks) {
       for(let i=0; i<tasks.length; i++) {
			let cron_expression = tasks[i].CTK_CRON_EXPR;
			let active = tasks[i].CTK_ACTIVE;
			let fctName = 'init_'+tasks[i].CTK_NAME;
			
			// INIT DU SCHEDULER
			Handler[fctName](cron_expression);

			if(active === 1){
				fctName = 'start_'+tasks[i].CTK_NAME;
				Handler[fctName](cron_expression);
			}

			if(active === 0){
				fctName = 'stop_'+tasks[i].CTK_NAME;
				Handler[fctName]();
			}
            
        }
        callback(null, tasks);
    },
    reloadTasksScheduler: function (callback, tasks) {
        for(let i=0; i<tasks.length; i++) {
            if (tasks.hasOwnProperty(i)) {
                let cron_expression = tasks[i].CTK_CRON_EXPR;
                let active = tasks[i].CTK_ACTIVE;
                let fctName = '';
                if(active === 1){
                    fctName = 'start_'+tasks[i].CTK_NAME;
                    Handler[fctName](cron_expression);
                }

                if(active === 0){
                    fctName = 'stop_'+tasks[i].CTK_NAME;
                    Handler[fctName]();
                }
            }
        }
        callback(null, tasks);
    }
};

