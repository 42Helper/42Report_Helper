const mysql = require('mysql');
const db = mysql.createPool({
	connectionLimit : 1000,
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	multipleStatements: true,
});

module.exports = db;
