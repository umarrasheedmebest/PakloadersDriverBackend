const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "http://ec2-18-221-5-46.us-east-2.compute.amazonaws.com:5002"
    }
});
io.on("connection", (socket) => {
    console.log("A user connected with socket id", socket.id);
    
    socket.on("disconnect", () => {
      console.log("User disconnected with socket id", socket.id);
    });
  });

const dotenv = require("dotenv");
const path = require("path");
const cookieParser = require('cookie-parser');
const cors = require("cors")

const port = process.env.PORT || 5002;
dotenv.config();

const authRoute = require('./src/Routes/auth.route');
const driverRoute = require('./src/Routes/driver.route');
const bidsRoute = require('./src/Routes/bids.route');
const ridesRoute = require("./src/Routes/rides.route")(server, io);

// Middlewares
app.use(cors())
app.set("io", io);
app.use(cookieParser());
app.use(express.json());
app.use("/images", express.static(path.join(__dirname, "/Images")))

// Routes
app.get('/',(req,res)=>{
    res.json({message: "Working Node JS!"});
});

app.use("/auth", authRoute);
app.use("/driver", driverRoute);
app.use("/bids", bidsRoute);
app.use("/rides", ridesRoute);

// Error Handlers
app.use((req, res, next)=>{
    const err = new Error("Not found");
    err.status = 404;
    next(err);
});

app.use((err, req, res, next)=>{
    if(err.isJoi) err.status = 422;
    res.status(err.status || 500);
    res.send({
        error: {
            status : err.status || 500,
            message : err.message
        }
    });
});

server.listen(port, ()=> {
    console.log(`Server running on port: ${port}`);
});