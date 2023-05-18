const db = require('../Utilities/config.db')

class Rides {
    bid_id;
    ride_start_time;
    ride_end_time;
    ongoing;
    upcoming;
    completed;
    cancelled;
    is_active;
    created_at;
    constructor(obj) {
        const date = new Date().toISOString().split("T")[0];
        const time = new Date().toLocaleTimeString().split(" ")[0];
        const currDate = date + " " + time;
        this.bid_id = obj.bid_id;
        this.ride_start_time = obj.ride_start_time;
        this.ride_end_time = obj.ride_end_time;
        this.ongoing = obj.ongoing;
        this.upcoming = obj.upcoming;
        this.completed = obj.completed;
        this.is_active = true;
        this.created_at = obj.created_at || new Date().toISOString().replace("T", " ").split(".")[0];
    }
}

Rides.rideDetails = (driverId,status, result)=> {
    try {
        const query = `SELECT rides.*,post.pickup_address,post.dropoff_address,post.pickup_date,post.pickup_time,
        post.image1,post.image2,bids.bid_amount
        FROM rides
        JOIN bids
        ON rides.bid_id=bids.id
        JOIN post
        ON bids.post_id=post.id
        WHERE bids.driver_id=${driverId} && rides.${Object.values(status)} = 1`;
        db.query(query, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}
Rides.startRide = (rideId, result)=> {
    try {
        const query = `update rides set ongoing = 1 , upcoming = 0 where id = ${rideId}`;
        db.query(query, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}
Rides.endRide = (rideId, result)=> {
    try {
        const query = `update rides set ongoing = 0 , completed = 1 where id = ${rideId}`;
        db.query(query, (err, sqlresult)=> {
            if(err) {
                result(err, undefined);
            } else {
                result(undefined, sqlresult);
            }
        })
    } catch (error) {
        result(error, undefined);
    }
}
module.exports = Rides;
