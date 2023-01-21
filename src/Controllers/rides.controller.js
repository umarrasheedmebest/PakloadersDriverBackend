const Rides = require('./../Models/rides.model');


const startRide = async(req, res, next)=> {
    try {
        const rideId = req.params.id
        Rides.startRide(rideId, (err, response)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send({message: "Ride started successfully!"});
            }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
   startRide
}