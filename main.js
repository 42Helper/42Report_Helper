const usersDataFunc = require("./Utils/getuserlist.js"); //getuserlist.js에서 start 함수 받아옴
const schedule = require("node-schedule");
const sendMsg = require("./Utils/sendmsg.js");
const addReportLog = require("./Report/Report.js");
const { App } = require("@slack/bolt");
const { signingSecret, token } = require("./db/token.js"); //module.exports = {signingSecret, token}

const app = new App({ signingSecret, token });

app.action("action_yes", async ({ body, ack, say }) => {
    await ack();
    console.log(body.user.id);
    say("good!!!!");
    /*
    const result = await app.client.chat.postMessage({
        token, //process.env.SLACK_BOT_TOKEN,
        channel: body.user.id,
        text: "good!",
    });
    */
    addReportLog(body.user.id);
});

app.action("action_no", async ({ body, ack }) => {
    await ack();
    const result = await app.client.chat.postMessage({
        token, //process.env.SLACK_BOT_TOKEN,
        channel: body.user.id,
        text: "💩",
        emoji: true,
    });
});

const mysql = require("mysql");
const root = require("./db/dbrootInfo.js");
const addUser = require("./User/saveDB.js");
const connection = mysql.createConnection(root);
connection.connect();

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
            connection.query(
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
        connection.query(
            `SELECT * FROM user WHERE user_id = "${user_id}"`,
            (error, results, fields) => {
                if (error) console.error(error);
                else {
                    if (results[0] != undefined) {
                        connection.query(
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

//!push off / !push sun / !push on
app.message("!push off", async ({ body, say }) => {
    if (body.challenge && body.type == "url_verification") {
        res.json({ challenge: body.challenge });
    }
    try {
        let user_id = body.event.user;

        console.log(`알림 off: ${body.event.user}`);
        connection.query(
            `SELECT * FROM user WHERE user_id = "${user_id}"`,
            (error, results, fields) => {
                if (error) console.error(error);
                else {
                    if (results[0] != undefined) {
                        connection.query(
                            `UPDATE user SET on_off = 0 WHERE user_id = "${user_id}"`,
                            (error, results, fileds) => {
                                if (error) console.error(error);
                                else say(`<@${user_id}> 알림 off 완료!`);
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

app.message("!push on", async ({ body, say }) => {
    if (body.challenge && body.type == "url_verification") {
        res.json({ challenge: body.challenge });
    }
    try {
        let user_id = body.event.user;

        console.log(`알림 on: ${body.event.user}`);
        connection.query(
            `SELECT * FROM user WHERE user_id = "${user_id}"`,
            (error, results, fields) => {
                if (error) console.error(error);
                else {
                    if (results[0] != undefined) {
                        connection.query(
                            `UPDATE user SET on_off = 1 WHERE user_id = "${user_id}"`,
                            (error, results, fileds) => {
                                if (error) console.error(error);
                                else say(`<@${user_id}> 알림 on 완료!`);
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

app.message("!push sun", async ({ body, say }) => {
    if (body.challenge && body.type == "url_verification") {
        res.json({ challenge: body.challenge });
    }
    try {
        let user_id = body.event.user;

        console.log(`알림 sun: ${body.event.user}`);
        connection.query(
            `SELECT * FROM user WHERE user_id = "${user_id}"`,
            (error, results, fields) => {
                if (error) console.error(error);
                else {
                    if (results[0] != undefined) {
                        connection.query(
                            `UPDATE user SET on_off = 2 WHERE user_id = "${user_id}"`,
                            (error, results, fileds) => {
                                if (error) console.error(error);
                                else say(`<@${user_id}> 일요일에만 알림을 보내드립니다 :)`);
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

app.message(/^!push/, async ({ message }) => {
    if (message.text === "!push on")
    {

    }
    else if (message.text === "!push off")
    {

    }
    else if (message.text === "!push sun")
    {

    }
    else if (message.text === "!push state")
    {

    }
});


app.message("!push state", async ({ body, say }) => {
    if (body.challenge && body.type == "url_verification") {
        res.json({ challenge: body.challenge });
    }
    try {
        let user_id = body.event.user;

        console.log(`알림 상태: ${body.event.user}`);
        connection.query(
            `SELECT * FROM user WHERE user_id = "${user_id}"`,
            (error, results, fields) => {
                if (error) console.error(error);
                else {
                    if (results[0] != undefined) {
                        let on_off = results[0].on_off;
                        if (on_off === 0) say(`<@${user_id}>은 알림이 off입니다.`);
                        else if (on_off === 1) say(`<@${user_id}>은 알림이 on입니다.`);
                        else if (on_off === 2) say(`<@${user_id}>은 알림이 일요일만 on입니다.`);
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

app.message("!help", async({body, say}) => {
    try {
        await say({
            "blocks": [
                {
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "`!join`\n: 구독 시작\n`!delete`\n: 구독 취소"
                    }
                },{
                    "type": "divider"
                },{
                    "type": "section",
                    "text": {
                        "type": "mrkdwn",
                        "text": "`!push on`\n: 모든 알림 받기 (기본)\n`!push sun`\n: 마감일 알림만 받기\n`!push off`\n: 모든 알림 끄기\n`!push state`\n: 알림 상태 확인"
                    }
                }
            ]
        }); 
    } catch(error) {
        console.error(error);
    }
});

(async () => {
    await app.start(process.env.PORT || 3000);
    schedule.scheduleJob('5 20 * * *', function(){
        sendMsg.dailyMsg();
    });
    schedule.scheduleJob('12 20 * * *', function(){
        sendMsg.sundayMsg();
    });
})();
