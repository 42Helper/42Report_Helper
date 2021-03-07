const usersDataFunc = require("./getuserlist.js"); //getuserlist.js에서 start 함수 받아옴
const schedule = require("node-schedule");
const mysql = require("mysql");
const { App } = require("@slack/bolt");

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});

const db = mysql.createConnection({
	host : 'localhost',
	user : 'root',
	password : process.env.MYSQL_ROOT_PASSWORD,
	database : 'slackbot'
});

db.connect();

let sendMsg = async () => {
    let usersData = await usersDataFunc();

    if (usersData != undefined) {
        //유저정보가 성공적으로 저장되어 있으면 실행
        let usersIdList = usersData.usersIdList;
        let usersStore = usersData.usersStore;

        /*아래 forEach 부분을 스케줄링 함수 안에 넣어야할 것같아요*/
        usersIdList.forEach((user) => {
            console.log(usersStore[user]);
            /*이 부분에 메세지 전송이 있으면 됩니다.*/
            (async () => {
                try {
                    const result = await app.client.chat.postMessage({
                        token: process.env.SLACK_BOT_TOKEN,
                        channel: user,
                        blocks: [
                            {
                                type: "section",
                                text: {
                                    type: "plain_text",
                                    text: "오늘 보고서 작성하셨나요?",
                                    emoji: true,
                                },
                            },
                            {
                                type: "actions",
                                elements: [
                                    {
                                        type: "button",
                                        text: {
                                            type: "plain_text",
                                            text: "네",
                                            emoji: true,
                                        },
                                        value: "U01M58WS11N",
                                        action_id: "action_yes",
                                    },
                                    {
                                        type: "button",
                                        text: {
                                            type: "plain_text",
                                            text: "아니요",
                                            emoji: true,
                                        },
                                        value: "no_button",
                                        action_id: "action_no",
                                    },
                                ],
                            },
                        ],
                    });
                    console.log(result);
                } catch (error) {
                    console.error(error);
                }
            })();
        });
    }
};

app.action("action_yes", async ({ body, ack }) => {
    await ack();
    console.log(body.user.id);
    const result = await app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: body.user.id,
        text: "good!",
    });
});

app.action("action_no", async ({ boyd, ack }) => {
    await ack();
    const result = await app.client.chat.postMessage({
        token: process.env.SLACK_BOT_TOKEN,
        channel: body.user.id,
        text: "💩",
        emoji: true,
    });
});

//!join 유저 요청 처리 현재 dm만 가능
app.message('!join', async ({ message, say}) => {
	try {
        //user테이블에 해당 유저 데이터가 있는지 조회 후 처리
		db.query(`SELECT * FROM user WHERE user_id = '${message.user}'`, function(error, results, field){
			//유저 정보가 없을 경우
            if (results[0] === undefined)
			{
				let usersData = usersDataFunc();
				let usersStore;
				if (usersData != undefined) {
					usersStore = usersData.usersStore;
				}
				//유저 데이터 삽입
				var sql = 'INSERT INTO user VALUES(?, ?, ?, ?, ?, ?)';
				var params = [message.user,usersStore[message.user].name, 0, 0, 0, 0];
				db.query(sql, params, function(error, results, field) {
					if (error) {
						console.log(error);
					}
					console.log(results);
				});
				say(`<@${message.user}> 등록 완료`);
			}
            //유저 데이터가 이미 존재할 경우 메세지 응답
			else
			{
				say(`<@${message.user}>은 이미 등록된 유저입니다!`);
			}
		});
	}
	catch (error) {
		console.error(error);
	}
});

(async () => {
    await app.start(process.env.PORT || 3000);
    //schedule.scheduleJob('37 15 * * *', function(){
    sendMsg();
    //});
})();
