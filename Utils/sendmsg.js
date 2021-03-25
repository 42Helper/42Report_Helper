const { App } = require("@slack/bolt");
const { signingSecret, token } = require("../db/token.js"); //module.exports = {signingSecret, token}
const getUserData = require("../User/getuserdata.js");
const getPeriod = require("./getperiod.js");

const app = new App({ signingSecret, token });

let dailyMsg = async () => {
    const userdata = await getUserData();
    const thisweek = await getPeriod();
    
    if (userdata === null || userdata === undefined)
        console.log("유저 데이터 가져오기 실패");
    else if (thisweek === undefined || thisweek === null)
        console.log("보고서 작성 기간이 아닙니다.");
    else {
        let i;

        for (i = 0; i < userdata.length; i++)
        {
            (async () => {
                try {
                    if (userdata[i].on_off == 1)
                    {
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
                            ]
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

let sundayMsg = async() => {
    const userdata = await getUserData();
    const thisweek = await getPeriod();

    if (userdata === null || userdata === undefined)
        console.log("유저 데이터 가져오기 실패");
    else if (thisweek === undefined || thisweek === null)
        console.log("보고서 작성 기간이 아닙니다.");
    else {
        let i;

        for (i = 0; i < userdata.length; i++)
        {
            (async () => {
                try {
                    if(userdata[i].on_off > 0)
                    {
                        const result = await app.client.chat.postMessage({
                            token, 
                            channel: userdata[i].user_id,
                            blocks: [
                                {
                                    "type": "section",
                                    "text": {
                                        "type": "plain_text",
<<<<<<< HEAD
                                        "text": `‼️‼️오늘은 보고서 마감일‼️‼️`,
=======
                                        "text": `‼️‼️오늘은 ${thisweek}주차 보고서 마감일‼️‼️`,
>>>>>>> e11ba3816989d503ad90b62ecd8aee937b13d11d
                                        "emoji": true
                                    }
                                }
                            ]
                        });
                        console.log(result);
                    }
                } catch(error) {
                    console.error(error);
                }
            })();
        }
    }
};

module.exports = {dailyMsg, sundayMsg};