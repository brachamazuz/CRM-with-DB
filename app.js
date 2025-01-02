const express = require('express');
const app = express();
const port = 3000;
const cors = require("cors");

const adminController=require("./controllers-layer/admin-controller");
const authController=require("./controllers-layer/auth-controller");

app.use(cors());
app.use(express.json());

app.use("/admin", adminController);
app.use("/auth", authController);

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Server is running on ${port}`);
});
