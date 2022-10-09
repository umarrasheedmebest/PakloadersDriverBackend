const Driver = require('./../Models/drivers.model');
const { signAccessToken, signRefreshToken } = require('./../Utilities/Jwt');
const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
});

const signUp = async (req, res, next) => {
    try {
        Driver.FindDriverByNumber(req.body.number, (err, res1) => {
            if (err) {
                next(err);
            } else {
                if (res1.length === 0) {
                    const data = new Driver(req.body);
                    Driver.signUp(data, async (err, response) => {
                        if (err) {
                            next(new Error(err));
                        } else {
                            const otpResponse = await client.verify.v2
                                .services(TWILIO_SERVICE_SID)
                                .verifications.create({
                                    to: `${req.body.number}`,
                                    channel: "sms",
                                });
                            if (otpResponse) {
                                res.status(200).send({ message: `OTP sent successfully to ${req.body.number}!`, data: response.insertId });
                            }
                        }
                    });
                } else {
                    next(new Error("Driver with this number is already registered."));
                }
            }
        })
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

const verifyOTP = async (req, res, next) => {
    const { number, otp } = req.body;
    try {
        const verifiedResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `${number}`,
                code: otp,
            });
        if (verifiedResponse) {
            Driver.activeDriver(number, (err, response) => {
                if (err) {
                    next(new Error(err));
                } else {
                    res.status(200).send(`OTP verified successfully!`);
                }
            });
        }
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

const login = async (req, res, next) => {
    try {
        const { number } = req.body;
        Driver.FindDriverByNumber(number, async (err, response1) => {
            if (err) {
                next(err);
            } else {
                if (response1.length !== 0) {
                    const otpResponse = await client.verify.v2
                        .services(TWILIO_SERVICE_SID)
                        .verifications.create({
                            to: `${number}`,
                            channel: "sms",
                        });
                    if (otpResponse) {
                        res.status(200).send({ message: `OTP sent successfully to ${number}!` });
                    }
                } else {
                    next(new Error("Number is not registered with PakLoaders. Please Signup to continue."));
                }
            }
        })
    } catch (error) {
        next(error);
    }
}

const loginVerify = async (req, res, next) => {
    const { number, otp } = req.body;
    try {
        const verifiedResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `${number}`,
                code: otp,
            });
        if (verifiedResponse) {
            Driver.FindDriverByNumber(number, async (err, response)=> {
                if(err) {
                    next(err);
                } else {
                    const driverId = response[0].id.toString();
                    const accessToken = await signAccessToken(driverId);
                    const refreshToken = await signRefreshToken(driverId);
                    res.cookie('accessToken', `bearer ${accessToken}`, {
                        httpOnly: false,
                        path:  '/', 
                        maxAge: 60*60*60*1000
                    });
                    res.status(200).send({message:"OTP Verified Successfully",refreshToken:`bearer ${refreshToken}`});
                }
            })
        }
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

module.exports = {
    signUp,
    verifyOTP,
    login,
    loginVerify
}