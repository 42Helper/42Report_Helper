const mysql = require("mysql");
const root = require("../db/dbrootInfo.js");

let connection = mysql.createConnection(root);
connection.connect();

const addReportLog = (user_id) => {
<<<<<<< HEAD
    return new Promise(function(resolve, reject){    
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
                                resolve(results);
                            }
                        }
                    );
                }
            }
        );
    });
=======
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
>>>>>>> e11ba3816989d503ad90b62ecd8aee937b13d11d
};

module.exports = addReportLog;
