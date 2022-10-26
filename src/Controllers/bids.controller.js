const Bids = require('./../Models/bids.model');

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
        Bids.createBid(result, (err, response)=> {
            if(err){
                next(err);
            } else {
                res.status(200).send({message: "Bid Placed successfully!"});
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