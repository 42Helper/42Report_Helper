const mysql = require("mysql");
const root = require("../db/dbrootInfo.js");

const addReportLog = (user_id) => {
    let connection = mysql.createConnection(root);
    connection.connect();
    connection.query(
        `SET @week = (SELECT period.week
            FROM period
            WHERE now() >= period.start_of_week AND now() <= period.end_of_week);
        SELECT @week;
        INSERT INTO report(user_id, created_week) VALUES ("${user_id}", @week);
        `,
        function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                let weekNum = 'week' + results[1][0]['@week'];
                connection.query(
                    `UPDATE user SET ${weekNum} = ${weekNum} + 1 WHERE user_id="${user_id}"`,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            console.log(results);
                        }
                    }
                );
            }
        }
    );
};

module.exports = addReportLog;
