const usersDataFunc = require("./Utils/getuserlist.js"); //getuserlist.js에서 start 함수 받아옴
const schedule = require("node-schedule");
const sendMsg = require("./Utils/sendmsg.js");
const { App } = require("@slack/bolt");
const { signingSecret, token } = require("./db/token.js"); //module.exports = {signingSecret, token}

const app = new App({ signingSecret, token });

app.action("action_yes", async ({ body, ack }) => {
    await ack();
    console.log(body.user.id);
    const result = await app.client.chat.postMessage({
        token, //process.env.SLACK_BOT_TOKEN,
        channel: body.user.id,
        text: "good!",
    });
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
            let connection = mysql.createConnection(root); //root = {host, user, password, database}

            //user테이블에 해당 유저 데이터가 있는지 조회 후 처리
            connection.connect();
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
            connection.end();
        }
    } catch (error) {
        console.error(error);
    }
});

(async () => {
    await app.start(process.env.PORT || 3000);
    //schedule.scheduleJob('37 15 * * *', function(){
    sendMsg();
    //});
})();
