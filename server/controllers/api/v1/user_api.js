const User = require("../../../models/user");
const JWTconfig = require("../../../config/jwt");

module.exports.create = async(req, res)=>{
    try {
        console.log("Received User Details" , req.body);

        const UserinDB = await User.findOne({phone: req.body.phone});
        console.log("UserinDB", UserinDB);

        if(UserinDB){
            return res.status(403).json({
                message : 'User Already exists ! Please login',
                phone : UserinDB.phone
            });
        }

        const newUser = await User.create(req.body);
        
        res.status(200).json({
            message : 'New user created ! Please Login',
            user_phone: newUser.phone
        });
    }
    catch(err) {
        res.status(500).json({
            message: "User not created",
            error: err,
        });
    }
}

module.exports.login = async(req, res)=>{
    try{
        const UserinDB = await User.findOne({phone: req.body.phone});
        console.log("UserinDB", UserinDB);

        if(UserinDB){
            if(req.body.password !== UserinDB.password){
                return res.status(401).json({
                    message: 'Username or password is incorrect'
                });
            }
            const jwtToken = await JWTconfig.createToken(UserinDB.toJSON());
            console.log("jwtToken", jwtToken);
            return res.status(403).header('Authorization', `Bearer ${jwtToken}`).json({
                message : 'User Already exists ! Got Logged in',
                phone : UserinDB.phone
            });
        }
    }
    catch(err){
        res.status(500).json({
            message: "Internal Sever Error",
            error : err
        })
    }
}