const router = require("express").Router();
const bidsController = require("./../Controllers/bids.controller");
const { verifyAccessToken } = require("./../Utilities/Jwt");

router.get("/get", bidsController.getBids);
router.get("/details/:id", bidsController.getBidDetails);
router.post("/create", bidsController.createBid);

module.exports = router;