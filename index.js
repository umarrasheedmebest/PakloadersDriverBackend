const express = require("express");
const app = express();
const server = require("http").Server(app);
const io = require("socket.io")(server, {
    cors: {
        origin: "*"
    }
});
io.on("connection", (socket) => {
    console.log("A user connected with socket id", socket.id);
    
    socket.on("disconnect", () => {
      console.log("User disconnected with socket id", socket.id);
    });
  });

  // Create a dictionary to store the mapping between rideId and socketId
const rideSocketMap = new Map();

io.on('connection', (socket) => {
  console.log('Socket connection established!');

  socket.on('locationUpdate', (location) => {
    const { longitude, latitude, socketId, rideId } = location;

    // Store the mapping between rideId and socketId
    rideSocketMap.set(rideId, socketId);

    // Create a new event using the same data
    socket.emit('newLocation', { longitude, latitude, socketId, rideId });
  });

  socket.on('disconnectSocket', (rideId) => {
    console.log(`Disconnecting socket for rideId: ${rideId}`);

    // Get the corresponding socketId for the rideId
    const socketId = rideSocketMap.get(rideId);

    if (socketId) {
      const targetSocket = io.sockets.sockets.get(socketId);

      if (targetSocket) {
        targetSocket.disconnect();
        console.log(`Socket ${socketId} disconnected for rideId: ${rideId} and socketId: ${socketId}`);
      } else {
        console.log(`Socket ${socketId} not found for rideId: ${rideId}`);
      }

      // Remove the mapping from the dictionary
      rideSocketMap.delete(rideId);
    } else {
      console.log(`No socket found for rideId: ${rideId}`);
    }
  });

  // Other event listeners and logic
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
const ridesRoute = require("./src/Routes/rides.route")

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