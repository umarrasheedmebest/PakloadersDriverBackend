const Rides = require('./../Models/rides.model');

const startRide = async (req, res, next) => {
    try {
      const rideId = req.params.id;
      const { longitude, latitude } = req.body;
      const io = req.app.get('io');
      Rides.startRide(rideId, (err, response) => {
        if (err) {
          next(err);
        } else {
          res.status(200).send({ message: 'Ride started successfully!' });
        }
      });
    } catch (error) {
      next(error);
    }
  };


const endRide = async(req, res, next)=> {
    try {
        const rideId = req.params.id
        const io = req.app.get("io"); // Retrieve io from the Express app

        Rides.endRide(rideId, (err, response)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send({message: "Ride ended successfully!"});
            }
        })
    } catch (error) {
        next(error);
    }
}
const rideDetails = async(req, res, next)=> {
    try {
        const driverId = req.params.id;
        const status=req.query
        Rides.rideDetails(driverId,status, (err, response)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send(response);
            }
        })
    } catch (error) {
        next(error);
    }
}
module.exports = {
   startRide,
   endRide,
   rideDetails
}