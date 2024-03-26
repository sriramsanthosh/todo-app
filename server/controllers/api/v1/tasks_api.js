const Task = require("../../../models/task");
const JWTconfig = require("../../../config/jwt");

module.exports.create = async (req, res) => {
    try {
        
        const authHeader = req.headers['authorization'];
        // console.log(req.headers);
        console.log("authHeader", authHeader);
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({ message: 'Unauthorized' });
        }
        const token = authHeader.split(' ')[1];

        const decodedToken = await JWTconfig.verifyToken(token);
        if (!decodedToken) {
            return res.status(401).json({ message: 'Invalid token' });
        }

        console.log('Authenticated user:', decodedToken);
        const creation = new Date(decodedToken.iat * 1000);
        const expiration = new Date(decodedToken.exp * 1000);
        console.log('Created:', creation.toLocaleString());
        console.log('Expiration:', expiration.toLocaleString());

        const data = {
            title : req.body.title,
            description: req.body.description,
            due_date: req.body.due_date,
            user_id: decodedToken._id
        }

        const task = await Task.create(data);
        console.log(task);
        res.status(200).json({
            message: "Task Created!",
            task_id: task._id
        });
    }
    catch (err) {
        res.status(500).json({
            error: err,
            message: "Internal server error"
        });
    }
}