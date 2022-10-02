const { TWILIO_SERVICE_SID, TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } = process.env;
const client = require("twilio")(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, {
    lazyLoading: true
});

const sendOTP = async(req, res, next)=> {
    const { phoneNumber } = req.body;
    try {
        const otpResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verifications.create({
                to: `${phoneNumber}`,
                channel: "sms",
            });
        if(otpResponse){
            res.status(200).send(`OTP sent successfully to ${phoneNumber}!`);
        }
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

const verifyOTP = async(req, res, next)=> {
    const { phoneNumber, otp } = req.body;
    try {
        const verifiedResponse = await client.verify.v2
            .services(TWILIO_SERVICE_SID)
            .verificationChecks.create({
                to: `${phoneNumber}`,
                code: otp,
            });
        if(verifiedResponse) {
            res.status(200).send(`OTP verified successfully!`);
        }
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

module.exports = {
    sendOTP,
    verifyOTP
}