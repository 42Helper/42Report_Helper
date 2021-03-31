const db = require('../db/dbconnection');

let getUserData = function () {
    return new Promise(function(resolve, reject) {
        try{
            db.query(`SELECT week
            FROM period
            WHERE start_of_week <= now() AND now() <= end_of_week;`
            , function(error, results){
                if (error){
                    console.error(error);
                }
                else{
                    if (results[0] === undefined)
                        console.log("보고서 작성 기간이 아님")
                    else {
                        const week = `week` + results[0].week;
                        db.query(`SELECT user_id, ${week} as count, on_off 
                        FROM user;`,
                        function(error, results){
                            resolve(results);
                        });
                    }
                }
            });
        } catch {
            resolve(null);
        }
    });
};

module.exports = getUserData;