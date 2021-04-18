const db = require('../db/dbconnection');

let getPeriod = function (date) {
    return new Promise(function(resolve, reject) {
        try{
            db.query(`SELECT week
            FROM period
            WHERE "${date}" >= start_of_week AND "${date}" <= end_of_week;`,
            function(error, results){
                if (results[0] !== undefined) {
                    resolve(results[0].week);
                } else{
                    resolve(null);
                }
            });
        } catch {
            resolve(null);
        }
    });
};

module.exports = getPeriod;