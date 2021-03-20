const mysql = require("mysql");
const root = require("../db/dbrootInfo.js");

const addReportLog = (user_id) => {
    let connection = mysql.createConnection(root);
    connection.connect();
    connection.query(
        `INSERT INTO report(user_id, created_week) VALUES ("${user_id}",\
        (SELECT period.week
            FROM period
            WHERE now() >= period.start_of_week AND now() <= period.end_of_week));`,
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
