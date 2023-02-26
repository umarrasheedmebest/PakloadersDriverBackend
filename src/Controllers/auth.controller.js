const Driver = require('./../Models/drivers.model');
const { signAccessToken, signRefreshToken } = require('./../Utilities/Jwt');
const speakeasy = require('speakeasy');
var https = require("https");
const { signUpSchema, signInSchema } = require('../Utilities/validations')
const { APIKey } = process.env;

const signUp = async (req, res, next) => {
    try {
        const data = await signUpSchema.validateAsync(req.body)
        Driver.FindDriverByNumber(data.number, (err, res1) => {
            if (err) {
                next(err);
            } else {
                if (res1.length === 0) {
                    const secret = speakeasy.generateSecret({ length: 20 });
                    const token = speakeasy.totp({
                        secret: secret.base32,
                        algorithm: 'sha1',
                        encoding: 'base32'
                    });
                    if (token) {
                        const smsPromise = new Promise((resolve, reject) => {

                            var sender = '8586';
                            var options = {
                                host: 'api.veevotech.com',
                                port: 443,
                                path: "/sendsms?hash=" + APIKey + "&receivenum=" + data.number + "&sendernum=" + encodeURIComponent(sender) + "&textmessage=" + encodeURIComponent("Verification OTP for Pakloaders is " + token),
                                method: 'GET',
                                setTimeout: 30000
                            };
                            var req = https.request(options, function (res) {
                                res.setEncoding('utf8');
                                res.on('data', function (chunk) {
                                    if (chunk.includes("ACCEPTED")) {
                                        resolve(true)
                                    } else {
                                        reject(false);
                                    }
                                });

                            });
                            req.on('error', function (e) {
                                reject(e.message)
                            });

                            req.end();

                        });
                        smsPromise.then(() => {
                            res.status(200).send(

                                {
                                    message: "OTP sent to " + data.number + " Please verify your number",

                                    data: data.number,
                                    token: token,
                                    secret: secret

                                }
                            )
                        }).catch((error) => {
                            res.status(401).send(error);
                        });
                    } else {
                        res.status(201).send("Something went wrong. Please try again");

                    }
                } else {
                    res.status(201).send("Driver with this number is already registered.");
                }
            }
        })
    } catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

const verifyOTP = async (req, res, next) => {
    try {
        const secret = req.body.secret;
        const token = req.body.token;
        const userData = {
            number: req.body.number,
            full_name: req.body.full_name
        }
        const verified = speakeasy.totp.verify({
            secret: secret.base32,
            token: token,
            algorithm: 'sha1',
            encoding: 'base32',
            window: 24 * 60 * 60 / 30 // 24 hours in seconds 
        });
        if (verified) {
            const dataObj = new Driver(userData)
            Driver.FindDriverByNumber(dataObj.number, async (err, Response) => {
                if (err) {
                    next(err)
                } else {
                    if (Response.length === 0) {
                        Driver.signUp(dataObj, async (err, response) => {
                            if (err) {
                                next(err)
                            }
                            else {
                                const userId = response.insertId
                                const accessToken = await signAccessToken(userId);
                                res.set({ 'Authorization': `bearer ${accessToken}` });
                                res.status(200).send({ message: "Sign Up Successful", userId: userId, accessToken: `bearer ${accessToken}` });
                            }
                        })
                    } else {
                        res.status(201).send("Number Already Registered")
                    }
                }
            })
        } else {
            res.status(201).send("Number not verified. Try again")
        }
    }
    catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

const login = async (req, res, next) => {
    const { number } = req.body;
    try {
        const data = await signInSchema.validateAsync(req.body)
        const dataObj = new Driver(data)
        Driver.FindDriverByNumber(dataObj.number, async (err, Response) => {
            if (err) {
                next(err)
            }
            else {
                if (Response.length === 0) {
                    res.status(201).send("Number not registered")
                }
                else if(Response[0].is_active === 0){
                    res.status(401).send("Your account is inactive. Please contact support team.")
                  }
                else {
                    const secret = speakeasy.generateSecret({ length: 20 });
                    const token = speakeasy.totp({
                        secret: secret.base32,
                        algorithm: 'sha1',
                        encoding: 'base32'
                    });
                    if (token) {
                        const smsPromise = new Promise((resolve, reject) => {

                            var sender = '8583';
                            var options = {
                                host: 'api.veevotech.com',
                                port: 443,
                                path: "/sendsms?hash=" + APIKey + "&receivenum=" + number + "&sendernum=" + encodeURIComponent(sender) + "&textmessage=" + encodeURIComponent("Verification OTP for Pakloaders is " + token),
                                method: 'GET',
                                setTimeout: 30000
                            };
                            var req = https.request(options, function (res) {
                                res.setEncoding('utf8');
                                res.on('data', function (chunk) {
                                    // console.log(chunk.toString());
                                    if (chunk.includes("ACCEPTED")) {
                                        resolve(true)
                                    } else {
                                        reject(false);
                                    }
                                });
                            });
                            req.on('error', function (e) {
                                reject(e.message)
                            });
                            req.end();
                        });
                        smsPromise.then(() => {
                            res.status(200).send(
                                {
                                    message: "OTP sent to " + number + " Please verify your number",
                                    data: number,
                                    token: token,
                                    secret: secret
                                }
                            )
                        }).catch((error) => {
                            res.status(400).send(error);
                            console.log(error);
                        });
                    } else {
                        res.status(201).send("Something went wrong. Please try again");

                    }
                }
            }
        })
    }
    catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

const loginVerify = async (req, res, next) => {
    try {
        const secret = req.body.secret;
        const token = req.body.token;
        const userData = {
            number: req.body.number,
        }
        const verified = speakeasy.totp.verify({
            secret: secret.base32,
            token: token,
            algorithm: 'sha1',
            encoding: 'base32',
            window: 24 * 60 * 60 / 30 // 24 hours in seconds 
        });
        if (verified) {
            Driver.FindDriverByNumber(userData.number, async (err, response) => {
                if (err) {
                    next(err);
                } else {
                    if (response.length === 0) {
                        res.status(201).send("Number Not Registered")
                    } else {
                        const userId = response[0].id
                        const accessToken = await signAccessToken(userId);
                        res.set({ 'Authorization': `bearer ${accessToken}` });
                        res.status(200).send({ message: "OTP verified successfully", userId: userId, accessToken: `bearer ${accessToken}` });
                    }
                }
            })
        }
    }
    catch (error) {
        res.status(error?.status || 400).send(error?.message || 'Something went wrong!');
    }
}

module.exports = {
    signUp,
    verifyOTP,
    login,
    loginVerify
}