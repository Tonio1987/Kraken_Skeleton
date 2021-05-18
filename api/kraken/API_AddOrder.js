// LOG SYSTEM
var log4js = require('log4js');
var logger = log4js.getLogger();
logger.level = 'debug';

const kraken = require('node-kraken-api');
const moment = require('moment');

const api = kraken({
    key: process.env.KRAKEN_KEY,
    secret: process.env.KRAKEN_SECRET,
    tier: '0'
});

function loop(i, orders, callback) {
    if (i < orders.length){
        new Promise(function (resolve, reject) {
            logger.warn('***   API   *** - ADD ORDER : '+orders[i].type+' '+orders[i].ordertype+' '+orders[i].volume+' '+orders[i].pair+' price : '+orders[i].price);

            api.call('AddOrder',
            {
                pair: orders[i].pair,
                type:  orders[i].type,
                ordertype:  orders[i].ordertype,
                price:  orders[i].price,
                volume:  orders[i].volume,
                starttm:  orders[i].starttm,
                expiretm:  orders[i].expiretm
            }, (err, data) => {
                if (err) {
                    reject(err);
                }
                resolve(data);
            });
        }).then(function(data){
            i = i+1;
            if(i < orders.length){
                var newfct = loop.bind(null, i, orders, callback)
                newfct();
            }else{
                callback(null, orders);
            }
        }).catch(function(err) {
            callback(err, null);
        });
    }else{
        callback(null, orders);
    }
}

module.exports = {
    kraken_AddOrder: function(callback, orders) {
        let i = 0;
        loop(i, orders, callback);
    }
};
