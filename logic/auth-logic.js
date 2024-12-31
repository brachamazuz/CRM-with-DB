const dal = require("../data/dal");
const nodemailer = require('nodemailer');

//שמירת הטופס בDB
async function formSubAsync(formDetails) {
    try {
        const sql = `
        insert into turning
     (full_name_pone, email_pone, message_pone)
     values
     (?, ?, ?)
     `;
        const params = [formDetails.fullName, formDetails.email, formDetails.message];
        const result = await dal.executeQueryAsync(sql, params);
        return result;
    }
    catch (error) {
        throw error;
    }
}

//שליפת המייל של האדמים האחרונה שהנכנסה
async function sendAdminEmailAsinc() {
    const sql = ` SELECT email_admin FROM admin ORDER BY adminId DESC LIMIT 1`
    const result = await dal.executeQueryAsync(sql);
    console.log("DB result:", result);
    return result[0]?.email_admin || null;
}

module.exports = {
    formSubAsync,
    sendAdminEmailAsinc
};