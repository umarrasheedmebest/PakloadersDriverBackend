const db = require('./../Utilities/config.db');

class Bids {
    driver_id;
    post_id;
    bid_amount;
    is_active;
    created_at;
    updated_at;

    constructor(obj){
        const date = new Date().toISOString().split("T")[0];
        const time = new Date().toLocaleTimeString().split(" ")[0];
        const currDate = date + " " + time;
        this.driver_id = obj.driver_id;
        this.post_id = obj.post_id;
        this.bid_amount = obj.bid_amount;
        this.is_active = obj.is_active || 1;
        this.created_at = obj.created_at || currDate;
        this.updated_at = obj.updated_at || null;
    }
}

Bids.getBids = (result)=> {
    try {
        const query = `SELECT post.id as post_id, post.pickup_address, post.dropoff_address, post.pickup_date, post.pickup_time, post.details, 
            register_user.full_name, register_user.user_image, register_user.id as user_id
            FROM post
            JOIN register_user
            ON post.user_id=register_user.id
            WHERE post.is_active=1`;
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

Bids.getBidDetails = (id, result)=> {
    try {
        const query = `SELECT post.id as post_id, post.pickup_address, post.dropoff_address, post.pickup_date, post.pickup_time, post.details, post.image1, post.image2, 
            post.image3, post.image4, post.image5, register_user.full_name, register_user.user_image, register_user.number, register_user.id as user_id
            FROM post
            JOIN register_user
            ON post.user_id=register_user.id
            WHERE post.id=${id} && post.is_active=1`;
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

Bids.createBid = (data, result)=> {
    try {
        const query = `INSERT INTO bids SET ?`;
        db.query(query, data, (err, sqlresult)=> {
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

module.exports = Bids;