const db = require('../db/dbconnection');

const addUser = (user_id, intra_id) => {
    db.query(
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

module.exports = addUser;
