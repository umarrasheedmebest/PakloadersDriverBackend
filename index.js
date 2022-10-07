const express = require("express");
const app = express();
const dotenv = require("dotenv");
const path = require("path");

const port = process.env.PORT || 5001;
dotenv.config();

const authRoute = require('./src/Routes/auth.route');

app.use(express.json());
app.use('/Images',express.static(path.join(__dirname, "/Images")));

// Routes
app.use("/auth", authRoute);

app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`);
});