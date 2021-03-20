const mysql = require("mysql");
const root = require("../db/dbrootInfo.js");

const addReportLog = (user_id) => {
    let connection = mysql.createConnection(root);
    connection.connect();
    connection.query(
        `SET @week = (SELECT period.week
            FROM period
            WHERE now() >= period.start_of_week AND now() <= period.end_of_week);
        INSERT INTO report(user_id, created_week) VALUES ("${user_id}", @week);
        UPDATE user SET week1=(SELECT COUNT(*) FROM report WHERE user_id="${user_id}" AND created_week=1);
        UPDATE user SET week2=(SELECT COUNT(*) FROM report WHERE user_id="${user_id}" AND created_week=2);
        UPDATE user SET week3=(SELECT COUNT(*) FROM report WHERE user_id="${user_id}" AND created_week=3);
        UPDATE user SET week4=(SELECT COUNT(*) FROM report WHERE user_id="${user_id}" AND created_week=4);`,
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
