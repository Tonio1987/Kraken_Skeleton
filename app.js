// CONFIGURE ENV
require('dotenv').config();


// CALL CRON MODULES 
const cron = require('node-cron');

// INIT MYSQL MODULE
const db = require('./config/db_mysql_config');

db(function (err, con) {
	if(err) {}
	var userQuery = 'select * from user';
	console.log("con: " + con); 
	con.query(userQuery,function(err,user){
	console.log(user);
	con.release();
	});
});



// CALL WEB MODULES
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');

// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

logger.info('************************************************************************');
logger.info('*****************            - FonZzTonio -            *****************');
logger.info('********************      --------------------      ********************');
logger.info('************************  KRAKEN TRADING ROBOT  ************************');
logger.info('********************      --------------------      ********************');
logger.info('*****************               2021 (c)               *****************');
logger.info('************************************************************************');
logger.info('------> Starting server ...  ');

// INIT EXPRESS APP
logger.info('------> Express initialisation ...  ');
var app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));

// CALL ROUTES
logger.info('------> Loading HTTP routes ...  ');

var indexRouter = require('./routes/index');
app.use('/', indexRouter);


// SCHEDULER INITIALISATION
logger.info('-------> Scheduler initialization ...  ');


module.exports = app;

logger.info('-------> Server started !');


