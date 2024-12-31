const express = require("express");
const adminLogic = require("../logic/admin-logic");
const router = express.Router();

//הכנסת מייל האדמין ל- DB
router.post("/emailAdmin", async (request, response)=>{
    try{
        const { email_admin } = request.body;         
        const result = await adminLogic.emailAdminAsync({ email_admin });
        console.log("Inserted email:", result); 
        response.status(200).json({message: "כתובת המייל נשמרה בהצלחה", result});
        
    }
    catch(error){
    console.error("Error saving email:", error);
    response.status(500).json({error: "Failed to save email"});
    
    }
});
//הצגת הזנות הפונים בעמוד האדמין
router.get("/userForms", async (request, response)=>{
    try{
        const userForms = await adminLogic.getAllUserFormAsync();
        response.status(200).json(userForms);  
    }
    catch(error){
    console.log(error);
    response.status(500).json({error: error.message});
    
    }
});

//הצגת כתובת המייל בעמוד האדמין
router.get("/getAdminEmail", async (request, response)=>{
    try{
        const emailAdmin = await adminLogic.getAdminEmailAsync();
        response.status(200).json(emailAdmin);  // מחזירה את המייל כ - JSON
    }
    catch(error){
    console.log(error);
    response.status(500).json({error: error.message});
    
    }
});

module.exports = router;