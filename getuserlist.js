const { WebClient, LogLevel } = require("@slack/web-api");

const BOT_TOKEN = process.env.SLACK_BOT_TOKEN;

const client = new WebClient(BOT_TOKEN, {
    logLevel: LogLevel.DEBUG, // api를 통해 데이터가 불러오는 로그를 출력해줌
});

const start = async () => {
    try {
        const result = await client.users.list();
        var data = {
            usersIdList: [], //유저 id 담긴 배열 -> 객체 접근할 때 사용하기 위해
            usersStore: {}, //유저 정보 담긴 객체
        };

        saveUsers(result.members, data); //유저만 추출해서 data에 유저목록 저장
        return data;
    } catch (error) {
        console.error(error);
    }
};

const saveUsers = (users, data) => {
    users.forEach((user) => {
        var id = user.id;
        var name = user.name;
        var isEmail = user.is_email_confirmed;
        //유저는 이메일인증 true, 봇은 이메일인증 false이므로 유저만 추출하기 위해 사용함

        if (isEmail) {
            //유저: 이메일 인증, 봇: 이메일 인증X
            data.usersIdList.push(id);
            data.usersStore[id] = { id, name }; //필요한 유저정보를 추가하면됨. 일단 id, name만 추가해놓음
        }
    });
};

module.exports = async () => await start(); //{ userIdList, usersStore } 가 담긴 객체 data를 반환하는 함수를 내보냄
