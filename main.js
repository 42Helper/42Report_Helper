const usersDataFunc = require("./Utils/getuserlist.js"); //getuserlist.js에서 start 함수 받아옴
const schedule = require("node-schedule");
const sendMsg = require("./Utils/sendmsg.js");
const addReportLog = require("./Report/Report.js");
const { App } = require("@slack/bolt");
const { signingSecret, token } = require("./db/token.js"); //module.exports = {signingSecret, token}
const moment = require('moment');

const app = new App({ signingSecret, token });

const db = require('./db/dbconnection');

moment.locale('ko');

app.action("action_yes", async ({ body, ack, say, respond }) => {
    await ack();
    let m = moment();
    const result = await respond({ 
        "replace_original": true,
        "text": 
        `${m.format("MM/DD (ddd)")}
        레포트 작성 기록이 저장되었습니다.
        `,
    });
    // Report 작성 로그 추가
    await addReportLog(body.user.id);
    // 이번주 작성 Report 개수 조회
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
                    `SELECT ${weekNum} FROM user WHERE user_id = "${body.user.id}"`,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            say(`이번주에 ${results[0][weekNum]} 개의 보고서를 작성하셨습니다.`);
                        }
                    }
                );
            }
        }
    );
});

app.action("action_no", async ({ body, ack, say, respond }) => {
    await ack();
    const result = await respond({ 
        "replace_original": true,
        "text": "💩",
    });
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
                    `SELECT ${weekNum} FROM user WHERE user_id = "${body.user.id}"`,
                    function (error, results, fields) {
                        if (error) {
                            console.log(error);
                        }
                        else {
                            say(`이번주에 ${results[0][weekNum]} 개의 보고서를 작성하셨습니다.`);
                        }
                    }
                );
            }
        }
    );
});

const addUser = require("./User/saveDB.js");

app.message("!join", async ({ body, say }) => {
    if (body.challenge && body.type == "url_verification") {
        res.json({ challenge: body.challenge });
    }
    try {
        let usersData = await usersDataFunc();

        if (usersData != undefined) {
            let usersStore = usersData.usersStore;
            let user_id = body.event.user;
            let intra_id = usersStore[user_id].name;

            //user테이블에 해당 유저 데이터가 있는지 조회 후 처리
            db.query(
                `SELECT * FROM user WHERE user_id = "${user_id}"`,
                (error, results, fields) => {
                    if (error) {
                        console.log(error);
                    } else {
                        //console.log(results[0] === undefined);
                        if (results[0] === undefined) {
                            //유저 정보가 없을 경우 유저 데이터 삽입
                            addUser(user_id, intra_id);
                            say(`<@${user_id}> 등록 완료`);
                            console.log("=================new Person=================");
                        } else {
                            //유저 데이터가 이미 존재할 경우 메세지 응답
                            say(`<@${user_id}>은 이미 등록된 유저입니다!`);
                            console.log("=================already Person=================");
                        }
                    }
                }
            );
        }
    } catch (error) {
        console.error(error);
    }
});

app.message("!delete", async ({ body, say }) => {
    if (body.challenge && body.type == "url_verification") {
        res.json({ challenge: body.challenge });
    }
    try {
        let user_id = body.event.user;

        console.log(body.event.user);
        db.query(
            `SELECT * FROM user WHERE user_id = "${user_id}"`,
            (error, results, fields) => {
                if (error) console.error(error);
                else {
                    if (results[0] != undefined) {
                        db.query(
                            `DELETE FROM user WHERE user_id = "${user_id}"`,
                            (error, results, fileds) => {
                                if (error) console.error(error);
                                else say(`<@${user_id}> 삭제 완료!`);
                            }
                        );
                    } else {
                        say(`<@${user_id}>은 등록되지 않은 유저입니다.`);
                    }
                }
            }
        );
    } catch (error) {
        console.error(error);
    }
});

app.message("!push", async ({ body, say }) => {
    if (body.challenge && body.type == "url_verification") {
        res.json({ challenge: body.challenge });
    }
    try {
        let user_id = body.event.user;
        let msg = body.event.text.substring(6);
        let msg_state = [
            {
                msg: "off",
                num: 0,
                text: "항상 off",
            },
            {
                msg: "on",
                num: 1,
                text: "항상 on",
            },
            {
                msg: "sun",
                num: 2,
                text: "일요일만 on",
            },
            {
                msg: "state",
                text: "알림 상태 확인",
            },
        ];
        let value = { num: 404, text: "없는 명령어" };
        msg_state.forEach((i) => {
            if (i.msg === msg) value = i;
        });

        db.query(
            `SELECT * FROM user WHERE user_id = "${user_id}"`,
            (error, results, fields) => {
                if (error) console.error(error);
                else {
                    if (results[0] != undefined) {
                        if (value.msg === "state") {
                            let on_off = results[0].on_off;
                            say(`<@${user_id}>의 알림상태: ${msg_state[on_off].text}`);
                        } else if (value.num != 404) {
                            db.query(
                                `UPDATE user SET on_off = ${value.num} WHERE user_id = "${user_id}"`,
                                (error, results, fileds) => {
                                    if (error) console.error(error);
                                    else say(`<@${user_id}>: ${value.text} 설정완료 :)`);
                                }
                            );
                        }
                        console.log(`!push ${msg}: ${body.event.user}`);
                    } else {
                        say(`<@${user_id}>은 등록되지 않은 유저입니다.`);
                    }
                }
            }
        );
    } catch (error) {
        console.error(error);
    }
});

app.message("!help", async ({ body, say }) => {
    try {
        await say({
            blocks: [
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text: "`!join`\n: 구독 시작\n`!delete`\n: 구독 취소",
                    },
                },
                {
                    type: "divider",
                },
                {
                    type: "section",
                    text: {
                        type: "mrkdwn",
                        text:
                            "`!push on`\n: 모든 알림 받기 (기본)\n`!push sun`\n: 일요일에 마감일 알림만 받기\n"
                            +"`!push off`\n: 모든 알림 끄기\n"
                            +"`!push state`\n: 알림 상태 확인\n"
                            +"`!count`\n: 이번주에 작성한 보고서 개수 확인",
                    },
                },
            ],
        });
    } catch (error) {
        console.error(error);
    }
});

app.message("!count", async ({ body, say }) => {
    if (body.challenge && body.type == "url_verification") {
        res.json({ challenge: body.challenge });
    }
    try {
        let user_id = body.event.user;

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
                    if (results[1][0]['@week'] === null)
                        say("보고서 작성 기간이 아닙니다");
                    else {
                        let weekNum = 'week' + results[1][0]['@week'];
                        db.query(
                            `SELECT ${weekNum} FROM user WHERE user_id="${user_id}"`,
                            function (error, results, fields) {
                                if (error) {
                                    console.log(error);
                                }
                                else {
                                    say(`이번주에 ${results[0][weekNum]} 개의 보고서를 작성하셨습니다.`);
                                }
                            }
                        );
                    }
                }
            }
        );
    } catch (error) {
        console.error(error);
    }
});

(async () => {
    await app.start(process.env.PORT || 3000);
    schedule.scheduleJob('00 21 * * *', function(){
        sendMsg.dailyMsg();    
    });
    schedule.scheduleJob(`00 17 * * 7`, function(){
        sendMsg.sundayMsg();
    });
})();
