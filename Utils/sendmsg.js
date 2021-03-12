const usersDataFunc = require("./getuserlist.js"); //getuserlist.js에서 start 함수 받아옴
const { App } = require("@slack/bolt");
const { signingSecret, token } = require("../db/token.js"); //module.exports = {signingSecret, token}

const app = new App({ signingSecret, token });

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
                        token, //process.env.SLACK_BOT_TOKEN,
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
                                        value: "yes_button",
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

module.exports = sendMsg;