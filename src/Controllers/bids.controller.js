const Bids = require('./../Models/bids.model');
const {sendPushNotification} = require('../Utilities/pushNotifications')
const getBids = async(req, res, next)=> {
    try {
        Bids.getBids((err, response)=> {
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

const getBidDetails = async(req, res, next)=> {
    try {
        const id = req.params.id;
        Bids.getBidDetails(id,(err, response)=> {
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

const createBid = async(req, res, next)=> {
    try {
        const result = new Bids(req.body);
        const body='Sent you a bid proposal'
        Bids.createBid(result, (err, response)=> {
            if(err){
                next(err);
            } else {
                Bids.userDeviceToken(result.post_id,(err,tokenResponse)=> {
            if(err){
            next(err)
            }else{
    Bids.DriverName(result.driver_id,(err,driverName)=>{
        if(err){
            next(err)
        }else{

            const tokens = tokenResponse.map((i) => i.device_token);
            for (let i = 0; i < tokens.length; i++) {
              const token = tokens[i];
              sendPushNotification(token, result.driver_id, driverName[0].full_name, body, async (err, notificationResponse) => {
                if (err) {
                  next(err);
                } else {
                  console.log(`Notification sent to token ${token}:`, notificationResponse);
                  if (i === tokens.length - 1) {
                    // This is the last iteration of the loop, so send the response to the client
                    res.status(200).send({message: "Bid Placed successfully!"});
                  }
                }
              });
            }
        }
    })
}
                })
            }
        })
    } catch (error) {
        next(error);
    }
}

module.exports = {
    getBids,
    getBidDetails,
    createBid
}