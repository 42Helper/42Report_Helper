const mysql = require("mysql");
const root = require("../db/dbrootInfo.js");

const addReportLog = (user_id) => {
    let connection = mysql.createConnection(root);
    connection.connect();
    connection.query(
        `INSERT INTO Report(user_id) VALUES ("${user_id}")`,
        function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                console.log(results);
            }
        }
    );
    connection.end();
};

module.exports = addReportLog;
