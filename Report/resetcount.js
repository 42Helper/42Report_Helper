/* 1) main.js에서 day가 week4+1일때
2) 스케쥴링으로 week4+1일 때마다 reset함수 실행
3) 월요일 자정마다 resetWeek(이번주가 week1)인지 확인 후 초기화
1. 스케쥴링으로 week4+1에 console.log 출력 (testing: start+2로?)
2. reset 함수 작성 */
const db = require("../db/dbconnection");

const resetcount = () => {
    /* user table week 컬럼 초기화
    report table 초기화 */
    //return new Promise(function (resolve, reject) {
    db.query(
        `UPDATE user SET week1 = DEFAULT, week2 = DEFAULT, week3 = DEFAULT, week4 = DEFAULT;
		DELETE FROM report;
		`,
        function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                console.log(
                    `user table의 week1~4 컬럼 초기화 완료
					report table의 데이터 초기화 완료`
                );
            }
        }
    );
    //});
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
                console.log(`isresetWeek running ${results[1][0]["@week"]}
                ${results[1][0]["@week"] === 1}`);
                if (results[1][0]["@week"] === 1) resetcount();
            }
        }
    );
};

module.exports = isresetWeek;
