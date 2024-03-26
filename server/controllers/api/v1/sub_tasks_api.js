const SubTask = require("../../../models/sub_task");

module.exports.create = async(req, res)=>{
    try{
        const {task_id} = req.params;
        const data = {
            task_id : task_id,
            status: false
        }
        const subTask = await SubTask.create(data);
        console.log(subTask);
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

// module.exports.update = async(req, res)=>{
//     try{

//     }
//     catch(err){

//     }
// }

// module.exports.delete = async(req, res)=>{
//     try{

//     }
//     catch(err){

//     }
// }