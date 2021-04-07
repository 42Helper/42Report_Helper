const { App } = require("@slack/bolt");
const { signingSecret, token } = require("../db/token.js"); //module.exports = {signingSecret, token}
const getUserData = require("../User/getuserdata.js");
const getPeriod = require("./getperiod.js");

const app = new App({ signingSecret, token });

let dailyMsg = async () => {
    const userdata = await getUserData();

    if (userdata === null || userdata === undefined) console.log("유저 데이터 가져오기 실패");
    else {
        let i;

        for (i = 0; i < userdata.length; i++) {
            if (name != "sinhye102") continue;
            (async () => {
                try {
                    if (userdata[i].on_off == 1 && userdata[i].count < 5) {
                        const result = await app.client.chat.postMessage({
                            token,
                            channel: userdata[i].user_id,
                            text: "오늘 보고서 작성하셨나요?",
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
                    }
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }
};

let sundayMsg = async () => {
    const userdata = await getUserData();
    const week = await getPeriod();

    if (userdata === null || userdata === undefined) console.log("유저 데이터 가져오기 실패");
    else {
        let i;

        for (i = 0; i < userdata.length; i++) {
            (async () => {
                try {
                    if (userdata[i].on_off > 0) {
                        const result = await app.client.chat.postMessage({
                            token,
                            channel: userdata[i].user_id,
                            text: `‼️‼️오늘은 ${week}주차 보고서 마감일‼️‼️`,
                            blocks: [
                                {
                                    type: "section",
                                    text: {
                                        type: "plain_text",
                                        text: `‼️‼️오늘은 ${week}주차 보고서 마감일‼️‼️`,
                                        emoji: true,
                                    },
                                },
                            ],
                        });
                        console.log(result);
                    }
                } catch (error) {
                    console.error(error);
                }
            })();
        }
    }
};

module.exports = { dailyMsg, sundayMsg };
