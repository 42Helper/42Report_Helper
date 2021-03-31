const db = require('../db/dbconnection');

const addReportLog = (user_id) => {
    return new Promise(function(resolve, reject){    
        db.query(
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
                    console.log("week : ", weekNum);
                    db.query(
                        `UPDATE user SET ${weekNum} = ${weekNum} + 1 WHERE user_id="${user_id}"`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            }
                            else {
                                console.log(results);
                                resolve(results);
                            }
                        }
                    );
                }
            }
        );
    });
};

module.exports = addReportLog;
