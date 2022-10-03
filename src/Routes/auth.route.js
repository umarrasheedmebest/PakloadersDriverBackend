const router = require("express").Router();
const authController = require("./../Controllers/auth.controller");

router.post("/signup", authController.signUp);
router.post("/verify-otp", authController.verifyOTP);

module.exports = router;