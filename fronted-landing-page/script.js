//שליפה והצגה של מייל האדמין מה-DB
document.addEventListener('DOMContentLoaded', async function () {
    const emailDisplay = document.getElementById('currentEmail');
    try {
        // שליפה של כתובת המייל מה-DB
        const response = await fetch("http://localhost:3000/admin/getAdminEmail", { method: "GET" });
        if (!response.ok) {
            throw new Error("Filed to fetch admin email");
        }
        const adminData = await response.json();//מקבלים את האימל בתשובה

        const adminEmail = adminData[0]?.email_admin;
        if (emailDisplay) { // אם האלמנט קיים ורק בדף של האדמין
            // הצגת המייל על המסך
            emailDisplay.textContent = adminEmail || 'לא הוזנה כתובת מייל';
        }
    } catch (error) {
        console.error("Error fetching admin email:", error);
        if (emailDisplay) {
            emailDisplay.textContent = "שגיאה בשליפת כתובת המייל";
        }
    }
});

//שליחת כתובת האדמין לשמירה בDB
const submitAdminMail = document.getElementById("submit-admin");
if (submitAdminMail) { //רלוונטי רק לעמוד האדמין
    submitAdminMail.addEventListener("click", async function (event) {
        event.preventDefault();
        const email_admin = document.getElementById("emailAdmin").value;

        try {
            const response = await fetch("http://localhost:3000/admin/emailAdmin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email_admin })
            });
            if (!response.ok) {
                throw new Error("Failed to submit thr adress");
            }
            const result = await response.json();// מחכים לתשובה מהשרת
            alert(result.message);
            location.reload();
        } catch (error) {
            console.log(error);
            alert("אירעה שגיאה בשליחת הכתובת");

        }
    });
}

// 'emailjs-com';
emailjs.init('p17o6yIafOaPklBLT');

async function sendForm(formDetails, adminEmail) {

    try {
        const response = await emailjs.send(

            'service_y6v521m',
            'template_1mpe55g',
            {
                fullName: formDetails.fullName,
                email: formDetails.email,
                message: formDetails.message,
                to_email: adminEmail
            },
            'p17o6yIafOaPklBLT'
        );
    } catch (error) {
        console.error('Failed to send email:', error);
        throw error;
    }
}
// פונקציה לוודא שהאימייל תקין
function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
}

//פונקציה לשליחת איימלים לאדמין
function isReceiveEmailsEnabled() {
    const receiveEmailsToggle = document.getElementById("receive-emails");
    if (!receiveEmailsToggle) return false;

    const savedState = localStorage.getItem("receiveEmailsState");
    if (savedState === "enabled") {
        receiveEmailsToggle.checked = true; //הכפתור יתחיל דולק
        return true;
    } else if (savedState === "disabled") {
        receiveEmailsToggle.checked = false; //הכפתור יתחיל כבוי
        return false;
    }
    localStorage.setItem(
        "receiveEmailsState",
        receiveEmailsToggle.checked ? "enabled" : "disabled"
    );
    return receiveEmailsToggle.checked;

}
// שחזור מצב הכפתור בעת טעינת הדף
document.addEventListener("DOMContentLoaded", () => {
    isReceiveEmailsEnabled();

    // עדכון המצב השמור בעת שינוי
    const receiveEmailsToggle = document.getElementById("receive-emails");
    if (receiveEmailsToggle) {
        receiveEmailsToggle.addEventListener("change", () => {
            localStorage.setItem(
                "receiveEmailsState",
                receiveEmailsToggle.checked ? "enabled" : "disabled"
            );
        });
    }
});

//שליחת הטופס מהמשתמש ממלא
const contactForm = document.getElementById("contact-form");
if (contactForm) { //רלוונטי רק לעמוד המשתמש

    contactForm.addEventListener("submit", async function (event) {
        event.preventDefault(); // מונע את הרענון של הדף

        const formDetails = {
            fullName: document.getElementById("full-name").value,
            email: document.getElementById("email").value,
            message: document.getElementById("message").value,
        };
        try {
            if (isReceiveEmailsEnabled) {
                // כאן תוכל לקרוא לפונקציה לשלוח את הטופס
                const adminResponse = await fetch('http://localhost:3000/auth/sendAdminEmail');  // קריאה לשרת כדי לקבל את המייל של האדמין
                if (!adminResponse.ok) {
                    throw new Error("Faild to fetch admin email");
                }
                const adminData = await adminResponse.json();
                const adminEmail = adminData.email_admin || null;
                if (!adminEmail) {
                    throw new Error("Admin email is undefind")
                }

                // שולחים את המייל דרך EmailJS
                sendForm(formDetails, adminEmail);
            } else {
                console.log("Email sending is disabled");

            }
            //שמירת הטופס ב - DB
            const response = await fetch("http://localhost:3000/auth/formSub", {// שולח נתונים ל DB
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDetails)
            });
            if (!response.ok) {
                throw new Error("Failed to submit thr form");
            }
            const result = await response.json();// מחכים לתשובה מהשרת
            alert(result.message);
            location.reload();
        } catch (error) {
            console.log(error);
            alert("אירעה שגיאה בשליחת הטופס");

        }
    });
}

