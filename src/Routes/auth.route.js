const router = require("express").Router();
const authController = require("./../Controllers/auth.controller");
const Upload = require('./../Utilities/Upload');

router.post("/signup", authController.signUp);
router.post("/verify-otp", authController.verifyOTP);
router.post("/basic-info", Upload.single("file"), authController.basicInfo);

module.exports = router;