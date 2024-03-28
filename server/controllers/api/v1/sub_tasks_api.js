const SubTask = require("../../../models/sub_task");
const Task = require("../../../models/task");

const { authenticateUser, updatePriority } = require("./common_functions");

module.exports.create = async(req, res)=>{
    try{
        // Check for User Session Expiry using JWT
        const decodedToken = await authenticateUser(req, res);
        if(!decodedToken){
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Task ID from req params
        const {task_id} = req.params;

        // Authorizing the user to update
        const currTask = await Task.findById(task_id).populate("user_id");
        if(decodedToken._id !== currTask.user_id.id){
            return res.status(403).json({message: "Access Denied! You can't create subtask under this task!"});
        }

        // Check if Deleted
        if(currTask.deletedAt){
            return res.status(403).json({message: "Access Denied! This task was deleted!"});
        }

        // Sub Task Data
        const data = {
            task_id : task_id,
            status: false,
            createdAt: new Date()
        }
        // Creating SubTask
        const subTask = await SubTask.create(data);
        res.status(200).json({
            message: "Created Subtask",
            subTaskId: subTask._id
        });
    }
    catch(err){
        res.status(500).json({
            message: "SubTask not created",
            error: err,
        });
    }
}

module.exports.all_sub_tasks = async (req, res)=>{
    try{
        // Check for User Session Expiry using JWT
        const decodedToken = await authenticateUser(req, res);
        if(!decodedToken){
            return res.status(401).json({ message: 'Invalid token' });
        }
        
        // Populating Subtask for UserID
        const allSubTasks = await SubTask.find({deletedAt:null}).populate("task_id").populate({
            path: 'task_id',
            populate: {
                path: 'user_id'
            }
        });

        const userSubTasks = [];

        // Filtering user SubTasks from all subtasks
        for(let i = 0; i<allSubTasks.length; i++){
            if(decodedToken._id === allSubTasks[i].task_id.user_id.id){
                console.log(allSubTasks[i].id);
                const curr = await SubTask.findById(allSubTasks[i].id);
                userSubTasks.push(curr);
            }
        }

        res.status(200).json({
            message: "Showing User Subtasks", 
            userSubTasks: userSubTasks
        });
    }
    catch(err){
        return res.status(500).json({
            message: "Internal Server Error!",
            error: err,
        });
    }
}

module.exports.update = async(req, res)=>{
    try{
        // Check for User Session Expiry using JWT
        const decodedToken = await authenticateUser(req, res);
        if(!decodedToken){
            return res.status(401).json({ message: 'Invalid token' });
        }

        // Task ID from the request params
        const {sub_task_id} = req.params;
        
        // Populating subTask for user.id
        const currSubTask = await SubTask.findById(sub_task_id).populate("task_id").populate({
            path: 'task_id',
            populate: {
                path: 'user_id'
            }
        });

        // CurrSubTask UserID
        const user_id = currSubTask.task_id.user_id.id;

        // Authorizing the user to update
        if(user_id !== decodedToken._id){
            return res.status(403).json({message: "Access Denied to update this SubTask!"});
        }

        // Case if deleted
        if(currSubTask.deletedAt){
            return res.status(401).json({
                message: "Can't access! This subtask was deleted!"
            });
        }

        // Toggle the status of subtask to update
        const data = {
            status : !currSubTask.status
        };
        await SubTask.findByIdAndUpdate(sub_task_id, data);
        
        // Side by side updating the status of Task
        let status = "IN PROGRESS";
        const task_id = currSubTask.task_id;
        const pendingSubtasks = await SubTask.find({task_id: task_id, status: 0});
        const finishedSubtasks = await SubTask.find({task_id: task_id, status: 1});
        if(pendingSubtasks.length === 0){status = "DONE"; updatePriority();}
        if(finishedSubtasks.length === 0){status = "TODO"; updatePriority();}
        await Task.findByIdAndUpdate(task_id, {status: status});
        let pendingSubtasksIDs = [];
        for(let i = 0; i<pendingSubtasks.length; i++){
            pendingSubtasksIDs.push(pendingSubtasks[i].id);
        }
        return res.status(200).json({
            message: "Updated SubTask!",
            finishedSubtasks: finishedSubtasks.length,
            pendingSubtasks : pendingSubtasks.length,
            pendingSubtasksIDs: pendingSubtasksIDs
        });
        
    }
    catch(err){
        return res.status(500).json({
            message: "Internal Server Error!",
            error: err,
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

        // Sub Task ID from params
        const {sub_task_id} = req.params;

        // Populating subTask for user.id
        const currSubTask = await SubTask.findById(sub_task_id).populate("task_id").populate({
            path: 'task_id',
            populate: {
                path: 'user_id'
            }
        });

        // CurrSubTask UserID
        const user_id = currSubTask.task_id.user_id.id;

        // Authorizing the user to update
        if(user_id !== decodedToken._id){
            return res.status(403).json({message: "Access Denied to update Task!"});
        }

        // Case if deleted
        if(currSubTask.deletedAt){
            return res.status(401).json({
                message: "Can't access! This subtask was deleted!"
            });
        }

        // Soft Deletion the SubTask
        await SubTask.findOneAndUpdate(sub_task_id, {deletedAt: new Date()});

        // Update priority after deleted
        updatePriority();

        return res.status(200).json({
            message: "Sub-Task soft delete Success!"
        });
    }
    catch(err){
        return res.status(500).json({
            message: "Internal Server Error!",
            error: err,
        });
    }
}