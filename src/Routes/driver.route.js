const router = require("express").Router();
const driverController = require("./../Controllers/driver.controller");
const {Upload} = require('./../Utilities/Upload');
const { verifyAccessToken } = require("./../Utilities/Jwt");

router.post("/basic-info/:id", Upload.array("image", 5), driverController.basicInfo);
router.post("/liscence-info/:id", Upload.array("image", 2), driverController.driverLiscenceInfo);
router.post("/vehicle-info/:id", Upload.array("image", 2), driverController.addVehicleInfo);
router.get("/get/:id", driverController.getDriverById);
router.put("/update/:id", driverController.updateDriver);
router.delete("/delete/:id", driverController.deleteDriver);

module.exports = router;