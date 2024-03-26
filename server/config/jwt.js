const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_SECRET_KEY;

module.exports.createToken = async(payload)=>{
    try{
        console.log("payload", payload);
        const options = { expiresIn: process.env.JWT_EXPIRY_TIME }
        const token = await jwt.sign(payload, secretKey, options);
        return token;
    }
    catch (err){
        console.error("Error creating JWT", err);
        return null;
    }
}

module.exports.verifyToken = async(token)=>{
    try{
        const decoded = await jwt.verify(token, secretKey);
        return decoded;
    }
    catch(err){
        console.error("JWT Verification failed", err.message);
        return null;
    }
}