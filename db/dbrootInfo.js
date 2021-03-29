var root = {
    host: process.env.DB_ROOT,
    user: process.env.DB_USER,
    password: DB_PASSWORD,
    database: "rebot",
    multipleStatements: true,
};
module.exports = root;