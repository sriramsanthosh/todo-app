const User = require("../../../models/user");
const JWTconfig = require("../../../config/jwt");

module.exports.create = async(req, res)=>{
    try {
        // Finding User phone in DB
        const UserinDB = await User.findOne({phone: req.body.phone});

        // If found in DB => Go to login
        if(UserinDB){
            return res.status(403).json({
                message : 'User Already exists ! Please login',
                phone : UserinDB.phone
            });
        }

        // If not found in DB => Create Account
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
        // Finding User phone in DB
        const UserinDB = await User.findOne({phone: req.body.phone});

        // If User Found => Check for password match => Genetate JWT Token to Header
        if(UserinDB){
            if(req.body.password !== UserinDB.password){
                return res.status(401).json({
                    message: 'Username or password is incorrect'
                });
            }
            const jwtToken = await JWTconfig.createToken(UserinDB.toJSON());
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