const root = require("../db/dbrootInfo.js");
const mysql = require("mysql");
const connection = mysql.createConnection(root);

connection.connect();

let getPeriod = function () {
    return new Promise(function(resolve, reject) {
        try{
            connection.query(`SELECT week
            FROM period
            WHERE now() >= start_of_week AND now() <= end_of_week;`,
            function(error, results){
                resolve(results[0].week);
            });
        } catch {
            resolve(null);
        }
    });
};

module.exports = getPeriod;