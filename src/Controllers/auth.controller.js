const Driver = require('./../Models/drivers.model');
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
                                res.status(200).send({message: `OTP sent successfully to ${req.body.number}!`, data: response.insertId});
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

const basicInfo = async(req, res, next)=> {
    try {
        res.send("ok")
    } catch (error) {
        next(error);
    }
}

module.exports = {
    signUp,
    verifyOTP,
    basicInfo
}