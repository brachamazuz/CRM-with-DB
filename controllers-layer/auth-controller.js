const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
const authLogic = require("../logic/auth-logic");

router.get("/health", (req, res) => {
  res.send({ status: "OK", message: "Backend is running!" });
});

router.get("/test-db", async (req, res) => {
  try {
    const result = await logic.testDbConnection(); // קריאה ללוגיקה לבדיקה
    res.send({ success: true, message: "Database connection successful!", result });
  } catch (err) {
    res.status(500).send({ success: false, error: err.message });
  }
});

router.post("/formSub", async (request, response) => {
    try {
        const fromDetails = request.body;// פרטי הטופס
        console.log("Form details received:", fromDetails);

        //שמירת הטופס בDB
        await authLogic.formSubAsync(fromDetails);

        response.status(200).json({ message: "הטופס נשלח ונשמר בהצלחה!" });

    } catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });
    }
});



//לשליפת המייל כדי לשלוח לאדמין
router.get("/sendAdminEmail", async (request, response) => {
    try {
        const emailAdmin = await authLogic.sendAdminEmailAsinc();
        if (!emailAdmin) {
            return response.status(404).json({ error: "Admin email not found" });

        }
        response.status(200).json({ email_admin: emailAdmin });  // מחזירה את המייל כ - JSON באוביקט
        console.log("Request received at /getAdminEmail");

    }
    catch (error) {
        console.log(error);
        response.status(500).json({ error: error.message });

    }
});
module.exports = router;
