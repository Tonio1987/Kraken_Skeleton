const kraken = require('node-kraken-api');
const moment = require('moment');

moment.locale('fr');

const api = kraken({
    key: process.env.KRAKEN_KEY,
    secret: process.env.KRAKEN_SECRET,
    tier: '0'
});

module.exports = {
    kraken_Time: function(callback) {
		console.log("here2");
        return new Promise(function (resolve, reject) {
            api.call('Time', (err, data) => {
                if (err) {
                    console.error(err);
                    reject(true);
                }
				console.log("here3");
				logger.info('*** API *** ->  Kraken server Up ! - Time server : '+data.rfc1123);
                resolve(data);
            });
        }).then(function(res){
			console.log("here4");
            callback(null, res);
        }).catch(function(err) {
			console.log("here5");
            callback(err, null);
        });
    }
};
