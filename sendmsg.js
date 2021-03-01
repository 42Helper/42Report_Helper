const usersDataFunc = require("./getuserlist.js"); //getuserlist.js에서 start 함수 받아옴

var sendMSG = (async () => {
    var usersData = await usersDataFunc();

    if (usersData != undefined) {
        //유저정보가 성공적으로 저장되어 있으면 실행
        var usersIdList = usersData.usersIdList;
        var usersStore = usersData.usersStore;

        /*아래 forEach 부분을 스케줄링 함수 안에 넣어야할 것같아요*/
        usersIdList.forEach((user) => {
            console.log(usersStore[user]);
            /*이 부분에 메세지 전송이 있으면 됩니다.*/
        });
    }
})();
