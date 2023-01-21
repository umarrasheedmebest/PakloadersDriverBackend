const router = require("express").Router();
const ridesController = require("./../Controllers/rides.controller");
const { verifyAccessToken } = require("./../Utilities/Jwt");

router.get("/start/:id", ridesController.startRide);

module.exports = router;