const mysql = require("mysql");
const root = require("../db/dbrootInfo.js");

const connection = mysql.createConnection(root);
connection.connect();

let userdata = function () {
    return new Promise(function(resolve, reject) {
        try{
            connection.query("SELECT user_id, intra_id, on_off FROM user;",
            function(error, results){
                resolve(results);
            });
        } catch {
            resolve(null);
        }
    });
};

module.exports = userdata;