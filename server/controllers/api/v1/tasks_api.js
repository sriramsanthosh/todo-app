const SubTask = require("../../../models/sub_task");
const Task = require("../../../models/task");
const { authenticateUser, updatePriority } = require("./common_functions");

module.exports.create = async (req, res) => {
    try {
        // Check for User Session Expiry using JWT
        const decodedToken = await authenticateUser(req, res);
        if(!decodedToken){
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Data from response
        const data = {
            title: req.body.title,
            description: req.body.description,
            due_date: req.body.due_date,
            user_id: decodedToken._id,
            createdAt: new Date()
        }

        // Creating new Task
        const task = await Task.create(data);
        console.log("task created");
        
        // Update Priority order for all tasks as new task got inserted
        await updatePriority();
        console.log("I am here");

        return res.status(200).json({
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


module.exports.update = async (req, res) => {
    try {
        // Check for User Session Expiry using JWT
        const decodedToken = await authenticateUser(req, res);
        if(!decodedToken){
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Task ID from the request params
        const { task_id } = req.params;

        // Authorizing the User to update the task
        const currTask = await Task.findById(task_id).populate('user_id');
        if(currTask.user_id.id !== decodedToken._id){ return res.status(403).json({message: "Access Denied to update Task!"});}

        // If Task got deleted => Deny Access to Update
        if(currTask.deletedAt){ return res.status(403).json({message: "Access Denied to update deleted task"});}

        const updateFields = {};

        // Taking preferred response parameters
        if (req.body.due_date) {updateFields.due_date = req.body.due_date;}
        if (req.body.status) {updateFields.status = req.body.status;}

        // If preferred response to update is null
        if (Object.keys(updateFields).length === 0) {
            return res.status(403).json({ message: "No preferred inputs provided!" });
        }


        updateFields.updatedAt = new Date();

        // Updating the Task by given fields
        await Task.findByIdAndUpdate(task_id, updateFields);

        // There is date change or Task done => Updating Task priorities
        await updatePriority();

        return res.status(200).json({
            message: 'Task updated successfully'
        });

    }
    catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}


module.exports.softDelete = async(req, res)=>{
    try{
        // Check for User Session Expiry using JWT
        const decodedToken = await authenticateUser(req, res);
        if(!decodedToken){
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Task ID from the request params
        const { task_id } = req.params;

        // Authorizing the User to delete the task
        const currTask = await Task.findById(task_id).populate("user_id");
        if(currTask.user_id.id !== decodedToken._id){
            return res.status(403).json({message: "Access Denied! You can't delete this task!"});
        }

        // Soft Deletion of SubTasks
        const currSubTasks = await SubTask.updateMany({task_id: task_id}, {deletedAt: new Date()});
        // Soft Deletion of CurrTask
        const deleteCurrTask = await Task.findByIdAndUpdate(task_id, {deletedAt: new Date()});
        // Update Priority after Deletion
        updatePriority();

        res.status(200).json({
            message: "Task soft deletion success (including subtasks soft deletion)!"
        });
    }
    catch(err){
        res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}

module.exports.all_tasks = async (req, res) => {
    try {
        // Check for User Session Expiry using JWT
        const decodedToken = await authenticateUser(req, res);
        if(!decodedToken){
            return res.status(401).json({ message: 'Invalid token'});
        }

        // User ID from JWT
        const user_id = decodedToken._id;
        // Filtering user tasks from all tasks
        const allTasks = await Task.find({deletedAt: null, user_id: user_id}).sort({ due_date: 1 });
        
        res.status(200).json({
            message: "Showing Tasks of all Users",
            allTasks: allTasks
        });
    }
    catch (err) {
        res.status(500).json({
            message: "Internal server error",
            error: err
        });
    }
}
