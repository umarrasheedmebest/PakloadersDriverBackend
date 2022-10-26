const router = require("express").Router();
const bidsController = require("./../Controllers/bids.controller");
const { verifyAccessToken } = require("./../Utilities/Jwt");

router.get("/get", verifyAccessToken, bidsController.getBids);
router.get("/details/:id", verifyAccessToken, bidsController.getBidDetails);
router.post("/create", bidsController.createBid);

module.exports = router;