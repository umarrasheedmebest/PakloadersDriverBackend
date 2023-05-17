const Rides = require('./../Models/rides.model');

const startRide = async(req, res, next)=> {
    try {
        const rideId = req.params.id;
        const {longitude, latitude} = req.body;
        const io = req.app.get("io"); // Retrieve io from the Express app
        Rides.startRide(rideId, (err, response)=> {
            if(err){
                next(err);
            } else {
                io.on('connection', (socket) => {
                    console.log('Socket connection established!');

                    socket.emit('location', { longitude, latitude, id: io.id, rideId });
                });
                res.status(200).send({message: "Ride started successfully!"});
            }
        })
    } catch (error) {
        next(error);
    }
}
const endRide = async(req, res, next)=> {
    try {
        const rideId = req.params.id
        const io = req.app.get("io"); // Retrieve io from the Express app

        Rides.endRide(rideId, (err, response)=> {
            if(err){
                next(err);
            } else {
                const rideSocketsMap = {};
                io.on('connection', (socket) => {

                    // add socket to the rideSocketsMap
                    if (!rideSocketsMap[rideId]) {
                        rideSocketsMap[rideId] = [];
                    }
                    rideSocketsMap[rideId].push(socket);

                    socket.on('disconnect', () => {
                        console.log('user disconnected');
                        // remove socket from the rideSocketsMap
                        rideSocketsMap[rideId] = rideSocketsMap[rideId].filter((s) => s !== socket);
                    });

                    socket.on('disconnect-ride', () => {
                        // disconnect all sockets associated with the rideId
                        const sockets = rideSocketsMap[rideId];
                        if (sockets) {
                            sockets.forEach((s) => s.disconnect());
                            delete rideSocketsMap[rideId];
                            console.log(`Disconnected ${sockets.length} sockets for ride ${rideId}`);
                        }
                    });
                });
                res.status(200).send({message: "Ride ended successfully!"});
            }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
   startRide,
   endRide
}