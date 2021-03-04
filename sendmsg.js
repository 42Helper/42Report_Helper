const usersDataFunc = require("./getuserlist.js"); //getuserlist.js에서 start 함수 받아옴
const schedule = require("node-schedule");
const { App } = require("@slack/bolt");

const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
});

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

(async () => {
    await app.start(process.env.PORT || 3000);
    //schedule.scheduleJob('37 15 * * *', function(){
    sendMsg();
    //});
})();