//פונקציה לכפתור הדפסה
const printButton = document.getElementById('print-button');
if (printButton) {
    printButton.addEventListener('click', function () {
        const table = document.getElementById('admin-table');
        if (!table) {
            console.log("טבלה לא נמצאה בעמוד");
            return;
        }
        const newWindow = window.open("", "_blank")
        newWindow.document.write(`
            <html>
            <head>
            <title>הדפסת טבלה</title>
            </head>
            <body>
            <h2>טבלת טפסים</h2>
            ${table.outerHTML}
            </body>
            </html>
            `)
        newWindow.document.close();
        newWindow.print();
    });
}

//פונקציה להורדת קובץ PDF עם html2pdf
document.addEventListener("DOMContentLoaded", () => {
    const downloadPdfButton = document.getElementById('download-pdf');
    if (downloadPdfButton) {
        downloadPdfButton.addEventListener('click', async function () {
            const table = document.getElementById('admin-table');
            if (!table) {
                console.log("טבלה לא נמצאה בעמוד");
                return;
            }
            const options = {
                margin: [10, 10, 10, 10], // שוליים מסביב
                filename: 'טבלת_טפסים.pdf',
                html2pdf: {
                    scale: 2 // איכות גבוהה
                },
                jsPDF: {
                    unit: 'pt',
                    format: 'a4',
                    orientation: 'portrait'
                }
            };
            try {
                html2pdf().set(options).from(table).save();
            } catch (error) {
                alert("אירעה שגיאה בעת יצירת הקובץ, אנא נסה שוב")
            }


        });
    }
});
//פונקציה להורדת קובץ CSV 
function exportToCSV(data, filename = 'data.csv') {
    const csvContent = "\uFEFF" + data.map(row =>
        row.map(cell => `"${cell.replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute('download', filename);
    link.style.display = "none";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
document.addEventListener("DOMContentLoaded", () => {
    const downloadCSVButton = document.getElementById('download-csv');
    if (downloadCSVButton) {
        downloadCSVButton.addEventListener('click', async function () {
            const table = document.getElementById('admin-table');
            if (!table) {
                console.log("טבלה לא נמצאה בעמוד");
                return;
            }
            const rows = Array.from(table.rows);
            const data = rows.map(row => Array.from(row.cells).map(cell => cell.textContent.trim()));
            exportToCSV(data, 'טבלת_טפסים.csv');
        });
    }
});
//מעבר לעמוד המשתמש
const displayFrom = document.getElementById("display-from");
if (displayFrom) {
    displayFrom.addEventListener("click", () => {
        window.open('index.html', "_blank");
    });
}

let originalData = [];
// הצגת כל הטפסים בטבלת בעמוד האדמין
document.addEventListener("DOMContentLoaded", async () => {
    // בדיקה האם אנחנו בעמוד האדמין
    if (!window.location.pathname.includes("/admin")) {
        return;
    }
    const adminTable = document.getElementById("admin-table");

    //פונקציה לטעינת הנתונים מהשרת
    async function fetchTableData() {
        try {
            //שליחת הבקשה לקבלת הנתונים
            const response = await fetch("http://localhost:3000/admin/userForms", { method: "GET" });
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const forms = await response.json();
            originalData = forms; //שמירת הנתונים המקוריים
            renderTable(originalData); //הצגת הטבלה הראשונית
        } catch (error) {
            console.error(error);
        }
    }
    //קריאה לנתוני הטבלה
    fetchTableData();
});
//פונקציה להצגת הנתונים בטבלה
function renderTable(forms) {
    const adminTable = document.querySelector("#admin-table tbody");

    if (!Array.isArray(forms)) {
        console.error("Data is not an array:", data);
        return;
    }

    // ניקוי השורות הקיימות בטבלה
    adminTable.innerHTML = "";
    //במידה והמערך ריק, נוסיף שורה שמציינת שאין נתונים
    if (forms.length == 0) {
        const row = adminTable.insertRow();
        const cell = row.insertCell(0);
        cell.colSpan = 5; //איחוד עמודות
        cell.textContent = "עדיין לא הוזנו טפסים";
        cell.style.textContent = "center";
        return;
    }
    // הוספת נתונים לטבלה
    forms.forEach((form, index) => {
        const row = adminTable.insertRow();

        row.insertCell(0).textContent = form.idPone; // מספר פונה
        const createDate = new Date(form.created_at); // תאריך
        row.insertCell(1).textContent = createDate.toLocaleString("he-IL", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
            second: "2-digit",
        })
            .replace(",", "") || "לא צויין";
        row.insertCell(1).textContent = form.full_name_pone || "לא צויין"; // שם מלא
        row.insertCell(2).textContent = form.email_pone || "לא צויין"; // אימייל
        row.insertCell(3).textContent = form.message_pone || "לא צויין"; // הודעה
    });
}

//פונקצית חיפוש וסינון
const searchButton = document.getElementById("search-button");
if (searchButton) {
    searchButton.addEventListener("click", () => {
        const nameFilter = document.getElementById("name").value.trim().toLowerCase();
        const emailFilter = document.getElementById("email").value.trim().toLowerCase();
        const startDateFilter = document.getElementById("start-date").value.trim();
        const endDateFilter = document.getElementById("end-date").value.trim() || new Date().toISOString().split("T")[0];

        //סינון השורות
        const filteredRows = originalData.filter((row) => {
        
            const name = row.full_name_pone ? row.full_name_pone.toLowerCase() : "";
            const email = row.email_pone ? row.email_pone.toLowerCase() : "";
            const date = row.created_at ? new Date(row.created_at).toISOString().split("T")[0] : "";

            //.בדיקת הסינון
            const matchesName = !nameFilter || name.includes(nameFilter);
            const matchesEmail = !emailFilter || email.includes(emailFilter);
            const matchesDate =
                (!startDateFilter || date >= startDateFilter) &&
                (!endDateFilter || date <= endDateFilter);

            return matchesName && matchesEmail && matchesDate;

        });
        console.log(`after filtering: ${filteredRows.length} rqws match.`);
        
        const totalResult = document.getElementById("totalResult");
        totalResult.textContent = ("סך הכל תוצאות: " + filteredRows.length)
        renderTable(filteredRows);
    });
}

// כפתור לפתיחת שדות החיפוש (חיפוש וסינון⬇️)
const toggleButton = document.getElementById("toggle-search");
const searchFields = document.getElementById("search-fields");
if (toggleButton && searchFields) {
    toggleButton.addEventListener("click", () => {
        searchFields.classList.toggle("hidden");
    });
}
//כפתור לפתיחת הגדאןת מייל
const toggleEmailAdmin = document.getElementById("toggle-emailAdmin");
const Saving_an_email = document.getElementById("Saving_an_email");
if (toggleEmailAdmin && Saving_an_email) {
    toggleEmailAdmin.addEventListener("click", () => {
        Saving_an_email.classList.toggle('hidden');
    });
}

// ביטול סינון
const cancelButton = document.getElementById("cancel-button");
if (cancelButton) {
    cancelButton.addEventListener("click", () => {
        renderTable(originalData); // הצגת כל הטבלה
        document.getElementById("name").value = ""; // ניקוי שדות הסינון
        document.getElementById("email").value = "";
        document.getElementById("start-date").value = "";
        document.getElementById("end-date").value = "";

        renderTable(originalData);
    });
}
//פונקצית המיון
function sortTableByOption(option) {
    let sortedData;

    switch (option) {
        case "date-asc":
            sortedData = [...originalData].sort((a, b) =>
                new Date(a.created_at) - new Date(b.created_at)
            ); //מהישן לחדש
            break;
        case "date-desc":
            sortedData = [...originalData].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            ); //מהחדש לישן
            break;
        case "name-asc":
            sortedData = [...originalData].sort((a, b) =>
                a.full_name_pone.localeCompare(b.full_name_pone)
            ); // לפי א-ב
            break;
        case "default":
            sortedData = [...originalData].sort((a, b) =>
                new Date(b.created_at) - new Date(a.created_at)
            ); //מהחדש לישן
            break;
        default:
            sortedData = originalData; //ללא מיון דיפול
            break;
    }
    renderTable(sortedData); // עדכון הטבלה

}
const sortOptions = document.getElementById("sort-options");
if (sortOptions) {
    sortOptions.addEventListener("change", () => {
        const selectedOption = sortOptions.value;
        sortTableByOption(selectedOption);
    });
}
