const router = require("express").Router();
const authController = require("./../Controllers/auth.controller");

router.post("/signup", authController.signUp);
router.post("/verify-otp", authController.verifyOTP);
router.post("/login", authController.login);
router.post("/login-verify", authController.loginVerify);

module.exports = router;