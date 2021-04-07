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
                    db.query(
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
};

const deleteReportLog = (user_id) => {
    return new Promise(function(resolve, reject){    
        db.query(
            `SET @week = (SELECT period.week
                FROM period
                WHERE now() >= period.start_of_week AND now() <= period.end_of_week);
            SELECT @week;
            `,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    let weekNum = 'week' + results[1][0]['@week'];
                    db.query(
                        `UPDATE user SET ${weekNum} = ${weekNum} - 1 
                            WHERE EXISTS( SELECT * from report where date(created_date)=date(now()) AND report.user_id="${user_id}")
                            AND user.user_id="${user_id}";
                        DELETE FROM report
                            WHERE EXISTS( SELECT * from report where date(created_date)=date(now()) AND user_id="${user_id}")
                            AND user_id="${user_id}";`,
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
};

module.exports = { addReportLog, deleteReportLog };
