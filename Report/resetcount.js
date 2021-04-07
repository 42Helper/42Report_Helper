const db = require("../db/dbconnection");

const resetcount = () => {
    db.query(
        `UPDATE user SET week1 = DEFAULT, week2 = DEFAULT, week3 = DEFAULT, week4 = DEFAULT;
		DELETE FROM report;
		`,
        function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                console.log(
                    `user table의 week1~4 컬럼 초기화 완료\nreport table의 데이터 초기화 완료`
                );
            }
        }
    );
};

let isresetWeek = () => {
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
                if (results[1][0]["@week"] === 1) resetcount();
            }
        }
    );
};

module.exports = isresetWeek;
