const mysql = require("mysql");
const root = require("./db/dbrootInfo.js");

const saveDB = (user_id, intra_id) => {
    let connection = mysql.createConnection(root); //root = {host, user, password, database}
    connection.connect();
    connection.query(
        `INSERT INTO user(user_id, intra_id) VALUES ("${user_id}", "${intra_id}")`,
        function (error, results, fields) {
            if (error) {
                console.log(error);
            } else {
                console.log("(: DB에 저장 완료 :)");
            }
        }
    );
    connection.end();
};

module.exports = saveDB;
