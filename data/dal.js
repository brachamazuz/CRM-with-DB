const db = require("mysql2");

 const pool = db.createPool({
    host: "localhost",
    user: "root",
    database: "landing-page"
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