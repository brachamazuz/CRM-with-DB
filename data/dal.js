require('dotenv').config();

const db = require("mysql2");

 // const pool = db.createPool({
 //    host: "localhost",
 //    user: "root",
 //    database: "landing-page"
 // });
const pool = db.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    port: process.env.MYSQL_PORT || 3306
});

function executeQueryAsync(sqlCmd, params = []){
    return new Promise((resolve, reject) =>{
        pool.query(sqlCmd, params, (err, rows)=> {
            if(err){
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
}

module.exports = {
    executeQueryAsync
};
