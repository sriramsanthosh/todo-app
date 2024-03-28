const JWTconfig = require('../../../config/jwt');
const Task = require("../../../models/task");

module.exports.authenticateUser = async(req, res)=>{
    try{
        const authHeader = req.headers['authorization'];
        // console.log("authHeader", authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];
        
        const decodedToken = await JWTconfig.verifyToken(token);
        if (!decodedToken) {
            return null;
        }
        
        // console.log('Authenticated user:', decodedToken);
        const creation = new Date(decodedToken.iat * 1000);
        const expiration = new Date(decodedToken.exp * 1000);
        // console.log('Token Created at:', creation.toLocaleString());
        console.log('Login Expires at:', expiration.toLocaleString());
        return decodedToken;
    }
    catch(err){
        return res.status(500).json({
            error: err,
            message: "Internal server error"
        });
    }
}

module.exports.updatePriority = async () => {
    const allTasks = await Task.find({ deletedAt: null, status: { $ne: "DONE" } }).sort({ due_date: 1 });
    for (let index = 0; index < allTasks.length; index++) {
        const taskItem = allTasks[index];
        await Task.findByIdAndUpdate(taskItem._id, { priority: index });
    }
}
