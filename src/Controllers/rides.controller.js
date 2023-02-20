const Rides = require('./../Models/rides.model');
// const io = require('socket.io')();


const startRide = async(req, res, next)=> {
    try {
        const rideId = req.params.id
        const driverId=req.body.driverId
        const location=req.body.location
        Rides.startRide(rideId, (err, response)=> {
            if(err){
                next(err);
            } else {

                // io.emit('driver_location', {driverId:driverId,rideId:rideId,location: {
                //     lat:location.lat,lng:location.lng
                // }});
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

        Rides.endRide(rideId, (err, response)=> {
            if(err){
                next(err);
            } else {
                // io.of(`/${rideId}`).clients((error, clients) => {
                //     if (!error) {
                //         clients.forEach(clientId => {
                //             io.sockets.connected[clientId].disconnect();
                //         });
                //     }
                // });
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