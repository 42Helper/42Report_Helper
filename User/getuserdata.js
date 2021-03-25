const mysql = require("mysql");
const root = require("../db/dbrootInfo.js");
const connection = mysql.createConnection(root);
connection.connect();

let getUserData = function () {
    return new Promise(function(resolve, reject) {
        try{
            connection.query(`SELECT week
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
                        connection.query(`SELECT user_id, on_off, ${week} 
                        FROM user
                        WHERE ${week} < 5;`,
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