const express = require("express");
const app = express();

const port = process.env.PORT || 5001;

const authRoute = require('./src/Routes/auth.route');

// Routes
app.use("/auth", authRoute);

app.listen(port, ()=> {
    console.log(`Server running on port: ${port}`);
});