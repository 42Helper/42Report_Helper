const db = require('../db/dbconnection');

const addReportLog = (user_id, prevDate, currWeek) => {
    return new Promise(function(resolve, reject){    
        db.query(
            `INSERT INTO report(user_id, created_date, created_week)
                    VALUES ("${user_id}", "${prevDate}", ${currWeek});`,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    let weekNum = 'week' + currWeek;
                    db.query(
                        `UPDATE user SET ${weekNum} = ${weekNum} + 1 WHERE user_id="${user_id}"`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            } else {
                                resolve(results);
                            }
                        }
                    );
                }
            }
        );
    });
};

const deleteReportLog = (user_id, prevDate, currWeek) => {
    return new Promise(function(resolve, reject){
        let weekNum = 'week' + currWeek;
        db.query(
            `UPDATE user SET ${weekNum} = ${weekNum} - 1 
                WHERE EXISTS( SELECT * from report where date(created_date)=date("${prevDate}") AND report.user_id="${user_id}")
                AND user.user_id="${user_id}";`,
            function (error, results, fields) {
                if (error) {
                    console.log(error);
                } else {
                    db.query(`DELETE FROM report
                    WHERE created_date IN (
                        SELECT temp.created_date from (SELECT created_date FROM report WHERE date(created_date)=date("${prevDate}") AND user_id="${user_id}") temp )
                    AND user_id="${user_id}";`,
                        function (error, results, fields) {
                            if (error) {
                                console.log(error);
                            } else {
                                resolve(results);
                            }
                        }
                    );
                }
            }
        );
    });
}

module.exports = { addReportLog, deleteReportLog };
