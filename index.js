const express = require("express");
const app = express();
const dotenv = require("dotenv");

const port = process.env.PORT || 5001;
dotenv.config();

const authRoute = require('./src/Routes/auth.route');

app.use(express.json());

// Routes
app.use("/auth", authRoute);

app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`);
});