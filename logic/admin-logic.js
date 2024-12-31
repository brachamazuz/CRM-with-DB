const dal = require("../data/dal");

//הכנסת מייל האדמין ל- DB
async function emailAdminAsync(params) {
    try {
        const result = await dal.executeQueryAsync(
            `insert into admin
            (email_admin)
            values
            ('${params.email_admin}')`
        );
        return result;
    } catch (error) {
        throw error;

    }

}
//הצגת הזנות הפונים בעמוד האדמין
async function getAllUserFormAsync() {
    const sql = await dal.executeQueryAsync(
        `SELECT * FROM turning
        ORDER BY created_at DESC`
    );
    
    return sql;
    
}

//הצגת כתובת המייל בעמוד האדמין בכתובת האחרונה שנכנסה
async function getAdminEmailAsync() {
    const sql = await dal.executeQueryAsync(
        `SELECT email_admin FROM admin ORDER BY adminId DESC LIMIT 1`

    );
 
    return sql;
    
}
module.exports = {
    emailAdminAsync,
    getAllUserFormAsync,
    getAdminEmailAsync
};