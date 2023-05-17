const router = require("express").Router();
const ridesController = require("./../Controllers/rides.controller");
const { verifyAccessToken } = require("./../Utilities/Jwt");

router.post("/start/:id", ridesController.startRide);
router.get("/end/:id", ridesController.endRide);

module.exports = router;