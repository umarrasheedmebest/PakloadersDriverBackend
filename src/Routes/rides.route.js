module.exports = (server, io) => {
    const router = require("express").Router();
    const ridesController = require("./../Controllers/rides.controller");
    const { verifyAccessToken } = require("./../Utilities/Jwt");
  
    // Routes
    router.post("/start/:id", ridesController.startRide);
    router.get("/end/:id", ridesController.endRide);
  
    router.get("/test-socket", (req, res) => {
        const message = "Hello, world!";
        io.on("connection", (socket) => {
          console.log("A user connected!");
          console.log("Socket id: ", socket.id);
          io.emit("test-message", { message, socketId: socket.id });
          io.on("test-message",(mssg)=>{
          })
        });
        res.send("Test message sent!");
      });
      
  
    return router;
  };
  